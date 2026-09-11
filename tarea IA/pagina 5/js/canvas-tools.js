/**
 * canvas-tools.js
 * Suite de Análisis Visual: Filtro Blanco y Negro/Claroscuro, Espejo Horizontal y Rejilla Espacial.
 */

document.addEventListener('DOMContentLoaded', () => {
    const imgEl = document.getElementById('reference-image');
    if (!imgEl) return;

    const btnGrayscale = document.getElementById('btn-grayscale');
    const btnGrid = document.getElementById('btn-grid');
    const btnFlip = document.getElementById('btn-flip');
    const gridOverlay = document.getElementById('grid-overlay');
    const announcerEl = document.getElementById('live-announcer');

    // Estado
    let isGrayscale = false;
    let isGridActive = false;
    let isFlipped = false;
    let contrastValue = 120; // Valor por defecto cuando B/N está activo

    // 1. Crear el deslizador de contraste dinámicamente
    const sliderContainer = document.createElement('div');
    sliderContainer.style.display = 'none'; // Oculto por defecto
    sliderContainer.style.alignItems = 'center';
    sliderContainer.style.gap = '10px';
    sliderContainer.style.marginLeft = '10px';
    
    const sliderLabel = document.createElement('label');
    sliderLabel.textContent = 'Contraste:';
    sliderLabel.style.color = 'var(--text-muted)';
    sliderLabel.style.fontSize = '0.9rem';
    sliderLabel.style.fontFamily = 'var(--font-mono)';
    
    const contrastSlider = document.createElement('input');
    contrastSlider.type = 'range';
    contrastSlider.min = '100';
    contrastSlider.max = '200';
    contrastSlider.value = '120';
    contrastSlider.style.width = '80px';
    contrastSlider.style.accentColor = 'var(--accent-sprout)';
    contrastSlider.ariaLabel = 'Ajustar nivel de contraste del claroscuro';

    sliderContainer.appendChild(sliderLabel);
    sliderContainer.appendChild(contrastSlider);

    // Insertar el slider justo después del botón de B/N
    btnGrayscale.parentNode.insertBefore(sliderContainer, btnGrayscale.nextSibling);

    // Función principal para aplicar los filtros CSS compuestos a la imagen
    function applyTransformations() {
        let transformString = '';
        let filterString = '';

        // Espejo
        if (isFlipped) {
            transformString += 'scaleX(-1) ';
        }

        // Claroscuro
        if (isGrayscale) {
            filterString += `grayscale(100%) contrast(${contrastValue}%)`;
        }

        imgEl.style.transform = transformString;
        imgEl.style.filter = filterString;
    }

    // Eventos de botones
    btnGrayscale.addEventListener('click', () => {
        isGrayscale = !isGrayscale;
        btnGrayscale.classList.toggle('active', isGrayscale);
        btnGrayscale.setAttribute('aria-pressed', isGrayscale);
        
        sliderContainer.style.display = isGrayscale ? 'flex' : 'none';
        
        applyTransformations();
        announcerEl.textContent = isGrayscale ? "Modo Claroscuro activado." : "Modo Claroscuro desactivado.";
    });

    contrastSlider.addEventListener('input', (e) => {
        contrastValue = e.target.value;
        if (isGrayscale) {
            applyTransformations();
        }
    });

    btnGrid.addEventListener('click', () => {
        isGridActive = !isGridActive;
        btnGrid.classList.toggle('active', isGridActive);
        btnGrid.setAttribute('aria-pressed', isGridActive);
        
        if (isGridActive) {
            gridOverlay.classList.add('active');
        } else {
            gridOverlay.classList.remove('active');
        }
        announcerEl.textContent = isGridActive ? "Cuadrícula de proporción activada." : "Cuadrícula desactivada.";
    });

    btnFlip.addEventListener('click', () => {
        isFlipped = !isFlipped;
        btnFlip.classList.toggle('active', isFlipped);
        btnFlip.setAttribute('aria-pressed', isFlipped);
        
        applyTransformations();
        announcerEl.textContent = isFlipped ? "Vista de espejo activada." : "Vista normal restaurada.";
    });

    // Resetear algunas transformaciones si cambia la imagen, pero mantener los modos si el artista quiere
    // Escuchamos el evento disparado desde randomizer-engine.js
    document.addEventListener('referenceLoaded', (e) => {
        const loadedImg = e.detail;
        
        // Ajustar el grid dinámicamente al tamaño real ocupado por la imagen (object-fit: contain)
        const rect = loadedImg.getBoundingClientRect();
        
        // Calculamos el ratio de la imagen real vs el contenedor
        const imgRatio = loadedImg.naturalWidth / loadedImg.naturalHeight;
        const containerRatio = loadedImg.parentElement.clientWidth / loadedImg.parentElement.clientHeight;
        
        let finalWidth, finalHeight;
        
        if (containerRatio > imgRatio) {
            // Contenedor es más ancho (barras laterales)
            finalHeight = loadedImg.parentElement.clientHeight;
            finalWidth = finalHeight * imgRatio;
        } else {
            // Contenedor es más alto (barras arriba/abajo)
            finalWidth = loadedImg.parentElement.clientWidth;
            finalHeight = finalWidth / imgRatio;
        }

        gridOverlay.style.width = `${finalWidth}px`;
        gridOverlay.style.height = `${finalHeight}px`;
    });
    
    // Ajustar rejilla en redimensionamiento de ventana
    window.addEventListener('resize', () => {
        if(imgEl && imgEl.naturalWidth > 0) {
            const event = new CustomEvent('referenceLoaded', { detail: imgEl });
            document.dispatchEvent(event);
        }
    });
});
