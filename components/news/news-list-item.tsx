"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Props = {
  slug: string;
  category: string;
  source: string;
  title: string;
  summary?: string | null;
  publishedAt?: string;
  url?: string;
};

function saveNewsScrollSnapshot() {
  try {
    if (typeof window === "undefined") return;
    window.sessionStorage.setItem(
      "briefly_news_scroll_y",
      String(window.scrollY || 0),
    );
    const count = document.querySelectorAll("[data-news-item]").length;
    window.sessionStorage.setItem("briefly_news_item_count", String(count));
    window.sessionStorage.setItem("briefly_news_saved_at", String(Date.now()));
  } catch {}
}

export function NewsListItem({
  slug,
  category,
  source,
  title,
  summary,
  publishedAt,
  url,
}: Props) {
  return (
    <Card
      data-news-item
      className="border-border/50 shadow-none rounded-2xl overflow-hidden hover:border-primary/20 transition-colors"
    >
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[10px] font-bold text-primary uppercase tracking-wider bg-primary/5 border border-primary/10 px-2 py-1 rounded-md">
            {category}
          </span>
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
            <span>{source}</span>
            {publishedAt ? <span>• {publishedAt}</span> : null}
          </div>
        </div>

        <CardTitle className="font-heading text-lg leading-tight">
          <Link
            href={`/news/${slug}`}
            className="hover:text-primary/90 transition-colors"
            onClick={saveNewsScrollSnapshot}
          >
            {title}
          </Link>
        </CardTitle>

        <CardDescription className="text-base text-foreground/70">
          {summary || "Open to read the full story."}
        </CardDescription>

        <div className="flex justify-between items-center">
          <div className="pt-2 flex gap-2">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="rounded-full px-4 text-xs h-8 border-border/60 hover:bg-primary/5 hover:text-primary hover:border-primary/30"
            >
              <Link href={`/news/${slug}`} onClick={saveNewsScrollSnapshot}>
                Read on Briefly
              </Link>
            </Button>
            {url ? (
              <Button
                asChild
                variant="outline"
                size="sm"
                className="rounded-full px-4 text-xs h-8 border-border/60 hover:bg-primary/5 hover:text-primary hover:border-primary/30"
              >
                <a href={url} target="_blank" rel="noreferrer">
                  Source <ExternalLink className="ml-2 h-3 w-3" />
                </a>
              </Button>
            ) : null}
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
