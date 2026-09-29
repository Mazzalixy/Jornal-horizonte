# JORNAL HORIZONTE

Projeto de jornal escolar feito com HTML, CSS e JavaScript.

## Como abrir

Abra o arquivo `index.html` no navegador.

## Onde colocar as notícias

Abra:

`js/script.js`

No começo do arquivo existe uma lista chamada:

`const noticias = [ ... ]`

É nela que o grupo deve cadastrar as próprias notícias.

Cada notícia possui:

- titulo
- subtitulo
- texto
- imagem
- autor
- data
- categoria
- destaque

## Como colocar uma imagem

Coloque a imagem dentro da pasta:

`img`

Depois, na notícia, use:

`imagem: "img/nome-da-imagem.jpg"`

Se deixar `imagem: ""`, o site mostrará um espaço reservado para a imagem.

## Funcionalidades

1. Pesquisa de notícias
2. Filtro por categoria
3. Modo escuro com preferência salva
4. Contador de visualizações salvo no navegador
5. Carrossel de notícias

## Categorias

- Notícias
- Escola
- Tecnologia
- Esportes
- Cultura
- Entrevistas

Os textos de exemplo são apenas modelos. O grupo deve substituí-los pelas matérias produzidas para o trabalho.

## Área do grupo (sem mexer em código)

No rodapé do site, clique em "Área do grupo" e entre com a senha.
A senha padrão é `horizonte123`. Para trocar, edite a primeira linha de `js/admin.js`.
Ali dá para cadastrar, editar e apagar notícias, com foto.
As notícias ficam salvas no navegador usado. Para levar para outro computador,
use "Baixar backup" e depois "Importar backup" no outro.
