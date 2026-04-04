import { getApiBaseUrl } from "@/api/clients/config";

export type ApiResponseEnvelope<T> = {
  message: string;
  data: T;
  timestamp: string;
  status_code: number;
  pagination?: unknown;
};

export async function apiGet<T>(
  path: string,
  init?: Omit<RequestInit, "method">,
): Promise<T> {
  const base = getApiBaseUrl();
  const url = path.startsWith("http") ? path : `${base}${path}`;
  const res = await fetch(url, { ...init, method: "GET" });
  const json = (await res.json()) as unknown;

  if (!res.ok) {
    const msg =
      typeof json === "object" &&
      json !== null &&
      "message" in json &&
      typeof (json as { message?: unknown }).message === "string"
        ? String((json as { message: string }).message)
        : `Request failed (${res.status})`;
    throw new Error(msg);
  }

  if (
    typeof json === "object" &&
    json !== null &&
    "data" in json &&
    ("status_code" in json || "statusCode" in json)
  ) {
    return (json as ApiResponseEnvelope<T>).data;
  }

  return json as T;
}
