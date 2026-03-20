import type { Metadata } from "next";
import { Inter, DM_Sans, Geist } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const siteUrl = new URL("https://briefly.ng");

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: siteUrl,
  applicationName: "Briefly",
  title: {
    default: "Briefly",
    template: "%s · Briefly",
  },
  description:
    "Get a personalized daily briefing with the most important updates in economy, tech, opportunities, and more.",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Briefly",
    title: "Briefly",
    description:
      "Get a personalized daily briefing with the most important updates in economy, tech, opportunities, and more.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Briefly",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Briefly",
    description:
      "Get a personalized daily briefing with the most important updates in economy, tech, opportunities, and more.",
    images: ["/twitter-image"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = JSON.stringify([
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Briefly",
      url: "https://briefly.ng",
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Briefly",
      url: "https://briefly.ng",
    },
  ]);

  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd }}
        />
      </head>
      <body
        className={`${inter.variable} ${dmSans.variable} antialiased`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
