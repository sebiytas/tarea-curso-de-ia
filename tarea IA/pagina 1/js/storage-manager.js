/**
 * StorageManager: Módulo para gestionar el almacenamiento local de combinaciones y retos.
 */

const STORAGE_KEY = 'prompt_maestro_saved_challenges';

/**
 * Obtiene todos los retos guardados.
 * @returns {Array} Array de objetos de retos guardados.
 */
export function getSavedChallenges() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch (e) {
        console.error("Error al leer el localStorage:", e);
        return [];
    }
}

/**
 * Guarda un nuevo reto/combinación.
 * @param {Object} promptData - Los datos del prompt (subject, environment, constraint, o null)
 * @param {Array} paletteData - Array de colores de la paleta (o null)
 */
export function saveChallenge(promptData, paletteData) {
    const saved = getSavedChallenges();
    
    const newEntry = {
        id: `challenge_${Date.now()}`,
        date: new Date().toISOString(),
        prompt: promptData,
        palette: paletteData,
        completed: false
    };
    
    saved.unshift(newEntry); // Añadir al principio
    
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
        return true;
    } catch (e) {
        console.error("Error al guardar en localStorage:", e);
        return false;
    }
}

/**
 * Elimina un reto por su ID.
 * @param {string} id - El ID del reto a eliminar.
 */
export function deleteChallenge(id) {
    let saved = getSavedChallenges();
    saved = saved.filter(c => c.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
}

/**
 * Marca un reto como completado o no completado.
 * @param {string} id - El ID del reto.
 * @param {boolean} isCompleted - Estado completado.
 */
export function toggleChallengeCompletion(id, isCompleted) {
    let saved = getSavedChallenges();
    const index = saved.findIndex(c => c.id === id);
    if (index !== -1) {
        saved[index].completed = isCompleted;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    }
}
