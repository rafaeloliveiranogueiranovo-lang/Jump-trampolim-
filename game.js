const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const playBtn = document.getElementById("playBtn");

let jogoAtivo = false;

// Jogador
let player = {
  x: canvas.width / 2 - 15,
  y: 300,
  size: 30,
  vy: 0
};

// Trampolim
let platform = {
  x: 120,
  y: 450,
  width: 120,
  height: 15,
  speed: 2
};

// Pontuação
let score = 0;
let record = localStorage.getItem("record") || 0;

// Controles
let moveDir = 0;

// ===== CONTROLES TOUCH =====
canvas.addEventListener("touchstart", e => {
  const x = e.touches[0].clientX;
  if (x < window.innerWidth / 2) moveDir = -1;
  else moveDir = 1;
});

canvas.addEventListener("touchend", () => {
  moveDir = 0;
});

// ===== CONTROLES PC =====
document.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft") moveDir = -1;
  if (e.key === "ArrowRight") moveDir = 1;
});

document.addEventListener("keyup", () => moveDir = 0);

// ===== BOTÃO PLAY =====
playBtn.addEventListener("click", () => {
  resetGame();
  jogoAtivo = true;
  playBtn.style.display = "none";
  loop();
});

// ===== RESET =====
function resetGame() {
  player.x = canvas.width / 2 - 15;
  player.y = 300;
  player.vy = 0;
  score = 0;
}

// ===== GAME OVER =====
function gameOver() {
  jogoAtivo = false;
  playBtn.style.display = "block";
}

// ===== LOOP =====
function loop() {
  if (!jogoAtivo) return;

  update();
  draw();
  requestAnimationFrame(loop);
}

// ===== UPDATE =====
function update() {
  // Gravidade
  player.vy += 0.6;
  player.y += player.vy;

  // Movimento lateral
  player.x += moveDir * 5;
  player.x = Math.max(0, Math.min(canvas.width - player.size, player.x));

  // Movimento trampolim
  platform.x += platform.speed;
  if (platform.x <= 0 || platform.x + platform.width >= canvas.width) {
    platform.speed *= -1;
  }

  // Colisão com trampolim
  if (
    player.vy > 0 &&
    player.y + player.size >= platform.y &&
    player.y + player.size <= platform.y + platform.height &&
    player.x + player.size > platform.x &&
    player.x < platform.x + platform.width
  ) {
    player.vy = -14;
    score++;

    if (score > record) {
      record = score;
      localStorage.setItem("record", record);
    }
  }

  // Caiu no chão
  if (player.y > canvas.height) {
    gameOver();
  }
}

// ===== DRAW =====
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Player
  ctx.fillStyle = "#0f0";
  ctx.fillRect(player.x, player.y, player.size, player.size);

  // Trampolim
  ctx.fillStyle = "#ff8800";
  ctx.fillRect(platform.x, platform.y, platform.width, platform.height);

  // Texto
  ctx.fillStyle = "#0f0";
  ctx.font = "18px Arial";
  ctx.fillText("Pontos: " + score, 10, 25);
  ctx.fillText("Recorde: " + record, 10, 45);
}
