"""Capturas de revisión: python3 _build/shots.py <carpeta> [ancho]"""
import sys
from playwright.sync_api import sync_playwright
from PIL import Image
S = sys.argv[1]; W = int(sys.argv[2]) if len(sys.argv) > 2 else 390
H = 844 if W < 600 else 900
SECS = ['#about', '#trabajo', '#experiencias', '#detras', '#comunidad', '#contact']
with sync_playwright() as pw:
    b = pw.chromium.launch()
    pg = b.new_page(viewport={'width': W, 'height': H}, device_scale_factor=1)
    errs = []
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.on('console', lambda m: m.type == 'error' and errs.append(m.text))
    pg.goto('http://localhost:8765/index.html', wait_until='domcontentloaded'); pg.wait_for_timeout(5000)
    pg.add_style_tag(content='#loader{display:none!important}[data-r],.reveal-scale{opacity:1!important;transform:none!important}')
    for i, sel in enumerate(SECS):
        y = pg.evaluate(f"document.querySelector('{sel}').getBoundingClientRect().top+scrollY")
        pg.evaluate(f"scrollTo(0,{y})"); pg.wait_for_timeout(1200)
        pg.screenshot(path=f'{S}/s{W}_{i}.png')
    print('ancho documento', pg.evaluate('document.documentElement.scrollWidth'), 'errores', errs[:6])
    b.close()
ims = [Image.open(f'{S}/s{W}_{i}.png') for i in range(len(SECS))]
sc = 390 / W if W > 600 else 1
ims = [im.resize((int(im.width * sc), int(im.height * sc))) for im in ims]
cols = 3 if W > 600 else 6
w, h = ims[0].size
c = Image.new('RGB', (cols * (w + 10), ((len(ims) + cols - 1) // cols) * (h + 10)), 'white')
for i, im in enumerate(ims):
    c.paste(im, ((i % cols) * (w + 10), (i // cols) * (h + 10)))
c.save(f'{S}/sheet{W}.jpg', quality=80)
