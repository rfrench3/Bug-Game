const grid = document.getElementById('grid');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const gameOverMessage = document.getElementById('gameOverMessage');
const finalScore = document.getElementById('finalScore');

const bugEmoji = '🐛';
const splatEmoji = '💥';
const bombEmoji = '💣'; // Add bomb emoji
const numHoles = 12;
let score = 0;
let timeLeft = 30;
let gameInterval;
let bugTimers = [];
let gameOver = false;

// Create holes
for (let i = 0; i < numHoles; i++) {
    const hole = document.createElement('div');
    hole.classList.add('hole');
    hole.dataset.index = i;
    grid.appendChild(hole);
}

function spawnBugOrBomb() {
    if (gameOver) return;

    const holes = document.querySelectorAll('.hole');
    const availableHoles = [...holes].filter(h => !h.classList.contains('active'));

    if (availableHoles.length === 0) return;

    const randomHole = availableHoles[Math.floor(Math.random() * availableHoles.length)];

    randomHole.classList.add('active');

    // Randomly decide to spawn a bug or a bomb (e.g., 70% bug, 30% bomb)
    const isBomb = Math.random() < 0.3;
    if (isBomb) {
        randomHole.innerHTML = `<span class="bomb">${bombEmoji}</span>`;
        const bomb = randomHole.querySelector('.bomb');
        bomb.addEventListener('click', () => {
            if (gameOver || !randomHole.classList.contains('active')) return;

            score = Math.max(0, score - 15); // Remove points, don't go below 0
            scoreDisplay.textContent = `Score: ${score}`;

            bomb.textContent = splatEmoji;
            bomb.classList.add('squashed');

            setTimeout(() => {
                randomHole.innerHTML = '';
                randomHole.classList.remove('active');
            }, 500);
        });
    } else {
        randomHole.innerHTML = `<span class="bug">${bugEmoji}</span>`;
        const bug = randomHole.querySelector('.bug');
        bug.addEventListener('click', () => {
            if (gameOver || !randomHole.classList.contains('active')) return;

            score += 10;
            scoreDisplay.textContent = `Score: ${score}`;

            bug.textContent = splatEmoji;
            bug.classList.add('squashed');

            setTimeout(() => {
                randomHole.innerHTML = '';
                randomHole.classList.remove('active');
            }, 500);
        });
    }

    // Remove the bug or bomb after 1.5 seconds if not clicked
    const timerId = setTimeout(() => {
        if (randomHole.classList.contains('active')) {
            randomHole.innerHTML = '';
            randomHole.classList.remove('active');
        }
    }, 1500);

    bugTimers.push(timerId);
}

function startGame() {
    gameInterval = setInterval(() => {
        spawnBugOrBomb();
    }, 800);

    const countdown = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = `⏱ 0:${timeLeft < 10 ? '0' : ''}${timeLeft}`;
    if (timeLeft <= 0) {
        clearInterval(gameInterval);
        clearInterval(countdown);
        bugTimers.forEach(clearTimeout);
        endGame();
    }
    }, 1000);
}

function endGame() {
    gameOver = true;
    const holes = document.querySelectorAll('.hole');
    holes.forEach(hole => {
    hole.innerHTML = '';
    hole.classList.remove('active');
    });
    finalScore.textContent = score;
    gameOverMessage.classList.remove('hidden');
}

startGame();