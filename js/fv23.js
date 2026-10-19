/* Flyview23 · portafolio, visor, reservas y registro de comunidad */
(function () {
  'use strict';
  var P = globalThis.FV23_PRECIOS, COT = globalThis.FV23_COTIZA, money = globalThis.fv23Money;
  var WA = globalThis.FV23_WHATSAPP || '573216450983';
  function L() { return document.documentElement.lang === 'en' ? 'en' : 'es'; }
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  var T = {
    es: {
      pick: '¿Qué quieres vivir?', pickSub: 'Elige una experiencia para ver opciones y precios.', quoteCard: 'Algo a tu medida', quoteCardSub: 'Pedidas, bodas, eventos, hoteles o curso de dron',
      next: 'Continuar', back: 'Atrás', send: 'Enviar reserva', sendQ: 'Pedir cotización', sending: 'Enviando…',
      dur: 'Duración', d30: '30 minutos', d60: '1 hora', qtyJet: 'Jetskis', qtyPer: 'Personas', hours: 'Horas', video: 'Video con dron', deco: 'Agregar decoración',
      total: 'Total', from: 'desde', decoNote: 'La decoración vale desde $250.000; el valor final depende de lo que elijas.',
      quoteOnly: 'Esta opción se cotiza a tu medida. Te escribimos con el precio.',
      date: 'Fecha', time: 'Hora', name: 'Nombre completo', wa: 'WhatsApp', email: 'Correo', notes: 'Algo que debamos saber (opcional)',
      place: 'Lugar', placeO: ['Guatapé', 'Santa Marta', 'Otro lugar'], type: '¿Qué quieres celebrar o grabar?', people: 'Personas (aprox.)', idea: 'Cuéntanos tu idea',
      terms: 'Entiendo que para confirmar se pide un abono, que el abono no se devuelve si cancelo y que si llueve se reprograma la hora o la fecha.',
      dataTitle: 'Tus datos', dataSub: 'Te llega la factura a tu correo y te confirmamos por WhatsApp.',
      quoteTitle: 'Cotización a tu medida', quoteSub: 'Cuéntanos qué tienes en mente y te enviamos el precio.',
      okTitle: '¡Listo, recibimos tu reserva!', okTxt: 'Te enviamos la factura a tu correo. En breve te escribimos por WhatsApp para confirmar la hora y el abono.',
      okTitleWa: 'Ya casi: confírmala por WhatsApp', okTxtWa: 'Abrimos WhatsApp con tu reserva escrita. Envía el mensaje y te confirmamos la hora y el abono.',
      okQ: '¡Gracias! Recibimos tu solicitud', okQTxt: 'Te escribimos por WhatsApp con la cotización.',
      openWa: 'Abrir WhatsApp', close: 'Cerrar', invoice: 'Factura',
      req: 'Revisa los campos marcados.', bad: 'No pudimos enviar. Te abrimos WhatsApp para terminar la reserva.',
      clubOk: '¡Bienvenido a la comunidad! Pronto te llega lo primero.', clubWa: 'Te abrimos WhatsApp para terminar tu registro.',
      waHello: 'Hola Flyview23, quiero reservar:', waQuote: 'Hola Flyview23, quiero una cotización:', waClub: 'Hola Flyview23, quiero unirme a la comunidad de lugares bonitos.',
      person: 'persona', jet: 'jetski',
    },
    en: {
      pick: 'What do you want to live?', pickSub: 'Choose an experience to see options and prices.', quoteCard: 'Something made to measure', quoteCardSub: 'Proposals, weddings, events, hotels or drone course',
      next: 'Continue', back: 'Back', send: 'Send booking', sendQ: 'Request quote', sending: 'Sending…',
      dur: 'Duration', d30: '30 minutes', d60: '1 hour', qtyJet: 'Jetskis', qtyPer: 'People', hours: 'Hours', video: 'Drone video', deco: 'Add decoration',
      total: 'Total', from: 'from', decoNote: 'Decoration starts at $250,000; the final price depends on what you choose.',
      quoteOnly: 'This option is quoted to measure. We will message you the price.',
      date: 'Date', time: 'Time', name: 'Full name', wa: 'WhatsApp', email: 'Email', notes: 'Anything we should know (optional)',
      place: 'Place', placeO: ['Guatapé', 'Santa Marta', 'Somewhere else'], type: 'What do you want to celebrate or film?', people: 'People (approx.)', idea: 'Tell us your idea',
      terms: 'I understand a deposit is required to confirm, the deposit is non-refundable if I cancel, and if it rains we reschedule the time or date.',
      dataTitle: 'Your details', dataSub: 'Your invoice goes to your email and we confirm on WhatsApp.',
      quoteTitle: 'Custom quote', quoteSub: 'Tell us what you have in mind and we will send you the price.',
      okTitle: 'Done, we got your booking!', okTxt: 'Your invoice is on its way to your email. We will message you on WhatsApp shortly to confirm the time and deposit.',
      okTitleWa: 'Almost there: confirm on WhatsApp', okTxtWa: 'We opened WhatsApp with your booking written out. Send the message and we will confirm the time and deposit.',
      okQ: 'Thanks! We got your request', okQTxt: 'We will message you on WhatsApp with your quote.',
      openWa: 'Open WhatsApp', close: 'Close', invoice: 'Invoice',
      req: 'Please check the highlighted fields.', bad: 'We could not send it. We opened WhatsApp so you can finish the booking.',
      clubOk: 'Welcome to the community! The first one is coming soon.', clubWa: 'We opened WhatsApp to finish your sign-up.',
      waHello: 'Hi Flyview23, I want to book:', waQuote: 'Hi Flyview23, I would like a quote:', waClub: 'Hi Flyview23, I want to join the beautiful places community.',
      person: 'person', jet: 'jetski',
    },
  };
  function t(k) { return T[L()][k]; }
  function wa(text) { return 'https://wa.me/' + WA + '?text=' + encodeURIComponent(text); }

  /* ── videos que se reproducen solos al estar a la vista ── */
  var vids = $$('video.x-autoplay');
  if ('IntersectionObserver' in window) {
    var vo = new IntersectionObserver(function (ents) {
      ents.forEach(function (e) {
        var v = e.target;
        if (e.isIntersecting && !v.closest('[hidden]')) { if (v.preload === 'none') v.preload = 'auto'; var p = v.play(); if (p && p.catch) p.catch(function () {}); }
        else v.pause();
      });
    }, { threshold: 0.45 });
    vids.forEach(function (v) { vo.observe(v); });
  }

  /* ── filtros y "ver más" ── */
  var grid = $('#x-grid'), more = $('#x-more'), filter = 'todo', shown = 12;
  var tiles = grid ? $$('.x-tile', grid) : [];
  function applyFilter() {
    var match = tiles.filter(function (el) { return filter === 'todo' || (' ' + el.dataset.cat + ' ').indexOf(' ' + filter + ' ') > -1; });
    tiles.forEach(function (el) { el.hidden = true; });
    match.forEach(function (el, i) { el.hidden = i >= shown; });
    if (more) more.parentNode.hidden = match.length <= shown;
  }
  $$('.x-filter').forEach(function (b) {
    b.addEventListener('click', function () {
      $$('.x-filter').forEach(function (x) { x.classList.toggle('is-on', x === b); x.setAttribute('aria-selected', x === b); });
      filter = b.dataset.f; shown = 12; applyFilter();
    });
  });
  if (more) more.addEventListener('click', function () { shown += 12; applyFilter(); });
  applyFilter();

  /* ── visor: videos del portafolio o fotos de un álbum ── */
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

  /* ── reservas ── */
  var bk = $('#x-bk'), body = $('#x-bk-body'), st = null, bkFocus = null;
  var ORDER = ['video-jetski', 'jetski', 'lancha', 'planchon', 'jetcar', 'fotos-pueblo', 'video-santa-marta', 'quinceanera'];
  function fresh(svc, lock) {
    var s = { step: svc ? 2 : 1, svc: svc || '', opt: '', lock: '', dur: 60, qty: 1, horas: 1, video: 'sin-video', deco: false, mode: 'book', f: {} };
    if (svc && P[svc]) {
      var ok = lock && P[svc].opciones.some(function (o) { return o.id === lock; });
      s.opt = ok ? lock : P[svc].opciones[0].id; s.lock = ok ? lock : '';
    }
    return s;
  }
  function openBk(svc, quote, lock) {
    st = fresh(quote ? '' : svc, lock);
    if (quote) { st.mode = 'quote'; st.step = 3; st.f.tipo = quote; }
    bkFocus = document.activeElement; bk.hidden = false; document.body.style.overflow = 'hidden'; render();
  }
  function closeBk() { bk.hidden = true; document.body.style.overflow = ''; st = null; if (bkFocus) bkFocus.focus(); }
  if (bk) {
    $('.x-bk-close', bk).addEventListener('click', closeBk);
    bk.addEventListener('click', function (e) { if (e.target === bk) closeBk(); });
    bk.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeBk(); });
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-book],[data-quote]'); if (!b) return;
    e.preventDefault(); openBk(b.dataset.book || '', b.dataset.quote || '', b.dataset.opt || '');
  });

  function bar(n) { return '<div class="x-bk-steps" aria-hidden="true">' + [1, 2, 3].map(function (i) { return '<i class="' + (i <= n ? 'on' : '') + '"></i>'; }).join('') + '</div>'; }
  function selCalc() { return globalThis.fv23Calc({ svc: st.svc, opt: st.opt, dur: st.dur, qty: st.qty, horas: st.horas, video: st.video, deco: st.deco }, L()); }
  function optPrice(o) {
    if (o.price === null) return L() === 'en' ? 'Quote' : 'Cotizar';
    if (typeof o.price === 'object') return money(o.price[st.dur]);
    return money(o.price);
  }
  function summary(c) {
    if (c.cotizacion) return '<p class="x-note">' + t('quoteOnly') + '</p>';
    return '<div class="x-sum">' + c.lines.map(function (l) {
      return '<div><span>' + esc(l.desc) + (l.qty > 1 ? ' × ' + l.qty : '') + '</span><span>' + money(l.total) + '</span></div>';
    }).join('') + '<div class="x-sum-total"><span>' + t('total') + (c.desde ? ' (' + t('from') + ')' : '') + '</span><span>' + money(c.total) + '</span></div></div>' +
      (c.desde ? '<p class="x-note">' + t('decoNote') + '</p>' : '');
  }
  function qtyCtl(key, label, max) {
    return '<label><span>' + label + '</span><div class="x-qty"><button type="button" data-q="' + key + '" data-d="-1" aria-label="−">−</button><output>' + st[key] + '</output><button type="button" data-q="' + key + '" data-d="1" data-max="' + max + '" aria-label="+">+</button></div></label>';
  }

  function render() {
    var lang = L(), h = '';
    if (st.step === 1) {
      h += bar(1) + '<h3 id="x-bk-title">' + t('pick') + '</h3><p class="x-bk-sub">' + t('pickSub') + '</p><div class="x-svc">';
      ORDER.forEach(function (k) {
        var s = P[k], min = Infinity;
        s.opciones.forEach(function (o) { var p = typeof o.price === 'object' && o.price ? o.price[30] : o.price; if (p) min = Math.min(min, p); });
        h += '<button type="button" class="x-opt" data-svc="' + k + '"><span class="x-opt-txt"><b>' + esc(s[lang]) + '</b><small>' + esc(s.plaza) + '</small></span><span class="x-opt-price"><small>' + t('from') + '</small> ' + money(min) + '</span></button>';
      });
      h += '<button type="button" class="x-opt" data-svcq="1"><span class="x-opt-txt"><b>' + t('quoteCard') + '</b><small>' + t('quoteCardSub') + '</small></span></button></div>';
    } else if (st.step === 2) {
      var s = P[st.svc], c = selCalc();
      var lockOpt = st.lock && s.opciones.filter(function (o) { return o.id === st.lock; })[0];
      h += bar(2) + '<h3 id="x-bk-title">' + esc(lockOpt ? lockOpt[lang] : s[lang]) + '</h3><p class="x-bk-sub">' + esc(s.plaza) + (s['nota_' + lang] ? ' · ' + esc(s['nota_' + lang]) : '') + '</p><div class="x-form">';
      if (s.duracion) h += '<div><span class="x-note">' + t('dur') + '</span><div class="x-seg" role="radiogroup">' +
        [30, 60].map(function (d) { return '<button type="button" class="x-opt' + (st.dur === d ? ' is-on' : '') + '" data-dur="' + d + '" role="radio" aria-checked="' + (st.dur === d) + '"><span class="x-opt-txt"><b>' + t(d === 30 ? 'd30' : 'd60') + '</b></span></button>'; }).join('') + '</div></div>';
      h += '<div class="x-svc" role="radiogroup">' + s.opciones.filter(function (o) { return !st.lock || o.id === st.lock; }).map(function (o) {
        var on = o.id === st.opt;
        return '<button type="button" class="x-opt' + (on ? ' is-on' : '') + '" data-opt="' + o.id + '" role="radio" aria-checked="' + on + '"><span class="x-opt-txt"><b>' + esc(o[lang]) + '</b>' + (o['d_' + lang] ? '<small>' + esc(o['d_' + lang]) + '</small>' : '') + '</span><span class="x-opt-price">' + optPrice(o) + '</span></button>';
      }).join('') + '</div>';
      var opt = s.opciones.filter(function (o) { return o.id === st.opt; })[0];
      if (opt && opt.price !== null) {
        if (st.svc === 'jetski' || st.svc === 'video-jetski') h += qtyCtl('qty', opt.unidad === 'persona' ? t('qtyPer') : t('qtyJet'), 12);
        if (s.porHora) h += qtyCtl('horas', t('hours'), 8);
        if (s.decoracion) h += '<label class="x-check"><input type="checkbox" data-deco' + (st.deco ? ' checked' : '') + '><span>' + t('deco') + ' (' + t('from') + ' ' + money(s.decoracion.price) + ')</span></label>';
        if (s.video) h += '<label><span>' + t('video') + '</span><select data-video>' + s.video.filter(function (v) { return !v.solo || v.solo === st.opt; }).map(function (v) {
          return '<option value="' + v.id + '"' + (v.id === st.video ? ' selected' : '') + '>' + esc(v[lang]) + (v.price ? ' · ' + money(v.price) : '') + '</option>';
        }).join('') + '</select></label>';
      }
      h += summary(c) + '<div class="x-bk-actions"><button type="button" class="x-btn-ghost" data-go="1">' + t('back') + '</button><button type="button" class="x-btn" data-go="3">' + t('next') + '</button></div></div>';
    } else if (st.step === 3) {
      var q = st.mode === 'quote' || selCalc().cotizacion, f = st.f, today = new Date(Date.now() - new Date().getTimezoneOffset() * 6e4).toISOString().slice(0, 10);
      var times = []; for (var m = 7 * 60; m <= 17 * 60 + 30; m += 30) times.push(('0' + Math.floor(m / 60)).slice(-2) + ':' + (m % 60 ? '30' : '00'));
      h += bar(3) + '<h3 id="x-bk-title">' + (st.mode === 'quote' ? t('quoteTitle') : t('dataTitle')) + '</h3><p class="x-bk-sub">' + (st.mode === 'quote' ? t('quoteSub') : t('dataSub')) + '</p><form class="x-form" novalidate data-final>';
      if (st.mode === 'quote') {
        h += '<label><span>' + t('type') + '</span><select name="tipo">' + COT.map(function (c) { return '<option value="' + c.id + '"' + (f.tipo === c.id ? ' selected' : '') + '>' + esc(c[lang]) + '</option>'; }).join('') + '</select></label>';
        h += '<div class="x-row2"><label><span>' + t('place') + '</span><select name="lugar">' + t('placeO').map(function (p) { return '<option' + (f.lugar === p ? ' selected' : '') + '>' + p + '</option>'; }).join('') + '</select></label>' +
          '<label><span>' + t('people') + '</span><input name="personas" type="number" min="1" inputmode="numeric" value="' + esc(f.personas || '') + '"></label></div>';
      }
      h += '<div class="x-row2"><label><span>' + t('date') + '</span><input name="fecha" type="date" required min="' + today + '" value="' + esc(f.fecha || '') + '"></label>' +
        '<label><span>' + t('time') + '</span><select name="hora" required>' + times.map(function (x) { return '<option' + (f.hora === x ? ' selected' : '') + '>' + x + '</option>'; }).join('') + '</select></label></div>';
      h += '<label><span>' + t('name') + '</span><input name="nombre" required autocomplete="name" value="' + esc(f.nombre || '') + '"></label>' +
        '<div class="x-row2"><label><span>' + t('wa') + '</span><input name="whatsapp" type="tel" required autocomplete="tel" placeholder="+57 300 000 0000" value="' + esc(f.whatsapp || '') + '"></label>' +
        '<label><span>' + t('email') + '</span><input name="correo" type="email" required autocomplete="email" value="' + esc(f.correo || '') + '"></label></div>';
      h += '<label><span>' + (st.mode === 'quote' ? t('idea') : t('notes')) + '</span><textarea name="notas"' + (st.mode === 'quote' ? ' required' : '') + '>' + esc(f.notas || '') + '</textarea></label>';
      if (st.mode !== 'quote') h += summary(selCalc());
      if (!q) h += '<label class="x-check"><input type="checkbox" name="terminos" required' + (f.terminos ? ' checked' : '') + '><span>' + t('terms') + '</span></label>';
      h += '<label class="x-hp" aria-hidden="true">No llenar<input name="web" tabindex="-1" autocomplete="off"></label>' +
        '<p class="x-form-msg" role="status" aria-live="polite"></p><div class="x-bk-actions">' +
        (st.mode === 'quote' ? '' : '<button type="button" class="x-btn-ghost" data-go="2">' + t('back') + '</button>') +
        '<button type="submit" class="x-btn">' + (q ? t('sendQ') : t('send')) + '</button></div></form>';
    } else {
      var ok = st.result || {};
      h += '<div class="x-bk-ok"><div class="x-ok-ic"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12l5 5L20 7"/></svg></div><h3 id="x-bk-title" style="margin:0 0 10px">' + esc(ok.title) + '</h3><p>' + esc(ok.text) + '</p>' +
        (ok.factura ? '<p><b>' + t('invoice') + ' ' + esc(ok.factura) + '</b></p>' : '') +
        '<div class="x-bk-actions"><a class="x-btn" target="_blank" rel="noopener" href="' + esc(ok.wa) + '">' + t('openWa') + '</a><button type="button" class="x-btn-ghost" data-close>' + t('close') + '</button></div></div>';
    }
    body.innerHTML = h;
    var first = $('h3', body); if (first) { first.tabIndex = -1; first.focus({ preventScroll: true }); }
  }

  function keep() { var form = $('form[data-final]', body); if (!form) return; new FormData(form).forEach(function (v, k) { st.f[k] = v; }); st.f.terminos = !!(form.terminos && form.terminos.checked); }
  if (body) {
    body.addEventListener('click', function (e) {
      var el = e.target.closest('button,[data-close]'); if (!el || !st) return;
      if (el.dataset.svc) { st = fresh(el.dataset.svc); render(); }
      else if (el.dataset.svcq) { st.mode = 'quote'; st.step = 3; render(); }
      else if (el.dataset.opt) { st.opt = el.dataset.opt; if (st.svc === 'lancha' && st.video === 'video-wakeboard') st.video = 'sin-video'; render(); }
      else if (el.dataset.dur) { st.dur = +el.dataset.dur; render(); }
      else if (el.dataset.q) { var k = el.dataset.q, d = +el.dataset.d, mx = +(el.dataset.max || 99); st[k] = Math.min(mx, Math.max(1, st[k] + d)); render(); }
      else if (el.dataset.go) { keep(); var g = +el.dataset.go; if (g === 1 && st.lock) { closeBk(); return; } st.step = g; if (g === 1) st = fresh(''); render(); }
      else if (el.hasAttribute('data-close')) closeBk();
    });
    body.addEventListener('change', function (e) {
      if (!st) return;
      if (e.target.hasAttribute('data-video')) { st.video = e.target.value; render(); }
      else if (e.target.hasAttribute('data-deco')) { st.deco = e.target.checked; render(); }
    });
    body.addEventListener('submit', function (e) { e.preventDefault(); submitBk(e.target); });
  }

  function validate(form) {
    var okAll = true;
    $$('input,select,textarea', form).forEach(function (el) {
      var bad = !el.checkValidity() || (el.name === 'whatsapp' && el.value.replace(/\D/g, '').length < 7);
      el.setAttribute('aria-invalid', bad ? 'true' : 'false'); el.style.borderColor = bad ? '#ff6b6b' : '';
      if (bad) okAll = false;
    });
    return okAll;
  }
  function bookingText(c) {
    var f = st.f, lang = L(), lines = [];
    if (st.mode === 'quote') {
      var tipo = COT.filter(function (x) { return x.id === f.tipo; })[0];
      lines.push(t('waQuote'), '• ' + (tipo ? tipo[lang] : f.tipo), '• ' + f.lugar + (f.personas ? ' · ' + f.personas + ' ' + t('qtyPer').toLowerCase() : ''));
    } else {
      lines.push(t('waHello'), '• ' + P[st.svc][lang] + ' (' + P[st.svc].plaza + ')');
      c.lines.forEach(function (l) { lines.push('  - ' + l.desc + (l.qty > 1 ? ' × ' + l.qty : '') + (l.total ? ': ' + money(l.total) : '')); });
      if (!c.cotizacion) lines.push('• ' + t('total') + (c.desde ? ' (' + t('from') + ')' : '') + ': ' + money(c.total));
    }
    lines.push('• ' + t('date') + ': ' + f.fecha + ' ' + f.hora, '• ' + f.nombre + ' · ' + f.whatsapp + ' · ' + f.correo);
    if (f.notas) lines.push('• ' + f.notas);
    return lines.join('\n');
  }
  function submitBk(form) {
    var msg = $('.x-form-msg', form);
    if (form.web && form.web.value) return;
    if (!validate(form)) { msg.textContent = t('req'); return; }
    keep();
    var c = st.mode === 'quote' ? { lines: [], total: 0, cotizacion: true } : selCalc();
    var isQuote = st.mode === 'quote' || c.cotizacion;
    var text = bookingText(c), waUrl = wa(text), ep = globalThis.FV23_ENDPOINT;
    var done = function (r) {
      st.step = 4;
      st.result = isQuote ? { title: t('okQ'), text: t('okQTxt'), wa: waUrl }
        : r && r.ok ? { title: t('okTitle'), text: t('okTxt'), wa: waUrl, factura: r.factura }
        : { title: t('okTitleWa'), text: t('okTxtWa'), wa: waUrl };
      render();
    };
    if (!ep) { window.open(waUrl, '_blank', 'noopener'); done(null); return; }
    var btn = $('button[type=submit]', form); btn.disabled = true; btn.textContent = t('sending');
    var payload = { tipo: isQuote ? 'cotizacion' : 'reserva', lang: L(), sel: { svc: st.svc, opt: st.opt, dur: st.dur, qty: st.qty, horas: st.horas, video: st.video, deco: st.deco }, datos: st.f, origen: location.href };
    fetch(ep, { method: 'POST', body: JSON.stringify(payload) })
      .then(function (r) { return r.json(); })
      .then(function (r) { if (!r.ok) throw new Error(r.error || 'error'); done(r); })
      .catch(function () { window.open(waUrl, '_blank', 'noopener'); done(null); });
  }
  document.addEventListener('fv23lang', function () { if (st && !bk.hidden) { keep(); render(); } });


  /* ── versículo del día (cambia cada mañana, hora de Colombia) ── */
  var VERSOS = [["De Jehová es la tierra y su plenitud; el mundo, y los que en él habitan.", "The earth is the Lord's, and the fulness thereof; the world, and they that dwell therein.", "Salmo 24:1", "Psalm 24:1"], ["Los cielos cuentan la gloria de Dios, y el firmamento anuncia la obra de sus manos.", "The heavens declare the glory of God; and the firmament sheweth his handywork.", "Salmo 19:1", "Psalm 19:1"], ["Encomienda a Jehová tus obras, y tus pensamientos serán afirmados.", "Commit thy works unto the Lord, and thy thoughts shall be established.", "Proverbios 16:3", "Proverbs 16:3"], ["Acuérdate de Jehová tu Dios, porque él te da el poder para hacer las riquezas.", "Remember the Lord thy God: for it is he that giveth thee power to get wealth.", "Deuteronomio 8:18", "Deuteronomy 8:18"], ["No a nosotros, oh Jehová, no a nosotros, sino a tu nombre da gloria, por tu misericordia, por tu verdad.", "Not unto us, O Lord, not unto us, but unto thy name give glory, for thy mercy, and for thy truth's sake.", "Salmo 115:1", "Psalm 115:1"], ["Los que esperan a Jehová tendrán nuevas fuerzas; levantarán alas como las águilas; correrán, y no se cansarán; caminarán, y no se fatigarán.", "They that wait upon the Lord shall renew their strength; they shall mount up with wings as eagles; they shall run, and not be weary; and they shall walk, and not faint.", "Isaías 40:31", "Isaiah 40:31"], ["Todo lo puedo en Cristo que me fortalece.", "I can do all things through Christ which strengtheneth me.", "Filipenses 4:13", "Philippians 4:13"], ["Mira que te mando que te esfuerces y seas valiente; no temas ni desmayes, porque Jehová tu Dios estará contigo en dondequiera que vayas.", "Be strong and of a good courage; be not afraid, neither be thou dismayed: for the Lord thy God is with thee whithersoever thou goest.", "Josué 1:9", "Joshua 1:9"], ["Encomienda a Jehová tu camino, y confía en él; y él hará.", "Commit thy way unto the Lord; trust also in him; and he shall bring it to pass.", "Salmo 37:5", "Psalm 37:5"], ["Fíate de Jehová de todo tu corazón, y no te apoyes en tu propia prudencia. Reconócelo en todos tus caminos, y él enderezará tus veredas.", "Trust in the Lord with all thine heart; and lean not unto thine own understanding. In all thy ways acknowledge him, and he shall direct thy paths.", "Proverbios 3:5-6", "Proverbs 3:5-6"], ["Este es el día que hizo Jehová; nos gozaremos y alegraremos en él.", "This is the day which the Lord hath made; we will rejoice and be glad in it.", "Salmo 118:24", "Psalm 118:24"], ["¡Oh Jehová, Señor nuestro, cuán glorioso es tu nombre en toda la tierra!", "O Lord our Lord, how excellent is thy name in all the earth!", "Salmo 8:1", "Psalm 8:1"], ["Y todo lo que hagáis, hacedlo de corazón, como para el Señor y no para los hombres.", "And whatsoever ye do, do it heartily, as to the Lord, and not unto men.", "Colosenses 3:23", "Colossians 3:23"], ["Tuya es, oh Jehová, la magnificencia y el poder, la gloria, la victoria y el honor; porque todas las cosas que están en los cielos y en la tierra son tuyas.", "Thine, O Lord, is the greatness, and the power, and the glory, and the victory, and the majesty: for all that is in the heaven and in the earth is thine.", "1 Crónicas 29:11", "1 Chronicles 29:11"], ["Jehová es mi pastor; nada me faltará.", "The Lord is my shepherd; I shall not want.", "Salmo 23:1", "Psalm 23:1"], ["Mas buscad primeramente el reino de Dios y su justicia, y todas estas cosas os serán añadidas.", "But seek ye first the kingdom of God, and his righteousness; and all these things shall be added unto you.", "Mateo 6:33", "Matthew 6:33"], ["Dios es nuestro amparo y fortaleza, nuestro pronto auxilio en las tribulaciones.", "God is our refuge and strength, a very present help in trouble.", "Salmo 46:1", "Psalm 46:1"], ["Alzaré mis ojos a los montes; ¿de dónde vendrá mi socorro? Mi socorro viene de Jehová, que hizo los cielos y la tierra.", "I will lift up mine eyes unto the hills, from whence cometh my help. My help cometh from the Lord, which made heaven and earth.", "Salmo 121:1-2", "Psalm 121:1-2"], ["Toda buena dádiva y todo don perfecto desciende de lo alto, del Padre de las luces.", "Every good gift and every perfect gift is from above, and cometh down from the Father of lights.", "Santiago 1:17", "James 1:17"], ["Todo lo que respira alabe a JAH. Aleluya.", "Let every thing that hath breath praise the Lord. Praise ye the Lord.", "Salmo 150:6", "Psalm 150:6"], ["No temas, porque yo estoy contigo; no desmayes, porque yo soy tu Dios que te esfuerzo.", "Fear thou not; for I am with thee: be not dismayed; for I am thy God: I will strengthen thee.", "Isaías 41:10", "Isaiah 41:10"], ["Gustad, y ved que es bueno Jehová; dichoso el hombre que confía en él.", "O taste and see that the Lord is good: blessed is the man that trusteth in him.", "Salmo 34:8", "Psalm 34:8"], ["Por la misericordia de Jehová no hemos sido consumidos, porque nunca decayeron sus misericordias. Nuevas son cada mañana; grande es tu fidelidad.", "It is of the Lord's mercies that we are not consumed, because his compassions fail not. They are new every morning: great is thy faithfulness.", "Lamentaciones 3:22-23", "Lamentations 3:22-23"], ["Yo soy el camino, y la verdad, y la vida.", "I am the way, the truth, and the life.", "Juan 14:6", "John 14:6"], ["Y sabemos que a los que aman a Dios, todas las cosas les ayudan a bien.", "And we know that all things work together for good to them that love God.", "Romanos 8:28", "Romans 8:28"], ["Sea la luz de Jehová nuestro Dios sobre nosotros, y la obra de nuestras manos confirma sobre nosotros.", "Let the beauty of the Lord our God be upon us: and establish thou the work of our hands upon us.", "Salmo 90:17", "Psalm 90:17"]];
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

  /* ── comunidad ── */
  var club = $('#x-club-form');
  if (club) club.addEventListener('submit', function (e) {
    e.preventDefault();
    var msg = $('.x-form-msg', club);
    if (club.web && club.web.value) return;
    if (!validate(club)) { msg.textContent = t('req'); return; }
    var d = {}; new FormData(club).forEach(function (v, k) { d[k] = v; });
    var waUrl = wa(t('waClub') + '\n• ' + d.nombre + ' · ' + d.whatsapp + ' · ' + d.correo + (d.ciudad ? ' · ' + d.ciudad : ''));
    var ep = globalThis.FV23_ENDPOINT;
    if (!ep) { window.open(waUrl, '_blank', 'noopener'); msg.textContent = t('clubWa'); return; }
    var btn = $('button[type=submit]', club); btn.disabled = true;
    fetch(ep, { method: 'POST', body: JSON.stringify({ tipo: 'comunidad', lang: L(), datos: d, origen: location.href }) })
      .then(function (r) { return r.json(); })
      .then(function (r) { if (!r.ok) throw 0; msg.textContent = t('clubOk'); club.reset(); })
      .catch(function () { window.open(waUrl, '_blank', 'noopener'); msg.textContent = t('clubWa'); })
      .then(function () { btn.disabled = false; });
  });
})();
