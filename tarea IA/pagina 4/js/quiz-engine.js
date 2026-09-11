/**
 * js/quiz-engine.js
 * Motor algorítmico del test de afinidad y trazado de rutas para Hyrule Chronicles.
 */

class QuizEngine {
    constructor() {
        this.currentStep = 0;
        this.answers = {};
        
        // Estructura del Cuestionario
        this.questions = [
            {
                id: 'q1',
                title: "¿Qué experiencia buscas al sostener el mando?",
                options: [
                    { value: 'ruta1', text: "A. Exploración pura sin límites donde el mapa es un lienzo." },
                    { value: 'ruta2', text: "B. Mazmorras intrincadas con puzles de llaves y progresión ordenada." },
                    { value: 'ruta3', text: "C. Aventura clásica 2D directa y ágil." },
                    { value: 'ruta2', text: "D. Foco primordial en atmósfera oscura y narrativa cinemática." }
                ]
            },
            {
                id: 'q2',
                title: "¿Cómo te llevas con el diseño de videojuegos de épocas pasadas?",
                options: [
                    { value: 'ruta1', text: "A. Necesito estándares modernos y controles fluidos." },
                    { value: 'ruta2', text: "B. Disfruto de los polígonos y la magia nostálgica de la era de los 64 bits." },
                    { value: 'ruta3', text: "C. Adoro el pixel art de la época de 16 bits." },
                    { value: 'ruta1', text: "D. Quiero saltar directo a lo más reciente." }
                ]
            },
            {
                id: 'q3',
                title: "¿Qué compromiso temporal prefieres?",
                options: [
                    { value: 'ruta1', text: "A. Cientos de horas perdiéndome en un mundo inmenso." },
                    { value: 'ruta2', text: "B. Una campaña sólida de 25 a 35 horas." },
                    { value: 'ruta3', text: "C. Una joya condensada de 10 a 15 horas." }
                ]
            },
            {
                id: 'q4',
                title: "¿Prefieres que el juego te guíe o que te deje a tu suerte?",
                options: [
                    { value: 'ruta1', text: "A. Libertad total sin tutoriales restrictivos." },
                    { value: 'ruta2', text: "B. Una curva guiada con brújula y objetivos claros." },
                    { value: 'ruta3', text: "C. Acertijos crípticos que pongan a prueba mi ingenio." }
                ]
            }
        ];

        // Definición de Rutas
        this.routes = {
            'ruta1': {
                name: "El Sendero del Cataclismo",
                subtitle: "(Mundo Abierto Moderno)",
                description: "Valoras la libertad absoluta, la física sistémica y sumergirte en mundos colosales sin ataduras. Esta ruta te introduce por la revolución moderna antes de llevarte a comprender sus orígenes narrativos.",
                steps: [
                    { game: "Breath of the Wild", desc: "Iniciación en la libertad sistémica y el motor químico." },
                    { game: "Tears of the Kingdom", desc: "Expansión vertical y mecánicas de construcción sin límites." },
                    { game: "Skyward Sword HD", desc: "Orígenes canónicos de la Espada Maestra y puente hacia el diseño clásico." },
                    { game: "Ocarina of Time 3D", desc: "Comprensión del pilar estructural que fundó la mitología." }
                ]
            },
            'ruta2': {
                name: "El Sendero del Héroe del Tiempo",
                subtitle: "(Tradición 3D Cinemática)",
                description: "Buscas épica, narrativas profundas y el clásico diseño de la 'Fórmula Zelda' de cerradura y llave. Esta ruta traza la evolución de la maestría en mazmorras 3D.",
                steps: [
                    { game: "Ocarina of Time 3D", desc: "La base fundamental de la estructura de mazmorras 3D." },
                    { game: "Majora's Mask 3D", desc: "Continuación directa con atmósfera existencialista y mecánicas temporales." },
                    { game: "Twilight Princess HD", desc: "Tono sombrío, combate refinado y mazmorras en su punto cumbre." },
                    { game: "Breath of the Wild", desc: "El salto a la modernidad una vez dominada la fórmula clásica." }
                ]
            },
            'ruta3': {
                name: "El Sendero del Pixel y la Trifuerza",
                subtitle: "(Maestría 2D Top-Down)",
                description: "Eres un purista de la agilidad mecánica, el buen pixel art y los puzles de bloque. Esta ruta recorre el pináculo del diseño 2D de Nintendo.",
                steps: [
                    { game: "A Link Between Worlds", desc: "Modernidad, fluidez a 60fps y un homenaje perfecto para entrar al 2D." },
                    { game: "A Link to the Past", desc: "El templo sagrado e indiscutible del diseño de 16 bits." },
                    { game: "Link's Awakening (Remake)", desc: "Belleza visual diorama, tamaño contenido y emoción pura." },
                    { game: "The Minish Cap", desc: "Magia de Capcom, innovación de tamaño y gran dirección artística." }
                ]
            }
        };

        this.initDOM();
    }

    initDOM() {
        this.quizContainer = document.getElementById('quizContainer');
        this.progressBar = document.getElementById('quizProgress');
        this.renderStep();
    }

    renderStep() {
        if (this.currentStep < this.questions.length) {
            const question = this.questions[this.currentStep];
            
            // Actualizar barra de progreso
            const progressPercent = ((this.currentStep) / this.questions.length) * 100;
            this.progressBar.style.width = `${progressPercent}%`;

            let html = `
                <div class="quiz-question-card fade-in" role="group" aria-labelledby="questionTitle">
                    <span style="font-family: var(--font-ui); color: var(--gold-primary); text-transform: uppercase; font-size: 0.8rem; letter-spacing: 2px;">Pregunta ${this.currentStep + 1} de ${this.questions.length}</span>
                    <h3 id="questionTitle" style="font-size: 1.8rem; margin: 1rem 0 2rem 0;">${question.title}</h3>
                    <div class="quiz-options">
                        ${question.options.map((opt, index) => `
                            <button class="quiz-option-btn" data-value="${opt.value}">
                                ${opt.text}
                            </button>
                        `).join('')}
                    </div>
                </div>
            `;
            this.quizContainer.innerHTML = html;

            // Bind events
            const buttons = this.quizContainer.querySelectorAll('.quiz-option-btn');
            buttons.forEach(btn => {
                btn.addEventListener('click', (e) => this.handleAnswer(e.target.dataset.value));
            });
        } else {
            this.calculateResult();
        }
    }

    handleAnswer(value) {
        this.answers[`q${this.currentStep + 1}`] = value;
        this.currentStep++;
        this.renderStep();
    }

    calculateResult() {
        this.progressBar.style.width = `100%`;
        
        // Contar votos
        const counts = { ruta1: 0, ruta2: 0, ruta3: 0 };
        for (let key in this.answers) {
            counts[this.answers[key]]++;
        }

        // Determinar ganador (mayoría)
        let winningRoute = 'ruta1';
        let maxCount = 0;
        for (let r in counts) {
            if (counts[r] > maxCount) {
                maxCount = counts[r];
                winningRoute = r;
            }
        }

        this.renderResult(this.routes[winningRoute]);
    }

    renderResult(route) {
        let html = `
            <div class="quiz-result-card fade-in" aria-live="polite">
                <div style="text-align: center; margin-bottom: 2rem;">
                    <h2 style="color: var(--blue-sheikah); font-size: 1rem; text-transform: uppercase; letter-spacing: 3px;">El Oráculo ha hablado. Tu ruta es:</h2>
                    <h3 style="font-size: 2.5rem; color: var(--gold-glow); margin-bottom: 0.5rem;">${route.name}</h3>
                    <h4 style="font-family: var(--font-ui); font-weight: normal; color: var(--text-parchment);">${route.subtitle}</h4>
                </div>
                
                <p style="text-align: center; max-width: 700px; margin: 0 auto 3rem auto; font-size: 1.1rem;">
                    ${route.description}
                </p>

                <div class="pathway-timeline">
                    ${route.steps.map((step, idx) => `
                        <div class="pathway-step">
                            <div class="pathway-node">${idx + 1}</div>
                            <div class="pathway-content card" style="margin-left: 2rem; padding: 1.5rem;">
                                <h4 style="color: var(--gold-primary); margin-bottom: 0.5rem;">Paso ${idx + 1}: ${step.game}</h4>
                                <p style="font-size: 0.95rem; margin: 0;">${step.desc}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>

                <div style="text-align: center; margin-top: 4rem;">
                    <button class="btn" onclick="location.reload()" aria-label="Reiniciar el Oráculo">Consultar al Oráculo Nuevamente</button>
                    <a href="cronologia-juegos.html" class="btn" style="margin-left: 1rem; background: var(--bg-abyss); border: 1px solid var(--gold-primary); color: var(--gold-primary);">Ver Compendio</a>
                </div>
            </div>
        `;
        this.quizContainer.innerHTML = html;
    }
}

// Estilos específicos dinámicos para el Quiz
const style = document.createElement('style');
style.textContent = `
    .fade-in { animation: fadeIn 0.6s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    
    .quiz-options { display: flex; flex-direction: column; gap: 1rem; }
    .quiz-option-btn {
        background: var(--bg-card); border: 1px solid var(--border-bronze);
        color: var(--text-bright); padding: 1.2rem; text-align: left;
        border-radius: 8px; font-family: var(--font-body); font-size: 1rem;
        cursor: pointer; transition: var(--transition-smooth);
    }
    .quiz-option-btn:hover, .quiz-option-btn:focus {
        border-color: var(--blue-sheikah); background: var(--bg-abyss);
        box-shadow: 0 0 15px rgba(0, 210, 255, 0.2); transform: translateX(10px);
    }
    
    .pathway-timeline { position: relative; max-width: 800px; margin: 0 auto; }
    .pathway-timeline::before {
        content: ''; position: absolute; left: 24px; top: 0; bottom: 0;
        width: 2px; background: linear-gradient(to bottom, var(--gold-primary), var(--blue-sheikah));
    }
    .pathway-step { position: relative; margin-bottom: 2rem; }
    .pathway-node {
        position: absolute; left: 0; top: 1.5rem; width: 50px; height: 50px;
        background: var(--bg-abyss); border: 2px solid var(--gold-primary);
        border-radius: 50%; display: flex; align-items: center; justify-content: center;
        font-family: var(--font-heading); font-size: 1.2rem; color: var(--gold-glow);
        z-index: 2; font-weight: bold; box-shadow: 0 0 10px rgba(212, 175, 55, 0.5);
    }
`;
document.head.appendChild(style);

document.addEventListener('DOMContentLoaded', () => {
    new QuizEngine();
});
