import { useQuery } from "@tanstack/react-query";
import * as analyticsClient from "@/api/clients/analytics";

export function useAnalyticsOverviewQuery() {
  return useQuery({
    queryKey: ["admin", "analytics", "overview"],
    queryFn: () => analyticsClient.getAnalyticsOverview(),
  });
}

export function useAiUsageQuery(params?: Parameters<typeof analyticsClient.getAiUsage>[0]) {
  return useQuery({
    queryKey: ["admin", "analytics", "ai-usage", params],
    queryFn: () => analyticsClient.getAiUsage(params),
  });
}

export function useCostBreakdownQuery() {
  return useQuery({
    queryKey: ["admin", "analytics", "cost-breakdown"],
    queryFn: () => analyticsClient.getCostBreakdown(),
  });
}

export function useIngestionAnalyticsQuery() {
  return useQuery({
    queryKey: ["admin", "analytics", "ingestion"],
    queryFn: () => analyticsClient.getIngestionAnalytics(),
  });
}
