"use client";

import {
  useDigestLogsQuery,
  useRetryFailedDigestDeliveriesMutation,
} from "@/api/queries/admin";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Send, Calendar, CheckCircle2, Info, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "@/lib/toast";

export default function DigestLogsPage() {
  const { data: result, isLoading } = useDigestLogsQuery(1, 50);
  const retryMutation = useRetryFailedDigestDeliveriesMutation();

  const retryForDigest = async (digestId: string) => {
    try {
      const res = await retryMutation.mutateAsync({
        digestId,
        channels: ["EMAIL", "WHATSAPP", "PUSH", "TELEGRAM"],
      });
      toast.success(
        `Retry queued: ${res.deliveries} deliveries across ${res.users} users`,
      );
    } catch (e) {
      toast.error((e as Error).message || "Failed to retry deliveries");
    }
  };

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
          Digest Logs
        </h1>
        <p className="text-muted-foreground">
          History of daily digest generations and deliveries.
        </p>
      </div>

      <Card className="border-border shadow-none rounded-lg overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-secondary/30 text-muted-foreground font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-6 py-4">Digest Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Recipients</th>
                  <th className="px-6 py-4">Digest ID</th>
                  <th className="px-6 py-4 text-right">Actions</th>
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
                          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                        </div>
                        <span className="font-bold text-foreground/80">
                          {new Date(log.date).toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div
                        className={cn(
                          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border",
                          "bg-emerald-50 text-emerald-600 border-emerald-100",
                        )}
                      >
                        <CheckCircle2 className="h-3 w-3" />
                        {log.status}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-md bg-secondary/50">
                          <Send className="h-3 w-3 text-muted-foreground" />
                        </div>
                        <span className="font-bold text-foreground/70">
                          {log.recipient_count.toLocaleString()} deliveries
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <code className="text-[10px] font-mono bg-secondary/50 px-1.5 py-0.5 rounded text-muted-foreground group-hover:bg-background transition-colors">
                        {log.id}
                      </code>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8"
                        onClick={() => retryForDigest(log.id)}
                        disabled={retryMutation.isPending}
                      >
                        <RotateCcw className="h-3.5 w-3.5 mr-2" />
                        Retry failed
                      </Button>
                    </td>
                  </tr>
                ))}
                {result?.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <Info className="h-8 w-8 opacity-20" />
                        <p>No digest logs found.</p>
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
