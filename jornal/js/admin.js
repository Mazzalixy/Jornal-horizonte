(function () {
  const SENHA = "horizonte123"; // <- TROQUE A SENHA AQUI
  const CHAVE = "jornal_noticias";
  const CATS = ["Notícias", "Escola", "Tecnologia", "Esportes", "Cultura", "Entrevistas", "Eventos", "Opinião"];
  let itens = [];
  let editando = null;
  let foto = "";

  const painel = document.createElement("div");
  painel.className = "modal";
  painel.innerHTML = `
    <div class="modal-conteudo admin">
      <button class="fechar" id="adFechar" aria-label="Fechar">×</button>
      <div id="adLogin">
        <h2>Área do grupo</h2>
        <p class="ad-txt">Digite a senha para cadastrar notícias.</p>
        <div class="ad-linha">
          <input type="password" id="adSenha" placeholder="Senha">
          <button class="leia" id="adEntrar" style="margin:0">Entrar</button>
        </div>
        <p class="ad-erro" id="adErro"></p>
      </div>
      <div id="adPainel" hidden>
        <h2 id="adTitulo">Nova notícia</h2>
        <div class="ad-form">
          <label class="largo">Título<input type="text" id="adT" required></label>
          <label class="largo">Resumo curto<input type="text" id="adS" required></label>
          <label class="largo">Texto da matéria (pule uma linha para separar parágrafos)<textarea id="adX" required></textarea></label>
          <label>Categoria<select id="adC" required><option value="">Selecione</option>${CATS.map(c => `<option>${c}</option>`).join("")}</select></label>
          <label>Autor<input type="text" id="adA" required></label>
          <label>Data<input type="text" id="adD" required></label>
          <label>Foto da matéria<input type="file" id="adF" accept="image/*" required></label>
          <label class="largo"><input type="checkbox" id="adDest"> Mostrar nos destaques (carrossel)</label>
          <p class="ad-validacao largo" id="adValidacao" role="alert" hidden></p>
          <div class="largo ad-linha">
            <button class="leia" id="adSalvar">Publicar</button>
            <button class="leia" id="adCancelar" style="background:transparent;color:var(--texto);border:1px solid var(--borda)" hidden>Cancelar edição</button>
          </div>
        </div>
        <h3>Notícias publicadas</h3>
        <div id="adLista"></div>
        <div class="ad-rodape">
          <button id="adExportar">Baixar backup</button>
          <button id="adImportar">Importar backup</button>
          <input type="file" id="adArquivo" accept=".json" hidden>
          <button id="adSair">Sair</button>
        </div>
      </div>
    </div>`;
  document.body.appendChild(painel);
  const $ = s => painel.querySelector(s);

  function abrir() {
    painel.classList.add("aberto");
    document.body.style.overflow = "hidden";
    if (sessionStorage.getItem("jornal_admin_ok") === "1") mostrarPainel();
    else { $("#adLogin").hidden = false; $("#adPainel").hidden = true; $("#adSenha").focus(); }
  }

  function fechar() {
    painel.classList.remove("aberto");
    document.body.style.overflow = "";
  }

  function mostrarPainel() {
    itens = noticias.map(n => ({ ...n }));
    $("#adLogin").hidden = true;
    $("#adPainel").hidden = false;
    limpar();
    const mensagem = sessionStorage.getItem("jornal_admin_mensagem");
    if (mensagem) {
      $("#adValidacao").textContent = mensagem;
      $("#adValidacao").classList.add("sucesso");
      $("#adValidacao").hidden = false;
      sessionStorage.removeItem("jornal_admin_mensagem");
    }
    listar();
  }

  function limpar() {
    editando = null;
    foto = "";
    $("#adTitulo").textContent = "Nova notícia";
    ["#adT", "#adS", "#adX", "#adA", "#adF"].forEach(id => ($(id).value = ""));
    $("#adD").value = new Date().toLocaleDateString("pt-BR");
    $("#adC").value = "";
    $("#adDest").checked = false;
    $("#adCancelar").hidden = true;
    $("#adSalvar").textContent = "Publicar";
    $("#adValidacao").hidden = true;
    $("#adValidacao").classList.remove("sucesso");
  }

  function listar() {
    $("#adLista").innerHTML = itens.length
      ? itens.map(n => `
        <div class="ad-item">
          <span>${escapeHTML(n.titulo)} <small>· ${escapeHTML(n.categoria)}</small></span>
          <button data-ed="${n.id}">Editar</button>
          <button class="apagar" data-ap="${n.id}">Apagar</button>
        </div>`).join("")
      : `<p class="ad-txt">Nenhuma notícia ainda.</p>`;
  }

  function gravar(mensagem = "Alterações salvas com sucesso.") {
    try {
      localStorage.setItem(CHAVE, JSON.stringify(itens));
      sessionStorage.setItem("jornal_admin_reabrir", "1");
      sessionStorage.setItem("jornal_admin_mensagem", mensagem);
      location.reload();
    } catch (e) {
      alert("Não coube no armazenamento do navegador. Use fotos menores ou apague notícias antigas.");
    }
  }

  function redimensionar(arquivo, cb) {
    const leitor = new FileReader();
    leitor.onload = () => {
      const img = new Image();
      img.onload = () => {
        const esc = Math.min(1, 1000 / img.width);
        const c = document.createElement("canvas");
        c.width = img.width * esc;
        c.height = img.height * esc;
        c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
        cb(c.toDataURL("image/jpeg", 0.8));
      };
      img.src = leitor.result;
    };
    leitor.readAsDataURL(arquivo);
  }

  document.getElementById("abrirAdmin").addEventListener("click", e => { e.preventDefault(); abrir(); });
  $("#adFechar").addEventListener("click", fechar);

  $("#adEntrar").addEventListener("click", () => {
    if ($("#adSenha").value === SENHA) {
      sessionStorage.setItem("jornal_admin_ok", "1");
      $("#adSenha").value = "";
      $("#adErro").textContent = "";
      mostrarPainel();
    } else $("#adErro").textContent = "Senha incorreta. Tente de novo.";
  });
  $("#adSenha").addEventListener("keydown", e => { if (e.key === "Enter") $("#adEntrar").click(); });

  $("#adF").addEventListener("change", e => {
    if (e.target.files[0]) redimensionar(e.target.files[0], url => (foto = url));
  });

  $("#adSalvar").addEventListener("click", () => {
    const titulo = $("#adT").value.trim();
    const subtitulo = $("#adS").value.trim();
    const texto = $("#adX").value.trim();
    const autor = $("#adA").value.trim();
    const data = $("#adD").value.trim();
    const categoria = $("#adC").value;
    const faltando = !titulo ? "Título" : !subtitulo ? "Resumo" : !texto ? "Texto da matéria" :
      !autor ? "Autor" : !data ? "Data" : !categoria ? "Categoria" : !foto ? "Foto da matéria" : "";
    if (faltando) {
      $("#adValidacao").textContent = `Preencha o campo: ${faltando}.`;
      $("#adValidacao").classList.remove("sucesso");
      $("#adValidacao").hidden = false;
      return;
    }
    $("#adValidacao").hidden = true;
    const dados = {
      titulo, texto, imagem: foto,
      subtitulo,
      autor,
      data,
      categoria,
      destaque: $("#adDest").checked
    };
    const mensagem = editando !== null ? "Matéria atualizada com sucesso." : "Matéria publicada com sucesso.";
    if (editando !== null) {
      const i = itens.findIndex(n => n.id === editando);
      itens[i] = { ...itens[i], ...dados };
    } else {
      dados.id = itens.reduce((m, n) => Math.max(m, n.id), 0) + 1;
      itens.unshift(dados);
    }
    gravar(mensagem);
  });

  $("#adCancelar").addEventListener("click", limpar);

  $("#adLista").addEventListener("click", e => {
    const ed = e.target.dataset.ed, ap = e.target.dataset.ap;
    if (ed) {
      const n = itens.find(x => x.id === Number(ed));
      editando = n.id;
      foto = n.imagem || "";
      $("#adTitulo").textContent = "Editando notícia";
      $("#adT").value = n.titulo; $("#adS").value = n.subtitulo; $("#adX").value = n.texto;
      $("#adA").value = n.autor; $("#adD").value = n.data; $("#adC").value = n.categoria;
      $("#adDest").checked = !!n.destaque;
      $("#adSalvar").textContent = "Salvar alterações";
      $("#adCancelar").hidden = false;
      painel.querySelector(".modal-conteudo").scrollTo({ top: 0, behavior: "smooth" });
    }
    if (ap && confirm("Apagar esta notícia?")) {
      itens = itens.filter(x => x.id !== Number(ap));
      gravar();
    }
  });

  $("#adExportar").addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(itens, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "noticias-horizonte.json";
    a.click();
  });

  $("#adImportar").addEventListener("click", () => $("#adArquivo").click());
  $("#adArquivo").addEventListener("change", e => {
    const arq = e.target.files[0];
    if (!arq) return;
    const leitor = new FileReader();
    leitor.onload = () => {
      try {
        const dados = JSON.parse(leitor.result);
        if (!Array.isArray(dados)) throw new Error();
        itens = dados;
        gravar();
      } catch (err) { alert("Esse arquivo não é um backup válido."); }
    };
    leitor.readAsText(arq);
  });

  $("#adSair").addEventListener("click", () => {
    sessionStorage.removeItem("jornal_admin_ok");
    fechar();
  });

  if (sessionStorage.getItem("jornal_admin_reabrir") === "1") {
    sessionStorage.removeItem("jornal_admin_reabrir");
    abrir();
  }
})();
