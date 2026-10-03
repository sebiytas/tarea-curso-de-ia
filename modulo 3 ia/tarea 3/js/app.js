/**
 * Director Audiovisual - Core JavaScript
 * Simulación de HUD, Timecode y Efectos Interactivos (Switcher)
 */

document.addEventListener('DOMContentLoaded', () => {
    initTimecode();
    initAudioMeters();
    initPortfolioParallax();
    initSwitcherEffects();
});

/* =========================================
   SISTEMA DE TIMECODE (SMPTE) CONTINUO
========================================= */
let frames = 0;
let seconds = 0;
let minutes = 0; 
let hours = 0;

function initTimecode() {
    const hudTimecode = document.getElementById('hud-timecode');

    // Inicializar valores lógicos según la vista para inmersión
    const path = window.location.pathname;
    if(path.includes('portafolio')) { minutes = 1; seconds = 24; frames = 15; }
    else if(path.includes('teoria')) { minutes = 5; seconds = 30; frames = 0; }
    else { minutes = 0; seconds = 0; frames = 0; }

    const updateDisplay = () => {
        const hh = String(hours).padStart(2, '0');
        const mm = String(minutes).padStart(2, '0');
        const ss = String(seconds).padStart(2, '0');
        const ff = String(frames).padStart(2, '0');
        const formatted = `${hh}:${mm}:${ss}:${ff}`;
        
        if (hudTimecode) hudTimecode.textContent = formatted;
    };

    const tick = () => {
        frames++;
        if (frames >= 24) { // Simulando Timeline de 24 FPS Cinematográficos
            frames = 0;
            seconds++;
            if (seconds >= 60) {
                seconds = 0;
                minutes++;
                if (minutes >= 60) {
                    minutes = 0;
                    hours++;
                }
            }
        }
        updateDisplay();
    };

    setInterval(tick, 1000 / 24); // Ticker constante a 24fps
}

/* =========================================
   SIMULACIÓN DE VÚMETROS (MEDIDORES DE AUDIO)
========================================= */
function initAudioMeters() {
    const bars = document.querySelectorAll('.audio-bar');
    if (!bars.length) return;

    setInterval(() => {
        bars.forEach(bar => {
            // Generar un nivel de señal aleatorio
            const height = Math.floor(Math.random() * 85) + 15;
            bar.style.height = `${height}%`;
            
            // Peak level clipping (Clipping analógico / digital)
            if (height > 85) {
                bar.style.backgroundColor = 'var(--color-accent)';
            } else if (height > 60) {
                bar.style.backgroundColor = '#FFFFFF';
            } else {
                bar.style.backgroundColor = 'var(--color-text-sec)';
            }
        });
    }, 120); // Fluctuación rápida
}

/* =========================================
   EFECTO PARALLAX 3D EN PORTAFOLIO
========================================= */
function initPortfolioParallax() {
    const items = document.querySelectorAll('.portfolio-item');
    if (!items.length) return;

    items.forEach(item => {
        const visual = item.querySelector('.portfolio-item__visual');
        
        item.addEventListener('mousemove', (e) => {
            const rect = item.getBoundingClientRect();
            const x = e.clientX - rect.left; 
            const y = e.clientY - rect.top;  
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Inclinación máxima de 8 grados para sentir profundidad
            const rotateX = ((y - centerY) / centerY) * -8;
            const rotateY = ((x - centerX) / centerX) * 8;
            
            visual.style.transform = `scale(1.15) perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        item.addEventListener('mouseleave', () => {
            visual.style.transform = `scale(1) perspective(1000px) rotateX(0deg) rotateY(0deg)`;
            visual.style.transition = `transform 0.6s cubic-bezier(0.23, 1, 0.32, 1), filter 0.5s ease`;
        });
        
        item.addEventListener('mouseenter', () => {
            visual.style.transition = `transform 0.1s ease-out, filter 0.5s ease`;
        });
    });
}

/* =========================================
   EFECTOS DE SWITCHER DE VIDEO (MESA DE MEZCLAS)
========================================= */
function initSwitcherEffects() {
    const cutBtn = document.getElementById('btn-cut');
    const autoBtn = document.getElementById('btn-auto');
    
    // Efecto de parpadeo (Glitch / Flash) simulando un corte en vivo
    const triggerFlash = () => {
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.inset = '0';
        overlay.style.backgroundColor = 'white';
        overlay.style.zIndex = '9999';
        overlay.style.opacity = '0.8';
        overlay.style.pointerEvents = 'none';
        overlay.style.transition = 'opacity 0.2s ease-out';
        
        document.body.appendChild(overlay);
        
        setTimeout(() => {
            overlay.style.opacity = '0';
            setTimeout(() => overlay.remove(), 200);
        }, 50);
    };

    if (cutBtn) {
        cutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            triggerFlash();
            // Optional: simulate page reloading or visual cut
        });
    }

    if (autoBtn) {
        autoBtn.addEventListener('click', (e) => {
            e.preventDefault();
            document.body.style.filter = "invert(100%)";
            setTimeout(() => {
                document.body.style.filter = "none";
            }, 300);
        });
    }
}
