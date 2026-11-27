# Stripe for dev and main (live)

One set of files serves both sites. The `dev` branch publishes a dev site that uses Stripe **test mode**. The `main` branch publishes your live site that uses Stripe **live mode**. Products come from whichever Stripe mode the site's key belongs to, so you never edit product lists to move from dev to live.

## Files that matter
| File | What it does |
|---|---|
| `data/stripe-settings.txt` | The one file you edit here: shipping rate and tax settings for test and live. |
| `scripts/apply-stripe-settings.js` | Runs on each Netlify publish. Records test or live mode and your settings. |
| `netlify/functions/products.js` | Reads your products from Stripe for the shop page. |
| `netlify/functions/checkout.js` | Creates the payment, and sends customers back to the site they started on. |
| `netlify.toml` | Tells Netlify what to run. |

## One-time setup
1. **Stripe, test mode:** create your products with the metadata in `SHOP-SETUP.md` (at least `shop` = `true`).
2. **Stripe, live mode:** create them again. Test and live are separate, so nothing carries over.
3. **Netlify, dev branch:** Site configuration > Build & deploy > Branches and deploy contexts > Branch deploys > choose `dev`.
4. **Netlify, keys per environment** (Site configuration > Environment variables, one value per deploy context):

| Variable | Production | Branch deploys and Deploy previews |
|---|---|---|
| `STRIPE_SECRET_KEY` | live key `sk_live_...` | test key `sk_test_...` |
| `STRIPE_WEBHOOK_SECRET` | live webhook secret | test webhook secret |

Use the test key everywhere until you are ready for real payments.

5. **Stripe webhooks, one per mode** (Developers > Webhooks):
   - Test mode: `https://dev--YOURSITE.netlify.app/.netlify/functions/stripe-webhook`
   - Live mode: `https://YOUR-LIVE-ADDRESS/.netlify/functions/stripe-webhook`
   - Events for both: `checkout.session.completed` and `checkout.session.async_payment_succeeded`. Copy each signing secret (`whsec_...`) into the matching Netlify value.
6. **Optional:** shipping rate IDs (`shr_...`, one for test, one for live) and Automatic tax yes or no in `data/stripe-settings.txt`.

## Day to day
1. Add or edit products in Stripe test mode, or change the site on the `dev` branch. Check the dev site and pay with card `4242 4242 4242 4242`.
2. Happy? Merge `dev` into `main` on GitHub. The live site updates by itself. Products on the live site come from live-mode Stripe, so create or edit those there too.

## Safety checks built in
- A dev or preview publish is **stopped** if `STRIPE_SECRET_KEY` is a live key, so dev can never charge a real card.
- The live site warns in the build log if it still has a test key.
- Secret keys are never stored in any file.
