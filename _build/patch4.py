"""Blindaje: CSP en la página, archivos internos fuera del buscador, anti-spam y límites en el script de Google."""
import pathlib
root = pathlib.Path(__file__).resolve().parent.parent

CSP = ("default-src 'self'; "
       "script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://*.crisp.chat; "
       "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://*.crisp.chat; "
       "font-src 'self' data: https://fonts.gstatic.com https://*.crisp.chat; "
       "img-src 'self' data: blob: https:; "
       "media-src 'self' blob: https://*.crisp.chat; "
       "connect-src 'self' https://script.google.com https://script.googleusercontent.com https://*.crisp.chat wss://*.crisp.chat; "
       "frame-src https://*.crisp.chat; "
       "worker-src 'self' blob:; "
       "object-src 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests")

# ---------- build.py: cabeceras de seguridad dentro de la página ----------
p = root / '_build' / 'build.py'; s = p.read_text()
old = "s = rep(s, '<title>FLYVIEW23"
assert old in s
s = s.replace(old, """s = rep(s, '<meta name="viewport" content="width=device-width,initial-scale=1">', '<meta name="viewport" content="width=device-width,initial-scale=1">\\n<meta http-equiv="Content-Security-Policy" content="__CSP__">\\n<meta name="referrer" content="strict-origin-when-cross-origin">')
s = rep(s, '<title>FLYVIEW23""".replace('__CSP__', CSP), 1)
p.write_text(s)

# ---------- _headers (si algún día se usa Cloudflare Pages/Netlify) ----------
h = root / '_headers'
h.write_text(f"""/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()
  Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
  Cross-Origin-Opener-Policy: same-origin
  Content-Security-Policy: {CSP}; frame-ancestors 'none'

/_build/*
  X-Robots-Tag: noindex
/apps-script/*
  X-Robots-Tag: noindex
""")

# ---------- robots y sitemap ----------
(root / 'robots.txt').write_text("User-agent: *\nAllow: /\nDisallow: /_build/\nDisallow: /apps-script/\nSitemap: https://flyview23.com/sitemap.xml\n")
(root / 'sitemap.xml').write_text("""<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://flyview23.com/</loc>
    <lastmod>2026-10-19</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
""")

# ---------- formularios: campo trampa para robots ----------
p = root / '_build' / 'sections.html'; s = p.read_text()
trap = '<label class="x-hp" aria-hidden="true">No llenar<input name="web" tabindex="-1" autocomplete="off"></label>'
old = '      <button class="x-btn x-btn-lg" type="submit" data-es="Quiero unirme"'
if old in s:
    s = s.replace(old, '      ' + trap + '\n' + old, 1)
p.write_text(s)
c = root / '_build' / 'extra.css'
c.write_text(c.read_text() + '\n.x-hp{position:absolute!important;left:-9999px!important;width:1px;height:1px;overflow:hidden;}\n')

j = root / 'js' / 'fv23.js'; t = j.read_text()
def rj(a, b):
    global t
    assert a in t, a[:70]; t = t.replace(a, b, 1)
rj("""'<p class="x-form-msg" role="status" aria-live="polite"></p><div class="x-bk-actions">'""",
   """'<label class="x-hp" aria-hidden="true">No llenar<input name="web" tabindex="-1" autocomplete="off"></label>' +
        '<p class="x-form-msg" role="status" aria-live="polite"></p><div class="x-bk-actions">'""")
# robot detectado: no se envía nada
rj("    var msg = $('.x-form-msg', form);\n    if (!validate(form))",
   "    var msg = $('.x-form-msg', form);\n    if (form.web && form.web.value) return;\n    if (!validate(form))")
rj("    var msg = $('.x-form-msg', club);\n    if (!validate(club))",
   "    var msg = $('.x-form-msg', club);\n    if (club.web && club.web.value) return;\n    if (!validate(club))")
j.write_text(t)

# ---------- script de Google: anti-spam y límites ----------
g = root / 'apps-script' / 'Code.template.gs'; t = g.read_text()
rj("""    var d = JSON.parse(e.postData.contents);
    var r;""", """    if (!e || !e.postData || e.postData.contents.length > 20000) throw new Error('solicitud no válida');
    var d = JSON.parse(e.postData.contents);
    if (d.datos && d.datos.web) return json_({ ok: true });          // robot: se ignora en silencio
    limite_(d);
    var r;""")
rj("""/* ===== Utilidades ===== */""", """/* ===== Límites contra abuso ===== */
function limite_(d) {
  var cache = CacheService.getScriptCache();
  var tel = soloDigitos_((d.datos && d.datos.whatsapp) || '');
  var mail = String((d.datos && d.datos.correo) || '').toLowerCase();
  [['g', 60], ['t' + tel, 5], ['m' + mail, 5]].forEach(function (k) {
    if (k[0].length < 2) return;
    var n = parseInt(cache.get(k[0]), 10) || 0;
    if (n >= k[1]) throw new Error('demasiadas solicitudes, intenta más tarde');
    cache.put(k[0], String(n + 1), 3600);
  });
  if (d.sel) {
    d.sel.qty = Math.min(12, Math.max(1, parseInt(d.sel.qty, 10) || 1));
    d.sel.horas = Math.min(8, Math.max(1, parseInt(d.sel.horas, 10) || 1));
    d.sel.deco = d.sel.deco === true;
  }
  if (d.datos && d.datos.fecha) {
    var f = new Date(d.datos.fecha + 'T12:00:00-05:00'), hoy = new Date();
    if (isNaN(f) || f < new Date(hoy.getTime() - 864e5) || f > new Date(hoy.getTime() + 400 * 864e5)) throw new Error('fecha fuera de rango');
  }
}

/* ===== Utilidades ===== */""")
g.write_text(t)
print('ok')
