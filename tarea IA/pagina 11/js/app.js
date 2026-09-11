document.addEventListener('DOMContentLoaded', () => {
    // State
    let watchedEpisodes = JSON.parse(localStorage.getItem('neo_tracker_watched')) || [];
    let activeFilters = {
        "canon": true,
        "filler": true,
        "mixed": true,
        "anime-canon": true
    };
    let isMarathonMode = false;

    // DOM Elements
    const filtersContainer = document.getElementById('filters-container');
    const arcsContainer = document.getElementById('arcs-container');
    const globalProgress = document.getElementById('global-progress');
    const globalStatsText = document.getElementById('global-stats-text');
    const marathonToggle = document.getElementById('marathon-toggle');
    
    // Modal Elements
    const modal = document.getElementById('episode-modal');
    const modalClose = document.getElementById('modal-close');
    const modalTitle = document.getElementById('modal-title');
    const modalEpNumber = document.getElementById('modal-ep-number');
    const modalBadge = document.getElementById('modal-badge');
    const modalDate = document.getElementById('modal-date');
    const modalIntroduces = document.getElementById('modal-introduces');
    const modalSynopsis = document.getElementById('modal-synopsis');
    const modalWatchBtn = document.getElementById('modal-watch-btn');
    
    let currentModalEpId = null;

    // Initialization
    function init() {
        renderFilters();
        renderArcs();
        updateGlobalStats();
        setupEventListeners();
    }

    // Render logic
    function renderFilters() {
        filtersContainer.innerHTML = '';
        Object.keys(episodeTypes).forEach(type => {
            const typeInfo = episodeTypes[type];
            
            const label = document.createElement('label');
            label.className = 'filter-item';
            label.style.color = typeInfo.color;
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = activeFilters[type];
            checkbox.dataset.type = type;
            
            const span = document.createElement('span');
            span.textContent = typeInfo.label;
            
            label.appendChild(checkbox);
            label.appendChild(span);
            filtersContainer.appendChild(label);

            checkbox.addEventListener('change', (e) => {
                activeFilters[type] = e.target.checked;
                // If marathon mode is on, changing filters disables marathon mode
                if (isMarathonMode && !e.target.checked && type === 'canon') {
                    marathonToggle.checked = false;
                    isMarathonMode = false;
                }
                applyFilters();
            });
        });
    }

    function renderArcs() {
        arcsContainer.innerHTML = '';
        animeData.forEach(arc => {
            // Arc Card
            const arcCard = document.createElement('div');
            arcCard.className = 'arc-card';
            arcCard.id = `arc-${arc.id}`;
            
            // Calculate arc stats
            const totalEps = arc.episodes.length;
            
            // Arc Header
            const header = document.createElement('div');
            header.className = 'arc-header';
            
            const titleArea = document.createElement('div');
            titleArea.className = 'arc-title-area';
            titleArea.innerHTML = `
                <h3>${arc.title}</h3>
                <div class="arc-stats">
                    <span>${totalEps} EPISODIOS</span>
                    <span id="stat-${arc.id}">0% VISTO</span>
                </div>
            `;
            
            const toggleIcon = document.createElement('div');
            toggleIcon.className = 'arc-toggle';
            toggleIcon.textContent = '▼';
            
            header.appendChild(titleArea);
            header.appendChild(toggleIcon);
            
            // Arc Content (Episodes)
            const content = document.createElement('div');
            content.className = 'arc-content';
            
            const epList = document.createElement('ul');
            epList.className = 'episode-list';
            
            arc.episodes.forEach(ep => {
                const epItem = document.createElement('li');
                epItem.className = `episode-item ${watchedEpisodes.includes(ep.id) ? 'watched' : ''}`;
                epItem.dataset.id = ep.id;
                epItem.dataset.type = ep.type;
                
                const typeInfo = episodeTypes[ep.type];
                
                epItem.innerHTML = `
                    <div class="ep-checkbox-wrapper" onclick="event.stopPropagation()">
                        <input type="checkbox" class="ep-checkbox" data-id="${ep.id}" ${watchedEpisodes.includes(ep.id) ? 'checked' : ''}>
                    </div>
                    <div class="ep-number">${ep.number.toString().padStart(2, '0')}</div>
                    <div class="ep-title">${ep.title}</div>
                    <div class="ep-tag" style="--tag-color: ${typeInfo.color};">${typeInfo.label}</div>
                `;
                
                // Episode Click -> Modal
                epItem.addEventListener('click', () => openModal(ep));
                
                // Checkbox change
                const checkbox = epItem.querySelector('.ep-checkbox');
                checkbox.addEventListener('change', (e) => {
                    toggleEpisodeWatched(ep.id, e.target.checked);
                    if(e.target.checked) {
                        epItem.classList.add('watched');
                    } else {
                        epItem.classList.remove('watched');
                    }
                });
                
                epList.appendChild(epItem);
            });
            
            content.appendChild(epList);
            arcCard.appendChild(header);
            arcCard.appendChild(content);
            
            // Toggle Arc
            header.addEventListener('click', () => {
                arcCard.classList.toggle('collapsed');
            });
            
            arcsContainer.appendChild(arcCard);
            updateArcStats(arc);
        });
        
        applyFilters();
    }

    // Logic
    function toggleEpisodeWatched(id, isWatched) {
        if (isWatched && !watchedEpisodes.includes(id)) {
            watchedEpisodes.push(id);
        } else if (!isWatched) {
            watchedEpisodes = watchedEpisodes.filter(e => e !== id);
        }
        
        localStorage.setItem('neo_tracker_watched', JSON.stringify(watchedEpisodes));
        
        // Update specific arc stat
        animeData.forEach(arc => {
            if (arc.episodes.some(e => e.id === id)) {
                updateArcStats(arc);
            }
        });
        updateGlobalStats();

        // Update modal button if open
        if (currentModalEpId === id && modal.classList.contains('active')) {
            updateModalWatchBtn(isWatched);
        }
    }

    function updateArcStats(arc) {
        const statEl = document.getElementById(`stat-${arc.id}`);
        if (!statEl) return;
        
        const arcEps = arc.episodes.map(e => e.id);
        const watchedInArc = arcEps.filter(id => watchedEpisodes.includes(id)).length;
        const totalInArc = arcEps.length;
        const percent = Math.round((watchedInArc / totalInArc) * 100);
        
        statEl.textContent = `${percent}% VISTO`;
        
        if (percent === 100) {
            statEl.style.color = 'var(--neon-green)';
            statEl.style.borderColor = 'var(--neon-green)';
        } else {
            statEl.style.color = '';
            statEl.style.borderColor = '';
        }
    }

    function updateGlobalStats() {
        let totalEps = 0;
        animeData.forEach(arc => totalEps += arc.episodes.length);
        
        const watchedCount = watchedEpisodes.length;
        const percent = totalEps === 0 ? 0 : (watchedCount / totalEps) * 100;
        
        globalStatsText.textContent = `${watchedCount} / ${totalEps} Episodios (${Math.round(percent)}%)`;
        globalProgress.style.width = `${percent}%`;
    }

    function applyFilters() {
        const epItems = document.querySelectorAll('.episode-item');
        epItems.forEach(item => {
            const type = item.dataset.type;
            
            let shouldShow = activeFilters[type];
            
            if (isMarathonMode) {
                // In marathon mode, only show canon and anime-canon
                shouldShow = type === 'canon' || type === 'anime-canon';
            }
            
            if (shouldShow) {
                item.classList.remove('hidden');
            } else {
                item.classList.add('hidden');
            }
        });

        // Hide empty arcs
        const arcs = document.querySelectorAll('.arc-card');
        arcs.forEach(arc => {
            const visibleEps = arc.querySelectorAll('.episode-item:not(.hidden)').length;
            if (visibleEps === 0) {
                arc.style.display = 'none';
            } else {
                arc.style.display = 'block';
            }
        });
    }

    // Modal Logic
    function openModal(ep) {
        currentModalEpId = ep.id;
        const typeInfo = episodeTypes[ep.type];
        
        modalTitle.textContent = ep.title;
        modalEpNumber.textContent = `EP. ${ep.number.toString().padStart(2, '0')}`;
        
        modalBadge.textContent = typeInfo.label.toUpperCase();
        modalBadge.style.backgroundColor = typeInfo.color;
        
        modalDate.textContent = ep.date;
        modalIntroduces.textContent = ep.introduces;
        modalSynopsis.textContent = ep.synopsis;
        
        const isWatched = watchedEpisodes.includes(ep.id);
        updateModalWatchBtn(isWatched);
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function updateModalWatchBtn(isWatched) {
        if (isWatched) {
            modalWatchBtn.textContent = 'DESMARCAR COMO VISTO';
            modalWatchBtn.style.color = 'var(--neon-red)';
            modalWatchBtn.style.borderColor = 'var(--neon-red)';
        } else {
            modalWatchBtn.textContent = 'MARCAR COMO VISTO';
            modalWatchBtn.style.color = 'var(--neon-green)';
            modalWatchBtn.style.borderColor = 'var(--neon-green)';
        }
    }

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        currentModalEpId = null;
    }

    function setupEventListeners() {
        // Modal close
        modalClose.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
        
        // Modal Action btn
        modalWatchBtn.addEventListener('click', () => {
            if (currentModalEpId !== null) {
                const isWatched = watchedEpisodes.includes(currentModalEpId);
                toggleEpisodeWatched(currentModalEpId, !isWatched);
                
                // Update UI in list
                const epItem = document.querySelector(`.episode-item[data-id="${currentModalEpId}"]`);
                if (epItem) {
                    const cb = epItem.querySelector('.ep-checkbox');
                    cb.checked = !isWatched;
                    if (!isWatched) {
                        epItem.classList.add('watched');
                    } else {
                        epItem.classList.remove('watched');
                    }
                }
            }
        });

        // Marathon Toggle
        marathonToggle.addEventListener('change', (e) => {
            isMarathonMode = e.target.checked;
            
            // Sync filter checkboxes visually
            if (isMarathonMode) {
                document.querySelector('input[data-type="filler"]').checked = false;
                document.querySelector('input[data-type="mixed"]').checked = false;
                document.querySelector('input[data-type="canon"]').checked = true;
                document.querySelector('input[data-type="anime-canon"]').checked = true;
            } else {
                // Restore from activeFilters state
                document.querySelectorAll('.filter-item input').forEach(cb => {
                    cb.checked = activeFilters[cb.dataset.type];
                });
            }
            
            applyFilters();
        });
    }

    // Run
    init();
});
