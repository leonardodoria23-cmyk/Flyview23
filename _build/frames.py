import subprocess, json, sys, pathlib
from PIL import Image, ImageDraw
sys.path.insert(0, str(pathlib.Path(__file__).parent))
from videos import VIDEOS

media = pathlib.Path(__file__).parent / 'media'
out = pathlib.Path(sys.argv[1]); out.mkdir(parents=True, exist_ok=True)

def probe(p):
    r = subprocess.run(['ffprobe', '-v', 'error', '-print_format', 'json', '-show_format', '-show_streams', str(p)],
                       capture_output=True, text=True, stdin=subprocess.DEVNULL)
    return json.loads(r.stdout)

tiles = []
for slug, src, cat, title in VIDEOS:
    info = probe(media / src)
    dur = float(info['format']['duration'])
    v = [s for s in info['streams'] if s['codec_type'] == 'video'][0]
    a = any(s['codec_type'] == 'audio' for s in info['streams'])
    print(f"{slug:18} {dur:6.1f}s {v['width']}x{v['height']} audio={a}")
    for k, p in enumerate((0.15, 0.5, 0.85)):
        f = out / f"{slug}_{k}.jpg"
        subprocess.run(['ffmpeg', '-v', 'error', '-ss', str(dur * p), '-i', str(media / src), '-frames:v', '1',
                        '-vf', 'scale=-2:260', '-y', str(f)], stdin=subprocess.DEVNULL)
        if f.exists():
            tiles.append((slug, Image.open(f)))

W = max(t[1].width for t in tiles); cols = 9
rows = (len(tiles) + cols - 1) // cols
c = Image.new('RGB', (cols * (W + 6), rows * 280), 'white'); d = ImageDraw.Draw(c)
for k, (s, im) in enumerate(tiles):
    x = (k % cols) * (W + 6); y = (k // cols) * 280
    c.paste(im, (x, y + 18)); d.text((x + 2, y + 3), s, fill='black')
c.save(out.parent / 'vsheet.jpg', quality=72)
print(c.size)
