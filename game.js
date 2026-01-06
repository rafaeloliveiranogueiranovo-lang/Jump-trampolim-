const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// ===== PLAYER =====
let player = {
  x: 140,
  y: 50,
  size: 20,
  velY: 0,
  gravity: 0.5,
  jumpForce: -10
};

// ===== TRAMPOLIM =====
let trampolim = {
  x: 100,
  y: 200,
  width: 80,
  height: 10,
  speed: 2
};

// ===== GAME =====
let score = 0;
let canJump = false;

// ===== INPUT (PC + MOBILE) =====
document.addEventListener("keydown", (e) => {
  if (e.code === "Space" && canJump) {
    player.velY = player.jumpForce;
    canJump = false;
  }
});

canvas.addEventListener("touchstart", () => {
  if (canJump) {
    player.velY = player.jumpForce;
    canJump = false;
  }
});

// ===== UPDATE =====
function update() {
  // Gravidade
  player.velY += player.gravity;
  player.y += player.velY;

  // Movimento do trampolim
  trampolim.x += trampolim.speed;
  if (trampolim.x <= 0 || trampolim.x + trampolim.width >= canvas.width) {
    trampolim.speed *= -1;
  }

  // Colisão com trampolim
  if (
    player.y + player.size >= trampolim.y &&
    player.y + player.size <= trampolim.y + trampolim.height &&
    player.x + player.size > trampolim.x &&
    player.x < trampolim.x + trampolim.width &&
    player.velY > 0
  ) {
    player.y = trampolim.y - player.size;
    player.velY = player.jumpForce;
    canJump = true;
    score++;
  }

  // Caiu no chão
  if (player.y > canvas.height) {
    resetGame();
  }
}

// ===== RESET =====
function resetGame() {
  player.y = 50;
  player.velY = 0;
  score = 0;
}

// ===== DRAW =====
function draw() {
  // Fundo
  ctx.fillStyle = "#111";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Player
  ctx.fillStyle = "#00ff00";
  ctx.fillRect(player.x, player.y, player.size, player.size);

  // Trampolim
  ctx.fillStyle = "#ff8800";
  ctx.fillRect(
    trampolim.x,
    trampolim.y,
    trampolim.width,
    trampolim.height
  );

  // Pontuação
  ctx.fillStyle = "#ffffff";
  ctx.font = "16px Arial";
  ctx.fillText("Pontos: " + score, 10, 20);
}

// ===== LOOP =====
function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
