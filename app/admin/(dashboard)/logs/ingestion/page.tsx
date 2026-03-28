"use client";

import { useIngestionLogsQuery } from "@/api/queries/admin";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  History,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function IngestionLogsPage() {
  const { data: result, isLoading } = useIngestionLogsQuery(1, 50);

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
          Ingestion Logs
        </h1>
        <p className="text-muted-foreground">
          Monitoring data fetching from RSS sources.
        </p>
      </div>

      <Card className="border-border shadow-none rounded-lg overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-secondary/30 text-muted-foreground font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-6 py-4">Action</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Description</th>
                  <th className="px-6 py-4">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {result?.map((log) => (
                  <tr
                    key={log.id}
                    className="hover:bg-secondary/20 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-secondary/50 group-hover:bg-background transition-colors">
                          <History className="h-3.5 w-3.5 text-muted-foreground" />
                        </div>
                        <span className="font-bold text-foreground/80">
                          {log.action}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div
                        className={cn(
                          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border",
                          log.status === "SUCCESS"
                            ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                            : log.status === "WARNING"
                              ? "bg-amber-50 text-amber-600 border-amber-100"
                              : "bg-destructive/5 text-destructive border-destructive/10",
                        )}
                      >
                        {log.status === "SUCCESS" ? (
                          <CheckCircle2 className="h-3 w-3" />
                        ) : log.status === "WARNING" ? (
                          <AlertCircle className="h-3 w-3" />
                        ) : (
                          <XCircle className="h-3 w-3" />
                        )}
                        {log.status}
                      </div>
                    </td>
                    <td className="px-6 py-4 max-w-md">
                      <p className="truncate text-muted-foreground font-medium">
                        {log.description}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground font-medium">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
                {result?.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <Info className="h-8 w-8 opacity-20" />
                        <p>No ingestion logs found.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
