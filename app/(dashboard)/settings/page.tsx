"use client";

import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
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
import { PhoneNumberInput } from "@/components/phone/phone-number-input";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import {
  interestsClient,
  useConfirmPhoneVerificationMutation,
  useRequestPhoneVerificationMutation,
  useSetPasswordMutation,
  useUnmuteCategoryMutation,
  useUnmuteSourceMutation,
  useUserFeedbackPreferencesQuery,
  useUpdatePreferencesMutation,
  usersClient,
} from "@/api";
import { useAuth } from "@/lib/auth/use-auth";
import { toast } from "@/lib/toast";
import { getVAPIDkey } from "@/api/clients/config";
import { getFCM } from "@/lib/firebase";
import { getToken, deleteToken } from "firebase/messaging";

export default function SettingsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const { session, clearSession } = useAuth();
  const userId = session?.user.id ?? "";

  const interestsQuery = useQuery({
    queryKey: ["interests"],
    queryFn: () => interestsClient.listInterests(),
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
  const feedbackPrefsQuery = useUserFeedbackPreferencesQuery(userId);
  const unmuteCategory = useUnmuteCategoryMutation(userId);
  const unmuteSource = useUnmuteSourceMutation(userId);

  const [selectedTopicsDraft, setSelectedTopicsDraft] = useState<
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
  const [languagePreferenceDraft, setLanguagePreferenceDraft] = useState<
    ("en" | "pidgin" | "yoruba" | "hausa" | "igbo") | null
  >(null);

  const [phoneNumberDraft, setPhoneNumberDraft] = useState<string | null>(null);
  const [nameDraft, setNameDraft] = useState<string | null>(null);
  const [emailDraft, setEmailDraft] = useState<string | null>(null);
  const [phoneCode, setPhoneCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isVerificationPending, setIsVerificationPending] = useState(false);
  const [isPushSubscribing, setIsPushSubscribing] = useState(false);

  const section = searchParams.get("section");

  useEffect(() => {
    let el: HTMLElement | null = null;

    if (section === "whatsapp") {
      el = document.getElementById("whatsapp-setup");
    } else if (section === "preferences") {
      el = document.getElementById("delivery-preferences");
    }

    if (!el) return;

    window.setTimeout(() => {
      el!.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }, [section]);

  const selectedTopics = selectedTopicsDraft ?? user?.interests ?? [];
  const emailEnabled = emailEnabledDraft ?? Boolean(user?.email_enabled);
  const pushEnabled = pushEnabledDraft ?? Boolean(user?.push_enabled);
  const whatsappEnabled =
    whatsappEnabledDraft ?? Boolean(user?.whatsapp_enabled);
  const telegramEnabled =
    telegramEnabledDraft ?? Boolean(user?.telegram_enabled);
  const languagePreference =
    languagePreferenceDraft ?? user?.language_preference ?? "en";

  const phoneNumber =
    phoneNumberDraft !== null
      ? phoneNumberDraft
      : (user?.whatsapp_number ?? user?.phone ?? "");
  const name = nameDraft ?? user?.name ?? "";
  const email = emailDraft ?? user?.email ?? "";

  const toggleTopic = (slug: string) => {
    setSelectedTopicsDraft((prevDraft) => {
      const base = prevDraft ?? selectedTopics;
      return base.includes(slug)
        ? base.filter((s) => s !== slug)
        : [...base, slug];
    });
  };

  async function onSaveTopics() {
    if (selectedTopics.length < 3) {
      toast.error("Please select at least 3 topics.");
      return;
    }
    try {
      await updatePreferences.mutateAsync({ topics: selectedTopics });
      setSelectedTopicsDraft(null);
      toast.success("Topics saved");
    } catch (e) {
      toast.error((e as Error).message || "Failed to save topics");
    }
  }

  async function onSavePreferences() {
    try {
      await updatePreferences.mutateAsync({
        emailEnabled,
        pushEnabled,
        whatsappEnabled,
        telegramEnabled,
        languagePreference,
      });
      setEmailEnabledDraft(null);
      setPushEnabledDraft(null);
      setWhatsappEnabledDraft(null);
      setTelegramEnabledDraft(null);
      setLanguagePreferenceDraft(null);
      toast.success("Preferences saved");
    } catch (e) {
      toast.error((e as Error).message || "Failed to save preferences");
    }
  }

  async function onRequestPhoneCode() {
    if (!/^\+\d{8,15}$/.test(phoneNumber.trim())) {
      toast.error("Enter a valid phone number", {
        description: "Include the country code (e.g. +234...).",
      });
      return;
    }
    try {
      const res = await requestPhoneVerification.mutateAsync({ phoneNumber });
      setPhoneNumberDraft(phoneNumber.trim());
      setIsVerificationPending(true);
      await queryClient.invalidateQueries({ queryKey: ["user", userId] });
      toast.success("Code sent", { description: res.message });
    } catch (e) {
      toast.error((e as Error).message || "Failed to send code");
    }
  }

  async function onConfirmPhoneCode() {
    try {
      await confirmPhoneVerification.mutateAsync({ code: phoneCode });
      setPhoneCode("");
      setIsVerificationPending(false);
      setPhoneNumberDraft(null);
      await queryClient.invalidateQueries({ queryKey: ["user", userId] });
      toast.success("Phone verified");
    } catch (e) {
      toast.error((e as Error).message || "Failed to verify phone");
    }
  }

  async function onUpdateAccount() {
    try {
      const promises = [];

      if (newPassword.trim()) {
        if (newPassword.length < 8) {
          toast.error("Password must be at least 8 characters long");
          return;
        }
        promises.push(setPassword.mutateAsync({ password: newPassword }));
      }

      if (nameDraft !== null && name.trim()) {
        promises.push(updatePreferences.mutateAsync({ name: name.trim() }));
      }

      if (emailDraft !== null && email.trim()) {
        promises.push(updatePreferences.mutateAsync({ email: email.trim() }));
      }

      if (promises.length === 0) return;

      await Promise.all(promises);
      setNewPassword("");
      setNameDraft(null);
      setEmailDraft(null);
      toast.success("Account updated");
    } catch (e) {
      toast.error((e as Error).message || "Failed to update account");
    }
  }

  function onLogout() {
    router.push("/");
    clearSession();
    queryClient.clear();
    toast.success("Logged out");
  }

  async function onTogglePush(enabled: boolean) {
    setPushEnabledDraft(enabled);
    if (enabled) {
      await subscribeToPush();
    } else {
      await unsubscribeFromPush();
    }
  }

  async function subscribeToPush() {
    const messaging = await getFCM();
    if (!messaging) {
      toast.error("Firebase Messaging is not supported in this browser.");
      return;
    }

    setIsPushSubscribing(true);
    try {
      // Permission is handled automatically by getToken, but let's check
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        toast.error("Notification permission denied.");
        setPushEnabledDraft(false);
        return;
      }

      // Explicitly register the FCM service worker to ensure correct context
      const registration = await navigator.serviceWorker.register(
        "/firebase-messaging-sw.js",
        {
          scope: "/firebase-cloud-messaging-push-scope",
        },
      );

      const token = await getToken(messaging, {
        vapidKey: getVAPIDkey(),
        serviceWorkerRegistration: registration,
      });

      if (!token) {
        toast.error("Failed to get push token.");
        setPushEnabledDraft(false);
        return;
      }

      await updatePreferences.mutateAsync({
        pushToken: token,
        pushEnabled: true,
      });
      toast.success("Push notifications enabled!");
    } catch (error) {
      console.error("Failed to subscribe to push notifications", error);
      toast.error("Failed to enable push notifications.");
      setPushEnabledDraft(false);
    } finally {
      setIsPushSubscribing(false);
    }
  }

  async function unsubscribeFromPush() {
    const messaging = await getFCM();
    if (!messaging) return;

    setIsPushSubscribing(true);
    try {
      await deleteToken(messaging);
      await updatePreferences.mutateAsync({
        pushToken: undefined,
        pushEnabled: false,
      });
      toast.success("Push notifications disabled.");
    } catch (error) {
      console.error("Failed to unsubscribe from push notifications", error);
      toast.error("Failed to disable push notifications.");
    } finally {
      setIsPushSubscribing(false);
    }
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
            <CardTitle className="font-heading text-xl">Topics</CardTitle>
            <CardDescription className="text-base">
              Select the topics you want to see in your daily brief.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {(interestsQuery.data ?? []).map((interest) => (
                <div
                  key={interest.id}
                  className={cn(
                    "flex items-center space-x-3 rounded-xl border border-border/50 p-4 cursor-pointer transition-all duration-200 hover:shadow-sm hover:border-primary/20",
                    selectedTopics.includes(interest.slug)
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "bg-card",
                  )}
                  onClick={() => toggleTopic(interest.slug)}
                >
                  <Checkbox
                    id={`settings-${interest.id}`}
                    checked={selectedTopics.includes(interest.slug)}
                    onCheckedChange={() => toggleTopic(interest.slug)}
                    className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <Label
                    htmlFor={`settings-${interest.id}`}
                    className="cursor-pointer font-medium text-sm"
                  >
                    {interest.name}
                  </Label>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="border-t border-border/40 px-6 py-4 bg-muted/20 rounded-b-2xl">
            <Button
              className="rounded-full px-6 shadow-sm"
              onClick={onSaveTopics}
              disabled={
                selectedTopics.length < 3 ||
                interestsQuery.isPending ||
                userQuery.isPending ||
                updatePreferences.isPending
              }
            >
              {selectedTopics.length < 3
                ? `Select ${3 - selectedTopics.length} more`
                : "Save Topics"}
            </Button>
          </CardFooter>
        </Card>

        <Card
          id="delivery-preferences"
          className="rounded-2xl shadow-sm border-border/60"
        >
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
                onCheckedChange={onTogglePush}
                disabled={
                  !user || updatePreferences.isPending || isPushSubscribing
                }
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
            {/* <div
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
            </div> */}
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

        {/* <Card className="rounded-2xl shadow-sm border-border/60">
          <CardHeader>
            <CardTitle className="font-heading text-xl">Language</CardTitle>
            <CardDescription className="text-base">
              Choose the language you want your daily brief delivered in.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {(
                [
                  ["en", "English"],
                  ["pidgin", "Pidgin"],
                  ["yoruba", "Yoruba"],
                  ["hausa", "Hausa"],
                  ["igbo", "Igbo"],
                ] as const
              ).map(([value, label]) => (
                <Button
                  key={value}
                  type="button"
                  variant={languagePreference === value ? "default" : "outline"}
                  className={cn(
                    "rounded-full px-5",
                    languagePreference === value
                      ? ""
                      : "border-border/60 hover:bg-muted",
                  )}
                  onClick={() => setLanguagePreferenceDraft(value)}
                  disabled={!user || updatePreferences.isPending}
                >
                  {label}
                </Button>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              Translations are generated by AI and may be improved over time.
            </p>
          </CardContent>
          <CardFooter className="border-t border-border/40 px-6 py-4 bg-muted/20 rounded-b-2xl">
            <Button
              className="rounded-full px-6 shadow-sm"
              onClick={onSaveLanguagePreference}
              disabled={!user || updatePreferences.isPending}
            >
              Save Language
            </Button>
          </CardFooter>
        </Card> */}

        <Card
          id="whatsapp-setup"
          className="rounded-2xl shadow-sm border-border/60"
        >
          <CardHeader>
            <CardTitle className="font-heading text-xl">
              WhatsApp Setup
            </CardTitle>
            <CardDescription className="text-base">
              Verify your phone to enable WhatsApp delivery and security.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium">
                Phone Number
              </Label>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <PhoneNumberInput
                  inputId="phone"
                  value={phoneNumber}
                  onChange={(v) => setPhoneNumberDraft(v ?? "")}
                  placeholder="8012345678"
                  className="w-full sm:flex-1"
                  disabled={!user || requestPhoneVerification.isPending}
                />
                <Button
                  variant="outline"
                  className="rounded-full border-border/60 hover:bg-muted w-full sm:w-auto"
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
                {isVerificationPending
                  ? "Verification pending"
                  : user?.is_phone_verified
                    ? "Verified"
                    : "Not verified"}
              </div>
            </div>

            {isVerificationPending ? (
              <div className="space-y-2 animate-in fade-in duration-300">
                <Label htmlFor="phone-code" className="text-sm font-medium">
                  Verification Code
                </Label>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Input
                    id="phone-code"
                    value={phoneCode}
                    onChange={(e) => setPhoneCode(e.target.value)}
                    placeholder="123456"
                    className="rounded-xl h-11 w-full"
                    disabled={!user || confirmPhoneVerification.isPending}
                  />
                  <Button
                    className="rounded-full px-6 shadow-sm w-full sm:w-auto"
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
            ) : null}
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm border-border/60">
          <CardHeader>
            <CardTitle className="font-heading text-xl">
              Content Controls
            </CardTitle>
            <CardDescription className="text-base">
              Manage topics and sources you’ve muted via “Not interested”.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!user ? (
              <div className="text-sm text-muted-foreground">Loading...</div>
            ) : feedbackPrefsQuery.isPending ? (
              <div className="text-sm text-muted-foreground">Loading...</div>
            ) : feedbackPrefsQuery.isError ? (
              <div className="text-sm text-destructive">
                {(feedbackPrefsQuery.error as Error).message ||
                  "Failed to load content controls."}
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  <div className="text-sm font-semibold">Muted topics</div>
                  {(feedbackPrefsQuery.data?.categories ?? []).filter(
                    (c) => c.score <= -6,
                  ).length === 0 ? (
                    <div className="text-sm text-muted-foreground">
                      No muted topics.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {(feedbackPrefsQuery.data?.categories ?? [])
                        .filter((c) => c.score <= -6)
                        .map((c) => (
                          <div
                            key={c.id}
                            className="flex items-center justify-between rounded-xl border border-border/50 p-4 bg-card"
                          >
                            <div className="flex flex-col">
                              <div className="font-medium">
                                {c.category?.name || "Topic"}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Score: {c.score}
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              className="rounded-full border-border/60 hover:bg-muted"
                              onClick={async () => {
                                try {
                                  await unmuteCategory.mutateAsync(
                                    c.category_id,
                                  );
                                  toast.success("Topic unmuted");
                                } catch (e) {
                                  toast.error("Failed", {
                                    description: (e as Error).message,
                                  });
                                }
                              }}
                              disabled={unmuteCategory.isPending}
                            >
                              Unmute
                            </Button>
                          </div>
                        ))}
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="text-sm font-semibold">Muted sources</div>
                  {(feedbackPrefsQuery.data?.sources ?? []).filter(
                    (s) => s.score <= -6,
                  ).length === 0 ? (
                    <div className="text-sm text-muted-foreground">
                      No muted sources.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {(feedbackPrefsQuery.data?.sources ?? [])
                        .filter((s) => s.score <= -6)
                        .map((s) => (
                          <div
                            key={s.id}
                            className="flex items-center justify-between rounded-xl border border-border/50 p-4 bg-card"
                          >
                            <div className="flex flex-col">
                              <div className="font-medium">
                                {s.source?.name || "Source"}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Score: {s.score}
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              className="rounded-full border-border/60 hover:bg-muted"
                              onClick={async () => {
                                try {
                                  await unmuteSource.mutateAsync(s.source_id);
                                  toast.success("Source unmuted");
                                } catch (e) {
                                  toast.error("Failed", {
                                    description: (e as Error).message,
                                  });
                                }
                              }}
                              disabled={unmuteSource.isPending}
                            >
                              Unmute
                            </Button>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </>
            )}
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
                value={email}
                onChange={(e) => setEmailDraft(e.target.value)}
                className="rounded-xl h-11"
                disabled={Boolean(user?.email) || updatePreferences.isPending}
                placeholder="Enter your email"
              />
              {user?.email && (
                <p className="text-[10px] text-muted-foreground ml-1">
                  Email cannot be changed once set.
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setNameDraft(e.target.value)}
                className="rounded-xl h-11"
                disabled={updatePreferences.isPending}
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
                className={cn(
                  "rounded-xl h-11",
                  newPassword && newPassword.length < 8
                    ? "border-destructive focus-visible:ring-destructive"
                    : "",
                )}
                disabled={setPassword.isPending}
              />
              {newPassword && newPassword.length < 8 ? (
                <p className="text-xs text-destructive">
                  Password must be at least 8 characters long.
                </p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Minimum 8 characters.
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter className="border-t border-border/40 px-6 py-4 bg-muted/20 rounded-b-2xl flex justify-between">
            <Button
              variant="outline"
              className="rounded-full border-border/60 hover:bg-muted"
              onClick={onUpdateAccount}
              disabled={
                (newPassword.trim() === "" &&
                  (nameDraft === null || name.trim() === "") &&
                  (emailDraft === null || email.trim() === "")) ||
                (newPassword.trim() !== "" && newPassword.length < 8) ||
                setPassword.isPending ||
                updatePreferences.isPending
              }
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
