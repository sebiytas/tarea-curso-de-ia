/**
 * NINTENDO PERIPHERAL VAULT // TIMELINE-ENGINE.JS
 * Motor de renderizado dinámico y filtrado de la cronología.
 */

import { nintendoData } from './accessories-data.js';

document.addEventListener('DOMContentLoaded', () => {
  renderTimeline(nintendoData);
  setupSearchEngine();
});

/**
 * Renderiza la línea de tiempo completa o filtrada basada en los datos suministrados.
 * @param {Array} data - El array de eras/consolas a procesar.
 */
export function renderTimeline(data) {
  const container = document.getElementById('timeline-container');
  if (!container) return;

  container.innerHTML = ''; // Limpiar estado anterior

  if (data.length === 0) {
    container.innerHTML = `<div class="nintendo-box" style="margin-top: 2rem;">
      <p style="color: var(--text-accent-yellow);">No se encontraron accesorios o consolas que coincidan con la búsqueda.</p>
    </div>`;
    return;
  }

  // Iterar por cada era/consola
  data.forEach(era => {
    // Marcador de Era
    const eraMarker = document.createElement('h3');
    eraMarker.className = 'era-marker';
    eraMarker.textContent = `Era ${era.consoleName} (${era.year})`;
    
    // Contenedor interno de tarjetas para estructurar semánticamente
    const eraContainer = document.createElement('div');
    eraContainer.className = 'era-group';
    eraContainer.appendChild(eraMarker);

    // Iterar por cada accesorio y generar su ficha
    era.accessories.forEach(acc => {
      const card = document.createElement('article');
      card.className = 'accessory-card';
      card.id = acc.id;

      let gamesHTML = '';
      if (acc.games && acc.games.length > 0) {
        const listItems = acc.games.map(game => `<li>${game}</li>`).join('');
        gamesHTML = `
          <ul class="games-list">
            ${listItems}
          </ul>
        `;
      }

      card.innerHTML = `
        <h4 class="accessory-title">${acc.name}</h4>
        <span class="tech-data">Año: ${acc.year} | Tipo: ${acc.type}</span>
        <span class="tech-data" style="color: #FFF;">Hardware: ${acc.technicalData}</span>
        <p style="margin-top: 1rem; margin-bottom: 1rem;">${acc.description}</p>
        <span class="tech-data">Juegos Compatibles Clave:</span>
        ${gamesHTML}
      `;
      
      eraContainer.appendChild(card);
    });

    container.appendChild(eraContainer);
  });
}

/**
 * Configura el escuchador del input de búsqueda en tiempo real.
 */
function setupSearchEngine() {
  const searchInput = document.getElementById('timeline-search');
  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    
    if (query === '') {
      renderTimeline(nintendoData);
      return;
    }

    const filteredData = [];

    nintendoData.forEach(era => {
      // Filtrar accesorios que hagan match (por nombre, descripción, consola, tipo)
      const matchingAccessories = era.accessories.filter(acc => {
        return acc.name.toLowerCase().includes(query) ||
               acc.description.toLowerCase().includes(query) ||
               acc.type.toLowerCase().includes(query) ||
               acc.year.toString().includes(query) ||
               era.consoleName.toLowerCase().includes(query);
      });

      // Si la consola misma hace match por año o nombre, traer todos sus accesorios
      const eraMatches = era.consoleName.toLowerCase().includes(query) || era.year.toString().includes(query);

      if (eraMatches) {
        filteredData.push(era);
      } else if (matchingAccessories.length > 0) {
        // Clonamos la era pero solo con los accesorios que hicieron match
        filteredData.push({
          ...era,
          accessories: matchingAccessories
        });
      }
    });

    renderTimeline(filteredData);
  });
}
