// GET /api/products -> the shop's product list, read straight from Stripe.
// Any ACTIVE Stripe product with the metadata  shop = true  appears in the shop.
// Optional metadata on the product:
//   stock      number in stock (leave off for unlimited, e.g. gift cards)
//   backorder  true = can still be bought when stock is 0
//   badge      small label on the card, e.g. New or Bestseller
//   icon       drawing when there is no photo: kit, cleanser, serum, brush, giftcard
//   order      number to sort by (1 shows first); otherwise sorted by name
// Name, description, photo and price come from the Stripe product itself (its default price).
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
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  try {
    const out = [];
    for await (const p of stripe.products.list({ active: true, limit: 100, expand: ['data.default_price'] })) {
      const md = p.metadata || {};
      const price = p.default_price;
      if (md.shop !== 'true' || !price || typeof price !== 'object' || !price.active || price.type !== 'one_time' || typeof price.unit_amount !== 'number') continue;
      out.push({
        id: p.id,
        priceId: price.id,
        name: p.name,
        description: p.description || '',
        price: price.unit_amount / 100,
        currency: price.currency,
        image: (p.images && p.images[0]) || '',
        badge: md.badge || '',
        icon: md.icon || '',
        stock: readStock(p),
        backorder: md.backorder === 'true',
        order: parseFloat(md.order),
      });
      if (out.length >= 100) break;
    }
    out.sort((a, b) => {
      const ao = Number.isFinite(a.order) ? a.order : 1e9, bo = Number.isFinite(b.order) ? b.order : 1e9;
      return ao - bo || a.name.localeCompare(b.name);
    });
    out.forEach((x) => delete x.order);
    return json(200, { products: out }, { 'Cache-Control': 'public, max-age=20' });
  } catch (err) {
    console.error('Products error:', err && err.message);
    return json(500, { error: 'Products are unavailable.' });
  }
};
