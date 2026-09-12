/**
 * Browser QA: real overflow, reduced-motion, focus and console checks + screenshots.
 *   node tools/visual-qa.mjs [origin] [screenshotsDir]
 */
import { mkdir } from "node:fs/promises";
import { chromium } from "playwright";

const origin = process.argv[2] ?? "http://127.0.0.1:3000";
const shots = process.argv[3] ?? "/home/user/qa";

const routes = [
  { path: "/", name: "home" },
  { path: "/services", name: "services" },
  { path: "/solutions", name: "solutions" },
  { path: "/process", name: "process" },
  { path: "/about", name: "about" },
  { path: "/contact", name: "contact" },
  { path: "/terms", name: "terms" },
  { path: "/no-such-page", name: "404" },
];

const viewports = [
  { width: 1920, height: 1080, tag: "wide" },
  { width: 1440, height: 900, tag: "desktop" },
  { width: 768, height: 1024, tag: "tablet" },
  { width: 390, height: 844, tag: "mobile" },
  { width: 320, height: 720, tag: "min" },
];

await mkdir(shots, { recursive: true });
const browser = await chromium.launch({
  args: ["--no-sandbox", "--disable-dev-shm-usage", "--force-color-profile=srgb"],
});

const problems = [];
const table = [];

for (const route of routes) {
  for (const vp of viewports) {
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
    const errors = [];
    page.on("console", (m) => m.type() === "error" && errors.push(m.text().slice(0, 160)));
    page.on("pageerror", (e) => errors.push(String(e).slice(0, 160)));

    await page.goto(origin + route.path, { waitUntil: "load", timeout: 45000 });
    await page.waitForTimeout(1100);

    const result = await page.evaluate(() => {
      const doc = document.documentElement;
      const clientW = doc.clientWidth;
      /* elements that poke outside the viewport without a clipping ancestor */
      const clipped = (el) => {
        for (let n = el.parentElement; n; n = n.parentElement) {
          const s = getComputedStyle(n);
          if (s.overflowX !== "visible" || s.contain.includes("paint") || s.maskImage !== "none") return true;
        }
        return false;
      };
      const poke = [];
      for (const el of document.querySelectorAll("body *")) {
        const r = el.getBoundingClientRect();
        if (r.width < 4 || r.height < 4) continue;
        if (r.right <= clientW + 2 && r.left >= -2) continue;
        if (clipped(el)) continue;
        poke.push(`${el.tagName.toLowerCase()}.${(el.className || "").toString().split(" ")[0]} ${Math.round(r.right)}`);
      }
      const anims = document.getAnimations?.().filter((a) => a.playState === "running").length ?? -1;
      const title = document.title;
      const h1 = document.querySelectorAll("h1").length;
      return {
        clientW,
        scrollW: doc.scrollWidth,
        pageH: Math.round(doc.scrollHeight),
        poke: poke.slice(0, 5),
        anims,
        title,
        h1,
      };
    });

    const label = `${route.name} @${vp.width}`;
    if (result.scrollW > result.clientW + 1) problems.push(`${label}: document overflows ${result.scrollW}>${result.clientW}`);
    if (result.poke.length) problems.push(`${label}: unclipped elements past viewport → ${result.poke.join(" | ")}`);
    if (route.name === "home" && vp.tag === "desktop" && result.anims <= 0) problems.push(`${label}: no running animations on load`);
    table.push(
      `${label.padEnd(22)} h=${String(result.pageH).padStart(6)}  anims=${String(result.anims).padStart(3)}  h1=${result.h1}  ${result.title.slice(0, 44)}`
    );

    if (["desktop", "mobile", "min"].includes(vp.tag)) {
      await page.screenshot({ path: `${shots}/${route.name}-${vp.tag}.png` });
      if (route.name === "home" && vp.tag === "desktop") {
        await page.screenshot({ path: `${shots}/home-desktop-full.png`, fullPage: true });
      }
    }

    /* reduced motion: everything must settle */
    if (vp.tag === "desktop" && (route.name === "home" || route.name === "services")) {
      const rm = await browser.newPage({ viewport: { width: vp.width, height: vp.height }, reducedMotion: "reduce" });
      await rm.goto(origin + route.path, { waitUntil: "load" });
      await rm.waitForTimeout(1400);
      const n = await rm.evaluate(() => document.getAnimations().filter((a) => a.playState === "running").length);
      const loops = await rm.evaluate(() => {
        const media = document.querySelector("video");
        return media ? media.loop : null;
      });
      if (n > 0) problems.push(`reduced-motion ${route.name}: ${n} animation(s) still running`);
      table.push(`reduced-motion ${route.name.padEnd(12)} running=${n} hero-video-loop=${loops}`.padEnd(0));
      await rm.screenshot({ path: `${shots}/${route.name}-reduced-motion.png` });
      await rm.close();
    }

    /* keyboard: is the focus ring visible on the first interactive element? */
    if (vp.tag === "desktop" && route.name === "home") {
      const kb = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
      await kb.goto(origin + route.path, { waitUntil: "load" });
      await kb.keyboard.press("Tab");
      await kb.keyboard.press("Tab");
      const focused = await kb.evaluate(() => {
        const el = document.activeElement;
        const s = getComputedStyle(el);
        const r = el.getBoundingClientRect();
        return {
          tag: el.tagName.toLowerCase(),
          text: (el.textContent || "").trim().slice(0, 40),
          outline: s.outlineWidth + " " + s.outlineStyle + " " + s.outlineColor,
          boxShadow: s.boxShadow.slice(0, 60),
          inViewport: r.top >= 0 && r.left >= 0 && r.right <= window.innerWidth,
        };
      });
      if (!focused.inViewport) problems.push("keyboard: focused element scrolled out of view");
      if (focused.outline.startsWith("0px") && focused.boxShadow === "none") {
        problems.push("keyboard: focus ring not visible (no outline/box-shadow)");
      }
      table.push(`focus @2 tabs${" ".repeat(8)} ${focused.tag} "${focused.text}" outline=${focused.outline}`);
      await kb.screenshot({ path: `${shots}/keyboard-focus.png` });
      await kb.close();
    }

    const noise = route.name === "404" ? errors.filter((e) => !/status of 404/.test(e)) : errors;
    if (noise.length) problems.push(`${label}: console errors → ${[...new Set(noise)].slice(0, 3).join(" | ")}`);
    await page.close();
  }
}

await browser.close();
console.log(table.join("\n"));
console.log();
if (problems.length) {
  console.log(`PROBLEMS (${problems.length})`);
  problems.forEach((p) => console.log(" · " + p));
  process.exit(1);
}
console.log("visual QA: no overflow, no console errors, reduced motion honoured ✓");
