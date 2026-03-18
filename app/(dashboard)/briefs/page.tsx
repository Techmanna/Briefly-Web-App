"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useListDigestsQuery } from "@/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function formatDate(value: string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function BriefsPage() {
  const [page, setPage] = useState(1);
  const limit = 5; // One digest per "page" for a focused list view, or more if desired
  const query = useListDigestsQuery(page, limit);

  const digests = query.data?.items ?? [];
  const meta = query.data?.meta;

  if (query.isPending) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-9 w-56" />
          <Skeleton className="h-5 w-80" />
        </div>
        <div className="space-y-8">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-7 w-48" />
              <div className="grid gap-4">
                {Array.from({ length: 3 }).map((_, j) => (
                  <Card
                    key={j}
                    className="border-border/50 shadow-sm rounded-2xl overflow-hidden"
                  >
                    <CardHeader className="space-y-3">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-6 w-4/5" />
                      <Skeleton className="h-4 w-3/5" />
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (query.isError) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-heading font-bold">My Briefs</h1>
        <p className="text-muted-foreground">
          {(query.error as Error | undefined)?.message ||
            "Failed to load digests."}
        </p>
        <Button onClick={() => query.refetch()} className="rounded-full px-6">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild className="-ml-2 h-8">
              <Link href="/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Link>
            </Button>
          </div>
          <h1 className="text-3xl font-heading font-bold">My Briefs</h1>
          <p className="text-muted-foreground">
            Your personalized history of high-signal news.
          </p>
        </div>
      </div>

      <div className="space-y-12">
        {digests.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-border/40 rounded-3xl">
            <p className="text-muted-foreground">
              No briefs found yet. Check back tomorrow!
            </p>
          </div>
        ) : (
          digests.map((digest) => (
            <div key={digest.id} className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-border/40" />
                <h2 className="text-xl font-heading font-bold text-foreground/80 whitespace-nowrap px-2">
                  {formatDate(digest.date)}
                </h2>
                <div className="h-px flex-1 bg-border/40" />
              </div>

              <div className="grid gap-4">
                {digest.items.map((item) => {
                  const category = item.news?.category?.name ?? "General";
                  const source = item.news?.source?.name ?? "Source";
                  const title = item.news?.title ?? "Untitled";
                  const summary = item.news?.summary ?? "";
                  const url = item.news?.url?.trim() || undefined;

                  return (
                    <Card
                      key={item.id}
                      className="border-border/50 shadow-sm rounded-2xl overflow-hidden hover:border-primary/20 transition-colors"
                    >
                      <CardHeader className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-primary uppercase tracking-wider bg-primary/5 border border-primary/10 px-2 py-1 rounded-md">
                            {category}
                          </span>
                          <span className="text-xs text-muted-foreground font-medium">
                            {source}
                          </span>
                        </div>
                        <CardTitle className="font-heading text-lg leading-tight">
                          {title}
                        </CardTitle>
                        <CardDescription className="text-base text-foreground/70">
                          {summary || "Open to read the full story."}
                        </CardDescription>
                        {url ? (
                          <div className="pt-2">
                            <Button
                              asChild
                              variant="outline"
                              size="sm"
                              className="rounded-full px-4 text-xs h-8 border-border/60 hover:bg-primary/5 hover:text-primary hover:border-primary/30"
                            >
                              <a href={url} target="_blank" rel="noreferrer">
                                Read Full Story{" "}
                                <ExternalLink className="ml-2 h-3 w-3" />
                              </a>
                            </Button>
                          </div>
                        ) : null}
                      </CardHeader>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {meta && meta.total_pages > 1 && (
        <div className="flex items-center justify-center gap-4 pt-4">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full border-border/60"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1 || query.isPlaceholderData}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium">
            Page {page} of {meta.total_pages}
          </span>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full border-border/60"
            onClick={() => setPage((p) => Math.min(meta.total_pages, p + 1))}
            disabled={page === meta.total_pages || query.isPlaceholderData}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
