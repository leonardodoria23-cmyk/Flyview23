/**
 * Flyview23 · Reservas, cotizaciones y comunidad
 * --------------------------------------------------
 * Se instala UNA vez en la cuenta flyview23@gmail.com (ver apps-script/COMO-ACTIVAR.md).
 * Cuando alguien reserva en flyview23.com:
 *   1. crea el evento en el Google Calendar de la cuenta,
 *   2. genera la factura en PDF con la marca y la guarda en Drive,
 *   3. se la envía al cliente por correo y te avisa a ti,
 *   4. deja todo anotado en la hoja "Flyview23 · Reservas y comunidad".
 * Los precios se calculan aquí con la misma tabla de la página (no se confía en el navegador).
 */

/* ===== Configuración ===== */
var CFG = {
  DUENO: 'flyview23@gmail.com',
  WHATSAPP: '573216450983',
  ZONA: 'America/Bogota',
  HOJA: 'Flyview23 · Reservas y comunidad',
  CARPETA: 'Flyview23 · Facturas',
};

/* ===== Tabla de precios (copia automática de js/precios.js) ===== */
/* Precios Flyview23 (COP). Fuente única: la página y el script de reservas usan esta misma tabla.
   price: número = precio fijo · null = por cotización.  */
globalThis.FV23_PRECIOS = {
  'video-jetski': {
    plaza: 'Guatapé', es: 'Video con dron en jetski', en: 'Drone video on a jetski', horas: 1,
    opciones: [
      { id: 'fly-start', es: 'Fly Start', en: 'Fly Start', price: 80000, unidad: 'jetski',
        d_es: 'Video sin editar de 1:30 a 2:00 min, con La Piedra al final.',
        d_en: 'Unedited video, 1:30 to 2:00 min, ending with La Piedra.' },
      { id: 'fly-pro', es: 'Fly Pro', en: 'Fly Pro', price: 100000, unidad: 'jetski',
        d_es: 'Video editado con tu canción + video crudo en 4K el mismo día.',
        d_en: 'Edited video with your song + raw 4K video the same day.' },
      { id: 'fly-pro-plus', es: 'Fly Pro +', en: 'Fly Pro +', price: 130000, unidad: 'jetski',
        d_es: 'Todo lo de Fly Pro + 10 fotos sin editar en el jetski.',
        d_en: 'Everything in Fly Pro + 10 unedited photos on the jetski.' },
      { id: 'fly-legend', es: 'Fly Legend', en: 'Fly Legend', price: 250000, unidad: 'persona',
        d_es: 'Sesión de 45 a 50 min frente a La Piedra: 40 a 70 fotos, 10 editadas, video editado y en bruto.',
        d_en: '45–50 min session at La Piedra: 40 to 70 photos, 10 edited, edited and raw video.' },
    ],
  },
  'jetski': {
    plaza: 'Guatapé', es: 'Alquiler de jetski', en: 'Jetski rental', duracion: true,
    opciones: [
      { id: 'basico', es: 'Jetski Básico', en: 'Basic Jetski', price: { 30: 120000, 60: 220000 }, unidad: 'jetski',
        d_es: '1 a 2 personas · hasta 50 km/h.', d_en: '1 to 2 people · up to 50 km/h.' },
      { id: 'sport', es: 'Jetski Sport', en: 'Sport Jetski', price: { 30: 140000, 60: 280000 }, unidad: 'jetski',
        d_es: 'Para jugar y hacer giros, a veces con música. 1 persona de hasta 90 kg o 2 personas delgadas.',
        d_en: 'Made for tricks and turns, sometimes with music. 1 rider up to 90 kg or 2 slim riders.' },
      { id: 'plus', es: 'Jetski Plus', en: 'Plus Jetski', price: { 30: 170000, 60: 260000 }, unidad: 'jetski',
        d_es: '2 personas · hasta 65 km/h.', d_en: '2 people · up to 65 km/h.' },
      { id: 'premium', es: 'Jetski Premium', en: 'Premium Jetski', price: { 30: 230000, 60: 320000 }, unidad: 'jetski',
        d_es: '2 personas · hasta 90 km/h.', d_en: '2 people · up to 90 km/h.' },
    ],
  },
  'lancha': {
    plaza: 'Guatapé', es: 'Lancha y wakeboard', en: 'Boat & wakeboard', porHora: true,
    opciones: [
      { id: 'paseo', es: 'Paseo en lancha', en: 'Boat ride', price: 300000, unidad: 'hora',
        d_es: 'Hasta 6 personas.', d_en: 'Up to 6 people.' },
      { id: 'wakeboard', es: 'Lancha para wakeboard', en: 'Wakeboard boat', price: 320000, unidad: 'hora',
        d_es: 'Hasta 5 personas · 4 levantadas por hora. Si todos quieren montar, reserva más de una hora.',
        d_en: 'Up to 5 people · 4 rides per hour. Book more than one hour so everyone can ride.' },
    ],
    video: [
      { id: 'sin-video', es: 'Sin video', en: 'No video', price: 0 },
      { id: 'video-sin-editar', es: 'Video con dron sin editar', en: 'Unedited drone video', price: 80000 },
      { id: 'video-editado', es: 'Video con dron editado', en: 'Edited drone video', price: 100000 },
      { id: 'video-fotos', es: 'Video editado + fotos sin editar', en: 'Edited video + unedited photos', price: 130000 },
      { id: 'video-wakeboard', es: 'Video de wakeboard editado (por hora)', en: 'Edited wakeboard video (per hour)', price: 300000, porHora: true, solo: 'wakeboard' },
    ],
  },
  'planchon': {
    plaza: 'Guatapé', es: 'Planchón', en: 'Party pontoon', porHora: true,
    opciones: [
      { id: 'hasta-12', es: 'Planchón hasta 12 personas', en: 'Pontoon up to 12 people', price: 300000, unidad: 'hora' },
      { id: 'hasta-23', es: 'Planchón de 13 a 23 personas', en: 'Pontoon for 13 to 23 people', price: 360000, unidad: 'hora' },
      { id: 'mas-23', es: 'Planchón para más de 23 personas', en: 'Pontoon for more than 23 people', price: 430000, unidad: 'hora' },
    ],
    decoracion: { es: 'Decoración (cumpleaños, aniversario, pedida)', en: 'Decoration (birthday, anniversary, proposal)', price: 250000, desde: true },
    video: [
      { id: 'sin-video', es: 'Sin video', en: 'No video', price: 0 },
      { id: 'video-sin-editar', es: 'Video con dron sin editar', en: 'Unedited drone video', price: 80000 },
      { id: 'video-editado', es: 'Video con dron editado', en: 'Edited drone video', price: 100000 },
      { id: 'video-fotos', es: 'Video editado + fotos sin editar', en: 'Edited video + unedited photos', price: 130000 },
    ],
  },
  'jetcar': {
    plaza: 'Guatapé', es: 'Jetcar', en: 'Jetcar',
    opciones: [
      { id: 'video-sin-editar', es: 'Video del jetcar sin editar', en: 'Unedited jetcar video', price: 100000, unidad: 'video' },
      { id: 'video-editado', es: 'Video del jetcar editado', en: 'Edited jetcar video', price: 130000, unidad: 'video' },
      { id: 'video-fotos', es: 'Video editado + fotos sin editar', en: 'Edited video + unedited photos', price: 150000, unidad: 'video' },
      { id: 'alquiler', es: 'Alquiler del jetcar', en: 'Jetcar rental', price: null, unidad: 'cotizacion' },
    ],
  },
  'fotos-pueblo': {
    plaza: 'Guatapé', es: 'Sesión de fotos en el pueblo', en: 'Photo session in town',
    opciones: [
      { id: 'sesion', es: 'Sesión en la calle de los paraguas y los zócalos', en: 'Session on the umbrella street and the zócalos', price: 200000, unidad: 'sesion',
        d_es: 'Más de 50 fotos sin editar · hasta 5 personas.', d_en: '50+ unedited photos · up to 5 people.' },
    ],
  },
  'video-santa-marta': {
    plaza: 'Santa Marta', es: 'Video aéreo de tu grupo en la bahía', en: 'Aerial video of your group at the bay',
    opciones: [
      { id: 'g1-5', es: 'Grupo de 1 a 5 personas', en: 'Group of 1 to 5', price: 35000, unidad: 'grupo' },
      { id: 'g6-11', es: 'Grupo de 6 a 11 personas', en: 'Group of 6 to 11', price: 45000, unidad: 'grupo' },
      { id: 'g12-15', es: 'Grupo de 12 a 15 personas', en: 'Group of 12 to 15', price: 55000, unidad: 'grupo' },
      { id: 'g16-22', es: 'Grupo de 16 a 22 personas', en: 'Group of 16 to 22', price: 80000, unidad: 'grupo' },
      { id: 'g23', es: 'Más de 22 personas', en: 'More than 22 people', price: null, unidad: 'cotizacion' },
    ],
    nota_es: 'Precio con el beneficio por seguirnos en Instagram. Los niños de brazos no se cuentan.',
    nota_en: 'Price includes the discount for following us on Instagram. Babies in arms are free.',
  },
  'quinceanera': {
    plaza: 'Santa Marta', es: 'Quinceañeras', en: 'Quinceañeras',
    opciones: [
      { id: 'video-editado', es: 'Video editado', en: 'Edited video', price: 150000, unidad: 'video' },
      { id: 'video-fotos', es: 'Video editado + fotos', en: 'Edited video + photos', price: 200000, unidad: 'video' },
    ],
  },
};

/* Servicios por cotización (sin precio fijo) */
globalThis.FV23_COTIZA = [
  { id: 'pedida', es: 'Pedida de mano', en: 'Marriage proposal' },
  { id: 'boda', es: 'Boda', en: 'Wedding' },
  { id: 'evento', es: 'Cumpleaños, baby shower u otro evento', en: 'Birthday, baby shower or other event' },
  { id: 'empresa', es: 'Hotel, apartamento o empresa', en: 'Hotel, apartment or business' },
  { id: 'curso', es: 'Curso de dron para principiantes', en: 'Beginner drone course' },
  { id: 'otro', es: 'Otra idea', en: 'Something else' },
];

/* Calcula las líneas y el total de una reserva. sel = {svc, opt, dur, qty, horas, video, deco}.
   Devuelve {lines:[{desc, qty, unit, total}], total, cotizacion}. Lo usan la página y el script de Google. */
globalThis.fv23Calc = function (sel, lang) {
  var P = globalThis.FV23_PRECIOS, svc = P[sel.svc];
  lang = lang === 'en' ? 'en' : 'es';
  var res = { lines: [], total: 0, cotizacion: false, desde: false };
  if (!svc) return res;
  var opt = (svc.opciones || []).filter(function (o) { return o.id === sel.opt; })[0];
  if (!opt) return res;
  if (opt.price === null) { res.cotizacion = true; res.lines.push({ desc: opt[lang], qty: 1, unit: 0, total: 0 }); return res; }
  var qty = Math.max(1, parseInt(sel.qty, 10) || 1);
  var horas = Math.max(1, parseInt(sel.horas, 10) || 1);
  function add(desc, q, unit) { res.lines.push({ desc: desc, qty: q, unit: unit, total: q * unit }); res.total += q * unit; }
  if (sel.svc === 'jetski') {
    var dur = sel.dur === 30 || sel.dur === '30' ? 30 : 60;
    add(opt[lang] + (lang === 'en' ? (dur === 30 ? ' · 30 min' : ' · 1 hour') : (dur === 30 ? ' · 30 min' : ' · 1 hora')), qty, opt.price[dur]);
  } else if (svc.porHora) {
    add(opt[lang] + (lang === 'en' ? ' (per hour)' : ' (por hora)'), horas, opt.price);
  } else if (sel.svc === 'video-jetski') {
    var u = opt.unidad === 'persona' ? (lang === 'en' ? ' (per person)' : ' (por persona)') : (lang === 'en' ? ' (per jetski)' : ' (por jetski)');
    add(opt[lang] + u, qty, opt.price);
  } else {
    add(opt[lang], 1, opt.price);
  }
  if (svc.decoracion && sel.deco) {
    add(svc.decoracion[lang] + (lang === 'en' ? ' · from' : ' · desde'), 1, svc.decoracion.price);
    res.desde = true;
  }
  if (svc.video && sel.video) {
    var v = svc.video.filter(function (x) { return x.id === sel.video; })[0];
    if (v && v.price > 0 && (!v.solo || v.solo === sel.opt)) add(v[lang], v.porHora ? horas : 1, v.price);
  }
  return res;
};
globalThis.fv23Money = function (n) { return '$' + Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'); };


/* ===== Logo (PNG en base64) ===== */
var LOGO = 'data:image/png;base64,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';

/* ===== Puntos de entrada ===== */
function doGet() {
  return ContentService.createTextOutput('Flyview23 · reservas activas');
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
    var d = JSON.parse(e.postData.contents);
    var r;
    if (d.tipo === 'reserva') r = reserva_(d);
    else if (d.tipo === 'cotizacion') r = cotizacion_(d);
    else if (d.tipo === 'comunidad') r = comunidad_(d);
    else throw new Error('tipo desconocido');
    return json_(r);
  } catch (err) {
    console.error(err);
    return json_({ ok: false, error: String(err && err.message || err) });
  } finally {
    try { lock.releaseLock(); } catch (x) {}
  }
}

/** Ejecuta esto una vez desde el editor: crea la hoja y la carpeta y pide los permisos. */
function configurar() {
  hoja_('Reservas'); hoja_('Cotizaciones'); hoja_('Comunidad'); carpeta_();
  CalendarApp.getDefaultCalendar();
  console.log('Listo. Hoja: ' + libro_().getUrl());
}

/* ===== Reservas ===== */
function reserva_(d) {
  var f = limpiar_(d.datos), sel = d.sel || {};
  requerir_(f, ['nombre', 'whatsapp', 'correo', 'fecha', 'hora']);
  var svc = FV23_PRECIOS[sel.svc];
  if (!svc) throw new Error('servicio no válido');
  var c = fv23Calc(sel, 'es');
  if (!c.lines.length) throw new Error('opción no válida');
  if (c.cotizacion) return cotizacion_(d);

  var num = numero_();
  var inicio = fecha_(f.fecha, f.hora);
  var minutos = sel.svc === 'jetski' ? (String(sel.dur) === '30' ? 30 : 60) : svc.porHora ? 60 * Math.max(1, parseInt(sel.horas, 10) || 1) : 60;
  var fin = new Date(inicio.getTime() + minutos * 60000);

  var detalle = c.lines.map(function (l) { return '• ' + l.desc + (l.qty > 1 ? ' × ' + l.qty : '') + ': ' + fv23Money(l.total); }).join('\n');
  var cal = CalendarApp.getDefaultCalendar();
  var cruce = cal.getEvents(inicio, fin).length > 0;
  var ev = cal.createEvent('🟠 ' + svc.es + ' · ' + f.nombre, inicio, fin, {
    location: svc.plaza,
    description: 'Factura ' + num + '\n' + detalle + '\nTotal: ' + fv23Money(c.total) + (c.desde ? ' (desde)' : '') +
      '\n\nCliente: ' + f.nombre + '\nWhatsApp: ' + f.whatsapp + '\nCorreo: ' + f.correo + (f.notas ? '\nNotas: ' + f.notas : '') +
      '\n\nEscribirle: https://wa.me/' + soloDigitos_(f.whatsapp),
  });
  ev.setColor(CalendarApp.EventColor.ORANGE);

  var pdf = facturaPdf_(num, f, svc, c, inicio);
  carpeta_().createFile(pdf);

  var es = d.lang !== 'en';
  MailApp.sendEmail({
    to: f.correo, replyTo: CFG.DUENO, name: 'Flyview23',
    subject: (es ? 'Tu reserva en Flyview23 · ' : 'Your Flyview23 booking · ') + num,
    htmlBody: correoCliente_(es, f, svc, c, num, inicio),
    attachments: [pdf],
  });
  MailApp.sendEmail({
    to: CFG.DUENO, name: 'Reservas Flyview23',
    subject: (cruce ? '⚠️ CRUCE DE HORARIO · ' : '') + 'Nueva reserva ' + num + ' · ' + svc.es + ' · ' + f.fecha + ' ' + f.hora,
    htmlBody: '<p><b>' + esc_(f.nombre) + '</b> reservó <b>' + esc_(svc.es) + '</b> (' + svc.plaza + ') para el <b>' + esc_(f.fecha) + ' a las ' + esc_(f.hora) + '</b>.</p>' +
      (cruce ? '<p style="color:#c00"><b>Ojo: ya tienes otro evento en el calendario a esa hora.</b></p>' : '') +
      '<pre style="font-family:inherit">' + esc_(detalle) + '\nTotal: ' + fv23Money(c.total) + (c.desde ? ' (desde)' : '') + '</pre>' +
      '<p>WhatsApp: <a href="https://wa.me/' + soloDigitos_(f.whatsapp) + '">' + esc_(f.whatsapp) + '</a> · Correo: ' + esc_(f.correo) + '</p>' +
      (f.notas ? '<p>Notas: ' + esc_(f.notas) + '</p>' : '') + '<p>Ya quedó en tu calendario y la factura va adjunta.</p>',
    attachments: [pdf],
  });
  hoja_('Reservas').appendRow([new Date(), num, svc.plaza, svc.es, c.lines.map(function (l) { return l.desc + (l.qty > 1 ? ' × ' + l.qty : ''); }).join(' | '),
    c.total, c.desde ? 'desde' : '', f.fecha, f.hora, f.nombre, "'" + f.whatsapp, f.correo, f.notas || '', 'Pendiente de abono', d.origen || '']);
  return { ok: true, factura: num };
}

/* ===== Cotizaciones ===== */
function cotizacion_(d) {
  var f = limpiar_(d.datos), sel = d.sel || {};
  requerir_(f, ['nombre', 'whatsapp', 'correo']);
  var tipo = (FV23_COTIZA.filter(function (x) { return x.id === f.tipo; })[0] || {}).es;
  if (!tipo && sel.svc && FV23_PRECIOS[sel.svc]) {
    var o = FV23_PRECIOS[sel.svc].opciones.filter(function (x) { return x.id === sel.opt; })[0];
    tipo = FV23_PRECIOS[sel.svc].es + (o ? ' · ' + o.es : '');
  }
  tipo = tipo || 'Cotización';
  hoja_('Cotizaciones').appendRow([new Date(), tipo, f.lugar || (sel.svc && FV23_PRECIOS[sel.svc] ? FV23_PRECIOS[sel.svc].plaza : ''), f.fecha || '', f.hora || '', f.personas || '',
    f.nombre, "'" + f.whatsapp, f.correo, f.notas || '', 'Por cotizar']);
  MailApp.sendEmail({
    to: CFG.DUENO, name: 'Reservas Flyview23', subject: 'Nueva cotización · ' + tipo + ' · ' + f.nombre,
    htmlBody: '<p><b>' + esc_(f.nombre) + '</b> pide cotización de <b>' + esc_(tipo) + '</b>.</p><p>Lugar: ' + esc_(f.lugar || '') + ' · Fecha: ' + esc_(f.fecha || '') + ' ' + esc_(f.hora || '') +
      ' · Personas: ' + esc_(f.personas || '') + '</p><p>Idea: ' + esc_(f.notas || '') + '</p><p>WhatsApp: <a href="https://wa.me/' + soloDigitos_(f.whatsapp) + '">' + esc_(f.whatsapp) + '</a> · ' + esc_(f.correo) + '</p>',
  });
  var es = d.lang !== 'en';
  MailApp.sendEmail({
    to: f.correo, replyTo: CFG.DUENO, name: 'Flyview23',
    subject: es ? 'Recibimos tu solicitud · Flyview23' : 'We got your request · Flyview23',
    htmlBody: marco_(es ? '¡Gracias, ' + esc_(f.nombre) + '!' : 'Thanks, ' + esc_(f.nombre) + '!',
      es ? 'Recibimos tu solicitud de <b>' + esc_(tipo) + '</b>. Te escribimos por WhatsApp con la cotización.'
         : 'We received your request for <b>' + esc_(tipo) + '</b>. We will message you on WhatsApp with your quote.'),
  });
  return { ok: true };
}

/* ===== Comunidad ===== */
function comunidad_(d) {
  var f = limpiar_(d.datos);
  requerir_(f, ['nombre', 'whatsapp', 'correo']);
  hoja_('Comunidad').appendRow([new Date(), f.nombre, "'" + f.whatsapp, f.correo, f.ciudad || '', d.lang || 'es', f.acepto ? 'Sí' : '']);
  var es = d.lang !== 'en';
  MailApp.sendEmail({
    to: f.correo, replyTo: CFG.DUENO, name: 'Flyview23',
    subject: es ? 'Bienvenido a la comunidad Flyview23' : 'Welcome to the Flyview23 community',
    htmlBody: marco_(es ? '¡Bienvenido, ' + esc_(f.nombre) + '!' : 'Welcome, ' + esc_(f.nombre) + '!',
      es ? 'Desde ahora te llegan primero los lugares más bonitos de Santa Marta y Guatapé vistos desde el cielo, y nuestras promociones.'
         : 'From now on you will be the first to see the most beautiful places in Santa Marta and Guatapé from the sky, plus our promos.'),
  });
  return { ok: true };
}

/* ===== Factura en PDF ===== */
function facturaPdf_(num, f, svc, c, inicio) {
  var filas = c.lines.map(function (l) {
    return '<tr><td>' + esc_(l.desc) + '</td><td class="n">' + l.qty + '</td><td class="n">' + fv23Money(l.unit) + '</td><td class="n">' + fv23Money(l.total) + '</td></tr>';
  }).join('');
  var hoy = Utilities.formatDate(new Date(), CFG.ZONA, 'dd/MM/yyyy');
  var cuando = Utilities.formatDate(inicio, CFG.ZONA, "dd/MM/yyyy 'a las' HH:mm");
  var html = '<html><head><meta charset="utf-8"><style>' +
    'body{font-family:Arial,Helvetica,sans-serif;color:#111;margin:0;font-size:12px}' +
    '.top{background:#0b0b0b;color:#fff;padding:26px 34px;border-bottom:6px solid #F5821F}' +
    '.top table{width:100%}.brand{font-size:24px;font-weight:bold;letter-spacing:2px}.brand span{color:#F5821F}' +
    '.doc{text-align:right;font-size:11px;color:#ccc}.doc b{display:block;font-size:18px;color:#F5821F;letter-spacing:1px}' +
    '.wrap{padding:26px 34px}h3{font-size:11px;letter-spacing:2px;color:#F5821F;margin:0 0 6px;text-transform:uppercase}' +
    '.cols{width:100%;margin-bottom:22px}.cols td{vertical-align:top;width:50%;font-size:12px;line-height:1.6}' +
    'table.it{width:100%;border-collapse:collapse;margin-bottom:8px}.it th{background:#111;color:#fff;text-align:left;padding:9px 10px;font-size:11px}' +
    '.it td{padding:9px 10px;border-bottom:1px solid #e5e5e5}.n{text-align:right;white-space:nowrap}' +
    '.tot{width:100%;margin:8px 0 22px}.tot td{padding:10px;font-size:15px;font-weight:bold}.tot .lbl{text-align:right}.tot .val{text-align:right;background:#F5821F;color:#000;width:170px}' +
    '.cond{background:#f6f6f6;border-left:4px solid #F5821F;padding:14px 16px;font-size:11px;line-height:1.65}' +
    '.foot{margin-top:22px;font-size:10.5px;color:#666;text-align:center}' +
    '</style></head><body>' +
    '<div class="top"><table><tr><td style="width:84px"><img src="' + LOGO + '" width="72" height="72"></td>' +
    '<td><div class="brand">FLYVIEW<span>23</span></div><div style="font-size:11px;color:#ccc">Video con dron y experiencias · Guatapé · Santa Marta</div></td>' +
    '<td class="doc"><b>FACTURA DE RESERVA</b>N.º ' + num + '<br>Fecha: ' + hoy + '</td></tr></table></div>' +
    '<div class="wrap"><table class="cols"><tr><td><h3>Cliente</h3><b>' + esc_(f.nombre) + '</b><br>WhatsApp: ' + esc_(f.whatsapp) + '<br>Correo: ' + esc_(f.correo) + '</td>' +
    '<td><h3>Servicio</h3><b>' + esc_(svc.es) + '</b><br>Lugar: ' + svc.plaza + '<br>Fecha: ' + cuando + '</td></tr></table>' +
    '<table class="it"><tr><th>Descripción</th><th class="n">Cant.</th><th class="n">Valor unitario</th><th class="n">Total</th></tr>' + filas + '</table>' +
    '<table class="tot"><tr><td class="lbl">TOTAL' + (c.desde ? ' (desde)' : '') + '</td><td class="val">' + fv23Money(c.total) + ' COP</td></tr></table>' +
    (f.notas ? '<p><b>Notas:</b> ' + esc_(f.notas) + '</p>' : '') +
    '<div class="cond"><b>Condiciones de pago y reserva</b><br>' +
    '• Para confirmar la reserva se paga un abono; el saldo se paga el día del servicio.<br>' +
    '• Si cancelas, el valor abonado no se devuelve.<br>' +
    '• Si llueve, se reprograma la hora del mismo día o se acuerda una nueva fecha, conservando el abono.<br>' +
    '• Llega 15 minutos antes de tu hora.<br>' +
    '• Pagos en efectivo (pesos) o transferencia. Pagos con datáfono o link de pago tienen un recargo del 10 %.' +
    (c.desde ? '<br>• La decoración tiene valor desde $250.000; el valor final depende de lo que elijas.' : '') +
    '</div><div class="foot">Flyview23 · WhatsApp +57 321 645 0983 · flyview23@gmail.com · @flyview23 · flyview23.com</div></div></body></html>';
  return Utilities.newBlob(html, 'text/html', 'Factura ' + num + '.html').getAs('application/pdf').setName('Factura ' + num + ' - ' + f.nombre + '.pdf');
}

function correoCliente_(es, f, svc, c, num, inicio) {
  var cuando = Utilities.formatDate(inicio, CFG.ZONA, es ? "dd/MM/yyyy 'a las' HH:mm" : "MM/dd/yyyy 'at' HH:mm");
  var lineas = c.lines.map(function (l) { return esc_(l.desc) + (l.qty > 1 ? ' × ' + l.qty : '') + ': <b>' + fv23Money(l.total) + '</b>'; }).join('<br>');
  var wa = 'https://wa.me/' + CFG.WHATSAPP + '?text=' + encodeURIComponent((es ? 'Hola Flyview23, quiero confirmar mi reserva ' : 'Hi Flyview23, I want to confirm my booking ') + num);
  return marco_(es ? '¡Tu experiencia está apartada, ' + esc_(f.nombre) + '!' : 'Your experience is on hold, ' + esc_(f.nombre) + '!',
    (es ? '<b>' + esc_(svc.es) + '</b> en ' + svc.plaza + ', el ' + cuando + '.' : '<b>' + esc_(svc.en) + '</b> in ' + svc.plaza + ', on ' + cuando + '.') +
    '<br><br>' + lineas + '<br>' + (es ? 'Total' : 'Total') + (c.desde ? (es ? ' (desde)' : ' (from)') : '') + ': <b>' + fv23Money(c.total) + ' COP</b>' +
    '<br><br>' + (es ? 'Te adjuntamos tu factura ' + num + '. Para dejarla confirmada, escríbenos por WhatsApp y te pasamos los datos del abono.'
                     : 'Your invoice ' + num + ' is attached. To confirm it, message us on WhatsApp and we will send you the deposit details.') +
    '<br><br><a href="' + wa + '" style="display:inline-block;background:#F5821F;color:#000;font-weight:bold;padding:12px 22px;border-radius:30px;text-decoration:none">' +
    (es ? 'Confirmar por WhatsApp' : 'Confirm on WhatsApp') + '</a>');
}

function marco_(titulo, cuerpo) {
  return '<div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:auto;border:1px solid #eee;border-radius:14px;overflow:hidden">' +
    '<div style="background:#0b0b0b;padding:20px 24px;border-bottom:5px solid #F5821F"><img src="' + LOGO + '" width="48" height="48" alt="Flyview23" style="vertical-align:middle">' +
    '<span style="color:#fff;font-weight:bold;letter-spacing:2px;margin-left:12px;vertical-align:middle">FLYVIEW<span style="color:#F5821F">23</span></span></div>' +
    '<div style="padding:24px;color:#111;font-size:15px;line-height:1.6"><h2 style="margin:0 0 12px;font-size:20px">' + titulo + '</h2>' + cuerpo + '</div>' +
    '<div style="padding:14px 24px;background:#f6f6f6;font-size:12px;color:#666">No solo capturamos momentos, creamos recuerdos que se quedan para siempre. · @flyview23</div></div>';
}

/* ===== Utilidades ===== */
function json_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
function esc_(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
function soloDigitos_(s) { var d = String(s).replace(/\D/g, ''); return d.length === 10 ? '57' + d : d; }
function limpiar_(o) {
  var r = {}; o = o || {};
  Object.keys(o).forEach(function (k) { r[k] = typeof o[k] === 'string' ? o[k].trim().slice(0, 1200) : o[k]; });
  return r;
}
function requerir_(f, campos) {
  campos.forEach(function (k) { if (!f[k]) throw new Error('falta ' + k); });
  if (f.correo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.correo)) throw new Error('correo no válido');
}
function fecha_(dia, hora) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dia) || !/^\d{2}:\d{2}$/.test(hora)) throw new Error('fecha u hora no válida');
  return new Date(dia + 'T' + hora + ':00-05:00');
}
function numero_() {
  var p = PropertiesService.getScriptProperties();
  var n = (parseInt(p.getProperty('consecutivo'), 10) || 0) + 1;
  p.setProperty('consecutivo', String(n));
  return 'FV23-' + Utilities.formatDate(new Date(), CFG.ZONA, 'yyMMdd') + '-' + ('000' + n).slice(-4);
}
function libro_() {
  var p = PropertiesService.getScriptProperties(), id = p.getProperty('hoja');
  if (id) { try { return SpreadsheetApp.openById(id); } catch (e) {} }
  var ss = SpreadsheetApp.create(CFG.HOJA); p.setProperty('hoja', ss.getId()); return ss;
}
var ENCABEZADOS = {
  Reservas: ['Recibida', 'Factura', 'Plaza', 'Servicio', 'Detalle', 'Total', '', 'Fecha', 'Hora', 'Nombre', 'WhatsApp', 'Correo', 'Notas', 'Estado', 'Origen'],
  Cotizaciones: ['Recibida', 'Tipo', 'Lugar', 'Fecha', 'Hora', 'Personas', 'Nombre', 'WhatsApp', 'Correo', 'Idea', 'Estado'],
  Comunidad: ['Registro', 'Nombre', 'WhatsApp', 'Correo', 'Ciudad', 'Idioma', 'Acepta contenido'],
};
function hoja_(nombre) {
  var ss = libro_(), sh = ss.getSheetByName(nombre);
  if (!sh) {
    sh = ss.insertSheet(nombre); sh.appendRow(ENCABEZADOS[nombre]); sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, ENCABEZADOS[nombre].length).setFontWeight('bold').setBackground('#F5821F');
    var h1 = ss.getSheetByName('Hoja 1') || ss.getSheetByName('Sheet1'); if (h1 && ss.getSheets().length > 1) ss.deleteSheet(h1);
  }
  return sh;
}
function carpeta_() {
  var p = PropertiesService.getScriptProperties(), id = p.getProperty('carpeta');
  if (id) { try { return DriveApp.getFolderById(id); } catch (e) {} }
  var f = DriveApp.createFolder(CFG.CARPETA); p.setProperty('carpeta', f.getId()); return f;
}
