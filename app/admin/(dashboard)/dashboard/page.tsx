"use client";

import { useAdminStatsQuery } from "@/api/queries/admin";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,
  Newspaper,
  Layers,
  Send,
  Activity,
  ArrowUpRight,
  Database,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminDashboardPage() {
  const { data: stats, isLoading, isError } = useAdminStatsQuery();

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
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-96 w-full rounded-3xl" />
          <Skeleton className="h-96 w-full rounded-3xl" />
        </div>
      </div>
    );
  }

  if (isError || !stats) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <Activity className="h-12 w-12 text-destructive/50" />
        <h2 className="text-2xl font-heading font-bold">
          Failed to load stats
        </h2>
        <p className="text-muted-foreground">
          Please check your connection and try again.
        </p>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Users",
      value: stats.total_users.toLocaleString(),
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
      description: "Registered subscribers",
    },
    {
      title: "Active (24h)",
      value: stats.active_users_last_24_h.toLocaleString(),
      icon: Activity,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      description: "Recent engagement",
    },
    {
      title: "News Items",
      value: stats.total_news_items.toLocaleString(),
      icon: Newspaper,
      color: "text-orange-600",
      bg: "bg-orange-50",
      description: "Total indexed stories",
    },
    {
      title: "Total Deliveries",
      value: stats.total_deliveries.toLocaleString(),
      icon: Send,
      color: "text-purple-600",
      bg: "bg-purple-50",
      description: "Across all channels",
    },
  ];

  return (
    <div className="space-y-10">
      <div className="space-y-2">
        <h1 className="text-4xl font-heading font-bold tracking-tight">
          System Overview
        </h1>
        <p className="text-muted-foreground text-lg">
          Real-time platform metrics and delivery performance.
        </p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <Card
            key={card.title}
            className="border-border/60 shadow-sm rounded-3xl overflow-hidden hover:shadow-md transition-shadow"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                {card.title}
              </CardTitle>
              <div className={cn("p-2 rounded-xl", card.bg)}>
                <card.icon className={cn("h-4 w-4", card.color)} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-heading font-bold">
                {card.value}
              </div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                {card.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Delivery Breakdown */}
        <Card className="lg:col-span-2 border-border/60 shadow-sm rounded-3xl">
          <CardHeader>
            <CardTitle className="font-heading text-xl">
              Delivery Channels
            </CardTitle>
            <CardDescription>
              Breakdown of notifications sent across different platforms.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-6">
              {Object.entries(stats.deliveries_by_channel).map(
                ([channel, count]) => {
                  const percentage =
                    Math.round((count / stats.total_deliveries) * 100) || 0;
                  return (
                    <div key={channel} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-bold tracking-wide">
                          {channel}
                        </span>
                        <span className="text-muted-foreground font-medium">
                          {count.toLocaleString()} ({percentage}%)
                        </span>
                      </div>
                      <div className="h-3 w-full bg-secondary/50 rounded-full overflow-hidden">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all duration-1000",
                            channel === "EMAIL"
                              ? "bg-blue-500"
                              : channel === "WHATSAPP"
                                ? "bg-emerald-500"
                                : channel === "PUSH"
                                  ? "bg-orange-500"
                                  : "bg-purple-500",
                          )}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                },
              )}
            </div>
          </CardContent>
        </Card>

        {/* System Health */}
        <Card className="border-border/60 shadow-sm rounded-3xl">
          <CardHeader>
            <CardTitle className="font-heading text-xl">
              Database Summary
            </CardTitle>
            <CardDescription>Object counts in storage.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-secondary/50 rounded-2xl">
                <Layers className="h-5 w-5 text-foreground/70" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold">Categories</div>
                <div className="text-2xl font-heading font-bold">
                  {stats.total_categories}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-secondary/50 rounded-2xl">
                <Database className="h-5 w-5 text-foreground/70" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold">Total Digests</div>
                <div className="text-2xl font-heading font-bold">
                  {stats.total_digests}
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full h-12 rounded-xl mt-4 border-border/60 group"
            >
              System Logs
              <ArrowUpRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
