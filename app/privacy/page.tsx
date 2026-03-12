import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy",
  description: "Privacy Policy for Briefly.",
  alternates: { canonical: "/privacy" },
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

export default function PrivacyPage() {
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
          Privacy Policy
        </h1>
        <p className="text-sm text-muted-foreground">Briefly.</p>
      </header>

      <div className="mt-10 space-y-10">
        <section className="space-y-3">
          <SectionTitle>Introduction</SectionTitle>
          <Paragraph>
            Briefly values your privacy and is committed to protecting your
            personal information. This Privacy Policy explains how we collect,
            use, and safeguard your information when you use the Briefly
            platform.
          </Paragraph>
        </section>

        <section className="space-y-3">
          <SectionTitle>Information We Collect</SectionTitle>
          <Paragraph>
            We may collect the following types of information:
          </Paragraph>

          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-semibold">Account Information</h3>
              <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                <li>Name</li>
                <li>Email address</li>
                <li>Authentication provider information</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">Usage Data</h3>
              <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                <li>Platform interaction data</li>
                <li>Device information</li>
                <li>Log data</li>
                <li>Preferences and category subscriptions</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">Communication Data</h3>
              <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                <li>
                  Information required to deliver notifications through services
                  such as email or messaging platforms.
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <SectionTitle>How We Use Information</SectionTitle>
          <Paragraph>Your information may be used to:</Paragraph>
          <ul className="list-disc pl-6 text-muted-foreground space-y-1">
            <li>Deliver daily briefings</li>
            <li>Personalize content based on your interests</li>
            <li>Improve the performance and relevance of the platform</li>
            <li>Communicate important updates related to the service</li>
            <li>Monitor system performance and security</li>
          </ul>
        </section>

        <section className="space-y-3">
          <SectionTitle>Data Protection</SectionTitle>
          <Paragraph>
            We implement reasonable technical and organizational measures to
            protect user data from unauthorized access, misuse, or disclosure.
          </Paragraph>
        </section>

        <section className="space-y-3">
          <SectionTitle>Third-Party Services</SectionTitle>
          <Paragraph>
            Briefly may integrate with third-party services such as
            authentication providers and messaging platforms. These services
            operate under their own privacy policies.
          </Paragraph>
        </section>

        <section className="space-y-3">
          <SectionTitle>Data Retention</SectionTitle>
          <Paragraph>
            We retain user information only for as long as necessary to provide
            the service and comply with applicable legal obligations.
          </Paragraph>
        </section>

        <section className="space-y-3">
          <SectionTitle>User Rights</SectionTitle>
          <Paragraph>Users may request:</Paragraph>
          <ul className="list-disc pl-6 text-muted-foreground space-y-1">
            <li>Access to their data</li>
            <li>Correction of inaccurate data</li>
            <li>Deletion of their account</li>
          </ul>
          <Paragraph>
            Requests can be submitted through the platform or official contact
            channels.
          </Paragraph>
        </section>

        <section className="space-y-3">
          <SectionTitle>Changes to Privacy Policy</SectionTitle>
          <Paragraph>
            We may update this Privacy Policy periodically to reflect
            improvements or legal requirements. Continued use of Briefly after
            updates indicates acceptance of the revised policy.
          </Paragraph>
        </section>
      </div>
    </main>
  );
}
