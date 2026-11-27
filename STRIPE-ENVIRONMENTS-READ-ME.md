# Stripe for dev and main (live)

One set of files serves both sites. The `dev` branch publishes a dev site that uses Stripe **test mode**. The `main` branch publishes your live site that uses Stripe **live mode**. You never edit `data/shop.js` to switch between them.

## What is in this pack
| File | What it does |
|---|---|
| `data/stripe-ids.txt` | **The one file you edit.** Test and live Stripe price IDs for each product, plus shipping rate and tax settings. |
| `scripts/apply-stripe-ids.js` | Runs automatically when Netlify publishes. Copies the test IDs into dev, the live IDs into main. |
| `netlify.toml` | Tells Netlify to run that script. |
| `netlify/functions/checkout.js` | Updated: sends customers back to whichever site they started on, and reads the shipping and tax settings. |
| `netlify/functions/_config.json` | Filled in by the script on each publish. Leave it alone. |
| `netlify/functions/_stock.js` | Unchanged helper, included so the pack is complete. |

Copy these over your site folder, keeping the same folder names, then commit them to GitHub.

## One-time setup

**1. Stripe: make the products twice**
- With **Test mode ON**, create each product and price (AUD). Add metadata `shop` = `true`, plus `stock` and `backorder` if you use them.
- Switch Test mode **OFF** and create them again. Test and live are completely separate, so the IDs are different.

**2. Fill in `data/stripe-ids.txt`**
- For each product paste the test price ID after `Test:` and the live one after `Live:`. The product names must match `data/shop.js`.
- Optional: shipping rates (`shr_...`) for test and live, and Automatic tax yes or no.

**3. Netlify: turn on the dev branch**
- Site configuration > Build & deploy > Branches and deploy contexts > Branch deploys > choose the `dev` branch.

**4. Netlify: environment variables (keys per environment)**
Site configuration > Environment variables. Add each variable with a different value per deploy context:

| Variable | Production | Branch deploys and Deploy previews |
|---|---|---|
| `STRIPE_SECRET_KEY` | live key `sk_live_...` | test key `sk_test_...` |
| `STRIPE_WEBHOOK_SECRET` | live webhook secret | test webhook secret |

Start with the test key everywhere until you are ready to take real payments, then switch Production to the live key.

**5. Stripe: one webhook per mode** (Developers > Webhooks)
- Test mode: `https://dev--YOURSITE.netlify.app/.netlify/functions/stripe-webhook`
- Live mode: `https://YOUR-LIVE-ADDRESS/.netlify/functions/stripe-webhook`
- Events for both: `checkout.session.completed` and `checkout.session.async_payment_succeeded`. Copy each signing secret (`whsec_...`) into the matching Netlify value above.

## Day to day
1. Make changes on `dev` and push. Check the dev site. Pay with card `4242 4242 4242 4242`.
2. Happy? Merge `dev` into `main` on GitHub. The live site updates by itself with the live IDs.

## Safety checks built in
- A dev or preview publish is **stopped** if `STRIPE_SECRET_KEY` is a live key, so dev can never charge a real card.
- A live publish is **stopped** if any product is missing a real live price ID (unless Demo mode is on), so the live site can't go out half set up.
- The live site warns in the build log if it still has a test key.
- Secret keys are never stored in any file.

## Trying the script on your computer
`node scripts/apply-stripe-ids.js test` or `node scripts/apply-stripe-ids.js live` writes that mode's IDs into your local `data/shop.js`. Run `git checkout data/shop.js` afterwards to put the placeholders back before committing.
