"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense, useState } from "react";
import { AuthHydrator } from "@/components/auth/auth-hydrator";
import { ToastViewport } from "@/components/ui/toast-viewport";
import { AuthModalRouterGate } from "@/components/auth/auth-modal-router-gate";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <AuthHydrator />
      <ToastViewport />
      <Suspense fallback={null}>
        <AuthModalRouterGate />
      </Suspense>
      {children}
    </QueryClientProvider>
  );
}
