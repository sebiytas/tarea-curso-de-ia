/**
 * js/main.js - Archivo principal de control global
 * Contiene la inyección de la estructura de navegación global, 
 * lógica de menú móvil, animaciones de fondo (notas musicales) 
 * y configuraciones de accesibilidad.
 */

class LoMicroTDApp {
  constructor() {
    this.init();
  }

  init() {
    this.setupActiveLinks();
    this.initMobileMenu();
    this.initFloatingNotes();
    this.setupAccessibility();
  }

  // 1. Marcar enlace activo
  setupActiveLinks() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      if(item.getAttribute('data-path') === currentPage) {
        item.classList.add('active');
        item.setAttribute('aria-current', 'page');
      }
    });
  }

  // 2. Lógica del menú móvil
  initMobileMenu() {
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.getElementById('mobileMenu');
    const navLinks = document.querySelector('.nav-links').cloneNode(true);
    const socialBar = document.querySelector('.social-bar').cloneNode(true);

    mobileMenu.appendChild(navLinks);
    mobileMenu.appendChild(socialBar);

    mobileBtn.addEventListener('click', () => {
      const isExpanded = mobileBtn.getAttribute('aria-expanded') === 'true';
      mobileBtn.setAttribute('aria-expanded', !isExpanded);
      mobileMenu.classList.toggle('open');
      mobileMenu.setAttribute('aria-hidden', isExpanded);
      
      if(!isExpanded) {
        mobileBtn.textContent = '✕';
      } else {
        mobileBtn.textContent = '☰';
      }
    });
  }

  // 3. Sistema de partículas flotantes (Notas musicales)
  initFloatingNotes() {
    const container = document.getElementById('particlesContainer');
    const notesCount = 15;
    
    // SVG Paths para diferentes notas musicales
    const notePaths = [
      'M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z', // Nota corchea
      'M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z', // Nota corchea duplicate (placeholder for others)
      'M9 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h6v6.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V3H9z' // Doble corchea
    ];

    for (let i = 0; i < notesCount; i++) {
      const svgNS = "http://www.w3.org/2000/svg";
      const svg = document.createElementNS(svgNS, "svg");
      const path = document.createElementNS(svgNS, "path");
      
      const randomNote = notePaths[Math.floor(Math.random() * notePaths.length)];
      
      svg.setAttribute("viewBox", "0 0 24 24");
      svg.classList.add("musical-note");
      
      // Randomizar tamaño, posición y duración de animación
      const size = Math.random() * 20 + 15; // Entre 15px y 35px
      const leftPos = Math.random() * 100;
      const animDuration = Math.random() * 15 + 10; // Entre 10s y 25s
      const delay = Math.random() * 10;
      
      svg.style.width = \`\${size}px\`;
      svg.style.height = \`\${size}px\`;
      svg.style.left = \`\${leftPos}%\`;
      svg.style.animationDuration = \`\${animDuration}s\`;
      svg.style.animationDelay = \`\${delay}s\`;
      
      path.setAttribute("d", randomNote);
      svg.appendChild(path);
      container.appendChild(svg);
    }
  }

  // 4. Mejoras de accesibilidad dinámicas
  setupAccessibility() {
    // Asegurar que las imágenes de respaldo que fallen no rompan la experiencia
    document.addEventListener('error', (e) => {
      if(e.target.tagName.toLowerCase() === 'img') {
        e.target.classList.add('error');
      }
    }, true);
  }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  window.loMicroApp = new LoMicroTDApp();
});
