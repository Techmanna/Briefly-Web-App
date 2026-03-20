"use client";

import { useIngestionAnalyticsQuery } from "@/api/queries/analytics";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Network,
  Search,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Database,
  BarChart,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function IngestionAnalyticsPage() {
  const { data: ingestion, isLoading } = useIngestionAnalyticsQuery();

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="space-y-2">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-5 w-80" />
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-3xl" />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <Skeleton className="h-96 w-full rounded-3xl lg:col-span-2" />
          <Skeleton className="h-96 w-full rounded-3xl" />
        </div>
      </div>
    );
  }

  const metrics = [
    {
      title: "Total Fetched",
      value: ingestion?.metrics.fetched.toLocaleString(),
      icon: Search,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Processed",
      value: ingestion?.metrics.processed.toLocaleString(),
      icon: CheckCircle2,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      title: "Skipped",
      value: ingestion?.metrics.skipped.toLocaleString(),
      icon: AlertCircle,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      title: "Failed",
      value: ingestion?.metrics.failed.toLocaleString(),
      icon: XCircle,
      color: "text-destructive",
      bg: "bg-destructive/10",
    },
  ];

  return (
    <div className="space-y-10">
      <div className="space-y-2">
        <h1 className="text-4xl font-heading font-bold tracking-tight">
          Ingestion Pipeline
        </h1>
        <p className="text-muted-foreground text-lg">
          Analyze data ingestion health and performance metrics.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <Card
            key={metric.title}
            className="border-border shadow-none rounded-lg"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                {metric.title}
              </CardTitle>
              <div className={cn("p-2 rounded-xl", metric.bg)}>
                <metric.icon className={cn("h-4 w-4", metric.color)} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-heading font-bold">
                {metric.value}
              </div>
              <p className="text-[10px] text-muted-foreground mt-1 uppercase font-bold tracking-tighter">
                Last 24 hours
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Source Impact */}
        <Card className="lg:col-span-2 border-border shadow-none rounded-lg overflow-hidden">
          <CardHeader>
            <CardTitle className="font-heading text-xl flex items-center gap-2">
              <Network className="h-5 w-5 text-muted-foreground" />
              Top News Sources
            </CardTitle>
            <CardDescription>
              Volume of news articles ingested by source.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4 space-y-6">
            {ingestion?.top_sources.map((source, i) => {
              const maxCount = Math.max(
                ...ingestion.top_sources.map((s) => s.count),
                1,
              );
              const percentage = (source.count / maxCount) * 100;
              return (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-foreground/80 font-bold">
                      {source.name}
                    </span>
                    <span className="text-muted-foreground font-bold">
                      {source.count.toLocaleString()} items
                    </span>
                  </div>
                  <div className="h-2 w-full bg-secondary/50 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary/60 transition-all duration-1000"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
            {(!ingestion?.top_sources ||
              ingestion.top_sources.length === 0) && (
              <div className="h-40 flex items-center justify-center text-muted-foreground italic text-sm">
                No source data available yet.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Relevance Filtering */}
        <Card className="border-border shadow-none rounded-lg">
          <CardHeader>
            <CardTitle className="font-heading text-xl flex items-center gap-2">
              <BarChart className="h-5 w-5 text-muted-foreground" />
              Relevance Impact
            </CardTitle>
            <CardDescription>Filtering efficiency metrics.</CardDescription>
          </CardHeader>
          <CardContent className="pt-4 space-y-8">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-secondary/50 rounded-2xl">
                  <Database className="h-5 w-5 text-foreground/70" />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Processed Articles
                  </div>
                  <div className="text-2xl font-heading font-bold">
                    {ingestion?.metrics.processed}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-amber-50 rounded-2xl">
                  <XCircle className="h-5 w-5 text-amber-600" />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Filtered (Low Relevance)
                  </div>
                  <div className="text-2xl font-heading font-bold">
                    {ingestion?.metrics.skipped}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-secondary/30 border border-border/40">
              <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-3">
                Pipeline Flow
              </div>
              <div className="flex items-center justify-between">
                <div className="text-center">
                  <div className="text-xs font-bold text-foreground/70">
                    Fetch
                  </div>
                  <div className="text-sm font-medium">
                    {ingestion?.metrics.fetched}
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground opacity-50" />
                <div className="text-center">
                  <div className="text-xs font-bold text-foreground/70">
                    Filter
                  </div>
                  <div className="text-sm font-medium">
                    {ingestion?.metrics.processed}
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground opacity-50" />
                <div className="text-center">
                  <div className="text-xs font-bold text-foreground/70">
                    Store
                  </div>
                  <div className="text-sm font-medium">
                    {ingestion?.metrics.processed}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
