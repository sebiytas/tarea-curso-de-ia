/**
 * js/wiki-lookup.js
 * Motor de investigación contextual. Híbrido: Wikipedia REST API + Fallback Local Estático.
 * Funciona completamente del lado del cliente, sin exponer claves de API y superando barreras CORS gracias a la API abierta.
 */

const WikiLookup = (() => {
    // Base de datos estática incrustada para casos específicos de disciplinas/juegos
    const localEncyclopedia = {
        "mario kart": "Mario Kart es una aclamada serie de videojuegos de carreras desarrollada por Nintendo. Los competidores corren en pistas temáticas utilizando diversos objetos y trampas para obtener ventaja competitiva sobre los rivales.",
        "super smash bros": "Super Smash Bros. es una saga de videojuegos de lucha distribuida por Nintendo, la cual presenta un cruce frenético de personajes icónicos competiendo por echarse mutuamente fuera del escenario.",
        "maraton": "Un maratón es una carrera atlética de larga distancia que consiste en recorrer exactamente 42.195 metros (26.2 millas), representando una de las pruebas de resistencia y perseverancia humana más respetadas.",
        "ajedrez": "El ajedrez es un milenario juego de tablero de profunda estrategia para dos oponentes, disputado sobre un tablero de 64 casillas, en el cual el objetivo absoluto es dar 'jaque mate' al rey adversario.",
        "frontend": "Frontend (desarrollo del lado del cliente) es la disciplina de la ingeniería de software enfocada en crear la interfaz visual y la interacción de una aplicación web, uniendo diseño y lógica algorítmica para el usuario final.",
        "halo": "Halo es una influyente franquicia de videojuegos de disparos en primera persona de ciencia ficción, famosa por revolucionar el multijugador competitivo en consolas y los eSports en su época dorada."
    };

    /**
     * Normalizador de cadenas: aísla texto para coincidencias locales
     */
    function normalizeTerm(str) {
        return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
    }

    /**
     * Consulta el corpus de respaldo local
     */
    function queryLocalCorpus(term) {
        const normTerm = normalizeTerm(term);
        // Coincidencias amplias
        for (const [key, description] of Object.entries(localEncyclopedia)) {
            if (normTerm.includes(normalizeTerm(key)) || normalizeTerm(key).includes(normTerm)) {
                return description;
            }
        }
        return null;
    }

    /**
     * Consulta asíncrona hacia Wikipedia REST API en español
     */
    async function queryWikipediaAPI(term) {
        try {
            // Wikipedia ofrece un endpoint summary gratuito que no requiere key y tiene cabeceras CORS permisivas
            const url = `https://es.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(term)}`;
            const response = await fetch(url, {
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                if (data.extract) {
                    return data.extract; // Extracto descriptivo puro en texto plano
                }
            }
            return null;
        } catch (error) {
            console.warn("La red de Wikipedia fue inaccesible. Repercutiendo al motor de reserva.", error);
            return null;
        }
    }

    /**
     * Orquestador de la investigación
     * @param {string} term - Título del logro a investigar
     */
    async function investigate(term) {
        if (!term) return "";
        
        // Estrategia 1: Consulta local predeterminada
        const localExtract = queryLocalCorpus(term);
        if (localExtract) return `[Archivo Local] ${localExtract}`;

        // Estrategia 2: Extraer la primera palabra o término compuesto fuerte
        // (Mejora las posibilidades de match en Wikipedia para términos como "Campeón Ajedrez Ruso")
        const words = term.split(" ");
        let searchPhrase = term;
        // Si hay muchas palabras, intentamos acotar
        if (words.length > 3) {
            // Tomar un subconjunto, o probar directo
            // Para fines de esta simulación priorizaremos el término exacto
        }

        const wikiExtract = await queryWikipediaAPI(searchPhrase);
        if (wikiExtract) return `[Enciclopedia de Wikipedia] ${wikiExtract}`;
        
        // Estrategia 3: Intento con la última palabra (suponiendo que sea el torneo, ej: "Campeón de Wimbledon")
        if (words.length > 1) {
            const lastWord = words[words.length - 1];
            const wikiExtractFallback = await queryWikipediaAPI(lastWord);
            if (wikiExtractFallback) return `[Enciclopedia de Wikipedia (Ref: ${lastWord})] ${wikiExtractFallback}`;
        }

        // Respuesta en caso de nulo
        return `Los archivos enciclopédicos no arrojaron descripciones precisas de "${term}". Sin embargo, esta bóveda resguarda tu proeza, por lo que te invitamos a redactar el mérito histórico manualmente.`;
    }

    // Inicialización del evento visual para el botón de investigar
    function attachInvestigateAction() {
        const btn = document.getElementById('btn-investigate');
        if (!btn) return;

        btn.addEventListener('click', async () => {
            const titleEl = document.getElementById('achievement-title');
            const descEl = document.getElementById('achievement-description');
            
            if (!titleEl || !descEl) return;
            
            const term = titleEl.value.trim();
            if (!term) {
                window.announceToScreenReader('Por favor, indica un título para investigar.');
                alert('Escribe primero el título de tu hazaña o el torneo.');
                titleEl.focus();
                return;
            }

            // UI Animada
            const originalHTML = btn.innerHTML;
            btn.innerHTML = `<svg viewBox="0 0 24 24" style="animation: spin 2s linear infinite;" aria-hidden="true"><path d="M12 2v4a6 6 0 0 1 6 6h4a10 10 0 0 0-10-10zm10 10h-4a6 6 0 0 1-6 6v4a10 10 0 0 0 10-10zm-10 10v-4a6 6 0 0 1-6-6H2a10 10 0 0 0 10 10zM2 12h4a6 6 0 0 1 6-6V2A10 10 0 0 0 2 12z"/></svg> Investigando archivos...`;
            
            // CSS spin dinámico inyectado en el svg
            const style = document.createElement('style');
            style.innerHTML = '@keyframes spin { 100% { transform:rotate(360deg); } }';
            document.head.appendChild(style);

            btn.disabled = true;
            window.announceToScreenReader('Buscando datos enciclopédicos...');

            // Realizar investigación
            const resultText = await investigate(term);
            descEl.value = resultText;
            
            // Restaurar UI
            btn.innerHTML = originalHTML;
            btn.disabled = false;
            window.announceToScreenReader('Investigación lista.');
        });
    }

    document.addEventListener('DOMContentLoaded', attachInvestigateAction);

    return { investigate };
})();
