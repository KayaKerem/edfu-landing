import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://edfu.ai",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
      alternates: {
        languages: {
          tr: "https://edfu.ai",
          en: "https://edfu.ai/en",
        },
      },
    },
  ];
}
