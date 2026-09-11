/**
 * NINTENDO PERIPHERAL VAULT // MAIN.JS
 * Lógica transversal de navegación, control de menú y accesibilidad.
 */

document.addEventListener('DOMContentLoaded', () => {
  renderGlobalHeader();
});

/**
 * Inyecta el encabezado global y la navegación en la página actual,
 * estableciendo el enlace activo según la URL.
 */
function renderGlobalHeader() {
  const headerContainer = document.getElementById('global-header-container');
  if (!headerContainer) return;

  const currentPath = window.location.pathname;
  const isCatalog = currentPath.includes('consolas-catalogo.html');

  const headerHTML = `
    <header class="global-header">
      <a href="index.html" class="brand-logo" aria-label="Inicio - Nintendo Accessory Archive">
        <h1>NINTENDO // ACCESSORY ARCHIVE</h1>
      </a>
      <nav class="main-nav" aria-label="Navegación Principal">
        <ul>
          <li>
            <a href="index.html" 
               class="nav-link ${!isCatalog ? 'active' : ''}" 
               ${!isCatalog ? 'aria-current="page"' : ''}>
              Línea de Tiempo & Informe Detallado
            </a>
          </li>
          <li>
            <a href="consolas-catalogo.html" 
               class="nav-link ${isCatalog ? 'active' : ''}" 
               ${isCatalog ? 'aria-current="page"' : ''}>
              Buscador de Consolas & Accesorios
            </a>
          </li>
        </ul>
      </nav>
    </header>
  `;

  headerContainer.innerHTML = headerHTML;
}
