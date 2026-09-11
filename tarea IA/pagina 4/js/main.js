/**
 * js/main.js
 * Lógica compartida, navegación persistente, control de accesibilidad
 * e inyección del Header y Footer global.
 */

class HyrulePortal {
    constructor() {
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.injectHeader();
            this.injectFooter();
            this.setupKeyboardNavigation();
            this.highlightCurrentPage();
        });
    }

    getSVGEmblem() {
        return `
            <svg class="brand-emblem" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <!-- Trifuerza Central -->
                <polygon points="50,10 80,60 20,60" fill="none" stroke="currentColor" stroke-width="4"/>
                <polygon points="50,10 65,35 35,35" fill="currentColor" />
                <polygon points="35,35 50,60 20,60" fill="currentColor" />
                <polygon points="65,35 80,60 50,60" fill="currentColor" />
                <!-- Alas Hylianas Simplificadas -->
                <path d="M10,50 Q20,30 40,40 Q20,45 15,65 Z" fill="currentColor" />
                <path d="M90,50 Q80,30 60,40 Q80,45 85,65 Z" fill="currentColor" />
                <!-- Garras inferiores -->
                <path d="M40,65 L45,85 L50,75 L55,85 L60,65 Z" fill="currentColor" />
            </svg>
        `;
    }

    injectHeader() {
        const headerHTML = `
            <header class="site-header" role="banner">
                <div class="header-container">
                    <div class="brand">
                        <a href="index.html" aria-label="Volver a la portada de Hyrule Chronicles" style="display:flex; flex-direction:column; align-items:center;">
                            ${this.getSVGEmblem()}
                            <h1 class="brand-title">Hyrule Chronicles</h1>
                            <span class="brand-subtitle">1986 - 2026 Archive</span>
                        </a>
                    </div>
                    <nav class="main-nav" role="navigation" aria-label="Navegación principal">
                        <ul>
                            <li><a href="index.html" data-page="index">Gran Archivo & Ensayo</a></li>
                            <li><a href="cronologia-juegos.html" data-page="cronologia">Compendio Cronológico</a></li>
                            <li><a href="oraculo-rutas-quiz.html" data-page="oraculo">Oráculo de Rutas</a></li>
                        </ul>
                    </nav>
                </div>
            </header>
        `;
        document.body.insertAdjacentHTML('afterbegin', headerHTML);
    }

    injectFooter() {
        const footerHTML = `
            <footer class="site-footer" role="contentinfo">
                <div class="footer-container">
                    ${this.getSVGEmblem()}
                    <p style="margin-top: 1rem;">
                        <strong>Hyrule Chronicles &copy; 2026</strong><br>
                        Proyecto de Archivo Histórico de Videojuegos.<br>
                        <em>The Legend of Zelda es una marca registrada de Nintendo. Este es un portal educativo y enciclopédico.</em>
                    </p>
                </div>
            </footer>
        `;
        document.body.insertAdjacentHTML('beforeend', footerHTML);
    }

    highlightCurrentPage() {
        const path = window.location.pathname;
        const navLinks = document.querySelectorAll('.main-nav a');
        
        navLinks.forEach(link => {
            const page = link.getAttribute('data-page');
            if (path.includes(page) || (path.endsWith('/') && page === 'index')) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
            }
        });
    }

    setupKeyboardNavigation() {
        // Mejoras de accesibilidad de foco para interactivos
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('user-is-tabbing');
            }
        });
        
        document.addEventListener('mousedown', () => {
            document.body.classList.remove('user-is-tabbing');
        });
    }
}

// Inicializar el portal
window.hyrulePortal = new HyrulePortal();
