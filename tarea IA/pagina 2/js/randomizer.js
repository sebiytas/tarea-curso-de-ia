/**
 * VAULT2000 - NEURAL RANDOMIZER ENGINE
 * Motor de selección aleatoria. Activa alertas si no hay juegos en progreso.
 */

document.addEventListener('DOMContentLoaded', () => {
  const btnRunRandomizer = document.getElementById('btn-run-randomizer');
  const randomizerResult = document.getElementById('randomizer-result');
  
  if (!btnRunRandomizer || !randomizerResult) return;

  btnRunRandomizer.addEventListener('click', () => {
    const games = StorageEngine.getGames();
    
    // Filtrar juegos no empezados
    let pool = games.filter(g => g.status === 'backlog');
    
    // Si no hay juegos no empezados, elegir al azar de toda la colección
    if (pool.length === 0) {
      pool = games;
    }

    if (pool.length === 0) {
      randomizerResult.style.display = 'block';
      randomizerResult.innerHTML = `
        <div style="background: var(--bg-main); padding: var(--spacing-md); border: 2px dashed var(--status-backlog); color: var(--status-backlog); font-family: var(--font-display); font-size: 1.2rem;">
          [ ERROR: NO HAY DATOS SUFICIENTES EN LA DB PARA EJECUTAR EL ALGORITMO ]
        </div>
      `;
      return;
    }

    // Efecto visual estilo "calculando" (simulación rápida)
    btnRunRandomizer.disabled = true;
    btnRunRandomizer.textContent = 'PROCESANDO RED NEURAL...';
    btnRunRandomizer.style.background = 'var(--bg-panel)';
    btnRunRandomizer.style.color = 'var(--text-muted)';
    randomizerResult.style.display = 'none';

    setTimeout(() => {
      // Selección Aleatoria Real
      const randomIndex = Math.floor(Math.random() * pool.length);
      const selectedGame = pool[randomIndex];

      randomizerResult.style.display = 'block';
      randomizerResult.innerHTML = `
        <div class="y2k-window" style="margin: 0 auto; max-width: 500px; text-align: left; box-shadow: 0 0 20px rgba(0, 240, 255, 0.4);">
          <div class="y2k-window-header" style="background: var(--status-playing); color: var(--bg-main);">
            <h3>RESULTADO ÓPTIMO ENCONTRADO</h3>
            <span>[MATCH_FOUND]</span>
          </div>
          <div class="y2k-window-content" style="background: var(--bg-main);">
            <div style="font-family: var(--font-display); font-size: 2rem; color: var(--status-playing); margin-bottom: var(--spacing-xs); word-break: break-all;">
              > ${selectedGame.title}
            </div>
            <div style="font-family: var(--font-display); color: var(--text-main); font-size: 1.2rem; margin-bottom: var(--spacing-md);">
              [PLTF]: ${selectedGame.platform} <br>
              [GNR]: ${selectedGame.genre}
            </div>
            
            <button class="y2k-button primary btn-start-random" data-id="${selectedGame.id}" style="width: 100%;">
              INICIALIZAR JUEGO (PASAR A "EN PROGRESO")
            </button>
          </div>
        </div>
      `;

      // Evento para el botón de iniciar juego
      const btnStart = randomizerResult.querySelector('.btn-start-random');
      btnStart.addEventListener('click', (e) => {
        const id = e.target.getAttribute('data-id');
        StorageEngine.updateGameStatus(id, 'playing');
        
        // Recargar la interfaz llamando a render del DashboardController
        if (typeof DashboardController !== 'undefined') {
          DashboardController.render();
        }
      });

      // Restaurar el botón original
      btnRunRandomizer.disabled = false;
      btnRunRandomizer.textContent = 'EJECUTAR SELECCIÓN ALEATORIA';
      btnRunRandomizer.style.background = '';
      btnRunRandomizer.style.color = '';
    }, 800); // 800ms de retraso artificial retro
  });
});
