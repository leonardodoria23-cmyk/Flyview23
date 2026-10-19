"""Genera el HTML de la cuadrícula 'Nuestro trabajo'."""
import json, pathlib, html

root = pathlib.Path(__file__).resolve().parent.parent
photos = json.loads((root / '_build' / 'photos.json').read_text())

VIDEOS = [
    ('fly-legend-1', 'jetski', 'Fly Legend · La Piedra', 'Fly Legend · La Piedra'),
    ('pedida-guatape', 'celebraciones', 'Pedida de mano · Guatapé', 'Proposal · Guatapé'),
    ('planchon-1', 'embalse celebraciones', 'Cumpleaños en planchón', 'Birthday on a pontoon'),
    ('quince-2', 'celebraciones santa-marta', 'Quinceañera · Santa Marta', 'Quinceañera · Santa Marta'),
    ('jetcar', 'embalse', 'Jetcar', 'Jetcar'),
    ('fly-pro', 'jetski', 'Fly Pro', 'Fly Pro'),
    ('wakeboard-dron-1', 'embalse', 'Wakeboard desde el dron', 'Wakeboard from the drone'),
    ('fly-legend-3', 'jetski', 'Fly Legend', 'Fly Legend'),
    ('lancha-1', 'embalse', 'Paseo en lancha', 'Boat ride'),
    ('quince-1', 'celebraciones santa-marta', 'Quinceañera · Santa Marta', 'Quinceañera · Santa Marta'),
    ('fly-legend-2', 'jetski', 'Fly Legend', 'Fly Legend'),
    ('wakeboard-1', 'embalse', 'Wakeboard', 'Wakeboard'),
    ('planchon-dron', 'embalse', 'Planchón desde el dron', 'Pontoon from the drone'),
    ('fly-start', 'jetski', 'Fly Start · sin editar', 'Fly Start · unedited'),
    ('wakeboard-dron-2', 'embalse', 'Wakeboard desde el dron', 'Wakeboard from the drone'),
]
# álbumes: (clave en photos.json, portada, categorías, nombre es, nombre en)
ALBUMS = [
    (['fly-legend'], 'fly-legend/fly-legend-07', 'jetski fotografia', 'Fotos Fly Legend', 'Fly Legend photos'),
    (['pueblo'], 'pueblo/pueblo-03', 'fotografia', 'Sesión en el pueblo', 'Town photo session'),
    (['santa-marta', 'quinceanera'], 'santa-marta/santa-marta-09', 'santa-marta fotografia', 'Fotos en Santa Marta', 'Santa Marta photos'),
    (['fly-pro'], 'fly-pro/fly-pro-02', 'jetski fotografia', 'Fotos Fly Pro +', 'Fly Pro + photos'),
    (['polaroid'], 'polaroid/polaroid-02', 'santa-marta celebraciones fotografia', 'Fotos instantáneas', 'Instant photos'),
    (['embalse'], 'embalse/embalse-03', 'embalse fotografia', 'Lancha y planchón', 'Boats'),
]
PLAY = '<span class="x-play" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></span>'
CAM = '<span class="x-alb-ic" aria-hidden="true"><svg viewBox="0 0 24 24"><rect x="3" y="6" width="18" height="14" rx="3"/><circle cx="12" cy="13" r="4"/><path d="M8 6l2-3h4l2 3"/></svg></span>'
vtiles = []
for ident, cats, es, en in VIDEOS:
    t_es, t_en = html.escape(es), html.escape(en)
    vtiles.append(
        f'      <button class="x-tile x-tile-v" data-cat="{cats}" data-type="video" data-full="media/video/{ident}.mp4" '
        f'data-title-es="{t_es}" data-title-en="{t_en}" aria-label="{t_es}">'
        f'<video class="x-autoplay" muted loop playsinline preload="none" poster="media/video/{ident}.jpg">'
        f'<source src="media/video/{ident}-preview.mp4" type="video/mp4"></video>'
        f'{PLAY}<span class="x-tile-cap" data-es="{t_es}" data-en="{t_en}">{t_es}</span></button>')
atiles = []
for keys, cover, cats, es, en in ALBUMS:
    srcs = [p['src'] for k in keys for p in photos[k]]
    t_es, t_en = html.escape(es), html.escape(en)
    n = len(srcs)
    atiles.append(
        f'      <button class="x-tile x-tile-alb" data-cat="{cats}" data-type="album" data-photos="{"|".join(srcs)}" '
        f'data-title-es="{t_es}" data-title-en="{t_en}" aria-label="{t_es}, {n} fotos">'
        f'<img src="media/img/{cover}.jpg" alt="" loading="lazy">{CAM}'
        f'<span class="x-tile-cap"><span data-es="{t_es}" data-en="{t_en}">{t_es}</span>'
        f'<small data-es="{n} fotos" data-en="{n} photos">{n} fotos</small></span></button>')
# intercalar: 2 videos, 1 álbum
out = []
vi = iter(vtiles); ai = iter(atiles)
for k in range(len(vtiles) + len(atiles)):
    nxt = next(ai, None) if k % 3 == 2 else next(vi, None)
    if nxt is None:
        nxt = next(vi, None) or next(ai, None)
    if nxt: out.append(nxt)
html_out = '\n'.join(out)
print(len(out), 'items')
