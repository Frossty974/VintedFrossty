import type { MetadataRoute } from "next";
import { site } from "@/data/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/espace", "/api/", "/connexion", "/inscription", "/orientation/resultats"] },
    sitemap: `${site.url.replace(/\/$/, "")}/sitemap.xml`,
  };
}
