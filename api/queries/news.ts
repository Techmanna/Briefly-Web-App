import { useInfiniteQuery } from "@tanstack/react-query";
import * as newsClient from "@/api/clients/news";
import { ApiError } from "@/api/clients/errors";

export function useInfinitePublicNewsQuery(input?: {
  minSignal?: number;
  take?: number;
  initialItems?: newsClient.PublicNewsItem[];
}) {
  const minSignal = input?.minSignal ?? 0;
  const take = input?.take ?? 20;
  const initialItems = input?.initialItems ?? [];

  return useInfiniteQuery({
    queryKey: ["news", "public", { minSignal, take }],
    initialPageParam: 0,
    initialData:
      initialItems.length > 0
        ? { pages: [initialItems], pageParams: [0] }
        : undefined,
    queryFn: ({ pageParam }) =>
      newsClient.listPublicNews({ minSignal, take, skip: pageParam }),
    getNextPageParam: (lastPage, pages) => {
      if (!Array.isArray(lastPage)) return undefined;
      if (lastPage.length < take) return undefined;
      return pages.length * take;
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 60_000,
    retry: (failureCount, error) => {
      if (error instanceof ApiError && error.status === 429) return false;
      return failureCount < 2;
    },
  });
}
