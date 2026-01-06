// ===== CANVAS =====
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const tela = {
  largura: canvas.width,
  altura: canvas.height
};

// ===== JOGADOR =====
const jogador = {
  x: 100,
  y: 50,
  tamanho: 30,
  velY: 0,
  gravidade: 0.6,
  forcaDeSalto: -12
};

// ===== TRAMPOLIM =====
const trampolim = {
  x: 100,
  y: tela.altura - 120,
  largura: 100,
  altura: 15,
  velocidade: 3
};

// ===== CONTROLE =====
let podePular = false;
let pontuacao = 0;
let yAnterior = jogador.y;

// ===== TOQUE (CELULAR) =====
canvas.addEventListener("touchstart", () => {
  if (podePular) {
    jogador.velY = jogador.forcaDeSalto;
    podePular = false;
  }
});

// ===== ATUALIZAÇÃO =====
function atualizar() {
  // Guarda posição anterior
  yAnterior = jogador.y;

  // Gravidade
  jogador.velY += jogador.gravidade;
  jogador.y += jogador.velY;

  // Movimento do trampolim
  trampolim.x += trampolim.velocidade;
  if (trampolim.x <= 0 || trampolim.x + trampolim.largura >= tela.largura) {
    trampolim.velocidade *= -1;
  }

  // COLISÃO CORRIGIDA (ANTI-ATRAVESSAR)
  if (
    yAnterior + jogador.tamanho <= trampolim.y &&
    jogador.y + jogador.tamanho >= trampolim.y &&
    jogador.x + jogador.tamanho >= trampolim.x &&
    jogador.x <= trampolim.x + trampolim.largura &&
    jogador.velY > 0
  ) {
    jogador.y = trampolim.y - jogador.tamanho;
    jogador.velY = jogador.forcaDeSalto;
    podePular = true;
    pontuacao++;
  }

  // Caiu no chão
  if (jogador.y > tela.altura) {
    resetGame();
  }
}

// ===== RESET =====
function resetGame() {
  jogador.y = 50;
  jogador.velY = 0;
  pontuacao = 0;
}

// ===== DESENHO =====
function desenhar() {
  // Fundo
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, tela.largura, tela.altura);

  // Jogador (quadrado verde)
  ctx.fillStyle = "#00ff00";
  ctx.fillRect(jogador.x, jogador.y, jogador.tamanho, jogador.tamanho);

  // Trampolim (laranja)
  ctx.fillStyle = "#ff8800";
  ctx.fillRect(
    trampolim.x,
    trampolim.y,
    trampolim.largura,
    trampolim.altura
  );

  // Pontuação
  ctx.fillStyle = "#ffffff";
  ctx.font = "20px Arial";
  ctx.fillText("Pontos: " + pontuacao, 20, 30);
}

// ===== LOOP =====
function loop() {
  atualizar();
  desenhar();
  requestAnimationFrame(loop);
}

loop();
