// Gera atletas/<slug>.html e jogadores.html a partir dos dados do elenco.
// Rodar de dentro de site/:  node gerar-paginas.mjs
import { writeFileSync, mkdirSync } from 'node:fs';

const WHATS = 'https://wa.me/5512981878865';

// carta = arte dourada 410x730 · foto = foto enviada pelo Diego (ago/2026)
const ATLETAS = [
  { slug:'paulinho',        nome:'Paulinho',        posicao:'Meia-atacante',    altura:'1,82 m', ano:'2008', clube:'Red Bull Bragantino',   exClube:'América-MG',       escudo:'bragantino.svg', carta:'2.jpg' },
  { slug:'vitor-jovino',    nome:'Vitor Jovino',    posicao:'Atacante',         altura:'1,83 m', ano:'2008', clube:'Boston City FC',        exClube:'Grêmio Prudente',  carta:'arte-vitor-jovino.jpeg' },
  { slug:'janderson-jr',    nome:'Janderson Jr',    posicao:'Atacante',         altura:'1,55 m', ano:'2013', categoria:'Base',              carta:'5.jpg' },
  { slug:'joao-pedro',      nome:'João Pedro',      posicao:'Atacante',         altura:'1,83 m', ano:'2008', clube:'Barra FC',              exClube:'Corinthians',      carta:'7.jpg' },
  { slug:'miguel-campos',   nome:'Miguel Campos',   posicao:'Zagueiro',         altura:'1,88 m', ano:'1996', carta:'8.jpg',
    perfil:'https://www.transfermarkt.com/miguel-campos/profil/spieler/335744', perfilNome:'Transfermarkt', perfilLogo:'transfermarkt.png' },
  { slug:'cleyton',         nome:'Cleyton Matheus', posicao:'Lateral-esquerdo', altura:'1,82 m', ano:'2001', carta:'arte-cleyton.jpeg', videos:['I16kkt6Obxw','fVKzpzlxQoc'] },
  { slug:'fernando-fonseca',nome:'Fernando Fonseca',posicao:'Zagueiro',         altura:'1,90 m', ano:'1993', carta:'10.jpg', videos:['KBJDx-eAoYY','CxlmRp3s7J8'],
    perfil:'https://www.ogol.com.br/jogador/fernando/379323?epoca_id=153', perfilNome:'oGol', perfilLogo:'ogol.png' },
  { slug:'airon-santos',    nome:'Airon Santos',    posicao:'Goleiro',          altura:'1,90 m', ano:'1994', clube:'Al Ittihad SC',         exClube:'Carlos Renaux',    escudoEx:'carlos-renaux.png', pais:'Emirados Árabes Unidos', carta:'11.jpg', videos:['85TbGc8F8n8','d4rBAmzLvLI'],
    perfil:'https://www.ogol.com.br/jogador/airon/292230', perfilNome:'oGol', perfilLogo:'ogol.png' },
  { slug:'bruno-marcello',  nome:'Bruno Marcello',  posicao:'Zagueiro',         ano:'2012', clube:'Novorizontino', exClube:'Red Bull Bragantino', escudoEx:'bragantino.svg', categoria:'Base', carta:'arte-bruno-marcello.jpeg' },
  { slug:'caio-vandalete',  nome:'Caio Vandalete',  posicao:'Goleiro',          altura:'1,87 m', ano:'2010', clube:'Vasco da Gama',         exClube:'Cruzeiro', categoria:'Base', carta:'arte-caio-vandalete.jpeg' },
  { slug:'justin-cano',     nome:'Justin Cano',     posicao:'Zagueiro',         altura:'1,86 m', ano:'2002', clube:'Mineros de Zacatecas',  exClube:'Diriangén FC', escudoEx:'diriangen.png', pais:'México', carta:'14.jpg', videos:['_bC2Iscj_MY','PnlmuaBk0OU'],
    perfil:'https://www.transfermarkt.com.br/justing-cano/profil/spieler/763927', perfilNome:'Transfermarkt', perfilLogo:'transfermarkt.png' },
  { slug:'alison-rodrigo',  nome:'Alison Rodrigo',  posicao:'Lateral-direito',  altura:'1,87 m', ano:'1993', carta:'15.jpg', videos:['jKSMO7I1DpA','Su9Lz9WBUDA'] },
  { slug:'lucca-schmidt',   nome:'Lucca Schmidt',   posicao:'Lateral-esquerdo', clube:'Caldense',            carta:'arte-lucca-schmidt.jpeg' },
  { slug:'joao-victor',     nome:'João Victor',     posicao:'Goleiro',          clube:'Caldense',            carta:'arte-joao-victor.jpeg' },
  { slug:'jackson',         nome:'Jackson',         posicao:'Atacante',         clube:'Goianésia',           carta:'arte-jackson.jpeg' },
  { slug:'lucas-moraes',    nome:'Lucas Moraes',    posicao:'Lateral-esquerdo', clube:'Mirassol',            categoria:'Sub-17', carta:'arte-lucas-moraes.jpeg' },
  { slug:'heytor',          nome:'Heytor',          posicao:'Meio-campo',       clube:'Atlético Goianiense', categoria:'Sub-12', carta:'arte-heytor.jpeg' },
];

const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;');

const nav = (pfx) => `
<header class="ak-nav">
  <div class="ak-nav__inner">
    <a class="ak-nav__logo" href="${pfx}index.html" aria-label="AK Sports, início">
      <img src="${pfx}assets/img/logo-ak-crop.png" alt="Logo AK Sports" width="64" height="32">
      <b>AK&nbsp;SPORTS</b>
    </a>
    <nav aria-label="Principal">
      <ul class="ak-nav__links">
        <li><a class="ak-nav__link" href="${pfx}jogadores.html">Jogadores</a></li>
        <li><a class="ak-nav__link" href="${pfx}index.html#sobrenos">Ak Agency</a></li>
        <li><a class="ak-nav__link" href="${pfx}index.html#contato">Contato</a></li>
      </ul>
    </nav>
    <a class="ak-btn ak-btn--sm" href="${WHATS}"><span>Falar no WhatsApp</span></a>
  </div>
</header>`;

const rodape = (pfx) => `
<footer class="ak-rodape">
  <div class="ak-rodape__inner">
    <p>© 2026 AK Sports Management. Todos os direitos reservados. Plataforma desenvolvida e administrada pela AK Sports.</p>
    <div class="ak-rodape__social">
      <a class="ak-btn ak-btn--vazado ak-btn--icone" href="https://www.instagram.com/ak_sports.management_/" aria-label="Instagram da AK Sports">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r=".5" fill="currentColor"/></svg>
      </a>
      <a class="ak-btn ak-btn--vazado ak-btn--icone" href="${WHATS}" aria-label="WhatsApp da AK Sports">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 11.5a8.4 8.4 0 0 1-9.3 8.4 8.6 8.6 0 0 1-3.7-.9L3 20l1-4.9a8.4 8.4 0 1 1 17-3.6Z"/><path d="M9 10c.5 2.5 2.5 4.5 5 5l1.2-1.2c.3-.3.8-.4 1.2-.2l1.6.8"/></svg>
      </a>
    </div>
  </div>
</footer>`;

const DOMINIO = 'https://aksports.com.br';

const cabeca = (pfx, titulo, desc, canon, ogImg) => `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(titulo)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${DOMINIO}${canon}">
<meta property="og:type" content="website">
<meta property="og:locale" content="pt_BR">
<meta property="og:site_name" content="AK Sports Management">
<meta property="og:title" content="${esc(titulo)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${DOMINIO}${canon}">
<meta property="og:image" content="${DOMINIO}/assets/img/${ogImg}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="${pfx}assets/img/logo-ak-crop.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${pfx}assets/css/scrollcraft.css">
<link rel="stylesheet" href="${pfx}assets/css/ak.css">`;

const rodapeJs = `
<script>
document.documentElement.classList.add('js');
const pode = !matchMedia('(prefers-reduced-motion: reduce)').matches;
if (pode && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver(es => {
    for (const e of es) if (e.isIntersecting) { e.target.classList.add('na-tela'); io.unobserve(e.target); }
  }, { rootMargin: '0px 0px -8% 0px', threshold: .1 });
  document.querySelectorAll('.ak-revela').forEach(el => io.observe(el));
} else {
  document.querySelectorAll('.ak-revela').forEach(el => el.classList.add('na-tela'));
}
</script>`;

// mídia do card: carta > foto > placeholder
const midiaCard = (a, pfx) => {
  const src = a.carta ? `${pfx}assets/img/${a.carta}` : a.foto ? `${pfx}assets/img/${a.foto}` : null;
  if (!src) return `<span class="ak-carta-atleta--vazia"><img class="marca" src="${pfx}assets/img/logo-ak.png" alt="" aria-hidden="true"></span>`;
  return `<img src="${src}" alt="${esc(a.nome)}, ${esc(a.posicao.toLowerCase())}" loading="lazy" width="410" height="730">`;
};

const cardAtleta = (a, pfx, atraso) => `
      <a class="ak-carta-atleta ak-revela" ${atraso?`data-atraso="${atraso}"`:''} href="${pfx}atletas/${a.slug}.html">
        ${midiaCard(a, pfx)}
        <span class="ak-carta-atleta__info">
          <span class="ak-carta-atleta__nome">${esc(a.nome)}<small>${esc(a.posicao)}${a.categoria?` · ${esc(a.categoria)}`:''}</small></span>
        </span>
      </a>`;

/* ---------- jogadores.html ---------- */
const prof = ATLETAS.filter(a => !a.categoria || a.categoria === 'Base');
const base = ATLETAS.filter(a => a.categoria && a.categoria.startsWith('Sub'));

const jogadores = `${cabeca('', 'Jogadores · AK Sports', 'Elenco completo de atletas representados pela AK Sports Management: profissionais e categorias de base.', '/jogadores', 'capa-elenco.webp')}
<style>
main{width:min(1200px,92vw);margin-inline:auto;padding:7.5rem 0 4rem}
.topo h1{font-family:var(--sc-font-display);font-size:clamp(2rem,5vw,3.1rem);color:var(--ak-branco);margin:.4rem 0 .5rem}
.topo .risco{display:block;width:64px;height:4px;background:var(--ak-ouro);border-radius:2px}
.topo p{color:var(--ak-texto-suave);max-width:62ch;font-size:1.05rem;margin:0 0 2.4rem}
h2.grupo{font-family:var(--sc-font-display);font-size:1.35rem;color:var(--ak-branco);margin:2.6rem 0 1.2rem;display:flex;align-items:center;gap:.8rem}
h2.grupo .ak-badge{translate:0 -1px}
.grade{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:1.3rem}
</style>
</head>
<body>
${nav('')}
<main>
  <div class="topo ak-revela">
    <span class="risco" aria-hidden="true"></span>
    <h1>Nosso elenco</h1>
    <p>${ATLETAS.length} atletas representados no Brasil, no México e nos Emirados Árabes Unidos. Toque em uma carta para abrir a ficha completa.</p>
  </div>
  <h2 class="grupo ak-revela">Profissionais e base em clube <span class="ak-badge ak-badge--vazado">${prof.length}</span></h2>
  <div class="grade">
${prof.map((a,i) => cardAtleta(a, '', i % 4)).join('\n')}
  </div>
  <h2 class="grupo ak-revela">Categorias de base <span class="ak-badge ak-badge--vazado">${base.length}</span></h2>
  <div class="grade">
${base.map((a,i) => cardAtleta(a, '', i % 4)).join('\n')}
  </div>
</main>
${rodape('')}
${rodapeJs}
</body>
</html>`;
writeFileSync('jogadores.html', jogadores);

/* ---------- atletas/<slug>.html ---------- */
mkdirSync('atletas', { recursive: true });
for (const a of ATLETAS) {
  const pfx = '../';
  const linhas = [
    ['Posição', a.posicao],
    a.altura && ['Altura', a.altura],
    a.ano && ['Ano', a.ano],
    a.categoria && a.categoria.startsWith('Sub') && ['Categoria', a.categoria],
    a.clube && ['Clube', a.clube, a.escudo],
    a.pais && ['País', a.pais],
  ].filter(Boolean);

  const heroSrc = a.carta ? `${pfx}assets/img/${a.carta}` : a.foto ? `${pfx}assets/img/${a.foto}` : null;
  const fotoExtra = a.carta && a.foto ? `${pfx}assets/img/${a.foto}` : null;

  const pagina = `${cabeca(pfx, `${a.nome} · AK Sports`, `${a.nome}, ${a.posicao.toLowerCase()}${a.clube?` do ${a.clube}`:''}. Atleta representado pela AK Sports Management.`, `/atletas/${a.slug}`, a.carta || a.foto || 'capa-elenco.webp')}
<style>
main{width:min(1080px,92vw);margin-inline:auto;padding:7.5rem 0 4rem}
.volta{display:inline-flex;align-items:center;gap:.5rem;color:var(--ak-texto-suave);text-decoration:none;font-size:.85rem;font-weight:600;margin-bottom:1.6rem;transition:color var(--ak-dur-1)}
.volta:hover{color:var(--ak-ouro)}
.perfil{display:grid;grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr);gap:clamp(1.8rem,4.5vw,4rem);align-items:start}
.perfil .arte{position:relative;border-radius:20px;overflow:hidden;border:1px solid var(--ak-branco-12);border-top-color:rgba(255,255,255,.18);box-shadow:0 26px 60px -18px rgba(0,0,0,.85),0 0 44px -14px var(--ak-ouro-32),inset 0 1px 0 rgba(255,255,255,.12)}
.perfil .arte img{display:block;width:100%;height:auto}
.perfil .arte.vazia{aspect-ratio:410/730;display:grid;place-items:center;background:var(--ak-g-painel)}
.perfil .arte.vazia img{width:52%;opacity:.14}
.perfil h1{font-family:var(--sc-font-display);font-size:clamp(2rem,5vw,3.1rem);line-height:1.08;color:var(--ak-branco);margin:.7rem 0 1.4rem}
.selos{display:flex;flex-wrap:wrap;gap:.5rem}
.info .ak-ficha{margin:1.6rem 0}
.historico{color:var(--ak-texto-suave);font-size:.92rem;margin:0 0 1.8rem}
.historico b{color:var(--ak-texto)}
.acoes{display:flex;flex-wrap:wrap;gap:.9rem;align-items:center}
.acoes .perfil-ext img{height:22px;width:auto;display:block;filter:grayscale(1) brightness(1.8);transition:filter var(--ak-dur-2)}
.acoes .perfil-ext:hover img{filter:none}
.foto-atual{margin:2.2rem 0 0;border-radius:16px;overflow:hidden;border:1px solid var(--ak-branco-06)}
.foto-atual img{display:block;width:100%;height:auto}
.foto-atual figcaption{padding:.7rem 1rem;font-size:.75rem;color:var(--ak-texto-suave);background:#0A0B11}
@media (max-width:820px){.perfil{grid-template-columns:1fr}.perfil .arte{max-width:420px;margin-inline:auto}}
.escudo{height:22px;width:auto;display:inline-block;vertical-align:-4px;margin-right:.45rem}
.ak-ficha{grid-template-columns:repeat(auto-fit,minmax(140px,1fr))}
.ak-ficha dd{overflow-wrap:anywhere}
.ak-ficha .larga{grid-column:span 2}
@media (max-width:420px){.ak-ficha{grid-template-columns:1fr 1fr}}
.ak-ficha dd .escudo{height:24px;vertical-align:-5px}
.videos{margin-top:clamp(2.5rem,6vh,4rem)}
.videos h2{font-family:var(--sc-font-display);font-size:1.4rem;color:var(--ak-branco);margin:0 0 .35rem}
.videos>p{color:var(--ak-texto-suave);font-size:.875rem;margin:0 0 1.3rem}
.videos-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(340px,100%),1fr));gap:1.2rem}
.video-frame{position:relative;aspect-ratio:16/9;border-radius:16px;overflow:hidden;background:#000;border:1px solid var(--ak-branco-06);border-top-color:rgba(255,255,255,.16);box-shadow:0 18px 44px -20px rgba(0,0,0,.8)}
.video-frame iframe{position:absolute;inset:0;width:100%;height:100%;border:0}
</style>
</head>
<body>
${nav(pfx)}
<main>
  <a class="volta" href="${pfx}jogadores.html">
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5m6-6-6 6 6 6"/></svg>
    Voltar ao elenco
  </a>
  <div class="perfil">
    <figure class="arte ${heroSrc?'':'vazia'} ak-revela" style="margin:0">
      ${heroSrc
        ? `<img src="${heroSrc}" alt="${esc(a.nome)}, ${esc(a.posicao.toLowerCase())} representado pela AK Sports" width="410" height="730">`
        : `<img src="${pfx}assets/img/logo-ak.png" alt="" aria-hidden="true">`}
    </figure>
    <div class="info ak-revela" data-atraso="1">
      <div class="selos">
        <span class="ak-badge">${esc(a.posicao)}</span>
        ${a.categoria ? `<span class="ak-badge ak-badge--vazado">${esc(a.categoria)}</span>` : ''}
        ${a.pais ? `<span class="ak-badge ak-badge--neutro">${esc(a.pais)}</span>` : ''}
      </div>
      <h1>${esc(a.nome)}</h1>
      <dl class="ak-ficha">
${linhas.map(([k,v,cr]) => `        <div${cr || String(v).length > 12 ? ' class="larga"' : ''}><dt>${k}</dt><dd>${cr?`<img class="escudo" src="${pfx}assets/img/${cr}" alt="" aria-hidden="true">`:''}${esc(v)}</dd></div>`).join('\n')}
      </dl>
      ${a.exClube ? `<p class="historico">Passagem anterior: ${a.escudoEx?`<img class="escudo" src="${pfx}assets/img/${a.escudoEx}" alt="" aria-hidden="true">`:''}<b>${esc(a.exClube)}</b>.</p>` : ''}
      <div class="acoes">
        <a class="ak-btn" href="${WHATS}"><span>Falar no WhatsApp</span></a>
        ${a.perfil ? `<a class="ak-btn ak-btn--fantasma perfil-ext" href="${a.perfil}" rel="noopener" aria-label="Perfil de ${esc(a.nome)} no ${a.perfilNome}"><img src="${pfx}assets/img/${a.perfilLogo}" alt="${a.perfilNome}"></a>` : ''}
      </div>
      ${fotoExtra ? `
      <figure class="foto-atual ak-revela" data-atraso="2">
        <img src="${fotoExtra}" alt="${esc(a.nome)} com a camisa atual do ${esc(a.clube || 'clube')}" loading="lazy">
        <figcaption>${esc(a.nome)} hoje, no ${esc(a.clube || 'clube atual')}.</figcaption>
      </figure>` : ''}
    </div>
  </div>
  ${(a.videos && a.videos.length) ? `
  <section class="videos ak-revela" data-atraso="1" aria-label="Vídeos de ${esc(a.nome)}">
    <h2>O atleta em campo</h2>
    <p>Lances e destaques de ${esc(a.nome)}.</p>
    <div class="videos-grid">
${a.videos.map((v,i) => `      <div class="video-frame"><iframe src="https://www.youtube-nocookie.com/embed/${v}" title="Vídeo de ${esc(a.nome)} em campo${i ? ' · ' + (i+1) : ''}" loading="lazy" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe></div>`).join('\n')}
    </div>
  </section>` : ''}
</main>
${rodape(pfx)}
${rodapeJs}
</body>
</html>`;
  writeFileSync(`atletas/${a.slug}.html`, pagina);
}
/* ---------- sitemap.xml ---------- */
const hoje = new Date().toISOString().slice(0, 10);
const urls = ['/', '/jogadores', ...ATLETAS.map(a => `/atletas/${a.slug}`)];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url><loc>${DOMINIO}${u === '/' ? '' : u}</loc><lastmod>${hoje}</lastmod></url>`).join('\n')}
</urlset>
`;
writeFileSync('sitemap.xml', sitemap);
console.log(`ok: jogadores.html + ${ATLETAS.length} páginas de atletas + sitemap.xml`);
