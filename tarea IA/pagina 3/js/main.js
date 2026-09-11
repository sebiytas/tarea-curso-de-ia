/**
 * Shared Layout Manager
 * Injects the global header (navigation) and footer into all pages.
 */

const TriforceLogoSVG = `
<svg class="logo-icon" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <path d="M50 5 L95 85 L5 85 Z" stroke-width="4" stroke-linejoin="round"/>
  <path d="M50 5 L72.5 45 L27.5 45 Z" fill="currentColor" stroke="none"/>
  <path d="M27.5 45 L50 85 L5 85 Z" fill="currentColor" stroke="none"/>
  <path d="M72.5 45 L95 85 L50 85 Z" fill="currentColor" stroke="none"/>
</svg>
`;

const navLinks = [
    { name: '[ CRÓNICAS & LORE ]', url: 'index.html' },
    { name: '[ N64 VS. 3DS: INFORME ]', url: 'comparativa-n64-3ds.html' },
    { name: '[ CÁMARA DE LA OCARINA ]', url: 'ocarina-interactiva.html' }
];

function injectLayout() {
    // 1. Create Header
    const header = document.createElement('header');
    header.id = 'global-header';
    
    // Determine active page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    let navItemsHTML = navLinks.map(link => {
        const isActive = currentPage === link.url ? 'class="active" aria-current="page"' : '';
        return `<li><a href="${link.url}" ${isActive}>${link.name}</a></li>`;
    }).join('');

    header.innerHTML = `
        <div class="nav-container">
            <div class="logo">
                ${TriforceLogoSVG}
                <span>OCARINA ARCHIVE // 1998 - 2011</span>
            </div>
            <nav class="main-nav" aria-label="Navegación Principal">
                <ul>
                    ${navItemsHTML}
                </ul>
            </nav>
        </div>
    `;

    // 2. Create Footer
    const footer = document.createElement('footer');
    footer.id = 'global-footer';
    footer.innerHTML = `
        <div style="max-width: 800px; margin: 0 auto;">
            <p>&copy; 2026 - Ocarina Archive | Construido con Web Audio API y Diseño Vanilla.</p>
            <p style="margin-top: 10px;"><small>La Leyenda de Zelda, la Trifuerza, Ocarina of Time y todos sus personajes son marcas registradas y propiedad de Nintendo Co., Ltd. Este es un proyecto enciclopédico de homenaje.</small></p>
        </div>
    `;

    // 3. Inject into body (header at start, footer at end)
    document.body.insertAdjacentElement('afterbegin', header);
    document.body.insertAdjacentElement('beforeend', footer);
}

document.addEventListener('DOMContentLoaded', injectLayout);
