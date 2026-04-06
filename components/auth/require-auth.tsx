"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { useAtomValue } from "jotai";
import { useRouter } from "next/navigation";
import { authHydratedAtom } from "@/lib/auth/session-atom";
import { useAuth } from "@/lib/auth/use-auth";

export function RequireAuth({ children }: { children: ReactNode }) {
  const router = useRouter();
  const hydrated = useAtomValue(authHydratedAtom);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!hydrated) return;
    if (isAuthenticated) return;
    router.replace("/?auth=login");
  }, [hydrated, isAuthenticated, router]);

  if (!hydrated) return null;
  if (!isAuthenticated) return null;
  return <>{children}</>;
}
