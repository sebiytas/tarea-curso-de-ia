/**
 * AI SkillTree - Main JavaScript
 * Phase 4 & 5: Minijuego, Cuestionario, IntersectionObserver y Typewriter
 */

document.addEventListener('DOMContentLoaded', () => {
    initSimulator();
    initHeroAnimation();
    initSkillTreeObserver();
    initEnrollmentWizard();
});

// ==========================================================================
// D. Demostración en Vivo (El Minijuego)
// ==========================================================================
function initSimulator() {
    const tempInput = document.getElementById('agent-temp');
    const tempValue = document.getElementById('temp-value');
    const roleSelect = document.getElementById('agent-role');
    const btnGenerate = document.getElementById('btn-generate');
    const outputContent = document.getElementById('demo-output');

    if (!tempInput || !roleSelect || !btnGenerate || !outputContent) return;

    // Base de datos simulada de respuestas
    const responses = {
        hacker: {
            low: "> Accediendo a la base de datos... \n> Protocolo de seguridad vulnerado. \n> Extraemos 100 registros precisos sin errores. Operación clínica.",
            high: "> Inyectando caos en el mainframe... \n> ¡Alerta de entropía! Los servidores cantan en binario.\n> Datos recuperados con creatividad cuántica. Hack the planet!"
        },
        mentor: {
            low: "> El camino del conocimiento es lineal.\n> Paso 1: Estudia los fundamentos.\n> Paso 2: Aplica la lógica.\n> La consistencia es la clave del maestro.",
            high: "> La mente es como un universo en expansión.\n> ¿Has considerado cómo las redes neuronales imitan tus propios pensamientos?\n> Explora más allá de los parámetros establecidos."
        },
        marketer: {
            low: "> Estrategia optimizada.\n> ROI proyectado: +45%.\n> CPL reducido a $1.20.\n> Implementando A/B testing en Landing Pages para asegurar conversión.",
            high: "> ¡Revoluciona tu nicho de mercado!\n> Imagina un funnel impulsado por IA que predice el deseo antes del clic.\n> Vamos a disrumpir la industria entera con un solo prompt."
        }
    };

    // Actualizar valor de temperatura visual
    tempInput.addEventListener('input', (e) => {
        tempValue.textContent = e.target.value;
    });

    btnGenerate.addEventListener('click', () => {
        const temp = parseFloat(tempInput.value);
        const role = roleSelect.value;
        
        const tempState = temp < 0.6 ? 'low' : 'high';
        const textToType = responses[role][tempState];
        
        outputContent.innerHTML = '<span style="color: #94a3b8">> Inicializando modelo...</span>';
        btnGenerate.disabled = true;
        btnGenerate.textContent = 'Generando...';

        setTimeout(() => {
            outputContent.innerHTML = '';
            typeWriterEffect(outputContent, textToType, 0, () => {
                btnGenerate.disabled = false;
                btnGenerate.textContent = 'Generar Respuesta';
            });
        }, 800);
    });
}

function typeWriterEffect(element, text, index = 0, callback = null) {
    if (index === 0) {
        element.classList.add('type-animation');
    }
    
    if (index < text.length) {
        let char = text.charAt(index);
        if (char === '\n') {
            element.innerHTML += '<br>';
        } else {
            element.innerHTML += char;
        }
        
        const speed = Math.random() * 30 + 10;
        
        setTimeout(() => {
            typeWriterEffect(element, text, index + 1, callback);
        }, speed);
    } else {
        element.classList.remove('type-animation');
        if (callback) callback();
    }
}

// ==========================================================================
// A. Hero Section (Typewriter & Canvas)
// ==========================================================================
function initHeroAnimation() {
    const typewriterElement = document.getElementById('typewriter');
    const phrases = [
        "Aprende a Automatizar con IA",
        "Aprende a Crear con IA",
        "Aprende a Innovar con IA"
    ];
    let phraseIndex = 0;
    
    function deleteText(element, callback) {
        let text = element.innerText;
        if (text.length > 0) {
            element.innerText = text.substring(0, text.length - 1);
            setTimeout(() => deleteText(element, callback), 50);
        } else {
            callback();
        }
    }
    
    function typeText(element, text, index, callback) {
        if (index < text.length) {
            element.innerText += text.charAt(index);
            setTimeout(() => typeText(element, text, index + 1, callback), 100);
        } else {
            callback();
        }
    }
    
    function cyclePhrases() {
        setTimeout(() => {
            deleteText(typewriterElement, () => {
                phraseIndex = (phraseIndex + 1) % phrases.length;
                typeText(typewriterElement, phrases[phraseIndex], 0, cyclePhrases);
            });
        }, 2500);
    }
    
    if (typewriterElement) {
        setTimeout(cyclePhrases, 2500);
    }

    // Canvas Background (Red de nodos)
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    
    function resize() {
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;
    }
    
    window.addEventListener('resize', resize);
    resize();
    
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.radius = Math.random() * 2 + 1;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
            if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(139, 92, 246, 0.5)';
            ctx.fill();
        }
    }
    
    for (let i = 0; i < 50; i++) {
        particles.push(new Particle());
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(6, 182, 212, ${1 - dist/150})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animate);
    }
    animate();
}

// ==========================================================================
// B. Árbol de Habilidades (IntersectionObserver)
// ==========================================================================
function initSkillTreeObserver() {
    const nodes = document.querySelectorAll('.node');
    const lineGlow = document.querySelector('.tree__line-glow');
    
    if (!nodes.length || !lineGlow) return;
    
    // Observer para activar nodos
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.5, rootMargin: '0px 0px -100px 0px' });
    
    nodes.forEach(node => observer.observe(node));
    
    // Evento de scroll para la línea
    window.addEventListener('scroll', () => {
        const treeElement = document.querySelector('.tree');
        if (!treeElement) return;
        const rect = treeElement.getBoundingClientRect();
        
        // Calcula qué porcentaje del árbol ha pasado el centro de la pantalla
        const windowHeight = window.innerHeight;
        const startPoint = rect.top - (windowHeight / 2);
        const totalHeight = rect.height;
        
        if (startPoint < 0) {
            let percentage = Math.abs(startPoint) / totalHeight * 100;
            percentage = Math.min(Math.max(percentage, 0), 100);
            lineGlow.style.height = `${percentage}%`;
        } else {
            lineGlow.style.height = `0%`;
        }
    });
}

// ==========================================================================
// F. Modal y Micro-Cuestionario (Wizard)
// ==========================================================================
function initEnrollmentWizard() {
    const modal = document.getElementById('enrollment-modal');
    const btnStart = document.getElementById('btn-start');
    const btnClose = document.getElementById('modal-close');
    const form = document.getElementById('enrollment-form');
    const steps = document.querySelectorAll('.wizard__step');
    const nextBtns = document.querySelectorAll('.btn-next');
    const prevBtns = document.querySelectorAll('.btn-prev');
    
    if (!modal) return;
    
    let currentStep = 0;
    
    function showStep(index) {
        steps.forEach((step, i) => {
            if (i === index) {
                step.classList.add('wizard__step--active');
            } else {
                step.classList.remove('wizard__step--active');
            }
        });
    }
    
    if (btnStart) {
        btnStart.addEventListener('click', () => {
            modal.showModal();
            currentStep = 0;
            showStep(currentStep);
        });
    }
    
    if (btnClose) {
        btnClose.addEventListener('click', () => {
            modal.close();
        });
    }
    
    // Cerrar al hacer clic en el backdrop
    modal.addEventListener('click', (e) => {
        const dialogDimensions = modal.getBoundingClientRect();
        if (
            e.clientX < dialogDimensions.left ||
            e.clientX > dialogDimensions.right ||
            e.clientY < dialogDimensions.top ||
            e.clientY > dialogDimensions.bottom
        ) {
            modal.close();
        }
    });
    
    nextBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Validación simple para el paso actual
            const currentFieldset = steps[currentStep];
            const inputs = currentFieldset.querySelectorAll('input[type="radio"], input[type="checkbox"]');
            
            if (inputs.length > 0) {
                const checked = Array.from(inputs).some(input => input.checked);
                if (!checked) {
                    alert("Por favor selecciona al menos una opción para continuar.");
                    return;
                }
            }
            
            if (currentStep < steps.length - 1) {
                currentStep++;
                showStep(currentStep);
            }
        });
    });
    
    prevBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (currentStep > 0) {
                currentStep--;
                showStep(currentStep);
            }
        });
    });
    
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Recolectar datos y guardar en Storage
            const formData = new FormData(form);
            const data = {
                level: formData.get('level'),
                goals: formData.getAll('goals'),
                email: formData.get('user-email')
            };
            
            localStorage.setItem('ai_skilltree_enrollment', JSON.stringify(data));
            
            // Simular envío
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Enviando...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                modal.close();
                alert(`¡Bienvenido a la academia! Hemos enviado tu ruta a ${data.email}.`);
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                form.reset();
            }, 1000);
        });
    }
}
