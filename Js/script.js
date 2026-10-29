const emblemas = [
  { meses: 1, nome: "Faísca", cor: "#f3c86a", simbolo: "✦" },
  { meses: 2, nome: "Brilho", cor: "#ff8ba0", simbolo: "♥" },
  { meses: 6, nome: "Orgulho", cor: "#c6a2ed", simbolo: "✧" },
  { meses: 12, nome: "Lenda", cor: "#84c9ad", simbolo: "★" },
  { meses: 24, nome: "Ícone", cor: "#f2a96c", simbolo: "✺" }
];

const listaEmblemas = document.querySelector("#badge-list");
const controleMeses = document.querySelector("#months");
const botaoSalvarPasse = document.querySelector("#save-pass");
const formulario = document.querySelector("#join-form");
const mensagemFormulario = document.querySelector("#form-status");
const campoNome = document.querySelector("#name");
const campoPlano = document.querySelector("#plan");

function lerDados(chave, valorPadrao) {
  try {
    const dadosSalvos = localStorage.getItem(chave);
    return dadosSalvos ? JSON.parse(dadosSalvos) : valorPadrao;
  } catch {
    return valorPadrao;
  }
}

function salvarDados(chave, dados) {
  try {
    localStorage.setItem(chave, JSON.stringify(dados));
    return true;
  } catch {
    return false;
  }
}

function criarSvgEmblema(emblema, indice) {
  return `
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
  `;
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

      ${criarSvgEmblema(emblema, indice)}

      <p>${emblema.meses} ${emblema.meses === 1 ? "mês" : "meses"}</p>
      <h3>${emblema.nome}</h3>
      <p>${desbloqueado ? "Emblema desbloqueado!" : "Continue sua jornada."}</p>
    </article>
  `;
}

function atualizarEmblemas() {
  const mesesAtuais = Number(controleMeses.value);
  const favoritos = lerDados("sapaclub-favoritos", []);

  // Este HTML usa apenas dados fixos dos emblemas, nunca texto digitado pela pessoa.
  listaEmblemas.innerHTML = emblemas
    .map((emblema, indice) =>
      criarCartaoEmblema(emblema, indice, mesesAtuais, favoritos)
    )
    .join("");
}

function atualizarPasse() {
  const mesesAtuais = Number(controleMeses.value);
  const integrantes = lerDados("sapaclub-passe", {});
  const nomeIntegrante = integrantes.nome || "";
  const emblemaAtual = emblemas
    .filter((emblema) => mesesAtuais >= emblema.meses)
    .at(-1);

  let statusPasse = document.querySelector("#profile-status");

  if (!statusPasse) {
    statusPasse = document.createElement("p");
    statusPasse.id = "profile-status";
    document.querySelector("#meu-passe").append(statusPasse);
  }

  if (emblemaAtual) {
    statusPasse.textContent = nomeIntegrante
      ? `${nomeIntegrante}, seu emblema atual é ${emblemaAtual.nome}.`
      : `Seu emblema atual é ${emblemaAtual.nome}.`;
  } else {
    statusPasse.textContent =
      "Seu primeiro emblema chega no primeiro mês.";
  }

  atualizarEmblemas();
}

controleMeses.addEventListener("input", atualizarPasse);

botaoSalvarPasse.addEventListener("click", () => {
  const dadosAtuais = lerDados("sapaclub-passe", {});
  const dadosAtualizados = {
    ...dadosAtuais,
    meses: Number(controleMeses.value)
  };

  const salvou = salvarDados("sapaclub-passe", dadosAtualizados);

  atualizarPasse();

  mensagemFormulario.textContent = salvou
    ? "Seu passe foi salvo neste navegador."
    : "Não foi possível salvar o passe neste navegador.";
});

listaEmblemas.addEventListener("click", (evento) => {
  const botaoFavorito = evento.target.closest("[data-favorite]");

  if (!botaoFavorito) {
    return;
  }

  const indice = Number(botaoFavorito.dataset.favorite);
  const favoritos = lerDados("sapaclub-favoritos", []);
  const jaEraFavorito = favoritos.includes(indice);

  const novosFavoritos = jaEraFavorito
    ? favoritos.filter((item) => item !== indice)
    : [...favoritos, indice];

  salvarDados("sapaclub-favoritos", novosFavoritos);
  atualizarEmblemas();
});

formulario.addEventListener("submit", (evento) => {
  evento.preventDefault();

  if (!formulario.reportValidity()) {
    return;
  }

  const nomeIntegrante = campoNome.value.trim() || "Nova integrante";
  const mesesPorOpcao = [0, 1, 2, 6, 12, 24];
  const mesesDoPasse = mesesPorOpcao[campoPlano.selectedIndex];

  controleMeses.value = mesesDoPasse;

  const salvou = salvarDados("sapaclub-passe", {
    nome: nomeIntegrante,
    meses: mesesDoPasse
  });

  mensagemFormulario.textContent = salvou
    ? `Boas-vindas, ${nomeIntegrante}! Seu passe foi simulado. O e-mail não foi enviado nem salvo.`
    : "Não foi possível salvar o passe neste navegador.";

  atualizarPasse();
});

const dadosIniciais = lerDados("sapaclub-passe", { meses: 1 });
const mesesSalvos = Number(dadosIniciais.meses);

controleMeses.value = Number.isFinite(mesesSalvos)
  ? Math.max(0, Math.min(24, mesesSalvos))
  : 1;

atualizarPasse();

const botaoInteresse = document.querySelector("#interest-button");
const statusInteresse = document.querySelector("#interest-status");
const chaveInteresse = "sapaclub-encontro-interesse";

function atualizarInteresse() {
  const demonstrouInteresse = lerDados(chaveInteresse, false);

  botaoInteresse.setAttribute(
    "aria-pressed",
    String(demonstrouInteresse)
  );

  botaoInteresse.textContent = demonstrouInteresse
    ? "Interesse registrado"
    : "Tenho interesse";

  statusInteresse.textContent = demonstrouInteresse
    ? "Seu interesse está salvo neste navegador."
    : "Seu interesse ainda não foi registrado.";
}

botaoInteresse.addEventListener("click", () => {
  const interesseAtual = lerDados(chaveInteresse, false);
  const interesseNovo = !interesseAtual;
  const salvou = salvarDados(chaveInteresse, interesseNovo);

  atualizarInteresse();

  if (!salvou) {
    statusInteresse.textContent =
      "Não foi possível salvar a escolha neste navegador.";
  }
});

atualizarInteresse();