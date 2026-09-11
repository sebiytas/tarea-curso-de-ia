/**
 * @file outfit-matcher.js
 * @description Lógica del DOM para el generador, validación de inventario
 * y algoritmo de emparejamiento.
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // Iniciar Módulo Base
    if(!window.WardrobeManager || !window.ColorTheory) {
        console.error("Dependencias faltantes: ColorTheory o WardrobeManager no cargados.");
        return;
    }
    
    WardrobeManager.init();

    // ------------------------------------------------------------------------
    // VARIABLES DOM (FORMULARIO ALTA)
    // ------------------------------------------------------------------------
    const typeButtons = document.querySelectorAll('.type-btn');
    let selectedType = 'gorra';
    const inputName = document.getElementById('color-name');
    const inputColor = document.getElementById('color-picker');
    const hexDisplay = document.getElementById('hex-display');
    const btnAdd = document.getElementById('add-garment-btn');
    const inventoryGrid = document.getElementById('wardrobe-inventory');
    const ariaLive = document.getElementById('aria-live-region');

    // ------------------------------------------------------------------------
    // VARIABLES DOM (GENERADOR)
    // ------------------------------------------------------------------------
    const btnGenerate = document.getElementById('generate-outfit-btn');
    const mannequinSection = document.getElementById('mannequin-result');
    const resGorra = document.getElementById('result-gorra');
    const resCamiseta = document.getElementById('result-camiseta');
    const resPantalon = document.getElementById('result-pantalon');
    const resExplanation = document.getElementById('result-explanation');

    // ------------------------------------------------------------------------
    // LOGICA INTERFAZ DE ALTA DE PRENDAS
    // ------------------------------------------------------------------------
    
    // Selección de Tipo
    typeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            typeButtons.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            selectedType = e.target.getAttribute('data-type');
        });
    });

    // Vincular Inputs de Color usando WardrobeManager
    WardrobeManager.bindColorInputs(inputName, inputColor, (hex, matchedName) => {
        hexDisplay.textContent = hex;
    });

    // Al cambiar explícitamente el color picker, actualizar display
    inputColor.addEventListener('input', (e) => {
        hexDisplay.textContent = e.target.value.toUpperCase();
    });

    // Agregar Prenda
    btnAdd.addEventListener('click', () => {
        const hex = inputColor.value;
        const name = inputName.value.trim() || 'Color Personalizado';
        
        WardrobeManager.addItem(selectedType, hex, name);
        renderInventory();
        
        // Feedback
        ariaLive.textContent = `Se ha añadido una prenda tipo ${selectedType} en color ${name} a tu armario.`;
        inputName.value = '';
        inputName.style.borderColor = 'var(--denim-light)';
    });

    // ------------------------------------------------------------------------
    // RENDERIZADO DEL INVENTARIO
    // ------------------------------------------------------------------------
    window.deleteItem = function(id) {
        WardrobeManager.removeItem(id);
        renderInventory();
        ariaLive.textContent = "Prenda eliminada del armario.";
    };

    function renderInventory() {
        const items = WardrobeManager.getAllItems();
        inventoryGrid.innerHTML = '';

        if(items.length === 0) {
            inventoryGrid.innerHTML = '<p style="color:var(--text-muted); font-size:0.9rem; grid-column: 1/-1;">Tu armario está vacío.</p>';
            return;
        }

        // Agrupar visualmente u ordenar, aquí directo
        items.forEach(item => {
            // Determinar silueta para el inventario basado en el tipo
            let silhouetteClass = '';
            let scale = 1;
            if(item.type === 'gorra') { silhouetteClass = 'silueta-gorra'; scale = 0.5; }
            if(item.type === 'camiseta') { silhouetteClass = 'silueta-camiseta'; scale = 0.4; }
            if(item.type === 'pantalon') { silhouetteClass = 'silueta-pantalon'; scale = 0.35; }

            const div = document.createElement('div');
            div.className = 'inventory-item';
            div.innerHTML = `
                <button class="delete-btn" onclick="deleteItem('${item.id}')" aria-label="Eliminar ${item.name}">×</button>
                <div class="silueta-wrapper ${silhouetteClass}" style="background-color: ${item.hex}; transform: scale(${scale}); margin-bottom: -30px;"></div>
                <div style="text-align: center; margin-top: 10px; width: 100%;">
                    <p style="font-size: 0.8rem; font-weight: bold; color: var(--denim-dark); text-transform: capitalize;">${item.type}</p>
                    <p style="font-size: 0.75rem; font-family: var(--font-mono); text-overflow: ellipsis; overflow: hidden; white-space: nowrap;" title="${item.name}">${item.name}</p>
                </div>
            `;
            inventoryGrid.appendChild(div);
        });
    }

    renderInventory();

    // ------------------------------------------------------------------------
    // ALGORITMO DE EMPAREJAMIENTO DE OUTFITS
    // ------------------------------------------------------------------------
    
    function generateOutfit() {
        const pantalones = WardrobeManager.getItemsByType('pantalon');
        const camisetas = WardrobeManager.getItemsByType('camiseta');
        const gorras = WardrobeManager.getItemsByType('gorra');

        if (pantalones.length === 0 || camisetas.length === 0) {
            alert("Necesitas al menos un pantalón y una camiseta en tu armario para generar combinaciones.");
            return;
        }

        // Estrategia: Elegir un pantalón al azar como BASE.
        const pantalonBase = pantalones[Math.floor(Math.random() * pantalones.length)];
        let topElegido = null;
        let gorraElegida = null;
        let razonamiento = "";

        // Regla 1: Si la base es un color Neutro, la camiseta puede ser cualquiera (ideal vibrante).
        if (pantalonBase.isNeutral) {
            // Buscar camiseta vibrante (no neutra)
            const topsVibrantes = camisetas.filter(c => !c.isNeutral);
            if (topsVibrantes.length > 0) {
                topElegido = topsVibrantes[Math.floor(Math.random() * topsVibrantes.length)];
                razonamiento = `<strong>Regla del Neutro Base:</strong> El pantalón '${pantalonBase.name}' actúa como lienzo neutro, permitiendo que la camisa '${topElegido.name}' destaque sin sobrecargar visualmente.`;
            } else {
                // Monocromo neutro o casualidad
                topElegido = camisetas[Math.floor(Math.random() * camisetas.length)];
                razonamiento = `<strong>Armonía Neutra/Minimalista:</strong> Tanto la base '${pantalonBase.name}' como el top '${topElegido.name}' son tonos neutros, logrando un estilo sobrio y elegante.`;
            }
        } else {
            // Regla 2: Si la base es de Color Vivo, buscar camiseta neutra para equilibrar
            const topsNeutros = camisetas.filter(c => c.isNeutral);
            if (topsNeutros.length > 0) {
                topElegido = topsNeutros[Math.floor(Math.random() * topsNeutros.length)];
                razonamiento = `<strong>Equilibrio de Color:</strong> Dado que el pantalón '${pantalonBase.name}' es el foco de color, se usa la camisa neutra '${topElegido.name}' para relajar la vista.`;
            } else {
                // Fallback audaz: Color block (Cuidado con los choques)
                topElegido = camisetas[Math.floor(Math.random() * camisetas.length)];
                razonamiento = `<strong>Color Block:</strong> Dos piezas no-neutras ('${pantalonBase.name}' y '${topElegido.name}'). Un estilo audaz de alto impacto visual.`;
            }
        }

        // Asignar gorra (Accesorio)
        if (gorras.length > 0) {
            // Intentar buscar una gorra que empate (complemente) con la camisa, o que sea neutra
            const gorrasNeutras = gorras.filter(g => g.isNeutral);
            if (topElegido.isNeutral && !pantalonBase.isNeutral && gorras.length > 0) {
                 gorraElegida = gorras[Math.floor(Math.random() * gorras.length)];
            } else if (gorrasNeutras.length > 0) {
                gorraElegida = gorrasNeutras[Math.floor(Math.random() * gorrasNeutras.length)];
            } else {
                gorraElegida = gorras[Math.floor(Math.random() * gorras.length)];
            }
            razonamiento += `<br><br>La gorra en '${gorraElegida.name}' remata el conjunto como un acento cromático.`;
        } else {
            razonamiento += `<br><br>No tienes accesorios de cabeza registrados.`;
        }

        // RENDERIZAR RESULTADO EN MANIQUÍ
        mannequinSection.style.display = 'block';
        
        resPantalon.style.backgroundColor = pantalonBase.hex;
        resCamiseta.style.backgroundColor = topElegido.hex;
        
        if (gorraElegida) {
            resGorra.style.display = 'block';
            resGorra.style.backgroundColor = gorraElegida.hex;
        } else {
            resGorra.style.display = 'none';
        }

        resExplanation.innerHTML = razonamiento;
        
        // Scroll y Accesibilidad
        mannequinSection.scrollIntoView({ behavior: 'smooth' });
        ariaLive.textContent = "Combinación generada con éxito. Revisa el Maniquí de Costura.";
    }

    btnGenerate.addEventListener('click', generateOutfit);

});
