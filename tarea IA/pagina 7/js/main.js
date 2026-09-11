/**
 * js/main.js
 * Lógica de navegación transversal, accesibilidad y retroalimentación visual.
 * Inyección dinámica de Header Ceremonial y Footer.
 */

document.addEventListener('DOMContentLoaded', () => {
    renderSharedLayout();
    initAccessibility();
});

function renderSharedLayout() {
    const headerHTML = `
        <header class="vault-header">
            <div class="laurel-wreath" aria-hidden="true"></div>
            <h1 class="heraldic-title">TROPHY VAULT // ACCOUNTS & LEGACIES</h1>
            <nav class="vault-nav" aria-label="Navegación Principal del Salón de la Fama">
                <ul>
                    <li><a href="index.html" class="nav-tab">Registrar Nueva Victoria</a></li>
                    <li><a href="salon-de-la-fama.html" class="nav-tab">Salón de la Fama & Ránking</a></li>
                    <li><a href="archivo-detallado.html" class="nav-tab">Archivo Enciclopédico de Logros</a></li>
                </ul>
            </nav>
        </header>
    `;

    const footerHTML = `
        <footer class="vault-footer">
            <p>&copy; ${new Date().getFullYear()} Trophy Vault. Un santuario para inmortales. Plataforma oficial de logros.</p>
        </footer>
    `;

    // Insertar encabezado si no existe
    if (!document.querySelector('.vault-header')) {
        document.body.insertAdjacentHTML('afterbegin', headerHTML);
    }

    // Insertar pie de página si no existe
    if (!document.querySelector('.vault-footer')) {
        document.body.insertAdjacentHTML('beforeend', footerHTML);
    }
    
    // Resaltar la pestaña actual
    let currentPath = window.location.pathname.split('/').pop() || 'index.html';
    if (currentPath === '') currentPath = 'index.html';
    
    const navLinks = document.querySelectorAll('.nav-tab');
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        } else {
            link.classList.remove('active');
            link.removeAttribute('aria-current');
        }
    });
}

function initAccessibility() {
    // Inicializar región aria-live para anuncios dinámicos en toda la aplicación
    if (!document.getElementById('a11y-announcer')) {
        const announcer = document.createElement('div');
        announcer.id = 'a11y-announcer';
        announcer.setAttribute('aria-live', 'polite');
        announcer.className = 'sr-only';
        document.body.appendChild(announcer);
    }
}

/**
 * Función global para anunciar mensajes a lectores de pantalla
 * @param {string} message - Mensaje a anunciar
 */
window.announceToScreenReader = function(message) {
    const announcer = document.getElementById('a11y-announcer');
    if (announcer) {
        announcer.textContent = message;
        // Limpiar después de un tiempo para que mensajes repetidos se vuelvan a anunciar
        setTimeout(() => { announcer.textContent = ''; }, 3000);
    }
};

/**
 * Función opcional para reproducir sonido de victoria
 */
window.playVictorySound = function() {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        
        // Oscilador 1: Tono fundamental (Campana)
        const osc1 = audioCtx.createOscillator();
        const gain1 = audioCtx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
        
        // Oscilador 2: Armónico para brillo metálico
        const osc2 = audioCtx.createOscillator();
        const gain2 = audioCtx.createGain();
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(1046.50, audioCtx.currentTime); // C6
        
        // Envolvente
        gain1.gain.setValueAtTime(0.5, audioCtx.currentTime);
        gain1.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 2);
        
        gain2.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1.5);
        
        osc1.connect(gain1);
        gain1.connect(audioCtx.destination);
        
        osc2.connect(gain2);
        gain2.connect(audioCtx.destination);
        
        osc1.start();
        osc2.start();
        osc1.stop(audioCtx.currentTime + 2);
        osc2.stop(audioCtx.currentTime + 2);
    } catch (e) {
        console.log("Audio Web API no soportado o bloqueado por políticas del navegador.", e);
    }
};
