"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import {
  categoriesClient,
  useConfirmPhoneVerificationMutation,
  useRequestPhoneVerificationMutation,
  useSetPasswordMutation,
  useUpdatePreferencesMutation,
  usersClient,
} from "@/api";
import { useAuth } from "@/lib/auth/use-auth";
import { toast } from "@/lib/toast";

export default function SettingsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { session, clearSession } = useAuth();
  const userId = session?.user.id ?? "";

  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoriesClient.listCategories(),
  });

  const userQuery = useQuery({
    queryKey: ["user", userId],
    queryFn: () => usersClient.getUser(userId),
    enabled: Boolean(userId),
  });

  const user = userQuery.data;

  const updatePreferences = useUpdatePreferencesMutation(userId);
  const requestPhoneVerification = useRequestPhoneVerificationMutation(userId);
  const confirmPhoneVerification = useConfirmPhoneVerificationMutation(userId);
  const setPassword = useSetPasswordMutation();

  const [selectedCategoryIdsDraft, setSelectedCategoryIdsDraft] = useState<
    string[] | null
  >(null);
  const [emailEnabledDraft, setEmailEnabledDraft] = useState<boolean | null>(
    null,
  );
  const [pushEnabledDraft, setPushEnabledDraft] = useState<boolean | null>(
    null,
  );
  const [whatsappEnabledDraft, setWhatsappEnabledDraft] = useState<
    boolean | null
  >(null);
  const [telegramEnabledDraft, setTelegramEnabledDraft] = useState<
    boolean | null
  >(null);

  const [phoneNumberDraft, setPhoneNumberDraft] = useState<string | null>(null);
  const [phoneCode, setPhoneCode] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const selectedCategoryIds =
    selectedCategoryIdsDraft ??
    user?.subscriptions?.map((s) => s.category_id) ??
    [];
  const emailEnabled = emailEnabledDraft ?? Boolean(user?.email_enabled);
  const pushEnabled = pushEnabledDraft ?? Boolean(user?.push_enabled);
  const whatsappEnabled =
    whatsappEnabledDraft ?? Boolean(user?.whatsapp_enabled);
  const telegramEnabled =
    telegramEnabledDraft ?? Boolean(user?.telegram_enabled);

  const phoneNumber = phoneNumberDraft ?? user?.phone ?? "";

  const toggleCategoryId = (categoryId: string) => {
    setSelectedCategoryIdsDraft((prevDraft) => {
      const base = prevDraft ?? selectedCategoryIds;
      return base.includes(categoryId)
        ? base.filter((id) => id !== categoryId)
        : [...base, categoryId];
    });
  };

  async function onSaveCategories() {
    try {
      await updatePreferences.mutateAsync({ categoryIds: selectedCategoryIds });
      setSelectedCategoryIdsDraft(null);
      toast.success("Categories saved");
    } catch (e) {
      toast.error((e as Error).message || "Failed to save categories");
    }
  }

  async function onSavePreferences() {
    try {
      await updatePreferences.mutateAsync({
        emailEnabled,
        pushEnabled,
        whatsappEnabled,
        telegramEnabled,
      });
      setEmailEnabledDraft(null);
      setPushEnabledDraft(null);
      setWhatsappEnabledDraft(null);
      setTelegramEnabledDraft(null);
      toast.success("Preferences saved");
    } catch (e) {
      toast.error((e as Error).message || "Failed to save preferences");
    }
  }

  async function onRequestPhoneCode() {
    try {
      const res = await requestPhoneVerification.mutateAsync({ phoneNumber });
      setPhoneNumberDraft(null);
      toast.success("Code sent", { description: res.message });
    } catch (e) {
      toast.error((e as Error).message || "Failed to send code");
    }
  }

  async function onConfirmPhoneCode() {
    try {
      await confirmPhoneVerification.mutateAsync({ code: phoneCode });
      setPhoneCode("");
      toast.success("Phone verified");
    } catch (e) {
      toast.error((e as Error).message || "Failed to verify phone");
    }
  }

  async function onUpdatePassword() {
    if (!newPassword.trim()) return;
    try {
      await setPassword.mutateAsync({ password: newPassword });
      setNewPassword("");
      toast.success("Password updated");
    } catch (e) {
      toast.error((e as Error).message || "Failed to update password");
    }
  }

  function onLogout() {
    clearSession();
    queryClient.clear();
    toast.success("Logged out");
    router.push("/login");
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-heading font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your preferences and account settings.
        </p>
      </div>

      <div className="grid gap-8">
        <Card className="rounded-2xl shadow-sm border-border/60">
          <CardHeader>
            <CardTitle className="font-heading text-xl">Categories</CardTitle>
            <CardDescription className="text-base">
              Select the topics you want to see in your daily brief.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {(categoriesQuery.data ?? []).map((category) => (
                <div
                  key={category.id}
                  className={cn(
                    "flex items-center space-x-3 rounded-xl border border-border/50 p-4 cursor-pointer transition-all duration-200 hover:shadow-sm hover:border-primary/20",
                    selectedCategoryIds.includes(category.id)
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "bg-card",
                  )}
                  onClick={() => toggleCategoryId(category.id)}
                >
                  <Checkbox
                    id={`settings-${category.id}`}
                    checked={selectedCategoryIds.includes(category.id)}
                    onCheckedChange={() => toggleCategoryId(category.id)}
                    className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <Label
                    htmlFor={`settings-${category.id}`}
                    className="cursor-pointer font-medium text-sm"
                  >
                    {category.name}
                  </Label>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="border-t border-border/40 px-6 py-4 bg-muted/20 rounded-b-2xl">
            <Button
              className="rounded-full px-6 shadow-sm"
              onClick={onSaveCategories}
              disabled={
                categoriesQuery.isPending ||
                userQuery.isPending ||
                updatePreferences.isPending
              }
            >
              Save Categories
            </Button>
          </CardFooter>
        </Card>

        <Card className="rounded-2xl shadow-sm border-border/60">
          <CardHeader>
            <CardTitle className="font-heading text-xl">
              Delivery Preferences
            </CardTitle>
            <CardDescription className="text-base">
              Choose how you want to receive your briefs.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between space-x-4 p-4 rounded-xl border border-border/40 bg-card">
              <div className="flex flex-col space-y-1">
                <Label htmlFor="email-digest" className="font-medium text-base">
                  Email Digest
                </Label>
                <span className="text-sm text-muted-foreground">
                  Receive a daily email summary at 8:00 AM.
                </span>
              </div>
              <Switch
                id="email-digest"
                checked={emailEnabled}
                onCheckedChange={setEmailEnabledDraft}
                disabled={!user || updatePreferences.isPending}
              />
            </div>
            <div className="flex items-center justify-between space-x-4 p-4 rounded-xl border border-border/40 bg-card">
              <div className="flex flex-col space-y-1">
                <Label htmlFor="push" className="font-medium text-base">
                  Push Notifications
                </Label>
                <span className="text-sm text-muted-foreground">
                  Receive daily briefs as push notifications.
                </span>
              </div>
              <Switch
                id="push"
                checked={pushEnabled}
                onCheckedChange={setPushEnabledDraft}
                disabled={!user || updatePreferences.isPending}
              />
            </div>
            <div
              className={cn(
                "flex items-center justify-between space-x-4 p-4 rounded-xl border border-border/40 bg-card",
                user && !user.is_phone_verified ? "opacity-80" : "",
              )}
            >
              <div className="flex flex-col space-y-1">
                <Label htmlFor="whatsapp" className="font-medium text-base">
                  WhatsApp Delivery
                </Label>
                <span className="text-sm text-muted-foreground">
                  Receive briefs directly on WhatsApp.
                </span>
              </div>
              <Switch
                id="whatsapp"
                checked={whatsappEnabled}
                onCheckedChange={setWhatsappEnabledDraft}
                disabled={
                  !user ||
                  updatePreferences.isPending ||
                  (user && !user.is_phone_verified)
                }
              />
            </div>
            <div
              className={cn(
                "flex items-center justify-between space-x-4 p-4 rounded-xl border border-border/40 bg-card",
                user && !user.telegram_chat_id ? "opacity-80" : "",
              )}
            >
              <div className="flex flex-col space-y-1">
                <Label htmlFor="telegram" className="font-medium text-base">
                  Telegram Delivery
                </Label>
                <span className="text-sm text-muted-foreground">
                  Receive briefs directly on Telegram.
                </span>
              </div>
              <Switch
                id="telegram"
                checked={telegramEnabled}
                onCheckedChange={setTelegramEnabledDraft}
                disabled={
                  !user || updatePreferences.isPending || !user.telegram_chat_id
                }
              />
            </div>
          </CardContent>
          <CardFooter className="border-t border-border/40 px-6 py-4 bg-muted/20 rounded-b-2xl">
            <Button
              className="rounded-full px-6 shadow-sm"
              onClick={onSavePreferences}
              disabled={!user || updatePreferences.isPending}
            >
              Save Preferences
            </Button>
          </CardFooter>
        </Card>

        <Card className="rounded-2xl shadow-sm border-border/60">
          <CardHeader>
            <CardTitle className="font-heading text-xl">Phone Setup</CardTitle>
            <CardDescription className="text-base">
              Verify your phone to enable WhatsApp delivery and security.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium">
                Phone Number
              </Label>
              <div className="flex gap-3">
                <Input
                  id="phone"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumberDraft(e.target.value)}
                  placeholder="+2348012345678"
                  className="rounded-xl h-11"
                  disabled={!user || requestPhoneVerification.isPending}
                />
                <Button
                  variant="outline"
                  className="rounded-full border-border/60 hover:bg-muted"
                  onClick={onRequestPhoneCode}
                  disabled={
                    !user ||
                    requestPhoneVerification.isPending ||
                    !phoneNumber.trim()
                  }
                >
                  Send Code
                </Button>
              </div>
              <div className="text-sm text-muted-foreground">
                {user?.is_phone_verified ? "Verified" : "Not verified"}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone-code" className="text-sm font-medium">
                Verification Code
              </Label>
              <div className="flex gap-3">
                <Input
                  id="phone-code"
                  value={phoneCode}
                  onChange={(e) => setPhoneCode(e.target.value)}
                  placeholder="123456"
                  className="rounded-xl h-11"
                  disabled={!user || confirmPhoneVerification.isPending}
                />
                <Button
                  className="rounded-full px-6 shadow-sm"
                  onClick={onConfirmPhoneCode}
                  disabled={
                    !user ||
                    confirmPhoneVerification.isPending ||
                    !phoneCode.trim()
                  }
                >
                  Verify
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm border-border/60">
          <CardHeader>
            <CardTitle className="font-heading text-xl">Account</CardTitle>
            <CardDescription className="text-base">
              Update your account information.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <Input
                id="email"
                value={user?.email ?? ""}
                className="rounded-xl h-11"
                disabled
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Name
              </Label>
              <Input
                id="name"
                value={user?.name ?? ""}
                className="rounded-xl h-11"
                disabled
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                New Password
              </Label>
              <Input
                id="password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="rounded-xl h-11"
                disabled={setPassword.isPending}
              />
            </div>
          </CardContent>
          <CardFooter className="border-t border-border/40 px-6 py-4 bg-muted/20 rounded-b-2xl flex justify-between">
            <Button
              variant="outline"
              className="rounded-full border-border/60 hover:bg-muted"
              onClick={onUpdatePassword}
              disabled={!newPassword.trim() || setPassword.isPending}
            >
              Update Account
            </Button>
            <Button
              variant="destructive"
              className="rounded-full shadow-sm"
              onClick={onLogout}
            >
              Logout
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
