"use client";

import { useState } from "react";
import {
  useSourcesQuery,
  useDeleteSourceMutation,
  useUpdateSourceMutation,
} from "@/api/queries/sources";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  Rss,
  ShieldAlert,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SourceDialog } from "./source-dialog";
import { toast } from "@/lib/toast";

export default function SourcesPage() {
  const { data: sources, isLoading } = useSourcesQuery();
  const deleteMutation = useDeleteSourceMutation();
  const updateMutation = useUpdateSourceMutation();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSourceId, setSelectedSourceId] = useState<string | null>(null);
  const [actionStates, setActionStates] = useState<
    Record<string, { isToggling?: boolean; isDeleting?: boolean }>
  >({});

  // Sort sources to prevent reordering on update
  const sortedSources = sources?.sort((a, b) => a.name.localeCompare(b.name));

  const handleCreate = () => {
    setSelectedSourceId(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (id: string) => {
    setSelectedSourceId(id);
    setIsDialogOpen(true);
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    setActionStates((prev) => ({
      ...prev,
      [id]: { ...prev[id], isToggling: true },
    }));
    try {
      await updateMutation.mutateAsync({
        id,
        input: { isActive: !currentStatus },
      });
      toast.success(
        `Source ${!currentStatus ? "activated" : "deactivated"} successfully`,
      );
    } catch (err) {
      toast.error("Failed to update source status", {
        description: (err as Error).message,
      });
    } finally {
      setActionStates((prev) => ({
        ...prev,
        [id]: { ...prev[id], isToggling: false },
      }));
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (
      window.confirm(
        `Are you sure you want to delete ${name}? This action cannot be undone.`,
      )
    ) {
      setActionStates((prev) => ({
        ...prev,
        [id]: { ...prev[id], isDeleting: true },
      }));
      try {
        await deleteMutation.mutateAsync(id);
        toast.success("Source deleted successfully");
      } catch (err) {
        toast.error("Failed to delete source", {
          description: (err as Error).message,
        });
      } finally {
        setActionStates((prev) => ({
          ...prev,
          [id]: { ...prev[id], isDeleting: false },
        }));
      }
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Skeleton className="h-96 w-full rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-heading font-bold tracking-tight">
            News Sources
          </h1>
          <p className="text-muted-foreground">
            Manage RSS feeds and content providers.
          </p>
        </div>
        <Button
          onClick={handleCreate}
          className="rounded-xl h-11 px-6 font-bold gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Source
        </Button>
      </div>

      <Card className="border-border shadow-none rounded-lg overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-secondary/30 text-muted-foreground font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-6 py-4">Source</th>
                  <th className="px-6 py-4">RSS Feed</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Credibility</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {sortedSources?.map((source) => (
                  <tr
                    key={source.id}
                    className="hover:bg-secondary/20 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-foreground/80 text-base">
                          {source.name}
                        </span>
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-muted-foreground hover:text-primary flex items-center gap-1 mt-1 w-fit"
                        >
                          {source.url.replace(/^https?:\/\//, "")}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {source.rss_url ? (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Rss className="h-4 w-4 text-orange-500" />
                          <span
                            className="text-xs truncate max-w-[200px]"
                            title={source.rss_url}
                          >
                            {source.rss_url.replace(/^https?:\/\//, "")}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground italic">
                          No RSS configured
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Switch
                          checked={source.is_active}
                          onCheckedChange={() =>
                            handleToggleActive(source.id, source.is_active)
                          }
                          disabled={actionStates[source.id]?.isToggling}
                        />
                        <div
                          className={cn(
                            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border",
                            source.is_active
                              ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                              : "bg-secondary text-muted-foreground border-border",
                          )}
                        >
                          {source.is_active ? (
                            <CheckCircle2 className="h-3 w-3" />
                          ) : (
                            <XCircle className="h-3 w-3" />
                          )}
                          {source.is_active ? "Active" : "Inactive"}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <ShieldAlert
                          className={cn(
                            "h-4 w-4",
                            source.credibility_score >= 8
                              ? "text-emerald-500"
                              : source.credibility_score >= 5
                                ? "text-amber-500"
                                : "text-destructive",
                          )}
                        />
                        <span className="font-bold">
                          {source.credibility_score}/10
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary"
                          onClick={() => handleEdit(source.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-lg hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => handleDelete(source.id, source.name)}
                          disabled={actionStates[source.id]?.isDeleting}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {sortedSources?.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-12 text-center text-muted-foreground"
                    >
                      No sources found. Click &quot;Add Source&quot; to create
                      one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <SourceDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        sourceId={selectedSourceId}
      />
    </div>
  );
}
