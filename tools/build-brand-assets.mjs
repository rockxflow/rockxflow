/**
 * Builds brand deliverables: Open Graph social preview, favicons, PWA icons.
 * Renders the same lockup the site uses (real brand fonts, real plate imagery)
 * so social cards match the website instead of being an afterthought.
 * Run: `node tools/build-brand-assets.mjs`
 */
import { writeFile, mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const OUT_MEDIA = path.join(ROOT, "public", "media");
const OUT_ICONS = path.join(ROOT, "public", "icons");

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

  <!-- logo lockup -->
  <g transform="translate(84,86)">
    <svg x="0" y="0" width="60" height="60" viewBox="0 0 44 44">
      <path d="M13 33V13h8.4a6.2 6.2 0 0 1 0 12.4H18l6.6 7.6" fill="none" stroke="url(#silver)" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M30.6 13H39M30.6 21.4h5.6" fill="none" stroke="url(#blue)" stroke-width="3.2" stroke-linecap="round"/>
      <circle cx="36.6" cy="31.6" r="1.9" fill="#008CFF"/>
    </svg>
    <text x="76" y="42" font-family="Plus Jakarta Sans" font-weight="800" font-size="34" letter-spacing="-0.6" fill="#F5F7FA">ROCK<tspan fill="#008CFF">X</tspan>FLOW</text>
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

async function iconSvg({ size = 512, pad = 0.16, bg = "#030509", radius = 0.22, transparent = false } = {}) {
  const inner = size * (1 - pad * 2);
  const s = inner / 44;
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="blue" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#0757A8"/><stop offset="0.55" stop-color="#008CFF"/><stop offset="1" stop-color="#00D9FF"/></linearGradient>
    <linearGradient id="silver" x1="0" y1="0" x2="0.6" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#B9C6D4"/></linearGradient>
  </defs>
  ${transparent ? "" : `<rect width="${size}" height="${size}" rx="${size * radius}" fill="${bg}"/>`}
  <g transform="translate(${(size - inner) / 2},${(size - inner) / 2}) scale(${s})">
    <path d="M13 33V13h8.4a6.2 6.2 0 0 1 0 12.4H18l6.6 7.6" fill="none" stroke="url(#silver)" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M30.6 13H39M30.6 21.4h5.6" fill="none" stroke="url(#blue)" stroke-width="3.2" stroke-linecap="round"/>
    <path d="M30.6 27.4h3.6a2.4 2.4 0 0 0 2.4-2.4V29.5" fill="none" stroke="#008CFF" stroke-width="1.3" opacity="0.8" stroke-linecap="round"/>
    <circle cx="36.6" cy="31.6" r="1.9" fill="url(#blue)"/>
  </g>
</svg>`;
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

  // 2 · Render the SVG lockup through libvips (fontconfig resolves the brand fonts).
  const og = await sharp(Buffer.from(await ogSvg()))
    .resize(1200, 630, { fit: "cover" })
    .toBuffer();
  await sharp(og).png({ compressionLevel: 9 }).toFile(path.join(OUT_MEDIA, "og.png"));
  await sharp(og).webp({ quality: 82 }).toFile(path.join(OUT_MEDIA, "og.webp"));
  const ogKb = (await readFile(path.join(OUT_MEDIA, "og.webp"))).length / 1024;
  console.log(`public/media/og.webp  (${ogKb.toFixed(0)} KB), og.png written`);

  // 3 · Icons
  const sizes = [16, 32, 180, 192, 512];
  for (const s of sizes) {
    const svg = Buffer.from(await iconSvg({ size: s, pad: s <= 32 ? 0.1 : 0.16, radius: s <= 32 ? 0.2 : 0.22 }));
    await sharp(svg).png({ compressionLevel: 9 }).toFile(path.join(OUT_ICONS, `favicon-${s}.png`));
  }
  await sharp(Buffer.from(await iconSvg({ size: 180, pad: 0.13 }))).png().toFile(path.join(OUT_ICONS, "apple-touch-icon.png"));
  // Maskable, flat-tile variant
  await sharp(Buffer.from(await iconSvg({ size: 512, pad: 0.22, radius: 0, bg: "#030509" }))).png().toFile(path.join(OUT_ICONS, "icon-512-maskable.png"));
  await sharp(Buffer.from(await iconSvg({ size: 512, radius: 0, transparent: true }))).png().toFile(path.join(OUT_ICONS, "icon-512-transparent.png"));
  console.log("public/icons/:", sizes.map((s) => `favicon-${s}.png`).join(", "), "+ apple-touch-icon.png");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
