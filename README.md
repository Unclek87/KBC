# Korkollie Business Center — Website

Marketing website for **Korkollie Business Center (KBC)** — printing, branding,
apparel customization and business document services in Paynesville, Liberia.

> *"Best of the Best"*
> Opposite ELBC Station, Sand Town Junction, Paynesville City, Liberia
> 0886 460 783 · 0775 460 783 · stk.korkollie@gmail.com

---

## What this is

A single-page, mobile-first static website. There is no backend and no database:
the quote form assembles what the visitor typed into a WhatsApp message
addressed to 0886460783, so enquiries land straight in the shop's chat.

It is built to load fast on a low-end Android phone over slow mobile data:

| Asset | Raw | Over the wire | Notes |
| --- | --- | --- | --- |
| `index.html` | 83 KB | **16 KB** | Includes the inline icon sprite, so no icon files are downloaded at all |
| `assets/css/styles.css` | 36 KB | **7 KB** | Compiled and minified Tailwind |
| `assets/js/main.js` | 11 KB | **4 KB** | Plain vanilla JavaScript, no libraries |
| `assets/fonts/` | 67 KB | 67 KB | Anton + Inter, latin subset, self-hosted (woff2 is already compressed) |
| `assets/img/` | 36 KB | 36 KB | 15 placeholder SVGs; only the 3 hero images load up front, the rest are lazy |

That is roughly **95 KB for a first visit** on a server with gzip enabled (nearly
all hosts do it by default), and almost nothing on repeat visits once the fonts
are cached. No jQuery, no Bootstrap, no CDN scripts, no tracking. Fonts are
self-hosted rather than pulled from Google Fonts, which removes two extra DNS
lookups and TLS handshakes from the critical path.

Real photographs will be the heaviest thing on the page by far — see the sizing
advice below.

## Running it locally

Any static file server works — there is nothing to compile in order to view the
site:

```bash
npm run serve          # then open http://localhost:8000
```

## Changing the design

The CSS is compiled from Tailwind. If you edit `index.html` (adding or changing
any `class="..."`) or `src/input.css`, rebuild the stylesheet:

```bash
npm install            # once, to get the Tailwind compiler
npm run build:css      # rebuild assets/css/styles.css
npm run watch:css      # or rebuild automatically while you work
```

`assets/css/styles.css` **is committed on purpose** so the site can be deployed
straight from this repository with no build step. Remember to rebuild and commit
it after changing classes, or your change will not show up live.

Brand colours, fonts and shadows are defined in `tailwind.config.js`; the
reusable pieces (`.btn-gold`, `.card`, `.seal-frame`, `.tab`, …) are in
`src/input.css`.

### Palette

| Colour | Hex | Used for |
| --- | --- | --- |
| Deep navy | `#0B2A6B` | Headings, dark sections, header text |
| Royal blue | `#1656C4` | Links, icons, accents |
| Gold | `#F5B301` | Primary buttons, hairline borders, rings |
| Red | `#D62027` | Required-field marks, "Closed", accents |
| Green | `#1E7A3C` | WhatsApp actions |
| White | `#FFFFFF` | Page background |

---

## Before you go live: what to swap in

Everything below is marked with a `TODO` comment in the code, so you can also
just search the project for `TODO`.

### 1. The logo  ⭐ most visible

Replace **`assets/img/kbc-logo-placeholder.svg`** with the real circular KBC seal
(the blue and red "Republic of Liberia" seal). Keep the same filename and the
header, the footer and the structured data all update at once. A square export of
at least 512 × 512 px works best — SVG or PNG with a transparent background.

### 2. Photographs

| Where | Files | What to use |
| --- | --- | --- |
| Hero collage | `assets/img/hero/hero-banner.svg`, `hero-uniforms.svg`, `hero-diplomas.svg` | **Square** crops, about 800 × 800. These sit inside circles, so anything wider gets its sides cut off. |
| Gallery | the 12 files in `assets/img/gallery/` | 4:3 landscape, about 800 × 600 |

Keep the existing filenames and no HTML changes are needed. Save photos as JPG
or WebP and keep each one **under about 150 KB** — this is the single easiest way
to keep the site fast for customers on mobile data. Every gallery image is
already lazy-loaded.

If you rename a file, update both the `src` **and** the `alt` text in
`index.html`. Alt text matters: it is what a visitor sees if an image fails to
load on a weak connection, and it is how Google understands the picture.

### 3. The map

In the Contact section, replace the dashed "Map Embed Placeholder" box with your
Google Maps embed:

1. Open Google Maps, search **Sand Town Junction, Paynesville**.
2. Find the shop, then choose **Share → Embed a map → Copy HTML**.
3. Paste the `<iframe>` in place of the placeholder block, keeping
   `loading="lazy"` and a `title` attribute so the page stays fast and
   accessible.

The exact shape to aim for is in a comment right above that block.

### 4. Social links

The footer Facebook and Instagram icons currently point at `#`. Replace those two
`href="#"` values with your real page URLs. The WhatsApp icon already works.

### 5. Domain, share image and favicon

- **Domain** — search `index.html`, `robots.txt` and `sitemap.xml` for
  `korkolliebusinesscenter.com` and replace it with your real domain. It appears
  in the canonical link, the Open Graph tags and the LocalBusiness schema.
- **Share image** — Facebook and WhatsApp do not render SVG previews. Export a
  1200 × 630 JPG (a photo of the shop front works well), save it as
  `assets/img/og-image.jpg`, and point the `og:image` and `twitter:image` tags at
  it. Until then link previews will show no picture.
- **Favicon** — replace `assets/img/favicon.svg` with a crop of the real seal, and
  add `favicon.ico` (32 × 32) plus `apple-touch-icon.png` (180 × 180) beside it.
- **Map coordinates** — the `geo` block in the LocalBusiness schema uses an
  approximate Paynesville location. Right-click the shop entrance in Google Maps,
  copy the exact coordinates, and paste them in.

### 6. Testimonials

The three quotes in the Testimonials section are **placeholders**, written to show
the right tone. Replace the wording, names and titles with real feedback you have
permission to publish before the site goes live.

---

## Deploying

The site is plain static files, so it can be hosted free on Netlify, Vercel,
Cloudflare Pages or GitHub Pages. Point the host at the repository root — there
is no build command and no output directory to configure.

For GitHub Pages: repository **Settings → Pages**, source *Deploy from a branch*,
pick the branch and the `/ (root)` folder.

Whichever host you use, make sure the site is served over **https**, otherwise
some phones will not offer tap-to-call reliably.

---

## Accessibility and SEO notes

Worth preserving as you edit:

- Every image has descriptive alt text; decorative shapes are `aria-hidden`.
- All colour combinations meet WCAG AA contrast (4.5:1 or better for body text).
  Gold is only ever used on navy or as a background behind navy text — **gold text
  on white is not readable**, so avoid it.
- Buttons, the gallery filters and the tap-to-call links are all at least 44 px
  tall, the comfortable minimum for a thumb.
- The gallery lightbox is keyboard-operable (arrow keys, Escape, trapped Tab) and
  returns focus where it started.
- Animations are skipped for anyone whose phone has "reduce motion" turned on.
- The page carries a `LocalBusiness` schema with the address, both phone numbers,
  opening hours and all 16 services, which is what lets Google show the shop
  details directly in search results.

## File layout

```
index.html                  The whole page
robots.txt, sitemap.xml     Search engine basics
package.json                Build scripts
tailwind.config.js          Brand palette, fonts, shadows
src/input.css               Tailwind source + reusable components  ← edit this
assets/
  css/styles.css            Compiled stylesheet  ← generated, do not edit
  js/main.js                Menu, gallery filter, lightbox, quote form
  fonts/                    Anton + Inter (SIL Open Font Licence, see OFL.txt)
  img/
    kbc-logo-placeholder.svg
    favicon.svg
    og-image-placeholder.svg
    hero/                   3 square placeholders for the hero circles
    gallery/                12 placeholders for the gallery
```

## Licence

Site code © Korkollie Business Center. The bundled Anton and Inter fonts are
licensed under the SIL Open Font License 1.1 — see `assets/fonts/OFL.txt`.
