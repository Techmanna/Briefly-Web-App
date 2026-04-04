"use client";

import { useEffect } from "react";
import { useSetAtom } from "jotai";
import { useAuth } from "@/lib/auth/use-auth";
import { authHydratedAtom } from "@/lib/auth/session-atom";

export function AuthHydrator() {
  const { hydrate, clearSession } = useAuth();
  const setHydrated = useSetAtom(authHydratedAtom);

  useEffect(() => {
    hydrate();
    setHydrated(true);
  }, [hydrate, setHydrated]);

  useEffect(() => {
    function onLogout() {
      clearSession();
    }

    window.addEventListener("briefly:auth:logout", onLogout);
    return () => {
      window.removeEventListener("briefly:auth:logout", onLogout);
    };
  }, [clearSession]);

  return null;
}
