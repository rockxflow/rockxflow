/**
 * Desktop-mode captures for reviewing the site outside the preview panel.
 *   node tools/desktop-shots.mjs [origin] [outDir] [width]
 *
 * Renders reduced-motion (so scroll-reveal content is guaranteed to be in its
 * final state), scrolls the page once to trigger lazy media, then takes a
 * full-page screenshot per route at `width` (default 1440).
 */
import { mkdir } from "node:fs/promises";
import { chromium } from "playwright";

const origin = process.argv[2] ?? "http://127.0.0.1:3000";
const out = process.argv[3] ?? "/home/user/qa/desktop";
const width = Number(process.argv[4] ?? 1440);

const routes = [
  ["/", "home"],
  ["/services", "services"],
  ["/solutions", "solutions"],
  ["/process", "process"],
  ["/about", "about"],
  ["/contact", "contact"],
];

await mkdir(out, { recursive: true });
const browser = await chromium.launch({
  args: ["--no-sandbox", "--disable-dev-shm-usage", "--force-color-profile=srgb"],
});

for (const [path, name] of routes) {
  const page = await browser.newPage({
    viewport: { width, height: 900 },
    deviceScaleFactor: width >= 1920 ? 0.6 : 0.75,
    reducedMotion: "reduce",
  });
  await page.goto(origin + path, { waitUntil: "load", timeout: 60000 });
  await page.waitForTimeout(1200);
  // one pass down the page: triggers images, canvas work and any scroll listeners
  await page.evaluate(async () => {
    const step = Math.round(window.innerHeight * 0.75);
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 140));
    }
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 400));
  });
  await page.waitForTimeout(700);
  const file = `${out}/${name}-${width}.png`;
  await page.screenshot({ path: file, fullPage: true });
  const h = await page.evaluate(() => Math.round(document.documentElement.scrollHeight));
  console.log(`${name.padEnd(9)} ${width}px  page height ${h}px  → ${file}`);
  await page.close();
}

// first-fold shots too — these are what a visitor actually judges first
for (const [path, name] of routes) {
  const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: "reduce" });
  await page.goto(origin + path, { waitUntil: "load" });
  await page.waitForTimeout(1600);
  await page.screenshot({ path: `${out}/${name}-${width}-fold.png` });
  await page.close();
}

await browser.close();
console.log("done");
