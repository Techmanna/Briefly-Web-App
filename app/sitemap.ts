import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: "https://briefly.ng/",
      lastModified,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: "https://briefly.ng/briefs",
      lastModified,
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];
}
