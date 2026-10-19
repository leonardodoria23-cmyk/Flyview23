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
{{PRECIOS}}

/* ===== Logo (PNG en base64) ===== */
var LOGO = 'data:image/png;base64,{{LOGO}}';

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
