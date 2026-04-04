import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { apiGet } from "@/lib/server/briefly-api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const revalidate = 300;

type NewsItem = {
  id: string;
  slug: string;
  title: string;
  content: string;
  summary?: string | null;
  url: string;
  published_at: string;
  signal_score: number;
  category: { id: string; name: string; slug: string };
  source: { id: string; name: string; url: string };
};

function toDescription(item: NewsItem) {
  const text = item.summary || item.content || "";
  const cleaned = text.replace(/\s+/g, " ").trim();
  if (cleaned.length <= 160) return cleaned;
  return `${cleaned.slice(0, 157)}...`;
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const { slug } = params;
  try {
    const item = await apiGet<NewsItem>(`/v1/news/${slug}`, {
      next: { revalidate },
    });
    const description = toDescription(item);
    return {
      title: item.title,
      description,
      alternates: { canonical: `/news/${item.slug}` },
      openGraph: {
        type: "article",
        url: `/news/${item.slug}`,
        title: item.title,
        description,
      },
      twitter: {
        card: "summary_large_image",
        title: item.title,
        description,
      },
    };
  } catch {
    return { title: "News" };
  }
}

export default async function NewsDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;

  let item: NewsItem;
  try {
    item = await apiGet<NewsItem>(`/v1/news/${slug}`, {
      next: { revalidate },
    });
  } catch {
    notFound();
  }

  if (!item) return notFound();

  if (item.slug && slug !== item.slug) {
    redirect(`/news/${item.slug}`);
  }

  const published = new Date(item.published_at);
  const publishedText = Number.isNaN(published.getTime())
    ? ""
    : published.toLocaleString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });

  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: item.title,
    datePublished: item.published_at,
    dateModified: item.published_at,
    articleBody: item.summary || item.content,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://briefly.ng/news/${item.slug}`,
    },
    publisher: {
      "@type": "Organization",
      name: "Briefly",
      url: "https://briefly.ng",
    },
  });

  return (
    <div className="space-y-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />

      <div className="space-y-2">
        <div className="flex items-center gap-3 text-xs text-muted-foreground font-medium">
          <Link href="/news" className="hover:text-primary transition-colors">
            News
          </Link>
          <span>•</span>
          <span>{item.category?.name ?? "General"}</span>
          <span>•</span>
          <span>{item.source?.name ?? "Source"}</span>
        </div>
        <h1 className="text-3xl font-heading font-bold leading-tight">
          {item.title}
        </h1>
        {publishedText ? (
          <p className="text-sm text-muted-foreground">{publishedText}</p>
        ) : null}
      </div>

      <Card className="glass-panel rounded-2xl p-6 shadow-sm border border-border/60 space-y-4">
        {item.summary && item.summary !== item.content ? (
          <p className="text-base text-foreground/80 leading-relaxed">
            {item.summary}
          </p>
        ) : null}
        <p className="text-base text-muted-foreground leading-relaxed whitespace-pre-line">
          {item.content}
        </p>
        <div className="pt-2">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="rounded-full px-4 text-xs h-8 border-border/60 hover:bg-primary/5 hover:text-primary hover:border-primary/30"
          >
            <a href={item.url} target="_blank" rel="noreferrer">
              Read original source <ExternalLink className="ml-2 h-3 w-3" />
            </a>
          </Button>
        </div>
      </Card>
    </div>
  );
}
