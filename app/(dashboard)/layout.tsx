"use client";

import { DashboardNav } from "@/components/dashboard-nav";
import { RequireAuth } from "@/components/auth/require-auth";
import { RequireCategories } from "@/components/auth/require-categories";
import { FileText, Home, Settings, User } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAtomValue } from "jotai";
import { authHydratedAtom } from "@/lib/auth/session-atom";
import { useAuth } from "@/lib/auth/use-auth";
import { Button } from "@/components/ui/button";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const hydrated = useAtomValue(authHydratedAtom);
  const { isAuthenticated } = useAuth();

  const isPublicDashboard =
    pathname === "/news" || pathname.startsWith("/news/");
  const showAuthenticatedNav = hydrated && isAuthenticated;

  const shell = (
    <div className="flex min-h-screen flex-col bg-background/50">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/60 backdrop-blur-xl supports-backdrop-filter:bg-background/60">
        <div className="container mx-auto flex h-16 max-w-screen-md items-center justify-between px-4">
          <div className="flex items-center gap-2 font-heading font-bold text-lg tracking-tight text-primary">
            <Link href="/news">Briefly.</Link>
          </div>

          <div className="text-sm font-medium text-muted-foreground hidden sm:block bg-secondary/50 px-3 py-1 rounded-full border border-border/50">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </div>

          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
              <Link
                href="/news"
                className="flex items-center gap-2 hover:text-primary transition-colors"
              >
                <Home className="h-4 w-4" />
                News
              </Link>
              {showAuthenticatedNav ? (
                <>
                  <Link
                    href="/briefs"
                    className="flex items-center gap-2 hover:text-primary transition-colors"
                  >
                    <FileText className="h-4 w-4" />
                    My Briefs
                  </Link>
                  <Link
                    href="/settings"
                    className="flex items-center gap-2 hover:text-primary transition-colors"
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </Link>
                </>
              ) : null}
            </nav>

            {showAuthenticatedNav ? (
              <div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center border border-border/50 hover:bg-secondary/80 transition-colors cursor-pointer shadow-sm">
                <User className="h-4 w-4 text-muted-foreground" />
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="rounded-full border-border/60"
                onClick={() => router.push("/news?auth=login")}
              >
                Sign in
              </Button>
            )}
          </div>
        </div>
      </header>
      <main className="flex-1 container mx-auto max-w-screen-md p-4 pb-24 md:pb-12 md:pt-8">
        {children}
      </main>
      {showAuthenticatedNav ? <DashboardNav /> : null}
    </div>
  );

  return isPublicDashboard ? (
    shell
  ) : (
    <RequireAuth>
      <RequireCategories>{shell}</RequireCategories>
    </RequireAuth>
  );
}
