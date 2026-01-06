const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// ===== JOGADOR =====
const jogador = {
  x: canvas.width / 2 - 15,
  y: 50,
  tamanho: 30,
  velX: 0,
  velY: 0,
  velocidade: 6,
  gravidade: 0.6,
  forcaPulo: -35
};

// ===== TRAMPOLIM =====
const trampolim = {
  x: canvas.width / 2 - 50,
  y: canvas.height - 150,
  largura: 100,
  altura: 15,
  velocidade: 3
};

// ===== PONTOS =====
let pontos = 0;

// ===== CONTROLE TOUCH (CORRIGIDO) =====
canvas.addEventListener(
  "touchstart",
  (e) => {
    e.preventDefault();
    mover(e);
  },
  { passive: false }
);

canvas.addEventListener(
  "touchmove",
  (e) => {
    e.preventDefault();
    mover(e);
  },
  { passive: false }
);

canvas.addEventListener(
  "touchend",
  (e) => {
    e.preventDefault();
    jogador.velX = 0;
  },
  { passive: false }
);

function mover(e) {
  const toqueX = e.touches[0].clientX;

  if (toqueX < canvas.width / 2) {
    jogador.velX = -jogador.velocidade;
  } else {
    jogador.velX = jogador.velocidade;
  }
}

// ===== ATUALIZAÇÃO =====
function atualizar() {
  // Movimento horizontal
  jogador.x += jogador.velX;

  // Limites da tela
  if (jogador.x < 0) jogador.x = 0;
  if (jogador.x + jogador.tamanho > canvas.width) {
    jogador.x = canvas.width - jogador.tamanho;
  }

  // Gravidade
  jogador.velY += jogador.gravidade;
  jogador.y += jogador.velY;

  // Movimento do trampolim
  trampolim.x += trampolim.velocidade;
  if (trampolim.x <= 0 || trampolim.x + trampolim.largura >= canvas.width) {
    trampolim.velocidade *= -1;
  }

  // Colisão com trampolim
  if (
    jogador.y + jogador.tamanho >= trampolim.y &&
    jogador.y + jogador.tamanho <= trampolim.y + trampolim.altura &&
    jogador.x + jogador.tamanho >= trampolim.x &&
    jogador.x <= trampolim.x + trampolim.largura &&
    jogador.velY > 0
  ) {
    jogador.y = trampolim.y - jogador.tamanho;
    jogador.velY = jogador.forcaPulo;
    pontos++;
  }

  // Caiu no chão
  if (jogador.y > canvas.height) {
    resetar();
  }
}

// ===== RESET =====
function resetar() {
  jogador.y = 50;
  jogador.velY = 0;
  pontos = 0;
}

// ===== DESENHO =====
function desenhar() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Jogador
  ctx.fillStyle = "#00ff00";
  ctx.fillRect(jogador.x, jogador.y, jogador.tamanho, jogador.tamanho);

  // Trampolim
  ctx.fillStyle = "#ff8800";
  ctx.fillRect(trampolim.x, trampolim.y, trampolim.largura, trampolim.altura);

  // Pontos
  ctx.fillStyle = "#ffffff";
  ctx.font = "20px Arial";
  ctx.fillText("Pontos: " + pontos, 20, 30);
}

// ===== LOOP =====
function loop() {
  atualizar();
  desenhar();
  requestAnimationFrame(loop);
}

loop();
