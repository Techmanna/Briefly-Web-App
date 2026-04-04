import { getApiBaseUrl } from "./config";
import { ApiError } from "./errors";
import { clearSession, getAccessToken } from "./session";

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  auth?: boolean;
};

function unwrapData<T>(payload: unknown): T {
  if (!payload || typeof payload !== "object") return payload as T;
  if (Array.isArray(payload)) return payload as T;
  const record = payload as Record<string, unknown>;
  if ("data" in record && "status_code" in record) return record.data as T;
  return payload as T;
}

function getErrorMessage(payload: unknown, fallback: string) {
  if (!payload || typeof payload !== "object") return fallback;
  const record = payload as Record<string, unknown>;
  const message = record["message"];
  if (typeof message === "string" && message) return message;
  return fallback;
}

export async function apiFetch<T>(path: string, options: RequestOptions = {}) {
  const url = `${getApiBaseUrl()}${path.startsWith("/") ? path : `/${path}`}`;
  const headers = new Headers(options.headers);
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (options.auth) {
    const token = getAccessToken();
    if (token) headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(url, {
    ...options,
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });

  const contentType = res.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");
  const payload = isJson
    ? await res.json().catch(() => null)
    : await res.text();

  if (!res.ok) {
    const message = getErrorMessage(
      payload,
      res.statusText || "Request failed",
    );

    // Auto-redirect if unauthorized or forbidden
    if (typeof window !== "undefined") {
      const isAdminPath = window.location.pathname.startsWith("/admin");
      const isLoginRequest =
        path.includes("/auth/login") || path.includes("/admin/auth/login");

      if (!isLoginRequest) {
        if (
          (res.status === 403 &&
            message.toLowerCase().includes("admin access required")) ||
          (res.status === 401 && isAdminPath)
        ) {
          clearSession();
          window.dispatchEvent(new Event("briefly:auth:logout"));
          window.location.href = "/admin/login";
        } else if (res.status === 401 && !isAdminPath) {
          clearSession();
          window.dispatchEvent(new Event("briefly:auth:logout"));
          window.location.href = "/?auth=login";
        }
      }
    }

    throw new ApiError(message, res.status, payload);
  }

  return unwrapData<T>(payload);
}
