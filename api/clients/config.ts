export function getApiBaseUrl() {
  const env = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (env && env.trim()) {
    const base = env.trim().replace(/\/+$/, "");
    return base.endsWith("/v1") ? base.slice(0, -3) : base;
  }
  return "https://briefly-api.techmanna.co";
}
