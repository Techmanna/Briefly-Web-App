import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms",
  description: "Terms and Conditions for Briefly.",
  alternates: { canonical: "/terms" },
};

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xl font-heading font-bold tracking-tight">
      {children}
    </h2>
  );
}

function Paragraph({ children }: { children: React.ReactNode }) {
  return <p className="text-muted-foreground leading-relaxed">{children}</p>;
}

export default function TermsPage() {
  return (
    <main className="container mx-auto max-w-screen-md px-6 py-16">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild className="-ml-2">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Link>
        </Button>
      </div>
      <header className="space-y-3">
        <h1 className="text-3xl md:text-4xl font-heading font-bold tracking-tight">
          Terms and Conditions
        </h1>
        <p className="text-sm text-muted-foreground">Briefly.</p>
      </header>

      <div className="mt-10 space-y-10">
        <section className="space-y-3">
          <SectionTitle>Introduction</SectionTitle>
          <Paragraph>
            Welcome to Briefly. These Terms and Conditions govern your access to
            and use of the Briefly platform and services. By accessing or using
            Briefly, you agree to comply with these terms.
          </Paragraph>
          <Paragraph>
            If you do not agree with any part of these terms, you should
            discontinue use of the platform.
          </Paragraph>
        </section>

        <section className="space-y-3">
          <SectionTitle>Use of the Platform</SectionTitle>
          <Paragraph>
            Briefly provides informational content intended to help users stay
            informed about important developments. The content provided should
            not be interpreted as professional, financial, legal, or investment
            advice.
          </Paragraph>
          <Paragraph>
            Users agree to use the platform responsibly and not for any unlawful
            purposes.
          </Paragraph>
        </section>

        <section className="space-y-3">
          <SectionTitle>User Accounts</SectionTitle>
          <Paragraph>
            Some features of Briefly may require users to create an account or
            sign in through supported authentication services such as:
          </Paragraph>
          <ul className="list-disc pl-6 text-muted-foreground space-y-1">
            <li>Google</li>
            <li>Facebook</li>
            <li>Email authentication</li>
          </ul>
          <Paragraph>
            Users are responsible for maintaining the confidentiality of their
            account credentials and for all activities performed under their
            account.
          </Paragraph>
        </section>

        <section className="space-y-3">
          <SectionTitle>Content Sources</SectionTitle>
          <Paragraph>
            Briefly aggregates and summarizes information from publicly
            available sources and trusted publishers. While we aim to ensure
            accuracy and reliability, we do not guarantee that all content will
            always be complete, accurate, or up to date.
          </Paragraph>
        </section>

        <section className="space-y-3">
          <SectionTitle>Intellectual Property</SectionTitle>
          <Paragraph>
            All content, branding, logos, and platform designs associated with
            Briefly are the intellectual property of Briefly or its licensors
            and may not be copied, reproduced, or distributed without
            permission.
          </Paragraph>
        </section>

        <section className="space-y-3">
          <SectionTitle>Limitation of Liability</SectionTitle>
          <Paragraph>
            Briefly is provided on an “as-is” and “as-available” basis. We are
            not liable for any direct, indirect, incidental, or consequential
            damages resulting from the use of the platform or reliance on the
            information provided.
          </Paragraph>
        </section>

        <section className="space-y-3">
          <SectionTitle>Changes to the Service</SectionTitle>
          <Paragraph>
            Briefly reserves the right to modify, suspend, or discontinue any
            part of the service at any time without prior notice.
          </Paragraph>
        </section>

        <section className="space-y-3">
          <SectionTitle>Updates to Terms</SectionTitle>
          <Paragraph>
            These Terms and Conditions may be updated from time to time.
            Continued use of the platform after updates constitutes acceptance
            of the revised terms.
          </Paragraph>
        </section>
      </div>
    </main>
  );
}
