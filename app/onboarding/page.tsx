"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  categoriesClient,
  useUpdatePreferencesMutation,
  usersClient,
} from "@/api";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth/use-auth";
import { toast } from "@/lib/toast";

export default function OnboardingPage() {
  const router = useRouter();
  const { session } = useAuth();
  const userId = session?.user.id ?? "";
  const [selected, setSelected] = useState<string[]>([]);
  const hasInitializedRef = useRef(false);

  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoriesClient.listCategories(),
  });

  const userQuery = useQuery({
    queryKey: ["user", userId],
    queryFn: () => usersClient.getUser(userId),
    enabled: Boolean(userId),
  });

  const updatePreferences = useUpdatePreferencesMutation(userId);

  useEffect(() => {
    if (userQuery.data?.subscriptions && !hasInitializedRef.current) {
      const initialSelected = userQuery.data.subscriptions.map(
        (s) => s.category_id,
      );
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelected(initialSelected);
      hasInitializedRef.current = true;
    }
  }, [userQuery.data]);

  const toggleCategory = (categoryId: string) => {
    setSelected((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId],
    );
  };

  const handleContinue = async () => {
    if (selected.length < 3) {
      toast.error("Please select at least 3 topics to continue.");
      return;
    }

    try {
      await updatePreferences.mutateAsync({ categoryIds: selected });
      toast.success("Preferences saved!");
      router.push("/dashboard");
    } catch (e) {
      toast.error((e as Error).message || "Failed to save preferences");
    }
  };

  const categories = categoriesQuery.data ?? [];

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-background relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-background to-background" />
      <div className="absolute bottom-0 left-0 -z-10 h-[500px] w-[500px] bg-accent/30 blur-[100px] rounded-full opacity-50" />

      <div className="w-full max-w-2xl animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-heading font-bold tracking-tight text-primary">
            Briefly.
          </h1>
        </div>

        <Card className="glass-panel shadow-lg border-border/60 backdrop-blur-xl">
          <CardHeader className="text-center pb-8">
            <CardTitle className="text-2xl font-bold tracking-tight">
              What are you interested in?
            </CardTitle>
            <CardDescription className="text-base text-muted-foreground/80">
              Select at least 3 topics to personalize your daily brief.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {categoriesQuery.isLoading ? (
              <div className="flex justify-center p-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className={cn(
                      "group flex items-center space-x-3 rounded-xl border border-border/50 p-4 cursor-pointer transition-all duration-200 hover:shadow-md hover:border-primary/20",
                      selected.includes(category.id)
                        ? "border-primary bg-primary/5 shadow-sm ring-1 ring-primary/10"
                        : "bg-background/50 hover:bg-background",
                    )}
                    onClick={() => toggleCategory(category.id)}
                  >
                    <Checkbox
                      id={category.id}
                      checked={selected.includes(category.id)}
                      onCheckedChange={() => toggleCategory(category.id)}
                      className="data-[state=checked]:bg-primary data-[state=checked]:border-primary transition-all duration-200"
                    />
                    <Label
                      htmlFor={category.id}
                      className="cursor-pointer font-medium text-sm group-hover:text-primary transition-colors"
                    >
                      {category.name}
                    </Label>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-4 border-t border-border/40">
              <Button
                className="w-full h-12 text-base rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300"
                disabled={selected.length < 3 || updatePreferences.isPending}
                onClick={handleContinue}
              >
                {updatePreferences.isPending
                  ? "Saving..."
                  : selected.length < 3
                    ? `Select ${3 - selected.length} more to continue`
                    : `Continue with ${selected.length} topics`}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
