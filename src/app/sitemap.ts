import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";

/** Required for `output: export` — these are generated once at build time. */
export const dynamic = "force-static";

const pages = ["", "/services", "/solutions", "/process", "/about", "/contact", "/privacy-policy", "/terms"];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return pages.map((p) => ({
    url: `${siteUrl}${p || "/"}`,
    lastModified: now,
    changeFrequency: p === "" || p === "/services" ? "weekly" : "monthly",
    priority: p === "" ? 1 : p === "/services" || p === "/solutions" ? 0.9 : p === "/contact" ? 0.8 : 0.6,
  }));
}
