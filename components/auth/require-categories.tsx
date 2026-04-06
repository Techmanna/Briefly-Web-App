"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth/use-auth";
import { usersClient } from "@/api";

export function RequireCategories({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { session, isAuthenticated } = useAuth();
  const userId = session?.user.id ?? "";

  const userQuery = useQuery({
    queryKey: ["user", userId],
    queryFn: () => usersClient.getUser(userId),
    enabled: Boolean(userId) && isAuthenticated,
  });

  useEffect(() => {
    if (userQuery.isLoading || !isAuthenticated) return;

    const subscriptionCount = userQuery.data?.subscriptions?.length ?? 0;
    const hasEnoughCategories = subscriptionCount >= 3;

    // If not enough categories and not already on onboarding or settings, redirect
    const isAllowedPath =
      pathname === "/onboarding" || pathname === "/settings";

      console.log({
        subscriptionCount,
        hasEnoughCategories,
        user: userQuery.data
      });
      
    if (!hasEnoughCategories && !isAllowedPath) {
      // router.replace("/onboarding");
    }
  }, [userQuery.data, userQuery.isLoading, isAuthenticated, router, pathname]);

  if (userQuery.isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <>{children}</>;
}
