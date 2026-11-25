// Stripe calls this after a customer pays. It subtracts the bought quantities from each product's stock.
// Set up in Stripe: Developers > Webhooks > endpoint https://YOUR-SITE/.netlify/functions/stripe-webhook
// events: checkout.session.completed and checkout.session.async_payment_succeeded
const Stripe = require('stripe');
const { readStock } = require('./_stock');

const ok = (msg) => ({ statusCode: 200, body: msg });

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method not allowed' };
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) return { statusCode: 500, body: 'Not configured' };
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  // The signature must be checked against the exact raw body
  const raw = event.isBase64Encoded ? Buffer.from(event.body, 'base64').toString('utf8') : event.body;
  let ev;
  try {
    ev = stripe.webhooks.constructEvent(raw, event.headers['stripe-signature'] || event.headers['Stripe-Signature'], process.env.STRIPE_WEBHOOK_SECRET);
  } catch (e) {
    return { statusCode: 400, body: 'Bad signature' };
  }
  if (ev.type !== 'checkout.session.completed' && ev.type !== 'checkout.session.async_payment_succeeded') return ok('ignored');

  const session = ev.data.object;
  if (session.payment_status !== 'paid') return ok('not paid yet'); // later async event will arrive

  try {
    const items = await stripe.checkout.sessions.listLineItems(session.id, { limit: 100, expand: ['data.price.product'] });
    for (const li of items.data) {
      const prod = li.price && li.price.product;
      if (!prod || typeof prod !== 'object') continue;
      const stock = readStock(prod);
      if (stock === null) continue; // not tracked

      // Stripe may send the same event twice. Remember the last few order IDs on the product so we never subtract twice.
      const seen = (prod.metadata.stock_orders || '').split(',').filter(Boolean);
      if (seen.indexOf(session.id) >= 0) continue;
      seen.push(session.id);

      await stripe.products.update(prod.id, {
        metadata: { stock: String(Math.max(0, stock - li.quantity)), stock_orders: seen.slice(-5).join(',') },
      });
    }
    return ok('stock updated');
  } catch (err) {
    console.error('Webhook error:', err && err.message);
    return { statusCode: 500, body: 'Retry' }; // Stripe will try again
  }
};
