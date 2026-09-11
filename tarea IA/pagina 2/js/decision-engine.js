/**
 * VAULT2000 - DECISION ENGINE
 * Motor de inferencia algorítmica y controlador del wizard interactivo.
 */

document.addEventListener('DOMContentLoaded', () => {
  const games = StorageEngine.getGames();
  const errorMemory = document.getElementById('error-memory');
  const oracleModule = document.getElementById('oracle-module');
  
  if (!errorMemory || !oracleModule) return; // No estamos en decision-matrix.html

  // 1. Verificación de seguridad (Mínimo 2 juegos)
  if (games.length < 2) {
    errorMemory.style.display = 'block';
    return;
  }
  
  // Mostrar Oráculo
  oracleModule.style.display = 'block';

  // 2. Control del Wizard (Multifase)
  const steps = document.querySelectorAll('.wizard-step');
  const segments = document.querySelectorAll('.progress-segment');
  
  // Selección visual de radio buttons
  document.querySelectorAll('.wizard-option').forEach(option => {
    option.addEventListener('click', function() {
      const parentStep = this.closest('.wizard-step');
      parentStep.querySelectorAll('.wizard-option').forEach(opt => opt.classList.remove('selected'));
      this.classList.add('selected');
      this.querySelector('input[type="radio"]').checked = true;
    });
  });

  // Navegación Siguiente
  document.querySelectorAll('.btn-next').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const nextStepIndex = parseInt(e.target.getAttribute('data-next'));
      const currentStep = document.getElementById(`step-${nextStepIndex - 1}`);
      
      // Validar si hay selección
      const selected = currentStep.querySelector('input[type="radio"]:checked');
      if (!selected) {
        alert('SISTEMA: REQUIERE INPUT PARA CONTINUAR');
        return;
      }
      
      goToStep(nextStepIndex);
    });
  });

  // Navegación Atrás
  document.querySelectorAll('.btn-prev').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const prevStepIndex = parseInt(e.target.getAttribute('data-prev'));
      goToStep(prevStepIndex);
    });
  });

  function goToStep(stepNumber) {
    steps.forEach(step => step.classList.remove('active'));
    document.getElementById(`step-${stepNumber}`).classList.add('active');
    
    // Actualizar barra
    segments.forEach((seg, index) => {
      if (index < stepNumber) {
        seg.classList.add('filled');
      } else {
        seg.classList.remove('filled');
      }
    });
  }

  // 3. Procesamiento del Algoritmo (Submit)
  const form = document.getElementById('decision-form');
  const resultSection = document.getElementById('analysis-result');
  
  // Variables de resultado
  const matchScore = document.getElementById('match-score');
  const matchTitle = document.getElementById('match-title');
  const matchReason = document.getElementById('match-reason');
  const btnPlayNow = document.getElementById('btn-play-now');
  const btnRecalculate = document.getElementById('btn-recalculate');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(form);
    const answers = {
      platform: formData.get('q_platform'),
      time: formData.get('q_time'),
      mood: formData.get('q_mood'),
      priority: formData.get('q_priority')
    };

    const bestMatch = runMatchingAlgorithm(games, answers);

    // Mostrar Resultado
    oracleModule.style.display = 'none';
    resultSection.style.display = 'block';

    if (!bestMatch) {
      matchScore.textContent = '0%';
      matchTitle.textContent = '[ ERROR 404 ]';
      matchReason.textContent = 'Ningún registro superó el umbral de filtrado (posiblemente todos están terminados).';
      btnPlayNow.style.display = 'none';
      return;
    }

    matchScore.textContent = `${bestMatch.score}%`;
    matchTitle.textContent = `> ${bestMatch.game.title}`;
    
    // Construir justificación
    let justification = `RESULTADO: Seleccionado [${bestMatch.game.title}] `;
    justification += `por coincidir con plataforma [${bestMatch.game.platform}], `;
    justification += `duración [${bestMatch.game.duration}] y género/ritmo [${bestMatch.game.genre} - ${bestMatch.game.pace}].`;
    matchReason.textContent = justification;

    btnPlayNow.style.display = 'block';
    btnPlayNow.setAttribute('data-id', bestMatch.game.id);
  });

  // Botones finales
  btnRecalculate.addEventListener('click', () => {
    resultSection.style.display = 'none';
    oracleModule.style.display = 'block';
    goToStep(1);
    form.reset();
    document.querySelectorAll('.wizard-option').forEach(opt => opt.classList.remove('selected'));
  });

  btnPlayNow.addEventListener('click', (e) => {
    const id = e.target.getAttribute('data-id');
    StorageEngine.updateGameStatus(id, 'playing');
    alert('SISTEMA: ESTADO ACTUALIZADO A "EN PROGRESO".');
    window.location.href = 'index.html';
  });

  // --- MOTOR DE PONDERACIÓN ---
  function runMatchingAlgorithm(dbGames, answers) {
    // Excluir terminados
    const pool = dbGames.filter(g => g.status !== 'cleared');
    if (pool.length === 0) return null;

    let bestGame = null;
    let maxScore = -1;

    pool.forEach(game => {
      let score = 0;
      let maxPossibleScore = 100; // Normalización a porcentaje
      
      let currentScoreRaw = 0;
      let maxRaw = 0;

      // 1. Plataforma (Peso: 30)
      const group = StorageEngine.categorizePlatform(game.platform);
      maxRaw += 30;
      if (answers.platform === 'any') {
        currentScoreRaw += 15; // Puntaje neutral
      } else if (
        (answers.platform === 'pc' && group === 'PC STATION') ||
        (answers.platform === 'portable' && (group === 'MOBILE CORE' || group === 'DUAL SCREEN ARCHIVE')) ||
        (answers.platform === 'ps' && group === 'PLAYSTATION VAULT')
      ) {
        currentScoreRaw += 30;
      }

      // 2. Tiempo (Peso: 25)
      maxRaw += 25;
      if (answers.time === 'short' && game.duration === 'Corto') currentScoreRaw += 25;
      if (answers.time === 'medium' && game.duration === 'Medio') currentScoreRaw += 25;
      if (answers.time === 'long' && game.duration === 'Largo') currentScoreRaw += 25;
      if (answers.time === 'long' && game.duration === 'Medio') currentScoreRaw += 10; // Match parcial

      // 3. Mood (Peso: 25)
      maxRaw += 25;
      const pace = game.pace;
      const genre = game.genre;
      
      if (answers.mood === 'frenetic' && (pace === 'Frenético' || genre === 'Acción' || genre === 'Carreras')) currentScoreRaw += 25;
      if (answers.mood === 'narrative' && (pace === 'Narrativo' || genre === 'RPG' || genre === 'Aventura')) currentScoreRaw += 25;
      if (answers.mood === 'cozy' && (pace === 'Relajado' || genre === 'Puzzle')) currentScoreRaw += 25;
      if (answers.mood === 'hard' && (pace === 'Estratégico' || genre === 'Estrategia' || genre === 'Lucha')) currentScoreRaw += 25;

      // 4. Prioridad (Peso: 20)
      maxRaw += 20;
      if (answers.priority === 'any') {
        currentScoreRaw += 10;
      } else if (answers.priority === game.status) {
        currentScoreRaw += 20;
      }

      // Calcular porcentaje
      const finalPercentage = Math.round((currentScoreRaw / maxRaw) * 100);

      // Si hay empate, aplicar un pequeño ruido aleatorio (1-5%) para variar resultados
      const tieBreaker = Math.floor(Math.random() * 5);
      const scoreWithTieBreaker = finalPercentage + (tieBreaker * 0.01);

      if (scoreWithTieBreaker > maxScore) {
        maxScore = scoreWithTieBreaker;
        bestGame = { game: game, score: finalPercentage }; // Guardamos el % limpio para mostrar
      }
    });

    return bestGame;
  }
});
