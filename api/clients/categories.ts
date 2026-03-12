import { endpoints } from "../endpoints";
import { apiFetch } from "./http";

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  created_at: string;
  updated_at: string;
};

export function listCategories() {
  return apiFetch<Category[]>(endpoints.categories.list, { method: "GET" });
}

