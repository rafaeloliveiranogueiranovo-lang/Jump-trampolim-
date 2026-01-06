const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const playBtn = document.getElementById("playBtn");
const musica = document.getElementById("bgm");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// ===== ESTADO =====
let rodando = false;
let pontos = 0;
let recorde = localStorage.getItem("recorde") || 0;

// ===== JOGADOR =====
const jogador = {
  x: 100,
  y: 100,
  size: 30,
  velY: 0,
  gravidade: 0.8,
  pulo: -16
};

// ===== TRAMPOLIM =====
const trampolim = {
  x: 200,
  y: canvas.height - 120,
  largura: 120,
  altura: 15,
  vel: 3
};

// ===== TOQUE =====
let tocando = false;

document.addEventListener("touchstart", () => {
  tocando = true;
  if (musica.paused) musica.play();
});

document.addEventListener("touchend", () => {
  tocando = false;
});

// ===== PLAY =====
playBtn.addEventListener("click", () => {
  iniciarJogo();
});

// ===== FUNÇÕES =====
function iniciarJogo() {
  pontos = 0;
  jogador.y = 100;
  jogador.velY = 0;
  rodando = true;
  playBtn.style.display = "none";
}

function resetar() {
  rodando = false;
  playBtn.style.display = "block";
}

function atualizar() {
  if (!rodando) return;

  // movimento lateral por toque
  if (tocando) {
    jogador.x += 5;
  }

  // gravidade
  jogador.velY += jogador.gravidade;
  jogador.y += jogador.velY;

  // mover trampolim
  trampolim.x += trampolim.vel;
  if (trampolim.x <= 0 || trampolim.x + trampolim.largura >= canvas.width) {
    trampolim.vel *= -1;
  }

  // colisão
  if (
    jogador.y + jogador.size >= trampolim.y &&
    jogador.y + jogador.size <= trampolim.y + trampolim.altura &&
    jogador.x + jogador.size >= trampolim.x &&
    jogador.x <= trampolim.x + trampolim.largura &&
    jogador.velY > 0
  ) {
    jogador.velY = jogador.pulo;
    pontos++;

    if (pontos > recorde) {
      recorde = pontos;
      localStorage.setItem("recorde", recorde);
    }
  }

  // caiu
  if (jogador.y > canvas.height) {
    resetar();
  }
}

function desenhar() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // jogador
  ctx.fillStyle = "#00ff00";
  ctx.fillRect(jogador.x, jogador.y, jogador.size, jogador.size);

  // trampolim
  ctx.fillStyle = "#ff8800";
  ctx.fillRect(trampolim.x, trampolim.y, trampolim.largura, trampolim.altura);

  // HUD
  ctx.fillStyle = "#fff";
  ctx.font = "18px Arial";
  ctx.fillText("Pontos: " + pontos, 20, 30);
  ctx.fillText("Recorde: " + recorde, 20, 55);
}

function loop() {
  atualizar();
  desenhar();
  requestAnimationFrame(loop);
}

loop();
