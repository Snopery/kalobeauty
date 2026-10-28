# KALOBEAUTY website

Access to locally hosted gitpages url: https://snopery.github.io/kalobeauty/

```
kalobeauty-site/
  index.html          page layout (rarely needs editing)
  css/style.css       colours, fonts and spacing (colours are the variables at the top)
  js/app.js           page behaviour (you don't need to edit this)
  data/services.js    <-- YOUR CONTENT: categories, tiles, prices, refill guide
  images/             <-- YOUR PHOTOS: put image files here
```

## Add or change a service (tile)
1. Open `data/services.js`.
2. Copy an existing block inside `services: [ ... ]`, paste it below, and change:
   - `id` (unique, no spaces), `category` (a category id), `short` (tile label),
     `name`, `time`, `price`, `description`.
   - `appointmentId`: the number from the Acuity link for that service.
     Link example `.../appointment/51297509/calendar/7815696` -> `51297509`.
3. Save. Tiles appear in the order they are listed.

## Add a photo to a tile
1. Put the photo in the `images/` folder (JPG, square-ish, about 800 px wide, under 300 KB is ideal).
2. In that service's block set `image: 'my-photo.jpg'` (exact file name, including capitals).
3. No photo yet? Leave `image: ''` and pick an `icon` (default, refill, removal, tint, liftext, liftbrow, browwax, lipwax, chinwax, sidewax). If a photo file is missing, the icon shows instead.

## Add, rename or remove a category
Edit `categories: [ ... ]` in `data/services.js`. Each service's `category` must match a category `id`. Remove a category by deleting its line (and moving or deleting its services).

## Refill guide
Edit `refillGuide` at the bottom of `data/services.js`. Each option points at a service `id`, so its price and link stay in sync. Set `refillGuide: null` to hide the section.

## Colours and fonts
Top of `css/style.css` (`--bg`, `--ink`, `--rose` ...).

## Preview on your computer
Open `index.html` by double-clicking it. Works offline except the web fonts.

## Publish (GitHub Pages)
Upload the whole folder contents (keep the folders) to your repository, then Settings > Pages > deploy from `main` / root. After each edit, upload the changed file again.
Tip: commas matter in `services.js`. Every block ends with `},` except the last in a list.
