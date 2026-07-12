import type { MetadataRoute } from "next";
import { SITE } from "@/lib/config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "Googlebot", disallow: "/nogooglebot/" },
      { userAgent: "*", allow: "/" },
    ],
    sitemap: new URL("sitemap.xml", SITE.website).href,
  };
}
