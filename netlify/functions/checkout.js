// Creates a Stripe Checkout session. Runs on Netlify, never in the browser.
// Your secret key is read from the STRIPE_SECRET_KEY environment variable.
// Which Stripe mode is used is decided by that key (sk_test_ or sk_live_), set per environment in Netlify.
const Stripe = require('stripe');
const { readStock } = require('./_stock');
const cfg = require('./_config.json');

const json = (status, body) => ({
  statusCode: status,
  headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  body: JSON.stringify(body),
});

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method not allowed.' });
  if (!process.env.STRIPE_SECRET_KEY) return json(500, { error: 'Shop is not configured yet.' });

  // The site address is taken from the request itself, so the dev site and the live site each send
  // customers back to their own address.
  const host = (event.headers.host || event.headers.Host || '').toLowerCase();
  if (!host) return json(400, { error: 'Bad request.' });
  const site = (/^localhost|^127\./.test(host) ? 'http://' : 'https://') + host;

  // Only accept requests that come from the same site
  const origin = event.headers.origin || event.headers.Origin;
  if (origin && origin.replace(/\/$/, '').toLowerCase() !== site) return json(403, { error: 'Not allowed.' });

  let items;
  try { items = JSON.parse(event.body || '{}').items; } catch (e) { return json(400, { error: 'Bad request.' }); }
  if (!Array.isArray(items) || items.length < 1 || items.length > 20) return json(400, { error: 'Your bag is empty.' });

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  try {
    const lines = [];
    for (const it of items) {
      const qty = Number(it.quantity);
      if (!/^price_[A-Za-z0-9]+$/.test(String(it.price)) || !Number.isInteger(qty) || qty < 1 || qty > 10) {
        return json(400, { error: 'Invalid item in bag.' });
      }
      // Look the price up on Stripe so the browser can never set its own price
      const price = await stripe.prices.retrieve(it.price, { expand: ['product'] });
      if (!price.active || !price.product || price.product.deleted || !price.product.active || !price.product.metadata || price.product.metadata.shop !== 'true') {
        return json(400, { error: 'One of the items is no longer available.' });
      }
      const stock = readStock(price.product);
      if (stock !== null && qty > stock && price.product.metadata.backorder !== 'true') {
        return json(409, { error: stock === 0 ? price.product.name + ' has just sold out.' : 'Only ' + stock + ' of ' + price.product.name + ' left.' });
      }
      lines.push({ price: price.id, quantity: qty });
    }

    const params = {
      mode: 'payment',
      line_items: lines,
      allow_promotion_codes: true,
      success_url: site + '/shop.html?status=success',
      cancel_url: site + '/shop.html?status=cancelled',
      shipping_address_collection: { allowed_countries: (process.env.SHIP_COUNTRIES || 'AU').split(',').map((s) => s.trim()) },
    };
    const rate = process.env.SHIPPING_RATE_ID || cfg.shippingRateId;
    if (rate) params.shipping_options = [{ shipping_rate: rate }];
    if (process.env.AUTOMATIC_TAX === 'true' || cfg.automaticTax) params.automatic_tax = { enabled: true };

    const session = await stripe.checkout.sessions.create(params);
    return json(200, { url: session.url });
  } catch (err) {
    console.error('Stripe error:', err && err.message);
    return json(500, { error: 'Checkout is unavailable right now.' });
  }
};
