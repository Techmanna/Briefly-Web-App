"use client";

import { useAdminUsersQuery } from "@/api/queries/admin";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Mail, Phone, Calendar, Info, Layers, FileText } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function AdminUsersPage() {
  const [page, setPage] = useState(1);
  const { data: result, isLoading } = useAdminUsersQuery(page, 20);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-96 w-full rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-heading font-bold tracking-tight">
          Platform Users
        </h1>
        <p className="text-muted-foreground">
          Manage and monitor user engagement across the platform.
        </p>
      </div>

      <Card className="border-border/60 shadow-sm rounded-3xl overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-secondary/30 text-muted-foreground font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Engagement</th>
                  <th className="px-6 py-4">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {result?.items.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-secondary/20 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center font-bold text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                          {user.name?.[0]?.toUpperCase() || "U"}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-foreground/80">
                            {user.name || "Anonymous User"}
                          </span>
                          <span className="text-[10px] text-muted-foreground font-mono">
                            {user.id.slice(0, 8)}...
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        {user.email && (
                          <div className="flex items-center gap-1.5 text-muted-foreground group-hover:text-foreground transition-colors">
                            <Mail className="h-3 w-3" />
                            <span className="font-medium">{user.email}</span>
                          </div>
                        )}
                        {user.phone && (
                          <div className="flex items-center gap-1.5 text-muted-foreground group-hover:text-foreground transition-colors">
                            <Phone className="h-3 w-3" />
                            <span className="font-medium">{user.phone}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                            <Layers className="h-3 w-3" />
                            Subscriptions
                          </div>
                          <div className="font-bold text-foreground/80">
                            {user.count.subscriptions} categories
                          </div>
                        </div>
                        <div className="flex flex-col border-l border-border/40 pl-4">
                          <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                            <FileText className="h-3 w-3" />
                            Digests
                          </div>
                          <div className="font-bold text-foreground/80">
                            {user.count.digests} received
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-muted-foreground font-medium">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(user.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                    </td>
                  </tr>
                ))}
                {result?.items.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <Info className="h-8 w-8 opacity-20" />
                        <p>No users found.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {result?.meta && result.meta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 pt-4 pb-10">
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl border-border/60"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span className="text-sm font-medium">
            Page {page} of {result.meta.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl border-border/60"
            onClick={() =>
              setPage((p) => Math.min(result.meta.totalPages, p + 1))
            }
            disabled={page === result.meta.totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
