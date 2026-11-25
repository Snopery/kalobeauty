// GET /api/stock?prices=price_a,price_b  ->  { price_a: { stock: 5 }, price_b: { stock: null } }
const Stripe = require('stripe');
const { readStock } = require('./_stock');

const json = (status, body, extra) => ({
  statusCode: status,
  headers: Object.assign({ 'Content-Type': 'application/json' }, extra || {}),
  body: JSON.stringify(body),
});

exports.handler = async (event) => {
  if (event.httpMethod !== 'GET') return json(405, { error: 'Method not allowed.' });
  if (!process.env.STRIPE_SECRET_KEY) return json(500, { error: 'Shop is not configured yet.' });
  const ids = String((event.queryStringParameters || {}).prices || '').split(',').filter(Boolean);
  if (!ids.length || ids.length > 30 || ids.some((i) => !/^price_[A-Za-z0-9]+$/.test(i))) return json(400, { error: 'Bad request.' });

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const out = {};
  try {
    await Promise.all(ids.map(async (id) => {
      const price = await stripe.prices.retrieve(id, { expand: ['product'] });
      const p = price.product;
      if (!price.active || !p || p.deleted || !p.active || p.metadata.shop !== 'true') { out[id] = { stock: 0 }; return; }
      out[id] = { stock: readStock(p), backorder: p.metadata.backorder === 'true' };
    }));
    return json(200, out, { 'Cache-Control': 'public, max-age=15' });
  } catch (err) {
    console.error('Stock error:', err && err.message);
    return json(500, { error: 'Stock is unavailable.' });
  }
};
