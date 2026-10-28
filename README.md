# KALOBEAUTY website

Test link: https://snopery.github.io/kalobeauty/#services

```
kalobeauty-site/
  index.html          page layout (leave alone)
  css/style.css       colours and fonts (variables at the top)
  js/app.js           page behaviour (leave alone)
  data/services.js    <-- YOUR CONTENT: edit this in Notepad / TextEdit
  images/             <-- YOUR PHOTOS: tile photos here
  images/gallery/     <-- gallery strip photos here
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

## Photo gallery (the slide-out side panel)
A dark "Gallery" tab sits on the right edge of the page. Tap it (or pull it left on a phone) and a panel slides across with the photos. Tap a photo to see it full screen. The Gallery button in the top navigation opens it too.

1. Put photos in `images/gallery/` (JPG, about 1200 px on the long side, under 200 KB each).
2. In `data/services.js`, find the `GALLERY` section and add one line per photo: `Photo: my-photo.jpg`.
3. Optional: add `Title: The work` right under `GALLERY` to show a heading above the strip.
4. Optional: add `Caption: Soft wispy set` under a Photo line. It shows on hover and in the full-screen view.
Photos can be portrait or landscape. Delete a Photo line to remove it, or delete the whole GALLERY section to hide the strip. Customers can scroll the strip, tap a photo to enlarge it, and swipe or use arrow keys to move between photos.

## Refill guide
Edit the `REFILL GUIDE` section at the bottom. Each `OPTION:` points to a service by its exact `SERVICE:` name, so the price and link come from that service. Delete the whole section to hide it.

## If something looks wrong
Open the page. If a line in `services.js` is missing something or mistyped, a yellow box appears at the top naming the line. Fix it and refresh. Rules: keep the words before each colon as written, and don't use the backtick character ` anywhere.

## Colours and fonts
Top of `css/style.css`.

## Preview and publish
Test link (live site): https://snopery.github.io/kalobeauty/#services
After you upload a change, wait a minute or two, then refresh that link (Ctrl+Shift+R, or Cmd+Shift+R on Mac) to see it.

Preview: double-click `index.html`. Publish (GitHub Pages): upload the folder contents keeping the folders, then Settings > Pages > deploy from `main` / root. After an edit, upload the changed file again.
