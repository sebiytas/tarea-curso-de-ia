/**
 * Motor del Catálogo - Ciara Creativa
 * Gestiona el renderizado de productos, filtros en tiempo real, búsqueda,
 * persistencia de favoritos y manipulación del modal.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Inicialización y Validación
    if (typeof window.catalogData === 'undefined') {
        console.error("Base de datos 'catalogData' no encontrada. Verifica la carga del script.");
        return;
    }

    const data = window.catalogData;
    const grid = document.getElementById('catalog-grid');
    const searchInput = document.getElementById('searchInput');
    const filterBtns = document.querySelectorAll('.btn-filter');
    const ariaAnnouncer = document.getElementById('aria-announcer');

    // Nodos del Modal
    const modalOverlay = document.getElementById('product-modal');
    const btnCloseModal = document.getElementById('close-modal');
    
    // Estado del Motor
    let currentFilter = 'all';
    let currentSearch = '';
    
    // Lista de Deseos (Persistencia en localStorage)
    let wishlist = JSON.parse(localStorage.getItem('ciara_wishlist')) || [];

    // --- RENDERIZADO INICIAL ---
    renderCatalog(data);

    // --- EVENT LISTENERS PRINCIPALES ---
    
    // Búsqueda Textual Reactiva
    searchInput.addEventListener('input', (e) => {
        currentSearch = e.target.value.toLowerCase().trim();
        updateCatalog();
    });

    // Filtros por Categoría (Estilo etiquetas colgantes)
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Actualización visual de la botonera
            filterBtns.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-pressed', 'false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-pressed', 'true');
            
            // Actualización del estado interno
            currentFilter = btn.getAttribute('data-filter');
            updateCatalog();
        });
    });

    // --- LÓGICA CORE DE FILTRADO ---
    function updateCatalog() {
        const filteredData = data.filter(item => {
            // Evaluador de categoría
            const matchCategory = currentFilter === 'all' || item.category === currentFilter;
            
            // Evaluador de texto múltiple (nombre, tipo, detalles)
            const matchSearch = item.name.toLowerCase().includes(currentSearch) ||
                                item.categoryLabel.toLowerCase().includes(currentSearch) ||
                                item.description.toLowerCase().includes(currentSearch);
            
            return matchCategory && matchSearch;
        });

        renderCatalog(filteredData);
        
        // Reporte de accesibilidad WCAG
        ariaAnnouncer.textContent = `Mostrando ${filteredData.length} agenda${filteredData.length !== 1 ? 's' : ''} encontrada${filteredData.length !== 1 ? 's' : ''}.`;
    }

    // --- RENDERIZADOR DE DOM ---
    function renderCatalog(items) {
        grid.innerHTML = ''; // Limpiar grilla
        
        // Estado Vacío (Empty State)
        if (items.length === 0) {
            grid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 2rem; color: var(--text-pencil);">
                    <p style="font-family: var(--font-serif); font-size: 1.5rem; font-style: italic;">Oh no, no encontramos esa agenda...</p>
                    <p>Intenta con otras palabras o contáctanos para diseñarla desde cero para ti.</p>
                </div>
            `;
            return;
        }

        // Construcción de tarjetas (Nodos HTML)
        items.forEach(item => {
            const isFav = wishlist.includes(item.id);
            const favIcon = isFav ? '♥' : '♡';
            const favColorStyle = isFav ? 'color: var(--rose-deep); background: var(--paper-rose); border-color: var(--rose-dust);' : '';
            
            const article = document.createElement('article');
            article.className = 'paper-card';
            article.setAttribute('aria-labelledby', `title-${item.id}`);
            
            // Render de la Ficha
            article.innerHTML = `
                <div class="card-image-placeholder" aria-hidden="true">
                    <!-- Se carga el SVG renderizado desde la BD -->
                    <img src="${item.image}" alt="Render visual de ${item.name}" loading="lazy">
                </div>
                <div class="card-tag">${item.categoryLabel}</div>
                <h4 id="title-${item.id}" style="color: var(--text-charcoal); font-size: 1.3rem; min-height: 3rem; line-height: 1.2;">${item.name}</h4>
                <p class="card-price">${item.price}</p>
                
                <div class="paper-card-content" style="flex-grow: 0; padding-bottom: 1.5rem; border-bottom: 1px dashed var(--line-grid); margin-bottom: 1.5rem;">
                    <ul style="list-style: none; padding: 0; font-size: 0.95rem; color: var(--text-pencil);">
                        <li style="margin-bottom: 0.4rem;">📏 <strong>Formato:</strong> ${item.size}</li>
                        <li>📜 <strong>Papel:</strong> ${item.paper.split('(')[0].trim()}</li>
                    </ul>
                </div>
                
                <div style="display: flex; flex-direction: column; gap: 0.8rem; margin-top: auto;">
                    <button class="btn-primary btn-details" data-id="${item.id}" aria-label="Ver ficha completa de ${item.name}">Ver Ficha Completa</button>
                    <button class="btn-secondary btn-wish" data-id="${item.id}" style="${favColorStyle}" aria-label="Añadir a lista de deseos">
                        <span style="font-size: 1.2rem; margin-right: 5px;">${favIcon}</span> Guardar
                    </button>
                </div>
            `;
            grid.appendChild(article);
        });

        // Re-adjuntar eventos a los elementos generados dinámicamente
        attachDynamicEventListeners();
    }

    function attachDynamicEventListeners() {
        // Apertura de Modal
        document.querySelectorAll('.btn-details').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                openModal(id);
            });
        });
        
        // Acción de Favoritos
        document.querySelectorAll('.btn-wish').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                toggleWishlist(id, e.currentTarget);
            });
        });
    }

    // --- GESTIÓN DE FAVORITOS (LOCALSTORAGE) ---
    function toggleWishlist(id, buttonEl) {
        const isFav = wishlist.includes(id);
        
        if (isFav) {
            // Remover
            wishlist = wishlist.filter(itemId => itemId !== id);
            buttonEl.innerHTML = '<span style="font-size: 1.2rem; margin-right: 5px;">♡</span> Guardar';
            buttonEl.style.backgroundColor = 'transparent';
            buttonEl.style.color = 'var(--rose-deep)';
            buttonEl.style.borderColor = 'var(--rose-dust)';
        } else {
            // Añadir
            wishlist.push(id);
            buttonEl.innerHTML = '<span style="font-size: 1.2rem; margin-right: 5px;">♥</span> Guardado';
            buttonEl.style.backgroundColor = 'var(--paper-rose)';
            buttonEl.style.color = 'var(--rose-deep)';
            buttonEl.style.borderColor = 'var(--rose-dust)';
        }
        
        // Persistir de forma desacoplada
        localStorage.setItem('ciara_wishlist', JSON.stringify(wishlist));
    }

    // --- GESTIÓN DEL MODAL INTERACTIVO ---
    function openModal(id) {
        const item = data.find(i => i.id === id);
        if (!item) return;

        // Inyectar datos en el DOM del Modal
        document.getElementById('modal-image-container').innerHTML = `<img src="${item.image}" alt="Vista de ${item.name}" style="width: 100%; height: auto; display: block;">`;
        document.getElementById('modal-category').textContent = item.categoryLabel;
        document.getElementById('modal-title').textContent = item.name;
        document.getElementById('modal-price').textContent = item.price;
        document.getElementById('modal-desc').textContent = item.description;
        document.getElementById('modal-size').textContent = item.size;
        document.getElementById('modal-paper').textContent = item.paper;
        document.getElementById('modal-binding').textContent = item.binding;
        document.getElementById('modal-closure').textContent = item.closure;
        document.getElementById('modal-extras').textContent = item.extras;

        // Configurar botón de favoritos dentro del modal
        const btnModalWish = document.getElementById('btn-wishlist');
        btnModalWish.innerHTML = wishlist.includes(id) ? '♥ En tu Lista' : '♡ Añadir a Mi Lista';
        btnModalWish.onclick = () => {
            toggleWishlist(id, btnModalWish);
            updateCatalog(); // Sincroniza la cuadrícula de fondo visualmente
        };

        // Generar enlace de cotización dinámica simulado hacia la página de contacto
        const quoteBtn = document.getElementById('btn-quote');
        quoteBtn.href = `redes-contacto.html?modelo=${encodeURIComponent(item.name)}`;

        // Apertura Visual (CSS Transition)
        modalOverlay.classList.add('open');
        
        // Accesibilidad (Foco y bloqueo de fondo)
        btnCloseModal.focus();
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modalOverlay.classList.remove('open');
        document.body.style.overflow = ''; // Restaurar scroll
    }

    // Eventos de Cierre
    btnCloseModal.addEventListener('click', closeModal);
    
    // Cierre por clic en el overlay (fuera del contenido)
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });

    // Cierre por teclado (Escape)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay.classList.contains('open')) {
            closeModal();
            // Retornar foco (mejora UX)
            document.querySelector('.search-input').focus();
        }
    });
});
