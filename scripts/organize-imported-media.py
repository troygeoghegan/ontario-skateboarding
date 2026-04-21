#!/usr/bin/env python3
"""
Reorganize scraped Wix media into per-page folders with clean names,
then emit a typed TypeScript module at src/lib/imported-media.ts.

Reads:   public/imported/manifest.json  (produced by scrape-wix-media.py)
Writes:  public/imported/<page-slug>/<NN>.<ext>       (moved from flat dirs)
         public/imported/manifest.json                (rewritten with new paths)
         src/lib/imported-media.ts                    (typed asset registry)

Idempotent: running twice produces the same layout.
"""

from __future__ import annotations

import concurrent.futures as cf
import json
import re
import shutil
import sys
import urllib.parse
import urllib.request
from dataclasses import dataclass, field
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT_DIR = ROOT / "public" / "imported"
MANIFEST = OUT_DIR / "manifest.json"
TS_MODULE = ROOT / "src" / "lib" / "imported-media.ts"

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
        "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36"
    )
}

# ---------- page categorization --------------------------------------------

# Lower number = higher priority when picking the "primary" page for an asset.
def page_priority(path: str) -> int:
    if path.startswith("/post/"):               return 0
    if path.startswith("/event-details/"):      return 1
    if path.startswith("/product-page/"):       return 2
    # Topical single-page stories / galleries
    TOPIC_PAGES = {
        "/dunbat-2018", "/dunbat-2021", "/dunbat-2022",
        "/canada-skateboards-slurpee-open-2023",
        "/ams", "/lil-rippers", "/the-board", "/skaters-1",
        "/shred-central", "/og", "/og-legends-1", "/origin-of-skateboarding",
        "/links", "/news-1",
    }
    if path in TOPIC_PAGES:                     return 3
    # Generic about/contact/coming-soon variants
    SINGLE_PAGES = {
        "/about-us", "/about-3", "/contact-us", "/contact-2",
        "/coming-soon-03",
    }
    if path in SINGLE_PAGES:                    return 4
    # Listing / aggregator pages (lowest priority)
    LISTING = {
        "", "/", "/blog", "/news", "/archives", "/events", "/event-list",
        "/skaters", "/category/all-products",
    }
    if path in LISTING:                         return 9
    return 5


SECTION_OF = {
    0: "blog",       # /post/*
    1: "events",     # /event-details/*
    2: "shop",       # /product-page/*
}


def url_path(url: str) -> str:
    p = urllib.parse.urlparse(url).path
    return p.rstrip("/") or "/"


def slug_from_path(path: str) -> str:
    if path in ("", "/"):
        return "home"
    # strip leading slash, replace internal slashes with double-hyphen,
    # so /post/foo -> post--foo, /event-details/bar -> event-details--bar
    s = path.strip("/").replace("/", "--")
    s = re.sub(r"[^a-zA-Z0-9._-]+", "-", s)
    return s.lower()


def section_for(path: str) -> str:
    if path.startswith("/post/"):          return "blog"
    if path.startswith("/event-details/"): return "events"
    if path.startswith("/product-page/"):  return "shop"
    if path.startswith("/category/"):      return "shop"
    if path in ("", "/", "/home"):         return "site"
    return "site"


def camel_key(slug: str) -> str:
    parts = re.split(r"[^a-zA-Z0-9]+", slug)
    parts = [p for p in parts if p]
    if not parts:
        return "_"
    out = parts[0].lower() + "".join(p[:1].upper() + p[1:].lower() for p in parts[1:])
    # TS identifier can't start with a digit
    if out[0].isdigit():
        out = "_" + out
    return out


# ---------- page title fetching --------------------------------------------

TITLE_RE = re.compile(r"<title[^>]*>(.*?)</title>", re.IGNORECASE | re.DOTALL)

def fetch_title(url: str) -> str:
    try:
        req = urllib.request.Request(url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=20) as r:
            html = r.read().decode("utf-8", errors="replace")
        m = TITLE_RE.search(html)
        if not m:
            return ""
        t = re.sub(r"\s+", " ", m.group(1)).strip()
        # Wix commonly suffixes " | Ontario Skateboarding" or similar
        t = re.sub(r"\s*\|\s*Ontario Skateboarding.*$", "", t, flags=re.IGNORECASE)
        t = re.sub(r"\s*\|\s*ontarioskateboarding.*$", "", t, flags=re.IGNORECASE)
        # HTML-entity cheap decode
        t = (t.replace("&amp;", "&").replace("&#39;", "'")
               .replace("&quot;", '"').replace("&nbsp;", " "))
        return t
    except Exception:
        return ""


# ---------- main -----------------------------------------------------------

@dataclass
class PageInfo:
    url: str
    path: str
    slug: str
    section: str
    title: str = ""
    images: list[Path] = field(default_factory=list)   # relative-to-public paths
    videos: list[Path] = field(default_factory=list)


def main() -> int:
    manifest = json.loads(MANIFEST.read_text())

    # 1) decide primary page for every asset
    primaries: dict[str, str] = {}        # media_id -> primary url
    all_page_urls: set[str] = set()
    for media_id, info in {**manifest["images"], **manifest["videos"]}.items():
        pages = info.get("pages", [])
        all_page_urls.update(pages)
        # pick best page by priority, tie-break by shortest path (simpler)
        pages_sorted = sorted(
            pages, key=lambda u: (page_priority(url_path(u)), len(url_path(u)), u)
        )
        primaries[media_id] = pages_sorted[0] if pages_sorted else ""

    # 2) fetch titles for all referenced pages
    page_urls = sorted(all_page_urls)
    print(f"Fetching titles for {len(page_urls)} pages…")
    titles: dict[str, str] = {}
    with cf.ThreadPoolExecutor(max_workers=8) as ex:
        for url, title in zip(page_urls, ex.map(fetch_title, page_urls)):
            titles[url] = title or slug_from_path(url_path(url)).replace("-", " ").title()

    # 3) group assets by primary page, build PageInfo
    pages: dict[str, PageInfo] = {}
    def get_page(url: str) -> PageInfo:
        path = url_path(url)
        key = path
        if key not in pages:
            pages[key] = PageInfo(
                url=url.rstrip("/") or url,
                path=path,
                slug=slug_from_path(path),
                section=section_for(path),
                title=titles.get(url, "") or titles.get(url + "/", ""),
            )
        return pages[key]

    grouped_imgs: dict[str, list[tuple[str, dict]]] = {}
    grouped_vids: dict[str, list[tuple[str, dict]]] = {}
    for media_id, info in manifest["images"].items():
        prim = primaries[media_id]
        grouped_imgs.setdefault(prim, []).append((media_id, info))
    for media_id, info in manifest["videos"].items():
        prim = primaries[media_id]
        grouped_vids.setdefault(prim, []).append((media_id, info))

    # 4) move files into <page-slug>/NN.<ext>, deterministic by media_id sort
    new_image_paths: dict[str, str] = {}   # media_id -> "imported/<slug>/NN.ext"
    new_video_paths: dict[str, str] = {}

    for prim, items in grouped_imgs.items():
        page = get_page(prim)
        items.sort(key=lambda t: t[0])
        target_dir = OUT_DIR / page.slug
        target_dir.mkdir(parents=True, exist_ok=True)
        width = max(2, len(str(len(items))))
        for i, (media_id, info) in enumerate(items, 1):
            src_rel = info["file"]
            # `file` was stored as "public/imported/images/<name>.ext" originally
            src = ROOT / src_rel
            if not src.exists():
                # already moved on a previous run — try locating it under target
                candidates = list(OUT_DIR.rglob(Path(src_rel).name))
                if not candidates:
                    print(f"  ! missing source for {media_id}")
                    continue
                src = candidates[0]
            ext = src.suffix.lower()
            name = f"{i:0{width}d}{ext}"
            dest = target_dir / name
            if src.resolve() != dest.resolve():
                if dest.exists():
                    dest.unlink()
                shutil.move(str(src), str(dest))
            rel = dest.relative_to(OUT_DIR.parent).as_posix()  # imported/slug/NN.ext -> actually public/imported/...
            # We want the path usable as a public URL: strip leading 'public/'
            public_rel = dest.relative_to(ROOT / "public").as_posix()
            new_image_paths[media_id] = "/" + public_rel
            page.images.append(Path(public_rel))

    for prim, items in grouped_vids.items():
        page = get_page(prim)
        items.sort(key=lambda t: t[0])
        target_dir = OUT_DIR / page.slug
        target_dir.mkdir(parents=True, exist_ok=True)
        width = max(2, len(str(len(items))))
        for i, (media_id, info) in enumerate(items, 1):
            src_rel = info["file"]
            src = ROOT / src_rel
            if not src.exists():
                candidates = list(OUT_DIR.rglob(Path(src_rel).name))
                if not candidates:
                    print(f"  ! missing source for {media_id}")
                    continue
                src = candidates[0]
            ext = src.suffix.lower()
            name = f"video-{i:0{width}d}{ext}"
            dest = target_dir / name
            if src.resolve() != dest.resolve():
                if dest.exists():
                    dest.unlink()
                shutil.move(str(src), str(dest))
            public_rel = dest.relative_to(ROOT / "public").as_posix()
            new_video_paths[media_id] = "/" + public_rel
            page.videos.append(Path(public_rel))

    # 5) clean up now-empty legacy dirs
    for legacy in (OUT_DIR / "images", OUT_DIR / "videos"):
        if legacy.exists():
            # remove only if empty
            try:
                if not any(legacy.iterdir()):
                    legacy.rmdir()
                else:
                    # Leave any orphans alone but warn
                    leftovers = list(legacy.iterdir())
                    print(f"  ! {legacy} still has {len(leftovers)} file(s); leaving in place")
            except OSError:
                pass

    # 6) also register secondary-page references so every page's `images`
    #    array lists everything that appeared on it (not just primaries).
    for media_id, info in manifest["images"].items():
        path_new = new_image_paths.get(media_id)
        if not path_new:
            continue
        for purl in info.get("pages", []):
            page = get_page(purl)
            rel_path = Path(path_new.lstrip("/"))
            if rel_path not in page.images:
                page.images.append(rel_path)
    for media_id, info in manifest["videos"].items():
        path_new = new_video_paths.get(media_id)
        if not path_new:
            continue
        for purl in info.get("pages", []):
            page = get_page(purl)
            rel_path = Path(path_new.lstrip("/"))
            if rel_path not in page.videos:
                page.videos.append(rel_path)

    # 7) rewrite manifest with new public paths
    new_manifest = {
        "images": {
            media_id: {
                "file": new_image_paths.get(media_id, info["file"]),
                "source": info["source"],
                "pages": info["pages"],
                "primary_page": primaries.get(media_id, ""),
            }
            for media_id, info in manifest["images"].items()
        },
        "videos": {
            media_id: {
                "file": new_video_paths.get(media_id, info["file"]),
                "source": info["source"],
                "pages": info["pages"],
                "primary_page": primaries.get(media_id, ""),
            }
            for media_id, info in manifest["videos"].items()
        },
        "pages": {
            p.path: {
                "url": p.url,
                "title": p.title,
                "section": p.section,
                "slug": p.slug,
                "images": sorted({f"/{img.as_posix()}" for img in p.images}),
                "videos": sorted({f"/{vid.as_posix()}" for vid in p.videos}),
            }
            for p in sorted(pages.values(), key=lambda x: x.path)
        },
    }
    MANIFEST.write_text(json.dumps(new_manifest, indent=2, sort_keys=True))
    print(f"Rewrote manifest: {MANIFEST}")

    # 8) emit typed TS module
    def ts_str(s: str) -> str:
        return '"' + s.replace("\\", "\\\\").replace('"', '\\"') + '"'

    sections: dict[str, list[PageInfo]] = {}
    for p in pages.values():
        sections.setdefault(p.section, []).append(p)
    for v in sections.values():
        v.sort(key=lambda x: x.path)

    lines: list[str] = []
    lines.append("// AUTO-GENERATED by scripts/organize-imported-media.py")
    lines.append("// Source: https://www.ontarioskateboarding.ca (scraped assets)")
    lines.append("// Do not edit by hand — re-run the script to refresh.")
    lines.append("")
    lines.append("export type PageMedia = {")
    lines.append("  readonly url: string;")
    lines.append("  readonly path: string;")
    lines.append("  readonly title: string;")
    lines.append("  readonly slug: string;")
    lines.append("  readonly images: readonly string[];")
    lines.append("  readonly videos: readonly string[];")
    lines.append("};")
    lines.append("")

    def emit_page_const(var: str, p: PageInfo) -> None:
        imgs = sorted({f"/{img.as_posix()}" for img in p.images})
        vids = sorted({f"/{vid.as_posix()}" for vid in p.videos})
        lines.append(f"export const {var}: PageMedia = {{")
        lines.append(f"  url: {ts_str(p.url)},")
        lines.append(f"  path: {ts_str(p.path)},")
        lines.append(f"  title: {ts_str(p.title)},")
        lines.append(f"  slug: {ts_str(p.slug)},")
        lines.append("  images: [")
        for s in imgs: lines.append(f"    {ts_str(s)},")
        lines.append("  ],")
        lines.append("  videos: [")
        for s in vids: lines.append(f"    {ts_str(s)},")
        lines.append("  ],")
        lines.append("} as const;")
        lines.append("")

    # Flat consts for every page
    used_vars: set[str] = set()
    page_var: dict[str, str] = {}
    for p in sorted(pages.values(), key=lambda x: x.path):
        base = camel_key(p.slug) or "page"
        # prefix by section to avoid clashes and improve readability
        var = f"{p.section}_{base}" if p.section != "site" else base
        var = camel_key(var)
        original = var
        n = 2
        while var in used_vars:
            var = f"{original}{n}"
            n += 1
        used_vars.add(var)
        page_var[p.path] = var
        emit_page_const(var, p)

    # Section groupings
    for section, pgs in sorted(sections.items()):
        lines.append(
            f"export const {camel_key(section)}Pages = {{"
        )
        for p in pgs:
            key = camel_key(p.slug.split("--", 1)[-1]) or camel_key(p.slug)
            # disambiguate section member keys
            lines.append(f"  {key}: {page_var[p.path]},")
        lines.append("} as const;")
        lines.append("")

    # Map of every page keyed by its URL path
    lines.append("export const allPages: Record<string, PageMedia> = {")
    for p in sorted(pages.values(), key=lambda x: x.path):
        lines.append(f"  {ts_str(p.path)}: {page_var[p.path]},")
    lines.append("} as const;")
    lines.append("")

    # Full flat list of every image / video (unique, sorted)
    all_images: set[str] = set()
    all_videos: set[str] = set()
    for p in pages.values():
        all_images.update(f"/{img.as_posix()}" for img in p.images)
        all_videos.update(f"/{vid.as_posix()}" for vid in p.videos)
    lines.append("export const allImages: readonly string[] = [")
    for s in sorted(all_images): lines.append(f"  {ts_str(s)},")
    lines.append("] as const;")
    lines.append("")
    lines.append("export const allVideos: readonly string[] = [")
    for s in sorted(all_videos): lines.append(f"  {ts_str(s)},")
    lines.append("] as const;")
    lines.append("")

    TS_MODULE.parent.mkdir(parents=True, exist_ok=True)
    TS_MODULE.write_text("\n".join(lines))
    print(f"Wrote TS module:  {TS_MODULE}")

    # Summary
    print(
        f"\nPages: {len(pages)}  |  "
        f"images: {len(manifest['images'])}  |  videos: {len(manifest['videos'])}"
    )
    for section, pgs in sorted(sections.items()):
        print(f"  section '{section}': {len(pgs)} page(s)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
