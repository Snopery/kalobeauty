// Runs on Netlify before each publish. It records which Stripe mode this publish is for and the
// shipping and tax settings from data/stripe-settings.txt. No secrets are written.
//   dev / preview deploys  -> TEST settings
//   production (main)      -> LIVE settings
// Try it by hand:  node scripts/apply-stripe-settings.js test
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const ctx = process.env.CONTEXT || '';
const arg = (process.argv[2] || '').toLowerCase();
const mode = arg === 'test' || arg === 'live' ? arg : ctx ? (ctx === 'production' ? 'live' : 'test') : '';
if (!mode) {
  console.log('[stripe] Not running on Netlify and no mode given, so nothing was changed.');
  process.exit(0);
}

// Safety: never let a live key run on a dev site
const key = process.env.STRIPE_SECRET_KEY || '';
if (mode === 'test' && key.startsWith('sk_live_')) {
  console.error('\n[stripe] STOPPED: this is a dev/preview deploy but STRIPE_SECRET_KEY is a LIVE key (sk_live_).');
  console.error('In Netlify > Environment variables, give STRIPE_SECRET_KEY a test key (sk_test_) for Branch deploys and Deploy previews.');
  process.exit(1);
}
if (mode === 'live' && key.startsWith('sk_test_')) {
  console.warn('[stripe] Warning: this is the LIVE site but STRIPE_SECRET_KEY is a test key (sk_test_). Real customers cannot pay until you switch it to your live key.');
}

const cfg = { shipTest: '', shipLive: '', taxTest: false, taxLive: false };
const problems = [];
fs.readFileSync(path.join(root, 'data', 'stripe-settings.txt'), 'utf8').split(/\r?\n/).forEach((raw, i) => {
  const line = raw.trim();
  if (!line || line[0] === '#') return;
  const m = line.match(/^([A-Za-z ]+?)\s*:\s*(.*)$/);
  if (!m) return problems.push('data/stripe-settings.txt line ' + (i + 1) + ': not understood: "' + line + '"');
  const k = m[1].toLowerCase(), v = m[2].trim();
  if (k === 'shipping rate test') cfg.shipTest = v;
  else if (k === 'shipping rate live') cfg.shipLive = v;
  else if (k === 'automatic tax test') cfg.taxTest = /^(yes|true|on)$/i.test(v);
  else if (k === 'automatic tax live') cfg.taxLive = /^(yes|true|on)$/i.test(v);
  else problems.push('data/stripe-settings.txt line ' + (i + 1) + ': not understood: "' + line + '"');
});
const rate = mode === 'live' ? cfg.shipLive : cfg.shipTest;
if (rate && !/^shr_[A-Za-z0-9]+$/.test(rate)) problems.push('The ' + mode + ' shipping rate "' + rate + '" should look like shr_...');
if (problems.length) {
  console.error('\n[stripe] The publish was stopped:\n - ' + problems.join('\n - '));
  process.exit(1);
}

const conf = { mode, shippingRateId: rate, automaticTax: mode === 'live' ? cfg.taxLive : cfg.taxTest };
fs.writeFileSync(path.join(root, 'netlify', 'functions', '_config.json'), JSON.stringify(conf, null, 2) + '\n');
console.log('[stripe] Mode: ' + mode.toUpperCase() + '. Shipping rate: ' + (conf.shippingRateId || 'none') + '. Tax: ' + (conf.automaticTax ? 'on' : 'off') + '.');
