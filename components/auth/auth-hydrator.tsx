"use client";

import { useEffect } from "react";
import { useSetAtom } from "jotai";
import { useAuth } from "@/lib/auth/use-auth";
import { authHydratedAtom } from "@/lib/auth/session-atom";

export function AuthHydrator() {
  const { hydrate } = useAuth();
  const setHydrated = useSetAtom(authHydratedAtom);

  useEffect(() => {
    hydrate();
    setHydrated(true);
  }, [hydrate, setHydrated]);

  return null;
}
