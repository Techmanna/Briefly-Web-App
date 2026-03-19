"use client";

import { useAnalyticsOverviewQuery, useAiUsageQuery, useCostBreakdownQuery } from "@/api/queries/analytics";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  BarChart3, 
  DollarSign, 
  Cpu, 
  Zap, 
  AlertTriangle,
  TrendingUp,
  History,
  Activity
} from "lucide-react";

export default function AiAnalyticsPage() {
  const { data: overview, isLoading: overviewLoading } = useAnalyticsOverviewQuery();
  const { data: aiUsage, isLoading: usageLoading } = useAiUsageQuery();
  const { data: costBreakdown, isLoading: costLoading } = useCostBreakdownQuery();

  const isLoading = overviewLoading || usageLoading || costLoading;

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="space-y-2">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-5 w-96" />
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-3xl" />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-[400px] w-full rounded-3xl" />
          <Skeleton className="h-[400px] w-full rounded-3xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-heading font-bold tracking-tight">AI Analytics</h1>
        <p className="text-muted-foreground text-lg">Monitor AI costs, token usage, and model performance.</p>
      </div>

      {overview?.anomalies && (overview.anomalies.cost_spike || overview.anomalies.failure_spike) && (
        <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-center gap-3 text-destructive">
          <AlertTriangle className="h-5 w-5 flex-shrink-0" />
          <div className="text-sm font-medium">
            {overview.anomalies.cost_spike && "Anomalous cost spike detected today. "}
            {overview.anomalies.failure_spike && "Higher than normal AI failure rate detected."}
          </div>
        </div>
      )}

      {/* High-level stats */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/60 shadow-sm rounded-3xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Total AI Cost</CardTitle>
            <div className="p-2 bg-primary/10 rounded-xl">
              <DollarSign className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-heading font-bold">${overview?.ai_stats.total_cost.toFixed(2)}</div>
            <p className="text-[10px] text-muted-foreground mt-1 uppercase font-bold tracking-tighter">Lifetime spend</p>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm rounded-3xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Avg Cost / Article</CardTitle>
            <div className="p-2 bg-blue-50 rounded-xl">
              <Zap className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-heading font-bold">${overview?.ai_stats.avg_cost_per_article.toFixed(4)}</div>
            <p className="text-[10px] text-muted-foreground mt-1 uppercase font-bold tracking-tighter">Efficiency metric</p>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm rounded-3xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">AI Success Rate</CardTitle>
            <div className="p-2 bg-emerald-50 rounded-xl">
              <TrendingUp className="h-4 w-4 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-heading font-bold">{overview?.ai_stats.success_rate}%</div>
            <p className="text-[10px] text-muted-foreground mt-1 uppercase font-bold tracking-tighter">Reliability</p>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm rounded-3xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Total Requests</CardTitle>
            <div className="p-2 bg-purple-50 rounded-xl">
              <Activity className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-heading font-bold">{aiUsage?.total_requests.toLocaleString()}</div>
            <p className="text-[10px] text-muted-foreground mt-1 uppercase font-bold tracking-tighter">Request volume</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Token Usage */}
        <Card className="border-border/60 shadow-sm rounded-3xl overflow-hidden">
          <CardHeader>
            <CardTitle className="font-heading text-xl flex items-center gap-2">
              <Cpu className="h-5 w-5 text-muted-foreground" />
              Token Consumption
            </CardTitle>
            <CardDescription>Input vs Output token breakdown.</CardDescription>
          </CardHeader>
          <CardContent className="pt-4 space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span>Input Tokens</span>
                <span>{aiUsage?.total_tokens.input.toLocaleString()}</span>
              </div>
              <div className="h-4 w-full bg-secondary/50 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 transition-all duration-1000"
                  style={{ width: `${(aiUsage?.total_tokens.input || 0) / ((aiUsage?.total_tokens.input || 0) + (aiUsage?.total_tokens.output || 1)) * 100}%` }}
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span>Output Tokens</span>
                <span>{aiUsage?.total_tokens.output.toLocaleString()}</span>
              </div>
              <div className="h-4 w-full bg-secondary/50 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-purple-500 transition-all duration-1000"
                  style={{ width: `${(aiUsage?.total_tokens.output || 0) / ((aiUsage?.total_tokens.input || 0) + (aiUsage?.total_tokens.output || 1)) * 100}%` }}
                />
              </div>
            </div>
            <div className="pt-4 border-t border-border/60 flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Avg Latency</span>
              <span className="text-lg font-bold">{aiUsage?.avg_latency}ms</span>
            </div>
          </CardContent>
        </Card>

        {/* Cost by Feature */}
        <Card className="border-border/60 shadow-sm rounded-3xl">
          <CardHeader>
            <CardTitle className="font-heading text-xl flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-muted-foreground" />
              Cost by Feature
            </CardTitle>
            <CardDescription>Distribution of spend across AI capabilities.</CardDescription>
          </CardHeader>
          <CardContent className="pt-4 space-y-6">
            {costBreakdown?.cost_by_feature && Object.entries(costBreakdown.cost_by_feature).map(([feature, cost]) => (
              <div key={feature} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-secondary/50 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                    {feature}
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">{feature === "SUMMARIZE" ? "Content Summarization" : "Title Generation"}</span>
                </div>
                <span className="font-bold">${cost.toFixed(2)}</span>
              </div>
            ))}
            {!costBreakdown?.cost_by_feature && (
              <div className="h-40 flex items-center justify-center text-muted-foreground italic text-sm">
                No feature data available.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Cost Trend */}
      <Card className="border-border/60 shadow-sm rounded-3xl">
        <CardHeader>
          <CardTitle className="font-heading text-xl flex items-center gap-2">
            <History className="h-5 w-5 text-muted-foreground" />
            Cost Trend (Last 7 Days)
          </CardTitle>
          <CardDescription>Daily AI spend fluctuation.</CardDescription>
        </CardHeader>
        <CardContent className="h-64 flex items-end gap-2 pt-6">
          {costBreakdown?.cost_by_day.map((day, i) => {
            const maxCost = Math.max(...costBreakdown.cost_by_day.map(d => d.cost), 1);
            const height = (day.cost / maxCost) * 100;
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                <div 
                  className="w-full bg-primary/20 hover:bg-primary transition-colors rounded-t-lg relative"
                  style={{ height: `${height}%` }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-foreground text-background text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap font-bold">
                    ${day.cost.toFixed(2)}
                  </div>
                </div>
                <span className="text-[10px] font-bold text-muted-foreground truncate w-full text-center">
                  {new Date(day.date).toLocaleDateString(undefined, { weekday: 'short' })}
                </span>
              </div>
            );
          })}
          {(!costBreakdown?.cost_by_day || costBreakdown.cost_by_day.length === 0) && (
             <div className="w-full h-full flex items-center justify-center text-muted-foreground italic text-sm">
               No historical data available yet.
             </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
