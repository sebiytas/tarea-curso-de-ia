/**
 * @file navigation.js
 * @description Lógica del menú lateral persistente (Jean Índigo) para la plataforma Atelier Cozy.
 */

document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.getElementById('denim-sidebar');
    const toggleBtn = document.getElementById('sidebar-toggle');
    const links = document.querySelectorAll('.denim-link');
    
    if (!sidebar || !toggleBtn) return;

    // Función para alternar el menú
    const toggleMenu = () => {
        const isExpanded = sidebar.classList.contains('expanded');
        
        if (isExpanded) {
            sidebar.classList.remove('expanded');
            toggleBtn.setAttribute('aria-expanded', 'false');
            toggleBtn.setAttribute('aria-label', 'Expandir menú de navegación');
        } else {
            sidebar.classList.add('expanded');
            toggleBtn.setAttribute('aria-expanded', 'true');
            toggleBtn.setAttribute('aria-label', 'Colapsar menú de navegación');
            
            // Foco en el primer enlace por accesibilidad al abrir
            setTimeout(() => {
                if (links.length > 0) {
                    links[0].focus();
                }
            }, 300);
        }
    };

    // Event listener para click y teclado
    toggleBtn.addEventListener('click', toggleMenu);

    toggleBtn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleMenu();
        }
    });

    // Accesibilidad: Cerrar menú con Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sidebar.classList.contains('expanded')) {
            toggleMenu();
            toggleBtn.focus();
        }
    });

    // Responsividad: Cerrar sidebar en móvil al hacer clic fuera de él
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            if (sidebar.classList.contains('expanded') && !sidebar.contains(e.target)) {
                toggleMenu();
            }
        }
    });

    // Marcar enlace activo según la URL actual
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    links.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        }
    });
});
