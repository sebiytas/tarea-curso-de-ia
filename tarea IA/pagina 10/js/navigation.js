/**
 * NAVIGATION.JS
 * Control del menú de navegación lateral/superior estilizado como archivador de fichas/carpetas.
 * Inyecta el header y el footer globales en todas las páginas.
 */

class VaultNavigation {
  constructor() {
    this.pages = [
      { id: 'index', title: '01 // MANIFIESTO & ALMACÉN', url: 'index.html' },
      { id: 'catalogo', title: '02 // CATÁLOGO DE TÍTULOS', url: 'catalogo-archivo.html' },
      { id: 'subir', title: '03 // DEPOSITAR VIDEOJUEGO', url: 'subir-juego.html' },
      { id: 'redes', title: '04 // REDES & COMUNIDAD', url: 'redes-comunidad.html' }
    ];
  }

  init() {
    this.injectHeader();
    this.injectFooter();
    this.markCurrentPage();
  }

  injectHeader() {
    const headerHTML = `
      <header class="vault-header" role="banner">
        <div class="vault-header__inner">
          <div class="vault-logo">
            <svg class="vault-logo__icon" viewBox="0 0 24 24" aria-hidden="true">
              <!-- Icono de disco/cartucho estilizado -->
              <path d="M2 12a10 10 0 0 1 10-10h2a10 10 0 0 1 10 10v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M9 22v-4h6v4"></path>
            </svg>
            <h1 class="vault-logo__text">DIGITAL VAULT <span>//</span> PRESERVATION REPOSITORY</h1>
          </div>
          <div class="vault-status" aria-live="polite">
            <span class="vault-status__dot"></span>
            <span>[STATUS: ARCHIVO ACTIVO Y ACCESIBLE]</span>
          </div>
        </div>
        <nav class="vault-nav" role="navigation" aria-label="Navegación principal">
          <ul class="vault-nav__list">
            ${this.pages.map(page => `
              <li class="vault-nav__item">
                <a href="${page.url}" class="vault-nav__link" data-id="${page.id}">
                  [ ${page.title} ]
                </a>
              </li>
            `).join('')}
          </ul>
        </nav>
      </header>
    `;
    document.body.insertAdjacentHTML('afterbegin', headerHTML);
  }

  injectFooter() {
    const footerHTML = `
      <footer class="vault-footer" role="contentinfo">
        <div class="vault-footer__inner">
          <div class="vault-footer__links">
            <a href="index.html">[ MANIFIESTO ]</a>
            <a href="catalogo-archivo.html">[ CATÁLOGO ]</a>
            <a href="subir-juego.html">[ DEPOSITAR ]</a>
            <a href="redes-comunidad.html">[ COMUNIDAD ]</a>
          </div>
          <div class="vault-footer__copy">
            <p>>_ DIGITAL VAULT // ARCHIVO DE PRESERVACIÓN DE VIDEOJUEGOS COMUNITARIO. SOFTWARE LIBRE Y ACCESIBLE.</p>
          </div>
        </div>
      </footer>
    `;
    document.body.insertAdjacentHTML('beforeend', footerHTML);
  }

  markCurrentPage() {
    const currentPath = window.location.pathname;
    const links = document.querySelectorAll('.vault-nav__link');
    
    links.forEach(link => {
      const href = link.getAttribute('href');
      // Coincidencia exacta o parcial al final (para github pages o carpetas locales)
      if (currentPath.endsWith(href) || (currentPath.endsWith('/') && href === 'index.html')) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }
}

// Inicializar navegación al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
  const nav = new VaultNavigation();
  nav.init();
});
