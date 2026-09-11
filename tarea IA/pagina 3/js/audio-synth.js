/**
 * Motor de Síntesis de Audio Web (Web Audio API)
 * Replicador del timbre de viento de la Ocarina del Tiempo mediante osciladores modulares.
 * Resolviendo el requisito de CERO dependencias y sin MP3 externos.
 */

class OcarinaSynth {
    constructor() {
        // Inicialización diferida
        this.audioCtx = null;
        this.masterGain = null;
        
        // Frecuencias exactas aproximadas de la Ocarina de N64
        // A=Re, C-Down=Fa grave, C-Right=La, C-Left=Si, C-Up=Fa agudo
        this.frequencies = {
            'a': 587.33,     // D5
            'down': 349.23,  // F4
            'right': 440.00, // A4
            'left': 493.88,  // B4
            'up': 698.46     // F5
        };
    }

    init() {
        if (!this.audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.audioCtx = new AudioContext();
            
            // Ganancia maestra para control de volumen general
            this.masterGain = this.audioCtx.createGain();
            this.masterGain.gain.value = 0.6;
            this.masterGain.connect(this.audioCtx.destination);
        }
        // Desbloquear audio tras primera interaccion
        if (this.audioCtx.state === 'suspended') {
            this.audioCtx.resume();
        }
    }

    playNote(noteKey) {
        if (!this.frequencies[noteKey]) return;
        
        this.init();
        
        const freq = this.frequencies[noteKey];
        const time = this.audioCtx.currentTime;
        
        // 1. Oscilador Principal (Onda Triangular - emula el tono de flauta)
        const osc = this.audioCtx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, time);
        
        // 2. Oscilador Secundario (Onda Senoidal - aporta cuerpo armónico fundamental)
        const oscSub = this.audioCtx.createOscillator();
        oscSub.type = 'sine';
        oscSub.frequency.setValueAtTime(freq, time);
        
        // Envolvente de Ganancia (ADSR para imitar el flujo de aire al soplar)
        const gainNode = this.audioCtx.createGain();
        gainNode.gain.setValueAtTime(0, time);
        // Attack rápido
        gainNode.gain.linearRampToValueAtTime(1, time + 0.05);
        // Decay/Sustain prolongado
        gainNode.gain.exponentialRampToValueAtTime(0.7, time + 0.1);
        // Release gradual (duración ~0.8s)
        gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.8);
        
        // Cadena de conexion
        osc.connect(gainNode);
        oscSub.connect(gainNode);
        gainNode.connect(this.masterGain);
        
        // Disparo
        osc.start(time);
        oscSub.start(time);
        
        osc.stop(time + 0.85);
        oscSub.stop(time + 0.85);
    }
    
    // Jingle legendario de "Descubrimiento / Canción Aprendida"
    playSuccessJingle() {
        this.init();
        const time = this.audioCtx.currentTime;
        // Acorde luminoso en secuencia rápida
        const notes = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5
        
        notes.forEach((freq, i) => {
            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.value = freq;
            
            const t = time + (i * 0.12); // Arpegio espaciado
            gain.gain.setValueAtTime(0, t);
            gain.gain.linearRampToValueAtTime(0.4, t + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
            
            osc.connect(gain);
            gain.connect(this.masterGain);
            
            osc.start(t);
            osc.stop(t + 0.6);
        });
    }

    // Efecto cinemático: Apertura de Cofre del Tesoro
    playChestOpenSound() {
        this.init();
        const time = this.audioCtx.currentTime;
        
        // Glissando ascendente de expectación (Sawtooth)
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(100, time);
        osc.frequency.exponentialRampToValueAtTime(800, time + 2);
        
        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(0.15, time + 0.1);
        gain.gain.linearRampToValueAtTime(0.15, time + 2);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 2.5);
        
        osc.connect(gain);
        gain.connect(this.masterGain);
        
        osc.start(time);
        osc.stop(time + 2.5);
        
        // Golpe triunfal de Fanfarria tras la apertura
        setTimeout(() => {
            if(this.audioCtx.state === 'suspended') return;
            const time2 = this.audioCtx.currentTime;
            [523.25, 659.25, 783.99, 1046.50].forEach(freq => { // C Mayor
                const oscT = this.audioCtx.createOscillator();
                const gainT = this.audioCtx.createGain();
                oscT.type = 'triangle';
                oscT.frequency.value = freq;
                
                gainT.gain.setValueAtTime(0, time2);
                gainT.gain.linearRampToValueAtTime(0.4, time2 + 0.1);
                gainT.gain.exponentialRampToValueAtTime(0.001, time2 + 3);
                
                oscT.connect(gainT);
                gainT.connect(this.masterGain);
                
                oscT.start(time2);
                oscT.stop(time2 + 3.1);
            });
        }, 2500); // 2.5s después del sonido de apertura
    }
}

// Instanciar motor globalmente
const synth = new OcarinaSynth();
