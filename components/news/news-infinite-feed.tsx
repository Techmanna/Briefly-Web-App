"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ApiError } from "@/api/clients/errors";
import { Skeleton } from "@/components/ui/skeleton";
import { NewsListItem } from "@/components/news/news-list-item";
import { useInfinitePublicNewsQuery } from "@/api";
import type { PublicNewsItem } from "@/api/clients/news";
import { Button } from "@/components/ui/button";

type Props = {
  initialItems: PublicNewsItem[];
  minSignal: number;
  take: number;
};

function formatDate(value: string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function NewsInfiniteFeed({ initialItems, minSignal, take }: Props) {
  const query = useInfinitePublicNewsQuery({ minSignal, take, initialItems });
  const [showBackToTop, setShowBackToTop] = useState(false);

  const allItems = useMemo(() => {
    const pages = query.data?.pages ?? [];
    const merged = pages.flat();
    if (merged.length === 0) return initialItems;

    const byId = new Map<string, PublicNewsItem>();
    for (const item of merged) {
      byId.set(item.id, item);
    }
    return Array.from(byId.values());
  }, [initialItems, query.data?.pages]);

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const pausedRef = useRef(false);
  const restoringRef = useRef(false);
  const lastFetchAtRef = useRef(0);
  const didRestoreRef = useRef(false);
  const hasNextPageRef = useRef(false);
  const isFetchingNextPageRef = useRef(false);

  const fetchNextPage = query.fetchNextPage;
  const hasNextPage = query.hasNextPage;
  const isFetchingNextPage = query.isFetchingNextPage;
  const error = query.error;

  useEffect(() => {
    hasNextPageRef.current = Boolean(hasNextPage);
  }, [hasNextPage]);

  useEffect(() => {
    isFetchingNextPageRef.current = Boolean(isFetchingNextPage);
  }, [isFetchingNextPage]);

  useEffect(() => {
    const onScroll = () => {
      setShowBackToTop((window.scrollY || 0) > 700);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const err = error;
    if (err instanceof ApiError && err.status === 429) {
      pausedRef.current = true;
    }
  }, [error]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (didRestoreRef.current) return;

    const savedAtRaw = window.sessionStorage.getItem("briefly_news_saved_at");
    const savedAt = savedAtRaw ? Number(savedAtRaw) : 0;
    const maxAgeMs = 30 * 60 * 1000;
    if (!savedAt || Date.now() - savedAt > maxAgeMs) return;

    const yRaw = window.sessionStorage.getItem("briefly_news_scroll_y");
    const targetY = yRaw ? Number(yRaw) : 0;
    const countRaw = window.sessionStorage.getItem("briefly_news_item_count");
    const targetCount = countRaw ? Number(countRaw) : 0;

    window.sessionStorage.removeItem("briefly_news_saved_at");
    window.sessionStorage.removeItem("briefly_news_scroll_y");
    window.sessionStorage.removeItem("briefly_news_item_count");

    if (!Number.isFinite(targetY) || targetY <= 0) return;

    const needed = Math.max(0, targetCount - initialItems.length);
    const pagesNeeded = Math.ceil(needed / take);

    didRestoreRef.current = true;
    restoringRef.current = true;
    pausedRef.current = true;

    (async () => {
      for (let i = 0; i < pagesNeeded; i++) {
        if (!hasNextPageRef.current) break;
        try {
          await fetchNextPage();
          await new Promise((r) => setTimeout(r, 250));
        } catch {
          break;
        }
      }

      requestAnimationFrame(() => {
        window.scrollTo({ top: targetY, left: 0, behavior: "auto" });
        restoringRef.current = false;
        pausedRef.current = false;
      });
    })();
  }, [fetchNextPage, initialItems.length, take]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (!first?.isIntersecting) return;
        if (pausedRef.current) return;
        if (restoringRef.current) return;
        if (isFetchingNextPageRef.current) return;
        if (!hasNextPageRef.current) return;

        const now = Date.now();
        if (now - lastFetchAtRef.current < 900) return;
        lastFetchAtRef.current = now;

        fetchNextPage();
      },
      { rootMargin: "800px 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [fetchNextPage]);

  return (
    <div className="space-y-4">
      {allItems.map((item, index) => (
        <div
          key={item.id}
          className="animate-in fade-in slide-in-from-bottom-2 duration-500"
          style={{ animationDelay: `${Math.min(index, 12) * 0.03}s` }}
        >
          <NewsListItem
            slug={item.slug || item.id}
            category={item.category?.name ?? "General"}
            source={item.source?.name ?? "Source"}
            title={item.title}
            summary={item.summary}
            url={item.url}
            publishedAt={formatDate(item.published_at)}
          />
        </div>
      ))}

      {isFetchingNextPage ? (
        <div className="space-y-4 animate-in fade-in duration-300">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="glass-panel rounded-2xl p-6 shadow-sm border-border/60"
            >
              <div className="flex items-center justify-between mb-3">
                <Skeleton className="h-5 w-24 rounded-md" />
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="h-6 w-5/6 mb-3" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-4/5 mb-4" />
              <Skeleton className="h-8 w-44 rounded-full" />
            </div>
          ))}
        </div>
      ) : null}

      <div ref={sentinelRef} className="h-1" />

      {error instanceof ApiError && error.status === 429 ? (
        <div className="glass-panel rounded-2xl p-5 shadow-sm border-border/60 animate-in fade-in duration-300">
          <div className="flex items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground">
              You&apos;re scrolling fast. Tap to load more.
            </div>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full border-border/60"
              onClick={() => {
                pausedRef.current = false;
                fetchNextPage();
              }}
              disabled={isFetchingNextPage}
            >
              Load more
            </Button>
          </div>
        </div>
      ) : null}

      {!isFetchingNextPage && hasNextPage === false ? (
        <div className="text-center text-sm text-muted-foreground py-6 animate-in fade-in duration-300">
          You&apos;re all caught up.
        </div>
      ) : null}

      {showBackToTop ? (
        <div className="fixed bottom-6 right-6 z-40 animate-in fade-in duration-300">
          <Button
            variant="secondary"
            size="sm"
            className="rounded-full shadow-sm border border-border/60"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            Back to top
          </Button>
        </div>
      ) : null}
    </div>
  );
}
