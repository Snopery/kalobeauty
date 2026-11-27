# Turning on the KALOBEAUTY shop

The shop page (`shop.html`) works straight away in **demo mode**: sample products, a working bag, and a pretend checkout. Nothing is charged.

When you turn demo mode off, the shop **reads its products straight from Stripe**. You add or edit a product in Stripe and it appears on the site by itself. There is no product list to copy across.

For separate dev (test) and live settings, also read `STRIPE-ENVIRONMENTS-READ-ME.md`.

## 1. Add a product in Stripe
1. Stripe > Product catalogue > **Add product**.
2. Enter the **name**, a **description**, upload a **photo**, and add a **one-time price in AUD**. This price becomes the product's default price. The site shows the name, description, photo and price exactly as Stripe has them.
3. Open **Additional options > Metadata** and add:

| Key | Value | Needed? |
|---|---|---|
| `shop` | `true` | **Yes.** Without it the product is not shown on the site. |
| `stock` | a number, e.g. `12` | Optional. Leave it off for unlimited (e.g. gift cards). |
| `backorder` | `true` | Optional. The product can still be bought when stock is 0. |
| `badge` | e.g. `New` | Optional. Small label on the card. |
| `icon` | `kit`, `cleanser`, `serum`, `brush` or `giftcard` | Optional. A drawing is used when there is no photo. |
| `order` | a number, e.g. `1` | Optional. Lower numbers show first. Otherwise products are sorted by name. |

4. To hide a product, archive it in Stripe or remove the `shop` tag. It disappears from the site within about a minute.

Do this in **Test mode** first, then again in live mode (the two are completely separate).

## 2. Turn the shop on
In `data/shop.js` change `Demo mode: yes` to `Demo mode: no`. You can also change the shop title, intro text, shipping note, "Only N left" level and the "10+ in stock" limit there.

## 3. Host on Netlify (GitHub Pages cannot run the shop functions)
1. Put the whole folder in your GitHub repository.
2. At netlify.com choose **Add new site > Import from GitHub** and pick the repository. The build settings are read from `netlify.toml`.
3. Site settings > **Environment variables**, add `STRIPE_SECRET_KEY` (your **test** key `sk_test_...` first, from Stripe > Developers > API keys). Never type the secret key into any file or send it to anyone.
4. Optional extras: `SHIP_COUNTRIES` (comma list such as `AU,NZ`, default AU).
5. Deploy again.

## 4. Stock counts after each sale (webhook)
1. Stripe > Developers > **Webhooks** > Add endpoint.
2. URL: `https://YOUR-SITE.netlify.app/.netlify/functions/stripe-webhook`
3. Events: `checkout.session.completed` and `checkout.session.async_payment_succeeded`.
4. Copy the **Signing secret** (`whsec_...`) into Netlify as `STRIPE_WEBHOOK_SECRET`, then deploy again.

Each paid order now subtracts from the product's `stock` in Stripe. Edit that number in Stripe whenever you restock.

**What customers see:** "10+ in stock" above the limit, the exact number from there down, "Only 2 left" at 3 or fewer, "Sold out" at 0 (or "Backorder" if the product has `backorder` = `true`).

## 5. Test, then go live
- Add something to the bag, Checkout, pay with card `4242 4242 4242 4242`, any future date, any CVC. The payment appears in Stripe's test data and the stock drops by one.
- To go live: create the products again in live mode, put your live key on the live site, and add a live webhook. `STRIPE-ENVIRONMENTS-READ-ME.md` has the details for keeping dev and live apart.

## Good to know
- Each product uses its **default price**. A product with more than one price, or a recurring price, is skipped.
- Stock is checked when someone presses Checkout and subtracted when they pay. If two people buy the last item at the same moment, the second payment can still go through. You would refund it in Stripe.
- If an order is refunded or cancelled, add the stock back by hand in Stripe.
- Stripe retries the webhook if your site was down. It never subtracts the same order twice.
- Gift cards sell like any product, but nothing creates a redeemable code. You send the code yourself after each order.
