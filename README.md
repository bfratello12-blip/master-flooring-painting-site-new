# Master Flooring &amp; Painting — website

Static site. No frameworks, no build dependencies to install. The `.html` files in the
project root are the deployable site.

## Preview locally

```powershell
npx serve -l 3000 .
```

Then open http://localhost:3000

## Editing content

Page content lives in `src/pages/`. Each file starts with a `<!--meta ... meta-->`
block (title, meta description, breadcrumbs, structured data) followed by the page body.
The shared header, footer, icons and repeated blocks live in `build.js` and
`src/partials/`.

After editing anything in `src/`, regenerate the site:

```powershell
node build.js
```

That rewrites the root `.html` files and `sitemap.xml`.
**Do not edit the root `.html` files directly** — they are overwritten on every build.

## Things to fill in

| What | Where | Current placeholder |
| --- | --- | --- |
| Google reviews link | `assets/js/main.js` → `SITE_CONFIG.GOOGLE_REVIEWS_URL` | Google search URL |
| Google review count | `assets/js/main.js` → `SITE_CONFIG.GOOGLE_REVIEW_COUNT` | `[REVIEW COUNT]` |
| Form delivery endpoint | `assets/js/main.js` → `SITE_CONFIG.FORM_ENDPOINT` | `null` |
| Photos (63 of them) | see **Images** below | numbered dashed boxes |
| Project towns in gallery | `src/pages/our-work.html` | `[Town], NY` |

Setting `GOOGLE_REVIEW_COUNT` to a number automatically removes the highlighted
placeholder styling everywhere it appears.

## Images

Every placeholder on the site carries a unique number badge (`001` … `063`) and tells
you the filename to use. **[IMAGE-LIST.txt](IMAGE-LIST.txt)** is the matching checklist:
number, page, and a description of the photo that belongs in each slot.

To supply photos: name each file with its number — `001.jpg`, `002.jpg`, `047.jpg` — and
put them in `assets/img/photos/`. The numbers are all the placement information needed.

Numbers are assigned automatically at build time in page order, then document order, so
they stay consistent as long as placeholders aren't added or removed above an existing
one. Rerun `node build.js` and `IMAGE-LIST.txt` regenerates.

### Adding a hero photo

Nine pages have a full-bleed hero background slot. In `src/pages/<page>.html`, replace
the `{{HEROBG}}` token with:

```html
<div class="hero-bg" aria-hidden="true">
  <img src="assets/img/photos/001.jpg" alt="" width="1920" height="1080">
</div>
<div class="hero-scrim" aria-hidden="true"></div>
```

Then delete that page's `{{HERONOTE:…}}` line and run `node build.js`. The scrim keeps
the headline readable over any photo, so images don't need pre-darkening.

**Review schema:** `build.js` intentionally does *not* publish an `aggregateRating`.
Once the review count is verified, add it to `businessNode` in `build.js`.

## Forms

With `FORM_ENDPOINT` set to `null`, submitting an estimate form opens the visitor's
email app with all the details pre-filled and addressed to
`masterflooringandpainting@gmail.com`.

For a proper inbox submission, create a form endpoint (Formspree, Basin, Netlify Forms,
etc.), paste the URL into `SITE_CONFIG.FORM_ENDPOINT`, and the forms will POST to it
instead. Field names sent: `name`, `phone`, `email`, `location`, `service`, `property`,
`details`, `consent`. A hidden `company_website` field acts as a spam honeypot — ignore
or reject any submission where it is filled in.

## Assets

```
assets/css/style.css   design system + all page styles
assets/js/main.js      site config, nav, forms, accordions, before/after sliders
assets/img/logo/       brand logos (light + dark background versions)
assets/img/badges/     Angi Super Service Award 2025
assets/img/photos/     project photos, named by placeholder number
```

Original supplied files remain untouched in `logo/` and `images/`.
# master-flooring-painting-site-new
