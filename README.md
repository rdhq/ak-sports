# AK Sports · aksports.com.br

Site institucional da AK Sports Management. Estático puro (HTML/CSS/JS vanilla), sem build step: a raiz deste repositório é a raiz do deploy.

## Estrutura

| Caminho | O que é |
|---|---|
| `index.html` | Home scroll-driven (engine scrollcraft em `assets/js/scrollcraft.js`) |
| `jogadores.html` | Elenco completo — **gerado**, não editar na mão |
| `atletas/*.html` | Página de cada atleta — **geradas**, não editar na mão |
| `gerar-paginas.mjs` | Gerador: dados do elenco + templates de jogadores/atletas + sitemap |
| `assets/` | CSS (tokens `--ak-*` em `ak.css`), fontes Geom Graphic, imagens |
| `vercel.json` | cleanUrls, cache immutable de `/assets`, redirects 308 dos slugs antigos do WordPress |

## Atualizar o elenco

1. Edite o array `ATLETAS` em `gerar-paginas.mjs` (posição, clube, foto, etc.). Fotos novas vão em `assets/img/`.
2. Regenere: `node gerar-paginas.mjs` (reescreve `jogadores.html`, `atletas/` e `sitemap.xml`).
3. Commit + push: a Vercel publica sozinha.

## Rodar localmente

Qualquer servidor estático serve. Ex.: `npx serve .` e abrir http://localhost:3000.

## Deploy

Projeto Vercel conectado a este repositório (framework: **Other**, sem build, output = raiz). Domínio: `aksports.com.br`.
