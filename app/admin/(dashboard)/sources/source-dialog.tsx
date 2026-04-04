"use client";

import { useState, useEffect } from "react";
import {
  useSourceQuery,
  useCreateSourceMutation,
  useUpdateSourceMutation,
} from "@/api/queries/sources";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/lib/toast";
import { Loader2 } from "lucide-react";

interface SourceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  sourceId: string | null;
}

export function SourceDialog({ isOpen, onClose, sourceId }: SourceDialogProps) {
  const isEditing = !!sourceId;

  const { data: source, isLoading: isFetching } = useSourceQuery(
    sourceId || "",
  );
  const createMutation = useCreateSourceMutation();
  const updateMutation = useUpdateSourceMutation();

  const [formData, setFormData] = useState({
    name: "",
    url: "",
    rssUrl: "",
    country: "",
    region: "",
    credibilityScore: 5,
  });

  useEffect(() => {
    if (isOpen) {
      if (isEditing && source) {
        // Use a timeout to avoid synchronous state updates during render
        setTimeout(() => {
          setFormData({
            name: source.name,
            url: source.url,
            rssUrl: source.rss_url || "",
            country: source.country || "",
            region: source.region || "",
            credibilityScore: source.credibility_score,
          });
        }, 0);
      } else if (!isEditing) {
        setTimeout(() => {
          setFormData({
            name: "",
            url: "",
            rssUrl: "",
            country: "",
            region: "",
            credibilityScore: 5,
          });
        }, 0);
      }
    }
  }, [source, isEditing, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = {
        name: formData.name,
        url: formData.url,
        ...(formData.rssUrl ? { rssUrl: formData.rssUrl } : {}),
        ...(formData.country ? { country: formData.country } : {}),
        ...(formData.region ? { region: formData.region } : {}),
        credibilityScore: Number(formData.credibilityScore),
      };

      if (isEditing && sourceId) {
        await updateMutation.mutateAsync({ id: sourceId, input: payload });
        toast.success("Source updated successfully");
      } else {
        await createMutation.mutateAsync(payload);
        toast.success("Source created successfully");
      }
      onClose();
    } catch (err) {
      toast.error(`Failed to ${isEditing ? "update" : "create"} source`, {
        description: (err as Error).message,
      });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={(open: boolean) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] rounded-3xl p-0 pb-5 overflow-hidden border-border/60">
        <DialogHeader className="px-8 pt-8 pb-4 bg-secondary/20">
          <DialogTitle className="text-2xl font-heading font-bold">
            {isEditing ? "Edit Source" : "Add New Source"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the details of this news source."
              : "Configure a new RSS feed or content provider."}
          </DialogDescription>
        </DialogHeader>

        {isFetching && isEditing ? (
          <div className="p-8 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="px-8 py-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Source Name</Label>
                <Input
                  id="name"
                  placeholder="e.g. BBC News"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  className="rounded-xl h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="url">Website URL</Label>
                <Input
                  id="url"
                  type="url"
                  placeholder="https://www.bbc.com"
                  value={formData.url}
                  onChange={(e) =>
                    setFormData({ ...formData, url: e.target.value })
                  }
                  required
                  className="rounded-xl h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rssUrl">RSS Feed URL (Optional)</Label>
                <Input
                  id="rssUrl"
                  type="url"
                  placeholder="https://feeds.bbci.co.uk/news/rss.xml"
                  value={formData.rssUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, rssUrl: e.target.value })
                  }
                  className="rounded-xl h-11"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="country">Country (Optional)</Label>
                  <Input
                    id="country"
                    placeholder="Nigeria / Global"
                    value={formData.country}
                    onChange={(e) =>
                      setFormData({ ...formData, country: e.target.value })
                    }
                    className="rounded-xl h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="region">Region (Optional)</Label>
                  <Input
                    id="region"
                    placeholder="Africa / Europe"
                    value={formData.region}
                    onChange={(e) =>
                      setFormData({ ...formData, region: e.target.value })
                    }
                    className="rounded-xl h-11"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="credibility">
                    Credibility Score: {formData.credibilityScore}
                  </Label>
                  <span className="text-xs text-muted-foreground">1-10</span>
                </div>
                <input
                  id="credibility"
                  type="range"
                  min="1"
                  max="10"
                  value={formData.credibilityScore}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      credibilityScore: Number(e.target.value),
                    })
                  }
                  className="w-full accent-primary"
                />
              </div>
            </div>

            <DialogFooter className="px-8 py-4 bg-secondary/10 border-t border-border/40">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                className="rounded-xl font-medium"
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="rounded-xl px-8 font-bold"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : isEditing ? (
                  "Save Changes"
                ) : (
                  "Create Source"
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
