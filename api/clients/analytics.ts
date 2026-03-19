import { endpoints } from "../endpoints";
import { apiFetch } from "./http";

export type AnalyticsOverview = {
  total_articles: {
    today: number;
    last_7_d: number;
    last_30_d: number;
  };
  ai_stats: {
    total_requests: number;
    total_cost: number;
    avg_cost_per_article: number;
    success_rate: number | null;
  };
  anomalies: {
    cost_spike: boolean;
    failure_spike: boolean;
  };
};

export type AiUsageStats = {
  total_requests: number;
  total_tokens: {
    input: number;
    output: number;
  };
  total_cost: number;
  avg_latency: number;
  failure_rate: number;
};

export type CostBreakdown = {
  cost_by_day: { date: string; cost: number }[];
  cost_by_feature: Record<string, number>;
  cost_by_source: Record<string, number>;
  cost_by_category: Record<string, number>;
};

export type IngestionAnalytics = {
  metrics: {
    fetched: number;
    processed: number;
    skipped: number;
    failed: number;
  };
  relevance_impact: {
    total_evaluated: number;
    passed: number;
    rejected: number;
  };
  top_sources: { name: string; count: number }[];
  failure_logs: unknown[];
};

export function getAnalyticsOverview() {
  return apiFetch<AnalyticsOverview>(endpoints.admin.analytics.overview, {
    method: "GET",
    auth: true,
  });
}

export function getAiUsage(params?: {
  startDate?: string;
  endDate?: string;
  feature?: string;
  model?: string;
}) {
  const query = params
    ? new URLSearchParams(params as Record<string, string>).toString()
    : "";
  return apiFetch<AiUsageStats>(
    `${endpoints.admin.analytics.aiUsage}${query ? `?${query}` : ""}`,
    {
      method: "GET",
      auth: true,
    },
  );
}

export function getCostBreakdown() {
  return apiFetch<CostBreakdown>(endpoints.admin.analytics.costBreakdown, {
    method: "GET",
    auth: true,
  });
}

export function getIngestionAnalytics() {
  return apiFetch<IngestionAnalytics>(endpoints.admin.analytics.ingestion, {
    method: "GET",
    auth: true,
  });
}
