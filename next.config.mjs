/**
 * Two builds from one codebase:
 *
 *   npm run build        → Next.js app (Node runtime). Enables POST /api/contact.
 *   npm run build:pages  → static export (docs/): plain HTML/CSS/JS for GitHub Pages,
 *                          Netlify, S3, nginx — no server code at all.
 *
 * tools/build-site.mjs sets RX_STATIC=1 (this file switches to `output: "export"`),
 * RX_BASE_PATH (so a GitHub *project* site at https://user.github.io/repo/ resolves its
 * assets) and NEXT_PUBLIC_SITE_URL (canonical/og/sitemap origin). In the static build the
 * contact form composes a pre-filled email instead — or POSTs to NEXT_PUBLIC_FORM_ENDPOINT
 * when you provide one (Formspree, Getform, an n8n webhook…).
 */
const isStatic = process.env.RX_STATIC === "1";
const basePath = (process.env.RX_BASE_PATH ?? "").replace(/\/+$/, "");

/** Long-lived, content-hashed static assets. A static host sets these itself. */
const immutable = (glob) => ({
  source: glob,
  headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: !isStatic,
  trailingSlash: isStatic, // directory output: /services/index.html
  ...(isStatic ? { output: "export" } : {}),
  ...(isStatic && basePath ? { basePath, assetPrefix: basePath } : {}),
  images: {
    // no next/image loader in a static export; derivative files are pre-generated
    ...(isStatic ? { unoptimized: true } : {}),
    formats: ["image/webp"],
    deviceSizes: [360, 414, 640, 768, 1024, 1280, 1440, 1920],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  // `output: "export"` ignores headers/redirects and warns about them, so omit them
  ...(isStatic
    ? {}
    : {
        headers: async () => [
          immutable("/fonts/:all*"),
          immutable("/media/:all*"),
          {
            source: "/:all*",
            headers: [
              { key: "X-Content-Type-Options", value: "nosniff" },
              { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
              { key: "X-Frame-Options", value: "SAMEORIGIN" },
            ],
          },
        ],
      }),
};

export default nextConfig;
