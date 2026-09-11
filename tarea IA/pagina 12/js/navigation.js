/**
 * Navigation & UI Engine - Ciara Creativa
 * Handles wire-o binding generation, active states, and accessibility.
 */

document.addEventListener('DOMContentLoaded', () => {
    initWireOBinding();
    initNavigationState();
    handleWindowResize();
});

/**
 * Genera dinámicamente los anillos de la encuadernación (Wire-O)
 * para evitar sobrecargar el HTML y adaptarse al ancho del contenedor.
 */
function initWireOBinding() {
    const navContainer = document.querySelector('.wire-o-binding');
    if (!navContainer) return;

    // Limpiar anillos previos si existen
    navContainer.innerHTML = '';

    // Calcular cuántos anillos caben (uno cada ~35px)
    const containerWidth = navContainer.offsetWidth;
    const ringSpacing = window.innerWidth > 768 ? 35 : 50; 
    const numRings = Math.floor(containerWidth / ringSpacing);

    // Crear e insertar anillos
    for (let i = 0; i < numRings; i++) {
        const ring = document.createElement('div');
        ring.className = 'wire-ring';
        // Añadir una ligera variación aleatoria al ángulo para realismo artesanal
        const randomRotation = (Math.random() - 0.5) * 4; 
        ring.style.transform = `rotate(${randomRotation}deg)`;
        navContainer.appendChild(ring);
    }
}

/**
 * Configura el estado activo de las pestañas de navegación
 * y mejora la accesibilidad por teclado.
 */
function initNavigationState() {
    const navLinks = document.querySelectorAll('.nav-tabs a');
    const currentPath = window.location.pathname;
    
    // Si la ruta termina en / o está vacía, asumimos index.html
    let currentPage = currentPath.split('/').pop() || 'index.html';

    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        
        // Verifica si el href coincide con la página actual
        if (currentPage === linkHref) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        } else {
            link.classList.remove('active');
            link.removeAttribute('aria-current');
        }

        // Soporte para navegación con teclado (Enter o Espacio)
        link.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                window.location.href = linkHref;
            }
        });
    });
}

/**
 * Re-dibuja los anillos cuando cambia el tamaño de la ventana
 * utilizando un debounce simple para optimización.
 */
function handleWindowResize() {
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            initWireOBinding();
        }, 150);
    });
}
