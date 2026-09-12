/**
 * Builds brand deliverables: Open Graph social preview, favicons, PWA icons.
 *
 * Every icon and the OG badge are produced from the client's official logo file
 * (`public/brand/rockxflow-logo.png`) by scaling only — the artwork itself is never
 * redrawn, cropped or recoloured. `contain` into a square canvas is a pure resize,
 * because the supplied file is already square.
 * Run: `node tools/build-brand-assets.mjs`
 */
import { writeFile, mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const OUT_MEDIA = path.join(ROOT, "public", "media");
const OUT_ICONS = path.join(ROOT, "public", "icons");
const LOGO = path.join(ROOT, "public", "brand", "rockxflow-logo.png");
/** Background of the supplied file — reused so a scaled copy never shows a seam. */
const LOGO_BG = "#010205";

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

async function ogSvg() {
  return `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="veil" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#030509" stop-opacity="0.985"/>
      <stop offset="0.6" stop-color="#030509" stop-opacity="0.94"/>
      <stop offset="1" stop-color="#04101c" stop-opacity="0.82"/>
    </linearGradient>
    <linearGradient id="blue" x1="0" y1="1" x2="1" y2="0">
      <stop offset="0" stop-color="#0757A8"/>
      <stop offset="0.55" stop-color="#008CFF"/>
      <stop offset="1" stop-color="#00D9FF"/>
    </linearGradient>
    <linearGradient id="silver" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#FFFFFF"/>
      <stop offset="1" stop-color="#B9C6D4"/>
    </linearGradient>
    <filter id="soft"><feGaussianBlur stdDeviation="0.4"/></filter>
  </defs>

  <image href="/tmp/og-bg.png" x="0" y="0" width="1200" height="630" preserveAspectRatio="xMidYMid slice"/>
  <rect width="1200" height="630" fill="url(#veil)"/>

  <!-- technical grid -->
  <g opacity="0.16" stroke="#4fa8e0" stroke-width="1">
    ${Array.from({ length: 12 }, (_, i) => `<line x1="${100 * i}" y1="0" x2="${100 * i}" y2="630"/>`).join("")}
    ${Array.from({ length: 7 }, (_, i) => `<line x1="0" y1="${90 * i}" x2="1200" y2="${90 * i}"/>`).join("")}
  </g>

  <!-- workflow line -->
  <g transform="translate(84,462)">
    <path d="M0 60 L120 60 L150 60 L270 60 L300 60 L420 60" fill="none" stroke="url(#blue)" stroke-width="2.5" opacity="0.75" stroke-linecap="round"/>
    ${[0, 120, 270, 420].map((x, i) => `<g><rect x="${x - 13}" y="47" width="26" height="26" rx="8" fill="#061220" stroke="${i === 1 ? "#00D9FF" : "#1A2A3A"}" stroke-width="2"/><circle cx="${x}" cy="60" r="${i === 1 ? 5 : 3.2}" fill="${i === 1 ? "#00D9FF" : "#0A7BD1"}"/></g>`).join("")}
    <text x="470" y="66" font-family="JetBrains Mono" font-size="19" letter-spacing="2.6" fill="#5F89A8">FORM → AI → CRM → FOLLOW-UP</text>
  </g>

  <!-- official logo file (scaled, untouched) + the agency name set in the site face -->
  <g transform="translate(84,86)">
    <image href="/tmp/og-logo-tile.png" x="0" y="0" width="64" height="64"/>
    <text x="80" y="42" font-family="Plus Jakarta Sans" font-weight="800" font-size="34" letter-spacing="-0.6" fill="#F5F7FA">ROCK<tspan fill="#008CFF">X</tspan>FLOW</text>
  </g>

  <!-- headline -->
  <text x="84" y="252" font-family="Plus Jakarta Sans" font-weight="800" font-size="74" letter-spacing="-2.4" fill="#F5F7FA" filter="url(#soft)">Turn Repetitive Work</text>
  <text x="84" y="334" font-family="Plus Jakarta Sans" font-weight="800" font-size="74" letter-spacing="-2.4" fill="#F5F7FA">Into <tspan fill="#3FC2FF">Intelligent Systems.</tspan></text>
  <text x="84" y="394" font-family="Inter" font-size="27" fill="#A9C0D4">${esc("AI workflow automation, agents, chat, voice and integrations for modern businesses.")}</text>

  <!-- eyebrow -->
  <g transform="translate(84,164)">
    <rect x="-14" y="-24" width="330" height="40" rx="12" fill="none" stroke="#16283A" stroke-width="2"/>
    <text x="0" y="4" font-family="JetBrains Mono" font-size="17" letter-spacing="3.4" fill="#66BFFF">AI AUTOMATION AGENCY</text>
  </g>

  <!-- footer bar -->
  <rect x="0" y="556" width="1200" height="74" fill="#040B13"/>
  <rect x="0" y="555" width="1200" height="1" fill="#16283A"/>
  <text x="84" y="602" font-family="Inter" font-size="21" fill="#8FA8BD">${esc(site_line())}</text>
  <text x="1116" y="602" text-anchor="end" font-family="JetBrains Mono" font-size="19" letter-spacing="1.6" fill="#00D9FF">${esc("AUTOMATE • INNOVATE • ELEVATE")}</text>
</svg>`;
}

function site_line() {
  return "official.rockxflow@gmail.com  ·  +91 92116 68580";
}

/** The official file scaled to `size` — square source, square canvas, no cropping. */
async function logoTile(size, { background = LOGO_BG } = {}) {
  return sharp(LOGO)
    .resize(size, size, { fit: "contain", background })
    .png({ compressionLevel: 9 })
    .toBuffer();
}

async function main() {
  await mkdir(OUT_MEDIA, { recursive: true });
  await mkdir(OUT_ICONS, { recursive: true });

  // 1 · Background plate for the OG card, pre-darkened so text stays crisp.
  const bg = await sharp(path.join(ROOT, "public", "media", "hero_a-1280.webp"))
    .resize({ width: 1200, height: 630, fit: "cover" })
    .modulate({ brightness: 0.72 })
    .blur(0.4)
    .png()
    .toBuffer();
  await writeFile("/tmp/og-bg.png", bg);

  // 2 · Official logo, scaled for the card badge (2× so it stays sharp in the render).
  await writeFile("/tmp/og-logo-tile.png", await logoTile(128));

  // 3 · Render the card through libvips (fontconfig resolves the brand fonts).
  const og = await sharp(Buffer.from(await ogSvg()))
    .resize(1200, 630, { fit: "cover" })
    .toBuffer();
  await sharp(og).png({ compressionLevel: 9 }).toFile(path.join(OUT_MEDIA, "og.png"));
  await sharp(og).webp({ quality: 82 }).toFile(path.join(OUT_MEDIA, "og.webp"));
  const ogKb = (await readFile(path.join(OUT_MEDIA, "og.webp"))).length / 1024;
  console.log(`public/media/og.webp  (${ogKb.toFixed(0)} KB), og.png written`);

  // 4 · Favicons + PWA icons, all scaled from the same file.
  for (const size of [16, 32, 180, 192, 512]) {
    await logoTile(size).then((buf) => writeFile(path.join(OUT_ICONS, `favicon-${size}.png`), buf));
  }
  await logoTile(180).then((buf) => writeFile(path.join(OUT_ICONS, "apple-touch-icon.png"), buf));
  await logoTile(512).then((buf) => writeFile(path.join(OUT_ICONS, "icon-512.png"), buf));
  // Maskable: flat tile, artwork already sits inside the 80% safe zone of the source.
  await logoTile(512).then((buf) => writeFile(path.join(OUT_ICONS, "icon-512-maskable.png"), buf));
  console.log("public/icons: favicon-{16,32,180,192,512}.png, apple-touch-icon.png, icon-512{,-maskable}.png — all scaled from public/brand/rockxflow-logo.png");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
