"""Redimensiona las fotos a tamaño web y escribe _build/photos.json para armar la galería."""
import json, pathlib
from PIL import Image, ImageOps

root = pathlib.Path(__file__).resolve().parent.parent
media = root / '_build' / 'media'
out = root / 'media' / 'img'
SKIP = {'bc1de193'}                      # foto descartada (Fly Legend)
CROP_BOTTOM = {'b217ab48': 0.14}          # recorte inferior
CATS = {
    'fly-legend': 'fly-legend', 'fly-pro': 'fly-pro', 'fotos-zocalos-paraguas': 'pueblo',
    'lanchas-planchones': 'embalse', 'santa-marta-fotos-digitales': 'santa-marta',
    'santa-marta-polaroid': 'polaroid', 'wakeboard': 'wakeboard', 'quinceanera': 'quinceanera',
}
manifest = {}
for folder, cat in CATS.items():
    (out / cat).mkdir(parents=True, exist_ok=True)
    items = []
    for i, f in enumerate(sorted((media / folder).glob('*.jpg'))):
        key = f.stem.split('-')[0]
        if key in SKIP:
            continue
        im = ImageOps.exif_transpose(Image.open(f)).convert('RGB')
        if key in CROP_BOTTOM:
            im = im.crop((0, 0, im.width, int(im.height * (1 - CROP_BOTTOM[key]))))
        im.thumbnail((1080, 1440), Image.LANCZOS)
        name = f'{cat}-{len(items) + 1:02d}.jpg'
        im.save(out / cat / name, quality=80, optimize=True, progressive=True)
        items.append({'src': f'media/img/{cat}/{name}', 'w': im.width, 'h': im.height, 'orig': key})
    manifest[cat] = items
(root / '_build' / 'photos.json').write_text(json.dumps(manifest, indent=1))
print({k: len(v) for k, v in manifest.items()})
