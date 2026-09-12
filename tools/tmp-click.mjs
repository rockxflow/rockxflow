import { chromium } from "playwright";
const O = "http://127.0.0.1:4173/rockxflow";
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
const p = await ctx.newPage();
await p.goto(O + "/", { waitUntil: "networkidle" });
await p.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await p.waitForTimeout(1200);
for (const sel of ['footer a[href*="wa.me"]', 'footer a[href*="instagram"]', 'header a[href*="wa.me"]']) {
  const info = await p.evaluate((s) => {
    const a = document.querySelector(s);
    if (!a) return { missing: true };
    const r = a.getBoundingClientRect();
    const cs = getComputedStyle(a);
    const top = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
    let chain = [];
    let e = top;
    while (e && chain.length < 4) { chain.push(e.tagName + (e === a ? "=THE-A" : "") + (e.getAttribute("aria-label") ? `[${e.getAttribute("aria-label").slice(0,14)}]` : "")); e = e.parentElement; }
    return { href: a.href.slice(0, 44), target: a.target, rel: a.rel, pe: cs.pointerEvents, cursor: cs.cursor, w: Math.round(r.width), h: Math.round(r.height), hitIsAnchorOrInside: Boolean(top && (top === a || a.contains(top))), chain };
  }, sel);
  console.log(sel, JSON.stringify(info));
  // real click → expect a popup
  const pop = p.waitForEvent("popup", { timeout: 4000 }).catch(() => null);
  await p.click(sel);
  const popup = await pop;
  console.log("   popup opened:", popup ? popup.url().slice(0, 60) : "NONE");
  if (popup) await popup.close();
}
// now the same link inside a sandboxed iframe with only allow-scripts (what a restricted preview does)
const page2 = await ctx.newPage();
await page2.goto("about:blank");
await page2.setContent(`<iframe id="f" sandbox="allow-scripts" src="${O}/" style="width:1400px;height:900px;border:0"></iframe>`);
await page2.waitForTimeout(4000);
const res = await page2.evaluate(async () => {
  const fr = document.getElementById("f");
  const d = fr.contentDocument;
  const a = d && d.querySelector('footer a[href*="instagram"]');
  if (!a) return { crossOriginBlocked: true };
  const before = a.href;
  a.click();
  return { clicked: true, href: before.slice(0, 40) };
}).catch((e) => ({ error: String(e).slice(0, 80) }));
console.log("sandboxed-iframe anchor:", JSON.stringify(res));
await b.close();
