"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FileText, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

export function DashboardNav() {
  const pathname = usePathname();

  const items = [
    {
      title: "Home",
      href: "/dashboard",
      icon: Home,
    },
    {
      title: "Briefs",
      href: "/briefs",
      icon: FileText,
    },
    {
      title: "Settings",
      href: "/settings",
      icon: Settings,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 md:hidden pb-safe">
      <div className="flex h-16 items-center justify-around px-4 pb-2 pt-2">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-1 text-[10px] font-medium transition-all duration-200 p-2 rounded-xl",
              pathname === item.href 
                ? "text-primary bg-primary/5" 
                : "text-muted-foreground hover:text-primary hover:bg-secondary/50"
            )}
          >
            <item.icon className={cn("h-5 w-5 transition-transform duration-200", pathname === item.href ? "scale-110" : "")} />
            {item.title}
          </Link>
        ))}
      </div>
    </nav>
  );
}
