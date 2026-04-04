"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { toast } from "@/lib/toast";
import {
  useAdminInterestsQuery,
  useUpdateAdminInterestMutation,
} from "@/api/queries/admin";

export default function AdminInterestsPage() {
  const interestsQuery = useAdminInterestsQuery();
  const updateInterest = useUpdateAdminInterestMutation();

  const [search, setSearch] = useState("");
  const [draftRank, setDraftRank] = useState<Record<string, string>>({});
  const [draftActive, setDraftActive] = useState<Record<string, boolean>>({});

  const filtered = useMemo(() => {
    const items = interestsQuery.data ?? [];
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((i) => {
      const hay = `${i.name} ${i.slug} ${i.description || ""}`.toLowerCase();
      return hay.includes(q);
    });
  }, [interestsQuery.data, search]);

  const rows = useMemo(() => {
    return filtered.map((i) => {
      const rankValue = draftRank[i.id] ?? String(i.rank ?? 0);
      const isActiveValue = draftActive[i.id] ?? Boolean(i.is_active);
      const rankInt = Number(rankValue);
      const rankValid = Number.isFinite(rankInt) && rankInt >= 0;
      const changed =
        (rankValid && rankInt !== i.rank) || isActiveValue !== i.is_active;

      return {
        interest: i,
        rankValue,
        isActiveValue,
        rankInt,
        rankValid,
        changed,
      };
    });
  }, [draftActive, draftRank, filtered]);

  async function saveRow(id: string) {
    const row = rows.find((r) => r.interest.id === id);
    if (!row) return;
    if (!row.rankValid) {
      toast.error("Invalid rank", { description: "Rank must be 0 or more." });
      return;
    }

    try {
      await updateInterest.mutateAsync({
        id,
        input: { rank: row.rankInt, isActive: row.isActiveValue },
      });
      toast.success("Interest updated");
    } catch (e) {
      toast.error("Update failed", { description: (e as Error).message });
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-heading font-bold tracking-tight">
            Interests
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Control ordering and visibility for the Topics list.
          </p>
        </div>
      </div>

      <Card className="rounded-2xl shadow-sm border-border/60">
        <CardHeader>
          <CardTitle className="font-heading text-xl">
            Manage Interests
          </CardTitle>
          <CardDescription className="text-base">
            Lower rank appears first. Disable an interest to hide it from users.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:items-end">
            <div className="space-y-2 flex-1">
              <Label htmlFor="search">Search</Label>
              <Input
                id="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, slug, description"
                className="rounded-xl h-11"
              />
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-border/60">
            <table className="w-full">
              <thead className="bg-secondary/30 text-muted-foreground font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-6 py-4 text-left">Interest</th>
                  <th className="px-6 py-4 text-left">Slug</th>
                  <th className="px-6 py-4 text-left">Rank</th>
                  <th className="px-6 py-4 text-left">Active</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {interestsQuery.isLoading ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-10 text-center text-muted-foreground"
                    >
                      Loading...
                    </td>
                  </tr>
                ) : null}

                {!interestsQuery.isLoading && rows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-10 text-center text-muted-foreground"
                    >
                      No interests found.
                    </td>
                  </tr>
                ) : null}

                {rows.map((row) => (
                  <tr key={row.interest.id} className="hover:bg-muted/20">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <div className="font-semibold">{row.interest.name}</div>
                        {row.interest.description ? (
                          <div className="text-xs text-muted-foreground mt-1">
                            {row.interest.description}
                          </div>
                        ) : null}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {row.interest.slug}
                    </td>
                    <td className="px-6 py-4">
                      <Input
                        value={row.rankValue}
                        onChange={(e) =>
                          setDraftRank((prev) => ({
                            ...prev,
                            [row.interest.id]: e.target.value,
                          }))
                        }
                        className={cn(
                          "rounded-xl h-10 w-[110px]",
                          row.rankValid ? "" : "border-destructive",
                        )}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <Switch
                        checked={row.isActiveValue}
                        onCheckedChange={(checked) =>
                          setDraftActive((prev) => ({
                            ...prev,
                            [row.interest.id]: checked,
                          }))
                        }
                        disabled={updateInterest.isPending}
                      />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button
                        className="rounded-xl"
                        onClick={() => saveRow(row.interest.id)}
                        disabled={
                          updateInterest.isPending ||
                          !row.changed ||
                          !row.rankValid
                        }
                      >
                        Save
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
