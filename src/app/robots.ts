import type { MetadataRoute } from "next";
import { site } from "@/content/home";

/* robots.txt: everything may be crawled; points search engines to the sitemap. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
