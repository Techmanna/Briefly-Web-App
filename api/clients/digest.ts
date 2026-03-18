import { endpoints } from "../endpoints";
import { apiFetch } from "./http";

export type DigestSource = {
  id: string;
  name: string;
  url: string;
};

export type DigestCategory = {
  id: string;
  name: string;
  slug: string;
  description: string;
};

export type DigestNews = {
  id: string;
  title: string;
  content?: string;
  summary?: string;
  url?: string;
  published_at?: string;
  source?: DigestSource;
  category?: DigestCategory;
};

export type DigestItem = {
  id: string;
  digest_id: string;
  news_id: string;
  rank: number;
  digest?: {
    id: string;
    date: string;
    created_at: string;
  };
  news: DigestNews;
};

export type Digest = {
  id: string;
  date: string;
  created_at: string;
  items: DigestItem[];
};

export type PaginatedDigestResponse = {
  items: Digest[];
  meta: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
};

export function getLatestDigest() {
  return apiFetch<Digest>(endpoints.digest.latest, {
    method: "GET",
    auth: true,
  });
}

export function listDigests(page: number = 1, limit: number = 10) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  return apiFetch<PaginatedDigestResponse>(
    `${endpoints.digest.list}?${params.toString()}`,
    {
      method: "GET",
      auth: true,
    },
  );
}

export function getDigestByDate(date: string) {
  return apiFetch<Digest>(endpoints.digest.byDate(date), { method: "GET", auth: true });
}

