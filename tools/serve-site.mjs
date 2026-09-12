/**
 * Preview the static export the way a host would serve it, whatever base path it was
 * built with — so `npm run preview:site` works whether you exported with
 * `--base /rockxflow` (GitHub project page) or without one (custom domain).
 *
 *   node tools/serve-site.mjs [dir] [port]
 *
 * The base path is read back out of the built HTML, so nothing to remember.
 */
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(process.argv[2] ?? "docs");
const PORT = Number(process.argv[3] ?? 4173);

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json",
  ".webmanifest": "application/manifest+json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml",
};

const index = await readFile(path.join(ROOT, "index.html"), "utf8");
const base = (index.match(/(?:href|src)="(\/[^"]*?)\/_next\//) ?? [])[1] ?? "";

const resolve = async (urlPath) => {
  let rel = decodeURIComponent(urlPath.split("?")[0].split("#")[0]);
  if (base && (rel === base || rel.startsWith(base + "/"))) rel = rel.slice(base.length) || "/";
  if (rel.endsWith("/")) rel += "index.html";
  if (!path.extname(rel)) rel = path.join(rel, "index.html");
  const file = path.join(ROOT, rel);
  if (!file.startsWith(ROOT)) return null;
  const s = await stat(file).catch(() => null);
  return s?.isFile() ? file : null;
};

const server = createServer(async (req, res) => {
  let file = await resolve(req.url ?? "/");
  if (!file && (req.url ?? "").endsWith("/") === false && !path.extname(req.url ?? "")) {
    file = await resolve((req.url ?? "") + "/");
  }
  if (!file) {
    const notFound = path.join(ROOT, "404.html");
    if (await stat(notFound).catch(() => null)) {
      res.writeHead(404, { "content-type": TYPES[".html"] });
      res.end(await readFile(notFound));
      return;
    }
    res.writeHead(404).end("not found");
    return;
  }
  const body = await readFile(file);
  res.writeHead(200, {
    "content-type": TYPES[path.extname(file)] ?? "application/octet-stream",
    "cache-control": "no-cache",
  });
  res.end(body);
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`static export: ${ROOT}`);
  console.log(`base path    : ${base || "(none)"}`);
  console.log(`open         : http://localhost:${PORT}${base}/`);
});
