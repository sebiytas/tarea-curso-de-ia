/**
 * @file color-theory.js
 * @description Motor matemático de colorimetría y diccionario semántico textil para la plataforma Atelier Cozy.
 */

const ColorTheory = {
    // ------------------------------------------------------------------------
    // DICCIONARIO SEMÁNTICO TEXTIL (Más de 120 nombres de color a HEX)
    // ------------------------------------------------------------------------
    semanticDictionary: {
        // Neutros & Básicos (Lino, Blancos, Grises, Negros)
        "blanco": "#FFFFFF", "blanco roto": "#FDFBF7", "blanco crudo": "#F5F5DC", "marfil": "#FFFFF0",
        "hueso": "#E3DAC9", "crema": "#FFFDD0", "beige": "#F5F5DC", "lino": "#FAF0E6", "pergamino": "#F1E9D2",
        "gris claro": "#D3D3D3", "gris ceniza": "#B2BEB5", "gris perla": "#CECECE", "gris medio": "#808080",
        "gris oscuro": "#A9A9A9", "plomo": "#708090", "marengo": "#4C5866", "antracita": "#303134", "carbón": "#36454F",
        "negro": "#000000", "negro azabache": "#0A0A0A",
        
        // Tierras & Cálidos (Marrones, Naranjas, Amarillos)
        "camel": "#C19A6B", "arena": "#C2B280", "caqui": "#C3B091", "taupe": "#483C32", "visón": "#8B7D7B",
        "marrón": "#8B4513", "marrón chocolate": "#7B3F00", "café": "#6F4E37", "cobre": "#B87333", "bronce": "#CD7F32",
        "óxido": "#B7410E", "terracota": "#E2725B", "ladrillo": "#B22222", "teja": "#B35338",
        "calabaza": "#FF7518", "naranja": "#FFA500", "mandarina": "#F28500", "melocotón": "#FFE5B4", "coral": "#FF7F50",
        "amarillo": "#FFFF00", "amarillo pastel": "#FDFD96", "mostaza": "#FFDB58", "ocre": "#CC7722",
        "dorado": "#FFD700", "limón": "#FFF700", "vainilla": "#F3E5AB", "ámbar": "#FFBF00",
        
        // Rojos & Rosas
        "rojo": "#FF0000", "carmesí": "#DC143C", "granate": "#800000", "burdeos": "#800020", "tinto": "#5D191E",
        "vino": "#722F37", "cereza": "#DE3163", "escarlata": "#FF2400", "rubí": "#E0115F", "bermellón": "#E34234",
        "rosa": "#FFC0CB", "rosa pastel": "#FFD1DC", "palo de rosa": "#B76E79", "fucsia": "#FF00FF",
        "magenta": "#CA1F7B", "salmón": "#FA8072", "chicle": "#FF69B4", "flamenco": "#FC8EAC",
        
        // Verdes (Olivas, Esmeraldas, Mentas)
        "verde": "#008000", "verde esmeralda": "#50C878", "verde oliva": "#808000", "verde militar": "#4B5320",
        "verde bosque": "#228B22", "verde musgo": "#8A9A5B", "verde menta": "#98FF98", "verde manzana": "#8DB600",
        "verde pistacho": "#93C572", "verde lima": "#32CD32", "jade": "#00A86B", "aguamarina": "#7FFFD4",
        "caqui oscuro": "#BDB76B", "salvia": "#9DC183", "botella": "#006A4E",
        
        // Azules (Denim, Marinos, Celestes)
        "azul": "#0000FF", "azul marino": "#000080", "azul noche": "#191970", "azul cobalto": "#0047AB",
        "azul zafiro": "#0F52BA", "azul real": "#4169E1", "azul acero": "#4682B4",
        "denim": "#1560BD", "denim oscuro": "#1E3352", "denim claro": "#5B7FA8", "blue jean": "#2E4B75",
        "añil": "#281E5D", "indigo": "#4B0082", "celeste": "#87CEEB", "azul pastel": "#AEC6CF", 
        "azul cielo": "#87CEFA", "turquesa": "#40E0D0", "cian": "#00FFFF", "petróleo": "#005F69", "pavo real": "#008081",
        
        // Morados & Violetas
        "morado": "#800080", "violeta": "#EE82EE", "púrpura": "#800080", "lila": "#C8A2C8",
        "lavanda": "#E6E6FA", "ciruela": "#8E4585", "berenjena": "#614051", "amatista": "#9966CC",
        "uva": "#6F2DA8", "malva": "#E0B0FF", "orquídea": "#DA70D6"
    },

    // ------------------------------------------------------------------------
    // CONVERSIÓN DE ESPACIOS DE COLOR (HEX <-> RGB <-> HSL)
    // ------------------------------------------------------------------------
    
    /**
     * Convierte un código HEX a RGB
     * @param {string} hex - Código hexadecimal (ej. "#FF0000")
     * @returns {Object} {r, g, b}
     */
    hexToRgb: function(hex) {
        hex = hex.replace(/^#/, '');
        if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
        const num = parseInt(hex, 16);
        return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
    },

    /**
     * Convierte RGB a HSL
     * @param {number} r, g, b - Valores RGB (0-255)
     * @returns {Object} {h, s, l} - Hue (0-360), Saturation (0-100), Lightness (0-100)
     */
    rgbToHsl: function(r, g, b) {
        r /= 255; g /= 255; b /= 255;
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0; // Acromático
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
    },

    /**
     * Convierte HSL a RGB
     */
    hslToRgb: function(h, s, l) {
        let r, g, b;
        h /= 360; s /= 100; l /= 100;

        if (s === 0) {
            r = g = b = l; // Acromático
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1/6) return p + (q - p) * 6 * t;
                if (t < 1/2) return q;
                if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            };
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }
        return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
    },

    /**
     * Convierte RGB a HEX
     */
    rgbToHex: function(r, g, b) {
        const toHex = (c) => {
            const hex = c.toString(16);
            return hex.length === 1 ? "0" + hex : hex;
        };
        return "#" + (toHex(r) + toHex(g) + toHex(b)).toUpperCase();
    },

    /**
     * Ataajos directos HEX <-> HSL
     */
    hexToHsl: function(hex) {
        const rgb = this.hexToRgb(hex);
        return this.rgbToHsl(rgb.r, rgb.g, rgb.b);
    },

    hslToHex: function(h, s, l) {
        const rgb = this.hslToRgb(h, s, l);
        return this.rgbToHex(rgb.r, rgb.g, rgb.b);
    },

    // ------------------------------------------------------------------------
    // FUNCIONES MATEMÁTICAS DE ARMONÍAS CROMÁTICAS (Estilismo)
    // ------------------------------------------------------------------------
    
    normalizeHue: function(hue) {
        return (hue % 360 + 360) % 360;
    },

    /**
     * Armonía Complementaria (180 grados opuestos)
     * Retorna array con: [Color Base, Color Complementario]
     */
    getComplementary: function(hex) {
        const hsl = this.hexToHsl(hex);
        const compHue = this.normalizeHue(hsl.h + 180);
        return [hex, this.hslToHex(compHue, hsl.s, hsl.l)];
    },

    /**
     * Armonía Análoga (Colores vecinos a +/- 30 grados)
     * Retorna array con 3 colores
     */
    getAnalogous: function(hex, angle = 30) {
        const hsl = this.hexToHsl(hex);
        return [
            this.hslToHex(this.normalizeHue(hsl.h - angle), hsl.s, hsl.l),
            hex,
            this.hslToHex(this.normalizeHue(hsl.h + angle), hsl.s, hsl.l)
        ];
    },

    /**
     * Armonía Triádica (Triángulo equilátero, +120 y +240 grados)
     */
    getTriadic: function(hex) {
        const hsl = this.hexToHsl(hex);
        return [
            hex,
            this.hslToHex(this.normalizeHue(hsl.h + 120), hsl.s, hsl.l),
            this.hslToHex(this.normalizeHue(hsl.h + 240), hsl.s, hsl.l)
        ];
    },

    /**
     * Complementaria Dividida (Split Complementary, opuestos adyacentes +150 y +210)
     */
    getSplitComplementary: function(hex) {
        const hsl = this.hexToHsl(hex);
        return [
            hex,
            this.hslToHex(this.normalizeHue(hsl.h + 150), hsl.s, hsl.l),
            this.hslToHex(this.normalizeHue(hsl.h + 210), hsl.s, hsl.l)
        ];
    },

    /**
     * Monocromático: Variaciones de brillo/saturación del mismo tono base.
     */
    getMonochromatic: function(hex) {
        const hsl = this.hexToHsl(hex);
        return [
            this.hslToHex(hsl.h, hsl.s, Math.max(15, hsl.l - 30)), // Versión más oscura
            hex,
            this.hslToHex(hsl.h, Math.max(0, hsl.s - 20), Math.min(90, hsl.l + 30)) // Versión más clara y menos saturada
        ];
    },

    // ------------------------------------------------------------------------
    // UTILIDADES DE BÚSQUEDA Y EVALUACIÓN
    // ------------------------------------------------------------------------

    /**
     * Busca un color por su nombre en el diccionario semántico.
     * Soporta coincidencias parciales si no hay exacta.
     * @param {string} name - Nombre del color en lenguaje natural.
     * @returns {string|null} - Código HEX del color o null si no se encuentra.
     */
    getColorByName: function(name) {
        if (!name) return null;
        const normalized = name.trim().toLowerCase();
        
        // Coincidencia exacta
        if (this.semanticDictionary[normalized]) {
            return this.semanticDictionary[normalized];
        }

        // Búsqueda por coincidencia parcial (ej: "verde oscuro" encuentra "verde")
        for (const [key, hex] of Object.entries(this.semanticDictionary)) {
            if (normalized.includes(key)) {
                return hex; // Devuelve la primera coincidencia parcial lógica
            }
        }
        
        return null;
    },

    /**
     * Determina si un color actúa como "Neutro" en moda.
     * Los neutros ayudan a balancear la rueda de 3 piezas y no compiten visualmente.
     */
    isNeutral: function(hex) {
        const hsl = this.hexToHsl(hex);
        
        // Negros, blancos y grises (acromáticos)
        if (hsl.s <= 15) return true;
        // Muy oscuros o muy claros
        if (hsl.l <= 20 || hsl.l >= 88) return true;
        
        // Tonos tierra (Marrones, Beiges, Caquis) - Matiz cálido de baja saturación
        if (hsl.h >= 20 && hsl.h <= 50 && hsl.s <= 45 && hsl.l >= 25 && hsl.l <= 80) return true;
        
        // Denim Clásico (Azul grisáceo apagado)
        if (hsl.h >= 200 && hsl.h <= 240 && hsl.s <= 35 && hsl.l <= 55) return true;
        
        // Verde Militar / Oliva apagado
        if (hsl.h >= 60 && hsl.h <= 100 && hsl.s <= 35 && hsl.l <= 45) return true;
        
        return false;
    }
};

// Exportar el módulo al entorno global del navegador
window.ColorTheory = ColorTheory;
