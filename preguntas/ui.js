import { state } from './state.js';
import * as C from './config.js';

function formatTime(seconds) {
    const s = Number(seconds) || 0; 
    const mins = Math.floor(s / 60);
    const secs = Math.floor(s % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function updateTimerDisplay() {
    if (state.timerEl) {
        state.timerEl.textContent = formatTime(state.timerValue);
    }
}

export function showFinalModal() {
    const finalModal = document.getElementById("final-modal");
    const finalScoreEl = document.getElementById("final-score");
    
    if (finalModal && finalScoreEl) {
        finalScoreEl.textContent = state.score;
        finalModal.style.display = "flex";
        state.gamePaused = true;
    }
}

export function setupUI() {
    // Get all UI elements
    const questionModal = document.getElementById("question-modal");
    const qText = document.getElementById("question-text");
    const optA = document.getElementById("optA");
    const optB = document.getElementById("optB");
    const optC = document.getElementById("optC");
    state.scoreEl = document.getElementById("score");
    
    const introModal = document.getElementById("intro-modal");
    const startBtn = document.getElementById("start-game-btn");

    const restartBtn = document.getElementById("restart-btn");
    const homepageBtn = document.getElementById("homepage-btn");
    
    state.timerEl = document.getElementById("timer");

    const modalIcon = document.getElementById("modal-category-icon");
    
    // --- NEW: Get new modal elements ---
    const modalCategoryName = document.getElementById("modal-category-name");
    const answerOptions = document.getElementById("answer-options");
    const answerFeedback = document.getElementById("answer-feedback");
    const feedbackText = document.getElementById("feedback-text");
    const continueBtn = document.getElementById("continue-btn");
    
    // --- Question Modal Logic ---
    function showQuestionModal(cp) {
        // NEW: Set category name
        modalCategoryName.textContent = cp.question.category || 'General';

        if (cp.question.category && C.CATEGORY_ICONS[cp.question.category] && modalIcon) {
            modalIcon.src = C.CATEGORY_ICONS[cp.question.category];
            modalIcon.style.display = "block";
        } else if (modalIcon) {
            modalIcon.style.display = "none";
        }
        
        qText.textContent = cp.question.q;
        optA.textContent = `A) ${cp.question.options[0]}`;
        optB.textContent = `B) ${cp.question.options[1]}`;
        optC.textContent = `C) ${cp.question.options[2]}`;
        
        questionModal.dataset.correct = cp.question.correct;
        questionModal.dataset.cpId = cp.id;
        
        // NEW: Reset view (show options, hide feedback)
        answerOptions.style.display = "block";
        answerFeedback.style.display = "none";
        
        questionModal.style.display = "flex";
        state.gamePaused = true;
    }
    
    state.showQuestionModal = showQuestionModal; 

    function checkAnswer(chosenIndex) {
        const correct = parseInt(questionModal.dataset.correct, 10);
        const cpId = parseInt(questionModal.dataset.cpId, 10);
        
        // NEW: Hide options, show feedback (instead of closing modal)
        answerOptions.style.display = "none";
        answerFeedback.style.display = "block";
        
        if (chosenIndex === correct) {
            state.score++;
            state.scoreEl.textContent = state.score;
            // NEW: Set feedback text
            feedbackText.textContent = "Correct! Full speed ahead! 🚢";
            feedbackText.className = "correct";
        } else {
            // NEW: Set feedback text
            feedbackText.textContent = "Incorrect — study the charts! 🧭";
            feedbackText.className = "incorrect";
        }
        
        const cpIndex = state.checkpointObjs.findIndex((c) => c.id === cpId);
        if (cpIndex !== -1) {
            const cp = state.checkpointObjs[cpIndex];
            state.scene.remove(cp.mesh);
            if (cp.icon) state.scene.remove(cp.icon);
            cp.reached = true;
        }
    }
    
    optA.addEventListener("click", () => checkAnswer(0));
    optB.addEventListener("click", () => checkAnswer(1));
    optC.addEventListener("click", () => checkAnswer(2));

    // NEW: Handle clicking the "Continue" button after feedback
    function closeQuestionModal() {
        questionModal.style.display = "none";
        if (state.timerValue > 0) {
            state.gamePaused = false;
        }
    }
    continueBtn.addEventListener("click", closeQuestionModal);

    // --- Intro Modal Logic ---
    if (startBtn && introModal) {
        startBtn.addEventListener("click", () => {
            introModal.style.display = "none";
            state.gamePaused = false;
        });
    }

    // --- Final Modal Logic ---
    if (restartBtn) {
        restartBtn.addEventListener("click", () => {
            location.reload(); 
        });
    }
    if (homepageBtn) {
        homepageBtn.addEventListener("click", (e) => {
            e.preventDefault(); 
            alert("Taking you to homepage!"); 
            location.href = "/"; 
        });
    }
    
    // Set initial timer display
    updateTimerDisplay();
}