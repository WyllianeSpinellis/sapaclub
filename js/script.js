"use strict";

const emblemas = [
  {
    meses: 1,
    nome: "Faísca",
    simbolo: "✦",
    cor: "#f3c86a",
    fundo: "#fff1c9",
    descricao: "Seu primeiro mês no clube.",
  },
  {
    meses: 2,
    nome: "Brilho",
    simbolo: "♥",
    cor: "#ff8fa3",
    fundo: "#ffe1e7",
    descricao: "Dois meses criando laços.",
  },
  {
    meses: 3,
    nome: "Constelação",
    simbolo: "✧",
    cor: "#c6a2ed",
    fundo: "#eadcff",
    descricao: "Três meses brilhando em comunidade.",
  },
  {
    meses: 6,
    nome: "Orgulho",
    simbolo: "★",
    cor: "#84c9ad",
    fundo: "#d6f0e4",
    descricao: "Seis meses celebrando quem você é.",
  },
  {
    meses: 9,
    nome: "Raízes",
    simbolo: "❋",
    cor: "#f2a96c",
    fundo: "#ffe3ca",
    descricao: "Nove meses de histórias compartilhadas.",
  },
  {
    meses: 12,
    nome: "Lenda",
    simbolo: "✿",
    cor: "#91b8e8",
    fundo: "#dceaff",
    descricao: "Um ano de histórias e orgulho.",
  },
  {
    meses: 18,
    nome: "Ícone",
    simbolo: "☼",
    cor: "#d995c5",
    fundo: "#f5ddf0",
    descricao: "Dezoito meses fazendo parte da história.",
  },
  {
    meses: 24,
    nome: "Eternidade",
    simbolo: "✺",
    cor: "#e7a56d",
    fundo: "#ffead8",
    descricao: "Dois anos de orgulho e comunidade.",
  },
];

const chavePasse = "sapaclub-passe";
const chaveFavoritos = "sapaclub-favoritos";

const listaEmblemas = document.querySelector("#badge-list");
const controleMeses = document.querySelector("#months");
const botaoSalvarPasse = document.querySelector("#save-pass");
const formulario = document.querySelector("#join-form");
const mensagemFormulario = document.querySelector("#form-status");

function lerDados(chave, valorPadrao) {
  try {
    const dados = localStorage.getItem(chave);
    return dados ? JSON.parse(dados) : valorPadrao;
  } catch {
    return valorPadrao;
  }
}

function salvarDados(chave, dados) {
  localStorage.setItem(chave, JSON.stringify(dados));
}

function criarImagemEmblema(emblema) {
  return `
    <svg
      class="badge-svg"
      viewBox="0 0 120 120"
      role="img"
      aria-label="Emblema ${emblema.nome}"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M60 5 74 15 91 11 98 28 114 38 108 56 115 72 101 85 100 103 81 105 68 117 52 108 35 115 26 98 9 91 15 73 5 58 17 43 16 25 35 23 47 8Z"
        fill="${emblema.cor}"
        stroke="#fff8f0"
        stroke-width="4"
      />
      <circle cx="60" cy="61" r="34" fill="${emblema.fundo}" />
      <text
        x="60"
        y="73"
        text-anchor="middle"
        font-size="38"
        fill="#38243b"
        font-family="Arial, sans-serif"
      >${emblema.simbolo}</text>
    </svg>
  `;
}

function criarCartaoEmblema(emblema, mesesAtuais, favoritos) {
  const desbloqueado = mesesAtuais >= emblema.meses;
  const favorito = favoritos.includes(emblema.meses);
  const unidade = emblema.meses === 1 ? "mês" : "meses";

  // Correção: o estado bloqueado é informado por texto, sem depender só da aparência.
    return `
  <article class="badge-card ${desbloqueado ? "unlocked" : "locked"}">
      <button
        class="favorite-button"
        type="button"
        data-favorite="${emblema.meses}"
        aria-pressed="${favorito}"
        aria-label="${
          favorito ? "Remover dos favoritos" : "Adicionar aos favoritos"
        }: emblema ${emblema.nome}"
      >
        ${favorito ? "♥" : "♡"}
      </button>

      ${criarImagemEmblema(emblema)}

      <p class="badge-month">
        ${emblema.meses} ${unidade}
      </p>

      <h3>${emblema.nome}</h3>

      <p>${emblema.descricao}</p>

      <p class="badge-status">
        ${
          desbloqueado
            ? "Emblema desbloqueado."
            : "Bloqueado — continue sua jornada."
        }
      </p>
    </article>
  `;
}

function atualizarEmblemas() {
  if (!listaEmblemas || !controleMeses) {
    return;
  }

  const mesesAtuais = Number(controleMeses.value);
  const favoritos = lerDados(chaveFavoritos, []);

  listaEmblemas.innerHTML = emblemas
    .map((emblema) =>
      criarCartaoEmblema(emblema, mesesAtuais, favoritos),
    )
    .join("");
}

function atualizarPasse() {
  if (!controleMeses) {
    return;
  }

  const mesesAtuais = Number(controleMeses.value);
  const unidade = mesesAtuais === 1 ? "mês" : "meses";

  // Correção: leitores de tela recebem o valor do controle com a unidade adequada.
  controleMeses.setAttribute(
    "aria-valuetext",
    `${mesesAtuais} ${unidade} de participação`,
  );

  const valorMeses = document.querySelector("#month-value");
  const textoUnidade = document.querySelector("#month-unit");

  if (valorMeses) {
    valorMeses.textContent = mesesAtuais;
  }

  if (textoUnidade) {
    textoUnidade.textContent = unidade;
  }

  atualizarEmblemas();
}

function alternarFavorito(meses) {
  const favoritos = lerDados(chaveFavoritos, []);
  const jaFavorito = favoritos.includes(meses);

  const novosFavoritos = jaFavorito
    ? favoritos.filter((mes) => mes !== meses)
    : [...favoritos, meses];

  salvarDados(chaveFavoritos, novosFavoritos);
  atualizarEmblemas();
}

if (listaEmblemas) {
  // Correção: os botões de favorito funcionam por teclado e usam um único ouvinte.
  listaEmblemas.addEventListener("click", (evento) => {
    const botao = evento.target.closest("[data-favorite]");

    if (!botao) {
      return;
    }

    alternarFavorito(Number(botao.dataset.favorite));
  });
}

if (controleMeses) {
  controleMeses.addEventListener("input", atualizarPasse);
  atualizarPasse();
}

if (botaoSalvarPasse && controleMeses) {
  botaoSalvarPasse.addEventListener("click", () => {
    const passe = lerDados(chavePasse, {});
    passe.meses = Number(controleMeses.value);
    salvarDados(chavePasse, passe);

    const mensagem = document.querySelector("#pass-status");

    if (mensagem) {
      mensagem.textContent = "Seu passe foi salvo neste navegador.";
    }
  });
}

if (formulario) {
  // Correção: a resposta do formulário é anunciada por uma região de status.
  if (mensagemFormulario) {
    mensagemFormulario.setAttribute("role", "status");
    mensagemFormulario.setAttribute("aria-live", "polite");
  }

  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();

    if (!formulario.reportValidity()) {
      return;
    }

    const nome = document.querySelector("#name")?.value.trim() || "";
    const passeSelecionado = document.querySelector("#plan")?.value || "";

    const passe = lerDados(chavePasse, {});
    passe.nome = nome;
    passe.plano = passeSelecionado;
    salvarDados(chavePasse, passe);

    if (mensagemFormulario) {
      mensagemFormulario.textContent =
        `Bem-vinda, ${nome}! Seu passe foi simulado. ` +
        "Este projeto não envia seus dados.";
    }
  });
}