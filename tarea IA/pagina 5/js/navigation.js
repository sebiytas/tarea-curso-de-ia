/**
 * navigation.js
 * Lógica del menú lateral persistente estilo tronco de árbol, transiciones orgánicas y accesibilidad.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Referencias al DOM
    const sidebar = document.getElementById('forest-sidebar');
    if (!sidebar) return; // Si no hay sidebar, salir
    
    const navItems = sidebar.querySelectorAll('.nav-item');
    
    // Marcar la página activa actual
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    
    navItems.forEach(item => {
        const href = item.getAttribute('href');
        if (href === currentPath) {
            item.classList.add('active');
            item.setAttribute('aria-current', 'page');
        }
        
        // Efecto de sonido al interactuar (Opcional visual de crujido sutil - por ahora visual)
        item.addEventListener('mouseenter', () => {
            // Simulamos un crujido sutil con una rotación minúscula aleatoria
            if(!item.classList.contains('active')) {
                const rotation = (Math.random() - 0.5) * 4; // -2deg to 2deg
                const icon = item.querySelector('.nav-icon');
                if (icon) {
                    icon.style.transform = `scale(1.1) rotate(${rotation}deg)`;
                }
            }
        });
        
        item.addEventListener('mouseleave', () => {
            if(!item.classList.contains('active')) {
                const icon = item.querySelector('.nav-icon');
                if (icon) {
                    icon.style.transform = '';
                }
            }
        });
    });

    // Accesibilidad: Permitir expandir el menú con teclado si tiene el foco
    sidebar.addEventListener('focusin', () => {
        sidebar.classList.add('expanded');
    });

    sidebar.addEventListener('focusout', (e) => {
        // Verificar si el nuevo elemento enfocado sigue estando dentro del sidebar
        if (!sidebar.contains(e.relatedTarget)) {
            sidebar.classList.remove('expanded');
        }
    });
});
