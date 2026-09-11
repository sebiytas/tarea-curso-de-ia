/**
 * VAULT2000 - NAVIGATION CONTROLLER
 * Maneja la interactividad y accesibilidad del menú horizontal desplegable.
 */

document.addEventListener('DOMContentLoaded', () => {
  const navItems = document.querySelectorAll('.nav-item');
  const dropdownTriggers = document.querySelectorAll('.nav-link[aria-haspopup="true"]');

  // Alternar submenús al hacer clic (para dispositivos móviles o clics explícitos)
  dropdownTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const parentItem = trigger.closest('.nav-item');
      const isExpanded = trigger.getAttribute('aria-expanded') === 'true';

      // Cerrar los demás primero
      closeAllDropdowns();

      if (!isExpanded) {
        parentItem.classList.add('is-active');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // Cerrar menús al hacer clic fuera
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.global-nav')) {
      closeAllDropdowns();
    }
  });

  // Accesibilidad: Cerrar submenús con la tecla Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllDropdowns();
      // Devolver el foco al cuerpo o al botón original si es necesario
      if (document.activeElement && document.activeElement.closest('.global-nav')) {
        document.activeElement.blur();
      }
    }
  });

  function closeAllDropdowns() {
    navItems.forEach(item => {
      item.classList.remove('is-active');
      const trigger = item.querySelector('.nav-link[aria-haspopup="true"]');
      if (trigger) {
        trigger.setAttribute('aria-expanded', 'false');
      }
    });
  }
});
