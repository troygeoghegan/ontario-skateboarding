#!/usr/bin/env node
/**
 * Losslessly (or near-losslessly) recompress every image in public/imported/.
 *
 *   - PNG  → libpng compression 9, effort 10        (mathematically lossless)
 *   - JPG  → mozjpeg q=92, trellis + progressive    (visually lossless)
 *   - WebP → libwebp q=92, effort 6                 (visually lossless)
 *   - GIF  → skipped (animation)
 *   - MP4  → skipped (leave video untouched)
 *
 * Pixel dimensions are never changed.  For every file, the newly encoded
 * version is written to a temp file and the original is replaced only if
 * the new file is strictly smaller — so worst case the folder stays the
 * same size and never grows.
 *
 * Usage:
 *   node scripts/optimize-media.mjs            # do it
 *   node scripts/optimize-media.mjs --dry-run  # just report, don't write
 */

import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");
const IMPORTED = path.join(ROOT, "public", "imported");

const DRY_RUN = process.argv.includes("--dry-run");

// ---------- file walking --------------------------------------------------

async function* walk(dir) {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(p);
    else if (entry.isFile()) yield p;
  }
}

// ---------- encoders ------------------------------------------------------

function encodeFor(ext) {
  switch (ext) {
    case ".jpg":
    case ".jpeg":
      return (img) =>
        img.jpeg({
          mozjpeg: true,
          quality: 92,
          progressive: true,
          trellisQuantisation: true,
          overshootDeringing: true,
          optimiseScans: true,
          optimiseCoding: true,
        });
    case ".png":
      // PNG is always lossless; this just re-packs with max compression.
      return (img) =>
        img.png({
          compressionLevel: 9,
          effort: 10,
          palette: false,
          adaptiveFiltering: true,
        });
    case ".webp":
      return (img) =>
        img.webp({
          quality: 92,
          effort: 6,
          smartSubsample: true,
        });
    default:
      return null;
  }
}

// ---------- pretty output -------------------------------------------------

function fmtMB(bytes) {
  return (bytes / 1024 / 1024).toFixed(2) + " MB";
}
function pct(before, after) {
  if (before === 0) return "0%";
  const d = ((before - after) / before) * 100;
  return (d >= 0 ? "-" : "+") + Math.abs(d).toFixed(1) + "%";
}

// ---------- main ----------------------------------------------------------

async function processOne(file) {
  const ext = path.extname(file).toLowerCase();
  const encode = encodeFor(ext);
  if (!encode) return { file, skipped: true, reason: "unsupported type" };

  const statBefore = await fs.stat(file);
  const sizeBefore = statBefore.size;

  let tmp;
  try {
    // sharp.rotate() applies EXIF orientation so we keep the visual
    // orientation identical even after stripping metadata.  We then strip
    // EXIF/ICC/etc. to shave a few KB, never touching pixel data.
    const pipeline = encode(
      sharp(file, { sequentialRead: true, failOn: "none" }).rotate(),
    ).withMetadata({ orientation: undefined });

    tmp = file + ".opt.tmp";
    await pipeline.toFile(tmp);
  } catch (e) {
    if (tmp) await fs.rm(tmp, { force: true }).catch(() => {});
    return { file, skipped: true, reason: `encode error: ${e.message}` };
  }

  const sizeAfter = (await fs.stat(tmp)).size;

  if (sizeAfter >= sizeBefore) {
    await fs.rm(tmp, { force: true });
    return { file, sizeBefore, sizeAfter, replaced: false };
  }

  // Sanity check: make sure the new file is a valid image of the same size.
  let metaBefore, metaAfter;
  try {
    metaBefore = await sharp(file).metadata();
    metaAfter = await sharp(tmp).metadata();
  } catch (e) {
    await fs.rm(tmp, { force: true });
    return { file, skipped: true, reason: `verify error: ${e.message}` };
  }
  if (metaBefore.width !== metaAfter.width || metaBefore.height !== metaAfter.height) {
    await fs.rm(tmp, { force: true });
    return {
      file,
      skipped: true,
      reason: `dimension mismatch ${metaBefore.width}×${metaBefore.height} → ${metaAfter.width}×${metaAfter.height}`,
    };
  }

  if (DRY_RUN) {
    await fs.rm(tmp, { force: true });
  } else {
    await fs.rename(tmp, file);
  }
  return { file, sizeBefore, sizeAfter, replaced: true };
}

async function main() {
  const files = [];
  for await (const f of walk(IMPORTED)) files.push(f);

  const results = [];
  let i = 0;
  for (const f of files) {
    i++;
    const rel = path.relative(IMPORTED, f);
    process.stdout.write(`  [${i}/${files.length}] ${rel} … `);
    const r = await processOne(f);
    if (r.skipped) {
      console.log(`skip (${r.reason})`);
    } else if (!r.replaced) {
      console.log(
        `kept original (${fmtMB(r.sizeBefore)} ≤ ${fmtMB(r.sizeAfter)})`,
      );
    } else {
      console.log(
        `${fmtMB(r.sizeBefore)} → ${fmtMB(r.sizeAfter)}  (${pct(r.sizeBefore, r.sizeAfter)})`,
      );
    }
    results.push(r);
  }

  const totals = results.reduce(
    (a, r) => {
      if (r.skipped) return a;
      a.before += r.sizeBefore;
      a.after += r.replaced ? r.sizeAfter : r.sizeBefore;
      if (r.replaced) a.replaced++;
      else a.unchanged++;
      return a;
    },
    { before: 0, after: 0, replaced: 0, unchanged: 0 },
  );
  const skipped = results.filter((r) => r.skipped).length;

  console.log("\n" + "═".repeat(60));
  console.log(`Processed:  ${files.length} files`);
  console.log(
    `  replaced: ${totals.replaced}   unchanged: ${totals.unchanged}   skipped: ${skipped}`,
  );
  console.log(`  before:   ${fmtMB(totals.before)}`);
  console.log(`  after:    ${fmtMB(totals.after)}`);
  console.log(`  saved:    ${fmtMB(totals.before - totals.after)} (${pct(totals.before, totals.after)})`);
  if (DRY_RUN) console.log("  (dry-run — nothing was written)");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
