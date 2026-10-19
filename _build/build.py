"""Arma index.html: conserva el inicio (video + dron 3D) del sitio original y reemplaza el resto."""
import sys, pathlib, re
root = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(root / '_build'))
import portfolio

src = (root / '_build' / 'original.html').read_text()
sections = (root / '_build' / 'sections.html').read_text().replace('{{PORTFOLIO}}', portfolio.html_out)
css = (root / '_build' / 'extra.css').read_text()

def rep(s, old, new, count=1):
    if old not in s:
        sys.exit('NO ENCONTRADO: ' + old[:90])
    return s.replace(old, new, count)

s = src
a = s.index('<!-- ── ABOUT ── -->'); b = s.index('<!-- CRISP CHAT -->')
s = s[:a] + sections + '\n' + s[b:]

# colores de marca, tipografía de títulos y estilos nuevos
s = rep(s, '--accent:#2a7a78;--accent2:#5ab3af;--accent3:#a8ddd9;', '--accent:#F5821F;--accent2:#FF9A3D;--accent3:#FFC48A;')
i = s.index('</style>'); s = s[:i] + css + s[i:]

# metadatos
s = rep(s, '<link rel="icon" type="image/x-icon" href="favicon.ico">', '<link rel="icon" type="image/x-icon" href="favicon.ico?v=2">\n<link rel="icon" type="image/png" sizes="192x192" href="icon-192.png">\n<link rel="apple-touch-icon" href="apple-touch-icon.png">\n<meta name="theme-color" content="#000000">')
s = rep(s, '<title>FLYVIEW23 — Producción Audiovisual Aérea · Colombia</title>',
        '<title>Flyview23 · Video con dron y experiencias en Guatapé y Santa Marta</title>')
s = s.replace('content="Producción audiovisual aérea profesional con drones en Colombia. Videos, fotos y contenido aéreo de alta calidad."',
              'content="Video con dron, jetski, lancha, planchón y fotos en Guatapé y Santa Marta. Reserva en línea tu experiencia con Flyview23."')
s = s.replace('content="Producción audiovisual aérea profesional con drones en Colombia."',
              'content="Video con dron y experiencias en Guatapé y Santa Marta. Reserva en línea."')
s = s.replace('https://flyview23.com/logo.jpg', 'https://flyview23.com/og-flyview23.jpg')
s = s.replace('<meta property="og:image:width" content="500">', '<meta property="og:image:width" content="1200">')
s = s.replace('<meta property="og:image:height" content="500">', '<meta property="og:image:height" content="630">')
s = s.replace('<meta name="twitter:card" content="summary">', '<meta name="twitter:card" content="summary_large_image">')

# menú
old_nav = s[s.index('<div class="nav-logo"'):s.index('<div class="nav-right">')]
new_nav = '''<a class="nav-logo x-nav-logo" href="#" onclick="window.scrollTo({top:0,behavior:'smooth'});return false;" aria-label="Flyview23, inicio"><img src="logo-fv23-64.png" alt="" width="34" height="34"><span>FLYVIEW23</span></a>
  <div class="nav-links">
    <a href="#trabajo" onclick="navTo('trabajo');return false;" data-es="Trabajo" data-en="Work">Trabajo</a>
    <a href="#experiencias" onclick="navTo('experiencias');return false;" data-es="Experiencias" data-en="Experiences">Experiencias</a>
    <a href="#detras" onclick="navTo('detras');return false;" data-es="Detrás de cámara" data-en="Behind the scenes">Detrás de cámara</a>
    <a href="#premium" onclick="navTo('premium');return false;">Premium</a>
    <a href="#contact" onclick="navTo('contact');return false;" data-es="Contacto" data-en="Contact">Contacto</a>
  </div>
  '''
s = s.replace(old_nav, new_nav, 1)
s = rep(s, '''<button class="nav-cta" onclick="document.getElementById('sub').scrollIntoView({behavior:'smooth'})" data-es="Suscribirse" data-en="Subscribe">Suscribirse</button>''',
        '''<button class="nav-cta" data-book="" data-es="Reservar" data-en="Book">Reservar</button>''')

# inicio: se conserva el video y el dron; solo cambian textos y botones
s = rep(s, 'data-es="Santa Marta · Guatapé · Tayrona · Colombia" data-en="Santa Marta · Guatapé · Tayrona · Colombia">Santa Marta · Guatapé · Tayrona · Colombia',
        'data-es="Guatapé · Santa Marta · Colombia" data-en="Guatapé · Santa Marta · Colombia">Guatapé · Santa Marta · Colombia')
s = rep(s, 'data-es="Producción audiovisual aérea profesional. Casi 3 años, más de 10,000 ventas." data-en="Professional aerial audiovisual production. Nearly 3 years, over 10,000 sales.">Producción audiovisual aérea profesional. Casi 3 años, más de 10,000 ventas.',
        'data-es="Tú vives la experiencia. Nosotros la capturamos desde el cielo." data-en="You live the experience. We capture it from the sky.">Tú vives la experiencia. Nosotros la capturamos desde el cielo.')
s = rep(s, '''<a href="#gallery" onclick="navTo('gallery');return false;" class="btn-primary" data-es="Ver Galería" data-en="See Gallery">Ver Galería</a>
        <a href="#sub" onclick="navTo('sub');return false;" class="btn-secondary" data-es="Suscripción" data-en="Subscription">Suscripción</a>''',
        '''<button class="x-btn" data-book="" data-es="Reservar ahora" data-en="Book now">Reservar ahora</button>
        <a href="#trabajo" onclick="navTo('trabajo');return false;" class="btn-secondary" data-es="Ver nuestro trabajo" data-en="See our work">Ver nuestro trabajo</a>''')
s = rep(s, '<span class="ti">TAYRONA</span><span class="ts">✦</span>', '')

s = rep(s, '<video id="hero-video" autoplay muted loop playsinline preload="auto" fetchpriority="high">', '<video id="hero-video" autoplay muted loop playsinline preload="auto" fetchpriority="high" poster="media/video/hero.jpg">')
s = rep(s, 'background:linear-gradient(135deg,#0a0a0a 0%,#1a1a2e 50%,#0a0a0a 100%);z-index:1;', 'background:linear-gradient(rgba(0,0,0,.5),rgba(0,0,0,.5)),#fff url(media/video/hero.jpg) center/cover no-repeat;z-index:1;')
s = rep(s, "  const tryPlay = () => {", "  vid.addEventListener('canplay', () => { if (vid.paused) tryPlay(); }, { once: true });\n  ['touchstart', 'click', 'scroll'].forEach(ev => window.addEventListener(ev, () => { if (vid.paused) vid.play().then(() => { if (fallback) fallback.style.display = 'none'; }).catch(() => {}); }, { once: true, passive: true }));\n  const tryPlay = () => {")
s = rep(s, 'filter:contrast(1.08) saturate(0.88) brightness(0.82);', 'filter:contrast(1.08) saturate(0.9) brightness(0.55);')
# años: 5+
# números del inicio y de la franja
a3 = s.index('<div class="vh-stats" id="vh-stats">'); b3 = s.index('<!-- Scroll hint -->', a3)
s = s[:a3] + """<div class="vh-stats" id="vh-stats">
      <div class="vhs"><span class="vhs-n">70K<span>+</span></span><span class="vhs-l" data-es="Recuerdos" data-en="Memories">Recuerdos</span></div>
      <div class="vhs-sep"></div>
      <div class="vhs"><span class="vhs-n">5<span>+</span></span><span class="vhs-l" data-es="Años" data-en="Years">Años</span></div>
      <div class="vhs-sep"></div>
      <div class="vhs"><span class="vhs-n">5.0<span>★</span></span><span class="vhs-l">Google</span></div>
      <div class="vhs-sep"></div>
      <div class="vhs"><span class="vhs-n">2</span><span class="vhs-l" data-es="Destinos" data-en="Destinations">Destinos</span></div>
    </div>

    """ + s[b3:]
a3 = s.index('<div class="stats-bar">'); b3 = s.index('</div>\n', s.index('Entrega máxima', a3)) + 7
s = s[:a3] + """<div class="stats-bar">
  <div class="stat-item" data-r><div class="stat-n" id="cnt-sales">70<span>K+</span></div><div class="stat-l" data-es="Recuerdos entregados" data-en="Memories delivered">Recuerdos entregados</div></div>
  <div class="stat-item" data-r><div class="stat-n" id="cnt-years">5<span>+</span></div><div class="stat-l" data-es="Años creando recuerdos" data-en="Years creating memories">Años creando recuerdos</div></div>
  <div class="stat-item" data-r><a class="x-stat-link" href="https://www.google.com/maps/place/?q=place_id:ChIJo6lnKyr19I4ReKrvMCFCn3c" target="_blank" rel="noopener"><div class="stat-n">5<span>.0★</span></div><div class="stat-l" data-es="62 reseñas en Google" data-en="62 Google reviews">62 reseñas en Google</div></a></div>
  <div class="stat-item" data-r><div class="stat-n">2</div><div class="stat-l" data-es="Destinos: Guatapé y Santa Marta" data-en="Destinations: Guatapé &amp; Santa Marta">Destinos: Guatapé y Santa Marta</div></div>
</div>
""" + s[b3:]
# sin la animación 3D del dron que se desarma
a3 = s.index('<!-- ══ DRONE SECTION ══ -->'); b3 = s.index('<!-- ── NOSOTROS ── -->')
s = s[:a3] + s[b3:]
a3 = s.index('<script type="importmap">'); b3 = s.index('</script>', a3) + len('</script>')
s = s[:a3] + s[b3:]
s = rep(s, "import * as THREE from 'three';\nimport { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';\n", '')
a3 = s.index('// ── Three.js Drone'); b3 = s.index('// ── Loader helpers')
s = s[:a3] + s[b3:]
s = rep(s, "initThree();\nsetupVideoHero();\nwindow.addEventListener('load', () => { if (!droneModel) finishLoading(); });",
        "setupVideoHero();\nwindow.addEventListener('load', finishLoading);\nsetTimeout(finishLoading, 2500);")

# idioma: avisar al resto de la página cuando cambia
s = rep(s, "  if (btn) btn.textContent = lang === 'es' ? 'EN' : 'ES';\n}",
        "  if (btn) btn.textContent = lang === 'es' ? 'EN' : 'ES';\n  document.documentElement.lang = lang;\n  document.dispatchEvent(new CustomEvent('fv23lang', { detail: lang }));\n}")

import hashlib
for f in ['js/config.js', 'js/precios.js', 'js/fv23.js']:
    h = hashlib.md5((root / f).read_bytes()).hexdigest()[:8]
    s = rep(s, f'<script src="{f}"></script>', f'<script src="{f}?v={h}"></script>')
(root / 'index.html').write_text(s)
print('ok', len(s), 'bytes')

# script de Google con la misma tabla de precios y el logo incrustado
import base64
gs = (root / 'apps-script' / 'Code.template.gs').read_text()
gs = gs.replace('{{PRECIOS}}', (root / 'js' / 'precios.js').read_text())
gs = gs.replace('{{LOGO}}', base64.b64encode((root / 'logo-fv23-256.png').read_bytes()).decode())
(root / 'apps-script' / 'Code.gs').write_text(gs)
print('apps-script/Code.gs', len(gs), 'bytes')
