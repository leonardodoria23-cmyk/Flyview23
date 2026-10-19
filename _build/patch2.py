"""Ajustes del 19-oct: números, reseñas, logo oficial, ícono, jetskis, video de inicio y versión de scripts."""
import pathlib
root = pathlib.Path(__file__).resolve().parent.parent
GMAPS = 'https://www.google.com/maps/place/?q=place_id:ChIJo6lnKyr19I4ReKrvMCFCn3c'

# ---------- build.py ----------
p = root / '_build' / 'build.py'; s = p.read_text()
def rep(a, b):
    global s
    assert a in s, a[:80]; s = s.replace(a, b, 1)

# quitar reemplazos viejos que ahora se hacen en un bloque
rep("""s = rep(s, '<span class="vhs-l" data-es="Ventas" data-en="Sales">Ventas</span>', '<span class="vhs-l" data-es="Recuerdos" data-en="Memories">Recuerdos</span>')
s = rep(s, 'data-es="Ventas en Bahía Santa Marta" data-en="Sales in Santa Marta Bay">Ventas en Bahía Santa Marta', 'data-es="Recuerdos entregados" data-en="Memories delivered">Recuerdos entregados')
s = rep(s, 'data-es="Entrega máxima" data-en="Max. delivery time">Entrega máxima', 'data-es="Tu video editado" data-en="Your edited video">Tu video editado')
""", "")
rep("""s = rep(s, '<span class="vhs-n">3<span>+</span></span><span class="vhs-l" data-es="Años" data-en="Years">Años</span>', '<span class="vhs-n">5<span>+</span></span><span class="vhs-l" data-es="Años" data-en="Years">Años</span>')
s = rep(s, '<div class="stat-n" id="cnt-years">3<span>+</span></div>', '<div class="stat-n" id="cnt-years">5<span>+</span></div>')
""", '''# números del inicio y de la franja
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
a3 = s.index('<div class="stats-bar">'); b3 = s.index('</div>\\n', s.index('Entrega máxima', a3)) + 7
s = s[:a3] + """<div class="stats-bar">
  <div class="stat-item" data-r><div class="stat-n" id="cnt-sales">70<span>K+</span></div><div class="stat-l" data-es="Recuerdos entregados" data-en="Memories delivered">Recuerdos entregados</div></div>
  <div class="stat-item" data-r><div class="stat-n" id="cnt-years">5<span>+</span></div><div class="stat-l" data-es="Años creando recuerdos" data-en="Years creating memories">Años creando recuerdos</div></div>
  <div class="stat-item" data-r><a class="x-stat-link" href="''' + GMAPS + '''" target="_blank" rel="noopener"><div class="stat-n">5<span>.0★</span></div><div class="stat-l" data-es="62 reseñas en Google" data-en="62 Google reviews">62 reseñas en Google</div></a></div>
  <div class="stat-item" data-r><div class="stat-n">2</div><div class="stat-l" data-es="Destinos: Guatapé y Santa Marta" data-en="Destinations: Guatapé &amp; Santa Marta">Destinos: Guatapé y Santa Marta</div></div>
</div>
""" + s[b3:]
''')
# logo oficial y favicon
rep('<img src="logo-fv23.svg" alt="" width="34" height="34">', '<img src="logo-fv23-64.png" alt="" width="34" height="34">')
rep("s = rep(s, '<title>FLYVIEW23", """s = rep(s, '<link rel="icon" type="image/x-icon" href="favicon.ico">', '<link rel="icon" type="image/x-icon" href="favicon.ico?v=2">\\n<link rel="icon" type="image/png" sizes="192x192" href="icon-192.png">\\n<link rel="apple-touch-icon" href="apple-touch-icon.png">\\n<meta name="theme-color" content="#000000">')
s = rep(s, '<title>FLYVIEW23""")
gs_logo = "gs = gs.replace('{{LOGO}}', base64.b64encode((root / 'logo-fv23.png').read_bytes()).decode())"
rep(gs_logo, "gs = gs.replace('{{LOGO}}', base64.b64encode((root / 'logo-fv23-256.png').read_bytes()).decode())")
# video de inicio: que no se quede quieto y fondo más oscuro para leer el texto
rep("# años: 5+", """s = rep(s, "  const tryPlay = () => {", "  vid.addEventListener('canplay', () => { if (vid.paused) tryPlay(); }, { once: true });\\n  ['touchstart', 'click', 'scroll'].forEach(ev => window.addEventListener(ev, () => { if (vid.paused) vid.play().then(() => { if (fallback) fallback.style.display = 'none'; }).catch(() => {}); }, { once: true, passive: true }));\\n  const tryPlay = () => {")
s = rep(s, 'filter:contrast(1.08) saturate(0.88) brightness(0.82);', 'filter:contrast(1.08) saturate(0.9) brightness(0.55);')
# años: 5+""")
# versión de los scripts para que el celular no use la copia vieja
rep("(root / 'index.html').write_text(s)", """import hashlib
for f in ['js/config.js', 'js/precios.js', 'js/fv23.js']:
    h = hashlib.md5((root / f).read_bytes()).hexdigest()[:8]
    s = rep(s, f'<script src="{f}"></script>', f'<script src="{f}?v={h}"></script>')
(root / 'index.html').write_text(s)""")
p.write_text(s)

# ---------- sections.html ----------
p = root / '_build' / 'sections.html'; s = p.read_text()
rep('<img class="x-logo-foot" src="logo-fv23.svg" alt="Flyview23" width="72" height="72">',
    '<img class="x-logo-foot" src="logo-fv23-256.png" alt="Flyview23" width="72" height="72">')
rep('<div><b>10K+</b><span data-es="Recuerdos entregados"', '<div><b>70K+</b><span data-es="Recuerdos entregados"')
# jetskis: la foto del "Básico" era del Premium
rep('<img src="media/img/fly-pro/fly-pro-04.jpg" alt="Jetski Básico en el embalse de Guatapé"',
    '<img src="media/img/fly-legend/fly-legend-02.jpg" alt="Jetski en el embalse de Guatapé visto desde el dron"')
rep('<img src="media/img/fly-legend/fly-legend-05.jpg" alt="Jetski Premium frente a La Piedra del Peñol"',
    '<img src="media/img/fly-pro/fly-pro-04.jpg" alt="Jetski Premium en el embalse de Guatapé"')
# reseñas de Google
REV = [
    ('Un servicio maravilloso, nos encantó el video. Gracias por un recuerdo tan bonito que mi mamá y yo nos llevamos a Medellín.',
     'Wonderful service, we loved the video. Thank you for such a lovely memory that my mother and I will take back to Medellín.'),
    ('Una excelente experiencia. Quedé encantada con las fotos y los videos. Se nota la dedicación, la calidad es muy buena y la atención fue muy amable y profesional.',
     'An excellent experience. I was delighted with the photos and videos. The dedication shows, the quality is great and the service was friendly and professional.'),
    ('Un recuerdo excelente en video con dron. Tendremos estos momentos para mirarlos y compartirlos el resto de nuestras vidas.',
     'An excellent memory captured on drone video. We will have these moments to look back on and share for the rest of our lives.'),
    ('¡Video hermoso! El servicio, ¡todo! Me encantó. 100 % recomendado.',
     'Beautiful video! The service, everything! I loved it. 100% recommended.'),
]
cards = '\n'.join(f'      <figure class="x-rev" data-r><div class="x-stars" aria-label="5 estrellas">★★★★★</div><blockquote data-es="{es}" data-en="{en}">{es}</blockquote><figcaption>Google</figcaption></figure>' for es, en in REV)
section = f'''<!-- ── RESEÑAS ── -->
<section class="x-reviews section-pad" id="resenas">
  <div class="sec-wrap">
    <div class="x-head">
      <div>
        <div class="sec-eyebrow" data-r data-es="Lo que dicen en Google" data-en="What people say on Google">Lo que dicen en Google</div>
        <h2 class="x-display" data-r>5.0 ★ <span class="x-rev-count" data-es="· 62 reseñas" data-en="· 62 reviews">· 62 reseñas</span></h2>
      </div>
      <a class="x-btn-ghost" data-r href="{GMAPS}" target="_blank" rel="noopener" data-es="Ver todas en Google" data-en="See them all on Google">Ver todas en Google</a>
    </div>
    <div class="x-rev-grid">
{cards}
    </div>
  </div>
</section>

'''
rep('<!-- ── PREMIUM ── -->', section + '<!-- ── PREMIUM ── -->')
p.write_text(s)

# ---------- estilos ----------
p = root / '_build' / 'extra.css'
p.write_text(p.read_text() + '''
/* reseñas y franja de números */
.x-reviews{background:var(--bg);}
.x-rev-count{color:var(--text2);font-size:.55em;}
.x-rev-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px;}
.x-rev{margin:0;background:var(--bg3);border:1px solid var(--line);border-radius:18px;padding:24px;display:flex;flex-direction:column;gap:12px;}
.x-stars{color:#FBBC04;font-size:16px;letter-spacing:2px;}
.x-rev blockquote{margin:0;font-size:15px;line-height:1.6;color:#e8e8e8;flex:1;}
.x-rev figcaption{font-size:12px;color:var(--text2);font-weight:600;letter-spacing:1px;}
.x-stat-link{color:inherit;text-decoration:none;display:block;}
.x-nav-logo img{border-radius:50%;}
@media(max-width:1100px){.x-rev-grid{grid-template-columns:repeat(2,minmax(0,1fr));}}
@media(max-width:768px){.x-rev-grid{grid-template-columns:minmax(0,1fr);}}
''')
print('ok')
