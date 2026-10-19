import pathlib
p = pathlib.Path(__file__).resolve().parent.parent / 'js' / 'fv23.js'
s = p.read_text()

def rep(a, b):
    global s
    assert a in s, a[:70]
    s = s.replace(a, b, 1)

a = s.index('  /* ── visor ── */'); b = s.index('  /* ── reservas ── */')
s = s[:a] + '''  /* ── visor: videos del portafolio o fotos de un álbum ── */
  var lb = $('#x-lb'), stage = $('#x-lb-stage'), cap = $('#x-lb-cap'), items = [], cur = -1, lastFocus = null;
  function tileTitle(el) { return el.dataset['title' + (L() === 'en' ? 'En' : 'Es')] || ''; }
  function show(i) {
    if (!items.length) return;
    cur = (i + items.length) % items.length;
    var it = items[cur];
    stage.innerHTML = '';
    if (it.type === 'video') {
      var v = document.createElement('video');
      v.src = it.src; v.controls = true; v.autoplay = true; v.playsInline = true; v.setAttribute('playsinline', '');
      stage.appendChild(v);
    } else {
      var im = document.createElement('img'); im.src = it.src; im.alt = it.title; stage.appendChild(im);
    }
    cap.textContent = it.title + (items.length > 1 ? '  ·  ' + (cur + 1) + ' / ' + items.length : '');
    if (lb.hidden) { lastFocus = document.activeElement; lb.hidden = false; document.body.style.overflow = 'hidden'; $('.x-lb-close', lb).focus(); }
  }
  function openTile(el) {
    if (el.dataset.type === 'album') {
      var title = tileTitle(el);
      items = el.dataset.photos.split('|').map(function (src) { return { type: 'photo', src: src, title: title }; });
      show(0);
    } else {
      var vids = tiles.filter(function (t) { return !t.hidden && t.dataset.type === 'video'; });
      items = vids.map(function (t) { return { type: 'video', src: t.dataset.full, title: tileTitle(t) }; });
      show(vids.indexOf(el));
    }
  }
  function closeLb() { lb.hidden = true; stage.innerHTML = ''; document.body.style.overflow = ''; if (lastFocus) lastFocus.focus(); }
  tiles.forEach(function (el) { el.addEventListener('click', function () { openTile(el); }); });
  if (lb) {
    $('.x-lb-close', lb).addEventListener('click', closeLb);
    $('.x-lb-prev', lb).addEventListener('click', function () { show(cur - 1); });
    $('.x-lb-next', lb).addEventListener('click', function () { show(cur + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
    var sx = null;
    lb.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', function (e) {
      if (sx === null) return; var dx = e.changedTouches[0].clientX - sx; sx = null;
      if (Math.abs(dx) > 60) show(cur + (dx < 0 ? 1 : -1));
    });
    lb.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeLb();
      else if (e.key === 'ArrowRight') show(cur + 1);
      else if (e.key === 'ArrowLeft') show(cur - 1);
    });
  }

''' + s[b:]

rep("""  function fresh(svc) {
    var s = { step: svc ? 2 : 1, svc: svc || '', opt: '', dur: 60, qty: 1, horas: 1, video: 'sin-video', deco: false, mode: 'book', f: {} };
    if (svc && P[svc]) s.opt = P[svc].opciones[0].id;
    return s;
  }""", """  function fresh(svc, lock) {
    var s = { step: svc ? 2 : 1, svc: svc || '', opt: '', lock: '', dur: 60, qty: 1, horas: 1, video: 'sin-video', deco: false, mode: 'book', f: {} };
    if (svc && P[svc]) {
      var ok = lock && P[svc].opciones.some(function (o) { return o.id === lock; });
      s.opt = ok ? lock : P[svc].opciones[0].id; s.lock = ok ? lock : '';
    }
    return s;
  }""")
rep("function openBk(svc, quote) {\n    st = fresh(quote ? '' : svc);",
    "function openBk(svc, quote, lock) {\n    st = fresh(quote ? '' : svc, lock);")
rep("e.preventDefault(); openBk(b.dataset.book || '', b.dataset.quote || '');",
    "e.preventDefault(); openBk(b.dataset.book || '', b.dataset.quote || '', b.dataset.opt || '');")
rep("""h += bar(2) + '<h3 id="x-bk-title">' + esc(s[lang]) + '</h3>""",
    """var lockOpt = st.lock && s.opciones.filter(function (o) { return o.id === st.lock; })[0];
      h += bar(2) + '<h3 id="x-bk-title">' + esc(lockOpt ? lockOpt[lang] : s[lang]) + '</h3>""")
rep("""h += '<div class="x-svc" role="radiogroup">' + s.opciones.map(function (o) {""",
    """h += '<div class="x-svc" role="radiogroup">' + s.opciones.filter(function (o) { return !st.lock || o.id === st.lock; }).map(function (o) {""")
rep("else if (el.dataset.go) { keep(); st.step = +el.dataset.go; if (st.step === 1) st = fresh(''); render(); }",
    "else if (el.dataset.go) { keep(); var g = +el.dataset.go; if (g === 1 && st.lock) { closeBk(); return; } st.step = g; if (g === 1) st = fresh(''); render(); }")
p.write_text(s)
print('ok')
