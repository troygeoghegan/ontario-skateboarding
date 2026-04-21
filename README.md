# Ontario Skateboarding

A Next.js 15 / React 19 / Tailwind rebuild of [ontarioskateboarding.ca](https://www.ontarioskateboarding.ca/).

The site pulls imagery, video and page metadata directly from the existing live Wix site via a repeatable scrape‑and‑build pipeline — no data is hard-coded.

## Quick start

```bash
npm install
npm run dev       # http://localhost:3000
```

Without running the media pipeline below, image `<img>` tags will 404. The
UI still renders, but you'll want to pull the assets first.

## Media pipeline

The three scripts in `scripts/` are idempotent. Run them in order the first time you clone, and any time you want to refresh from the live site.

```bash
# 1. Scrape every imagery / video asset referenced on every page of
#    ontarioskateboarding.ca (walks the Wix sitemap).
python3 scripts/scrape-wix-media.py

# 2. Reorganize into per-page folders with clean names, fetch page titles,
#    and regenerate the typed src/lib/imported-media.ts module.
python3 scripts/organize-imported-media.py

# 3. Recompress PNG losslessly + JPG via mozjpeg (dimensions preserved,
#    no visible quality loss). Only replaces files when the new encoding
#    is smaller than the original.
node scripts/optimize-media.mjs
```

Result:

```
public/imported/
├── manifest.json              # tracked in git — record of what the pipeline produced
├── home/                      # per-page subfolders, NOT tracked in git
├── post--<slug>/              #   (regenerate locally via the scripts above)
├── event-details--<slug>/
├── product-page--<slug>/
└── …
```

The folder contents are deliberately ignored by git (`~300 MB`, one `>100 MB` video) so the repo stays lean. `manifest.json` is committed as a structural record — every filename the site references and which live URL it came from.

## Content model

The generated module at `src/lib/imported-media.ts` is fully typed and exports:

- `home`, `blogPost*`, `eventsEventdetails*`, `shopProductpage*`, and one constant per other scraped page.
- Group objects: `blogPages`, `eventsPages`, `shopPages`, `sitePages`.
- Indexed lookup: `allPages: Record<string, PageMedia>` keyed by URL path.
- Flat lists: `allImages`, `allVideos`.

`src/lib/content.ts` curates that data into display-ready `BlogPostItem`, `EventItem` and `ProductItem` arrays consumed by the route files. It also exposes helpers like `ownImages(page)` and `coverImage(page)`.

## Routes

| Route | Source | What renders |
|---|---|---|
| `/` | `home` + featured content | Hero image, featured video, latest posts, products, events |
| `/about` | `topics.theBoard` | Board photo gallery |
| `/blog` | `blogPosts` | Grid of every imported post |
| `/blog/[slug]` | `findBlogPost(slug)` | Video + full image gallery (SSG, 33 pages) |
| `/events` | `eventItems` | Grid of event detail pages |
| `/events/[slug]` | `findEvent(slug)` | Event image gallery (SSG, 9 pages) |
| `/shop` | `productItems` | Product grid |
| `/shop/[slug]` | `findProduct(slug)` | Product detail with primary + thumbnails (SSG, 4 pages) |
| `/contact` | — | Contact form |

## Commands

```bash
npm run dev      # dev server (Turbopack)
npm run build    # production build — also runs typecheck + generates 55 static pages
npm run start    # serve the production build
npm run lint     # eslint
```
