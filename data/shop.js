/* ======================================================================
   KALOBEAUTY SHOP  -  settings for the shop page.
   Setup steps are in SHOP-SETUP.md and STRIPE-ENVIRONMENTS-READ-ME.md.

   WHERE THE PRODUCTS COME FROM
   - When Demo mode is no, products are loaded straight from Stripe. Add or
     edit a product in Stripe and it appears on the site by itself.
     Nothing in the PRODUCT lines below is used.
   - When Demo mode is yes, the sample PRODUCT lines below are shown instead,
     with a pretend checkout. Nothing is charged.

   ON A STRIPE PRODUCT (Product catalogue > product > Additional options > Metadata)
     shop       true   (required, or the product is not shown)
     stock      number in stock (leave off for unlimited, e.g. gift cards)
     backorder  true   (can still be bought when stock is 0)
     badge      small label on the card, e.g. New
     icon       drawing when there is no photo: kit, cleanser, serum, brush, giftcard
     order      number to sort by (1 shows first)
   The name, description, photo and price come from the product itself in
   Stripe (its default price, a one-time AUD price).

   Lines starting with # are notes. Keep the words before each colon exactly
   as shown. Do not use the backtick character ` anywhere in this file.

   FIELDS FOR A SAMPLE PRODUCT (Demo mode only)
   PRODUCT:         name shown on the card (required)
   Price:           price in dollars, e.g. 39 or 39.50 (required)
   Icon:            kit, cleanser, serum, brush or giftcard
   Photo:           file name inside images/shop/ (optional)
   Badge:           small label, e.g. New (optional)
   Description:     one or two sentences (optional)
   Demo stock:      number in stock for the preview (optional)
   Backorder:       yes = still buyable at 0 stock (optional)
   Sold out:        yes (optional)
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


# ---------------- SAMPLE PRODUCTS (shown only when Demo mode is yes) ----------------
PRODUCT: Kalobeauty Lash Tray
Price: 39
Icon: kit
Demo stock: 0
Backorder: yes
Badge: Bestseller
Description: A sample bundle for looking after lash extensions between visits.

PRODUCT: Gentle lash cleanser
Price: 24
Icon: cleanser
Demo stock: 0
Backorder: yes
Description: A sample foaming cleanser made for daily use around the lash line.

PRODUCT: Lash and brow serum
Price: 49
Icon: serum
Demo stock: 0
Backorder: yes
Description: A sample nightly serum to support natural lashes and brows.

PRODUCT: Spoolie set
Price: 12
Icon: brush
Demo stock: 0
Backorder: yes
Description: A sample set of soft spoolies for brushing lashes and setting brows.

PRODUCT: Brow gel
Price: 28
Icon: serum
Demo stock: 0
Backorder: yes
Badge: New
Description: A sample clear brow gel that holds shape through the day.

PRODUCT: Gift card
Price: 50
Icon: giftcard
Description: A sample gift card for any service, sent by email.

`;
