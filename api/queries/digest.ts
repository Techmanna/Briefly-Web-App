import { useQuery } from "@tanstack/react-query";
import * as digestClient from "@/api/clients/digest";

export function useLatestDigestQuery() {
  return useQuery({
    queryKey: ["digest", "latest"],
    queryFn: () => digestClient.getLatestDigest(),
  });
}

export function useDigestByDateQuery(date: string) {
  return useQuery({
    queryKey: ["digest", "byDate", date],
    queryFn: () => digestClient.getDigestByDate(date),
    enabled: Boolean(date),
  });
}

export function useListDigestsQuery(page: number = 1, limit: number = 10) {
  return useQuery({
    queryKey: ["digest", "list", page, limit],
    queryFn: () => digestClient.listDigests(page, limit),
  });
}

