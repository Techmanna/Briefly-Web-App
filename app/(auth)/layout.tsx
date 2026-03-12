import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-background relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-background to-background" />
      <div className="absolute bottom-0 left-0 -z-10 h-[500px] w-[500px] bg-accent/30 blur-[100px] rounded-full opacity-50" />
      {children}
    </div>
  );
}
