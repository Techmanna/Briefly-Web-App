import { endpoints } from "../endpoints";
import { apiFetch } from "./http";

export type Interest = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  rank: number;
  category_id?: string | null;
  created_at: string;
  updated_at: string;
};

export function listInterests() {
  return apiFetch<Interest[]>(endpoints.interests.list, { method: "GET" });
}

