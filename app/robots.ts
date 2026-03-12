import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/briefs", "/briefs/"],
        disallow: [
          "/login",
          "/signup",
          "/forgot-password",
          "/reset-password",
          "/set-password",
          "/verify-email",
          "/whatsapp",
          "/telegram",
          "/dashboard",
          "/settings",
          "/onboarding",
        ],
      },
    ],
    sitemap: "https://briefly.ng/sitemap.xml",
    host: "https://briefly.ng",
  };
}

