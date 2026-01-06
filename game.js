// ===== CONFIGURAÇÃO DA TELA =====
const tela = document.getElementById("game");
const ctx = tela.getContext("2d");

tela.width = window.innerWidth;
tela.height = window.innerHeight;

document.body.style.margin = "0";
document.body.style.overflow = "hidden";

// ===== JOGADOR =====
const jogador = {
  x: tela.width / 2 - 25,
  y: 50,
  tamanho: 50,
  velY: 0,
  gravidade: 0.8,
  forcaDeSalto: -15
};

// ===== TRAMPOLIM =====
const trampolim = {
  x: tela.width / 2 - 60,
  y: tela.height - 150,
  largura: 120,
  altura: 15,
  velocidade: 3
};

// ===== CONTROLE =====
let podePular = false;
let pontuacao = 0;

// ===== CONTROLE TOUCH (CELULAR) =====
let toqueX = null;

// PULO
tela.addEventListener("touchstart", (e) => {
  if (podePular) {
    jogador.velY = jogador.forcaDeSalto;
    podePular = false;
  }
  toqueX = e.touches[0].clientX;
});

// MOVIMENTO LATERAL
tela.addEventListener("touchmove", (e) => {
  if (toqueX === null) return;

  let atualX = e.touches[0].clientX;
  let diferenca = atualX - toqueX;

  jogador.x += diferenca * 0.5;

  if (jogador.x < 0) jogador.x = 0;
  if (jogador.x + jogador.tamanho > tela.width) {
    jogador.x = tela.width - jogador.tamanho;
  }

  toqueX = atualX;
});

// SOLTOU O DEDO
tela.addEventListener("touchend", () => {
  toqueX = null;
});

// ===== ATUALIZAÇÃO =====
function atualizar() {
  // Gravidade
  jogador.velY += jogador.gravidade;
  jogador.y += jogador.velY;

  // Movimento do trampolim
  trampolim.x += trampolim.velocidade;
  if (trampolim.x <= 0 || trampolim.x + trampolim.largura >= tela.width) {
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
    jogador.velY = jogador.forcaDeSalto;
    podePular = true;
    pontuacao++;
  }

  // Caiu no chão
  if (jogador.y > tela.height) {
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
  ctx.fillStyle = "#111";
  ctx.fillRect(0, 0, tela.width, tela.height);

  // Jogador
  ctx.fillStyle = "#00ff00";
  ctx.fillRect(jogador.x, jogador.y, jogador.tamanho, jogador.tamanho);

  // Trampolim
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
