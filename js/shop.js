/* KALOBEAUTY shop logic. You normally do not need to edit this file.
   Edit data/shop.js instead. */
(function () {
  var PROBLEMS = [];
  var ICONS = ['kit', 'cleanser', 'serum', 'brush', 'giftcard'];

  // ---------- Read data/shop.js ----------
  function parse(text) {
    var S = { title: 'Shop', intro: '', demo: true, symbol: 'A$', shipNote: '', endpoint: '/api/checkout', stockEndpoint: '/api/stock', productsEndpoint: '/api/products', max: 10, low: 3, showUpTo: 10, products: [] };
    var p = null;
    String(text || '').split(/\r?\n/).forEach(function (raw, i) {
      var line = raw.trim();
      if (!line || line.charAt(0) === '#') return;
      var m = line.match(/^([A-Za-z ]+?)\s*:\s*(.*)$/);
      if (!m) { PROBLEMS.push('Line ' + (i + 1) + ': Not understood: "' + line + '"'); return; }
      var key = m[1].toLowerCase(), val = m[2].trim();
      if (key === 'product') { p = { id: 'p' + S.products.length, name: val, price: 0, priceId: '', icon: 'kit', photo: '', badge: '', desc: '', soldOut: false, stock: null, demoStock: null, backorder: false }; S.products.push(p); }
      else if (key === 'title' && !p) S.title = val;
      else if (key === 'intro' && !p) S.intro = val;
      else if (key === 'demo mode' && !p) S.demo = ['no', 'off', 'false'].indexOf(val.toLowerCase()) < 0;
      else if (key === 'currency symbol' && !p) S.symbol = val;
      else if (key === 'shipping note' && !p) S.shipNote = val;
      else if (key === 'checkout endpoint' && !p) S.endpoint = val;
      else if (key === 'products endpoint' && !p) S.productsEndpoint = val;
      else if (key === 'stock display limit' && !p) S.showUpTo = Math.max(1, parseInt(val, 10) || 10);
      else if (key === 'low stock warning' && !p) S.low = Math.max(0, parseInt(val, 10) || 0);
      else if (p && key === 'backorder') p.backorder = ['yes', 'true', 'on'].indexOf(val.toLowerCase()) >= 0;
      else if (p && key === 'demo stock') p.demoStock = Math.max(0, parseInt(val, 10) || 0);
      else if (key === 'max per item' && !p) S.max = Math.max(1, Math.min(20, parseInt(val, 10) || 10));
      else if (p && key === 'price') p.price = parseFloat(val.replace(/[^0-9.]/g, '')) || 0;
      else if (p && key === 'stripe price id') p.priceId = val;
      else if (p && key === 'icon') { p.icon = val.toLowerCase(); if (ICONS.indexOf(p.icon) < 0) { PROBLEMS.push('Line ' + (i + 1) + ': Unknown icon "' + val + '". Using kit.'); p.icon = 'kit'; } }
      else if (p && key === 'photo') p.photo = val;
      else if (p && key === 'badge') p.badge = val;
      else if (p && key === 'description') p.desc = val;
      else if (p && key === 'sold out') p.soldOut = ['yes', 'true', 'on'].indexOf(val.toLowerCase()) >= 0;
      else PROBLEMS.push('Line ' + (i + 1) + ': Not understood: "' + line + '"');
    });
    if (S.demo) S.products.forEach(function (x) { if (!x.price) PROBLEMS.push('"' + x.name + '" is missing a Price.'); });
    return S;
  }
  var S = parse(window.KALO_SHOP_CONTENT);
  // Demo mode uses the sample products written in data/shop.js. Live mode ignores them and
  // loads the real products from Stripe (see loadProducts below).
  var byId = {};
  function setProducts(list) { S.products = list; byId = {}; list.forEach(function (x) { byId[x.id] = x; }); }
  setProducts(S.demo ? S.products : []);

  // Stock: null means not tracked. Live stock comes from Stripe via /api/products.
  function out(x) { return x.soldOut || (x.stock === 0 && !x.backorder); }
  function onBack(x) { return !x.soldOut && x.backorder && x.stock === 0; }
  function cap(x) { return (x.stock == null || x.backorder) ? S.max : Math.min(S.max, x.stock); }
  S.products.forEach(function (x) { if (S.demo && x.demoStock != null) x.stock = x.demoStock; });
  function demoSave() { try { var o = {}; S.products.forEach(function (x) { if (x.demoStock != null) o[x.id] = x.stock; }); localStorage.setItem('kalo-demo-stock', JSON.stringify(o)); } catch (e) {} }
  if (S.demo) { try { var ds = JSON.parse(localStorage.getItem('kalo-demo-stock') || '{}'); S.products.forEach(function (x) { if (x.demoStock != null && typeof ds[x.id] === 'number') x.stock = Math.min(x.demoStock, ds[x.id]); }); } catch (e) {} }

  var $ = function (id) { return document.getElementById(id); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var money = function (n) { return S.symbol + n.toFixed(2).replace(/\.00$/, '').replace(/(\.\d)0$/, '$1'); };
  var money2 = function (n) { return S.symbol + n.toFixed(2); };

  // Links from the main site's content file
  var kc = String(window.KALO_CONTENT || '');
  var bm = kc.match(/Booking link:\s*(\S+)/), im = kc.match(/Instagram link:\s*(\S+)/);
  if ($('book-link') && bm) $('book-link').href = bm[1];
  if ($('ig-link') && im) $('ig-link').href = im[1];

  // ---------- Line drawings for products ----------
  var INK = '#111111', ACC = '#6F5E4F';
  function bristles() {
    var d = '';
    for (var t = 0; t <= 12; t++) {
      var x = 388 + (480 - 388) * t / 12, y = 168 + (122 - 168) * t / 12;
      d += 'M' + (x - 10).toFixed(1) + ' ' + (y - 19).toFixed(1) + ' L' + (x + 10).toFixed(1) + ' ' + (y + 19).toFixed(1) + ' ';
    }
    return d;
  }
  var ART = {
    kit: [['M185 150 H415 V300 H185 Z', INK, 5], ['M168 108 H432 V150 H168 Z', INK, 5], ['M300 108 V300', ACC, 5], ['M300 108 C262 52 215 74 252 108 M300 108 C338 52 385 74 348 108', ACC, 5]],
    cleanser: [['M238 155 Q238 148 246 148 H354 Q362 148 362 155 V312 Q362 322 352 322 H248 Q238 322 238 312 Z', INK, 5], ['M282 148 V122 H318 V148', INK, 5], ['M300 122 V86 H344 V104', INK, 5], ['M258 205 H342 V262 H258 Z', ACC, 3], ['M300 230 m-9 0 a9 9 0 1 0 18 0 a9 9 0 1 0 -18 0', ACC, 3]],
    serum: [['M244 176 Q244 168 252 168 H348 Q356 168 356 176 V314 Q356 324 346 324 H254 Q244 324 244 314 Z', INK, 5], ['M278 168 V148 H322 V168', INK, 5], ['M286 148 V98 Q300 66 314 98 V148', ACC, 5], ['M262 232 H338 M262 256 H318', ACC, 3]],
    brush: [['M138 304 L368 184', ACC, 16], ['M372 182 L392 172', INK, 5], [bristles(), INK, 3], ['M388 168 L480 122', INK, 3]],
    giftcard: [['M138 112 H462 V312 H138 Z', INK, 5], ['M300 112 V312', ACC, 5], ['M138 212 H462', ACC, 5], ['M300 212 C260 150 218 172 252 208 M300 212 C340 150 382 172 348 208', ACC, 5]]
  };
  function art(icon) {
    var s = '<svg viewBox="0 0 600 380" aria-hidden="true" focusable="false" fill="none" stroke-linecap="round" stroke-linejoin="round">';
    (ART[icon] || ART.kit).forEach(function (p) { s += '<path d="' + p[0] + '" stroke="' + p[1] + '" stroke-width="' + p[2] + '"/>'; });
    return s + '</svg>';
  }
  function media(x, alt) {
    var src = x.imageUrl || (x.photo ? 'images/shop/' + x.photo : '');
    return src ? '<img src="' + esc(src) + '" alt="' + esc(alt || '') + '" loading="lazy" onerror="this.outerHTML=window.KALO_SHOP_ART(\'' + esc(x.icon) + '\')">' : art(x.icon);
  }
  window.KALO_SHOP_ART = art;

  // ---------- Bag (saved in this browser) ----------
  var bag = [];
  function restoreBag() { try { bag = JSON.parse(localStorage.getItem('kalo-bag') || '[]').filter(function (l) { return byId[l.id] && l.qty > 0; }); } catch (e) { bag = []; } }
  restoreBag();
  function save() { try { localStorage.setItem('kalo-bag', JSON.stringify(bag)); } catch (e) {} }
  function qtyOf(id) { var l = bag.filter(function (x) { return x.id === id; })[0]; return l ? l.qty : 0; }
  function setQty(id, q) {
    q = Math.max(0, Math.min(cap(byId[id]), q));
    bag = bag.filter(function (l) { return l.id !== id; });
    if (q > 0) bag.push({ id: id, qty: q });
    save(); drawBag(); drawGrid();
  }
  function count() { return bag.reduce(function (n, l) { return n + l.qty; }, 0); }
  function subtotal() { return bag.reduce(function (n, l) { return n + l.qty * byId[l.id].price; }, 0); }

  // ---------- Page ----------
  $('shop-title').textContent = S.title;
  $('shop-intro').textContent = S.intro;
  if (S.demo) $('demo-band').hidden = false;
  document.title = S.title + ' | KALOBEAUTY';

  var gridNote = S.demo ? '' : 'Loading products...';
  function drawGrid() {
    if (!S.products.length) { $('p-grid').innerHTML = gridNote ? '<p class="p-empty">' + esc(gridNote) + '</p>' : ''; return; }
    $('p-grid').innerHTML = S.products.map(function (x) {
      var left = '';
      if (x.stock != null && x.stock > 0) left = x.stock <= S.low ? '<span class="low">Only ' + x.stock + ' left</span>' : '<span class="stock">' + (x.stock > S.showUpTo ? S.showUpTo + '+' : x.stock) + ' in stock</span>';
      var gone = out(x), bo = onBack(x);
      if (bo) left = '<span class="low">Backorder</span>';
      return '<article class="p-card' + (gone ? ' is-out' : '') + '"><div class="p-art">' + media(x, x.name) + (x.badge && !gone ? '<span class="tag">' + esc(x.badge) + '</span>' : '') + (gone ? '<span class="tag">Sold out</span>' : '') + '</div>' +
        '<div class="p-body"><h3>' + esc(x.name) + '</h3>' + (x.desc ? '<p>' + esc(x.desc) + '</p>' : '') + left +
        '<div class="p-row"><span class="p-price">' + money(x.price) + '</span>' +
        (gone ? '<button class="btn sm" type="button" disabled>Sold out</button>' : qtyOf(x.id) >= cap(x) ? '<button class="btn sm" type="button" disabled>All in bag</button>' : '<button class="btn sm" type="button" data-add="' + x.id + '" aria-label="' + (bo ? 'Backorder ' : 'Add ') + esc(x.name) + ' to bag">' + (bo ? 'Backorder' : 'Add to bag') + '</button>') +
        '</div></div></article>';
    }).join('');
  }
  drawGrid();

  var NOTICE = $('notice');
  function say(msg) { NOTICE.textContent = msg; NOTICE.hidden = !msg; }

  var TICKER = 0;
  function drawBag() {
    bag = bag.filter(function (l) { var x = byId[l.id]; if (!x || out(x)) return false; if (l.qty > cap(x)) l.qty = cap(x); return true; });
    var n = count();
    $('bag-count').textContent = n;
    $('bag-count').classList.toggle('has', n > 0);
    $('bag-btn').setAttribute('aria-label', 'Open bag, ' + n + (n === 1 ? ' item' : ' items'));
    var lines = $('bag-lines'), foot = $('bag-foot');
    if (!bag.length) {
      lines.innerHTML = '<div class="bag-empty"><p class="serif">Your bag is empty</p><p>Add a product and it will appear here.</p><button class="btn ghost" type="button" data-close-bag>Continue shopping</button></div>';
      foot.innerHTML = '';
      return;
    }
    lines.innerHTML = bag.map(function (l) {
      var x = byId[l.id];
      return '<div class="b-line"><div class="b-thumb">' + media(x, '') + '</div><div class="b-info"><span class="b-name">' + esc(x.name) + '</span><span class="b-unit">' + money(x.price) + ' each' + (onBack(x) ? ' &middot; backorder, ships when restocked' : '') + '</span>' +
        '<div class="b-qty" role="group" aria-label="Quantity for ' + esc(x.name) + '"><button type="button" data-dec="' + x.id + '" aria-label="Remove one">&minus;</button><output>' + l.qty + '</output><button type="button" data-inc="' + x.id + '" aria-label="Add one"' + (l.qty >= cap(x) ? ' disabled' : '') + '>+</button></div></div>' +
        '<div class="b-side"><span class="b-total">' + money2(l.qty * x.price) + '</span><button class="b-rm" type="button" data-rm="' + x.id + '">Remove</button></div></div>';
    }).join('');
    foot.innerHTML = '<p class="b-sub"><span>Subtotal</span><b>' + money2(subtotal()) + '</b></p>' +
      (S.shipNote ? '<p class="b-note">' + esc(S.shipNote) + '</p>' : '') +
      '<button class="btn big" type="button" id="checkout-btn">Checkout<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button>' +
      '<p class="b-secure">Secure payment by Stripe</p>';
  }

  // ---------- Bag drawer ----------
  var bagEl = $('bag'), scrim = $('bag-scrim'), lastFocus = null;
  function openBag(from) {
    lastFocus = from || $('bag-btn');
    bagEl.classList.add('open'); scrim.classList.add('open'); bagEl.setAttribute('aria-hidden', 'false');
    document.body.classList.add('drawer-open');
    setTimeout(function () { $('bag-close').focus(); }, 60);
  }
  function closeBag() {
    bagEl.classList.remove('open'); scrim.classList.remove('open'); bagEl.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('drawer-open');
    if (lastFocus) lastFocus.focus();
  }
  $('bag-btn').addEventListener('click', function () { openBag($('bag-btn')); });
  $('bag-close').addEventListener('click', closeBag);
  scrim.addEventListener('click', closeBag);

  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-add],[data-inc],[data-dec],[data-rm],[data-close-bag]');
    if (!t) return;
    if (t.hasAttribute('data-add')) {
      var id = t.getAttribute('data-add');
      setQty(id, qtyOf(id) + 1);
      openBag($('bag-btn'));
    } else if (t.hasAttribute('data-inc')) setQty(t.getAttribute('data-inc'), qtyOf(t.getAttribute('data-inc')) + 1);
    else if (t.hasAttribute('data-dec')) setQty(t.getAttribute('data-dec'), qtyOf(t.getAttribute('data-dec')) - 1);
    else if (t.hasAttribute('data-rm')) setQty(t.getAttribute('data-rm'), 0);
    else if (t.hasAttribute('data-close-bag')) closeBag();
  });

  // ---------- Checkout ----------
  var modal = $('demo-modal');
  function openDemo() {
    $('demo-lines').innerHTML = bag.map(function (l) { var x = byId[l.id]; return '<li><span>' + esc(x.name) + ' <em>x ' + l.qty + '</em></span><b>' + money2(l.qty * x.price) + '</b></li>'; }).join('');
    $('demo-total').textContent = money2(subtotal());
    modal.hidden = false; $('demo-pay').focus();
  }
  function closeDemo() { modal.hidden = true; }
  $('demo-back').addEventListener('click', closeDemo);
  modal.addEventListener('click', function (e) { if (e.target === modal) closeDemo(); });
  $('demo-pay').addEventListener('click', function () {
    closeDemo(); closeBag();
    bag.forEach(function (l) { var x = byId[l.id]; if (x.stock != null) x.stock = Math.max(0, x.stock - l.qty); });
    demoSave(); bag = []; save(); drawBag(); drawGrid();
    say('Thank you. This was a demo order, so nothing was charged. In the live store customers come back here after paying, and Stripe emails their receipt.');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  function liveCheckout(btn) {
    btn.disabled = true; var old = btn.innerHTML; btn.textContent = 'Opening secure checkout...';
    var items = bag.map(function (l) { return { price: byId[l.id].priceId, quantity: l.qty }; });
    fetch(S.endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ items: items }) })
      .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); })
      .then(function (res) {
        if (res.ok && res.j.url) { window.location.href = res.j.url; return; }
        throw new Error(res.j && res.j.error || 'Checkout is unavailable right now.');
      })
      .catch(function (err) {
        btn.disabled = false; btn.innerHTML = old;
        say((err && err.message ? err.message : 'Checkout is unavailable right now.') + ' Your bag is saved. Please try again in a moment.');
        loadStock(); closeBag(); window.scrollTo({ top: 0, behavior: 'smooth' });
      });
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('#checkout-btn'); if (!b || !bag.length) return;
    if (S.demo) openDemo(); else liveCheckout(b);
  });

  // Live mode: the product list, prices, photos and stock all come from Stripe (through /api/products)
  function loadProducts() {
    if (S.demo) return;
    fetch(S.productsEndpoint, { cache: 'no-store' })
      .then(function (r) { if (!r.ok) throw new Error('bad'); return r.json(); })
      .then(function (j) {
        var list = (j.products || []).map(function (p) {
          var icon = String(p.icon || 'kit').toLowerCase();
          return { id: p.id, priceId: p.priceId, name: p.name, price: p.price, desc: p.description || '', imageUrl: p.image || '', photo: '', badge: p.badge || '', icon: ICONS.indexOf(icon) >= 0 ? icon : 'kit', soldOut: false, stock: typeof p.stock === 'number' ? p.stock : null, backorder: !!p.backorder, demoStock: null };
        });
        setProducts(list);
        gridNote = list.length ? '' : 'No products yet. Please check back soon.';
        restoreBag(); drawGrid(); drawBag();
      })
      .catch(function () {
        if (!S.products.length) { gridNote = 'The shop could not load right now. Please try again in a moment.'; drawGrid(); }
      });
  }
  var loadStock = loadProducts;
  window.addEventListener('pageshow', function (e) { if (e.persisted) loadProducts(); });

  // Coming back from Stripe
  var st = (location.search.match(/[?&]status=(\w+)/) || [])[1];
  if (st === 'success') { bag = []; save(); say('Thank you for your order. Stripe has emailed your receipt.'); }
  else if (st === 'cancelled') say('Checkout was cancelled. Your bag is saved.');

  // ---------- Menu ----------
  var mb = $('menu-btn'), mp = $('menu-panel');
  mb.addEventListener('click', function (e) { e.stopPropagation(); var o = !mp.classList.contains('open'); mp.classList.toggle('open', o); mb.setAttribute('aria-expanded', o); });
  document.addEventListener('click', function (e) { if (!mp.contains(e.target) && !mb.contains(e.target)) { mp.classList.remove('open'); mb.setAttribute('aria-expanded', 'false'); } });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (!modal.hidden) closeDemo();
    else if (bagEl.classList.contains('open')) closeBag();
    else if (mp.classList.contains('open')) { mp.classList.remove('open'); mb.setAttribute('aria-expanded', 'false'); mb.focus(); }
  });

  if (PROBLEMS.length) {
    console.warn('KALOBEAUTY shop content problems:\n' + PROBLEMS.join('\n'));
    var box = document.createElement('div');
    box.setAttribute('style', 'background:#fff3cd;color:#4a3300;border-bottom:2px solid #e0a800;padding:12px 16px;font:15px/1.4 sans-serif');
    box.innerHTML = '<strong>Shop content needs attention (data/shop.js):</strong><ul style="margin:6px 0 0 18px;padding:0">' + PROBLEMS.map(function (p) { return '<li>' + p.replace(/[&<>]/g, '') + '</li>'; }).join('') + '</ul>';
    document.body.insertBefore(box, document.body.firstChild);
  }

  drawBag();
  loadProducts();
})();
