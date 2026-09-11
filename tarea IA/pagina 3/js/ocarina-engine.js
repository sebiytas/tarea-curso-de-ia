/**
 * Motor lógico central: Ocarina Engine
 * Gestiona el mapeo de teclas, la lógica del Cancionero y el detonante del Easter Egg
 */

const songs = [
    { id: 'lullaby', name: "Zelda's Lullaby", sequence: ['left', 'up', 'right', 'left', 'up', 'right'], unlocked: false },
    { id: 'epona', name: "Epona's Song", sequence: ['up', 'left', 'right', 'up', 'left', 'right'], unlocked: false },
    { id: 'saria', name: "Saria's Song", sequence: ['down', 'right', 'left', 'down', 'right', 'left'], unlocked: false },
    { id: 'storms', name: "Song of Storms", sequence: ['a', 'down', 'up', 'a', 'down', 'up'], unlocked: false },
    { id: 'sun', name: "Sun's Song", sequence: ['right', 'down', 'up', 'right', 'down', 'up'], unlocked: false },
    { id: 'time', name: "Song of Time", sequence: ['right', 'a', 'down', 'right', 'a', 'down'], unlocked: false }
];

// Glifos visuales para el pentagrama dinámico
const noteSymbols = {
    'up': '▲',
    'left': '◀',
    'right': '▶',
    'down': '▼',
    'a': 'A'
};

// Mapeo robusto de eventos de teclado físico
const keyMap = {
    'd': 'up', 'ArrowUp': 'up',
    's': 'left', 'ArrowLeft': 'left',
    'f': 'right', 'ArrowRight': 'right',
    'c': 'down', 'ArrowDown': 'down',
    'a': 'a', ' ': 'a'
};

let noteHistory = [];
const MAX_HISTORY = 10;
const displayEl = document.getElementById('note-display');
const listEl = document.getElementById('song-list');

// Inicialización de la interfaz del cancionero
function initSongbook() {
    listEl.innerHTML = '';
    songs.forEach(song => {
        const li = document.createElement('li');
        li.id = `song-${song.id}`;
        li.className = 'song-item';
        
        const noteString = song.sequence.map(n => noteSymbols[n]).join(' ');
        
        li.innerHTML = `
            <div>
                <strong style="color: var(--gold-primary); font-size: 1.2rem; display:block; margin-bottom: 5px;">???</strong>
                <div class="song-notes">${noteString}</div>
            </div>
        `;
        listEl.appendChild(li);
    });
}

// Handler maestro de entradas (teclado/click)
function handleInput(note) {
    // 1. Síntesis Auditiva
    synth.playNote(note);
    
    // 2. Feedback Visual en Botones
    const btn = document.getElementById(`btn-${note}`);
    if (btn) {
        btn.classList.add('active');
        setTimeout(() => btn.classList.remove('active'), 200); // 200ms iluminado
    }
    
    // 3. Pintado en Pentagrama
    noteHistory.push(noteSymbols[note]);
    if (noteHistory.length > MAX_HISTORY) noteHistory.shift();
    displayEl.innerText = noteHistory.join(' ');
    
    // 4. Verificación de Secuencias (Pattern Matching)
    checkSongs(note);
}

// Historial paralelo puramente analítico para match exacto
let logicHistory = [];
function checkSongs(note) {
    logicHistory.push(note);
    if (logicHistory.length > 20) logicHistory.shift();
    
    songs.forEach(song => {
        if (song.unlocked) return; // Ignorar si ya está aprendida
        
        const seq = song.sequence;
        const len = seq.length;
        
        if (logicHistory.length >= len) {
            const recent = logicHistory.slice(-len);
            let match = true;
            for(let i=0; i<len; i++) {
                if(recent[i] !== seq[i]) match = false;
            }
            if (match) {
                unlockSong(song);
            }
        }
    });
}

function unlockSong(song) {
    song.unlocked = true;
    synth.playSuccessJingle();
    
    // UI Update
    const li = document.getElementById(`song-${song.id}`);
    li.classList.add('unlocked');
    const title = li.querySelector('strong');
    title.innerText = song.name;
    title.style.color = 'var(--text-bright)';
    
    // Limpiar buffers tras resolver para evitar falsos positivos encadenados
    logicHistory = [];
    noteHistory = [];
    setTimeout(() => { displayEl.innerText = ''; }, 1000);
    
    // Check de progreso global
    checkAllUnlocked();
}

function checkAllUnlocked() {
    const allDone = songs.every(s => s.unlocked);
    if (allDone) {
        setTimeout(triggerEasterEgg, 1500); // Dar margen tras la última victoria
    }
}

// Flujo del Regalito
function triggerEasterEgg() {
    const modal = document.getElementById('secret-modal');
    modal.classList.add('active');
}

// Interacción física con el Cofre en el DOM
document.getElementById('chest-container').addEventListener('click', function() {
    if(this.style.opacity === '0') return; // Bloquear doble click
    
    // 1. Detonar Audio
    synth.playChestOpenSound();
    
    // 2. Animación Transform
    this.style.transition = 'all 2s ease';
    this.style.transform = 'scale(1.5)';
    this.style.opacity = '0';
    
    // 3. Sistema de Partículas Volumétricas
    createParticles(this.getBoundingClientRect());
    
    // 4. Aparición del Tesoro
    setTimeout(() => {
        this.style.display = 'none';
        document.getElementById('reward-content').classList.add('visible');
    }, 2500);
});

// Generador de Confeti/Luz Rúnica
function createParticles(rect) {
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const modal = document.getElementById('secret-modal');
    
    for(let i=0; i<40; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        p.style.left = cx + 'px';
        p.style.top = cy + 'px';
        
        // Coordenadas esféricas puras
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 250 + 50;
        p.style.setProperty('--tx', (Math.cos(angle) * distance) + 'px');
        p.style.setProperty('--ty', (Math.sin(angle) * distance) + 'px');
        
        p.style.animation = `explode ${Math.random() * 1 + 0.8}s ease-out forwards`;
        modal.appendChild(p);
        
        // Limpiar DOM
        setTimeout(() => p.remove(), 2000);
    }
}

// Event Listeners (UI Click)
document.querySelectorAll('.ocarina-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        if(btn.id === 'btn-secret') return;
        const note = btn.getAttribute('data-note');
        handleInput(note);
        btn.blur(); // Focus loss: previene accion repetida si el usuario pulsa espacio
    });
});

// Event Listeners (Teclado Físico)
document.addEventListener('keydown', (e) => {
    const note = keyMap[e.key] || keyMap[e.key.toLowerCase()];
    
    if (note) {
        // Bloquear default (ej. Scroll con barra espaciadora) excepto en forms
        if(e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
            e.preventDefault();
        }
        // Evitar trigger múltiple si se deja presionado
        if (!e.repeat) {
            handleInput(note);
        }
    }
});

// Botón de desarrollador para evitar tocar todo obligatoriamente
document.getElementById('btn-secret').addEventListener('click', () => {
    triggerEasterEgg();
});

// Bootstrap Inicial
document.addEventListener('DOMContentLoaded', () => {
    initSongbook();
});
