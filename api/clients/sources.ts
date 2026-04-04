import { endpoints } from "../endpoints";
import { apiFetch } from "./http";

export type NewsSource = {
  id: string;
  name: string;
  url: string;
  rss_url?: string;
  country?: string | null;
  region?: string | null;
  credibility_score: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type CreateSourceInput = {
  name: string;
  url: string;
  rssUrl?: string;
  country?: string;
  region?: string;
  credibilityScore?: number;
  isActive?: boolean;
};

export type UpdateSourceInput = Partial<CreateSourceInput>;

export type BulkCreateSourcesInput = {
  sources: CreateSourceInput[];
  skipExisting?: boolean;
  dryRun?: boolean;
  defaultCountry?: string;
  defaultRegion?: string;
};

export type BulkCreateSourcesResult = {
  input: number;
  normalized: number;
  existing: number;
  created?: number;
  toCreate?: number;
  preview?: Array<Record<string, unknown>>;
};

export function getSources() {
  return apiFetch<NewsSource[]>(endpoints.admin.sources.list, {
    method: "GET",
    auth: true,
  });
}

export function getSource(id: string) {
  return apiFetch<NewsSource>(endpoints.admin.sources.byId(id), {
    method: "GET",
    auth: true,
  });
}

export function createSource(input: CreateSourceInput) {
  return apiFetch<NewsSource>(endpoints.admin.sources.create, {
    method: "POST",
    body: input,
    auth: true,
  });
}

export function updateSource(id: string, input: UpdateSourceInput) {
  return apiFetch<NewsSource>(endpoints.admin.sources.byId(id), {
    method: "PATCH",
    body: input,
    auth: true,
  });
}

export function deleteSource(id: string) {
  return apiFetch<NewsSource>(endpoints.admin.sources.byId(id), {
    method: "DELETE",
    auth: true,
  });
}

export function bulkCreateSources(input: BulkCreateSourcesInput) {
  return apiFetch<BulkCreateSourcesResult>(endpoints.admin.sources.bulk, {
    method: "POST",
    body: input,
    auth: true,
  });
}
