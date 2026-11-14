import type { MetadataRoute } from "next";
import { ADRESA_STRANICE } from "@/lib/stranica";

// robots.txt — dopušta Googleu pregled cijele stranice i govori gdje je sitemap
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${ADRESA_STRANICE}/sitemap.xml`,
  };
}
