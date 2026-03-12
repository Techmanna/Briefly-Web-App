import { useAtomValue, useSetAtom } from "jotai";
import { useCallback } from "react";
import { authSessionAtom } from "./session-atom";
import {
  clearSession as clearPersistedSession,
  getSession as getPersistedSession,
  setSession as persistSession,
  type AuthSession,
} from "@/api/clients/session";

export function useAuth() {
  const session = useAtomValue(authSessionAtom);
  const setSessionState = useSetAtom(authSessionAtom);

  const setSession = useCallback(
    (next: AuthSession) => {
      persistSession(next);
      setSessionState(next);
    },
    [setSessionState],
  );

  const clearSession = useCallback(() => {
    clearPersistedSession();
    setSessionState(null);
  }, [setSessionState]);

  const hydrate = useCallback(() => {
    const persisted = getPersistedSession();
    if (persisted) setSessionState(persisted);
  }, [setSessionState]);

  return {
    session,
    isAuthenticated: Boolean(session?.accessToken),
    setSession,
    clearSession,
    hydrate,
  };
}
