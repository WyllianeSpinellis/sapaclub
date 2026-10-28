const emblemas = [
  { meses: 1, nome: "Faísca", cor: "#f3c86a", simbolo: "✦" },
  { meses: 2, nome: "Brilho", cor: "#ff8ba0", simbolo: "♥" },
  { meses: 6, nome: "Orgulho", cor: "#c6a2ed", simbolo: "✧" },
  { meses: 12, nome: "Lenda", cor: "#84c9ad", simbolo: "★" },
  { meses: 24, nome: "Ícone", cor: "#f2a96c", simbolo: "✺" },
];

const listaEmblemas = document.querySelector("#badge-list");
const controleMeses = document.querySelector("#months");
const botaoSalvarPasse = document.querySelector("#save-pass");
const formulario = document.querySelector("#join-form");
const mensagemFormulario = document.querySelector("#form-status");

function lerDados(chave, padrao) {
  try {
    return JSON.parse(localStorage.getItem(chave)) ?? padrao;
  } catch {
    return padrao;
  }
}

function criarCartaoEmblema(emblema, indice, mesesAtuais, favoritos) {
  const desbloqueado = mesesAtuais >= emblema.meses;
  const favorito = favoritos.includes(indice);

  return `
    <article class="badge-card ${desbloqueado ? "unlocked" : "locked"}">
      <button
        class="favorite-button"
        type="button"
        data-favorite="${indice}"
        aria-pressed="${favorito}"
        aria-label="${favorito ? "Remover dos" : "Adicionar aos"} favoritos: ${emblema.nome}"
      >
        ${favorito ? "♥" : "♡"}
      </button>

      <svg
        viewBox="0 0 120 120"
        role="img"
        aria-labelledby="titulo-emblema-${indice}"
      >
        <title id="titulo-emblema-${indice}">
          Emblema ${emblema.nome}, ${emblema.meses} meses
        </title>
        <path
          d="M60 5 72 13 87 10 94 24 108 31 105 47 115 60 105 73 108 89 94 96 87 110 72 107 60 115 48 107 33 110 26 96 12 89 15 73 5 60 15 47 12 31 26 24 33 10 48 13Z"
          fill="${emblema.cor}"
          stroke="#fff8f0"
          stroke-width="3"
        />
        <circle cx="60" cy="60" r="31" fill="#fff8f0" />
        <text
          x="60"
          y="71"
          text-anchor="middle"
          font-size="34"
          fill="#38243b"
        >${emblema.simbolo}</text>
      </svg>

      <p>${emblema.meses} ${emblema.meses === 1 ? "mês" : "meses"}</p>
      <h3>${emblema.nome}</h3>
      <p>${desbloqueado ? "Emblema desbloqueado!" : "Continue sua jornada."}</p>
    </article>
  `;
}

function atualizarEmblemas() {
  const mesesAtuais = Number(controleMeses.value);
  const favoritos = lerDados("sapaclub-favoritos", []);

  listaEmblemas.innerHTML = emblemas
    .map((emblema, indice) =>
      criarCartaoEmblema(emblema, indice, mesesAtuais, favoritos),
    )
    .join("");
}

function mostrarProgresso() {
  const secaoPasse = document.querySelector("#meu-passe");
  const mesesAtuais = Number(controleMeses.value);
  const emblemasDesbloqueados = emblemas.filter(
    (emblema) => mesesAtuais >= emblema.meses,
  );
  const atual = emblemasDesbloqueados[emblemasDesbloqueados.length - 1];

  let status = document.querySelector("#profile-status");

  if (!status) {
    status = document.createElement("p");
    status.id = "profile-status";
    secaoPasse.append(status);
  }

  status.textContent = atual
    ? `Seu emblema atual é ${atual.nome}.`
    : "Seu primeiro emblema chega no primeiro mês.";

  atualizarEmblemas();
}

controleMeses.addEventListener("input", mostrarProgresso);

botaoSalvarPasse.addEventListener("click", () => {
  const mesesAtuais = Number(controleMeses.value);

  localStorage.setItem(
    "sapaclub-passe",
    JSON.stringify({ meses: mesesAtuais }),
  );

  mostrarProgresso();
  mensagemFormulario.textContent = "Seu passe foi salvo neste navegador.";
});

listaEmblemas.addEventListener("click", (evento) => {
  const botao = evento.target.closest("[data-favorite]");

  if (!botao) {
    return;
  }

  const indice = Number(botao.dataset.favorite);
  const favoritos = lerDados("sapaclub-favoritos", []);
  const jaFavoritado = favoritos.includes(indice);

  const atualizados = jaFavoritado
    ? favoritos.filter((item) => item !== indice)
    : [...favoritos, indice];

  localStorage.setItem("sapaclub-favoritos", JSON.stringify(atualizados));

  atualizarEmblemas();
});

formulario.addEventListener("submit", (evento) => {
  evento.preventDefault();

  if (!formulario.reportValidity()) {
    return;
  }

  const nome = document.querySelector("#name").value.trim();
  const plano = document.querySelector("#plan");
  const opcao = plano.selectedIndex;
  const mesesPorOpcao = [0, 1, 2, 6, 12, 24];
  const mesesDoPasse = mesesPorOpcao[opcao];

  controleMeses.value = mesesDoPasse;

  localStorage.setItem(
    "sapaclub-passe",
    JSON.stringify({
      nome: nome || "Nova integrante",
      meses: mesesDoPasse,
    }),
  );

  mensagemFormulario.textContent =
    `Boas-vindas, ${nome}! Seu passe foi simulado. ` +
    "O formulário não enviou seus dados.";

  mostrarProgresso();
});

const passeSalvo = lerDados("sapaclub-passe", null);

if (passeSalvo) {
  controleMeses.value = passeSalvo.meses;
}

mostrarProgresso();