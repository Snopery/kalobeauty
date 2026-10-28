/* KALOBEAUTY page logic. You normally do not need to edit this file.
   Edit data/services.js instead. */
(function () {
  var PROBLEMS = [];
  var ICONS = ['lash', 'refill', 'removal', 'tint', 'liftext', 'liftbrow', 'browwax', 'lipwax', 'chinwax', 'sidewax'];

  // Reads the plain-text content in data/services.js
  function parse(text) {
    var K = { bookUrl: '', calendarId: '', categories: [], services: [], refillGuide: null, gallery: null };
    var cat = null, svc = null, opt = null, inRefill = false, inGallery = false, gpic = null, line;
    var lines = String(text || '').split(/\r?\n/);
    function problem(n, msg) { PROBLEMS.push('Line ' + n + ': ' + msg); }
    lines.forEach(function (raw, i) {
      line = raw.trim();
      if (!line || line.charAt(0) === '#') return;
      var m = line.match(/^([A-Za-z ]+?)\s*:\s*(.*)$/);
      var key = m ? m[1].toLowerCase() : line.toLowerCase();
      var val = m ? m[2].trim() : '';
      if (key === 'gallery') { inGallery = true; inRefill = false; cat = svc = opt = null; K.gallery = { title: '', photos: [] }; return; }
      if (inGallery) {
        if (key === 'title') K.gallery.title = val;
        else if (key === 'photo') { gpic = { file: val, caption: '' }; K.gallery.photos.push(gpic); }
        else if (key === 'caption' && gpic) gpic.caption = val;
        else if (key === 'refill guide') { /* handled below */ }
        else { problem(i + 1, 'Not understood in the gallery: "' + line + '"'); return; }
        if (key !== 'refill guide') return;
      }
      if (key === 'refill guide') { inRefill = true; inGallery = false; cat = svc = opt = null; K.refillGuide = { title: '', question: '', options: [] }; return; }
      if (inRefill) {
        var g = K.refillGuide;
        if (key === 'title') g.title = val;
        else if (key === 'question') g.question = val;
        else if (key === 'option') { opt = { label: val, service: '', note: '' }; g.options.push(opt); }
        else if (opt && key === 'service') opt.service = val;
        else if (opt && key === 'note') opt.note = val;
        else problem(i + 1, 'Not understood in the refill guide: "' + line + '"');
        return;
      }
      if (key === 'booking link') K.bookUrl = val;
      else if (key === 'calendar number') K.calendarId = val;
      else if (key === 'category') { cat = { id: 'c' + K.categories.length, label: val, note: '' }; K.categories.push(cat); svc = null; }
      else if (key === 'service') {
        if (!cat) { problem(i + 1, 'Service "' + val + '" is not under a CATEGORY: line.'); svc = null; return; }
        svc = { id: 's' + K.services.length, category: cat.id, short: val, name: val, time: '', price: '', appointmentId: '', image: '', icon: 'lash', tag: '', description: '' };
        K.services.push(svc);
      }
      else if (key === 'note' && cat && !svc) cat.note = val;
      else if (svc && key === 'full name') svc.name = val;
      else if (svc && key === 'price') svc.price = val;
      else if (svc && key === 'time') svc.time = val;
      else if (svc && key === 'booking number') svc.appointmentId = val.replace(/\D/g, '');
      else if (svc && key === 'photo') svc.image = val;
      else if (svc && key === 'icon') { svc.icon = val.toLowerCase(); if (ICONS.indexOf(svc.icon) < 0) { problem(i + 1, 'Unknown icon "' + val + '". Using lash.'); svc.icon = 'lash'; } }
      else if (svc && key === 'badge') svc.tag = val;
      else if (svc && key === 'description') svc.description = val;
      else problem(i + 1, 'Not understood: "' + line + '"');
    });
    K.services.forEach(function (s) {
      ['price', 'time', 'appointmentId'].forEach(function (f) { if (!s[f]) PROBLEMS.push('"' + s.short + '" is missing ' + (f === 'appointmentId' ? 'Booking number' : f.charAt(0).toUpperCase() + f.slice(1)) + '.'); });
    });
    if (!K.bookUrl) PROBLEMS.push('Booking link is missing.');
    if (K.refillGuide) K.refillGuide.options = K.refillGuide.options.filter(function (o) {
      var ok = K.services.some(function (s) { return s.short.toLowerCase() === o.service.toLowerCase(); });
      if (!ok) PROBLEMS.push('Refill option "' + o.label + '" uses Service "' + o.service + '" which is not a SERVICE name.');
      return ok;
    });
    if (K.refillGuide && !K.refillGuide.options.length) K.refillGuide = null;
    if (K.gallery && !K.gallery.photos.length) K.gallery = null;
    return K;
  }

  var K = parse(window.KALO_CONTENT);
  var BOOK = K.bookUrl;
  var A = function (id) { return BOOK + '/appointment/' + id + '/calendar/' + K.calendarId; };
  var byId = {};
  K.services.forEach(function (s) { byId[s.id] = s; });
  if (K.refillGuide) K.refillGuide.options.forEach(function (o) {
    o.service = K.services.filter(function (s) { return s.short.toLowerCase() === o.service.toLowerCase(); })[0].id;
  });

  // Show any mistakes in the content file as a visible notice (only you will notice it)
  if (PROBLEMS.length) {
    console.warn('KALOBEAUTY content problems:\n' + PROBLEMS.join('\n'));
    var box = document.createElement('div');
    box.setAttribute('style', 'background:#fff3cd;color:#4a3300;border-bottom:2px solid #e0a800;padding:12px 16px;font:15px/1.4 sans-serif');
    box.innerHTML = '<strong>Content file needs attention (data/services.js):</strong><ul style="margin:6px 0 0 18px;padding:0">' + PROBLEMS.map(function (p) { return '<li>' + p.replace(/[&<>]/g, '') + '</li>'; }).join('') + '</ul>';
    document.body.insertBefore(box, document.body.firstChild);
  }

  // Make the header and footer Book buttons use the booking link
  Array.prototype.forEach.call(document.querySelectorAll('[data-book]'), function (a) { a.href = BOOK; });

  // Line drawings for services without a photo
  var INK = '#1C1214', ROSE = '#8F4B57', LIGHT = '#F8F1F1';
  function lashD(pick, dy, scale, cm) {
    var d = '', i = 0;
    for (var a = 198; a <= 342; a += 6, i++) {
      if (!pick(i)) continue;
      var r = a * Math.PI / 180;
      var bx = 300 + 250 * Math.cos(r), by = 290 + dy + 100 * Math.sin(r);
      var nx = Math.cos(r) / 250, ny = Math.sin(r) / 100, m = Math.hypot(nx, ny);
      nx /= m; ny /= m;
      var t = (a - 198) / 144;
      var L = (44 + 50 * Math.sin(Math.PI * t) + 20 * t) * scale;
      var curl = (t - 0.5) * 26 * scale * cm;
      var tx = bx + nx * L + curl * 0.6, ty = by + ny * L;
      var cx = bx + nx * L * 0.55 - ny * curl * 0.4, cy = by + ny * L * 0.55 + nx * curl * 0.4;
      d += 'M' + bx.toFixed(1) + ' ' + by.toFixed(1) + ' Q' + cx.toFixed(1) + ' ' + cy.toFixed(1) + ' ' + tx.toFixed(1) + ' ' + ty.toFixed(1) + ' ';
    }
    return d;
  }
  function disc(cx, cy, r) { return 'M' + (cx - r) + ' ' + cy + ' a' + r + ' ' + r + ' 0 1 0 ' + (2 * r) + ' 0 a' + r + ' ' + r + ' 0 1 0 ' + (-2 * r) + ' 0 Z'; }
  var LID = { d: 'M50 290 A250 100 0 0 1 550 290', s: INK, w: 2.4 };
  var LOW = { d: 'M50 290 A250 70 0 0 0 550 290', s: ROSE, w: 1.6 };
  var BROW = { d: 'M92 96 Q300 6 508 74', s: INK, w: 12 };
  var BADGE = { d: disc(520, 80, 40), s: 'none', w: 0, f: ROSE };
  function sign(d) { return { d: d, s: LIGHT, w: 6 }; }
  var ART = {
    lash: [BROW, { d: lashD(function () { return true; }, 0, 1, 1), s: INK, w: 2.4 }, LID, LOW],
    refill: [{ d: lashD(function (i) { return i % 3 !== 1; }, 0, 1, 1), s: INK, w: 2.4 }, { d: lashD(function (i) { return i % 3 === 1; }, 0, 1, 1), s: ROSE, w: 4.2 }, LID, LOW, BADGE, sign('M520 62 V98 M502 80 H538')],
    removal: [{ d: lashD(function (i) { return i % 2 === 0; }, -64, 1, 1), s: ROSE, w: 2.6, da: [9, 9] }, { d: lashD(function () { return true; }, 0, 0.42, 1), s: INK, w: 2.4 }, LID, LOW, BADGE, sign('M502 80 H538')],
    tint: [{ d: lashD(function () { return true; }, 0, 1, 1), s: INK, w: 5 }, LID, LOW, { d: 'M520 40 C508 64 490 80 490 100 A30 30 0 0 0 550 100 C550 80 532 64 520 40 Z', s: 'none', w: 0, f: ROSE }],
    liftext: [{ d: lashD(function (i) { return i % 4 !== 2; }, 0, 1, 2.4), s: INK, w: 2.4 }, { d: lashD(function (i) { return i % 4 === 2; }, 0, 1.35, 2.4), s: ROSE, w: 3.6 }, LID, LOW, BADGE, sign('M520 98 V62 M504 78 L520 62 L536 78')],
    liftbrow: [BROW, { d: lashD(function () { return true; }, 0, 1, 2.4), s: INK, w: 2.4 }, LID, LOW],
    browwax: [{ d: 'M100 230 Q290 80 500 170', s: INK, w: 22 }, { d: 'M170 262 l-8 24 M235 236 l-6 26 M305 214 l-4 26', s: ROSE, w: 4, da: [7, 8] }, { d: 'M390 318 L500 258', s: ROSE, w: 30 }],
    lipwax: [{ d: 'M170 210 Q235 160 300 192 Q365 160 430 210 Q300 226 170 210 Z', s: INK, w: 4 }, { d: 'M170 210 Q300 320 430 210', s: INK, w: 4 }, { d: 'M235 120 l0 26 M270 108 l0 30 M300 104 l0 32 M330 108 l0 30 M365 120 l0 26', s: ROSE, w: 5 }],
    chinwax: [{ d: 'M120 110 Q120 330 300 348 Q480 330 480 110', s: INK, w: 4 }, { d: 'M240 280 l0 -26 M270 292 l0 -30 M300 296 l0 -32 M330 292 l0 -30 M360 280 l0 -26', s: ROSE, w: 5 }],
    sidewax: [{ d: 'M370 60 Q300 190 370 330', s: INK, w: 4 }, { d: 'M296 120 H336 M290 165 H330 M290 210 H334 M300 255 H344', s: ROSE, w: 6 }]
  };
  function artSvg(icon, k, cap) {
    var out = '<svg viewBox="0 0 600 380" aria-hidden="true" focusable="false" fill="none" stroke-linecap="round" stroke-linejoin="round">';
    (ART[icon]||ART['lash']).forEach(function (p) {
      var w = Math.min(p.w * k, cap);
      out += '<path d="' + p.d + '" stroke="' + p.s + '" stroke-width="' + w + '" fill="' + (p.f || 'none') + '"' + (p.da ? ' stroke-dasharray="' + (p.da[0] * k) + ' ' + (p.da[1] * k) + '"' : '') + '/>';
    });
    return out + '</svg>';
  }


  var el = function (id) { return document.getElementById(id); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var ARROW = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  var CHECK = '<span class="check"><svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span>';

  var first = function (cat) { return K.services.filter(function (s) { return s.category === cat; })[0]; };
  var state = { cat: K.categories[0].id, sel: null, refill: 0 };
  state.sel = (first(state.cat) || {}).id;

  // Shows the photo; if the file is missing, falls back to the drawn icon
  function media(s, k, cap, alt) {
    if (s.image) return '<img src="images/' + esc(s.image) + '" alt="' + esc(alt) + '" onerror="this.outerHTML=window.KALO_ART(\'' + esc(s.icon) + '\',' + k + ',' + cap + ')">';
    return artSvg(s.icon, k, cap);
  }
  window.KALO_ART = artSvg;

  function render() {
    var active = document.activeElement && document.activeElement.getAttribute('data-k');
    var items = K.services.filter(function (s) { return s.category === state.cat; });
    var cat = K.categories.filter(function (c) { return c.id === state.cat; })[0];
    var cur = byId[state.sel];
    if (!cur || cur.category !== state.cat) cur = items[0];
    if (cur) state.sel = cur.id;

    el('tabs').innerHTML = K.categories.map(function (c) {
      var n = K.services.filter(function (s) { return s.category === c.id; }).length;
      return '<button class="tab" type="button" data-k="cat-' + esc(c.id) + '" data-cat="' + esc(c.id) + '" aria-pressed="' + (c.id === state.cat) + '"><span>' + esc(c.label) + '</span><span class="count">' + n + '</span></button>';
    }).join('');

    el('grid').innerHTML = items.map(function (s) {
      var on = cur && s.id === cur.id;
      return '<button class="tile" type="button" data-k="svc-' + esc(s.id) + '" data-svc="' + esc(s.id) + '" aria-pressed="' + on + '"><span class="thumb">' + media(s, 4, 36, '') + '<span class="price-chip">' + esc(s.price) + '</span>' + (on ? CHECK : '') + '</span><span class="nm">' + esc(s.short || s.name) + '</span></button>';
    }).join('');

    el('note').textContent = (cat && cat.note) || '';

    el('stage').innerHTML = cur ?
      '<div class="photo">' + media(cur, 1, 999, cur.name) + (cur.tag ? '<span class="tag">' + esc(cur.tag) + '</span>' : '') + '</div>' +
      '<div class="title-row"><h2>' + esc(cur.name) + '</h2><span class="big-price">' + esc(cur.price) + ' <small>/ ' + esc(cur.time) + '</small></span></div>' +
      '<p class="desc">' + esc(cur.description) + '</p>' +
      '<a class="btn big" href="' + A(cur.appointmentId) + '" target="_blank" rel="noopener">Book this service' + ARROW + '</a>'
      : '<p class="desc">No services in this category yet.</p>';

    var g = K.refillGuide;
    if (g) {
      el('refill-title').textContent = g.title; el('refill-q').textContent = g.question;
      var ro = g.options[state.refill] || g.options[0];
      var rs = byId[ro.service];
      el('refill-opts').innerHTML = g.options.map(function (o, i) {
        return '<button class="tab" type="button" data-k="ref-' + i + '" data-refill="' + i + '" aria-pressed="' + (o === ro) + '">' + esc(o.label) + '</button>';
      }).join('');
      el('refill-card').innerHTML =
        '<div><h3>' + esc(rs.name) + '</h3><p style="margin:6px 0 0">' + esc(ro.note) + '</p></div>' +
        '<span class="big-price">' + esc(rs.price) + ' <small>/ ' + esc(rs.time) + '</small></span>' +
        '<a class="btn big" href="' + A(rs.appointmentId) + '" target="_blank" rel="noopener">Book this refill' + ARROW + '</a>';
    }

    if (active) {
      var again = document.querySelector('[data-k="' + active + '"]');
      if (again) again.focus();
    }
  }

  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-cat],[data-svc],[data-refill]');
    if (!b) return;
    if (b.hasAttribute('data-cat')) {
      state.cat = b.getAttribute('data-cat');
      var f = first(state.cat); state.sel = f && f.id;
    } else if (b.hasAttribute('data-svc')) {
      state.sel = b.getAttribute('data-svc');
    } else {
      state.refill = +b.getAttribute('data-refill');
    }
    render();
  });

  if (!K.refillGuide) { var rf = el('refill'); if (rf) rf.style.display = 'none'; var rn = el('refill-nav'); if (rn) rn.style.display = 'none'; }
  // ---------- Gallery ----------
  (function () {
    var sec = el('gallery');
    var G = K.gallery;
    if (!G) { if (sec) sec.style.display = 'none'; var gn = el('gallery-nav'); if (gn) gn.style.display = 'none'; return; }
    var strip = el('g-strip'), lb = el('lb'), lbImg = el('lb-img'), lbCap = el('lb-cap');
    var cur = 0, opener = null;
    el('gallery-title').textContent = G.title; if (!G.title) el('gallery-title').style.display = 'none';
    var photos = G.photos.slice();
    var start = 0;
    // Draws the strip starting at photo "start" and wrapping round, so it loops forever
    function build() {
      var order = photos.map(function (p, i) { return i; });
      order = order.slice(start).concat(order.slice(0, start));
      strip.innerHTML = order.map(function (i) {
        var p = photos[i];
        return '<button class="g-item" type="button" data-g="' + i + '" aria-label="Open photo ' + (i + 1) + ' of ' + photos.length + (p.caption ? ': ' + esc(p.caption) : '') + '"><img src="images/gallery/' + esc(p.file) + '" alt="' + esc(p.caption || 'KALOBEAUTY client work') + '" decoding="async">' + (p.caption ? '<span class="g-cap">' + esc(p.caption) + '</span>' : '') + '</button>';
      }).join('');
      strip.scrollLeft = 0;
      // Hide any photo whose file is missing
      Array.prototype.forEach.call(strip.querySelectorAll('img'), function (img) {
        img.addEventListener('error', function () { var b = img.closest('.g-item'); if (b) b.style.display = 'none'; });
      });
    }
    build();
    var prev = el('g-prev'), next = el('g-next');
    function step(d) { start = (start + d + photos.length) % photos.length; build(); }
    prev.addEventListener('click', function () { step(-1); });
    next.addEventListener('click', function () { step(1); });

    function show(i) {
      cur = (i + photos.length) % photos.length;
      var p = photos[cur];
      lbImg.src = 'images/gallery/' + p.file;
      lbImg.alt = p.caption || 'KALOBEAUTY client work';
      lbCap.textContent = p.caption || '';
    }
    function open(i, from) {
      opener = from; show(i); lb.hidden = false; document.body.classList.add('lb-open');
      el('lb-close').focus();
    }
    function close() {
      lb.hidden = true; document.body.classList.remove('lb-open');
      if (opener) { opener.focus(); var b = opener; b.scrollIntoView && b.scrollIntoView({ block: 'nearest', inline: 'nearest' }); }
    }
    strip.addEventListener('click', function (e) {
      var b = e.target.closest('[data-g]'); if (b) open(+b.getAttribute('data-g'), b);
    });
    el('lb-close').addEventListener('click', close);
    el('lb-prev').addEventListener('click', function () { show(cur - 1); });
    el('lb-next').addEventListener('click', function () { show(cur + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
    document.addEventListener('keydown', function (e) {
      if (lb.hidden) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') show(cur - 1);
      else if (e.key === 'ArrowRight') show(cur + 1);
      else if (e.key === 'Tab') {
        var f = [el('lb-close'), el('lb-prev'), el('lb-next')], i = f.indexOf(document.activeElement);
        e.preventDefault(); f[(i + (e.shiftKey ? 2 : 1)) % 3].focus();
      }
    });
    // Swipe on touch screens
    var sx = null;
    lb.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', function (e) {
      if (sx === null) return;
      var dx = e.changedTouches[0].clientX - sx; sx = null;
      if (Math.abs(dx) > 50) show(cur + (dx < 0 ? 1 : -1));
    });
  })();

  render();
})();
