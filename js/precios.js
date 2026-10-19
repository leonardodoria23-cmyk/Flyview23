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
