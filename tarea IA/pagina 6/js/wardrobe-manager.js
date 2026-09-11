/**
 * @file wardrobe-manager.js
 * @description Módulo de gestión del guardarropa personal en localStorage y 
 * herramientas de sincronización de inputs de color (Rueda <-> Texto).
 */

const WardrobeManager = {
    STORAGE_KEY: 'atelier_cozy_wardrobe',
    inventory: [],

    /**
     * Inicializa el inventario cargando desde localStorage
     */
    init: function() {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (stored) {
            try {
                this.inventory = JSON.parse(stored);
            } catch (e) {
                console.error("Error leyendo el armario del localStorage", e);
                this.inventory = [];
            }
        } else {
            // Si está vacío, cargar unas prendas base para demostrar (demo mode)
            this.inventory = [
                { id: this.generateId(), type: 'pantalon', hex: '#2E4B75', name: 'Blue Jean', isNeutral: true },
                { id: this.generateId(), type: 'camiseta', hex: '#FAF0E6', name: 'Lino', isNeutral: true },
                { id: this.generateId(), type: 'gorra', hex: '#000000', name: 'Negro', isNeutral: true }
            ];
            this.save();
        }
    },

    /**
     * Guarda el inventario actual en localStorage
     */
    save: function() {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.inventory));
    },

    /**
     * Genera un ID único para cada prenda
     */
    generateId: function() {
        return 'prenda_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
    },

    /**
     * Añade una nueva prenda al armario
     * @param {string} type - Tipo (gorra, camiseta, pantalon, calzado)
     * @param {string} hex - Código de color
     * @param {string} name - Nombre descriptivo
     */
    addItem: function(type, hex, name) {
        // Asume que window.ColorTheory está cargado para calcular si es neutro
        const isNeutral = window.ColorTheory ? window.ColorTheory.isNeutral(hex) : false;
        
        const newItem = {
            id: this.generateId(),
            type: type,
            hex: hex.toUpperCase(),
            name: name || 'Color Personalizado',
            isNeutral: isNeutral
        };
        
        this.inventory.push(newItem);
        this.save();
        return newItem;
    },

    /**
     * Elimina una prenda por su ID
     * @param {string} id 
     */
    removeItem: function(id) {
        this.inventory = this.inventory.filter(item => item.id !== id);
        this.save();
    },

    /**
     * Obtiene todo el inventario
     */
    getAllItems: function() {
        return this.inventory;
    },

    /**
     * Obtiene prendas filtradas por tipo
     * @param {string} type 
     */
    getItemsByType: function(type) {
        return this.inventory.filter(item => item.type === type);
    },

    // ------------------------------------------------------------------------
    // MÓDULO DE SINCRONIZACIÓN DE INTERFAZ (UI Sync)
    // ------------------------------------------------------------------------
    
    /**
     * Vincula un input de texto (nombre color) con un input color (rueda/picker)
     * para que al escribir un nombre, se actualice el visualizador, y viceversa.
     * @param {HTMLInputElement} textInput - Input donde el usuario escribe (ej. "mostaza")
     * @param {HTMLInputElement} colorInput - Input type="color" nativo o custom
     * @param {Function} onSyncCallback - Callback a ejecutar cuando cambie el color
     */
    bindColorInputs: function(textInput, colorInput, onSyncCallback) {
        if (!textInput || !colorInput || !window.ColorTheory) return;

        // Caso 1: El usuario escribe el nombre del color
        textInput.addEventListener('input', (e) => {
            const name = e.target.value;
            const hex = window.ColorTheory.getColorByName(name);
            
            if (hex) {
                // Sincronizar el selector visual
                colorInput.value = hex;
                
                // Efecto de feedback visual (bordes dorados = encontrado)
                textInput.style.borderColor = 'var(--stitch-gold)';
                textInput.style.outlineColor = 'var(--stitch-gold)';
                
                if(typeof onSyncCallback === 'function') onSyncCallback(hex, name);
            } else {
                // Modo no encontrado o escribiendo
                textInput.style.borderColor = 'var(--denim-light)';
                textInput.style.outlineColor = 'transparent';
            }
        });

        // Caso 2: El usuario usa el selector visual (Color Picker)
        colorInput.addEventListener('input', (e) => {
            const hex = e.target.value.toUpperCase();
            
            // Intentar hacer match reverso (buscar qué nombre se acerca a este HEX)
            // Para simplificar, buscamos si este HEX exacto existe en el diccionario
            let matchedName = null;
            for (const [name, dictionaryHex] of Object.entries(window.ColorTheory.semanticDictionary)) {
                if (dictionaryHex.toUpperCase() === hex) {
                    matchedName = name;
                    break;
                }
            }

            if (matchedName) {
                // Capitalizar primera letra
                textInput.value = matchedName.charAt(0).toUpperCase() + matchedName.slice(1);
                textInput.style.borderColor = 'var(--stitch-gold)';
            } else {
                textInput.value = hex; // Mostrar el código si no hay nombre
                textInput.style.borderColor = 'var(--denim-light)';
            }

            if(typeof onSyncCallback === 'function') onSyncCallback(hex, matchedName || hex);
        });
    }
};

// Exportar
window.WardrobeManager = WardrobeManager;
