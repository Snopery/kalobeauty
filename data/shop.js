/* ======================================================================
   KALOBEAUTY SHOP  -  edit this file to change what the shop sells.
   Setup steps are in SHOP-SETUP.md.

   HOW IT WORKS
   - Each PRODUCT: line starts a new product card, in the order written.
   - Delete a product's lines to remove it. Lines starting with # are notes.
   - Keep the words before each colon exactly as shown.
   - Do not use the backtick character ` anywhere in this file.

   FIELDS FOR A PRODUCT
   PRODUCT:         name shown on the card (required)
   Price:           price in dollars, numbers only, e.g. 39 or 39.50 (required)
                    Must match the price you created in Stripe.
   Stripe price ID: the price_... code from your Stripe dashboard (required
                    when Demo mode is no)
   Icon:            drawing used when there is no photo. One of:
                    kit, cleanser, serum, brush, giftcard
   Photo:           file name inside images/shop/ (optional)
   Badge:           small label on the card, e.g. Bestseller (optional)
   Description:     one or two short sentences (optional)
   Sold out:        yes (optional). Forces the card to Sold out.
   Backorder:       yes (optional). When stock is 0 the card says Backorder and can
                    still be bought. In the live shop this comes from Stripe, see
                    SHOP-SETUP.md.
   Demo stock:      number (optional). Only used in the preview (Demo mode yes)
                    to show how stock counts work. In the live shop the stock
                    number comes from Stripe, see SHOP-SETUP.md.
   ====================================================================== */

window.KALO_SHOP_CONTENT = `

# ---------------- SHOP SETTINGS ----------------
Title: Aftercare and gift cards
Intro: Take the care home. Products and gift cards from the studio.

# Demo mode: yes shows a preview checkout with sample products and charges nothing.
# Set it to no once your Stripe details are in (see SHOP-SETUP.md).
Demo mode: yes

Currency symbol: A$
Shipping note: Shipping and tax are calculated at checkout.
Checkout endpoint: /api/checkout
# Show an "Only N left" label when stock is this low or lower.
Low stock warning: 3
# Stock is shown as "10+ in stock" once it goes above this number, so exact large counts stay private.
Stock display limit: 10

Max per item: 10


# ---------------- PRODUCTS (sample items for the preview) ----------------
PRODUCT: Lash aftercare kit
Price: 39
Stripe price ID: price_REPLACE_ME_1
Icon: kit
Demo stock: 0
Backorder: yes
Badge: Bestseller
Description: A sample bundle for looking after lash extensions between visits.

PRODUCT: Gentle lash cleanser
Price: 24
Stripe price ID: price_REPLACE_ME_2
Icon: cleanser
Demo stock: 0
Backorder: yes
Description: A sample foaming cleanser made for daily use around the lash line.

PRODUCT: Lash and brow serum
Price: 49
Stripe price ID: price_REPLACE_ME_3
Icon: serum
Demo stock: 0
Backorder: yes
Description: A sample nightly serum to support natural lashes and brows.

PRODUCT: Spoolie set
Price: 12
Stripe price ID: price_REPLACE_ME_4
Icon: brush
Demo stock: 0
Backorder: yes
Description: A sample set of soft spoolies for brushing lashes and setting brows.

PRODUCT: Brow gel
Price: 28
Stripe price ID: price_REPLACE_ME_5
Icon: serum
Demo stock: 0
Backorder: yes
Badge: New
Description: A sample clear brow gel that holds shape through the day.

PRODUCT: Gift card
Price: 50
Stripe price ID: price_REPLACE_ME_6
Icon: giftcard
Description: A sample gift card for any service, sent by email.

`;
