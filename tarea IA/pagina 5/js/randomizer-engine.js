/**
 * randomizer-engine.js
 * Motor de selección aleatoria sin repetición inmediata, temporizador de dibujo rápido y lógica de filtrado.
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // Si no estamos en la página del visor, salir
    if (!document.getElementById('reference-image')) return;

    // Referencias DOM
    const imgEl = document.getElementById('reference-image');
    const titleEl = document.getElementById('meta-title');
    const complexityEl = document.getElementById('meta-complexity');
    const focusEl = document.getElementById('meta-focus');
    const adviceEl = document.getElementById('meta-advice');
    const announcerEl = document.getElementById('live-announcer');
    
    const btnRandomize = document.getElementById('btn-randomize');
    const selectCategory = document.getElementById('category-filter');
    const selectTimer = document.getElementById('timer-select');
    const displayTimer = document.getElementById('timer-display');
    
    // Estado interno
    let currentCategory = 'all';
    let availableReferences = [];
    let lastReferenceId = null;
    let currentImage = null;
    
    // Temporizador
    let timerInterval = null;
    let secondsRemaining = 0;

    // Inicialización
    initEngine();

    function initEngine() {
        filterReferences(); // Llena el arreglo disponible
        loadRandomReference();

        // Listeners
        btnRandomize.addEventListener('click', () => {
            loadRandomReference();
            resetTimer();
        });

        selectCategory.addEventListener('change', (e) => {
            currentCategory = e.target.value;
            filterReferences();
            loadRandomReference();
            resetTimer();
        });

        selectTimer.addEventListener('change', (e) => {
            startTimer(parseInt(e.target.value, 10));
        });
        
        // Listener de carga de imagen para ajustar tamaño de rejilla y overlays (Para la Fase 4)
        imgEl.addEventListener('load', () => {
            imgEl.style.display = 'block';
            // Disparamos un evento personalizado para que canvas-tools.js (Fase 4) pueda reaccionar
            const event = new CustomEvent('referenceLoaded', { detail: imgEl });
            document.dispatchEvent(event);
        });
    }

    function filterReferences() {
        if (currentCategory === 'all') {
            availableReferences = [...forestReferences];
        } else {
            availableReferences = forestReferences.filter(ref => ref.category === currentCategory);
        }
    }

    function loadRandomReference() {
        if (availableReferences.length === 0) {
            titleEl.textContent = "El bosque está vacío";
            adviceEl.textContent = "Intenta otra categoría.";
            return;
        }

        // Selección sin repetición inmediata (si hay más de 1 opción)
        let options = availableReferences;
        if (options.length > 1 && lastReferenceId) {
            options = availableReferences.filter(ref => ref.id !== lastReferenceId);
        }

        const randomIndex = Math.floor(Math.random() * options.length);
        const selected = options[randomIndex];
        lastReferenceId = selected.id;
        currentImage = selected;

        // Actualizar DOM
        imgEl.style.opacity = '0.5'; // Efecto transición
        imgEl.src = selected.url;
        imgEl.alt = selected.title;
        
        setTimeout(() => { imgEl.style.opacity = '1'; }, 100);

        titleEl.textContent = selected.title;
        complexityEl.textContent = selected.complexity;
        focusEl.textContent = selected.focus;
        adviceEl.textContent = selected.advice;

        // Accesibilidad: Anunciar nueva imagen
        announcerEl.textContent = `Nueva referencia cargada: ${selected.title}. Foco en ${selected.focus}.`;
    }

    // --- Lógica del Temporizador ---
    function startTimer(seconds) {
        clearInterval(timerInterval);
        secondsRemaining = seconds;
        
        if (seconds === 0) {
            displayTimer.textContent = "--:--";
            return;
        }

        updateTimerDisplay();
        
        timerInterval = setInterval(() => {
            secondsRemaining--;
            updateTimerDisplay();
            
            if (secondsRemaining <= 0) {
                clearInterval(timerInterval);
                // Tiempo agotado: Cargar nueva imagen
                announcerEl.textContent = "Tiempo agotado. Cargando nueva referencia.";
                
                // Efecto visual rápido
                document.body.style.boxShadow = "inset 0 0 50px rgba(136, 196, 66, 0.5)";
                setTimeout(() => { document.body.style.boxShadow = "none"; }, 500);
                
                loadRandomReference();
                // Reiniciar el mismo timer
                startTimer(parseInt(selectTimer.value, 10));
            }
        }, 1000);
    }

    function updateTimerDisplay() {
        const m = Math.floor(secondsRemaining / 60).toString().padStart(2, '0');
        const s = (secondsRemaining % 60).toString().padStart(2, '0');
        displayTimer.textContent = `${m}:${s}`;
        
        // Alerta en últimos 10 segundos
        if (secondsRemaining <= 10 && secondsRemaining > 0) {
            displayTimer.style.color = "#D4A359"; // accent-spore
        } else {
            displayTimer.style.color = "var(--accent-spore)";
        }
    }

    function resetTimer() {
        const val = parseInt(selectTimer.value, 10);
        if (val > 0) {
            startTimer(val);
        } else {
            displayTimer.textContent = "--:--";
        }
    }
});
