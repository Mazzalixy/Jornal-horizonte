/*
=========================================================
ÁREA DO GRUPO — CADASTRE AS NOTÍCIAS AQUI
=========================================================

Para adicionar uma notícia, copie um objeto abaixo e altere:
- titulo
- subtitulo
- texto
- imagem: coloque o caminho da imagem dentro de img/
- autor
- data
- categoria

Exemplo:
imagem: "img/minha-foto.jpg"

Se não quiser usar imagem ainda, deixe:
imagem: ""

As categorias disponíveis são:
Notícias, Escola, Tecnologia, Esportes, Cultura, Entrevistas, Eventos, Opinião
=========================================================
*/

const noticiasPadrao = [
  {
    id: 1,
    titulo: "COLOQUE AQUI O TÍTULO DA NOTÍCIA",
    subtitulo: "Escreva aqui um resumo curto da notícia.",
    texto: "Escreva aqui o texto completo da notícia. Este é o espaço para o grupo colocar a matéria produzida.",
    imagem: "",
    autor: "Nome do autor",
    data: "23/09/2026",
    categoria: "Notícias",
    destaque: true
  },
  {
    id: 2,
    titulo: "EXEMPLO DE NOTÍCIA DA ESCOLA",
    subtitulo: "Use este espaço para explicar rapidamente o assunto.",
    texto: "Substitua este texto pela notícia feita pelo grupo.",
    imagem: "",
    autor: "Nome do autor",
    data: "23/09/2026",
    categoria: "Escola",
    destaque: true
  },
  {
    id: 3,
    titulo: "EXEMPLO DE TECNOLOGIA",
    subtitulo: "Uma chamada para a matéria de tecnologia.",
    texto: "Substitua este texto pelo conteúdo produzido pelo grupo.",
    imagem: "",
    autor: "Nome do autor",
    data: "23/09/2026",
    categoria: "Tecnologia",
    destaque: true
  },
  {
    id: 4,
    titulo: "EXEMPLO DE ESPORTES",
    subtitulo: "Uma chamada para a matéria esportiva.",
    texto: "Substitua este texto pelo conteúdo produzido pelo grupo.",
    imagem: "",
    autor: "Nome do autor",
    data: "23/09/2026",
    categoria: "Esportes",
    destaque: false
  },
  {
    id: 5,
    titulo: "EXEMPLO DE CULTURA",
    subtitulo: "Uma chamada para a matéria de cultura.",
    texto: "Substitua este texto pelo conteúdo produzido pelo grupo.",
    imagem: "",
    autor: "Nome do autor",
    data: "23/09/2026",
    categoria: "Cultura",
    destaque: false
  },
  {
    id: 6,
    titulo: "EXEMPLO DE ENTREVISTA",
    subtitulo: "Uma chamada para a entrevista do grupo.",
    texto: "Substitua este texto pelo conteúdo produzido pelo grupo.",
    imagem: "",
    autor: "Nome do autor",
    data: "23/09/2026",
    categoria: "Entrevistas",
    destaque: false
  }
];

// Se o grupo cadastrou notícias pelo painel (Área do grupo), usa essas.
let noticias = noticiasPadrao;
try {
  const salvas = JSON.parse(localStorage.getItem("jornal_noticias"));
  if (Array.isArray(salvas)) noticias = salvas;
} catch (e) {}

const estado = {
  filtro: "Todas",
  busca: "",
  slide: 0
};

const lista = document.getElementById("listaNoticias");
const carrossel = document.getElementById("carrossel");
const pontos = document.getElementById("pontos");
const modal = document.getElementById("modal");
const conteudoModal = document.getElementById("conteudoModal");

function escapeHTML(valor) {
  return String(valor ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function imagemHTML(noticia, classe = "") {
  if (noticia.imagem && noticia.imagem.trim() !== "") {
    return `<img class="${classe}" src="${escapeHTML(noticia.imagem)}" alt="${escapeHTML(noticia.titulo)}">`;
  }
  return `<span class="sem-imagem">IMAGEM DA NOTÍCIA</span>`;
}

function dataAmigavel(valor) {
  const texto = String(valor || "").trim();
  const brasileira = texto.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  const iso = texto.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  let data;

  if (brasileira) data = new Date(Number(brasileira[3]), Number(brasileira[2]) - 1, Number(brasileira[1]));
  else if (iso) data = new Date(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3]));
  else return texto || "Data não informada";

  if (data.getDate() !== Number(brasileira ? brasileira[1] : iso[3]) ||
      data.getMonth() !== Number(brasileira ? brasileira[2] : iso[2]) - 1) {
    return texto;
  }

  return new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(data);
}

function chaveVisualizacao(id) {
  return `jornal_horizonte_views_${id}`;
}

function obterVisualizacoes(id) {
  return Number(localStorage.getItem(chaveVisualizacao(id)) || 0);
}

function aumentarVisualizacao(id) {
  const atual = obterVisualizacoes(id) + 1;
  localStorage.setItem(chaveVisualizacao(id), atual);
  return atual;
}

function renderNoticias() {
  const busca = estado.busca.toLowerCase().trim();

  const filtradas = noticias.filter(noticia => {
    const categoriaOK = estado.filtro === "Todas" || noticia.categoria === estado.filtro;
    const textoBusca = `${noticia.titulo} ${noticia.subtitulo} ${noticia.texto} ${noticia.autor}`.toLowerCase();
    const buscaOK = !busca || textoBusca.includes(busca);
    return categoriaOK && buscaOK;
  });

  lista.innerHTML = filtradas.map(noticia => `
    <article class="noticia-card">
      <div class="noticia-imagem">${imagemHTML(noticia)}</div>
      <div class="noticia-info">
        <span class="categoria">${escapeHTML(noticia.categoria)}</span>
        <h3>${escapeHTML(noticia.titulo)}</h3>
        <p class="subtitulo">${escapeHTML(noticia.subtitulo)}</p>
        <p class="noticia-meta">
          ${escapeHTML(noticia.autor)} · ${escapeHTML(dataAmigavel(noticia.data))} ·
          👁 ${obterVisualizacoes(noticia.id)}
        </p>
        <button class="leia" data-ler="${noticia.id}">Ler notícia</button>
      </div>
    </article>
  `).join("");

  document.getElementById("semResultados").style.display =
    filtradas.length ? "none" : "block";

  document.querySelectorAll("[data-ler]").forEach(botao => {
    botao.addEventListener("click", () => abrirNoticia(Number(botao.dataset.ler)));
  });
}

function renderCarrossel() {
  const destaques = noticias.filter(n => n.destaque);

  if (!destaques.length) {
    carrossel.innerHTML = "";
    pontos.innerHTML = "";
    return;
  }

  if (estado.slide >= destaques.length) estado.slide = 0;

  carrossel.innerHTML = destaques.map((noticia, index) => `
    <article class="slide ${index === estado.slide ? "ativo" : ""}">
      <div class="slide-imagem">${imagemHTML(noticia)}</div>
      <div class="slide-info">
        <span class="categoria">${escapeHTML(noticia.categoria)}</span>
        <h3>${escapeHTML(noticia.titulo)}</h3>
        <p>${escapeHTML(noticia.subtitulo)}</p>
        <p class="meta">${escapeHTML(noticia.autor)} · ${escapeHTML(dataAmigavel(noticia.data))}</p>
        <button class="leia" data-destaque="${noticia.id}">Ler notícia</button>
      </div>
    </article>
  `).join("");

  pontos.innerHTML = destaques.map((_, index) => `
    <button class="ponto ${index === estado.slide ? "ativo" : ""}" data-slide="${index}" aria-label="Ir para notícia ${index + 1}"></button>
  `).join("");

  document.querySelectorAll("[data-destaque]").forEach(botao => {
    botao.addEventListener("click", () => abrirNoticia(Number(botao.dataset.destaque)));
  });

  document.querySelectorAll("[data-slide]").forEach(botao => {
    botao.addEventListener("click", () => {
      estado.slide = Number(botao.dataset.slide);
      renderCarrossel();
    });
  });
}

function renderAvisos() {
  const avisos = noticias.filter(n => ["Eventos", "Escola"].includes(n.categoria)).slice(0, 4);
  const listaAvisos = document.getElementById("listaAvisos");

  listaAvisos.innerHTML = avisos.length
    ? avisos.map(noticia => `
      <button class="aviso-item" data-aviso="${noticia.id}">
        <span class="categoria">${escapeHTML(noticia.categoria)}</span>
        <strong>${escapeHTML(noticia.titulo)}</strong>
        <span>${escapeHTML(dataAmigavel(noticia.data))}</span>
      </button>
    `).join("")
    : `<p class="aviso-vazio">Os avisos de eventos e da escola aparecerão aqui.</p>`;

  listaAvisos.querySelectorAll("[data-aviso]").forEach(botao => {
    botao.addEventListener("click", () => abrirNoticia(Number(botao.dataset.aviso)));
  });
}

function abrirNoticia(id) {
  const noticia = noticias.find(n => n.id === id);
  if (!noticia) return;

  const visualizacoes = aumentarVisualizacao(id);

  conteudoModal.innerHTML = `
    <article class="artigo">
      <div class="artigo-categoria">
        <span class="categoria">${escapeHTML(noticia.categoria)}</span>
      </div>
      <h2>${escapeHTML(noticia.titulo)}</h2>
      <p class="artigo-subtitulo">${escapeHTML(noticia.subtitulo)}</p>
      ${noticia.imagem ? `<img class="artigo-imagem" src="${escapeHTML(noticia.imagem)}" alt="${escapeHTML(noticia.titulo)}">` : ""}
      <p class="artigo-meta">
        Por <strong>${escapeHTML(noticia.autor)}</strong> · ${escapeHTML(dataAmigavel(noticia.data))} ·
        👁 ${visualizacoes} visualizações
      </p>
      <div class="artigo-texto">${escapeHTML(noticia.texto)}</div>
    </article>
  `;

  modal.classList.add("aberto");
  document.body.style.overflow = "hidden";
  renderNoticias();
}

document.getElementById("fecharModal").addEventListener("click", fecharModal);

modal.addEventListener("click", event => {
  if (event.target === modal) fecharModal();
});

function fecharModal() {
  modal.classList.remove("aberto");
  document.body.style.overflow = "";
}

document.getElementById("campoBusca").addEventListener("input", event => {
  estado.busca = event.target.value;
  renderNoticias();
});

document.getElementById("filtroCategoria").addEventListener("change", event => {
  estado.filtro = event.target.value;
  renderNoticias();
});

document.querySelectorAll("[data-filtro]").forEach(link => {
  link.addEventListener("click", () => {
    estado.filtro = link.dataset.filtro;
    document.getElementById("filtroCategoria").value = estado.filtro;
    document.querySelectorAll("[data-filtro]").forEach(item => {
      if (item.dataset.filtro === estado.filtro) item.setAttribute("aria-current", "page");
      else item.removeAttribute("aria-current");
    });
    renderNoticias();
  });
});

document.getElementById("anterior").addEventListener("click", () => {
  const total = noticias.filter(n => n.destaque).length;
  if (!total) return;
  estado.slide = (estado.slide - 1 + total) % total;
  renderCarrossel();
});

document.getElementById("proximo").addEventListener("click", () => {
  const total = noticias.filter(n => n.destaque).length;
  if (!total) return;
  estado.slide = (estado.slide + 1) % total;
  renderCarrossel();
});

let intervalo = setInterval(() => {
  const total = noticias.filter(n => n.destaque).length;
  if (total > 1) {
    estado.slide = (estado.slide + 1) % total;
    renderCarrossel();
  }
}, 6000);

document.getElementById("btnTema").addEventListener("click", () => {
  document.body.classList.toggle("escuro");
  const escuro = document.body.classList.contains("escuro");
  localStorage.setItem("jornal_tema", escuro ? "escuro" : "claro");
  document.getElementById("btnTema").textContent = escuro ? "☀️ Modo claro" : "🌙 Modo escuro";
});

if (localStorage.getItem("jornal_tema") === "escuro") {
  document.body.classList.add("escuro");
  document.getElementById("btnTema").textContent = "☀️ Modo claro";
}

document.getElementById("dataEdicao").textContent =
  new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  }).format(new Date());

document.getElementById("ano").textContent = new Date().getFullYear();

const menuMobile = document.getElementById("menuMobile");
const linksMenu = document.getElementById("linksMenu");

menuMobile.addEventListener("click", () => {
  const aberto = linksMenu.classList.toggle("aberto");
  menuMobile.setAttribute("aria-expanded", String(aberto));
});

document.querySelectorAll(".links-menu a").forEach(link => {
  link.addEventListener("click", () => {
    linksMenu.classList.remove("aberto");
    menuMobile.setAttribute("aria-expanded", "false");
  });
});

renderNoticias();
renderCarrossel();
renderAvisos();
