import type { MetadataRoute } from "next";
import { apiGet } from "@/lib/server/briefly-api";

export const dynamic = "force-dynamic";

type NewsItem = {
  id: string;
  slug: string;
  published_at: string;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();

  let news: NewsItem[] = [];
  try {
    news = await apiGet<NewsItem[]>("/v1/news?minSignal=3&take=200", {
      next: { revalidate: 3600 },
    });
  } catch {
    news = [];
  }

  return [
    {
      url: "https://briefly.ng/",
      lastModified,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: "https://briefly.ng/news",
      lastModified,
      changeFrequency: "hourly",
      priority: 0.9,
    },
    // {
    //   url: "https://briefly.ng/briefs",
    //   lastModified,
    //   changeFrequency: "daily",
    //   priority: 0.9,
    // },
    ...news.map((n) => ({
      url: `https://briefly.ng/news/${n.slug || n.id}`,
      lastModified: n.published_at ? new Date(n.published_at) : lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ];
}
