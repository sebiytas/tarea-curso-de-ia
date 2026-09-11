/**
 * NINTENDO PERIPHERAL VAULT // CONSOLE-BROWSER.JS
 * Lógica de interacción para la subpágina de catálogo.
 */

import { nintendoData } from './accessories-data.js';

// Lista dura de consolas solicitadas para el grid de botones tácticos
const consolesList = [
  { id: 'nes', name: 'NES / Famicom', year: 1983 },
  { id: 'gb', name: 'Game Boy / GBC', year: 1989 },
  { id: 'snes', name: 'Super Nintendo', year: 1990 },
  { id: 'n64', name: 'Nintendo 64', year: 1996 },
  { id: 'gba', name: 'Game Boy Advance', year: 2001 },
  { id: 'gc', name: 'Nintendo GameCube', year: 2001 },
  { id: 'nds', name: 'Nintendo DS / DSi', year: 2004 },
  { id: 'wii', name: 'Nintendo Wii', year: 2006 },
  { id: '3ds', name: 'Nintendo 3DS', year: 2011 },
  { id: 'wiiu', name: 'Nintendo Wii U', year: 2012 },
  { id: 'switch', name: 'Nintendo Switch', year: 2017 }
];

document.addEventListener('DOMContentLoaded', () => {
  initializeConsoleGrid();
});

/**
 * Renderiza los botones del grid de consolas.
 */
function initializeConsoleGrid() {
  const gridContainer = document.getElementById('console-grid-container');
  if (!gridContainer) return;

  consolesList.forEach(consoleItem => {
    const li = document.createElement('li');
    const button = document.createElement('button');
    
    button.className = 'console-btn';
    button.textContent = `[ ${consoleItem.name} ]`;
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-controls', 'results-display');
    
    // Evento de selección
    button.addEventListener('click', () => {
      // Remover estado activo de todos
      document.querySelectorAll('.console-btn').forEach(btn => {
        btn.setAttribute('aria-expanded', 'false');
      });
      // Activar el clickeado
      button.setAttribute('aria-expanded', 'true');
      
      // Renderizar el catálogo
      renderConsoleAccessories(consoleItem);
    });

    li.appendChild(button);
    gridContainer.appendChild(li);
  });
}

/**
 * Despliega la lista de accesorios esquemática basándose en la consola seleccionada.
 */
function renderConsoleAccessories(consoleInfo) {
  const display = document.getElementById('results-display');
  display.classList.remove('hidden');

  // Buscar coincidencia en la base de datos
  const data = nintendoData.find(c => c.consoleId === consoleInfo.id);

  // Construir cabecera del contenedor
  let html = `
    <div class="results-header">
      <h3 style="margin: 0; font-size: 1.8rem;">${consoleInfo.name}</h3>
      <span class="results-year" style="font-weight: 700;">Estreno: ${consoleInfo.year}</span>
    </div>
  `;

  // Construir listado de accesorios si existen
  if (data && data.accessories && data.accessories.length > 0) {
    html += '<ul class="compact-list" style="padding-left: 0;">';
    
    data.accessories.forEach(acc => {
      html += `
        <li class="compact-item">
          <div class="compact-info">
            <span class="compact-name">${acc.name}</span>
            <span class="compact-type">${acc.type} | Lanzamiento: ${acc.year}</span>
          </div>
          <a href="index.html#${acc.id}" class="btn-link" aria-label="Ver informe detallado en la cronología de ${acc.name}">
            Ver informe en la historia completa
          </a>
        </li>
      `;
    });
    
    html += '</ul>';
  } else {
    html += `
      <div style="padding: 1rem; background-color: rgba(0,0,0,0.2); border-left: 4px solid var(--text-accent-yellow);">
        <p style="color: #FFF; font-family: var(--font-body); font-weight: 600; margin: 0;">
          No hay accesorios registrados en el archivo para esta consola de momento.
        </p>
      </div>
    `;
  }

  display.innerHTML = html;
}
