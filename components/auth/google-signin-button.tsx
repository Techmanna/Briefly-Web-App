"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { useGoogleLoginMutation } from "@/api";
import { toast } from "@/lib/toast";

type GoogleIdCredentialResponse = { credential?: string };
type GoogleAccountsId = {
  initialize: (args: {
    client_id: string;
    callback: (response: GoogleIdCredentialResponse) => void | Promise<void>;
  }) => void;
  renderButton: (parent: HTMLElement, options: Record<string, unknown>) => void;
};
type GoogleAccounts = { id: GoogleAccountsId };
type Google = { accounts: GoogleAccounts };

declare global {
  interface Window {
    google?: Google;
  }
}

type Props = {
  onSuccess?: () => void;
};

export function GoogleSignInButton({ onSuccess }: Props) {
  const containerId = useId();
  const { mutateAsync, isPending } = useGoogleLoginMutation();
  const clientId = useMemo(() => process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID, []);
  const [ready, setReady] = useState(() => {
    if (typeof window === "undefined") return false;
    return Boolean(window.google?.accounts?.id);
  });

  useEffect(() => {
    if (!clientId) return;
    if (typeof window === "undefined") return;
    if (window.google?.accounts?.id) return;

    const scriptId = "google-identity-services";
    const existing = document.getElementById(
      scriptId,
    ) as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener("load", () => setReady(true), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.id = scriptId;
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => setReady(true);
    document.head.appendChild(script);
  }, [clientId]);

  useEffect(() => {
    if (!clientId) return;
    if (!ready) return;
    const google = window.google;
    if (!google?.accounts?.id) return;

    google.accounts.id.initialize({
      client_id: clientId,
      callback: async (response) => {
        const idToken = response.credential;
        if (!idToken) return;
        try {
          await mutateAsync({ idToken });
          toast.success("Signed in");
          onSuccess?.();
        } catch (e) {
          toast.error((e as Error).message || "Google sign-in failed");
        }
      },
    });

    const el = document.getElementById(containerId);
    if (!el) return;
    el.innerHTML = "";
    google.accounts.id.renderButton(el, {
      theme: "outline",
      size: "large",
      width: "320",
      text: "continue_with",
      shape: "pill",
    });
  }, [clientId, containerId, mutateAsync, onSuccess, ready]);

  if (!clientId) return null;

  return (
    <div className="space-y-2">
      <div
        id={containerId}
        className={isPending ? "opacity-50 pointer-events-none" : ""}
      />
    </div>
  );
}
