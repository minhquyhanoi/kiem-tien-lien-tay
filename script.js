const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 600;
canvas.height = 300;

let player = {
    x: 50,
    y: 120,
    width: 50,
    height: 50,
    speed: 5,
    score: 0,
    image: new Image(),
};
player.image.src = "https://cdn-icons-png.flaticon.com/128/4140/4140048.png"; // Default avatar

let obstacles = [];
let items = [];
let gameTime = 180;
let gameInterval, itemInterval;
let speedMultiplier = 1.0;
let backgroundMusic = new Audio();
let playing = false;

// Functions
function drawPlayer() {
    ctx.drawImage(player.image, player.x, player.y, player.width, player.height);
}

function drawObstacles() {
    ctx.fillStyle = "red";
    obstacles.forEach((obs, index) => {
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
        obs.x -= 2 * speedMultiplier;
        if (obs.x < -obs.width) obstacles.splice(index, 1);
    });
}

function drawItems() {
    ctx.fillStyle = "gold";
    items.forEach((item, index) => {
        ctx.fillRect(item.x, item.y, 20, 20);
        item.x -= 3 * speedMultiplier;
        if (item.x < -20) items.splice(index, 1);
    });
}

function checkCollisions() {
    items.forEach((item, index) => {
        if (
            player.x < item.x + 20 &&
            player.x + player.width > item.x &&
            player.y < item.y + 20 &&
            player.y + player.height > item.y
        ) {
            player.score += 1;
            items.splice(index, 1);
            document.getElementById("score-display").innerText = `Score: $${player.score}`;
            new Audio("https://www.soundjay.com/button/beep-07.wav").play();
        }
    });
}

function updateGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    drawObstacles();
    drawItems();
    checkCollisions();
}

function startGame() {
    if (playing) return;
    playing = true;
    gameTime = 180;
    player.score = 0;
    speedMultiplier = 1.0;
    document.getElementById("score-display").innerText = "Score: $0";
    
    gameInterval = setInterval(() => {
        gameTime--;
        document.getElementById("time-display").innerText = `Time Left: ${gameTime}s`;
        if (gameTime <= 0) endGame();
    }, 1000);

    itemInterval = setInterval(() => {
        items.push({ x: canvas.width, y: Math.random() * canvas.height });
        speedMultiplier += 0.05;
    }, 2000);

    requestAnimationFrame(gameLoop);
}

function gameLoop() {
    if (gameTime > 0) {
        updateGame();
        requestAnimationFrame(gameLoop);
    }
}

function endGame() {
    clearInterval(gameInterval);
    clearInterval(itemInterval);
    playing = false;
    document.getElementById("winner-text").innerText = `Game Over! You earned $${player.score}`;
}

// Controls
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp") player.y -= player.speed;
    if (e.key === "ArrowDown") player.y += player.speed;
    if (e.key === "ArrowLeft") player.x -= player.speed;
    if (e.key === "ArrowRight") player.x += player.speed;
});

document.getElementById("start-game").addEventListener("click", startGame);
document.getElementById("reset-game").addEventListener("click", () => location.reload());
document.getElementById("exit-game").addEventListener("click", () => alert("Game Exited!"));

document.getElementById("level-up").addEventListener("click", () => {
    speedMultiplier += 0.5;
    alert("Level Up! Speed Increased!");
});

document.getElementById("music-upload").addEventListener("change", (event) => {
    let file = event.target.files[0];
    if (file) {
        backgroundMusic.src = URL.createObjectURL(file);
        backgroundMusic.play();
    }
});

document.getElementById("player-upload").addEventListener("change", (event) => {
    let file = event.target.files[0];
    if (file) {
        let objectURL = URL.createObjectURL(file);
        player.image.src = objectURL;
    }
});

document.getElementById("background-upload").addEventListener("change", (event) => {
    let file = event.target.files[0];
    if (file) {
        let objectURL = URL.createObjectURL(file);
        canvas.style.backgroundImage = `url(${objectURL})`;
    }
});
