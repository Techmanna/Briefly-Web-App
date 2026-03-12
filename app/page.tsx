"use client";

import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock, Zap } from "lucide-react";
import { useLatestDigestQuery } from "@/api";
import { Skeleton } from "@/components/ui/skeleton";
import type { DigestItem } from "@/api/clients/digest";

function pickRandom<T>(items: T[], count: number) {
  if (count <= 0) return [];
  if (items.length <= count) return [...items];
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = copy[i];
    copy[i] = copy[j];
    copy[j] = tmp;
  }
  return copy.slice(0, count);
}

export default function LandingPage() {
  const latestDigestQuery = useLatestDigestQuery();
  const digest = latestDigestQuery.data;
  const [previewItems, setPreviewItems] = useState<DigestItem[]>([]);

  const dateLabel = (() => {
    if (!digest?.date) return "";
    const d = new Date(digest.date);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  })();

  useEffect(() => {
    const items = digest?.items ?? [];
    if (items.length === 0) return;

    const choose = () => {
      const next = pickRandom(items, 3);
      setPreviewItems((prev) => {
        if (prev.length !== next.length) return next;
        const prevIds = prev.map((p) => p.id).join(",");
        const nextIds = next.map((n) => n.id).join(",");
        if (prevIds !== nextIds) return next;
        for (let attempt = 0; attempt < 5; attempt += 1) {
          const again = pickRandom(items, 3);
          const againIds = again.map((n) => n.id).join(",");
          if (againIds !== prevIds) return again;
        }
        return next;
      });
    };

    choose();
    const intervalId = window.setInterval(choose, 8000);
    return () => window.clearInterval(intervalId);
  }, [digest?.id, digest?.items]);

  return (
    <div className="flex min-h-screen flex-col bg-background selection:bg-primary/10 selection:text-primary">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-16 md:pt-24 lg:pt-32 pb-16">
          <div className="container mx-auto px-6 max-w-screen-lg text-center">
            <div className="inline-flex items-center rounded-full border border-border bg-muted/50 px-3 py-1 text-sm font-medium text-muted-foreground backdrop-blur-sm mb-8 animate-fade-in">
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
              Briefly v1.0 is now live
            </div>
            <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground sm:text-6xl md:text-7xl lg:text-8xl mb-6 text-balance animate-slide-up">
              Know what matters.
              <br className="hidden md:block" /> In 20 seconds.
            </h1>
            <p
              className="mx-auto max-w-2xl text-lg text-muted-foreground sm:text-xl leading-relaxed mb-10 text-balance animate-slide-up"
              style={{ animationDelay: "0.1s" }}
            >
              Your personalized daily intelligence digest. No clutter, no
              noise—just the 5 most important updates tailored to you.
            </p>
            <div
              className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up"
              style={{ animationDelay: "0.2s" }}
            >
              <Button
                asChild
                size="lg"
                className="h-12 px-8 rounded-full text-base shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 w-full sm:w-auto"
              >
                <Link href="/signup">Start Your Briefing</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-12 px-8 rounded-full text-base bg-transparent border-border hover:bg-muted/50 w-full sm:w-auto"
              >
                <Link href="/login">Log In</Link>
              </Button>
            </div>
          </div>

          {/* Abstract Background Element */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[100px] opacity-50 pointer-events-none" />
        </section>

        {/* Example Brief Section - "The Product" */}
        <section className="container mx-auto px-6 max-w-screen-md pb-24">
          <div
            className="relative rounded-2xl border border-border/50 bg-white/50 backdrop-blur-xl shadow-2xl shadow-primary/5 p-1 md:p-2 animate-slide-up"
            style={{ animationDelay: "0.3s" }}
          >
            <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
              <div className="border-b border-border/50 px-6 py-4 flex items-center justify-between bg-muted/30">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-400/80" />
                  <div className="h-3 w-3 rounded-full bg-yellow-400/80" />
                  <div className="h-3 w-3 rounded-full bg-green-400/80" />
                </div>
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
                  Daily Briefing
                </div>
              </div>
              <div className="p-6 md:p-8 space-y-6">
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">
                    {dateLabel || "Today"}
                  </div>
                  <h3 className="font-heading text-2xl md:text-3xl font-bold">
                    Know what matters today.
                  </h3>
                </div>
                <div className="space-y-6">
                  {latestDigestQuery.isPending ? (
                    <>
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div
                          key={i}
                          className="flex flex-col gap-2 border-b border-border/50 pb-6 last:border-0 last:pb-0"
                        >
                          <div className="flex items-center justify-between">
                            <Skeleton className="h-5 w-28 rounded-md" />
                            <Skeleton className="h-4 w-16" />
                          </div>
                          <Skeleton className="h-6 w-full" />
                        </div>
                      ))}
                    </>
                  ) : (
                    (previewItems.length
                      ? previewItems
                      : (digest?.items ?? []).slice(0, 3)
                    ).map((item) => {
                      const category = item.news?.category?.name ?? "General";
                      const source = item.news?.source?.name ?? "Source";
                      const title = item.news?.title ?? "Untitled";

                      return (
                        <div
                          key={item.id}
                          className="group flex flex-col gap-2 border-b border-border/50 pb-6 last:border-0 last:pb-0"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-primary/80 uppercase tracking-widest bg-secondary px-2 py-1 rounded-md">
                              {category}
                            </span>
                            <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                              {source}
                            </span>
                          </div>
                          <p className="font-medium text-lg leading-snug group-hover:text-primary/80 transition-colors">
                            {title}
                          </p>
                        </div>
                      );
                    })
                  )}
                </div>
                <div className="pt-2">
                  <Button
                    variant="ghost"
                    className="w-full text-muted-foreground hover:text-primary hover:bg-muted/50"
                    asChild
                  >
                    <Link href="/signup">
                      Read full brief <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features / How it works */}
        <section className="bg-muted/30 py-24 border-t border-border/50">
          <div className="container mx-auto px-6 max-w-screen-lg">
            <div className="text-center mb-16">
              <h2 className="font-heading text-3xl font-bold md:text-4xl lg:text-5xl mb-4">
                How it works
              </h2>
              <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                We&apos;ve stripped away the noise to give you exactly what you
                need to start your day informed.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  icon: CheckCircle2,
                  title: "Curate",
                  desc: "Select only the topics that impact your work and life.",
                },
                {
                  icon: Zap,
                  title: "Filter",
                  desc: "Our system processes thousands of updates to find the signal.",
                },
                {
                  icon: Clock,
                  title: "Brief",
                  desc: "Get a 20-second summary delivered to your dashboard daily.",
                },
              ].map((feature, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center text-center p-6 rounded-2xl bg-background border border-border/50 shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary text-primary">
                    <feature.icon className="h-7 w-7" />
                  </div>
                  <h3 className="font-heading text-xl font-bold mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24">
          <div className="container mx-auto px-6 max-w-screen-md text-center">
            <h2 className="font-heading text-3xl font-bold md:text-5xl mb-6">
              Ready for a quieter morning?
            </h2>
            <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
              Join thousands of professionals who start their day with Briefly.
            </p>
            <Button
              asChild
              size="lg"
              className="h-14 px-10 rounded-full text-lg shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all duration-300"
            >
              <Link href="/signup">Get Started for Free</Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/50 bg-background py-12">
        <div className="container mx-auto px-6 max-w-screen-lg flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 font-heading font-bold text-xl tracking-tight">
            Briefly.
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Briefly. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="/privacy" className="hover:text-primary">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-primary">
              Terms
            </Link>
            <Link href="#" className="hover:text-primary">
              Twitter
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
