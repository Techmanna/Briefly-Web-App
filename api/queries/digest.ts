import { useQuery } from "@tanstack/react-query";
import * as digestClient from "@/api/clients/digest";

export function useLatestDigestQuery(lang?: digestClient.Language) {
  return useQuery({
    queryKey: ["digest", "latest", lang],
    queryFn: () => digestClient.getLatestDigest(lang),
  });
}

export function useDigestByDateQuery(date: string, lang?: digestClient.Language) {
  return useQuery({
    queryKey: ["digest", "byDate", date, lang],
    queryFn: () => digestClient.getDigestByDate(date, lang),
    enabled: Boolean(date),
  });
}

export function useListDigestsQuery(
  page: number = 1,
  limit: number = 10,
  lang?: digestClient.Language,
) {
  return useQuery({
    queryKey: ["digest", "list", page, limit, lang],
    queryFn: () => digestClient.listDigests(page, limit, lang),
  });
}
