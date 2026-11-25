# Turning on the KALOBEAUTY shop

The shop page (`shop.html`) works straight away in **demo mode**: the bag works and checkout shows a pretend payment screen. Nothing is charged. Follow these steps to take real payments.

GitHub Pages cannot run the small piece of server code Stripe needs, so the site moves to Netlify (free). Your files stay the same.

## 1. Stripe (about 15 minutes)
1. Create an account at stripe.com and stay in **Test mode** (toggle at the top).
2. Product catalogue > **Add product**. For each product enter a name, a one-time price in **AUD**.
3. On each product open **Additional options > Metadata** and add: key `shop`, value `true`. (Products without this cannot be bought through the site.)
4. Open the price and copy its **Price ID** (starts with `price_`).
5. Optional: Product catalogue > Shipping rates > create one (for example flat A$9.95) and copy its ID (starts with `shr_`).

## 2. Edit `data/shop.js`
For each product paste the price ID into `Stripe price ID:`. Keep Price: the same as in Stripe (it is only for display). Photos go in `images/shop/` and are named with `Photo:`. When ready change `Demo mode: yes` to `Demo mode: no`.

## 3. Host on Netlify
1. Put the whole folder in your GitHub repository (replace the files).
2. At netlify.com choose **Add new site > Import from GitHub** and pick the repository. Leave build settings as they are (they are read from `netlify.toml`).
3. Site settings > **Environment variables**, add:
   - `STRIPE_SECRET_KEY` = your Stripe **test** secret key (`sk_test_...`, from Stripe > Developers > API keys)
   - `SHIPPING_RATE_ID` = optional, the `shr_...` ID
   - `AUTOMATIC_TAX` = optional, `true` if you set up Stripe Tax
   - `STRIPE_WEBHOOK_SECRET` = added in step 5, for automatic stock
   - `SHIP_COUNTRIES` = optional, comma list such as `AU,NZ` (default AU)
4. Deploy again. Never type the secret key into any file or send it to anyone. It lives only in Netlify.

## 4. Test, then go live
- Add something to the bag, Checkout, pay with card `4242 4242 4242 4242`, any future date, any CVC. The payment appears in Stripe's test data.
- When happy, switch Stripe out of test mode, recreate the products/prices in live mode, update the price IDs in `data/shop.js`, and replace `STRIPE_SECRET_KEY` with the live key (`sk_live_...`).

Stripe emails receipts and shows every order in its dashboard.

## 5. Automatic stock counts

Stock is kept in Stripe, on each product, so there is nothing extra to host.

**Set the starting stock**
1. Stripe > Product catalogue > open a product > **Additional options > Metadata**.
2. Add key `stock`, value the number you have, e.g. `12`.
3. Leave `stock` off any product you do not want counted, such as gift cards. Those are always available.
4. When you restock, edit that number in Stripe. The site picks it up within a minute.

**Connect the webhook (so each sale subtracts automatically)**
1. Stripe > Developers > **Webhooks** > Add endpoint.
2. Endpoint URL: `https://YOUR-SITE.netlify.app/.netlify/functions/stripe-webhook` (use your own address).
3. Events to send: `checkout.session.completed` and `checkout.session.async_payment_succeeded`.
4. Open the new endpoint and copy the **Signing secret** (starts with `whsec_`).
5. In Netlify > Environment variables add `STRIPE_WEBHOOK_SECRET` = that value, then deploy again.
6. Test mode and live mode each have their own webhook and signing secret. Repeat when you go live.

**What customers see**
- Above the display limit (default 10): "10+ in stock", so exact big numbers stay private. Change with `Stock display limit:`.
- Stock from 4 up to the limit: "7 in stock".
- Stock 3 or fewer (change with `Low stock warning:` in `data/shop.js`): "Only 2 left".
- Stock 0: the card says Sold out and cannot be added.
- The bag will not let anyone add more than is in stock. If stock runs out while someone is checking out, they get a message and their bag updates.

**Backorders (let people buy when stock is 0)**
- On a product in Stripe, add metadata `backorder` = `true`.
- When its stock is 0 the card says **Backorder** and the button still works. The bag notes "backorder, ships when restocked". Stock never goes below 0.
- Without `backorder`, stock 0 shows Sold out and cannot be bought.
- Set expectations in the product Description, e.g. "Backorder: ships within 2 weeks".

**Good to know**
- Stock is checked when someone presses Checkout, and subtracted when they pay. If two people check out for the last item at the same moment, the second payment can still go through. Stripe shows it in your dashboard and you can refund it. Rare on a small shop.
- If a payment is refunded or an order cancelled, add the stock back by hand in Stripe.
- Stripe retries the webhook if your site was down. It will not subtract the same order twice.
- Check it is working: Stripe > Webhooks > your endpoint shows each delivery with a green tick.
- `Demo stock:` lines in `data/shop.js` are only for the preview. You can delete them.
