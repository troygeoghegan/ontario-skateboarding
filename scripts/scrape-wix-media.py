#!/usr/bin/env python3
"""
Scrape all imagery and video from ontarioskateboarding.ca (a Wix site).

Strategy:
  1. Walk the site's sitemap index to enumerate every public page URL.
  2. Fetch the HTML for each page and harvest references to Wix-hosted
     media (static.wixstatic.com for images, video.wixstatic.com for video).
  3. Resolve each reference to the ORIGINAL, untransformed asset and
     download it to ontario-skateboarding/public/imported/{images|videos}.
  4. Write a manifest.json describing which URL each file came from.

Run:
    python3 scripts/scrape-wix-media.py
"""

from __future__ import annotations

import concurrent.futures as cf
import json
import os
import re
import sys
import time
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from pathlib import Path

SITE = "https://www.ontarioskateboarding.ca"
SITEMAP = f"{SITE}/sitemap.xml"

ROOT = Path(__file__).resolve().parent.parent
OUT_DIR = ROOT / "public" / "imported"
IMG_DIR = OUT_DIR / "images"
VID_DIR = OUT_DIR / "videos"
MANIFEST = OUT_DIR / "manifest.json"

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
        "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36"
    ),
    "Accept": "*/*",
}

IMG_EXTS = {"jpg", "jpeg", "png", "gif", "webp", "svg", "avif"}
VID_EXTS = {"mp4", "mov", "webm", "m4v", "mpd", "m3u8"}

# Wix media IDs look like: 1ad809_214ebf461ef94a3f87d659823d4b52d0~mv2.jpg
# or: 11062b_...~mv2.png  (and similar with varied prefixes).
WIX_MEDIA_RE = re.compile(
    r"([0-9a-f]{6}_[0-9a-f]{16,}(?:~mv2)?(?:_[0-9]+)?\.(?:jpg|jpeg|png|gif|webp|svg|avif|mp4|mov|webm|m4v|gif))",
    re.IGNORECASE,
)
# video.wixstatic.com videos are referenced by ID directory e.g.
#   https://video.wixstatic.com/video/<id>/<variant>/mp4/file.mp4
WIX_VIDEO_ID_RE = re.compile(
    r"video\.wixstatic\.com/video/([0-9a-f]{6}_[0-9a-f]{16,}f?)/", re.IGNORECASE
)


def fetch(url: str, timeout: int = 30) -> bytes:
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.read()


def fetch_text(url: str) -> str:
    try:
        return fetch(url).decode("utf-8", errors="replace")
    except Exception as e:
        print(f"  ! fetch error {url}: {e}")
        return ""


def parse_sitemap(xml_bytes: bytes) -> list[str]:
    urls: list[str] = []
    try:
        root = ET.fromstring(xml_bytes)
    except ET.ParseError as e:
        print(f"sitemap parse error: {e}")
        return urls
    ns = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    for loc in root.iter("{http://www.sitemaps.org/schemas/sitemap/0.9}loc"):
        if loc.text:
            urls.append(loc.text.strip())
    return urls


def collect_urls() -> list[str]:
    print(f"Fetching root sitemap: {SITEMAP}")
    roots = parse_sitemap(fetch(SITEMAP))
    all_pages: set[str] = set()
    for sm in roots:
        if sm.endswith(".xml"):
            print(f"  sitemap: {sm}")
            try:
                sub = parse_sitemap(fetch(sm))
            except Exception as e:
                print(f"    ! {e}")
                continue
            for u in sub:
                if u.endswith(".xml"):
                    try:
                        all_pages.update(parse_sitemap(fetch(u)))
                    except Exception as e:
                        print(f"    ! {e}")
                else:
                    all_pages.add(u)
        else:
            all_pages.add(sm)
    # Always include the homepage
    all_pages.add(SITE + "/")
    return sorted(all_pages)


def extract_media_refs(html: str) -> tuple[set[str], set[str]]:
    """Return (image_ids, video_ids) from a page's HTML."""
    image_ids: set[str] = set()
    video_ids: set[str] = set()

    for m in WIX_MEDIA_RE.findall(html):
        ext = m.rsplit(".", 1)[-1].lower()
        if ext in IMG_EXTS:
            image_ids.add(m)
        elif ext in VID_EXTS:
            # Files hosted under static.wixstatic.com/media/<id>.<ext>
            image_ids.add(m) if ext == "gif" else video_ids.add(m)

    for vid in WIX_VIDEO_ID_RE.findall(html):
        video_ids.add(vid)

    return image_ids, video_ids


def safe_filename(media_id: str) -> str:
    return media_id.replace("/", "_").replace("~", "-")


def download(url: str, dest: Path) -> bool:
    if dest.exists() and dest.stat().st_size > 0:
        return True
    dest.parent.mkdir(parents=True, exist_ok=True)
    tmp = dest.with_suffix(dest.suffix + ".part")
    try:
        req = urllib.request.Request(url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=60) as r, open(tmp, "wb") as f:
            while True:
                chunk = r.read(1 << 15)
                if not chunk:
                    break
                f.write(chunk)
        tmp.rename(dest)
        return True
    except Exception as e:
        if tmp.exists():
            tmp.unlink(missing_ok=True)
        print(f"  ! download {url}: {e}")
        return False


def resolve_video_url(video_id: str) -> str | None:
    """For video.wixstatic.com, we need to find an actual mp4 URL.
    The video listing page at https://video.wixstatic.com/video/<id>/ isn't
    directly browsable, but many Wix sites reference a specific mp4 in HTML.
    As a fallback try a couple of common variant patterns."""
    candidates = [
        f"https://video.wixstatic.com/video/{video_id}/1080p/mp4/file.mp4",
        f"https://video.wixstatic.com/video/{video_id}/720p/mp4/file.mp4",
        f"https://video.wixstatic.com/video/{video_id}/480p/mp4/file.mp4",
        f"https://video.wixstatic.com/video/{video_id}/mp4/file.mp4",
    ]
    for url in candidates:
        try:
            req = urllib.request.Request(url, headers=HEADERS, method="HEAD")
            with urllib.request.urlopen(req, timeout=15) as r:
                if 200 <= r.status < 300:
                    return url
        except Exception:
            continue
    return None


def main() -> int:
    IMG_DIR.mkdir(parents=True, exist_ok=True)
    VID_DIR.mkdir(parents=True, exist_ok=True)

    pages = collect_urls()
    # Filter to only pages on our own site (sitemap can include subdomains etc.)
    pages = [p for p in pages if "ontarioskateboarding.ca" in p]
    print(f"\nDiscovered {len(pages)} pages. Fetching HTML and extracting media…\n")

    all_images: dict[str, list[str]] = {}  # media_id -> [pages]
    all_videos: dict[str, list[str]] = {}

    def process_page(url: str) -> tuple[str, set[str], set[str]]:
        html = fetch_text(url)
        imgs, vids = extract_media_refs(html) if html else (set(), set())
        return url, imgs, vids

    with cf.ThreadPoolExecutor(max_workers=8) as ex:
        for i, (url, imgs, vids) in enumerate(ex.map(process_page, pages), 1):
            print(f"[{i}/{len(pages)}] {url}  →  {len(imgs)} img, {len(vids)} vid")
            for m in imgs:
                all_images.setdefault(m, []).append(url)
            for v in vids:
                all_videos.setdefault(v, []).append(url)

    print(
        f"\nUnique assets: {len(all_images)} image(s), {len(all_videos)} video(s). "
        f"Downloading…\n"
    )

    manifest: dict[str, dict] = {"images": {}, "videos": {}}

    # Download images at original resolution
    def dl_image(media_id: str) -> tuple[str, bool, str]:
        url = f"https://static.wixstatic.com/media/{media_id}"
        dest = IMG_DIR / safe_filename(media_id)
        ok = download(url, dest)
        return media_id, ok, str(dest.relative_to(ROOT))

    with cf.ThreadPoolExecutor(max_workers=8) as ex:
        for i, (media_id, ok, rel) in enumerate(
            ex.map(dl_image, all_images.keys()), 1
        ):
            marker = "✓" if ok else "✗"
            print(f"  [img {i}/{len(all_images)}] {marker} {media_id}")
            if ok:
                manifest["images"][media_id] = {
                    "file": rel,
                    "source": f"https://static.wixstatic.com/media/{media_id}",
                    "pages": sorted(set(all_images[media_id])),
                }

    # Download videos (resolve variant first)
    def dl_video(video_id: str) -> tuple[str, bool, str, str]:
        # If it's already a filename like <id>~mv2.mp4 on static.wixstatic.com,
        # download directly. Otherwise it's a video.wixstatic.com video id.
        if video_id.endswith(tuple(f".{e}" for e in VID_EXTS)):
            url = f"https://static.wixstatic.com/media/{video_id}"
            dest = VID_DIR / safe_filename(video_id)
            return video_id, download(url, dest), str(dest.relative_to(ROOT)), url
        resolved = resolve_video_url(video_id)
        if not resolved:
            return video_id, False, "", ""
        ext = resolved.rsplit(".", 1)[-1]
        dest = VID_DIR / f"{video_id}.{ext}"
        return video_id, download(resolved, dest), str(dest.relative_to(ROOT)), resolved

    with cf.ThreadPoolExecutor(max_workers=4) as ex:
        for i, (vid, ok, rel, src) in enumerate(
            ex.map(dl_video, all_videos.keys()), 1
        ):
            marker = "✓" if ok else "✗"
            print(f"  [vid {i}/{len(all_videos)}] {marker} {vid}")
            if ok:
                manifest["videos"][vid] = {
                    "file": rel,
                    "source": src,
                    "pages": sorted(set(all_videos[vid])),
                }

    MANIFEST.write_text(json.dumps(manifest, indent=2, sort_keys=True))
    print(f"\nWrote manifest: {MANIFEST}")
    print(f"Saved to:       {OUT_DIR}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
