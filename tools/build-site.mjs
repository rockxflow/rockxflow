/**
 * Publishable static website: builds the site as a pure HTML/CSS/JS export — no
 * Node runtime, no server code — into a folder you can push to GitHub (Pages),
 * drop on Netlify/S3/nginx, or point a domain at.
 *
 *   node tools/build-site.mjs                        # → docs/  (GitHub Pages "/docs" works)
 *   node tools/build-site.mjs --out site --base /rockxflow --url https://rockxflow.com
 *
 * What it does
 *   1. Stashes src/app/api (a POST route handler cannot be part of a static export)
 *   2. Runs `next build` with RX_STATIC=1 → output: "export", trailingSlash, basePath
 *   3. Restores the API folder whatever happens, so the app build is untouched
 *   4. Moves out/ to the target folder, adds .nojekyll, zips it, prints a manifest
 *
 * In this mode the contact form has no API to call, so it composes a pre-filled
 * email (or POSTs to NEXT_PUBLIC_FORM_ENDPOINT when you set one, e.g. Formspree) and
 * says exactly that on screen. It never claims a message was sent.
 */
import { execFileSync, spawnSync } from "node:child_process";
import { mkdir, readFile, rename as mv, rm, stat, writeFile, readdir } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const arg = (name, fallback) => {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
};
const flag = (name) => process.argv.includes(`--${name}`);

const OUT = path.resolve(ROOT, arg("out", "docs"));
const BASE = arg("base", "");
const SITE_URL = arg("url", process.env.NEXT_PUBLIC_SITE_URL ?? "");
const FORM_ENDPOINT = process.env.NEXT_PUBLIC_FORM_ENDPOINT ?? "";

const API_DIR = path.join(ROOT, "src/app/api");
const STASH = path.join(ROOT, ".rx-api-stash");

const exists = async (p) => Boolean(await stat(p).catch(() => null));

if (!(await exists(path.join(ROOT, "node_modules/next")))) {
  console.error("next is not installed — run `npm install` first");
  process.exit(1);
}

const moved = (await exists(API_DIR)) && !flag("keep-api");
if (moved) {
  await rm(STASH, { recursive: true, force: true });
  await mkdir(STASH, { recursive: true });
  await mv(API_DIR, path.join(STASH, "api"));
  console.log("stashed src/app/api (POST handlers are not exportable)");
}

const restore = async () => {
  if (!moved) return;
  await mkdir(path.dirname(API_DIR), { recursive: true });
  await mv(path.join(STASH, "api"), API_DIR);
  await rm(STASH, { recursive: true, force: true });
  console.log("restored src/app/api ✓");
};

try {
  console.log(`building static export${BASE ? ` under base path ${BASE}` : ""}${SITE_URL ? ` for ${SITE_URL}` : ""}…`);
  const res = spawnSync("npx", ["next", "build"], {
    cwd: ROOT,
    stdio: "inherit",
    env: {
      ...process.env,
      RX_STATIC: "1",
      RX_BASE_PATH: BASE,
      NEXT_PUBLIC_STATIC_EXPORT: "1",
      NEXT_PUBLIC_SITE_URL: SITE_URL || "http://localhost:4173",
      ...(FORM_ENDPOINT ? { NEXT_PUBLIC_FORM_ENDPOINT: FORM_ENDPOINT } : {}),
    },
  });
  if (res.status !== 0) throw new Error("next build (static) failed — see the output above");
} finally {
  await restore();
}

/**
 * basePath covers /_next/** only — the files in public/ (media, fonts, icons) are
 * emitted as root-absolute URLs and would miss the /<repo>/ prefix on a GitHub
 * project page. So the export gets one targeted rewrite pass here instead of a
 * base-path helper threaded through every component: same output, no app-build risk.
 */
async function prefixPublicUrls(dir, base) {
  let touched = 0;
  let hits = 0;
  const walkDir = async (d) => {
    for (const e of await readdir(d, { withFileTypes: true })) {
      const f = path.join(d, e.name);
      if (e.isDirectory()) await walkDir(f);
      else if (/\.(html|css|webmanifest|js)$/.test(e.name)) {
        const src = await readFile(f, "utf8");
        const out = src
          // attributes, CSS url(), JSON strings and the escaped strings inside the
          // RSC payload, plus literals in the JS chunks (the hero <video> builds its
          // src at runtime, so those never appear as HTML attributes at all)
          .replace(/(["'(=])\/(media|fonts|icons)\//g, (_m, q, kind) => {
            hits++;
            return `${q}${base}/${kind}/`;
          })
          .replace(/(,\s*)\/(media|fonts|icons)\//g, (_m, sep, kind) => {
            hits++;
            return `${sep}${base}/${kind}/`;
          });
        if (out !== src) {
          await writeFile(f, out, "utf8");
          touched++;
        }
      }
    }
  };
  await walkDir(dir);
  return { touched, hits };
}

const built = path.join(ROOT, "out");
if (!(await exists(built))) throw new Error("no out/ folder produced — is output: export enabled?");

await rm(OUT, { recursive: true, force: true });
await mkdir(path.dirname(OUT), { recursive: true });
await mv(built, OUT);
await writeFile(path.join(OUT, ".nojekyll"), "", "utf8"); // GitHub Pages: keep _next/ folders

if (BASE) {
  const { touched, hits } = await prefixPublicUrls(OUT, BASE);
  console.log(`prefixed public asset URLs with ${BASE} in ${touched} files (${hits} replacements)`);
}

const walk = async (dir, acc = []) => {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const f = path.join(dir, e.name);
    if (e.isDirectory()) await walk(f, acc);
    else acc.push(f);
  }
  return acc;
};
const files = await walk(OUT);
const pages = files.filter((f) => f.endsWith(".html"));
let bytes = 0;
for (const f of files) bytes += (await stat(f)).size;

const summary = {
  out: path.relative(ROOT, OUT),
  pages: pages.length,
  files: files.length,
  size: `${(bytes / 1024 / 1024).toFixed(1)} MB`,
  siteUrl: SITE_URL || "(not set — canonical/og still use the build default)",
  formEndpoint: FORM_ENDPOINT || "none → the form composes an email instead",
};

let zip = null;
if (!flag("no-zip")) {
  zip = path.join(ROOT, "rockxflow-static.zip");
  await rm(zip, { force: true });
  execFileSync("zip", ["-qr", path.basename(zip), path.basename(OUT)], { cwd: ROOT });
  const kb = Number(execFileSync("du", ["-k", zip]).toString().trim().split(/\s+/)[0]);
  summary.zip = `${path.relative(ROOT, zip)} (${(kb / 1024).toFixed(1)} MB)`;
}

console.log("\nstatic site written:");
for (const [k, v] of Object.entries(summary)) console.log(`  ${k.padEnd(12)} ${v}`);
console.log(`\npages:\n${pages.map((f) => "  " + path.relative(OUT, f)).sort().join("\n")}`);
console.log(`\ntry it locally:  python3 -m http.server 4173 --bind 0.0.0.0 --directory ${summary.out}`);
