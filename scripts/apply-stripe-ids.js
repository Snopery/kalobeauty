// Runs on Netlify before each publish. It copies the right Stripe IDs into the
// published copy of data/shop.js. Your own files in the repository are not changed.
//   dev / preview deploys  -> TEST ids
//   production (main)      -> LIVE ids
// You can also run it by hand to try it:  node scripts/apply-stripe-ids.js test
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const ctx = process.env.CONTEXT || '';
const arg = (process.argv[2] || '').toLowerCase();
let mode = arg === 'test' || arg === 'live' ? arg : ctx ? (ctx === 'production' ? 'live' : 'test') : '';
if (!mode) {
  console.log('[stripe-ids] Not running on Netlify and no mode given, so nothing was changed.');
  process.exit(0);
}

const problems = [];
const fail = (msg) => problems.push(msg);

// ---- safety: never let a live key run on a dev site ----
const key = process.env.STRIPE_SECRET_KEY || '';
if (mode === 'test' && key.startsWith('sk_live_')) {
  console.error('\n[stripe-ids] STOPPED: this is a dev/preview deploy but STRIPE_SECRET_KEY is a LIVE key (sk_live_).');
  console.error('In Netlify > Environment variables, give STRIPE_SECRET_KEY a test key (sk_test_) for Branch deploys and Deploy previews.');
  process.exit(1);
}
if (mode === 'live' && key.startsWith('sk_test_')) {
  console.warn('[stripe-ids] Warning: this is the LIVE site but STRIPE_SECRET_KEY is a test key (sk_test_). Real customers cannot pay until you switch it to your live key.');
}

// ---- read stripe-ids.txt ----
const idsFile = path.join(root, 'data', 'stripe-ids.txt');
const cfg = { shipTest: '', shipLive: '', taxTest: false, taxLive: false };
const ids = {};
let cur = null;
fs.readFileSync(idsFile, 'utf8').split(/\r?\n/).forEach((raw, i) => {
  const line = raw.trim();
  if (!line || line[0] === '#') return;
  const m = line.match(/^([A-Za-z ]+?)\s*:\s*(.*)$/);
  if (!m) return fail('data/stripe-ids.txt line ' + (i + 1) + ': not understood: "' + line + '"');
  const k = m[1].toLowerCase(), v = m[2].trim();
  if (k === 'product') { cur = { name: v, test: '', live: '' }; ids[v.toLowerCase()] = cur; }
  else if (k === 'test' && cur) cur.test = v;
  else if (k === 'live' && cur) cur.live = v;
  else if (k === 'shipping rate test') cfg.shipTest = v;
  else if (k === 'shipping rate live') cfg.shipLive = v;
  else if (k === 'automatic tax test') cfg.taxTest = /^(yes|true|on)$/i.test(v);
  else if (k === 'automatic tax live') cfg.taxLive = /^(yes|true|on)$/i.test(v);
  else fail('data/stripe-ids.txt line ' + (i + 1) + ': not understood: "' + line + '"');
});

// ---- rewrite the price ID lines in data/shop.js ----
const shopFile = path.join(root, 'data', 'shop.js');
const src = fs.readFileSync(shopFile, 'utf8');
const demo = /^\s*Demo mode\s*:\s*(yes|on|true)\s*$/im.test(src);
const strict = mode === 'live' && !demo; // live and real: any missing ID stops the publish
// Only the text between the backticks is shop content. The notes above it are ignored.
const marker = src.search(/KALO_SHOP_CONTENT\s*=\s*`/);
const start = marker < 0 ? -1 : src.indexOf('`', marker), end = src.lastIndexOf('`');
if (start < 0 || end <= start) { console.error('[stripe-ids] Could not find the shop content in data/shop.js'); process.exit(1); }
const head = src.slice(0, start), tail = src.slice(end);
const lines = src.slice(start, end).split(/\r?\n/);
let product = null, changed = 0;
const seen = {};
for (let i = 0; i < lines.length; i++) {
  const pm = lines[i].match(/^\s*Product\s*:\s*(.+?)\s*$/i);
  if (pm) { product = pm[1]; seen[product.toLowerCase()] = true; continue; }
  const im = lines[i].match(/^(\s*Stripe price ID\s*:\s*)(.*)$/i);
  if (im && product) {
    const entry = ids[product.toLowerCase()];
    const id = entry ? entry[mode] : '';
    if (!/^price_[A-Za-z0-9]+$/.test(id) || /REPLACE/.test(id)) {
      const msg = 'No real ' + mode.toUpperCase() + ' price ID for "' + product + '" in data/stripe-ids.txt';
      if (strict) fail(msg); else console.warn('[stripe-ids] ' + msg + (demo ? ' (Demo mode is on, so that is fine for now)' : ''));
    } else { lines[i] = im[1] + id; changed++; }
  }
}
Object.keys(ids).forEach((k) => { if (!seen[k]) console.warn('[stripe-ids] "' + ids[k].name + '" is in stripe-ids.txt but not in data/shop.js'); });

if (problems.length) {
  console.error('\n[stripe-ids] The publish was stopped:\n - ' + problems.join('\n - '));
  process.exit(1);
}
fs.writeFileSync(shopFile, head + lines.join('\n') + tail);

// ---- settings for the checkout function (no secrets in here) ----
const conf = {
  mode,
  shippingRateId: mode === 'live' ? cfg.shipLive : cfg.shipTest,
  automaticTax: mode === 'live' ? cfg.taxLive : cfg.taxTest,
};
fs.writeFileSync(path.join(root, 'netlify', 'functions', '_config.json'), JSON.stringify(conf, null, 2) + '\n');
console.log('[stripe-ids] Mode: ' + mode.toUpperCase() + '. Set ' + changed + ' price ID(s). Shipping rate: ' + (conf.shippingRateId || 'none') + '. Tax: ' + (conf.automaticTax ? 'on' : 'off') + '.');
