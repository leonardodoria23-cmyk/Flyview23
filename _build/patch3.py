"""19-oct (mañana): Jetski Básico, reseñas en carrusel, mensaje para Luz Marina y versículo diario."""
import pathlib, re
root = pathlib.Path(__file__).resolve().parent.parent
p = root / '_build' / 'sections.html'; s = p.read_text()

def rep(a, b):
    global s
    assert a in s, a[:80]; s = s.replace(a, b, 1)

# 1. Jetski Básico con su foto real
rep('<img src="media/img/fly-legend/fly-legend-02.jpg" alt="Jetski en el embalse de Guatapé visto desde el dron"',
    '<img src="media/img/jetski-basico.jpg" alt="Jetski Básico amarillo frente a La Piedra del Peñol"')

# 2. Reseñas: carrusel que pasa solo
a = s.index('    <div class="x-rev-grid">'); b = s.index('    </div>\n  </div>\n</section>', a)
cards = re.findall(r'      <figure class="x-rev" data-r>.*?</figure>', s[a:b])
cards = [c.replace(' data-r>', '>', 1) for c in cards]
extra = ('      <figure class="x-rev"><div class="x-stars" aria-label="5 estrellas">★★★★★</div>'
         '<blockquote data-es="Video hermoso y un servicio excelente, muy confiable." data-en="Beautiful video and excellent, very reliable service.">'
         'Video hermoso y un servicio excelente, muy confiable.</blockquote><figcaption>Google</figcaption></figure>')
cards.insert(2, extra)
s = s[:a] + ('    <div class="x-rev-car" data-r>\n      <div class="x-rev-track" id="x-rev-track" tabindex="0" aria-label="Reseñas de clientes en Google">\n'
             + '\n'.join('  ' + c for c in cards) +
             '\n      </div>\n      <div class="x-rev-dots" id="x-rev-dots" aria-hidden="true"></div>\n    </div>\n') + s[b:]

# 3. Pie: mensaje para Luz Marina y versículo del día
rep('''    <div class="footer-bot">
      <div class="footer-copy">© 2026 Flyview23 · Guatapé · Santa Marta · Colombia</div>
    </div>''', '''    <div class="x-faith">
      <figure class="x-verse" aria-live="polite">
        <blockquote id="x-verse-txt"></blockquote>
        <figcaption id="x-verse-ref"></figcaption>
      </figure>
      <div class="x-mom">
        <span class="x-mom-23" aria-hidden="true">23</span>
        <p data-es="El 23 de Flyview23 es por mi madre, Luz Marina, que partió un 23 de febrero de 2013. Ella me enseñó que los momentos se van, pero los recuerdos se quedan. Cada video que hacemos lleva un poco de ella." data-en="The 23 in Flyview23 is for my mother, Luz Marina, who passed away on February 23, 2013. She taught me that moments pass, but memories stay. Every video we make carries a little of her.">El 23 de Flyview23 es por mi madre, Luz Marina, que partió un 23 de febrero de 2013. Ella me enseñó que los momentos se van, pero los recuerdos se quedan. Cada video que hacemos lleva un poco de ella.</p>
        <span class="x-mom-sign">— Leonardo · 🩵</span>
      </div>
    </div>
    <div class="footer-bot">
      <div class="footer-copy">© 2026 Flyview23 · Guatapé · Santa Marta · Colombia</div>
    </div>''')
p.write_text(s)

# ---------- estilos ----------
c = root / '_build' / 'extra.css'
c.write_text(c.read_text() + '''
/* reseñas en carrusel */
.x-rev-car{position:relative;}
.x-rev-track{display:grid;grid-auto-flow:column;grid-auto-columns:calc((100% - 28px)/3);gap:14px;overflow-x:auto;scroll-snap-type:x mandatory;scroll-behavior:smooth;scrollbar-width:none;padding-bottom:4px;}
.x-rev-track::-webkit-scrollbar{display:none;}
.x-rev-track .x-rev{scroll-snap-align:start;}
.x-rev-track:focus-visible{outline:2px solid var(--accent);outline-offset:6px;border-radius:18px;}
.x-rev-dots{display:flex;justify-content:center;gap:8px;margin-top:20px;}
.x-rev-dots i{width:8px;height:8px;border-radius:50%;background:rgba(255,255,255,.22);transition:all .3s;}
.x-rev-dots i.on{width:24px;border-radius:8px;background:var(--accent);}
@media(max-width:1100px){.x-rev-track{grid-auto-columns:calc((100% - 14px)/2);}}
@media(max-width:768px){.x-rev-track{grid-auto-columns:88%;}}

/* fe y homenaje */
.x-faith{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:28px 56px;padding:36px 0;border-top:1px solid var(--line);margin-top:8px;}
.x-verse{margin:0;max-width:520px;}
.x-verse blockquote{margin:0 0 8px;font-size:15px;line-height:1.65;font-style:italic;color:#d9d9d9;}
.x-verse figcaption{font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--accent);}
.x-mom{position:relative;padding-left:64px;max-width:520px;}
.x-mom-23{position:absolute;left:0;top:-4px;font-family:var(--display);font-size:2.6rem;line-height:1;color:var(--accent);}
.x-mom p{font-size:14px;line-height:1.7;color:var(--text2);margin:0 0 6px;}
.x-mom-sign{font-size:13px;color:#cfe8ff;}
@media(max-width:768px){.x-faith{grid-template-columns:minmax(0,1fr);}}
''')

# ---------- script: carrusel y versículo ----------
j = root / 'js' / 'fv23.js'; t = j.read_text()
VERSES = [
 ('De Jehová es la tierra y su plenitud; el mundo, y los que en él habitan.', "The earth is the Lord's, and the fulness thereof; the world, and they that dwell therein.", 'Salmo 24:1', 'Psalm 24:1'),
 ('Los cielos cuentan la gloria de Dios, y el firmamento anuncia la obra de sus manos.', 'The heavens declare the glory of God; and the firmament sheweth his handywork.', 'Salmo 19:1', 'Psalm 19:1'),
 ('Encomienda a Jehová tus obras, y tus pensamientos serán afirmados.', 'Commit thy works unto the Lord, and thy thoughts shall be established.', 'Proverbios 16:3', 'Proverbs 16:3'),
 ('Acuérdate de Jehová tu Dios, porque él te da el poder para hacer las riquezas.', 'Remember the Lord thy God: for it is he that giveth thee power to get wealth.', 'Deuteronomio 8:18', 'Deuteronomy 8:18'),
 ('No a nosotros, oh Jehová, no a nosotros, sino a tu nombre da gloria, por tu misericordia, por tu verdad.', 'Not unto us, O Lord, not unto us, but unto thy name give glory, for thy mercy, and for thy truth\'s sake.', 'Salmo 115:1', 'Psalm 115:1'),
 ('Los que esperan a Jehová tendrán nuevas fuerzas; levantarán alas como las águilas; correrán, y no se cansarán; caminarán, y no se fatigarán.', 'They that wait upon the Lord shall renew their strength; they shall mount up with wings as eagles; they shall run, and not be weary; and they shall walk, and not faint.', 'Isaías 40:31', 'Isaiah 40:31'),
 ('Todo lo puedo en Cristo que me fortalece.', 'I can do all things through Christ which strengtheneth me.', 'Filipenses 4:13', 'Philippians 4:13'),
 ('Mira que te mando que te esfuerces y seas valiente; no temas ni desmayes, porque Jehová tu Dios estará contigo en dondequiera que vayas.', 'Be strong and of a good courage; be not afraid, neither be thou dismayed: for the Lord thy God is with thee whithersoever thou goest.', 'Josué 1:9', 'Joshua 1:9'),
 ('Encomienda a Jehová tu camino, y confía en él; y él hará.', 'Commit thy way unto the Lord; trust also in him; and he shall bring it to pass.', 'Salmo 37:5', 'Psalm 37:5'),
 ('Fíate de Jehová de todo tu corazón, y no te apoyes en tu propia prudencia. Reconócelo en todos tus caminos, y él enderezará tus veredas.', 'Trust in the Lord with all thine heart; and lean not unto thine own understanding. In all thy ways acknowledge him, and he shall direct thy paths.', 'Proverbios 3:5-6', 'Proverbs 3:5-6'),
 ('Este es el día que hizo Jehová; nos gozaremos y alegraremos en él.', 'This is the day which the Lord hath made; we will rejoice and be glad in it.', 'Salmo 118:24', 'Psalm 118:24'),
 ('¡Oh Jehová, Señor nuestro, cuán glorioso es tu nombre en toda la tierra!', 'O Lord our Lord, how excellent is thy name in all the earth!', 'Salmo 8:1', 'Psalm 8:1'),
 ('Y todo lo que hagáis, hacedlo de corazón, como para el Señor y no para los hombres.', 'And whatsoever ye do, do it heartily, as to the Lord, and not unto men.', 'Colosenses 3:23', 'Colossians 3:23'),
 ('Tuya es, oh Jehová, la magnificencia y el poder, la gloria, la victoria y el honor; porque todas las cosas que están en los cielos y en la tierra son tuyas.', 'Thine, O Lord, is the greatness, and the power, and the glory, and the victory, and the majesty: for all that is in the heaven and in the earth is thine.', '1 Crónicas 29:11', '1 Chronicles 29:11'),
 ('Jehová es mi pastor; nada me faltará.', 'The Lord is my shepherd; I shall not want.', 'Salmo 23:1', 'Psalm 23:1'),
 ('Mas buscad primeramente el reino de Dios y su justicia, y todas estas cosas os serán añadidas.', 'But seek ye first the kingdom of God, and his righteousness; and all these things shall be added unto you.', 'Mateo 6:33', 'Matthew 6:33'),
 ('Dios es nuestro amparo y fortaleza, nuestro pronto auxilio en las tribulaciones.', 'God is our refuge and strength, a very present help in trouble.', 'Salmo 46:1', 'Psalm 46:1'),
 ('Alzaré mis ojos a los montes; ¿de dónde vendrá mi socorro? Mi socorro viene de Jehová, que hizo los cielos y la tierra.', 'I will lift up mine eyes unto the hills, from whence cometh my help. My help cometh from the Lord, which made heaven and earth.', 'Salmo 121:1-2', 'Psalm 121:1-2'),
 ('Toda buena dádiva y todo don perfecto desciende de lo alto, del Padre de las luces.', 'Every good gift and every perfect gift is from above, and cometh down from the Father of lights.', 'Santiago 1:17', 'James 1:17'),
 ('Todo lo que respira alabe a JAH. Aleluya.', 'Let every thing that hath breath praise the Lord. Praise ye the Lord.', 'Salmo 150:6', 'Psalm 150:6'),
 ('No temas, porque yo estoy contigo; no desmayes, porque yo soy tu Dios que te esfuerzo.', 'Fear thou not; for I am with thee: be not dismayed; for I am thy God: I will strengthen thee.', 'Isaías 41:10', 'Isaiah 41:10'),
 ('Gustad, y ved que es bueno Jehová; dichoso el hombre que confía en él.', 'O taste and see that the Lord is good: blessed is the man that trusteth in him.', 'Salmo 34:8', 'Psalm 34:8'),
 ('Por la misericordia de Jehová no hemos sido consumidos, porque nunca decayeron sus misericordias. Nuevas son cada mañana; grande es tu fidelidad.', "It is of the Lord's mercies that we are not consumed, because his compassions fail not. They are new every morning: great is thy faithfulness.", 'Lamentaciones 3:22-23', 'Lamentations 3:22-23'),
 ('Yo soy el camino, y la verdad, y la vida.', 'I am the way, the truth, and the life.', 'Juan 14:6', 'John 14:6'),
 ('Y sabemos que a los que aman a Dios, todas las cosas les ayudan a bien.', 'And we know that all things work together for good to them that love God.', 'Romanos 8:28', 'Romans 8:28'),
 ('Sea la luz de Jehová nuestro Dios sobre nosotros, y la obra de nuestras manos confirma sobre nosotros.', 'Let the beauty of the Lord our God be upon us: and establish thou the work of our hands upon us.', 'Salmo 90:17', 'Psalm 90:17'),
]
import json
block = '''
  /* ── versículo del día (cambia cada mañana, hora de Colombia) ── */
  var VERSOS = ''' + json.dumps(VERSES, ensure_ascii=False) + ''';
  function verso() {
    var te = $('#x-verse-txt'), re = $('#x-verse-ref'); if (!te) return;
    var co = new Date(Date.now() - 5 * 3600e3);
    var dia = Math.floor(Date.UTC(co.getUTCFullYear(), co.getUTCMonth(), co.getUTCDate()) / 864e5);
    var v = VERSOS[dia % VERSOS.length], en = L() === 'en';
    te.textContent = '“' + (en ? v[1] : v[0]) + '”';
    re.textContent = (en ? v[3] : v[2]) + (en ? ' · KJV' : ' · RVR1960');
  }
  verso();
  document.addEventListener('fv23lang', verso);

  /* ── reseñas en carrusel: pasan solas, se pueden deslizar ── */
  (function () {
    var tr = $('#x-rev-track'), dots = $('#x-rev-dots'); if (!tr) return;
    var cards = $$('.x-rev', tr), timer = null, idx = 0;
    var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    dots.innerHTML = cards.map(function () { return '<i></i>'; }).join('');
    var ds = $$('i', dots);
    function perView() { return Math.max(1, Math.round(tr.clientWidth / cards[0].getBoundingClientRect().width)); }
    function mark() {
      var w = cards[0].getBoundingClientRect().width + 14;
      idx = Math.round(tr.scrollLeft / w);
      ds.forEach(function (d, i) { d.classList.toggle('on', i === idx); });
    }
    function go(i) {
      var last = cards.length - perView();
      if (i > last) i = 0;
      tr.scrollTo({ left: cards[i].offsetLeft - cards[0].offsetLeft, behavior: reduce ? 'auto' : 'smooth' });
    }
    function start() { if (reduce || timer) return; timer = setInterval(function () { go(idx + 1); }, 4500); }
    function stop() { clearInterval(timer); timer = null; }
    tr.addEventListener('scroll', function () { window.requestAnimationFrame(mark); }, { passive: true });
    ['mouseenter', 'touchstart', 'focusin'].forEach(function (e) { tr.addEventListener(e, stop, { passive: true }); });
    ['mouseleave', 'touchend', 'focusout'].forEach(function (e) { tr.addEventListener(e, function () { setTimeout(start, 3000); }, { passive: true }); });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) { es[0].isIntersecting ? start() : stop(); }, { threshold: 0.3 }).observe(tr);
    } else start();
    mark();
  })();
'''
anchor = '  /* ── comunidad ── */'
assert anchor in t
t = t.replace(anchor, block + '\n' + anchor, 1)
j.write_text(t)
print('ok', len(cards), 'reseñas')
