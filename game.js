const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const playBtn = document.getElementById("playBtn");

// ====== AJUSTE DE TELA ======
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// ====== CONTROLE DO JOGO ======
let gameStarted = false;

// ====== PLAYER ======
const player = {
  x: canvas.width / 2 - 25,
  y: 100,
  size: 50,
  vy: 0,
  gravity: 0.6,
  jumpForce: -14
};

// ====== TRAMPOLIM ======
const platform = {
  x: canvas.width / 2 - 60,
  y: canvas.height - 200,
  width: 120,
  height: 20,
  speed: 3,
  dir: 1
};

// ====== SCORE ======
let score = 0;
let record = localStorage.getItem("record") || 0;

// ====== TOUCH ======
let touching = false;

canvas.addEventListener("touchstart", (e) => {
  e.preventDefault();
  touching = true;
});

canvas.addEventListener("touchend", () => {
  touching = false;
});

// ====== PLAY BUTTON ======
playBtn.addEventListener("click", () => {
  playBtn.style.display = "none";
  gameStarted = true;
  resetGame();
});

// ====== RESET ======
function resetGame() {
  player.x = canvas.width / 2 - 25;
  player.y = 100;
  player.vy = 0;
  score = 0;
}

// ====== UPDATE ======
function update() {
  // trampolim se move
  platform.x += platform.speed * platform.dir;
  if (platform.x <= 0 || platform.x + platform.width >= canvas.width) {
    platform.dir *= -1;
  }

  // física
  player.vy += player.gravity;
  player.y += player.vy;

  // colisão correta
  if (
    player.vy > 0 &&
    player.y + player.size >= platform.y &&
    player.y + player.size <= platform.y + platform.height &&
    player.x + player.size > platform.x &&
    player.x < platform.x + platform.width
  ) {
    player.y = platform.y - player.size;
    player.vy = player.jumpForce;
    score++;

    if (score > record) {
      record = score;
      localStorage.setItem("record", record);
    }
  }

  // caiu
  if (player.y > canvas.height) {
    gameStarted = false;
    playBtn.style.display = "block";
  }

  // movimento touch
  if (touching) {
    const pc = platform.x + platform.width / 2;
    const pl = player.x + player.size / 2;
    if (pl < pc) player.x += 5;
    else player.x -= 5;
  }

  player.x = Math.max(0, Math.min(canvas.width - player.size, player.x));
}

// ====== DRAW ======
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // player
  ctx.fillStyle = "#00ffcc";
  ctx.fillRect(player.x, player.y, player.size, player.size);

  // trampolim
  ctx.fillStyle = "#ff0066";
  ctx.fillRect(platform.x, platform.y, platform.width, platform.height);

  // hud
  ctx.fillStyle = "#fff";
  ctx.font = "20px Arial";
  ctx.fillText("Pontos: " + score, 20, 30);
  ctx.fillText("Recorde: " + record, 20, 55);
}

// ====== LOOP ======
function loop() {
  if (gameStarted) {
    update();
    draw();
  }
  requestAnimationFrame(loop);
}

loop();
