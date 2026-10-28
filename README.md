# KALOBEAUTY website

Access to locally hosted gitpages url: https://snopery.github.io/kalobeauty/
```
kalobeauty-site/
  index.html          page layout (leave alone)
  css/style.css       colours and fonts (variables at the top)
  js/app.js           page behaviour (leave alone)
  data/services.js    <-- YOUR CONTENT: edit this in Notepad / TextEdit
  images/             <-- YOUR PHOTOS: put image files here
```

`data/services.js` is plain text. No brackets, quotes or commas to worry about.

## Add a service
1. Open `data/services.js`.
2. Find the CATEGORY it belongs to. Copy any SERVICE block (from `SERVICE:` down to its `Description:` line) and paste it under that category.
3. Change the words after each colon:

```
SERVICE: Volume
Price: A$170
Time: 2 hours
Booking number: 40463467
Photo: volume.jpg
Description: A uniform finish of extensions.
```

- **Booking number** is the number in the Acuity link for that service:
  `.../appointment/40463467/calendar/...` -> `40463467`
- Optional lines: `Full name:` (longer title in the preview), `Badge:` (e.g. Most popular), `Icon:`.

## Remove a service
Delete its lines (from `SERVICE:` to its `Description:`).

## Move a service to another category
Cut its lines and paste them under the other CATEGORY line. A service always belongs to the category above it.

## Add a photo
1. Put the image in the `images/` folder (JPG, roughly square, under 300 KB is ideal).
2. In the service, write `Photo: your-file-name.jpg` (spelling and capitals must match).
No photo? Leave out the Photo line and add `Icon: lash` (or refill, removal, tint, liftext, liftbrow, browwax, lipwax, chinwax, sidewax). If a photo file is missing, the icon shows instead.

## Add, rename, remove or reorder a category
Each `CATEGORY:` line is a button. Add `Note:` underneath for the small line shown under the tiles. Order in the file = order on the site.

## Refill guide
Edit the `REFILL GUIDE` section at the bottom. Each `OPTION:` points to a service by its exact `SERVICE:` name, so the price and link come from that service. Delete the whole section to hide it.

## If something looks wrong
Open the page. If a line in `services.js` is missing something or mistyped, a yellow box appears at the top naming the line. Fix it and refresh. Rules: keep the words before each colon as written, and don't use the backtick character ` anywhere.

## Colours and fonts
Top of `css/style.css`.

## Preview and publish
Preview: double-click `index.html`. Publish (GitHub Pages): upload the folder contents keeping the folders, then Settings > Pages > deploy from `main` / root. After an edit, upload the changed file again.
