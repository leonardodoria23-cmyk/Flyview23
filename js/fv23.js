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
      h += '<p class="x-form-msg" role="status" aria-live="polite"></p><div class="x-bk-actions">' +
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

  /* ── comunidad ── */
  var club = $('#x-club-form');
  if (club) club.addEventListener('submit', function (e) {
    e.preventDefault();
    var msg = $('.x-form-msg', club);
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
