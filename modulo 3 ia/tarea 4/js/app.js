/**
 * TerminalFlow v2.0 - Archivo JS Maestro
 * Scripts globales para Dashboard, Diccionario y Utilidades de Código.
 */

document.addEventListener('DOMContentLoaded', () => {
    initDashboardTerminal();
    initDictionarySearch();
    initCodeCopyButtons();
});

/* ==========================================================================
   1. Dashboard: Simulación de Logs de Servidor (Terminal Log)
   ========================================================================== */
function initDashboardTerminal() {
    const logContainer = document.getElementById('terminal-log-container');
    const cursor = document.getElementById('log-cursor');
    
    // Si no estamos en el dashboard, salir.
    if (!logContainer || !cursor) return;

    // Array de logs técnicos realistas
    const serverLogs = [
        { text: "> Conectando a Base de Datos PostgreSQL 14.5...", class: "" },
        { text: "[OK] Conexión establecida (Latency: 12ms).", class: "success" },
        { text: "> Verificando integridad de tablas en esquema 'inventario'...", class: "" },
        { text: "[WARN] Índice faltante en tabla 'ventas_log' para columna 'fecha'.", class: "warn" },
        { text: "> Sincronizando workers de Gunicorn (4 threads)...", class: "" },
        { text: "[ERROR] Worker 2 (PID 4921) no responde al Heartbeat.", class: "error" },
        { text: "> Emitiendo señal SIGTERM al Worker 2...", class: "" },
        { text: "[OK] Worker 2 reiniciado exitosamente. Asignando PID 4988.", class: "success" },
        { text: "> Escaneo de vulnerabilidades programado (ClamAV) iniciado...", class: "" },
        { text: "[OK] Escaneo completado. 0 amenazas detectadas.", class: "success" },
        { text: "> Rotando archivos de log de Nginx (/var/log/nginx/access.log)...", class: "" }
    ];

    let logIndex = 0;

    // Inyectar un nuevo log cada 2 a 4 segundos de forma aleatoria
    function printNextLog() {
        if (logIndex < serverLogs.length) {
            const line = document.createElement('div');
            line.className = 'log-line ' + serverLogs[logIndex].class;
            line.textContent = serverLogs[logIndex].text;
            
            // Insertar justo antes del cursor
            logContainer.insertBefore(line, cursor);
            
            // Auto-scroll hacia abajo
            logContainer.scrollTop = logContainer.scrollHeight;
            
            logIndex++;
            
            // Random delay entre 1000ms y 3500ms
            const nextDelay = Math.floor(Math.random() * 2500) + 1000;
            setTimeout(printNextLog, nextDelay);
        } else {
            // Reiniciar el loop para mantener el dashboard "vivo"
            setTimeout(() => {
                // Mantener las últimas 3 líneas y reiniciar el array
                while (logContainer.children.length > 4) {
                    logContainer.removeChild(logContainer.firstChild);
                }
                const resetMsg = document.createElement('div');
                resetMsg.className = 'log-line';
                resetMsg.textContent = "> Limpiando buffer de log... reiniciando ciclo.";
                logContainer.insertBefore(resetMsg, cursor);
                
                logIndex = 0;
                setTimeout(printNextLog, 2000);
            }, 5000);
        }
    }

    // Iniciar simulación tras 1 segundo
    setTimeout(printNextLog, 1000);
}

/* ==========================================================================
   2. Diccionario: Buscador en Tiempo Real (Filtro por DOM)
   ========================================================================== */
function initDictionarySearch() {
    const searchInput = document.getElementById('dict-search');
    const dictionaryContainer = document.getElementById('dict-entries');
    
    if (!searchInput || !dictionaryContainer) return;

    const entries = dictionaryContainer.querySelectorAll('.dict-entry');

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();

        entries.forEach(entry => {
            // Buscamos coincidencia en el título y en el texto del cuerpo
            const title = entry.querySelector('.dict-entry__title')?.textContent.toLowerCase() || '';
            const desc = entry.querySelector('.dict-entry__desc')?.textContent.toLowerCase() || '';
            
            if (title.includes(query) || desc.includes(query)) {
                entry.style.display = 'block';
            } else {
                entry.style.display = 'none';
            }
        });
    });
}

/* ==========================================================================
   3. Utilidades: Copiar Código al Portapapeles
   ========================================================================== */
function initCodeCopyButtons() {
    // Si tenemos bloques de código que queremos que sean copiables, 
    // podemos inyectar un botón de copiar dinámicamente o usar botones existentes.
    // Como en la Fase 2 no pusimos botones de copiar directamente en el HTML final de caso-inventario,
    // vamos a inyectarles uno a todos los bloques <pre> de forma automática.

    const codeBlocks = document.querySelectorAll('.code-block pre, .dict-code pre');

    codeBlocks.forEach(pre => {
        // Envolver el pre en un relative container si no lo está (CSS gestionado o inline)
        const wrapper = document.createElement('div');
        wrapper.style.position = 'relative';
        
        pre.parentNode.insertBefore(wrapper, pre);
        wrapper.appendChild(pre);

        // Crear el botón
        const copyBtn = document.createElement('button');
        copyBtn.className = 'btn';
        copyBtn.style.position = 'absolute';
        copyBtn.style.top = '10px';
        copyBtn.style.right = '10px';
        copyBtn.style.padding = '0.25rem 0.5rem';
        copyBtn.style.fontSize = '0.75rem';
        copyBtn.style.backgroundColor = 'var(--bg-panel)';
        copyBtn.innerText = 'Copiar';

        wrapper.appendChild(copyBtn);

        // Lógica de copiado
        copyBtn.addEventListener('click', async () => {
            try {
                // Obtener el texto interno del <code> dentro del <pre>
                const codeElement = pre.querySelector('code');
                const textToCopy = codeElement ? codeElement.innerText : pre.innerText;
                
                await navigator.clipboard.writeText(textToCopy);
                
                // Feedback visual
                copyBtn.innerText = '¡Copiado!';
                copyBtn.style.backgroundColor = 'var(--accent-primary)';
                copyBtn.style.color = 'var(--bg-main)';
                
                setTimeout(() => {
                    copyBtn.innerText = 'Copiar';
                    copyBtn.style.backgroundColor = 'var(--bg-panel)';
                    copyBtn.style.color = 'var(--accent-primary)';
                }, 2000);
            } catch (err) {
                console.error('Error al copiar al portapapeles: ', err);
                copyBtn.innerText = 'Error';
            }
        });
    });
}
