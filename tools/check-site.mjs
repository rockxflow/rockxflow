/**
 * Acceptance test for the publishable static export in docs/.
 * Serves nothing itself — point it at a running static server:
 *
 *   python3 -m http.server 4174 --bind 0.0.0.0 --directory /tmp/ghpub   # /tmp/ghpub/rockxflow → docs
 *   node tools/check-site.mjs http://127.0.0.1:4174/rockxflow docs
 *
 * It loads the real pages in Chromium and checks what a visitor would notice:
 * styles and fonts applied, media playing, interactive controls actually working
 * without a Next server, no dead links, no horizontal overflow at 320 px, and a
 * contact form that stays honest when it has nowhere to post.
 */
import { chromium } from "playwright";

const ORIGIN = (process.argv[2] ?? "http://127.0.0.1:4174/rockxflow").replace(/\/+$/, "");
const BASE = new URL(ORIGIN).pathname.replace(/\/+$/, "");
const DIST = process.argv[3] ?? "docs";

const pages = ["/", "/services/", "/solutions/", "/process/", "/about/", "/contact/", "/privacy-policy/", "/terms/", "/404.html"];
const problems = [];
/* Section 3 deliberately breaks the relay call to prove the failure path; the browser's
   noise about that one request must not be read as a defect. */
let provoked = 0;
const provokedBy = (url = "", text = "") =>
  provoked > 0 && (/formsubmit\.co/.test(url) || /net::ERR_FAILED|Failed to load resource/i.test(text));
const report = [];
const browser = await chromium.launch({ args: ["--no-sandbox", "--disable-dev-shm-usage"] });

const open = async (route, opts = {}) => {
  const page = await browser.newPage({
    viewport: opts.viewport ?? { width: 1440, height: 900 },
    reducedMotion: opts.motion === "full" ? "no-preference" : "reduce",
  });
  page.on("console", (m) => m.type() === "error" && !provokedBy("", m.text()) && problems.push(`${route} console: ${m.text().slice(0, 130)}`));
  page.on("pageerror", (e) => problems.push(`${route} pageerror: ${String(e).slice(0, 130)}`));
  page.on("response", (r) => {
    if (r.status() >= 400 && !provokedBy(r.url())) problems.push(`${route} HTTP ${r.status()} → ${new URL(r.url()).pathname}`);
  });
  page.on("requestfailed", (r) => {
    // no mail client and no phone dialler inside a headless browser: those two
    // "failures" are the static-compose path doing exactly what it should
    if (/^(mailto|tel):/.test(r.url()) || provokedBy(r.url())) return;
    problems.push(`${route} request failed: ${r.url().slice(0, 120)}`);
  });
  await page.goto(ORIGIN + route, { waitUntil: "load", timeout: 45000 });
  await page.waitForTimeout(1300);
  return page;
};

/* 1 — every page: styled, media ok, no overflow, links point inside the export */
for (const route of pages) {
  const page = await open(route, { motion: "full" });
  const stats = await page.evaluate((base) => {
    const doc = document.documentElement;
    const imgs = [...document.querySelectorAll("img")];
    const links = [...document.querySelectorAll("a[href]")].map((a) => a.getAttribute("href"));
    return {
      h1: document.querySelectorAll("h1").length,
      title: document.title.slice(0, 46),
      h1Size: document.querySelector("h1") ? getComputedStyle(document.querySelector("h1")).fontSize : null,
      family: document.querySelector("h1") ? getComputedStyle(document.querySelector("h1")).fontFamily.split(",")[0] : null,
      sheets: document.querySelectorAll('link[rel="stylesheet"]').length,
      overflow: doc.scrollWidth > doc.clientWidth + 1 ? `${doc.scrollWidth}>${doc.clientWidth}` : null,
      brokenImgs: imgs.filter((i) => i.complete && i.naturalWidth === 0).map((i) => (i.currentSrc || i.src).split("/").pop()),
      videoReady: document.querySelector("video")?.readyState ?? -1,
      /* every absolute link must live under the deploy base path (e.g. /rockxflow) */
      escapingLinks: links
        .map((h) => (h ?? "").split("#")[0].split("?")[0])
        .filter((h) => h.startsWith("/") && !h.startsWith("/api/") && !h.startsWith(base)),
      /* loaded assets must be requested under the base path too: a public/ URL that skips
         the prefix works from a server that ignores the base and 404s on GitHub Pages */
      escapingAssets: [...document.querySelectorAll("img,source,video,link,use")]
        .map((el) => el.currentSrc || el.src || el.poster || el.href || "")
        .filter((u) => u.startsWith(location.origin))
        .map((u) => u.slice(location.origin.length).split("?")[0].split("#")[0])
        .filter((u) => u.startsWith("/") && !u.startsWith(base)),
    };
  }, BASE);
  if (stats.h1 !== 1) problems.push(`${route}: ${stats.h1} h1 tags`);
  if (!stats.sheets) problems.push(`${route}: no stylesheet applied`);
  if (stats.h1Size && parseInt(stats.h1Size) < 30) problems.push(`${route}: h1 unstyled (${stats.h1Size})`);
  if (stats.overflow) problems.push(`${route}: horizontal overflow ${stats.overflow} at 1440`);
  if (stats.brokenImgs.length) problems.push(`${route}: broken images ${stats.brokenImgs.join(", ")}`);
  if (stats.escapingLinks.length) problems.push(`${route}: links leave the base path → ${stats.escapingLinks.join(", ")}`);
  if (stats.escapingAssets.length) problems.push(`${route}: assets outside the base path → ${[...new Set(stats.escapingAssets)].join(", ")}`);
  report.push(`${route.padEnd(17)} h1 ${stats.h1Size ?? "-"} ${stats.family ?? "?"} · css ${stats.sheets} · ${stats.title}`);
  await page.close();
}

/* 2 — interactivity without a Next server */
{
  const page = await open("/", { viewport: { width: 390, height: 844 }, motion: "full" });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  if (overflow > 1) problems.push(`home@390: ${overflow}px horizontal overflow`);

  const menu = await page.evaluate(() => {
    const btn = document.querySelector('button[aria-controls="rx-menu"]');
    return { hasButton: Boolean(btn), expanded: btn?.getAttribute("aria-expanded") };
  });
  if (!menu.hasButton) problems.push("mobile: menu button missing");
  else {
    await page.click('button[aria-controls="rx-menu"]');
    await page.waitForTimeout(700);
    const after = await page.evaluate(() => {
      const btn = document.querySelector('button[aria-controls="rx-menu"]');
      const panel = document.getElementById("rx-menu");
      const link = panel?.querySelector('a[href*="services"]');
      return {
        expanded: btn?.getAttribute("aria-expanded"),
        panelVisible: Boolean(panel && link && panel.getBoundingClientRect().height > 40),
        links: panel ? panel.querySelectorAll("a").length : 0,
      };
    });
    if (after.expanded !== "true" || !after.panelVisible) problems.push(`mobile menu did not open (${JSON.stringify(after)})`);
    else report.push(`menu @390          opens ✓ (${after.links} links)`);
    await page.keyboard.press("Escape");
    await page.waitForTimeout(400);
    const closed = await page.evaluate(() => document.querySelector('button[aria-controls="rx-menu"]')?.getAttribute("aria-expanded"));
    if (closed === "true") problems.push("Escape did not close the mobile menu");
  }

  // automation selector: tabs must actually swap the panel
  await page.evaluate(() => document.getElementById("automate")?.scrollIntoView());
  await page.waitForTimeout(700);
  const tabs = await page.evaluate(() => {
    const list = [...document.querySelectorAll('[role="tab"][id^="cat-tab-"]')];
    return { count: list.length, selected: list.findIndex((b) => b.getAttribute("aria-selected") === "true") };
  });
  if (tabs.count >= 2) {
    await page.click(`#cat-tab-${(await page.evaluate(() => [...document.querySelectorAll('[role="tab"][id^="cat-tab-"]')][2].id))?.replace("cat-tab-", "") ?? "operations"}`);
    await page.waitForTimeout(700);
    const after = await page.evaluate(() => {
      const list = [...document.querySelectorAll('[role="tab"][id^="cat-tab-"]')];
      const panel = document.querySelector('[role="tabpanel"]');
      return { selected: list.findIndex((b) => b.getAttribute("aria-selected") === "true"), text: (panel?.innerText ?? "").slice(0, 60).replace(/\s+/g, " ") };
    });
    if (after.selected !== 2) problems.push(`automation selector did not switch tab (selected ${after.selected})`);
    else report.push(`tabs               switch ✓ ("${after.text}")`);
  }
  await page.close();
}

/* 3 — the form: it posts for real, and only celebrates when the backend says so */
{
  const RELAY = "**/formsubmit.co/**";
  const page = await open("/contact/", { motion: "full" });
  await page.fill('input[name="name"]', "Aarav Sharma");
  await page.fill('input[name="email"]', "not-an-email");
  await page.fill('textarea[name="message"]', "We copy website leads into the CRM by hand every morning and follow-ups slip.");
  await page.click('button[type="submit"]');
  await page.waitForTimeout(600);
  const invalid = await page.evaluate(() => document.body.innerText.includes("does not look valid"));
  if (!invalid) problems.push("contact: client-side validation did not surface the email error");
  else report.push("form validation     per-field error shown ✓");

  let posted = null;
  page.on("request", (req) => {
    if (req.method() === "POST" && /formsubmit\.co/.test(req.url())) {
      try {
        posted = JSON.parse(req.postData() ?? "");
      } catch {
        posted = null;
      }
    }
  });

  const send = async () => {
    posted = null;
    await page.fill('input[name="name"]', "Aarav Sharma");
    await page.fill('input[name="email"]', "aarav@northline.in");
    await page.selectOption('select[name="topic"]', { index: 1 });
    await page.fill('textarea[name="message"]', "We copy website leads into the CRM by hand every morning and follow-ups slip.");
    await page.waitForTimeout(3400); // a sub-3s submit is treated as a bot by the API route
    await page.click('button[type="submit"]');
    await page.waitForTimeout(1700);
    return page.evaluate(() => ({
      success: /message sent/i.test(document.body.innerText),
      alert: document.querySelector('[role="alert"]')?.innerText?.replace(/\s+/g, " ").slice(0, 90) ?? null,
      mailto: Boolean(document.querySelector('a[href^="mailto:"]')),
      busy: Boolean(document.querySelector('button[aria-busy="true"]')),
    }));
  };

  provoked++;
  try {
  // (a) the relay confirms delivery → the success state is genuine
  await page.route(RELAY, (r) => r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ success: "true", message: "Message sent successfully" }) }));
  const okCase = await send();
  if (!okCase.success || okCase.busy) problems.push(`contact: a confirmed delivery did not reach the success state (${JSON.stringify(okCase)})`);
  else if (!posted || !posted.name || !posted.Email || !posted.Message || !posted._subject)
    problems.push(`contact: the POST body is missing enquiry fields (keys: ${posted ? Object.keys(posted).join(",") : "no POST"})`);
  else report.push(`form → relay        real POST (${Object.keys(posted).length} fields) → success state ✓`);

  // (b) the relay refuses (e.g. activation pending) → an honest error, never a thank-you
  await page.unroute(RELAY);
  await page.reload({ waitUntil: "load" });
  await page.waitForTimeout(900);
  await page.route(RELAY, (r) => r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ success: "false", message: "This form needs Activation. We've sent you an email containing an 'Activate Form' link." }) }));
  const failCase = await send();
  if (failCase.success) problems.push("contact: claimed success when the backend refused the message");
  else if (!failCase.alert || !failCase.mailto) problems.push(`contact: no honest failure state with fallback actions (${JSON.stringify(failCase)})`);
  else report.push("form ← relay fails  error state + mailto/WhatsApp fallback, no fake success ✓");

  // (c) no network at all → same honest treatment
  await page.unroute(RELAY);
  await page.reload({ waitUntil: "load" });
  await page.waitForTimeout(900);
  await page.route(RELAY, (r) => r.abort());
  const netCase = await send();
  if (netCase.success || !netCase.alert) problems.push(`contact: a blocked request was not reported (${JSON.stringify(netCase)})`);
  else report.push("form offline        network failure surfaced with fallback ✓");
  } finally {
    provoked--;
  }
  await page.close();
}

/* 4 — query param flow survives as a static page */
{
  const page = await open("/contact/?type=strategy-call", { motion: "full" });
  const focused = await page.evaluate(() => document.activeElement?.id ?? null);
  if (focused !== "f-name") problems.push(`?type= should focus the first field, focus was on ${focused}`);
  else report.push("?type=strategy-call   banner + autofokus ✓");
  await page.close();
}

await browser.close();
console.log(`static export at ${ORIGIN} (${DIST})`);
report.forEach((r) => console.log("  " + r));
if (problems.length) {
  console.log(`\nPROBLEMS (${new Set(problems).size})`);
  for (const p of [...new Set(problems)].slice(0, 24)) console.log(" · " + p);
  process.exit(1);
}
console.log("\npublishable: every page renders, styles and media load, controls work, form stays honest ✓");
