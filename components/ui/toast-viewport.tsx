"use client";

import { useSyncExternalStore } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { dismissToast, getSnapshot, subscribe } from "@/lib/toast";

function variantClass(variant: "success" | "error" | "info") {
  if (variant === "success") return "border-emerald-500/40 bg-emerald-500/5";
  if (variant === "error") return "border-destructive/50 bg-destructive/5";
  return "border-primary/30 bg-primary/5";
}

export function ToastViewport() {
  const items = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  return (
    <div className="fixed right-4 top-4 z-[100] w-[calc(100vw-2rem)] max-w-sm space-y-3">
      {items.map((t) => (
        <div
          key={t.id}
          className={cn(
            "relative overflow-hidden rounded-2xl border shadow-lg backdrop-blur-xl supports-[backdrop-filter]:bg-background/50",
            "animate-slide-up",
            variantClass(t.variant),
          )}
          role="status"
          aria-live="polite"
        >
          <div className="p-4 pr-10">
            <div className="text-sm font-semibold">{t.message}</div>
            {t.description ? (
              <div className="mt-1 text-sm text-muted-foreground">
                {t.description}
              </div>
            ) : null}
          </div>
          <button
            type="button"
            aria-label="Dismiss"
            className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
            onClick={() => dismissToast(t.id)}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
