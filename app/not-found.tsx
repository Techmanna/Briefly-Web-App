import Link from "next/link";
import { ArrowLeft, Home, SearchX } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-background selection:bg-primary/10 selection:text-primary">
      <SiteHeader />
      <main className="flex-1">
        <section className="relative overflow-hidden py-20">
          <div className="container mx-auto px-6 max-w-screen-md">
            <div className="glass-panel border border-border/60 rounded-2xl p-8 md:p-10 shadow-lg backdrop-blur-xl">
              <div className="flex items-start gap-4">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-primary">
                  <SearchX className="h-6 w-6" />
                </div>
                <div className="space-y-2">
                  <h1 className="text-3xl md:text-4xl font-heading font-bold tracking-tight">
                    Page not found
                  </h1>
                  <p className="text-muted-foreground leading-relaxed">
                    The page you’re looking for doesn’t exist or has been moved.
                  </p>
                </div>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Button asChild className="rounded-full px-6">
                  <Link href="/">
                    <Home className="mr-2 h-4 w-4" />
                    Go home
                  </Link>
                </Button>
                <Button asChild variant="outline" className="rounded-full px-6">
                  <Link href="/dashboard">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to dashboard
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[100px] opacity-60 pointer-events-none" />
        </section>
      </main>
    </div>
  );
}

