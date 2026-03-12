import Link from "next/link";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/60 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-screen-lg items-center justify-between px-6">
        <div className="flex items-center gap-2 font-heading font-bold text-xl tracking-tight text-primary">
          <Link href="/">Briefly.</Link>
        </div>
        <nav className="flex items-center gap-6">
          <Link
            href="/login"
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            Login
          </Link>
          <Button
            asChild
            size="sm"
            className="rounded-xl px-6 font-medium shadow-sm hover:shadow-md transition-all duration-300"
          >
            <Link href="/signup">Sign Up Free</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
