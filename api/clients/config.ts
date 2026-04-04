export function getApiBaseUrl() {
  const env = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (env && env.trim()) {
    const base = env.trim().replace(/\/+$/, "");
    return base.endsWith("/v1") ? base.slice(0, -3) : base;
  }
  return "https://briefly-api.techmanna.co";
}

export function getVAPIDkey() {
  const env = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

  return (
    env ||
    "BACv1jOp-TTx9O85VTKQHBWx7Xn4osWX66th77qpTNmuISCTx2enov6cPmwT6TIYv8kKTgbCMlcR_5AIg5dSFwI"
  );
}
