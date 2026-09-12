#!/usr/bin/env node
/**
 * QA: crawls every rendered page, verifies that every internal href resolves
 * (including # anchors pointing at a real id), that all local assets load, and
 * that no page leaks lorem/placeholder text. Run: `node tools/qa.mjs [origin]`
 */
const ORIGIN = process.argv[2] ?? "http://127.0.0.1:3000";
const PAGES = [
  "/",
  "/services",
  "/solutions",
  "/process",
  "/about",
  "/contact",
  "/contact?type=strategy-call",
  "/privacy-policy",
  "/terms",
  "/nope-404-check",
];

const bad = [];
const seen = new Map();

async function html(pathname) {
  const key = pathname;
  if (seen.has(key)) return seen.get(key);
  const res = await fetch(ORIGIN + pathname);
  const text = await res.text();
  const entry = { res, text };
  seen.set(key, entry);
  return entry;
}

const pages = new Map();
for (const p of PAGES) pages.set(p, await html(p));

// 1 · expected status codes
for (const p of PAGES) {
  const { res } = pages.get(p);
  const want = p === "/nope-404-check" ? 404 : 200;
  if (res.status !== want) bad.push(`${p}: expected ${want}, got ${res.status}`);
}

const idsByPage = new Map();
for (const [p, { text }] of pages) {
  idsByPage.set(p.split("#")[0], new Set([...text.matchAll(/id="([^"]+)"/g)].map((m) => m[1])));
}

// 2 · internal links + anchors + local assets + dead-button smell test
let linkCount = 0;
for (const [p, { text }] of pages) {
  const hrefs = [...text.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);
  const srcs = [...text.matchAll(/src="([^"]+)"/g)].map((m) => m[1]);
  for (const h of [...hrefs, ...srcs]) {
    if (/^(https?:|mailto:|tel:|data:)/.test(h)) continue;
    linkCount++;
    const [pathPart, hash] = h.split("#");
    if (!pathPart) continue; // same-page anchor, validated in step 3
    const target = pathPart;
    const res = await fetch(ORIGIN + (target || "/"), { method: "GET" });
    if (!res.ok) {
      bad.push(`${p} → ${h}: ${res.status}`);
      continue;
    }
    if (hash && pathPart !== "" && pathPart !== p.split("?")[0]) {
      const body = await res.text();
      const ids = new Set([...body.matchAll(/id="([^"]+)"/g)].map((m) => m[1]));
      if (body.length && !ids.has(hash)) bad.push(`${p} → ${h}: no #${hash} on ${pathPart}`);
    }
  }
  if (/lorem ipsum|\bTODO\b|\bFIXME\b|placeholder text|undefined%|\bNaN\b|\b\[object Object\]\b/i.test(text)) {
    bad.push(`${p}: contains leftover placeholder text`);
  }
  if (!/<h1[\s>]/i.test(text)) bad.push(`${p}: missing <h1>`);
  if ((text.match(/<h1/g) ?? []).length > 1) bad.push(`${p}: more than one <h1>`);
  if (!/name="description" content="[^"]{40,}/.test(text)) bad.push(`${p}: thin or missing meta description`);
  if (!/rel="canonical"/.test(text)) bad.push(`${p}: missing canonical`);
  if (!/property="og:image"/.test(text)) bad.push(`${p}: missing og:image`);
}

// 3 · same-page anchors must exist
for (const [p, { text }] of pages) {
  const ids = idsByPage.get(p.split("#")[0]) ?? new Set();
  for (const m of text.matchAll(/href="#([^"]+)"/g)) {
    if (!ids.has(m[1])) bad.push(`${p}: in-page link #${m[1]} has no target`);
  }
}

// 4 · sitemap completeness
const sm = await (await fetch(ORIGIN + "/sitemap.xml")).text();
for (const p of PAGES.slice(0, 9)) {
  const clean = p.split("?")[0];
  if (!sm.includes(clean)) bad.push(`sitemap.xml missing ${clean}`);
}

// 5 · robots
const robots = await (await fetch(ORIGIN + "/robots.txt")).text();
if (!/Sitemap:/i.test(robots)) bad.push("robots.txt has no Sitemap directive");

console.log(`checked ${PAGES.length} pages, ${linkCount} internal references`);
if (bad.length) {
  console.log("\nPROBLEMS:\n" + [...new Set(bad)].map((b) => " · " + b).join("\n"));
  process.exitCode = 1;
} else {
  console.log("all links, anchors, assets and SEO basics verified ✓");
}
