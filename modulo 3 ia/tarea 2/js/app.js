/**
 * app.js - Multiverso del Entretenimiento
 * Arquitectura Frontend en Vanilla JS (ES6+)
 */

document.addEventListener('DOMContentLoaded', () => {
    initVideoPlayerNav();
    initCurrencyConverter();
});

/**
 * 1. LÓGICA VISUAL DE LA BARRA DE REPRODUCCIÓN INTERACTIVA
 * Simula el comportamiento de un reproductor de video web:
 * - Alternancia del botón Play/Pause.
 * - Avance automático del tiempo (Timecode) de la interfaz.
 */
function initVideoPlayerNav() {
    const playPauseBtn = document.querySelector('.video-nav__btn[aria-label="Reproducir/Pausar"]');
    const timeDisplay = document.querySelector('.video-nav__time');
    
    if (!playPauseBtn || !timeDisplay) return;

    const icon = playPauseBtn.querySelector('i');
    let isPlaying = true;
    let timeInterval;

    // Extraer el tiempo actual desde el DOM (ej. "1:15 / 3:15")
    const timeParts = timeDisplay.textContent.split('/');
    if (timeParts.length !== 2) return;

    let currentSeconds = parseTimeToSeconds(timeParts[0].trim());
    const totalSeconds = parseTimeToSeconds(timeParts[1].trim());

    // Event Listener para alternar Reproducir/Pausar
    playPauseBtn.addEventListener('click', () => {
        isPlaying = !isPlaying;
        if (isPlaying) {
            icon.classList.remove('fa-play');
            icon.classList.add('fa-pause');
            startTimer();
        } else {
            icon.classList.remove('fa-pause');
            icon.classList.add('fa-play');
            stopTimer();
        }
    });

    // Inicia el avance del tiempo
    function startTimer() {
        timeInterval = setInterval(() => {
            if (currentSeconds < totalSeconds) {
                currentSeconds++;
                updateTimeDisplay();
            } else {
                stopTimer();
                isPlaying = false;
                icon.classList.remove('fa-pause');
                icon.classList.add('fa-play');
            }
        }, 1000);
    }

    // Detiene el avance del tiempo
    function stopTimer() {
        clearInterval(timeInterval);
    }

    // Renderiza el nuevo tiempo en el DOM
    function updateTimeDisplay() {
        const currentFormatted = formatSecondsToTime(currentSeconds);
        const totalFormatted = formatSecondsToTime(totalSeconds);
        timeDisplay.textContent = `${currentFormatted} / ${totalFormatted}`;
    }

    // Funciones de utilidad para el manejo de tiempo
    function parseTimeToSeconds(timeStr) {
        const parts = timeStr.split(':');
        return parseInt(parts[0]) * 60 + parseInt(parts[1]);
    }

    function formatSecondsToTime(seconds) {
        const min = Math.floor(seconds / 60);
        const sec = seconds % 60;
        return `${min}:${sec.toString().padStart(2, '0')}`;
    }

    // Iniciar el temporizador automáticamente al cargar
    startTimer();
}


/**
 * 2. MANEJO DE DIVISAS DINÁMICO (USD -> BS)
 * Obtiene la tasa de cambio y actualiza las tarjetas de precios asíncronamente.
 */
async function initCurrencyConverter() {
    const amountElements = document.querySelectorAll('.pricing-card__amount');
    const bsPriceElements = document.querySelectorAll('.bs-amount');

    if (amountElements.length === 0 || bsPriceElements.length === 0) return;

    try {
        // Indicador de carga (spinner)
        bsPriceElements.forEach(el => {
            el.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
        });

        // Solicitud de la tasa de cambio oficial
        const exchangeRate = await fetchExchangeRate();

        // Cálculo e inyección en el DOM
        amountElements.forEach((usdEl, index) => {
            const usdValue = parseFloat(usdEl.getAttribute('data-usd'));
            if (!isNaN(usdValue)) {
                const bsValue = usdValue * exchangeRate;
                
                // Efecto visual de aparición suave (Fade-In)
                bsPriceElements[index].style.opacity = '0';
                
                setTimeout(() => {
                    bsPriceElements[index].textContent = bsValue.toLocaleString('es-VE', { 
                        minimumFractionDigits: 2, 
                        maximumFractionDigits: 2 
                    });
                    bsPriceElements[index].style.transition = 'opacity 0.5s ease';
                    bsPriceElements[index].style.opacity = '1';
                }, 200);
            }
        });

    } catch (error) {
        console.error('Error crítico en el conversor de divisas:', error);
        bsPriceElements.forEach(el => el.textContent = 'No disponible');
    }
}

/**
 * Función fetch() robusta para obtener la tasa del BCV.
 * Implementa un mecanismo de "Fallback": intenta consumir una API pública real y, 
 * en caso de fallo (CORS, red caída, límite de cuota), recurre a una simulación realista.
 */
async function fetchExchangeRate() {
    console.log('Iniciando consulta de tasa de cambio...');
    
    try {
        // Intento 1: API Pública de DolarAPI Venezuela
        const response = await fetch('https://ve.dolarapi.com/v1/dolares/oficial');
        
        if (!response.ok) throw new Error('La respuesta de red no fue exitosa (HTTP ' + response.status + ')');
        
        const data = await response.json();
        if (data && data.promedio) {
            console.log(`Tasa oficial obtenida exitosamente vía API: ${data.promedio} Bs/USD`);
            return parseFloat(data.promedio);
        }
        
        throw new Error('Estructura de JSON inesperada o propiedad "promedio" faltante');
        
    } catch (error) {
        console.warn('Error al consumir API real. Activando protocolo de simulación (Fallback). Detalle:', error.message);
        
        // Intento 2 (Fallback): Simulación realista del endpoint BCV
        return new Promise((resolve) => {
            // Simulamos latencia de red de ~800ms
            setTimeout(() => {
                const simulatedBCVRate = 37.15; // Tasa de cambio base aproximada
                console.log(`Tasa de cambio simulada cargada: ${simulatedBCVRate} Bs/USD`);
                resolve(simulatedBCVRate);
            }, 800);
        });
    }
}
