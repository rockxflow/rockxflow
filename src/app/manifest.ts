import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

/** Required for `output: export` — these are generated once at build time. */
export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name} — ${site.category}`,
    short_name: site.name,
    description: site.intro,
    start_url: "/",
    display: "standalone",
    background_color: "#F7F9FC",
    theme_color: "#030509",
    icons: [
      { src: "/icons/favicon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/icon-512-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
      { src: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
