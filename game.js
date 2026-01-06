const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// ===== GRAVIDADE =====
const gravity = 0.4;

// ===== PLAYER =====
const player = {
  x: canvas.width / 2 - 10,
  y: 20,
  size: 20,
  vy: 0
};

// ===== TRAMPOLIM =====
const trampoline = {
  x: 100,
  y: canvas.height - 60,
  width: 80,
  height: 10,
  speed: 2,
  direction: 1
};

// ===== PONTOS =====
let score = 0;

// ===== UPDATE =====
function update() {
  // gravidade
  player.vy += gravity;
  player.y += player.vy;

  // mover trampolim
  trampoline.x += trampoline.speed * trampoline.direction;
  if (trampoline.x <= 0 || trampoline.x + trampoline.width >= canvas.width) {
    trampoline.direction *= -1;
  }

  // colisão com trampolim
  if (
    player.y + player.size >= trampoline.y &&
    player.y + player.size <= trampoline.y + trampoline.height &&
    player.x + player.size > trampoline.x &&
    player.x < trampoline.x + trampoline.width &&
    player.vy > 0
  ) {
    player.vy = -8; // pulo
    score++;
  }

  // caiu no chão
  if (player.y > canvas.height) {
    resetGame();
  }
}

// ===== RESET =====
function resetGame() {
  player.y = 20;
  player.vy = 0;
  score = 0;
}

// ===== DRAW =====
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // fundo
  ctx.fillStyle = "#222";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // player
  ctx.fillStyle = "red";
  ctx.fillRect(player.x, player.y, player.size, player.size);

  // trampolim
  ctx.fillStyle = "cyan";
  ctx.fillRect(trampoline.x, trampoline.y, trampoline.width, trampoline.height);

  // pontuação
  ctx.fillStyle = "white";
  ctx.font = "14px Arial";
  ctx.fillText("Pontos: " + score, 10, 20);
}

// ===== LOOP =====
function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// Quadrado (player)
const player = {
  x: 150,
  y: 100,
  size: 20,
  speed: 3
};

// Teclas pressionadas
const keys = {};

// Captura teclas
window.addEventListener("keydown", (e) => {
  keys[e.key] = true;
});

window.addEventListener("keyup", (e) => {
  keys[e.key] = false;
});

// Atualiza o jogo
function update() {
  // Movimento
  if (keys["ArrowUp"] || keys["w"]) player.y -= player.speed;
  if (keys["ArrowDown"] || keys["s"]) player.y += player.speed;
  if (keys["ArrowLeft"] || keys["a"]) player.x -= player.speed;
  if (keys["ArrowRight"] || keys["d"]) player.x += player.speed;

  // Limites do canvas
  player.x = Math.max(0, Math.min(canvas.width - player.size, player.x));
  player.y = Math.max(0, Math.min(canvas.height - player.size, player.y));
}

// Desenha tudo
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "red";
  ctx.fillRect(player.x, player.y, player.size, player.size);
}

// Loop do jogo
function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

// Iniciar
loop();
