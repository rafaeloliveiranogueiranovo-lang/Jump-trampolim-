const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// Ajuste automático para celular
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// ================== JOGADOR ==================
const player = {
  x: canvas.width / 2 - 25,
  y: 100,
  size: 50,
  vy: 0,
  gravity: 0.6,
  jumpForce: -14
};

// ================== TRAMPOLIM ==================
const platform = {
  x: canvas.width / 2 - 60,
  y: canvas.height - 200,
  width: 120,
  height: 20,
  speed: 3,
  dir: 1
};

// ================== SCORE ==================
let score = 0;
let record = localStorage.getItem("record") || 0;

// ================== CONTROLE TOUCH ==================
let touching = false;

canvas.addEventListener("touchstart", (e) => {
  e.preventDefault();
  touching = true;
});

canvas.addEventListener("touchend", () => {
  touching = false;
});

// ================== UPDATE ==================
function update() {
  // Movimento do trampolim
  platform.x += platform.speed * platform.dir;
  if (platform.x <= 0 || platform.x + platform.width >= canvas.width) {
    platform.dir *= -1;
  }

  // Gravidade
  player.vy += player.gravity;
  player.y += player.vy;

  // COLISÃO CORRETA (só quando está caindo)
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

  // Caiu no chão
  if (player.y > canvas.height) {
    player.y = 100;
    player.vy = 0;
    score = 0;
  }

  // Movimento suave no touch
  if (touching) {
    const platformCenter = platform.x + platform.width / 2;
    const playerCenter = player.x + player.size / 2;

    if (playerCenter < platformCenter) {
      player.x += 5;
    } else {
      player.x -= 5;
    }
  }

  // Limites laterais
  player.x = Math.max(0, Math.min(canvas.width - player.size, player.x));
}

// ================== DRAW ==================
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Jogador
  ctx.fillStyle = "#00ffcc";
  ctx.fillRect(player.x, player.y, player.size, player.size);

  // Trampolim
  ctx.fillStyle = "#ff0066";
  ctx.fillRect(platform.x, platform.y, platform.width, platform.height);

  // HUD
  ctx.fillStyle = "#ffffff";
  ctx.font = "20px Arial";
  ctx.fillText("Pontos: " + score, 20, 30);
  ctx.fillText("Recorde: " + record, 20, 55);
}

// ================== LOOP ==================
function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
