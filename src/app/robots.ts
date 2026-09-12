import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";

/** Required for `output: export` — these are generated once at build time. */
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
