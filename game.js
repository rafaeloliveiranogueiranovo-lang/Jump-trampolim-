// ===== DEBUG / CONSOLE =====
console.log("game.js carregou corretamente");
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const playBtn = document.getElementById("playBtn");

// ================= AJUSTE DE TELA =================
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// ================= AUDIO =================
// IMPORTANTE: o arquivo deve estar no mesmo lugar do index
const music = new Audio("music.wav");
music.loop = true;
music.volume = 0.5;

// ================= CONTROLE DO JOGO =================
let running = false;

// ================= PLAYER =================
const player = {
  x: canvas.width / 2 - 25,
  y: 100,
  size: 50,
  vx: 0,
  vy: 0,
  gravity: 0.6,
  launched: false
};

// ================= PLATAFORMA =================
const platform = {
  x: canvas.width / 2 - 60,
  y: canvas.height - 200,
  w: 120,
  h: 20,
  speed: 3,
  dir: 1
};

function resetRound() {
  player.x = 180;
  player.y = 500;
  player.vx = 0;
  player.vy = 0;
  player.launched = false;
}
// ================= SCORE =================
let score = 0;

// ================= TOUCH =================
let touching = false;

canvas.addEventListener("touchstart", (e) => {
  e.preventDefault();
  touching = true;
}, { passive: false });

canvas.addEventListener("touchend", () => {
  touching = false;
});

// ================= PLAY =================
playBtn.addEventListener("click", () => {
  playBtn.style.display = "none";
  resetGame();
  running = true;

  // música SÓ começa aqui (regra do navegador)
  music.currentTime = 0;
  music.play();
});

// ================= RESET =================
function resetGame() {
  player.x = canvas.width / 2 - 25;
  player.y = 100;
  player.vy = 0;
  score = 0;
}

// ================= UPDATE =================
function update() {
  // mover plataforma
  platform.x += platform.speed * platform.dir;
  if (platform.x <= 0 || platform.x + platform.w >= canvas.width) {
    platform.dir *= -1;
  }

  // física
  player.vy += player.gravity;
  player.y += player.vy;

  // colisão correta
  if (
  player.y + player.size > platform.y &&
  player.y < platform.y + platform.h &&
  player.x + player.size > platform.x &&
  player.x < platform.x + platform.w &&
  player.vy > 0
) {
  console.log("ACERTOU");

  score++;
  resetRound();
  }

  // caiu
  if (player.y > canvas.height) {
    running = false;
    playBtn.style.display = "block";
    music.pause();
  }

  // movimento touch (suave)
  if (touching) {
    const pc = platform.x + platform.w / 2;
    const pl = player.x + player.size / 2;
    player.x += pl < pc ? 5 : -5;
  }

  // limites
  player.x = Math.max(0, Math.min(canvas.width - player.size, player.x));
}

// ================= DRAW =================
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // player
  ctx.fillStyle = "#00ffcc";
  ctx.fillRect(player.x, player.y, player.size, player.size);

  // plataforma
  ctx.fillStyle = "#ff0066";
  ctx.fillRect(platform.x, platform.y, platform.w, platform.h);

  // hud
  ctx.fillStyle = "#fff";
  ctx.font = "20px Arial";
  ctx.fillText("Pontos: " + score, 20, 30);
}

// ================= LOOP =================
function loop() {
  if (running) {
    update();
    draw();
  }
  requestAnimationFrame(loop);
}

loop();
