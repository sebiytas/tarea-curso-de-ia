/**
 * js/leaderboard-engine.js
 * Algoritmo de ordenamiento, filtros en tiempo real y renderizado reactivo del podio sagrado.
 */

const LeaderboardEngine = (() => {
    let rawStats = [];
    let currentSearch = '';
    let currentSort = 'desc';

    /**
     * Inicializa y carga datos desde TrophyStorage.
     * Mapea eventos del panel de controles.
     */
    function init() {
        if (typeof TrophyStorage === 'undefined') {
            console.error("TrophyStorage no está disponible. No se puede cargar el Leaderboard.");
            return;
        }
        
        rawStats = TrophyStorage.getLeaderboardStats();
        
        const searchInput = document.getElementById('search-input');
        const sortSelect = document.getElementById('sort-select');

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                currentSearch = e.target.value.toLowerCase();
                render();
            });
        }

        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                currentSort = e.target.value;
                render();
            });
        }

        // Renderizado inicial
        render();
    }

    /**
     * Algoritmo de filtrado por búsqueda (Nombre del campeón o título del logro)
     */
    function filterData(data) {
        if (!currentSearch) return data;
        
        return data.filter(user => {
            // Coincide el nombre del usuario
            if (user.champion.toLowerCase().includes(currentSearch)) return true;
            
            // O coincide el título, nivel o categoría de alguno de sus trofeos
            const hasMatchingTrophy = user.trophies.some(t => 
                t.title.toLowerCase().includes(currentSearch) || 
                t.level.toLowerCase().includes(currentSearch) ||
                t.category.toLowerCase().includes(currentSearch)
            );
            return hasMatchingTrophy;
        });
    }

    /**
     * Algoritmo de ordenamiento multidimensional
     */
    function sortData(data) {
        return data.sort((a, b) => {
            if (currentSort === 'desc') {
                // Si tienen la misma cantidad, desempatar por calidad de trofeos (Platino -> Oro -> Plata -> Bronce)
                if (b.total !== a.total) return b.total - a.total;
                if (b.platinum !== a.platinum) return b.platinum - a.platinum;
                if (b.gold !== a.gold) return b.gold - a.gold;
                if (b.silver !== a.silver) return b.silver - a.silver;
                return b.bronze - a.bronze;
            } 
            else if (currentSort === 'asc') {
                return a.total - b.total;
            } 
            else if (currentSort === 'alpha') {
                return a.champion.localeCompare(b.champion);
            } 
            else if (currentSort === 'recent') {
                // Encontrar la fecha del trofeo más reciente de A y B
                const latestA = Math.max(...a.trophies.map(t => new Date(t.date).getTime()));
                const latestB = Math.max(...b.trophies.map(t => new Date(t.date).getTime()));
                return latestB - latestA;
            }
            return 0;
        });
    }

    /**
     * Renderiza el Podio Sagrado visualmente para el Top 3
     */
    function renderPodium(topUsers) {
        const podiumContainer = document.getElementById('podium-container');
        if (!podiumContainer) return;
        
        podiumContainer.innerHTML = '';
        
        if (topUsers.length === 0) {
            podiumContainer.style.display = 'none';
            return;
        }
        
        podiumContainer.style.display = 'flex';

        // Estructura del podio clásico: [Puesto 2 (Izq), Puesto 1 (Centro), Puesto 3 (Der)]
        const order = [1, 0, 2]; // Índices del array `topUsers`
        const heights = ['180px', '260px', '130px'];
        const colors = ['var(--metal-silver)', 'var(--gold-trophy)', 'var(--metal-bronze)'];
        const positions = ['2ND', '1ST', '3RD'];

        order.forEach((index, i) => {
            if (!topUsers[index]) return;
            
            const user = topUsers[index];
            const podiumBlock = document.createElement('div');
            podiumBlock.className = 'podium-block';

            // Corona extra para el 1er lugar
            const crownHtml = (index === 0) 
                ? `<div style="font-size: 2rem; margin-bottom: 5px; text-shadow: var(--glow-victory);">👑</div>` 
                : '';

            podiumBlock.innerHTML = `
                <div style="margin-bottom: 1.5rem; text-align: center; display: flex; flex-direction: column; align-items: center;">
                    ${crownHtml}
                    <div style="
                        width: 70px; height: 70px; border-radius: 50%; 
                        background: radial-gradient(circle at 30% 30%, #fff, ${colors[i]}, #000); 
                        margin-bottom: 15px; 
                        box-shadow: 0 10px 20px rgba(0,0,0,0.8), 0 0 25px ${colors[i]};
                        display: flex; align-items: center; justify-content: center;
                        color: #0b0d11; font-family: var(--font-heading); font-weight: 900; font-size: 2rem;
                        border: 2px solid rgba(255,255,255,0.3);
                    ">
                        ${user.champion.charAt(0).toUpperCase()}
                    </div>
                    <span style="font-family: var(--font-heading); font-weight: 700; font-size: 1rem; color: ${colors[i]}; text-transform: uppercase; letter-spacing: 1px; text-shadow: 0 2px 4px rgba(0,0,0,0.8);">
                        ${user.champion.split(' ')[0]}
                    </span>
                    <div style="font-size: 0.85rem; color: var(--text-pure); margin-top: 5px; font-weight: bold; background: rgba(0,0,0,0.5); padding: 2px 8px; border-radius: 12px;">
                        ${user.total} Victorias
                    </div>
                </div>
                <div class="podium-step" style="height: ${heights[i]}; border-top: 6px solid ${colors[i]}; color: ${colors[i]};">
                    ${positions[i]}
                </div>
            `;
            
            podiumContainer.appendChild(podiumBlock);
        });
    }

    /**
     * Genera la lista de tarjetas tipo vitrina para todos los miembros
     */
    function renderList(users) {
        const listContainer = document.getElementById('leaderboard-list');
        if (!listContainer) return;
        
        listContainer.innerHTML = '';

        if (users.length === 0) {
            listContainer.innerHTML = `
                <div style="text-align: center; padding: 3rem; background: var(--bg-glass); border-radius: 8px; border: 1px dashed var(--border-metal);">
                    <p style="color: var(--text-muted); font-size: 1.1rem;">No se encontraron campeones en la bóveda que coincidan con la búsqueda.</p>
                </div>
            `;
            return;
        }

        users.forEach((user, index) => {
            const card = document.createElement('article');
            card.style.background = 'linear-gradient(145deg, #161922, #101218)';
            card.style.border = '1px solid var(--border-metal)';
            card.style.borderRadius = '8px';
            card.style.padding = '2rem';
            card.style.display = 'flex';
            card.style.flexDirection = 'column';
            card.style.gap = '1.5rem';
            card.style.boxShadow = '0 10px 30px rgba(0,0,0,0.6)';
            card.style.position = 'relative';
            card.style.overflow = 'hidden';

            // Glow lateral
            card.innerHTML += `<div style="position: absolute; top: 0; left: 0; width: 4px; height: 100%; background: var(--gold-trophy); box-shadow: 0 0 10px var(--gold-trophy);"></div>`;

            // Construir indicadores numéricos de medallas
            const generateMedals = () => {
                let html = '';
                if(user.platinum > 0) html += `<span style="color: var(--metal-platinum); font-weight: bold; background: rgba(0,0,0,0.3); padding: 4px 8px; border-radius: 4px;">P ${user.platinum}</span>`;
                if(user.gold > 0) html += `<span style="color: var(--gold-trophy); font-weight: bold; background: rgba(0,0,0,0.3); padding: 4px 8px; border-radius: 4px;">O ${user.gold}</span>`;
                if(user.silver > 0) html += `<span style="color: var(--metal-silver); font-weight: bold; background: rgba(0,0,0,0.3); padding: 4px 8px; border-radius: 4px;">S ${user.silver}</span>`;
                if(user.bronze > 0) html += `<span style="color: var(--metal-bronze); font-weight: bold; background: rgba(0,0,0,0.3); padding: 4px 8px; border-radius: 4px;">B ${user.bronze}</span>`;
                return html;
            };

            const htmlContent = `
                <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem; border-bottom: 1px solid var(--border-metal); padding-bottom: 1.5rem; margin-left: 10px;">
                    <div>
                        <h3 style="font-family: var(--font-heading); font-size: 1.8rem; color: var(--gold-sheen); margin-bottom: 0.5rem; text-transform: uppercase;">
                            <span style="color: var(--text-muted); font-size: 1.2rem;">#${index + 1}</span> ${user.champion}
                        </h3>
                        <div style="font-family: var(--font-mono); font-size: 0.95rem; display: flex; gap: 0.75rem; align-items: center; flex-wrap: wrap;">
                            <strong style="color: var(--text-pure); background: rgba(255,208,52,0.1); padding: 4px 10px; border-radius: 4px; border: 1px solid rgba(255,208,52,0.3);">
                                Total: ${user.total}
                            </strong>
                            ${generateMedals()}
                        </div>
                    </div>
                    <a href="archivo-detallado.html?user=${encodeURIComponent(user.champion)}" class="btn-action" style="text-decoration: none; max-width: 280px;">
                        Ver Historial Detallado en Archivo
                    </a>
                </div>
                <div style="margin-left: 10px;">
                    <h4 style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1rem; text-transform: uppercase; letter-spacing: 1px;">Registro de Trofeos Destacados:</h4>
                    <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.75rem;">
                        ${user.trophies.slice(0, 3).map(t => {
                            // Definir color de borde de la lista basado en el trofeo
                            let edgeColor = 'var(--gold-shadow)';
                            if (t.level === 'platinum') edgeColor = 'var(--metal-platinum)';
                            if (t.level === 'gold') edgeColor = 'var(--gold-trophy)';
                            if (t.level === 'silver') edgeColor = 'var(--metal-silver)';
                            if (t.level === 'bronze') edgeColor = 'var(--metal-bronze)';
                            
                            return `
                            <li style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; background: rgba(0,0,0,0.4); padding: 1rem; border-radius: 4px; border-left: 3px solid ${edgeColor};">
                                <strong style="color: var(--text-pure); font-size: 1.05rem;">${t.title}</strong>
                                <span style="font-size: 0.8rem; text-transform: uppercase; background: var(--border-metal); color: var(--text-pure); padding: 3px 8px; border-radius: 4px;">${t.category}</span>
                            </li>
                            `;
                        }).join('')}
                        ${user.trophies.length > 3 ? `<li style="text-align: center; font-size: 0.9rem; color: var(--gold-sheen); margin-top: 0.5rem; font-style: italic;">... y ${user.trophies.length - 3} hazañas históricas más.</li>` : ''}
                    </ul>
                </div>
            `;
            
            card.innerHTML += htmlContent;
            listContainer.appendChild(card);
        });
    }

    /**
     * Bucle de renderizado reactivo
     */
    function render() {
        let processedData = filterData(rawStats);
        processedData = sortData(processedData);

        // Extraer Top 3 general
        const top3 = processedData.slice(0, 3);
        renderPodium(top3);
        
        renderList(processedData);
        
        window.announceToScreenReader(`Ránking actualizado. Mostrando resultados para ${processedData.length} campeones.`);
    }

    // Inicialización automática al cargar el script en el DOM
    document.addEventListener('DOMContentLoaded', init);

    return {
        init,
        forceRefresh: () => {
            rawStats = TrophyStorage.getLeaderboardStats();
            render();
        }
    };
})();
