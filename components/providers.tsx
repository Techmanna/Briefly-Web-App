"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { AuthHydrator } from "@/components/auth/auth-hydrator";
import { ToastViewport } from "@/components/ui/toast-viewport";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <AuthHydrator />
      <ToastViewport />
      {children}
    </QueryClientProvider>
  );
}
