import { state } from './state.js';
import * as C from './config.js';

// --- Placeholder image URLs (replace with your actual image paths) ---
const CORRECT_IMG_URL = 'images/icon-ok.webp'; // Example path
const INCORRECT_IMG_URL = 'images/icon-wrong.webp'; // Example path

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
    // --- Get all UI elements ---
    const questionModal = document.getElementById("question-modal");
    const qText = document.getElementById("question-text");
    const optA = document.getElementById("optA");
    const optB = document.getElementById("optB");
    const optC = document.getElementById("optC");
    // Store options in an array for easy access by index
    const optionButtons = [optA, optB, optC];
   	state.scoreEl = document.getElementById("score");

   	const introModal = document.getElementById("intro-modal");
   	const startBtn = document.getElementById("start-game-btn");

   	const restartBtnFinal = document.getElementById("restart-btn-final");
   	const homepageBtn = document.getElementById("homepage-btn");

   	state.timerEl = document.getElementById("timer");

   	const modalIcon = document.getElementById("modal-category-icon");
   	const modalCategoryName = document.getElementById("modal-category-name");
   	const answerOptions = document.getElementById("answer-options");

   	// --- Feedback Elements ---
   	const answerFeedback = document.getElementById("answer-feedback");
   	const feedbackImage = document.getElementById("feedback-image"); // NEW
   	const feedbackText = document.getElementById("feedback-text");
   	const feedbackDetails = document.getElementById("feedback-details"); // NEW
   	const userAnswerText = document.getElementById("user-answer-text"); // NEW
   	const correctAnswerText = document.getElementById("correct-answer-text"); // NEW
   	const continueBtn = document.getElementById("continue-btn");

   	// --- Game Controls & Confirmation Modals ---
   	const gameRestartBtn = document.getElementById("restart-btn-game");
   	const gameExitBtn = document.getElementById("exit-btn-game");
   	const restartModal = document.getElementById("restart-modal");
   	const exitModal = document.getElementById("exit-modal");
   	const restartConfirmBtn = document.getElementById("restart-confirm-btn");
   	const exitConfirmBtn = document.getElementById("exit-confirm-btn");
   	const cancelButtons = document.querySelectorAll(".cancel-btn");


   	// --- Question Modal Logic ---
   	function showQuestionModal(cp) {
       	// NEW: Ensure category elements are visible when question appears
       	modalCategoryName.style.display = "block";
       	modalCategoryName.textContent = cp.question.category || 'General';

       	if (cp.question.category && C.CATEGORY_ICONS[cp.question.category] && modalIcon) {
           	modalIcon.src = C.CATEGORY_ICONS[cp.question.category];
           	modalIcon.style.display = "block";
       	} else if (modalIcon) {
           	modalIcon.style.display = "none";
       	}

       	qText.textContent = cp.question.q;
       	optA.textContent = `${cp.question.options[0]}`;
       	optB.textContent = `${cp.question.options[1]}`;
       	optC.textContent = `${cp.question.options[2]}`;

       	questionModal.dataset.correct = cp.question.correct;
       	questionModal.dataset.cpId = cp.id;
       	// Store the actual question object for easy answer lookup later
       	questionModal.dataset.questionData = JSON.stringify(cp.question);


       	answerOptions.style.display = "block";
       	answerFeedback.style.display = "none";

       	questionModal.style.display = "flex";
       	state.gamePaused = true;
   	}

   	state.showQuestionModal = showQuestionModal;

   	// --- UPDATED: checkAnswer ---
   	function checkAnswer(chosenIndex) {
       	const correctIndex = parseInt(questionModal.dataset.correct, 10);
       	const cpId = parseInt(questionModal.dataset.cpId, 10);
       	// Get the full question data back
       	const questionData = JSON.parse(questionModal.dataset.questionData || '{}');
       	const options = questionData.options || [];

       	const userSelectedOptionText = options[chosenIndex] || "Error";
       	const correctOptionText = options[correctIndex] || "Error";

       	answerOptions.style.display = "none";
       	answerFeedback.style.display = "block";

       	// NEW: Hide category info when feedback is shown
       	modalIcon.style.display = "none";
       	modalCategoryName.style.display = "none";

       	// Clear previous answer details
       	userAnswerText.textContent = '';
       	userAnswerText.className = 'user-answer'; // Reset class
       	correctAnswerText.textContent = '';

       	if (chosenIndex === correctIndex) {
           	// Correct Answer
           	state.score++;
           	state.scoreEl.textContent = state.score;
           	feedbackImage.src = CORRECT_IMG_URL;
           	feedbackText.textContent = "¡Correcto! ¡Adelante! 🚢";
           	feedbackText.className = "correct";
           	// Show only the correct answer in green
           	correctAnswerText.textContent = `✓ ${correctOptionText}`;
           	correctAnswerText.className = "correct-answer";

       	} else {
           	// Incorrect Answer
           	feedbackImage.src = INCORRECT_IMG_URL;
           	feedbackText.textContent = "Incorrecto 🧭";
           	feedbackText.className = "incorrect";
           	// Show user's wrong answer in red (with strikethrough via CSS)
           	userAnswerText.textContent = `Tu respuesta: ${userSelectedOptionText}`;
           	userAnswerText.classList.add("incorrect");
           	  // Show the correct answer in green
           	correctAnswerText.textContent = `Correcta: ${correctOptionText}`;
     	correctAnswerText.className = "correct-answer";
       	}

       	// Remove checkpoint from scene
       	const cpIndex = state.checkpointObjs.findIndex((c) => c.id === cpId);
       	if (cpIndex !== -1) {
           	const cp = state.checkpointObjs[cpIndex];
           	if (cp.mesh) state.scene.remove(cp.mesh);
           	if (cp.icon) state.scene.remove(cp.icon);
           	cp.reached = true; // Mark as reached in the state array
       	}
   	}

   	optionButtons.forEach((button, index) => {
       	button.addEventListener("click", () => checkAnswer(index));
 	});

   	function closeQuestionModal() {
       	questionModal.style.display = "none";
       	if (state.timerValue > 0 && introModal.style.display === "none") {
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
    if (restartBtnFinal) {
        restartBtnFinal.addEventListener("click", () => {
            location.reload();
        });
    }
   	if (homepageBtn) {
       	homepageBtn.addEventListener("click", (e) => {
           	e.preventDefault();
           	location.href = "/";
       	});
   	}

   	// --- CTA Button Logic ---
   	if (gameRestartBtn && restartModal) {
       	gameRestartBtn.addEventListener("click", () => {
           	restartModal.style.display = "flex";
           	state.gamePaused = true;
 A     	});
   	}

   	if (gameExitBtn && exitModal) {
       	gameExitBtn.addEventListener("click", () => {
           	exitModal.style.display = "flex";
           	state.gamePaused = true;
       	});
   	}

   	// --- Confirmation Button Logic ---
   	if (restartConfirmBtn) {
       	restartConfirmBtn.addEventListener("click", () => {
           	location.reload();
       	});
   	}

   	if (exitConfirmBtn) {
       	exitConfirmBtn.addEventListener("click", () => {
      	location.href = "/";
       	});
   	}

   	// --- Generic Cancel Button Logic ---
   	cancelButtons.forEach(button => {
       	button.addEventListener("click", () => {
           	const modal = button.closest(".modal-overlay");
           	if (modal) {
               	modal.style.display = "none";
           	}
           	if (state.timerValue > 0 && introModal.style.display === "none") {
          	state.gamePaused = false;
           	}
       	});
   	});

   	// Set initial timer display
   	updateTimerDisplay();
}