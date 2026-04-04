"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  LogOut,
  ShieldCheck,
  Menu,
  X,
  History,
  BarChart3,
  Network,
  Tag,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { clearSession } from "@/api/clients/session";
import { useState } from "react";

const navItems = [
  {
    title: "Overview",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Sources",
    href: "/admin/sources",
    icon: Network,
  },
  {
    title: "Interests",
    href: "/admin/interests",
    icon: Tag,
  },
  {
    title: "AI Analytics",
    href: "/admin/analytics/ai",
    icon: BarChart3,
  },
  {
    title: "Pipeline",
    href: "/admin/analytics/ingestion",
    icon: Network,
  },
  {
    title: "Ingestion Logs",
    href: "/admin/logs/ingestion",
    icon: History,
  },
  {
    title: "Digest Logs",
    href: "/admin/logs/digest",
    icon: FileText,
  },
  {
    title: "Profile",
    href: "/admin/profile",
    icon: Settings,
  },
];

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    clearSession();
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen bg-secondary/20 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-background border-r border-border/60 transition-transform duration-300 md:translate-x-0",
          "h-screen",
          !isMobileMenuOpen && "-translate-x-full md:translate-x-0",
        )}
      >
        <div className="h-full flex flex-col p-6">
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center">
              <ShieldCheck className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-xl leading-none">
                Briefly
              </h2>
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest mt-1">
                Admin Panel
              </p>
            </div>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto pr-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <button
                  key={item.href}
                  onClick={() => {
                    router.push(item.href);
                    setIsMobileMenuOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground",
                  )}
                >
                  <item.icon
                    className={cn(
                      "h-4 w-4",
                      isActive
                        ? ""
                        : "group-hover:scale-110 transition-transform",
                    )}
                  />
                  {item.title}
                </button>
              );
            })}
          </nav>

          <div className="pt-6 border-t border-border/60">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/5 rounded-xl h-12"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between p-4 bg-background border-b border-border/60 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-primary" />
          <span className="font-heading font-bold">Briefly Admin</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-10 max-w-7xl mx-auto w-full md:ml-64">
        {children}
      </main>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}
