import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/news", "/news/"],
        disallow: [
          "/briefs",
          "/briefs/",
          "/login",
          "/signup",
          "/forgot-password",
          "/reset-password",
          "/set-password",
          "/verify-email",
          "/whatsapp",
          "/telegram",
          "/settings",
          "/onboarding",
        ],
      },
    ],
    sitemap: "https://briefly.ng/sitemap.xml",
    host: "https://briefly.ng",
  };
}
