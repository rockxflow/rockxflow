/**
 * Optimizes raw client-supplied / art-directed source images into responsive
 * WebP + AVIF derivatives plus a same-aspect blurDataURL placeholder.
 * Run: `node tools/build-images.mjs`
 */
import { mkdir, writeFile, readdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const SRC = path.join(ROOT, "assets-raw");
const OUT = path.join(ROOT, "public", "media");

const WIDTHS = [640, 960, 1280, 1600];

async function main() {
  await mkdir(OUT, { recursive: true });
  const files = (await readdir(SRC)).filter((f) => /\.(png|jpe?g)$/i.test(f));

  for (const file of files) {
    const name = path.parse(file).name;
    const input = path.join(SRC, file);
    const meta = await sharp(input).metadata();
    let sizes = WIDTHS.filter((w) => w <= meta.width);
    if (!sizes.includes(meta.width)) sizes.push(Math.min(meta.width, 1920));
    sizes = [...new Set(sizes)].sort((a, b) => a - b);
    const largest = sizes[sizes.length - 1];

    const manifest = { name, width: meta.width, height: meta.height, aspect: meta.height / meta.width, srcset: {}, placeholder: "" };

    for (const w of sizes) {
      for (const fmt of ["webp", "avif", "jpg"]) {
        if (fmt === "jpg" && w !== largest) continue; // JPEG only as final <img> fallback
        const opts =
          fmt === "webp"
            ? { quality: 78, effort: 6, metadata: false }
            : fmt === "avif"
              ? { quality: 62, effort: 6, metadata: false }
              : { quality: 78, effort: 6, metadata: false, mozjpeg: true };
        const buf = await sharp(input).resize({ width: w, withoutEnlargement: true }).toFormat(fmt, opts).toBuffer();
        const out = `${name}-${w}.${fmt}`;
        await writeFile(path.join(OUT, out), buf);
        (manifest.srcset[fmt] ||= []).push({ w, file: `/media/${out}`, kb: +(buf.length / 1024).toFixed(1) });
      }
    }

    // Tiny low-quality placeholder for the largest width (progressive reveal).
    const placeholder = await sharp(input)
      .resize({ width: 24, withoutEnlargement: true })
      .blur(1)
      .toFormat("webp", { quality: 40 })
      .toBuffer();
    manifest.placeholder = `data:image/webp;base64,${placeholder.toString("base64")}`;
    manifest.placeholderKb = +(placeholder.length / 1024).toFixed(2);

    await writeFile(path.join(ROOT, "src", "lib", "media", `${name}.json`), JSON.stringify(manifest, null, 2));
    console.log(
      `${name}: ${manifest.width}x${manifest.height} →`,
      sizes.map((w) => `${w}px ${manifest.srcset.webp.find((s) => s.w === w).kb}KB webp`).join(", ")
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
