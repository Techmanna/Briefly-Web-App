"use client";

import { useCallback, useEffect, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AuthChoiceModal } from "@/components/auth/auth-choice-modal";
import { useAuth } from "@/lib/auth/use-auth";

export function AuthModalRouterGate() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuth();

  const mode = searchParams.get("auth");
  const open = mode === "login" || mode === "signup";

  const close = useCallback(() => {
    const next = new URLSearchParams(searchParams.toString());
    next.delete("auth");
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname);
  }, [pathname, router, searchParams]);

  const closeAndGoDashboard = useCallback(() => {
    close();
    router.replace("/dashboard");
  }, [close, router]);

  useEffect(() => {
    if (open && isAuthenticated) {
      closeAndGoDashboard();
    }
  }, [closeAndGoDashboard, isAuthenticated, open]);

  const resolvedMode = useMemo(() => {
    if (mode === "signup") return "signup";
    return "login";
  }, [mode]);

  return (
    <AuthChoiceModal
      key={`${resolvedMode}-${open ? "open" : "closed"}`}
      open={open}
      mode={resolvedMode}
      onClose={close}
    />
  );
}
