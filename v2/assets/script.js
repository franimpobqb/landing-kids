class GeniusMemoryGame {
    constructor() {
        this.board = document.getElementById('gameBoard');
        this.movesDisplay = document.getElementById('moves');
        this.timeDisplay = document.getElementById('time');
        this.matchesDisplay = document.getElementById('matches');
        this.winModal = document.getElementById('winModal');
        this.exitModal = document.getElementById('exit-modal');
        this.restartBtn = document.getElementById('restartBtn');
        this.playAgainBtn = document.getElementById('playAgainBtn');
        this.exitBtn = document.getElementById('exit-btn-game');
        this.soundToggle = document.getElementById('soundToggle');
        this.cancelExitBtn = document.querySelector('#exit-modal .cancel-btn');


        this.moves = 0;
        this.matches = 0;
        this.timer = 0;
        this.timerInterval = null;
        this.firstCard = null;
        this.secondCard = null;
        this.lockBoard = false;
        this.soundEnabled = true;
        this.currentLevel = '4x4'; // Default starting level

        this.cardSymbols = {
            '4x4': [
                'images/img_01.png', 'images/img_02.png', 'images/img_03.png', 'images/img_04.png',
                'images/img_05.png', 'images/img_06.png', 'images/img_07.png', 'images/img_08.png'
            ],
            '5x4': [
                'images/img_01.png', 'images/img_02.png', 'images/img_03.png', 'images/img_04.png',
                'images/img_05.png', 'images/img_06.png', 'images/img_07.png', 'images/img_08.png',
                'images/img_09.png', 'images/img_10.png'
            ],
            '6x5': [
                'images/img_01.png', 'images/img_02.png', 'images/img_03.png', 'images/img_04.png',
                'images/img_05.png', 'images/img_06.png', 'images/img_07.png', 'images/img_08.png',
                'images/img_09.png', 'images/img_10.png', 'images/img_11.png', 'images/img_12.png',
                'images/img_13.png', 'images/img_14.png', 'images/img_15.png'
            ]
        };

        this.difficultyBtn = document.getElementById('difficultyBtn');
        this.difficultyModal = document.getElementById('difficultyModal');
        this.closeDifficultyBtn = document.getElementById('closeDifficultyBtn');
        this.currentLevel = '4x4';

        this.init();
    }

    init() {
        this.attachEventListeners();
        this.createBoard();
        this.startTimer();
    }

    attachEventListeners() {
        this.restartBtn.addEventListener('click', () => this.restartGame());
        this.playAgainBtn.addEventListener('click', () => this.closeWinModal());
        this.playAgainBtn.addEventListener('click', () => this.closeExitModal());
        this.soundToggle.addEventListener('click', () => this.toggleSound());

        if (this.cancelExitBtn) {
            this.cancelExitBtn.addEventListener('click', () => this.closeExitModal());
        }

        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentLevel = e.target.dataset.level;
                this.restartGame();
            });
        });

        this.difficultyBtn.addEventListener('click', () => this.openDifficultyModal());
        this.exitBtn.addEventListener('click', () => this.openExitModal());
        this.closeDifficultyBtn.addEventListener('click', () => this.closeDifficultyModal());

        document.querySelectorAll('.modal-difficulty-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.modal-difficulty-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentLevel = e.target.dataset.level;
                this.restartGame();
                this.closeDifficultyModal();
            });
        });

        // --- NEW: Add listeners to close modals when clicking outside ---
        this.winModal.addEventListener('click', (e) => {
            if (e.target === this.winModal) {
                this.closeWinModal();
            }
        });

        this.exitModal.addEventListener('click', (e) => {
            if (e.target === this.exitModal) {
                this.closeExitModal();
            }
        });

        this.difficultyModal.addEventListener('click', (e) => {
            if (e.target === this.difficultyModal) {
                this.closeDifficultyModal();
            }
        });
    }

    createBoard() {
        this.board.innerHTML = '';
        this.board.className = `game-board grid-${this.currentLevel.replace('x', '-')}`;
        const symbols = this.getShuffledSymbols();
        symbols.forEach((symbol, index) => {
            const card = document.createElement('div');
            card.className = 'card';
            card.dataset.symbol = symbol;
            card.dataset.index = index;
            card.innerHTML = `
                <div class="card-face card-back"></div>
                <div class="card-face card-front"><img src="${symbol}" alt="Card symbol" class="card-image"></div>
            `;
            card.addEventListener('click', () => this.flipCard(card));
            this.board.appendChild(card);
        });
    }

    getShuffledSymbols() {
        const level = this.currentLevel;
        const [rows, cols] = level.split('x').map(Number);
        const totalCards = rows * cols;
        const pairsNeeded = totalCards / 2;
        const symbols = this.cardSymbols[level].slice(0, pairsNeeded);
        const doubledSymbols = [...symbols, ...symbols];
        return this.shuffleArray(doubledSymbols);
    }

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    flipCard(card) {
        if (this.lockBoard || card.classList.contains('flipped') || card.classList.contains('matched')) {
            return;
        }
        card.classList.add('flipped');
        this.playSound('flip');
        if (!this.firstCard) {
            this.firstCard = card;
            return;
        }
        this.secondCard = card;
        this.moves++;
        this.movesDisplay.textContent = this.moves;
        this.lockBoard = true;
        this.checkForMatch();
    }

    checkForMatch() {
        const isMatch = this.firstCard.dataset.symbol === this.secondCard.dataset.symbol;
        setTimeout(() => {
            if (isMatch) {
                this.handleMatch();
            } else {
                this.handleMismatch();
            }
        }, 800);
    }

    handleMatch() {
        this.firstCard.classList.add('matched');
        this.secondCard.classList.add('matched');
        this.matches++;
        this.matchesDisplay.textContent = this.matches;
        this.playSound('match');
        this.resetBoard();
        if (this.checkWin()) {
            setTimeout(() => this.showWinModal(), 500);
        }
    }

    handleMismatch() {
        this.firstCard.classList.remove('flipped');
        this.secondCard.classList.remove('flipped');
        this.playSound('mismatch');
        this.resetBoard();
    }

    resetBoard() {
        [this.firstCard, this.secondCard] = [null, null];
        this.lockBoard = false;
    }

    checkWin() {
        const level = this.currentLevel;
        const [rows, cols] = level.split('x').map(Number);
        const totalPairs = (rows * cols) / 2;
        return this.matches === totalPairs;
    }

    showWinModal() {
        this.stopTimer();
        this.playSound('win');
        document.getElementById('winMoves').textContent = this.moves;
        document.getElementById('winTime').textContent = this.formatTime(this.timer);
        this.winModal.classList.add('show');
    }

    openDifficultyModal() {
        this.stopTimer(); // --- MODIFIED ---
        this.difficultyModal.classList.add('show');
    }

    openExitModal() {
        this.stopTimer();
        this.exitModal.classList.add('show');
    }

    closeDifficultyModal() {
        this.difficultyModal.classList.remove('show');
        this.startTimer(); // --- MODIFIED ---
    }

    restartGame() {
        console.log(`Restarting game with new level: ${this.currentLevel}`);
        this.moves = 0;
        this.matches = 0;
        this.timer = 0;
        this.movesDisplay.textContent = '0';
        this.matchesDisplay.textContent = '0';
        this.timeDisplay.textContent = '00:00';
        this.resetBoard();
        this.createBoard();
        this.startTimer();
    }

    closeWinModal() {
        this.winModal.classList.remove('show');
        this.restartGame();
    }

    closeExitModal() {
        this.exitModal.classList.remove('show');
        this.startTimer();
    }

    startTimer() {
        // Prevent multiple timers from running
        if (this.timerInterval) return;
        this.timerInterval = setInterval(() => {
            this.timer++;
            this.timeDisplay.textContent = this.formatTime(this.timer);
        }, 1000);
    }

    stopTimer() {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        if (this.soundEnabled) {
            this.soundToggle.innerHTML = '<img src="images/icon-sound-on.png" alt="Sound On" style="width: 75px; height: auto;">';
        } else {
            this.soundToggle.innerHTML = '<img src="images/icon-sound-off.png" alt="Sound Off" style="width: 75px; height: auto;">';
        }
    }

    playSound(type) {
        if (!this.soundEnabled) return;
        const audioContext = new(window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        let frequency = 440;
        let duration = 0.1;
        switch (type) {
            case 'flip':
                frequency = 600;
                duration = 0.1;
                break;
            case 'match':
                frequency = 800;
                duration = 0.3;
                break;
            case 'mismatch':
                frequency = 300;
                duration = 0.2;
                break;
            case 'win':
                frequency = 1000;
                duration = 0.5;
                break;
        }
        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration);
    }
}

const goBackButton = document.getElementById('go-back');
if (goBackButton) {
    goBackButton.addEventListener('click', () => {
        window.location.href = '/index.html';
    });
}

window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    const gameContainer = document.getElementById('gameContainer');
    setTimeout(() => {
        preloader.classList.add('hidden');
        setTimeout(() => {
            gameContainer.classList.add('loaded');
            new GeniusMemoryGame();
        }, 600);
    }, 3500);
});