/**
 * CATALOG-ENGINE.JS
 * Motor de búsqueda y filtrado en tiempo real.
 * Renderizado dinámico de tarjetas, gestión del modal de inspección y generación de descarga simulada.
 */

class CatalogEngine {
  constructor() {
    this.games = window.vaultStorage.getGames();
    
    // DOM Elements
    this.grid = document.getElementById('catalog-grid');
    this.searchInput = document.getElementById('search-input');
    this.platformSelect = document.getElementById('platform-select');
    this.announcer = document.getElementById('filter-announcer');
    
    // Modal Elements
    this.modalOverlay = document.getElementById('details-modal');
    this.modalClose = document.querySelector('.vault-modal__close');
    this.modalDownloadBtn = document.getElementById('modal-download-btn');
    this.currentModalGame = null;

    this.init();
  }

  init() {
    this.bindEvents();
    this.renderGrid(this.games);
  }

  bindEvents() {
    // Search and Filter Events
    this.searchInput.addEventListener('input', () => this.filterCatalog());
    this.platformSelect.addEventListener('change', () => this.filterCatalog());
    
    // Modal Close Events
    this.modalClose.addEventListener('click', () => this.closeModal());
    this.modalOverlay.addEventListener('click', (e) => {
      if (e.target === this.modalOverlay) this.closeModal();
    });
    
    // Escape key for modal
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modalOverlay.classList.contains('active')) {
        this.closeModal();
      }
    });

    // Download Button Event
    this.modalDownloadBtn.addEventListener('click', () => this.triggerDownload());
  }

  filterCatalog() {
    const query = this.searchInput.value.toLowerCase().trim();
    const platform = this.platformSelect.value;

    const filtered = this.games.filter(game => {
      // Búsqueda por texto (título, autor o descripción)
      const matchText = game.title.toLowerCase().includes(query) || 
                        game.author.toLowerCase().includes(query) ||
                        game.description.toLowerCase().includes(query);
      
      // Filtro por plataforma (Coincidencia exacta o parcial)
      let matchPlatform = true;
      if (platform !== 'all') {
        if (platform === 'other') {
          // Si elige "Other", excluye las comunes (simplificación)
          matchPlatform = !['PC (MS-DOS / Windows 95)', 'Game Boy Advance', 'PlayStation 1 (PSX)'].includes(game.platform);
        } else {
          // Si el texto incluye parte de la plataforma
          matchPlatform = game.platform.toLowerCase().includes(platform.toLowerCase().split(' ')[0]);
        }
      }

      return matchText && matchPlatform;
    });

    this.renderGrid(filtered);
    this.updateAnnouncer(filtered.length);
  }

  updateAnnouncer(count) {
    if (this.announcer) {
      this.announcer.textContent = `Mostrando ${count} títulos en el catálogo.`;
    }
  }

  renderGrid(gamesArray) {
    this.grid.innerHTML = '';

    if (gamesArray.length === 0) {
      this.grid.innerHTML = `
        <div class="empty-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--border-warehouse)" stroke-width="1.5" style="margin-bottom: 1rem;">
            <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-11v6h2v-6h-2zm0-4v2h2V7h-2z"/>
          </svg>
          <p>No se encontraron registros que coincidan con la búsqueda actual en el archivo.</p>
        </div>
      `;
      return;
    }

    gamesArray.forEach(game => {
      const card = document.createElement('article');
      card.className = 'vault-card';
      
      const isDemoBadge = game.isDemo ? `<span class="demo-badge">[REGISTRO DE PRUEBA / VIDEOJUEGO SIMULADO]</span>` : '';
      const serialNumber = game.id.toUpperCase().substring(0, 15);

      card.innerHTML = `
        <span class="vault-card__serial">S/N: ${serialNumber}</span>
        <img src="${game.coverBase64}" alt="Portada de ${game.title}" class="vault-card__img" loading="lazy">
        <div class="vault-card__body">
          <div class="vault-card__platform">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="2" y="6" width="20" height="12" rx="2" ry="2"></rect>
              <circle cx="12" cy="12" r="2"></circle>
              <path d="M6 12h.01M18 12h.01"></path>
            </svg>
            ${game.platform}
          </div>
          <h3 class="vault-card__title">${game.title}</h3>
          <p class="vault-card__author">Autor: ${game.author}</p>
          <p class="vault-card__year">Año: ${game.year}</p>
          ${isDemoBadge}
          <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1rem; flex: 1;">
            ${game.description.length > 120 ? game.description.substring(0, 120) + '...' : game.description}
          </p>
          <div class="vault-card__actions">
            <button class="vault-btn vault-btn--full download-direct-btn" data-id="${game.id}">
              💾 DESCARGAR PAQUETE
            </button>
            <button class="vault-btn vault-btn--secondary vault-btn--full inspect-btn" data-id="${game.id}">
              🔍 VER FICHA DE ARCHIVO
            </button>
          </div>
        </div>
      `;
      
      // Delegation events
      card.querySelector('.inspect-btn').addEventListener('click', () => this.openModal(game));
      card.querySelector('.download-direct-btn').addEventListener('click', () => {
        this.currentModalGame = game;
        this.triggerDownload();
      });

      this.grid.appendChild(card);
    });
  }

  openModal(game) {
    this.currentModalGame = game;
    document.getElementById('modal-img').src = game.coverBase64;
    document.getElementById('modal-img').alt = `Carátula de ${game.title}`;
    
    let titleHtml = game.title;
    if (game.isDemo) {
      titleHtml += ` <br><span class="demo-badge" style="font-size:0.6rem; margin-top:5px;">[REGISTRO DE PRUEBA / SIMULADO]</span>`;
    }
    
    document.getElementById('modal-game-title').innerHTML = titleHtml;
    document.getElementById('modal-game-author').textContent = game.author;
    document.getElementById('modal-game-platform').textContent = game.platform;
    document.getElementById('modal-game-year').textContent = game.year;
    document.getElementById('modal-game-desc').textContent = game.description;
    
    // Parse links text to clickable if possible, or just raw text
    const linksText = game.links || 'Ninguno';
    document.getElementById('modal-game-links').textContent = linksText;

    this.modalOverlay.classList.add('active');
    // Set focus to close button for accessibility
    this.modalClose.focus();
  }

  closeModal() {
    this.modalOverlay.classList.remove('active');
    this.currentModalGame = null;
  }

  triggerDownload() {
    if (!this.currentModalGame) return;
    
    const game = this.currentModalGame;
    
    // Simulate generation process visual feedback
    const btnTextOriginal = this.modalDownloadBtn.innerHTML;
    this.modalDownloadBtn.innerHTML = 'GENERANDO PAQUETE...';
    this.modalDownloadBtn.style.opacity = '0.7';
    this.modalDownloadBtn.disabled = true;

    // Simulate network/zip generation delay
    setTimeout(() => {
      // Crear contenido del archivo simulado usando Blob API nativo
      const manifestContent = `
===================================================
DIGITAL VAULT // ARCHIVO DE PRESERVACIÓN DE VIDEOJUEGOS
===================================================
MANIFIESTO DE PAQUETE DIGITAL (SIMULACIÓN DE DESCARGA)

[ DATOS DEL REGISTRO ]
ID Único: ${game.id}
Fecha de Extracción: ${new Date().toISOString()}

[ FICHA TÉCNICA ]
Título: ${game.title}
Autor/Estudio: ${game.author}
Plataforma: ${game.platform}
Año Original: ${game.year}

[ SINOPSIS HISTÓRICA ]
${game.description}

[ ENLACES DEL CREADOR ]
${game.links || 'No proporcionado'}

===================================================
AVISO LEGAL:
Este paquete es un simulacro generado nativamente en el navegador. 
El archivo real (${game.title.replace(/\\s+/g, '_')}.zip) residiría en este empaque.
===================================================`;

      const blob = new Blob([manifestContent], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `VAULT_${game.id}_Manifest.txt`;
      
      document.body.appendChild(a);
      a.click();
      
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      // Update global metrics download count
      window.vaultStorage.recordDownload();

      // Reset button
      this.modalDownloadBtn.innerHTML = '✅ DESCARGA COMPLETADA';
      this.modalDownloadBtn.style.opacity = '1';
      
      setTimeout(() => {
        this.modalDownloadBtn.innerHTML = btnTextOriginal;
        this.modalDownloadBtn.disabled = false;
      }, 2000);
      
    }, 800); // 800ms simulation
  }
}

// Inicializar el motor al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('catalog-grid')) {
    window.catalogEngine = new CatalogEngine();
  }
});
