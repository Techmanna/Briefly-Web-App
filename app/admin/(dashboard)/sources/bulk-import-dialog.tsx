"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/lib/toast";
import { Loader2 } from "lucide-react";
import { useBulkCreateSourcesMutation } from "@/api/queries/sources";
import type { CreateSourceInput } from "@/api/clients/sources";

type BulkImportDialogProps = {
  isOpen: boolean;
  onClose: () => void;
};

type ParsedSources = {
  sources: CreateSourceInput[];
  errors: string[];
};

function buildCsvTemplate() {
  const header = "name,url,rssUrl,country,region,credibilityScore,isActive";
  const example1 =
    "BBC News,https://www.bbc.com/news,https://feeds.bbci.co.uk/news/rss.xml,Global,,9,true";
  const example2 =
    "TheCable,https://www.thecable.ng,https://www.thecable.ng/feed,Nigeria,Africa,8,true";
  return [header, example1, example2].join("\n");
}

function downloadTextFile(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function parseCsv(text: string): ParsedSources {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length === 0) return { sources: [], errors: [] };

  const header = lines[0].split(",").map((h) => h.trim());
  const indexOf = (key: string) => header.findIndex((h) => h === key);

  const nameIdx = indexOf("name");
  const urlIdx = indexOf("url");
  const rssIdx = indexOf("rssUrl");
  const credIdx = indexOf("credibilityScore");
  const activeIdx = indexOf("isActive");
  const countryIdx = indexOf("country");
  const regionIdx = indexOf("region");

  const errors: string[] = [];
  if (nameIdx === -1 || urlIdx === -1) {
    return {
      sources: [],
      errors: [
        "CSV must include headers: name,url (optional: rssUrl,country,region,credibilityScore,isActive)",
      ],
    };
  }

  const sources: CreateSourceInput[] = [];
  for (let i = 1; i < lines.length; i += 1) {
    const cols = lines[i].split(",").map((c) => c.trim());
    const name = cols[nameIdx] || "";
    const url = cols[urlIdx] || "";
    if (!name || !url) {
      errors.push(`Row ${i + 1}: missing name or url`);
      continue;
    }

    const rssUrl = rssIdx !== -1 ? cols[rssIdx] : "";
    const country = countryIdx !== -1 ? cols[countryIdx] : "";
    const region = regionIdx !== -1 ? cols[regionIdx] : "";
    const credibilityScoreRaw = credIdx !== -1 ? cols[credIdx] : "";
    const isActiveRaw = activeIdx !== -1 ? cols[activeIdx] : "";

    const credibilityScore = credibilityScoreRaw
      ? Number(credibilityScoreRaw)
      : undefined;
    const isActive =
      isActiveRaw === "true"
        ? true
        : isActiveRaw === "false"
          ? false
          : undefined;

    sources.push({
      name,
      url,
      ...(rssUrl ? { rssUrl } : {}),
      ...(country ? { country } : {}),
      ...(region ? { region } : {}),
      ...(Number.isFinite(credibilityScore) ? { credibilityScore } : {}),
      ...(typeof isActive === "boolean" ? { isActive } : {}),
    });
  }

  return { sources, errors };
}

function parseInput(text: string): ParsedSources {
  const trimmed = text.trim();
  if (!trimmed) return { sources: [], errors: [] };

  if (trimmed.startsWith("[") || trimmed.startsWith("{")) {
    try {
      const parsed = JSON.parse(trimmed) as unknown;
      if (Array.isArray(parsed)) {
        return { sources: parsed as CreateSourceInput[], errors: [] };
      }
      if (parsed && typeof parsed === "object") {
        const record = parsed as Record<string, unknown>;
        const sources = record["sources"];
        if (Array.isArray(sources)) {
          return { sources: sources as CreateSourceInput[], errors: [] };
        }
      }
      return {
        sources: [],
        errors: ["JSON must be an array or { sources: [...] }"],
      };
    } catch {
      return { sources: [], errors: ["Invalid JSON"] };
    }
  }

  return parseCsv(trimmed);
}

export function BulkImportDialog({ isOpen, onClose }: BulkImportDialogProps) {
  const bulkMutation = useBulkCreateSourcesMutation();
  const [text, setText] = useState("");
  const [defaultCountry, setDefaultCountry] = useState("");
  const [defaultRegion, setDefaultRegion] = useState("");
  const [dryRun, setDryRun] = useState(true);

  useEffect(() => {
    if (!isOpen) return;
    window.setTimeout(() => {
      setText("");
      setDefaultCountry("");
      setDefaultRegion("");
      setDryRun(true);
    }, 0);
  }, [isOpen]);

  const parsed = useMemo(() => parseInput(text), [text]);

  async function onSubmit() {
    if (parsed.errors.length > 0) {
      toast.error("Fix input errors", { description: parsed.errors[0] });
      return;
    }
    if (parsed.sources.length === 0) {
      toast.error("No sources found", {
        description: "Paste JSON array or CSV.",
      });
      return;
    }

    try {
      const result = await bulkMutation.mutateAsync({
        sources: parsed.sources,
        dryRun,
        skipExisting: true,
        ...(defaultCountry.trim()
          ? { defaultCountry: defaultCountry.trim() }
          : {}),
        ...(defaultRegion.trim()
          ? { defaultRegion: defaultRegion.trim() }
          : {}),
      });

      if (dryRun) {
        toast.success("Dry run complete", {
          description: `toCreate: ${result.toCreate ?? 0} (existing: ${result.existing})`,
        });
      } else {
        toast.success("Import complete", {
          description: `created: ${result.created ?? 0} (existing: ${result.existing})`,
        });
        onClose();
      }
    } catch (e) {
      toast.error("Bulk import failed", {
        description: (e as Error).message,
      });
    }
  }

  const isPending = bulkMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[720px] rounded-3xl p-0 pb-5 overflow-hidden border-border/60">
        <DialogHeader className="px-8 pt-8 pb-4 bg-secondary/20">
          <DialogTitle className="text-2xl font-heading font-bold">
            Bulk Import Sources
          </DialogTitle>
          <DialogDescription>
            Paste JSON array or CSV (headers:{" "}
            name,url,rssUrl,country,region,credibilityScore,isActive).
          </DialogDescription>
        </DialogHeader>

        <div className="px-8 py-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="defaultCountry">Default Country (Optional)</Label>
              <Input
                id="defaultCountry"
                value={defaultCountry}
                onChange={(e) => setDefaultCountry(e.target.value)}
                placeholder="Global / Nigeria / Kenya"
                className="rounded-xl h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="defaultRegion">Default Region (Optional)</Label>
              <Input
                id="defaultRegion"
                value={defaultRegion}
                onChange={(e) => setDefaultRegion(e.target.value)}
                placeholder="Africa / Europe / North America"
                className="rounded-xl h-11"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bulkText">Sources</Label>
            <textarea
              id="bulkText"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-[220px] w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
              placeholder='Example JSON: [{"name":"BBC","url":"https://bbc.com","rssUrl":"https://feeds.bbci.co.uk/news/rss.xml","country":"Global"}]'
            />
            <div className="text-xs text-muted-foreground">
              Parsed: {parsed.sources.length} sources
              {parsed.errors.length > 0 ? ` • Error: ${parsed.errors[0]}` : ""}
            </div>
            <div>
              <Button
                type="button"
                variant="outline"
                className="rounded-xl"
                onClick={() => {
                  downloadTextFile("sources-template.csv", buildCsvTemplate());
                  toast.success("CSV template downloaded");
                }}
              >
                Download CSV template
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              id="dryRun"
              type="checkbox"
              checked={dryRun}
              onChange={(e) => setDryRun(e.target.checked)}
            />
            <Label htmlFor="dryRun">Dry run (recommended)</Label>
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
            type="button"
            className="rounded-xl px-8 font-bold"
            onClick={onSubmit}
            disabled={isPending || parsed.sources.length === 0}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {dryRun ? "Checking..." : "Importing..."}
              </>
            ) : dryRun ? (
              "Run Dry Check"
            ) : (
              "Import"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
