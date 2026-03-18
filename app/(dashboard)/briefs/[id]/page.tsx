import { BriefClient } from "./brief-client";

// Static export requires generateStaticParams for dynamic routes
export async function generateStaticParams() {
  return [{ id: "latest" }];
}

export default function BriefPage() {
  return <BriefClient />;
}
