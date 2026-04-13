import type { MetadataRoute } from "next";

const BASE_URL = "https://edfu.ai";

const pages = [
  { path: "", priority: 1 },
  { path: "/agents", priority: 0.9 },
  { path: "/meeting", priority: 0.9 },
  { path: "/integrations", priority: 0.8 },
  { path: "/pricing", priority: 0.8 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return pages.map((page) => ({
    url: `${BASE_URL}${page.path}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: page.priority,
    alternates: {
      languages: {
        tr: `${BASE_URL}${page.path}`,
        en: `${BASE_URL}/en${page.path}`,
      },
    },
  }));
}
