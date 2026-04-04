import { User } from "./users";
import { endpoints } from "../endpoints";
import { apiFetch } from "./http";

export type AdminUser = {
  id: string;
  email: string;
  name: string;
  role: "admin" | "super_admin";
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
};

export type AdminLoginResponse = {
  access_token: string;
  user: AdminUser;
};

export type SystemStats = {
  total_users: number;
  total_categories: number;
  total_news_items: number;
  total_digests: number;
  total_deliveries: number;
  active_users_last_24_h: number;
  deliveries_by_channel: Record<string, number>;
};

export type IngestionLog = {
  id: string;
  action: string;
  status: string;
  description: string;
  created_at: string;
};

export type DigestLog = {
  id: string;
  date: string;
  recipient_count: number;
  status: string;
};

export type AdminInterest = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  rank: number;
  is_active: boolean;
  category_id?: string | null;
  created_at: string;
  updated_at: string;
};

export function adminLogin(input: { email: string; password: string }) {
  return apiFetch<AdminLoginResponse>(endpoints.admin.auth.login, {
    method: "POST",
    body: input,
  });
}

export function adminForgotPassword(email: string) {
  return apiFetch<{ message: string }>(endpoints.admin.auth.forgotPassword, {
    method: "POST",
    body: { email },
  });
}

export function updateAdminProfile(input: {
  name?: string;
  email?: string;
  password?: string;
}) {
  return apiFetch<AdminUser>(endpoints.admin.auth.profile, {
    method: "PATCH",
    body: input,
    auth: true,
  });
}

export function getSystemStats() {
  return apiFetch<SystemStats>(endpoints.admin.stats, {
    method: "GET",
    auth: true,
  });
}

export function getIngestionLogs(limit = 50) {
  return apiFetch<IngestionLog[]>(
    `${endpoints.admin.logs.ingestion}?limit=${limit}`,
    {
      method: "GET",
      auth: true,
    },
  );
}

export function getDigestLogs(limit = 50) {
  return apiFetch<DigestLog[]>(
    `${endpoints.admin.logs.digest}?limit=${limit}`,
    {
      method: "GET",
      auth: true,
    },
  );
}

export type AdminUsersResponse = {
  items: (User & { _count: { subscriptions: number; digests: number } })[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export function getAdminUsers(page = 1, limit = 20, search?: string) {
  const query: Record<string, string> = {
    page: page.toString(),
    limit: limit.toString(),
  };
  if (search) query.search = search;
  const params = new URLSearchParams(query);
  return apiFetch<AdminUsersResponse>(
    `${endpoints.admin.users}?${params.toString()}`,
    {
      method: "GET",
      auth: true,
    },
  );
}

export function updateAdminUser(id: string, data: Partial<User>) {
  return apiFetch<User>(`${endpoints.admin.users}/${id}`, {
    method: "PATCH",
    body: data,
    auth: true,
  });
}

export function deleteAdminUser(id: string) {
  return apiFetch<{ message: string }>(`${endpoints.admin.users}/${id}`, {
    method: "DELETE",
    auth: true,
  });
}

export function listAdminInterests() {
  return apiFetch<AdminInterest[]>(endpoints.admin.interests.list, {
    method: "GET",
    auth: true,
  });
}

export function updateAdminInterest(
  id: string,
  input: { rank?: number; isActive?: boolean },
) {
  return apiFetch<AdminInterest>(endpoints.admin.interests.byId(id), {
    method: "PATCH",
    auth: true,
    body: input,
  });
}
