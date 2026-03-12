import Link from "next/link";
import { ArrowLeft, FileText, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="space-y-6">
      <div className="glass-panel border border-border/60 rounded-2xl p-8 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-primary">
            <SearchX className="h-6 w-6" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-heading font-bold tracking-tight">
              Page not found
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              This page doesn’t exist. Try going back or opening today’s brief.
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <Button asChild className="rounded-full px-6">
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to dashboard
            </Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full px-6">
            <Link href="/briefs">
              <FileText className="mr-2 h-4 w-4" />
              Open briefs
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

