import type { MetadataRoute } from "next";
import { courses } from "@/data/courses";
import { domains } from "@/data/domains";
import { legalDocs } from "@/data/legal";
import { site } from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url.replace(/\/$/, "");
  const now = new Date();
  const statics = ["", "/formations", "/domaines", "/orientation", "/classement", "/proposer", "/methode", "/a-propos", "/faq", "/contact"];
  return [
    ...statics.map((p) => ({ url: `${base}${p}`, lastModified: now, changeFrequency: "weekly" as const, priority: p === "" ? 1 : 0.8 })),
    ...domains.map((d) => ({ url: `${base}/domaines/${d.slug}`, lastModified: now, priority: 0.7 })),
    ...courses.map((c) => ({ url: `${base}/formations/${c.slug}`, lastModified: now, priority: 0.7 })),
    ...legalDocs.map((d) => ({ url: `${base}/legal/${d.slug}`, lastModified: now, priority: 0.2 })),
  ];
}
