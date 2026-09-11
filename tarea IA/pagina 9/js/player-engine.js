/**
 * js/player-engine.js
 * Controlador interactivo del reproductor de música,
 * renderizado del catálogo, filtros y simulación con Web Audio API.
 */

class PlayerEngine {
  constructor() {
    this.catalog = window.LoMicroTDCatalog || [];
    this.currentTrack = null;
    this.isPlaying = false;
    
    // Web Audio API Synth (Simulador)
    this.audioCtx = null;
    this.oscillator = null;
    this.gainNode = null;
    
    // Playback state
    this.progressInterval = null;
    this.elapsedSeconds = 0;
    this.totalSeconds = 0;

    // Inicializar todo
    this.initCatalog();
    this.initHeroPlayer();
    this.initStickyPlayer();
  }

  // === RENDERIZADO Y FILTROS === //
  
  initCatalog() {
    this.grid = document.getElementById('musicGrid');
    if (!this.grid) return; // Si no estamos en la página de discografía, salir.

    this.searchInput = document.getElementById('searchInput');
    this.filterBtns = document.querySelectorAll('.filter-btn');
    this.noResultsMsg = document.getElementById('noResultsMsg');

    this.renderGrid(this.catalog);

    // Búsqueda en tiempo real
    this.searchInput.addEventListener('input', (e) => {
      this.applyFilters();
    });

    // Filtros por botones
    this.filterBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.filterBtns.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        this.applyFilters();
      });
    });
  }

  applyFilters() {
    const searchTerm = this.searchInput.value.toLowerCase();
    const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;

    const filtered = this.catalog.filter(track => {
      const matchSearch = track.title.toLowerCase().includes(searchTerm) || track.year.toString().includes(searchTerm);
      const matchFilter = activeFilter === 'all' || track.type === activeFilter;
      return matchSearch && matchFilter;
    });

    this.renderGrid(filtered);
  }

  renderGrid(data) {
    // Limpiar grid (excepto el mensaje de no results)
    Array.from(this.grid.children).forEach(child => {
      if(child.id !== 'noResultsMsg') child.remove();
    });

    if (data.length === 0) {
      this.noResultsMsg.style.display = 'block';
      return;
    } else {
      this.noResultsMsg.style.display = 'none';
    }

    data.forEach(track => {
      const card = document.createElement('div');
      card.className = 'track-card';
      
      const isCurrentlyPlaying = this.currentTrack && this.currentTrack.id === track.id && this.isPlaying;

      card.innerHTML = `
        <div class="track-header">
          <img src="\${track.coverUrl}" alt="Portada \${track.title}" class="track-cover-sm" onerror="this.classList.add('error')">
          <div class="track-info">
            <h3 class="track-title">\${track.title}</h3>
            <div class="track-meta">\${track.year} • \${track.duration}</div>
            <div class="track-role">\${track.role}</div>
          </div>
        </div>
        <div class="track-actions">
          <button class="btn-play-preview" data-id="\${track.id}" aria-label="Reproducir adelanto de \${track.title}">
            \${isCurrentlyPlaying ? '⏸ Pausar' : '▶ Escuchar'}
          </button>
          <button class="btn-lyrics" onclick="document.getElementById('lyrics-\${track.id}').classList.toggle('active')">
            Ver Letra
          </button>
          <div class="platform-links">
            <a href="\${track.spotifyUrl}" target="_blank" class="platform-link" aria-label="Spotify"><svg viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424c-.18.295-.563.387-.857.207-2.35-1.434-5.305-1.76-8.786-.963-.335.077-.67-.133-.746-.466-.076-.334.134-.67.467-.746 3.816-.874 7.086-.494 9.715 1.11.294.18.388.563.207.858zm1.22-2.735c-.226.368-.7.483-1.067.256-2.71-1.664-6.86-2.146-10.378-1.176-.413.114-.836-.128-.95-.54-.114-.413.127-.836.54-.95 3.99-1.1 8.625-.56 11.6 1.267.368.226.483.7.255 1.066zm.135-2.885c-3.262-1.936-8.65-2.116-11.758-1.17-.487.147-1.002-.128-1.15-.615-.146-.487.127-1.002.614-1.15 3.567-1.085 9.53-.87 13.293 1.365.437.26.58.835.32 1.272-.26.438-.836.58-1.272.32h-.047z"/></svg></a>
            <a href="\${track.youtubeUrl}" target="_blank" class="platform-link" aria-label="YouTube"><svg viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg></a>
          </div>
        </div>
        <div class="lyrics-container" id="lyrics-\${track.id}">
          \${track.lyrics}
        </div>
      `;

      // Event Listener para reproducir
      const playBtn = card.querySelector('.btn-play-preview');
      playBtn.addEventListener('click', () => {
        this.togglePlayTrack(track);
      });

      this.grid.appendChild(card);
    });
  }

  // === LÓGICA DE REPRODUCCIÓN Y WEB AUDIO API === //

  initAudioSynth() {
    if (this.audioCtx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.audioCtx = new AudioContext();
    
    // Crear un sonido tipo bajo/pad atmosférico suave
    this.oscillator = this.audioCtx.createOscillator();
    this.oscillator.type = 'sine';
    this.oscillator.frequency.value = 65; // C2 aprox (bajos)

    const filter = this.audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 300;

    this.gainNode = this.audioCtx.createGain();
    this.gainNode.gain.value = 0; // Inicia silenciado

    this.oscillator.connect(filter);
    filter.connect(this.gainNode);
    this.gainNode.connect(this.audioCtx.destination);
    
    this.oscillator.start();
  }

  setVolume(val) {
    if(this.gainNode) {
      // Mapear de 0-100 a 0-0.3 (para que no sea muy ruidoso)
      this.gainNode.gain.setTargetAtTime((val / 100) * 0.3, this.audioCtx.currentTime, 0.1);
    }
  }

  togglePlayTrack(track) {
    if (!this.audioCtx) this.initAudioSynth();

    // Si hace click en la que ya está sonando, pausar o despausar
    if (this.currentTrack && this.currentTrack.id === track.id) {
      if (this.isPlaying) {
        this.pause();
      } else {
        this.play();
      }
    } else {
      // Es una nueva pista
      this.currentTrack = track;
      this.elapsedSeconds = 0;
      
      // Parsear la duración ej "3:42" a segundos
      const parts = track.duration.split(':');
      this.totalSeconds = parseInt(parts[0]) * 60 + parseInt(parts[1]);

      // Actualizar UI del Sticky Player
      this.updateStickyPlayerUI();
      
      // Mostrar Sticky Player
      const stPlayer = document.getElementById('stickyPlayer');
      if(stPlayer) {
        stPlayer.classList.add('visible');
        stPlayer.setAttribute('aria-hidden', 'false');
      }

      this.play();
    }
  }

  play() {
    if(!this.currentTrack) return;
    if(this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    
    this.isPlaying = true;
    if(this.gainNode) {
      this.gainNode.gain.setTargetAtTime(0.2, this.audioCtx.currentTime, 0.5); // Fade In
    }

    // Iniciar loop de progreso
    clearInterval(this.progressInterval);
    this.progressInterval = setInterval(() => {
      this.elapsedSeconds++;
      this.updateProgressUI();
      if(this.elapsedSeconds >= this.totalSeconds) {
        this.pause(); // Finalizó
      }
    }, 1000);

    this.syncAllUIStates();
  }

  pause() {
    this.isPlaying = false;
    if(this.gainNode) {
      this.gainNode.gain.setTargetAtTime(0, this.audioCtx.currentTime, 0.2); // Fade Out
    }
    clearInterval(this.progressInterval);
    this.syncAllUIStates();
  }

  // === SINCRONIZACIÓN DE INTERFACES === //

  syncAllUIStates() {
    // 1. Botones del Grid en Discografía
    if (this.grid) {
      const allBtns = this.grid.querySelectorAll('.btn-play-preview');
      allBtns.forEach(btn => {
        const id = btn.getAttribute('data-id');
        if (this.currentTrack && id === this.currentTrack.id) {
          btn.innerHTML = this.isPlaying ? '⏸ Pausar' : '▶ Escuchar';
        } else {
          btn.innerHTML = '▶ Escuchar';
        }
      });
    }

    // 2. Sticky Player
    const stPlayBtn = document.getElementById('stPlayBtn');
    const stEq = document.getElementById('stEq');
    if (stPlayBtn) {
      stPlayBtn.innerHTML = this.isPlaying 
        ? '<svg viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>' // Pause icon
        : '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>'; // Play icon
    }
    if (stEq) {
      if(this.isPlaying) stEq.classList.add('playing');
      else stEq.classList.remove('playing');
    }

    // 3. Hero Player (si existe en Index)
    const heroPlayBtn = document.getElementById('heroPlayBtn');
    const heroEq = document.getElementById('heroEq');
    if (heroPlayBtn && this.currentTrack && this.currentTrack.id === 'track-001') {
      heroPlayBtn.innerHTML = this.isPlaying 
        ? '<svg viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>' 
        : '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>';
      
      if(this.isPlaying) heroEq.classList.add('playing');
      else heroEq.classList.remove('playing');
    }
  }

  updateStickyPlayerUI() {
    const stCover = document.getElementById('stCover');
    const stTitle = document.getElementById('stTitle');
    const stDuration = document.getElementById('stDuration');
    
    if(stCover) stCover.src = this.currentTrack.coverUrl;
    if(stTitle) stTitle.textContent = this.currentTrack.title;
    if(stDuration) stDuration.textContent = this.currentTrack.duration;
  }

  updateProgressUI() {
    const mins = Math.floor(this.elapsedSeconds / 60);
    const secs = this.elapsedSeconds % 60;
    const timeStr = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    const percent = (this.elapsedSeconds / this.totalSeconds) * 100;

    // Actualizar Sticky Player
    const stCurrentTime = document.getElementById('stCurrentTime');
    const stProgressFill = document.getElementById('stProgressFill');
    if(stCurrentTime) stCurrentTime.textContent = timeStr;
    if(stProgressFill) stProgressFill.style.width = `${percent}%`;

    // Actualizar Hero Player si la canción actual es el track 001
    if (this.currentTrack && this.currentTrack.id === 'track-001') {
      const heroCurrentTime = document.getElementById('heroCurrentTime');
      const heroProgressFill = document.getElementById('heroProgressFill');
      if(heroCurrentTime) heroCurrentTime.textContent = timeStr;
      if(heroProgressFill) heroProgressFill.style.width = `${percent}%`;
    }
  }

  // === INICIALIZADORES DE LOS REPRODUCTORES === //

  initHeroPlayer() {
    const heroPlayBtn = document.getElementById('heroPlayBtn');
    if(heroPlayBtn) {
      heroPlayBtn.addEventListener('click', () => {
        // En el Hero siempre se asume que es la pista 001
        const heroTrack = this.catalog.find(t => t.id === 'track-001');
        if(heroTrack) this.togglePlayTrack(heroTrack);
      });

      // Volumen del Hero
      const volSlider = document.querySelector('.volume-slider');
      if(volSlider) {
        volSlider.addEventListener('input', (e) => {
          this.setVolume(e.target.value);
        });
      }
    }
  }

  initStickyPlayer() {
    const stPlayBtn = document.getElementById('stPlayBtn');
    const stCloseBtn = document.getElementById('stCloseBtn');
    const stPlayer = document.getElementById('stickyPlayer');

    if(stPlayBtn) {
      stPlayBtn.addEventListener('click', () => {
        if(this.isPlaying) this.pause();
        else this.play();
      });
    }

    if(stCloseBtn && stPlayer) {
      stCloseBtn.addEventListener('click', () => {
        this.pause();
        stPlayer.classList.remove('visible');
        stPlayer.setAttribute('aria-hidden', 'true');
      });
    }
  }
}

// Inicializar cuando DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  window.loMicroPlayer = new PlayerEngine();
});
