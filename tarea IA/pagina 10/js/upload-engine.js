/**
 * UPLOAD-ENGINE.JS
 * Validación exhaustiva del formulario de carga, conversor de imágenes a previsualizaciones locales (Base64)
 * y generación de nuevo registro hacia el LocalStorage a través de vault-storage.js.
 */

class UploadEngine {
  constructor() {
    // Form Elements
    this.form = document.getElementById('upload-form');
    this.titleInput = document.getElementById('game-title');
    this.authorInput = document.getElementById('game-author');
    this.platformInput = document.getElementById('game-platform');
    this.yearInput = document.getElementById('game-year');
    this.descInput = document.getElementById('game-desc');
    this.linksInput = document.getElementById('game-links');
    this.coverInput = document.getElementById('game-cover');
    this.dropArea = document.getElementById('cover-drop-area');
    this.submitBtn = document.getElementById('submit-btn');
    
    // Preview Elements
    this.prevTitle = document.getElementById('preview-title');
    this.prevAuthor = document.getElementById('preview-author');
    this.prevPlatform = document.querySelector('#preview-platform span');
    this.prevYear = document.getElementById('preview-year');
    this.prevDesc = document.getElementById('preview-desc');
    this.prevImg = document.getElementById('preview-img');
    this.prevImgPlaceholder = document.getElementById('preview-img-placeholder');
    
    // Modals
    this.successModal = document.getElementById('success-modal');

    // Data state
    this.currentCoverBase64 = null;

    this.init();
  }

  init() {
    this.bindLivePreview();
    this.bindDragAndDrop();
    this.bindFormSubmission();
  }

  bindLivePreview() {
    const updateText = (element, input, fallback) => {
      input.addEventListener('input', () => {
        element.textContent = input.value.trim() || fallback;
      });
    };

    updateText(this.prevTitle, this.titleInput, 'Título del Videojuego');
    
    this.authorInput.addEventListener('input', () => {
      this.prevAuthor.textContent = `Autor: ${this.authorInput.value.trim() || '-'}`;
    });

    this.yearInput.addEventListener('input', () => {
      this.prevYear.textContent = `Año: ${this.yearInput.value.trim() || '-'}`;
    });

    this.platformInput.addEventListener('change', () => {
      this.prevPlatform.textContent = `[ ${this.platformInput.value || 'Plataforma'} ]`;
    });

    this.descInput.addEventListener('input', () => {
      const text = this.descInput.value.trim();
      this.prevDesc.textContent = text ? (text.length > 120 ? text.substring(0, 120) + '...' : text) : 'La sinopsis y los datos técnicos aparecerán aquí...';
    });
  }

  bindDragAndDrop() {
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
      this.dropArea.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
      e.preventDefault();
      e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
      this.dropArea.addEventListener(eventName, () => this.dropArea.classList.add('dragover'), false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
      this.dropArea.addEventListener(eventName, () => this.dropArea.classList.remove('dragover'), false);
    });

    this.dropArea.addEventListener('drop', (e) => {
      const dt = e.dataTransfer;
      const files = dt.files;
      this.handleFiles(files);
    }, false);

    this.coverInput.addEventListener('change', (e) => {
      this.handleFiles(this.coverInput.files);
    });
  }

  handleFiles(files) {
    if (files.length === 0) return;
    const file = files[0];
    
    // Validate is image
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecciona un archivo de imagen válido (.jpg, .png, .webp).');
      return;
    }

    // Convert to Base64 for Preview and Storage
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.currentCoverBase64 = reader.result;
      this.prevImg.src = this.currentCoverBase64;
      this.prevImg.style.display = 'block';
      this.prevImgPlaceholder.style.display = 'none';
      
      // Update drop area text
      const msg = this.dropArea.querySelector('.file-drop-message');
      msg.textContent = `Imagen cargada: ${file.name}`;
      msg.style.color = 'var(--aqua-primary)';
    };
    reader.onerror = (error) => {
      console.error('Error procesando imagen:', error);
      alert('Error procesando la imagen. Intenta con otra.');
    };
  }

  bindFormSubmission() {
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();

      // UI Feedback
      const btnTextOriginal = this.submitBtn.innerHTML;
      this.submitBtn.innerHTML = '<span class="vault-status__dot" style="display:inline-block; margin-right:8px;"></span> PROCESANDO PROTOCOLO...';
      this.submitBtn.disabled = true;

      // Extract Data
      const newGameData = {
        title: this.titleInput.value.trim(),
        author: this.authorInput.value.trim(),
        platform: this.platformInput.value,
        year: parseInt(this.yearInput.value, 10),
        description: this.descInput.value.trim(),
        links: this.linksInput.value.trim(),
        // If no image, VaultStorage will use DEFAULT_COVER logic or keep empty, but let's pass a placeholder if empty
        coverBase64: this.currentCoverBase64 || `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="%23101D33" stroke="%231E3B66" stroke-width="4"/><line x1="0" y1="0" x2="400" y2="300" stroke="%231E3B66" stroke-width="2"/><line x1="400" y1="0" x2="0" y2="300" stroke="%231E3B66" stroke-width="2"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="24" fill="%2300E5C9">SIN CARÁTULA</text></svg>`
      };

      // Simulate network delay to make it feel "real"
      setTimeout(() => {
        // Guardar en la bóveda
        window.vaultStorage.addGame(newGameData);
        
        // Show Success Modal
        this.successModal.classList.add('active');
        
        // Form Reset happens via navigation when clicking "Ver en el catálogo", 
        // but we ensure it's clean if they click outside
        this.form.reset();
        this.currentCoverBase64 = null;
        this.submitBtn.innerHTML = btnTextOriginal;
        this.submitBtn.disabled = false;
      }, 1000);
    });
  }
}

// Inicializar al cargar
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('upload-form')) {
    new UploadEngine();
  }
});
