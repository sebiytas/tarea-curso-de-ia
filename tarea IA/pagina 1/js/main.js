import { generatePalette, generatePrompt } from './palette-engine.js';
import { saveChallenge } from './storage-manager.js';

// Estado actual
let currentMode = 'combo'; // 'palette', 'prompt', 'combo'
let currentPalette = [];
let currentPrompt = null;
let pinnedColors = new Array(5).fill(null);

// Referencias DOM
const modeButtons = document.querySelectorAll('.segmented-btn');
const promptContainer = document.getElementById('prompt-container');
const paletteContainer = document.getElementById('palette-container');
const harmonySelect = document.getElementById('harmony-select');
const harmonyControlGroup = document.getElementById('harmony-control-group');
const btnGenerate = document.getElementById('btn-generate');
const btnSave = document.getElementById('btn-save');

const promptSubject = document.getElementById('prompt-subject');
const promptEnvironment = document.getElementById('prompt-environment');
const promptConstraint = document.getElementById('prompt-constraint');

// Inicialización
function init() {
    setupEventListeners();
    generateContent();
}

function setupEventListeners() {
    // Cambio de modo
    modeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            modeButtons.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentMode = e.target.dataset.mode;
            updateUIVisibility();
            generateContent(); // Regenerar al cambiar de modo para rellenar
        });
    });

    // Botón generar
    btnGenerate.addEventListener('click', () => {
        btnGenerate.classList.add('anim-stamp');
        setTimeout(() => btnGenerate.classList.remove('anim-stamp'), 300);
        generateContent();
    });

    // Botón guardar
    btnSave.addEventListener('click', () => {
        const pData = (currentMode === 'combo' || currentMode === 'prompt') ? currentPrompt : null;
        const cData = (currentMode === 'combo' || currentMode === 'palette') ? currentPalette : null;

        if (saveChallenge(pData, cData)) {
            const originalText = btnSave.innerHTML;
            btnSave.innerHTML = "¡Guardado!";
            btnSave.style.backgroundColor = "var(--tape-yellow)";
            setTimeout(() => {
                btnSave.innerHTML = originalText;
                btnSave.style.backgroundColor = "";
            }, 2000);
        }
    });
}

function updateUIVisibility() {
    if (currentMode === 'combo') {
        promptContainer.style.display = 'block';
        paletteContainer.style.display = 'flex';
        harmonyControlGroup.style.display = 'flex';
    } else if (currentMode === 'prompt') {
        promptContainer.style.display = 'block';
        paletteContainer.style.display = 'none';
        harmonyControlGroup.style.display = 'none';
    } else if (currentMode === 'palette') {
        promptContainer.style.display = 'none';
        paletteContainer.style.display = 'flex';
        harmonyControlGroup.style.display = 'flex';
    }
}

function generateContent() {
    if (currentMode === 'combo' || currentMode === 'prompt') {
        currentPrompt = generatePrompt();
        renderPrompt(currentPrompt);
    }

    if (currentMode === 'combo' || currentMode === 'palette') {
        const harmony = harmonySelect.value;
        currentPalette = generatePalette(harmony, pinnedColors, 5);
        renderPalette(currentPalette);
    }
}

function renderPrompt(prompt) {
    promptSubject.textContent = prompt.subject;
    promptEnvironment.textContent = prompt.environment;
    promptConstraint.textContent = prompt.constraint;
}

function renderPalette(palette) {
    paletteContainer.innerHTML = '';

    palette.forEach((color, index) => {
        const isPinned = pinnedColors[index] !== null;

        const swatchContainer = document.createElement('div');
        swatchContainer.className = 'color-swatch-container';

        const swatch = document.createElement('div');
        swatch.className = 'color-swatch';
        swatch.style.backgroundColor = color.hex;

        const name = document.createElement('div');
        name.className = 'color-name';
        name.textContent = color.name;

        const hex = document.createElement('div');
        hex.className = 'color-hex';
        hex.textContent = color.hex;
        hex.title = "Clic para copiar";

        const hsl = document.createElement('div');
        hsl.className = 'color-hsl';
        hsl.textContent = color.hslString;

        const pinBtn = document.createElement('button');
        pinBtn.className = `pin-btn ${isPinned ? 'is-pinned' : ''}`;
        pinBtn.innerHTML = '📌';
        pinBtn.title = isPinned ? "Desfijar color" : "Fijar color";

        const toast = document.createElement('div');
        toast.className = 'toast-copy';
        toast.textContent = '¡Copiado!';

        // Evento Copiar
        hex.addEventListener('click', () => {
            navigator.clipboard.writeText(color.hex).then(() => {
                toast.classList.add('show');
                setTimeout(() => toast.classList.remove('show'), 1500);
            });
        });

        // Evento Pin
        pinBtn.addEventListener('click', () => {
            if (pinnedColors[index]) {
                pinnedColors[index] = null;
                pinBtn.classList.remove('is-pinned');
                pinBtn.title = "Fijar color";
            } else {
                pinnedColors[index] = color;
                pinBtn.classList.add('is-pinned');
                pinBtn.title = "Desfijar color";
            }
        });

        swatchContainer.appendChild(pinBtn);
        swatchContainer.appendChild(swatch);
        swatchContainer.appendChild(name);
        swatchContainer.appendChild(hex);
        swatchContainer.appendChild(hsl);
        swatchContainer.appendChild(toast);

        paletteContainer.appendChild(swatchContainer);
    });
}

// Iniciar aplicación
document.addEventListener('DOMContentLoaded', init);
