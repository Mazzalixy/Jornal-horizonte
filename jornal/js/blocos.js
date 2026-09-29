// Bloco "Campeonatos e eventos": pega as notícias de Esportes, Cultura e Escola.
(function () {
  const caixa = document.getElementById("mosaico");
  const itens = noticias.filter(n => ["Esportes", "Cultura", "Escola"].includes(n.categoria)).slice(0, 5);
  if (!itens.length) { document.getElementById("eventos").style.display = "none"; return; }
  caixa.innerHTML = itens.map(n => `
    <button class="tile" data-id="${n.id}" ${n.imagem ? `style="background-image:url('${n.imagem}')"` : ""}>
      <span class="categoria">${escapeHTML(n.categoria)}</span>
      <strong>${escapeHTML(n.titulo)}</strong>
    </button>`).join("");
  caixa.querySelectorAll(".tile").forEach(b => b.addEventListener("click", () => abrirNoticia(Number(b.dataset.id))));
})();
