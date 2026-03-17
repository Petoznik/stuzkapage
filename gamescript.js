const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const startButton = document.getElementById('startButton');

let gameRunning = false;
let score = 0;
let startTime = 0;
let elapsedTime = 0;

let character = {
    x: 60,
    y: 400,
    width: 72,
    height: 160,
    velocityY: 0,
    jumping: false
};

let obstacles = [];
let gravity = 0.9;        // menší gravitace → delší skok
let jumpStrength = -38;   // silnější skok
let obstacleSpeed = 2.8;
let gameSpeed = 1;

let obstacleTimer = 0;

// 🔊 Sounds
const jumpSound = new Audio('jump.wav');
const hitSound = new Audio('hit.wav');

const characterImg = new Image();
characterImg.src = 'hrac.png';

const ballImg = new Image();
ballImg.src = 'ballos.png';

const backgroundImg = new Image();
backgroundImg.src = 'pozadi.jpg';

function startGame() {
    gameRunning = true;
    score = 0;
    startTime = Date.now();
    elapsedTime = 0;
    gameSpeed = 1;
    obstacleTimer = 0;

    character.y = 400;
    character.velocityY = 0;
    character.jumping = false;

    obstacles = [];
    createObstacle();

    startButton.style.display = 'none';
    gameLoop();
}

function jump() {
    if (!character.jumping) {
        character.velocityY = jumpStrength;
        character.jumping = true;

        jumpSound.currentTime = 0;
        jumpSound.play();
    }
}

function createObstacle() {
    const size = 72;
    obstacles.push({
        x: canvas.width,
        y: 560 - size,
        width: size,
        height: size
    });
}

function update() {
    if (!gameRunning) return;

    elapsedTime = Date.now() - startTime;

    // Character physics
    character.velocityY += gravity;
    character.y += character.velocityY;

    if (character.y >= 400) {
        character.y = 400;
        character.velocityY = 0;
        character.jumping = false;
    }

    // Obstacles
    for (let i = obstacles.length - 1; i >= 0; i--) {
        obstacles[i].x -= obstacleSpeed * gameSpeed;

        if (obstacles[i].x + obstacles[i].width < 0) {
            obstacles.splice(i, 1);
            score++;
        }

        // lepší hitbox
        if (
            character.x + 10 < obstacles[i].x + obstacles[i].width - 10 &&
            character.x + character.width - 10 > obstacles[i].x + 10 &&
            character.y + 10 < obstacles[i].y + obstacles[i].height - 10 &&
            character.y + character.height - 10 > obstacles[i].y + 10
        ) {
            gameOver();
        }
    }

    // 🔥 mnohem větší mezery mezi míči
    obstacleTimer++;
    if (obstacleTimer > 220) { // bylo 140 → teď velké mezery
        createObstacle();
        obstacleTimer = 0;
    }

    gameSpeed += 0.00005;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#8B4513';
    ctx.fillRect(0, 560, canvas.width, 32);

    ctx.drawImage(characterImg, character.x, character.y, character.width, character.height);

    obstacles.forEach(obstacle => {
        ctx.drawImage(ballImg, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });
}

function gameLoop() {
    update();
    draw();

    const timeSeconds = (elapsedTime / 1000).toFixed(1);
    scoreElement.textContent = `Score: ${score} · Time: ${timeSeconds}s`;

    if (gameRunning) {
        requestAnimationFrame(gameLoop);
    }
}

function gameOver() {
    gameRunning = false;

    hitSound.currentTime = 0;
    hitSound.play();

    startButton.style.display = 'block';
    startButton.textContent = 'Game Over - Play Again';
}

// 🎮 klávesnice
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        if (gameRunning) {
            jump();
        } else {
            startGame();
        }
    }
});

// 📱 mobil
canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    if (gameRunning) {
        jump();
    } else {
        startGame();
    }
});

// 🖱️ myš
canvas.addEventListener('mousedown', () => {
    if (gameRunning) {
        jump();
    } else {
        startGame();
    }
});

startButton.addEventListener('click', startGame);

// Load images
let imagesLoaded = 0;
function imageLoaded() {
    imagesLoaded++;
}
characterImg.onload = imageLoaded;
ballImg.onload = imageLoaded;
backgroundImg.onload = imageLoaded;