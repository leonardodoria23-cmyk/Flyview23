"""Genera el HTML de la cuadrícula 'Nuestro trabajo'."""
import json, pathlib, html

root = pathlib.Path(__file__).resolve().parent.parent
photos = json.loads((root / '_build' / 'photos.json').read_text())

# (tipo, id, categorías, título es, título en)
ITEMS = [
    ('v', 'fly-legend-1', 'jetski', 'Fly Legend · La Piedra', 'Fly Legend · La Piedra'),
    ('v', 'pedida-guatape', 'celebraciones', 'Pedida de mano · Guatapé', 'Proposal · Guatapé'),
    ('v', 'planchon-1', 'embalse celebraciones', 'Cumpleaños en planchón', 'Birthday on a pontoon'),
    ('v', 'quince-2', 'celebraciones santa-marta', 'Quinceañera · Santa Marta', 'Quinceañera · Santa Marta'),
    ('v', 'jetcar', 'embalse', 'Jetcar', 'Jetcar'),
    ('v', 'fly-legend-3', 'jetski', 'Fly Legend', 'Fly Legend'),
    ('ig', 'DW37z0fjezj', 'celebraciones santa-marta', 'Pedida de mano · Santa Marta', 'Proposal · Santa Marta'),
    ('v', 'wakeboard-dron-1', 'embalse', 'Wakeboard desde el dron', 'Wakeboard from the drone'),
    ('v', 'fly-pro', 'jetski', 'Fly Pro', 'Fly Pro'),
    ('p', 'polaroid/polaroid-02', 'celebraciones santa-marta fotografia', 'Pedida en la playa', 'Beach proposal'),
    ('v', 'lancha-1', 'embalse', 'Paseo en lancha', 'Boat ride'),
    ('v', 'quince-1', 'celebraciones santa-marta', 'Quinceañera · Santa Marta', 'Quinceañera · Santa Marta'),
    ('p', 'santa-marta/santa-marta-09', 'santa-marta fotografia', 'Familia en la bahía', 'Family at the bay'),
    ('v', 'fly-legend-2', 'jetski', 'Fly Legend', 'Fly Legend'),
    ('ig', 'DCct8TmBrf0', 'celebraciones', 'Pedida en hotel y playa', 'Hotel & beach proposal'),
    ('v', 'wakeboard-1', 'embalse', 'Wakeboard', 'Wakeboard'),
    ('p', 'pueblo/pueblo-03', 'fotografia', 'Sesión en el pueblo', 'Town photo session'),
    ('v', 'planchon-dron', 'embalse', 'Planchón desde el dron', 'Pontoon from the drone'),
    ('ig', 'DAeSDnwhVJN', 'empresas', 'Grabación para hotel', 'Hotel film'),
    ('v', 'fly-start', 'jetski', 'Fly Start · sin editar', 'Fly Start · unedited'),
    ('ig', 'C9APxX-ufGc', 'celebraciones', 'Baby shower y pedida', 'Baby shower & proposal'),
    ('v', 'wakeboard-dron-2', 'embalse', 'Wakeboard desde el dron', 'Wakeboard from the drone'),
    ('ig', 'C8F3tq_uqXe', 'celebraciones', 'Picnic de quinceañeros', 'Quinceañera picnic'),
]
used = {i[1] for i in ITEMS if i[0] == 'p'}
PHOTO_CATS = {
    'fly-legend': ('jetski fotografia', 'Fly Legend', 'Fly Legend'),
    'fly-pro': ('jetski fotografia', 'Jetski en el embalse', 'Jetski on the reservoir'),
    'pueblo': ('fotografia', 'Sesión en el pueblo', 'Town photo session'),
    'embalse': ('embalse fotografia', 'Lancha y planchón', 'Boats'),
    'santa-marta': ('santa-marta fotografia', 'Santa Marta', 'Santa Marta'),
    'polaroid': ('santa-marta fotografia', 'Foto instantánea', 'Instant photo'),
    'quinceanera': ('celebraciones santa-marta fotografia', 'Quinceañera', 'Quinceañera'),
    'wakeboard': ('embalse fotografia', 'Detrás de cámara', 'Behind the scenes'),
}
order = ['pueblo', 'fly-legend', 'santa-marta', 'fly-pro', 'polaroid', 'embalse', 'quinceanera']
rest = []
for cat in order:
    for p in photos[cat]:
        key = p['src'].replace('media/img/', '').replace('.jpg', '')
        if key not in used:
            rest.append(('p', key, *PHOTO_CATS[cat]))
# intercalar las fotos restantes después de los destacados
items = ITEMS + rest

IG_SVG = '<svg aria-hidden="true" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".6"/></svg>'
PLAY = '<span class="x-play" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></span>'

out = []
for kind, ident, cats, es, en in items:
    t_es, t_en = html.escape(es), html.escape(en)
    if kind == 'v':
        out.append(
            f'      <button class="x-tile x-tile-v" data-cat="{cats}" data-type="video" data-full="media/video/{ident}.mp4" '
            f'data-title-es="{t_es}" data-title-en="{t_en}" aria-label="{t_es}">'
            f'<video class="x-autoplay" muted loop playsinline preload="none" poster="media/video/{ident}.jpg">'
            f'<source src="media/video/{ident}-preview.mp4" type="video/mp4"></video>'
            f'{PLAY}<span class="x-tile-cap" data-es="{t_es}" data-en="{t_en}">{t_es}</span></button>')
    elif kind == 'p':
        out.append(
            f'      <button class="x-tile x-tile-p" data-cat="{cats}" data-type="photo" data-full="media/img/{ident}.jpg" '
            f'data-title-es="{t_es}" data-title-en="{t_en}" aria-label="{t_es}">'
            f'<img src="media/img/{ident}.jpg" alt="{t_es}" loading="lazy">'
            f'<span class="x-tile-cap" data-es="{t_es}" data-en="{t_en}">{t_es}</span></button>')
    else:
        out.append(
            f'      <button class="x-tile x-tile-ig" data-cat="{cats}" data-type="ig" data-full="{ident}" '
            f'data-title-es="{t_es}" data-title-en="{t_en}" aria-label="{t_es} (Instagram)">'
            f'<span class="x-ig-in">{IG_SVG}<b data-es="{t_es}" data-en="{t_en}">{t_es}</b>'
            f'<small data-es="Ver en Instagram" data-en="Watch on Instagram">Ver en Instagram</small></span></button>')
html_out = '\n'.join(out)
print(len(items), 'items')
