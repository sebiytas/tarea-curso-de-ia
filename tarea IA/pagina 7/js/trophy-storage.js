/**
 * js/trophy-storage.js
 * Capa de persistencia en localStorage (CRUD completo para perfiles y logros).
 */

const TrophyStorage = (() => {
    const STORAGE_KEY = 'trophy_vault_data';

    // Datos de muestra para poblar la bóveda inicial si está vacía
    const sampleData = [
        {
            id: 'mock-1',
            champion: 'Arthur Pendragon',
            level: 'platinum',
            title: 'Rey de Camelot y Portador de Excalibur',
            category: 'career',
            description: 'Logró extraer a Excalibur de la piedra sagrada, asumiendo el liderazgo absoluto del reino bajo estándares de honor y equidad en la Mesa Redonda.',
            date: new Date(new Date().setFullYear(new Date().getFullYear()-1, 5, 12)).toISOString()
        },
        {
            id: 'mock-2',
            champion: 'Marie Curie',
            level: 'gold',
            title: 'Premio Nobel de Química',
            category: 'academic',
            description: 'Reconocimiento internacional histórico por el descubrimiento del radio y el polonio, marcando un hito fundacional en la ciencia radiológica.',
            date: new Date(new Date().setFullYear(new Date().getFullYear()-2, 10, 5)).toISOString()
        },
        {
            id: 'mock-3',
            champion: 'Satoshi Nakamoto',
            level: 'silver',
            title: 'Despliegue del Génesis de Bitcoin',
            category: 'personal',
            description: 'Invención revolucionaria de una moneda digital descentralizada y la primera base de datos blockchain distribuida del mundo.',
            date: new Date(new Date().setFullYear(new Date().getFullYear()-4, 0, 15)).toISOString()
        }
    ];

    /**
     * Leer todos los trofeos
     * @returns {Array} Colección de objetos de trofeos
     */
    function getTrophies() {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            if (!data) {
                // Iniciar con datos semilla
                localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleData));
                return sampleData;
            }
            return JSON.parse(data);
        } catch (e) {
            console.error('Error procesando el almacenamiento local de trofeos:', e);
            return [];
        }
    }

    /**
     * Guardar un trofeo nuevo
     * @param {Object} trophy - Trofeo a forjar
     */
    function saveTrophy(trophy) {
        const trophies = getTrophies();
        trophies.push(trophy);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(trophies));
    }

    /**
     * Borrar un trofeo de la historia
     * @param {string} id - Identificador de la placa
     */
    function deleteTrophy(id) {
        let trophies = getTrophies();
        trophies = trophies.filter(t => t.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(trophies));
    }

    /**
     * Agrupar logros por titular para el Podio
     * @returns {Array} Cuentas calculadas con ranking
     */
    function getLeaderboardStats() {
        const trophies = getTrophies();
        const userMap = new Map();

        trophies.forEach(t => {
            const name = t.champion.trim();
            if (!userMap.has(name)) {
                userMap.set(name, {
                    champion: name,
                    total: 0,
                    platinum: 0,
                    gold: 0,
                    silver: 0,
                    bronze: 0,
                    trophies: []
                });
            }
            const stats = userMap.get(name);
            stats.total += 1;
            if (stats[t.level] !== undefined) {
                stats[t.level] += 1;
            }
            stats.trophies.push(t);
        });

        return Array.from(userMap.values());
    }

    // Interfaz pública
    return {
        getTrophies,
        saveTrophy,
        deleteTrophy,
        getLeaderboardStats
    };
})();
