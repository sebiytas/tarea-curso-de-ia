/**
 * VAULT2000 - STORAGE ENGINE & DASHBOARD CONTROLLER
 * Capa de persistencia en localStorage, cálculo de estadísticas y renderizado de la UI.
 */

const DB_KEY = 'vault2000_db';

const StorageEngine = {
  // Inicializar DB con datos de ejemplo si está vacía (para evitar vista en blanco total)
  // Pero según directrices: "Prohibido terminantemente el uso de datos simulados incompletos."
  // Así que iniciamos vacío estrictamente.
  init() {
    if (!localStorage.getItem(DB_KEY)) {
      localStorage.setItem(DB_KEY, JSON.stringify([]));
    }
  },

  getGames() {
    this.init();
    try {
      return JSON.parse(localStorage.getItem(DB_KEY)) || [];
    } catch (e) {
      console.error("Error leyendo LOCAL_DB:", e);
      return [];
    }
  },

  saveGame(game) {
    const games = this.getGames();
    game.id = game.id || Date.now().toString();
    games.push(game);
    localStorage.setItem(DB_KEY, JSON.stringify(games));
  },

  updateGameStatus(id, newStatus) {
    const games = this.getGames();
    const index = games.findIndex(g => g.id === id);
    if (index !== -1) {
      games[index].status = newStatus;
      localStorage.setItem(DB_KEY, JSON.stringify(games));
    }
  },

  deleteGame(id) {
    let games = this.getGames();
    games = games.filter(g => g.id !== id);
    localStorage.setItem(DB_KEY, JSON.stringify(games));
  },

  getStats() {
    const games = this.getGames();
    const total = games.length;
    const playing = games.filter(g => g.status === 'playing').length;
    const cleared = games.filter(g => g.status === 'cleared').length;
    const backlog = games.filter(g => g.status === 'backlog').length;
    const percentage = total === 0 ? 0 : Math.round((cleared / total) * 100);

    return { total, playing, cleared, backlog, percentage };
  },
  
  categorizePlatform(platformName) {
    const mobile = ['Android', 'iOS', 'Mobile'];
    const pc = ['PC', 'Windows', 'Linux'];
    const ps = ['PS1', 'PS2', 'PS3', 'PS4', 'PS5', 'PSP', 'PS Vita', 'PlayStation'];
    const ds = ['Nintendo DS', '3DS', 'NDS'];

    if (mobile.includes(platformName)) return 'MOBILE CORE';
    if (pc.includes(platformName)) return 'PC STATION';
    if (ps.includes(platformName)) return 'PLAYSTATION VAULT';
    if (ds.includes(platformName)) return 'DUAL SCREEN ARCHIVE';
    return 'OTHER';
  }
};

const DashboardController = {
  currentTab: 'ALL',

  init() {
    StorageEngine.init();
    
    // Si estamos en la página del dashboard (index.html)
    if (document.getElementById('games-grid')) {
      this.bindEvents();
      this.render();
    }
  },

  bindEvents() {
    // Pestañas de filtrado
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        tabs.forEach(t => {
          t.classList.remove('active');
          t.style.background = 'transparent';
        });
        e.target.classList.add('active');
        e.target.style.background = 'var(--bg-panel)';
        
        this.currentTab = e.target.getAttribute('data-target');
        this.renderGrid();
      });
    });
    
    // Delegación de eventos para botones de estado (Fase 2 / Fase 3)
    const grid = document.getElementById('games-grid');
    grid.addEventListener('click', (e) => {
      const target = e.target;
      
      // Botones de cambio de estado
      if (target.classList.contains('btn-status')) {
        const id = target.getAttribute('data-id');
        const newStatus = target.getAttribute('data-status');
        StorageEngine.updateGameStatus(id, newStatus);
        this.render(); // Re-renderizar métricas y grid
      }
      
      // Botón de eliminar
      if (target.classList.contains('btn-delete')) {
        const id = target.getAttribute('data-id');
        if (confirm('SISTEMA: ¿Confirmar purga de datos del registro?')) {
          StorageEngine.deleteGame(id);
          this.render();
        }
      }
    });
  },

  render() {
    this.renderMetrics();
    this.renderGrid();
  },

  renderMetrics() {
    const stats = StorageEngine.getStats();
    
    document.getElementById('metric-total').textContent = stats.total.toString().padStart(3, '0');
    document.getElementById('metric-playing').textContent = stats.playing.toString().padStart(3, '0');
    document.getElementById('metric-cleared').textContent = stats.cleared.toString().padStart(3, '0');
    document.getElementById('metric-percentage').textContent = `${stats.percentage}%`;

    // Renderizar barra de progreso segmentada
    const barContainer = document.getElementById('progress-bar-segments');
    barContainer.innerHTML = '';
    
    const totalSegments = 20; // 20 bloques visuales
    const filledSegments = Math.floor((stats.percentage / 100) * totalSegments);
    
    for (let i = 0; i < totalSegments; i++) {
      const segment = document.createElement('div');
      segment.style.flex = '1';
      segment.style.borderRight = '1px solid var(--border-shadow)';
      
      if (i < filledSegments) {
        segment.style.backgroundColor = 'var(--status-cleared)';
      }
      
      barContainer.appendChild(segment);
    }

    // Lógica del Neural Randomizer (Visibilidad)
    const randomizerModule = document.getElementById('randomizer-module');
    if (stats.playing === 0 && stats.total > 0) {
      randomizerModule.style.display = 'block';
    } else {
      randomizerModule.style.display = 'none';
      const resultDiv = document.getElementById('randomizer-result');
      if(resultDiv) resultDiv.style.display = 'none';
    }
  },

  renderGrid() {
    const grid = document.getElementById('games-grid');
    const games = StorageEngine.getGames();
    
    grid.innerHTML = '';

    const filteredGames = this.currentTab === 'ALL' 
      ? games 
      : games.filter(g => StorageEngine.categorizePlatform(g.platform) === this.currentTab);

    if (filteredGames.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; padding: var(--spacing-xl); text-align: center; border: 1px dashed var(--border-highlight);">
          <span style="color: var(--text-muted); font-family: var(--font-display); font-size: 1.5rem;">[ ERROR 404: NO SE ENCONTRARON REGISTROS EN ESTA PARTICIÓN ]</span>
        </div>
      `;
      return;
    }

    filteredGames.forEach(game => {
      const card = document.createElement('article');
      card.className = 'game-card y2k-window';
      card.style.marginBottom = '0';
      
      let statusColor = 'var(--text-muted)';
      let statusText = 'DESCONOCIDO';
      
      if (game.status === 'backlog') { statusColor = 'var(--status-backlog)'; statusText = 'NO EMPEZADO'; }
      if (game.status === 'playing') { statusColor = 'var(--status-playing)'; statusText = 'EN PROGRESO'; }
      if (game.status === 'cleared') { statusColor = 'var(--status-cleared)'; statusText = 'COMPLETADO'; }

      card.innerHTML = `
        <div class="y2k-window-header" style="border-bottom-color: ${statusColor};">
          <h3 style="margin: 0; font-size: 1.1rem; text-overflow: ellipsis; overflow: hidden; white-space: nowrap; max-width: 80%;">${game.title}</h3>
          <span style="color: ${statusColor}; font-size: 0.9rem;">[${statusText}]</span>
        </div>
        <div class="y2k-window-content" style="background: var(--bg-main);">
          <div style="font-family: var(--font-display); font-size: 1.1rem; margin-bottom: var(--spacing-sm);">
            <div><span style="color: var(--accent-cyan);">PLTF:</span> ${game.platform}</div>
            <div><span style="color: var(--accent-cyan);">GNR:</span> ${game.genre}</div>
            <div><span style="color: var(--accent-cyan);">DUR:</span> ${game.duration}</div>
          </div>
          
          <div style="height: 4px; width: 100%; background: var(--bg-panel); margin: var(--spacing-md) 0;">
             <div style="height: 100%; width: ${game.status === 'cleared' ? '100%' : (game.status === 'playing' ? '50%' : '0%')}; background: ${statusColor};"></div>
          </div>

          <div class="action-buttons" style="display: flex; gap: var(--spacing-xs); flex-direction: column;">
            <div style="display: flex; gap: var(--spacing-xs);">
              <button class="y2k-button btn-status" data-id="${game.id}" data-status="backlog" style="flex: 1; font-size: 0.9rem; padding: 4px; ${game.status === 'backlog' ? 'background: var(--status-backlog); color: var(--bg-main); border-color: #FFF;' : ''}">PEND</button>
              <button class="y2k-button btn-status" data-id="${game.id}" data-status="playing" style="flex: 1; font-size: 0.9rem; padding: 4px; ${game.status === 'playing' ? 'background: var(--status-playing); color: var(--bg-main); border-color: #FFF;' : ''}">ACTV</button>
              <button class="y2k-button btn-status" data-id="${game.id}" data-status="cleared" style="flex: 1; font-size: 0.9rem; padding: 4px; ${game.status === 'cleared' ? 'background: var(--status-cleared); color: var(--bg-main); border-color: #FFF;' : ''}">COMP</button>
            </div>
            <button class="y2k-button btn-delete" data-id="${game.id}" style="width: 100%; font-size: 0.9rem; padding: 4px; margin-top: 4px; border-color: var(--status-backlog); color: var(--status-backlog); background: transparent;">[ PURGAR REGISTRO ]</button>
          </div>
        </div>
      `;
      grid.appendChild(card);
    });
  }
};

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  DashboardController.init();
});
