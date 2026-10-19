"""Codifica cada video fuente en: preview muda (6 s, 360p), versión completa (720p) y portada."""
import subprocess, json, sys, pathlib
from concurrent.futures import ThreadPoolExecutor
sys.path.insert(0, str(pathlib.Path(__file__).parent))
from videos import VIDEOS

root = pathlib.Path(__file__).resolve().parent.parent
media = root / '_build' / 'media'
out = root / 'media' / 'video'; out.mkdir(parents=True, exist_ok=True)

# punto de inicio de la preview (fracción de la duración)
START = {'fly-legend-1': .8, 'fly-legend-2': .25, 'fly-legend-3': .02, 'fly-pro': .08, 'fly-start': .2,
         'jetcar': .4, 'lancha-1': .12, 'planchon-1': .45, 'planchon-dron': .08, 'pedida-guatape': .3,
         'quince-1': .45, 'quince-2': .3, 'wakeboard-1': .82, 'wakeboard-dron-1': 0, 'wakeboard-dron-2': 0}

def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True, stdin=subprocess.DEVNULL)
    if r.returncode:
        print(r.stderr[-800:]); raise SystemExit(1)

def dur(p):
    r = subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', str(p)],
                       capture_output=True, text=True, stdin=subprocess.DEVNULL)
    return float(r.stdout)

def job(v):
    slug, src, *_ = v
    s = media / src; d = dur(s); t0 = min(d * START[slug], max(0, d - 6.2))
    vf_prev = 'scale=360:640:force_original_aspect_ratio=increase,crop=360:640,fps=30'
    run(['ffmpeg', '-v', 'error', '-ss', f'{t0:.2f}', '-t', '6', '-i', str(s), '-an', '-vf', vf_prev,
         '-c:v', 'libx264', '-preset', 'slow', '-crf', '30', '-pix_fmt', 'yuv420p', '-movflags', '+faststart',
         '-y', str(out / f'{slug}-preview.mp4')])
    run(['ffmpeg', '-v', 'error', '-ss', f'{t0 + 0.5:.2f}', '-i', str(s), '-frames:v', '1',
         '-vf', 'scale=540:960:force_original_aspect_ratio=increase,crop=540:960', '-q:v', '5',
         '-y', str(out / f'{slug}.jpg')])
    full = ['ffmpeg', '-v', 'error', '-i', str(s), '-t', '80',
            '-vf', 'scale=720:1280:force_original_aspect_ratio=increase,crop=720:1280,fps=30',
            '-c:v', 'libx264', '-preset', 'slow', '-crf', '29', '-maxrate', '1800k', '-bufsize', '3600k',
            '-pix_fmt', 'yuv420p', '-movflags', '+faststart']
    full += ['-c:a', 'aac', '-b:a', '96k', '-ac', '2'] if 'dron' not in slug else ['-an']
    run(full + ['-y', str(out / f'{slug}.mp4')])
    return slug

with ThreadPoolExecutor(4) as ex:
    for s in ex.map(job, VIDEOS):
        print('ok', s, flush=True)
