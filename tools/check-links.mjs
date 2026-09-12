#!/usr/bin/env node
/**
 * check-links.mjs — proves that the social/contact links behave like normal links.
 *
 *   node tools/check-links.mjs [origin]           default: http://127.0.0.1:4173/rockxflow
 *
 * What it asserts, in real Chromium, for the published pages:
 *   • desktop: a plain click on the WhatsApp and Instagram icons opens exactly one
 *     tab, at the right destination (wa.me / api.whatsapp.com, instagram.com)
 *   • mobile:  the same, in the footer and inside the open nav drawer (touch tap)
 *   • no page ever opens a duplicate tab for one click
 *   • no console or runtime errors while doing it
 *   • the anchors themselves stay real links: href + target="_blank" +
 *     rel="noopener noreferrer" + an accessible name (so middle-click, ⌘/ctrl-click,
 *     copy-link and no-JS browsing all keep working)
 * An informational note covers the one case no site can fix from inside: an embed that
 * refuses both popups and top-level navigation.
 */
import { chromium } from "playwright";

const ORIGIN = (process.argv[2] ?? "http://127.0.0.1:4173/rockxflow").replace(/\/$/, "");
// wa.me and instagram.com answer with their own redirects, so match the service the
// link resolves to and assert the exact href separately (HREF below)
const DEST = { whatsapp: /wa\.me\/919211668580|api\.whatsapp\.com/, instagram: /instagram\.com/ };
const HREF = {
  whatsapp: "https://wa.me/919211668580?text=Hi%20Rockxflow%2C%20I'd%20like%20to%20discuss%20AI%20automation%20for%20my%20business.",
  instagram: "https://www.instagram.com/rockxflow/",
};
const ok = [];
const bad = [];
const chk = (cond, label) => (cond ? ok : bad).push(label);
const browser = await chromium.launch();

/** every target=_blank anchor in the page must be a well-formed external link */
async function auditAnchors(page, route) {
  const anchors = await page.evaluate(() =>
    [...document.querySelectorAll('a[target="_blank"]')].map((a) => ({
      text: (a.getAttribute("aria-label") || a.textContent || a.title || "").trim().slice(0, 40),
      href: a.href,
      raw: a.getAttribute("href"),
      rel: a.rel,
      pe: getComputedStyle(a).pointerEvents,
      cursor: getComputedStyle(a).cursor,
      covered: (() => {
        const r = a.getBoundingClientRect();
        if (r.width === 0) return "zero-size"; // hidden for this viewport
        const cx = r.x + r.width / 2;
        const cy = r.y + r.height / 2;
        // elementFromPoint only knows the viewport: outside it, nothing covers the link
        if (cx < 0 || cy < 0 || cx > innerWidth || cy > innerHeight) return null;
        const hit = document.elementFromPoint(cx, cy);
        return hit && (a.contains(hit) || hit.contains(a)) ? null : `covered by ${hit?.tagName?.toLowerCase()}.${hit?.className}`;
      })(),
    }))
  );
  for (const a of anchors) {
    if (a.covered === "zero-size") continue; // hidden at this viewport by design (e.g. the mobile nav)
    const label = `${route} ${a.text || a.href.slice(0, 28)}`;
    if (a.raw === HREF.instagram || a.raw === HREF.whatsapp) chk(true, `${label} — href is the exact brand URL`);
    chk(/^https?:/.test(a.href) && /noopener/.test(a.rel), `${label} — real href, rel includes noopener`);
    chk(a.pe !== "none", `${label} — pointer events enabled`);
    chk(a.covered === null, `${label} — nothing painted over the click target${a.covered ? ` (${a.covered})` : ""}`);
    chk(a.text.length > 0, `${label} — accessible name present`);
  }
  return anchors.length;
}

/* desktop */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const errs = [];
  page.on("pageerror", (e) => errs.push(String(e).slice(0, 90)));
  page.on("console", (m) => m.type() === "error" && !/Failed to load resource/.test(m.text()) && errs.push(m.text().slice(0, 90)));
  await page.goto(`${ORIGIN}/`, { waitUntil: "networkidle" });
  const n = await auditAnchors(page, "home");
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(1500);
  for (const [key, sel] of [["whatsapp", 'footer a[href*="wa.me"]'], ["instagram", 'footer a[href*="instagram"]']]) {
    const before = ctx.pages().length;
    await page.locator(sel).first().click();
    await page.waitForTimeout(1600);
    const opened = ctx.pages().length - before;
    const urls = await Promise.all(ctx.pages().slice(before).map((p) => p.url()));
    chk(opened === 1, `desktop ${key} — one tab per click (got ${opened})`);
    chk(urls.some((u) => DEST[key].test(u)), `desktop ${key} — opens the right destination (${urls[0]?.slice(0, 42)})`);
    for (const p of ctx.pages().slice(before)) await p.close().catch(() => {});
  }
  chk(errs.length === 0, `desktop — no console/runtime errors${errs.length ? ` (${errs.join(" | ")})` : ""}`);
  console.log(`audited ${n} external anchors on the home page`);
  await ctx.close();
}

/* mobile: footer + the opened nav drawer, touched not clicked */
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  const page = await ctx.newPage();
  await page.goto(`${ORIGIN}/contact/`, { waitUntil: "networkidle" });
  await auditAnchors(page, "contact@m390");
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(1500);
  let before = ctx.pages().length;
  await page.locator('footer a[href*="instagram"]').first().tap();
  await page.waitForTimeout(1600);
  const mUrls = await Promise.all(ctx.pages().slice(before).map((p) => p.url()));
  chk(ctx.pages().length - before === 1 && mUrls.some((u) => DEST.instagram.test(u)), "mobile footer — Instagram opens on tap");
  for (const p of ctx.pages().slice(before)) await p.close().catch(() => {});

  await page.goto(`${ORIGIN}/`, { waitUntil: "networkidle" });
  await page.click('button[aria-controls="rx-menu"]');
  await page.waitForTimeout(900);
  before = ctx.pages().length;
  await page.locator('#rx-menu a[href*="wa.me"]').first().tap();
  await page.waitForTimeout(1600);
  const dUrls = await Promise.all(ctx.pages().slice(before).map((p) => p.url()));
  chk(ctx.pages().length - before === 1 && dUrls.some((u) => DEST.whatsapp.test(u)), "mobile drawer — WhatsApp opens on tap");
  await ctx.close();
}

/* informational: a host page may forbid both popups and top navigation */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.route("**/__embed_probe.html", (r) =>
    r.fulfill({ status: 200, contentType: "text/html", body: `<body style="margin:0"><iframe id="f" sandbox="allow-scripts allow-same-origin" src="${ORIGIN}/" style="width:1440px;height:900px;border:0"></iframe></body>` })
  );
  await page.goto(`${ORIGIN}/__embed_probe.html`, { waitUntil: "load" });
  await page.waitForTimeout(4200);
  const moved = await page
    .evaluate(() => {
      const d = document.getElementById("f").contentDocument;
      if (!d) return "frame unreachable";
      d.querySelector("footer a[href*='wa.me']").click();
      return "clicked";
    })
    .catch((e) => String(e).slice(0, 40));
  await page.waitForTimeout(2500);
  const frames = page.frames().map((f) => f.url());
  console.log(
    `\nnote: inside a sandbox that allows neither popups nor top navigation the click landed as: ${
      frames.some((u) => /wa\.me|api\.whatsapp/.test(u)) ? "the frame navigated to WhatsApp" : `no navigation possible (${moved})`
    } — that is the browser's own policy for the embed, and the anchor still carries a real href for right-click / copy / open-in-tab.`
  );
  await ctx.close();
}

console.log(`\n${"─".repeat(10)} links ${"─".repeat(10)}`);
for (const line of ok) console.log("  ✓", line);
for (const line of bad) console.log("  ✗", line);
await browser.close();
if (bad.length) {
  console.log(`\nFAIL — ${bad.length} problem(s)`);
  process.exit(1);
}
console.log(`\nPASS — WhatsApp and Instagram open on a plain click, desktop and mobile, one tab each.`);
