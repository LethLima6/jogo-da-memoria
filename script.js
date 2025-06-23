// Variáveis principais do jogo
let cartas = [];               // Armazena as cartas embaralhadas
let cartasViradas = [];        // Armazena as cartas que o jogador virou
let paresEncontrados = 0;      // Conta os pares corretos encontrados
let tentativas = 0;            // Conta as tentativas feitas
let tempo = 0;                 // Tempo decorrido da fase
let intervalo;                 // Intervalo do cronômetro
let nivel = 1;                 // Nível atual do jogo
let totalPares = 4;            // Número de pares a serem encontrados no nível atual
let temposPorFase = [];        // Armazena o tempo gasto em cada fase
let tentativasPorFase = [];    // Armazena as tentativas de cada fase

// Referências pegas do HTML para usar no JS
const tabuleiro = document.getElementById("tabuleiro");
const tentativasEl = document.getElementById("tentativas");
const cronometroEl = document.getElementById("cronometro");
const nivelEl = document.getElementById("nivel");

// Sons para feedback sonoro
const somAcerto = new Audio("som-acerto.mp3");
const somErro = new Audio("som-erro.mp3");
const somVirar = new Audio("som-virar.mp3");
const somFase = new Audio("som-fase.mp3");

// Fundos diferentes para cada fase
const backgrounds = 
[
  "url('imagens/imagem-fundo1.jpg')",
  "url('imagens/imagem-fundo2.jpg')",
  "url('imagens/imagem-fundo3.jpg')"
];

// Imagens das cartas para cada nível
const imagensPorNivel = 
{
  1: ["imagem-ceu1.jpeg", "imagem-ceu2.jpeg", "imagem-ceu3.jpeg", "imagem-ceu4.jpeg"],
  2: ["imagem-mar1.jpeg", "imagem-mar2.jpeg", "imagem-mar3.jpeg", "imagem-mar4.jpeg", "imagem-mar5.jpeg", "imagem-mar6.jpeg"],
  3: ["imagem-terra1.jpeg", "imagem-terra2.jpeg", "imagem-terra3.jpeg", "imagem-terra4.jpeg", "imagem-terra5.jpeg", "imagem-terra6.jpeg", "imagem-terra7.jpeg", "imagem-terra8.jpeg"]
};

// Altera o fundo da tela conforme o nível
function mudarFundo(nivel) 
{
  const fundo = backgrounds[(nivel - 1) % backgrounds.length];
  document.body.style.backgroundImage = fundo;
  document.body.style.backgroundSize = "cover";
  document.body.style.backgroundPosition = "center";
  document.body.style.backgroundRepeat = "no-repeat";
}

// Gera as cartas e embaralha elas
function gerarCartas() 
{
  cartas = [];
  const imagensNivelAtual = imagensPorNivel[nivel];

  if (!imagensNivelAtual) 
  {
    console.error("⚠️ Imagens não definidas para o nível " + nivel);
    return;
  }

  // Seleciona imagens conforme o total de pares
  const imagensSelecionadas = imagensNivelAtual.slice(0, totalPares);

  // Cria pares duplicados
  imagensSelecionadas.forEach((img) => 
  {
    cartas.push(img);
    cartas.push(img); 
  });

  // Embaralha as cartas
  cartas.sort(() => 0.5 - Math.random()); 
}

// Cria o tabuleiro visualmente com as cartas
function montarTabuleiro() 
{
  tabuleiro.innerHTML = ""; // Limpa o tabuleiro

  // Define estilo visual do grid
  tabuleiro.style.display = "grid";
  tabuleiro.style.gridTemplateColumns = "repeat(8, 100px)";
  tabuleiro.style.gap = "80px";
  tabuleiro.style.justifyContent = "center";
  tabuleiro.style.margin = "80px auto";

  // Cria cada carta visualmente
  cartas.forEach((imagemSrc) => 
  {
    const carta = document.createElement("div");
    carta.className = "carta";
    carta.dataset.valor = imagemSrc;

    const imagem = document.createElement("img");
    imagem.src = "imagens/" + imagemSrc;
    imagem.className = "imagem-carta";
    imagem.style.display = "none"; // Esconde imagem até ser virada

    carta.appendChild(imagem);
    carta.addEventListener("click", () => virarCarta(carta));
    tabuleiro.appendChild(carta);
  });
}

// Controla o comportamento ao virar uma carta
function virarCarta(carta) 
{
  // Permite virar no máximo duas cartas
  if (cartasViradas.length < 2 && !carta.classList.contains("virada")) {
    carta.classList.add("virada");
    somVirar.play();

    const imagem = carta.querySelector("img");
    imagem.style.display = "block"; // Mostra a imagem da carta

    cartasViradas.push(carta);

    if (cartasViradas.length === 2) 
    {
      tentativas++;
      tentativasEl.innerText = "Tentativas: " + tentativas + " |";
      verificarPar();  // Verifica se as duas cartas viradas são um par
    }
  }
}

// Verifica se as duas cartas viradas são iguais
function verificarPar() 
{
  const [c1, c2] = cartasViradas;
  if (c1.dataset.valor === c2.dataset.valor) 
  {
    somAcerto.play();
    paresEncontrados++;

    // Se encontrou todos os pares, avança ou finaliza
    if (paresEncontrados === totalPares) 
    {
      clearInterval(intervalo);
      temposPorFase.push(tempo);
      tentativasPorFase.push(tentativas);
      setTimeout(() => 
      {
        if (nivel < 3) 
        {
          somFase.play();
          alert(`Parabéns! Você passou para o nível ${nivel + 1}!`);
          nivel++;
          totalPares++; // Aumenta número de pares no próximo nível
          iniciar();    // Reinicia para o próximo nível
        } else 
        {
          mostrarResumoFinal(); // Último nível concluído
        }
      }, 500);
    }

    cartasViradas = []; // Limpa as cartas viradas
  } else 
  {
    somErro.play();
    // Se errou, esconde as cartas novamente após um tempo
    setTimeout(() => 
    {
      c1.classList.remove("virada");
      c2.classList.remove("virada");

      c1.querySelector("img").style.display = "none";
      c2.querySelector("img").style.display = "none";

      cartasViradas = [];
    }, 800);
  }
}

// Inicializa ou reinicia o jogo
function iniciar() 
{
  if (nivel === 1) 
  {
    temposPorFase = [];
    tentativasPorFase = [];
  }

  // Reinicia variáveis de fase
  tentativas = 0;
  tempo = 0;
  paresEncontrados = 0;
  cartasViradas = [];

  // Atualiza os elementos na tela
  tentativasEl.innerText = "Tentativas: 0 |";
  nivelEl.innerText = "Nível: " + nivel;
  cronometroEl.innerText = "⏱ Tempo: 0s |";

  gerarCartas();        // Cria as cartas
  montarTabuleiro();    // Monta o tabuleiro

  // Inicia o cronômetro
  clearInterval(intervalo);
  intervalo = setInterval(() => 
  {
    tempo++;
    cronometroEl.innerText = "⏱ Tempo: " + tempo + "s |";
    
  if (tempo > 30)         // 🎨 Muda a cor após 30 segundos
  {
    cronometroEl.style.color = "darkred";
  } else 
  {
    cronometroEl.style.color = "white";
  }
}, 1000);

  mudarFundo(nivel);    // Altera o fundo conforme o nível
}

// Mostra o resumo final após completar todos os níveis
function mostrarResumoFinal() 
{
  tabuleiro.innerHTML = "";
  tabuleiro.style.display = "flex";
  tabuleiro.style.flexDirection = "column";
  tabuleiro.style.alignItems = "center";
  tabuleiro.style.justifyContent = "center";
  tabuleiro.style.margin = "0 auto";

  const resumoDiv = document.createElement("div");
  resumoDiv.id = "resumo-final";
  resumoDiv.innerHTML = "<h1>🏆 Classificação Final</h1>";

  // Lista tempo e tentativas de cada fase
  for (let i = 0; i < temposPorFase.length; i++) 
  {
    const fase = i + 1;
    const tempo = temposPorFase[i];
    const tentativas = tentativasPorFase[i];
    const item = document.createElement("p");
    item.innerText = `Fase ${fase}: ⏱ ${tempo}s | Tentativas: ${tentativas}`;
    resumoDiv.appendChild(item);
  }

  // Botão para reiniciar o jogo
  const botao = document.createElement("button");
  botao.innerText = "Jogar Novamente";
  botao.style.marginTop = "50px";
  botao.onclick = () => 
  {
    nivel = 1;
    totalPares = 4;
    temposPorFase = [];
    tentativasPorFase = [];

    // Restaura o estilo original do tabuleiro
    tabuleiro.style.display = "grid";
    tabuleiro.style.gridTemplateColumns = "repeat(8, 100px)";
    tabuleiro.style.gap = "80px";
    tabuleiro.style.justifyContent = "center";
    tabuleiro.style.margin = "80px auto";
    iniciar(); // Reinicia o jogo
  };

  resumoDiv.appendChild(botao);
  tabuleiro.appendChild(resumoDiv);
}

// Inicia o jogo automaticamente ao carregar a página
window.onload = iniciar;

