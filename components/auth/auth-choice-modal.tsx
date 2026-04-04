"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { GoogleSignInButton } from "@/components/auth/google-signin-button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneNumberInput } from "@/components/phone/phone-number-input";
import { WhatsAppIcon } from "@/components/icons";
import { cn } from "@/lib/utils";
import { toast } from "@/lib/toast";
import {
  useLoginMutation,
  useRegisterMutation,
  useSetPasswordMutation,
  useTelegramRegisterMutation,
  useWhatsappRequestOtpMutation,
  useWhatsappVerifyOtpMutation,
} from "@/api";
import { loginSchema, signupSchema } from "@/lib/validations/auth";
import type { TelegramRegisterResponse } from "@/api/clients/auth";
import { Loader2, ArrowLeft, Mail } from "lucide-react";

type AuthMode = "login" | "signup";

type Props = {
  open: boolean;
  mode: AuthMode;
  onClose: () => void;
};

export function AuthChoiceModal({ open, mode, onClose }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [step, setStep] = useState<
    | "choice"
    | "email"
    | "whatsapp_request"
    | "whatsapp_verify"
    | "set_password"
    | "telegram"
  >("choice");
  const [whatsappPhone, setWhatsappPhone] = useState("");
  const [telegramCopied, setTelegramCopied] = useState(false);

  const loginMutation = useLoginMutation();
  const registerMutation = useRegisterMutation();
  const whatsappRequestOtp = useWhatsappRequestOtpMutation();
  const whatsappVerifyOtp = useWhatsappVerifyOtpMutation();
  const setPasswordMutation = useSetPasswordMutation();
  const telegramMutation = useTelegramRegisterMutation();

  const title = useMemo(() => {
    if (step === "email")
      return mode === "signup" ? "Create your account" : "Welcome back";
    if (step === "whatsapp_request" || step === "whatsapp_verify")
      return "Continue with WhatsApp";
    if (step === "set_password") return "Set password";
    if (step === "telegram") return "Continue with Telegram";
    return mode === "signup" ? "Create your account" : "Welcome back";
  }, [mode, step]);

  const subtitle = useMemo(() => {
    if (step === "email") {
      return mode === "signup"
        ? "Continue with email to get started."
        : "Continue with email to sign in.";
    }
    if (step === "whatsapp_request")
      return "We’ll send an OTP to your phone number";
    if (step === "whatsapp_verify") {
      if (!whatsappPhone) return "Enter the OTP sent to your phone number";
      if (whatsappPhone.length <= 6)
        return `Enter the OTP sent to ${whatsappPhone}`;
      return `Enter the OTP sent to ${whatsappPhone.slice(0, 3)}•••${whatsappPhone.slice(-2)}`;
    }
    if (step === "set_password") return "Create a password for future logins";
    if (step === "telegram")
      return "Create a one-time token and connect via Telegram";
    return mode === "signup"
      ? "Choose a sign up method to get started."
      : "Choose a sign in method to continue.";
  }, [mode, step, whatsappPhone]);

  const goToEmail = () => setStep("email");

  const goToWhatsapp = () => setStep("whatsapp_request");

  const switchAuthMode = () => {
    const nextMode = mode === "login" ? "signup" : "login";
    const next = new URLSearchParams(searchParams.toString());
    next.set("auth", nextMode);
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname);
  };

  // const goToTelegram = () => setStep("telegram");

  const backToChoice = () => {
    setStep("choice");
  };

  const emailLoginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { identifier: "", password: "" },
  });

  const emailSignupForm = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const whatsappRequestSchema = z.object({
    phone: z.string().regex(/^\+\d{8,15}$/, "Enter a valid phone number"),
  });

  const whatsappVerifySchema = z.object({
    code: z.string().min(4, "OTP code is required"),
  });

  const whatsappRequestForm = useForm<z.infer<typeof whatsappRequestSchema>>({
    resolver: zodResolver(whatsappRequestSchema),
    defaultValues: { phone: "" },
  });

  const whatsappVerifyForm = useForm<z.infer<typeof whatsappVerifySchema>>({
    resolver: zodResolver(whatsappVerifySchema),
    defaultValues: { code: "" },
  });

  const setPasswordSchema = z
    .object({
      password: z.string().min(8, "Password must be at least 8 characters"),
      confirmPassword: z
        .string()
        .min(8, "Password must be at least 8 characters"),
    })
    .refine((data) => data.password === data.confirmPassword, {
      path: ["confirmPassword"],
      message: "Passwords do not match",
    });

  const setPasswordForm = useForm<z.infer<typeof setPasswordSchema>>({
    resolver: zodResolver(setPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent
        className={cn(
          "rounded-3xl p-0 overflow-hidden border-border/60 max-w-[520px] sm:max-w-md",
          "data-open:duration-200 data-closed:duration-150",
        )}
        showCloseButton
      >
        <div className="px-8 pt-10 pb-8 text-center bg-background">
          <div className="mx-auto mb-6 h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
            <div className="h-8 w-8 rounded-xl bg-primary" />
          </div>
          <div className="flex items-center justify-center relative">
            {step !== "choice" ? (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute left-0 rounded-xl"
                onClick={backToChoice}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            ) : null}
            <DialogHeader className="items-center">
              <DialogTitle className="text-3xl font-heading font-bold tracking-tight">
                {title}
              </DialogTitle>
              <DialogDescription className="text-base text-muted-foreground/80 max-w-sm">
                {subtitle}
              </DialogDescription>
            </DialogHeader>
          </div>
        </div>

        <div className="px-8 pb-10 space-y-6 bg-background">
          {step === "choice" ? (
            <div className="space-y-6 animate-fade-in">
              <div className="flex justify-center">
                <GoogleSignInButton
                  onSuccess={() => {
                    onClose();
                    router.push(mode === "signup" ? "/onboarding" : "/news");
                  }}
                />
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border/60" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground/80 font-medium">
                    Or
                  </span>
                </div>
              </div>

              <div className="grid gap-3">
                <Button
                  variant="outline"
                  className="h-10 rounded-full justify-center gap-3 text-sm"
                  onClick={goToWhatsapp}
                >
                  <WhatsAppIcon className="h-5 w-5 text-[#25D366]" />
                  Continue with WhatsApp
                </Button>
                {/* <Button
                  variant="outline"
                  className="h-10 rounded-full justify-center gap-3 text-sm"
                  onClick={goToTelegram}
                >
                  <TelegramIcon className="h-5 w-5 text-[#24A1DE]" />
                  Continue with Telegram
                </Button> */}
                <Button
                  variant="outline"
                  className="h-10 rounded-full justify-center text-sm"
                  onClick={goToEmail}
                >
                  <Mail className="h-5 w-5" />
                  Continue with email
                </Button>
              </div>
            </div>
          ) : null}

          {step === "email" ? (
            <div className="space-y-4 animate-fade-in">
              {mode === "login" ? (
                <form
                  onSubmit={emailLoginForm.handleSubmit(async (data) => {
                    try {
                      await loginMutation.mutateAsync(data);
                      toast.success("Signed in");
                      onClose();
                      router.push("/news");
                    } catch (e) {
                      toast.error((e as Error).message || "Sign in failed");
                    }
                  })}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label
                      htmlFor="identifier"
                      className="text-sm font-medium ml-1"
                    >
                      Email or phone
                    </Label>
                    <Input
                      id="identifier"
                      type="text"
                      placeholder="name@example.com or +2348012345678"
                      className="h-11 rounded-xl bg-background/50 border-border/60 focus:bg-background transition-all duration-200"
                      {...emailLoginForm.register("identifier")}
                    />
                    {emailLoginForm.formState.errors.identifier ? (
                      <p className="text-sm text-destructive font-medium ml-1">
                        {emailLoginForm.formState.errors.identifier.message}
                      </p>
                    ) : null}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between ml-1">
                      <Label htmlFor="password">Password</Label>
                      <Link
                        href="/forgot-password"
                        className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                        onClick={() => onClose()}
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      className="h-11 rounded-xl bg-background/50 border-border/60 focus:bg-background transition-all duration-200"
                      {...emailLoginForm.register("password")}
                    />
                    {emailLoginForm.formState.errors.password ? (
                      <p className="text-sm text-destructive font-medium ml-1">
                        {emailLoginForm.formState.errors.password.message}
                      </p>
                    ) : null}
                  </div>
                  <Button
                    type="submit"
                    className="w-full h-11 text-base rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300"
                    disabled={
                      emailLoginForm.formState.isSubmitting ||
                      loginMutation.isPending
                    }
                  >
                    {emailLoginForm.formState.isSubmitting ||
                    loginMutation.isPending
                      ? "Signing in..."
                      : "Sign In"}
                  </Button>
                </form>
              ) : (
                <form
                  onSubmit={emailSignupForm.handleSubmit(async (data) => {
                    try {
                      await registerMutation.mutateAsync({
                        name: data.name,
                        email: data.email,
                        password: data.password,
                      });
                      toast.success("Account created");
                      onClose();
                      router.push("/onboarding");
                    } catch (e) {
                      toast.error((e as Error).message || "Sign up failed");
                    }
                  })}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium ml-1">
                      Name
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Ada Lovelace"
                      className="h-11 rounded-xl bg-background/50 border-border/60 focus:bg-background transition-all duration-200"
                      {...emailSignupForm.register("name")}
                    />
                    {emailSignupForm.formState.errors.name ? (
                      <p className="text-sm text-destructive font-medium ml-1">
                        {emailSignupForm.formState.errors.name.message}
                      </p>
                    ) : null}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium ml-1">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      className="h-11 rounded-xl bg-background/50 border-border/60 focus:bg-background transition-all duration-200"
                      {...emailSignupForm.register("email")}
                    />
                    {emailSignupForm.formState.errors.email ? (
                      <p className="text-sm text-destructive font-medium ml-1">
                        {emailSignupForm.formState.errors.email.message}
                      </p>
                    ) : null}
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="password"
                      className="text-sm font-medium ml-1"
                    >
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      className="h-11 rounded-xl bg-background/50 border-border/60 focus:bg-background transition-all duration-200"
                      {...emailSignupForm.register("password")}
                    />
                    {emailSignupForm.formState.errors.password ? (
                      <p className="text-sm text-destructive font-medium ml-1">
                        {emailSignupForm.formState.errors.password.message}
                      </p>
                    ) : null}
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="confirmPassword"
                      className="text-sm font-medium ml-1"
                    >
                      Confirm Password
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      className="h-11 rounded-xl bg-background/50 border-border/60 focus:bg-background transition-all duration-200"
                      {...emailSignupForm.register("confirmPassword")}
                    />
                    {emailSignupForm.formState.errors.confirmPassword ? (
                      <p className="text-sm text-destructive font-medium ml-1">
                        {
                          emailSignupForm.formState.errors.confirmPassword
                            .message
                        }
                      </p>
                    ) : null}
                  </div>
                  <Button
                    type="submit"
                    className="w-full h-11 text-base rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300"
                    disabled={
                      emailSignupForm.formState.isSubmitting ||
                      registerMutation.isPending
                    }
                  >
                    {emailSignupForm.formState.isSubmitting ||
                    registerMutation.isPending
                      ? "Creating account..."
                      : "Create Account"}
                  </Button>
                </form>
              )}
            </div>
          ) : null}

          {step === "whatsapp_request" ? (
            <div className="space-y-4 animate-fade-in">
              <form
                onSubmit={whatsappRequestForm.handleSubmit(async (data) => {
                  try {
                    await whatsappRequestOtp.mutateAsync({ phone: data.phone });
                    toast.success("OTP sent");
                    setWhatsappPhone(data.phone);
                    setStep("whatsapp_verify");
                  } catch (e) {
                    toast.error((e as Error).message || "Failed to send OTP");
                  }
                })}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium ml-1">
                    Phone number
                  </Label>
                  <Controller
                    control={whatsappRequestForm.control}
                    name="phone"
                    render={({ field }) => (
                      <PhoneNumberInput
                        inputId="phone"
                        value={field.value}
                        onChange={field.onChange}
                        disabled={
                          whatsappRequestForm.formState.isSubmitting ||
                          whatsappRequestOtp.isPending
                        }
                        placeholder="8012345678"
                      />
                    )}
                  />
                  {whatsappRequestForm.formState.errors.phone ? (
                    <p className="text-sm text-destructive font-medium ml-1">
                      {whatsappRequestForm.formState.errors.phone.message}
                    </p>
                  ) : null}
                </div>
                <Button
                  type="submit"
                  className="w-full h-11 text-base rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300"
                  disabled={
                    whatsappRequestForm.formState.isSubmitting ||
                    whatsappRequestOtp.isPending
                  }
                >
                  {whatsappRequestForm.formState.isSubmitting ||
                  whatsappRequestOtp.isPending
                    ? "Sending..."
                    : "Send OTP"}
                </Button>
              </form>
            </div>
          ) : null}

          {step === "whatsapp_verify" ? (
            <div className="space-y-4 animate-fade-in">
              <form
                onSubmit={whatsappVerifyForm.handleSubmit(async (data) => {
                  try {
                    await whatsappVerifyOtp.mutateAsync({
                      phone: whatsappPhone,
                      code: data.code,
                    });
                    toast.success("Phone verified");
                    setStep("set_password");
                  } catch (e) {
                    toast.error((e as Error).message || "Failed to verify OTP");
                  }
                })}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="code" className="text-sm font-medium ml-1">
                    OTP code
                  </Label>
                  <Input
                    id="code"
                    type="text"
                    placeholder="123456"
                    className="h-11 rounded-xl bg-background/50 border-border/60 focus:bg-background transition-all duration-200"
                    {...whatsappVerifyForm.register("code")}
                  />
                  {whatsappVerifyForm.formState.errors.code ? (
                    <p className="text-sm text-destructive font-medium ml-1">
                      {whatsappVerifyForm.formState.errors.code.message}
                    </p>
                  ) : null}
                </div>
                <Button
                  type="submit"
                  className="w-full h-11 text-base rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300"
                  disabled={
                    whatsappVerifyForm.formState.isSubmitting ||
                    whatsappVerifyOtp.isPending
                  }
                >
                  {whatsappVerifyForm.formState.isSubmitting ||
                  whatsappVerifyOtp.isPending
                    ? "Verifying..."
                    : "Verify OTP"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-11 rounded-xl"
                  onClick={() => {
                    setStep("whatsapp_request");
                    whatsappVerifyForm.reset();
                    setWhatsappPhone("");
                  }}
                  disabled={whatsappVerifyOtp.isPending}
                >
                  Use a different number
                </Button>
              </form>
            </div>
          ) : null}

          {step === "set_password" ? (
            <div className="space-y-4 animate-fade-in">
              <form
                onSubmit={setPasswordForm.handleSubmit(async (data) => {
                  try {
                    await setPasswordMutation.mutateAsync({
                      password: data.password,
                    });
                    toast.success("Password saved");
                    onClose();
                    router.push("/news");
                  } catch (e) {
                    toast.error(
                      (e as Error).message || "Failed to save password",
                    );
                  }
                })}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label
                    htmlFor="newPassword"
                    className="text-sm font-medium ml-1"
                  >
                    Password
                  </Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="••••••••"
                    className="h-11 rounded-xl bg-background/50 border-border/60 focus:bg-background transition-all duration-200"
                    {...setPasswordForm.register("password")}
                  />
                  {setPasswordForm.formState.errors.password ? (
                    <p className="text-sm text-destructive font-medium ml-1">
                      {setPasswordForm.formState.errors.password.message}
                    </p>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="confirmNewPassword"
                    className="text-sm font-medium ml-1"
                  >
                    Confirm password
                  </Label>
                  <Input
                    id="confirmNewPassword"
                    type="password"
                    placeholder="••••••••"
                    className="h-11 rounded-xl bg-background/50 border-border/60 focus:bg-background transition-all duration-200"
                    {...setPasswordForm.register("confirmPassword")}
                  />
                  {setPasswordForm.formState.errors.confirmPassword ? (
                    <p className="text-sm text-destructive font-medium ml-1">
                      {setPasswordForm.formState.errors.confirmPassword.message}
                    </p>
                  ) : null}
                </div>
                <Button
                  type="submit"
                  className="w-full h-11 text-base rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300"
                  disabled={
                    setPasswordForm.formState.isSubmitting ||
                    setPasswordMutation.isPending
                  }
                >
                  {setPasswordForm.formState.isSubmitting ||
                  setPasswordMutation.isPending
                    ? "Saving..."
                    : "Save password"}
                </Button>
              </form>
            </div>
          ) : null}

          {step === "telegram" ? (
            <div className="space-y-4 animate-fade-in">
              <Button
                type="button"
                className="w-full h-11 text-base rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300"
                onClick={async () => {
                  try {
                    await telegramMutation.mutateAsync();
                    toast.success("Telegram token created");
                  } catch (e) {
                    toast.error(
                      (e as Error).message || "Failed to create token",
                    );
                  }
                }}
                disabled={telegramMutation.isPending}
              >
                {telegramMutation.isPending ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating...
                  </span>
                ) : (
                  "Create Telegram token"
                )}
              </Button>

              {(() => {
                const data = telegramMutation.data as
                  | TelegramRegisterResponse
                  | undefined;
                const token = data?.telegram?.token;
                const linkUrl = data?.telegram?.linkUrl;
                const expiresAt = data?.telegram?.expiresAt;
                if (!token) return null;

                const expiresText = expiresAt
                  ? (() => {
                      const date = new Date(expiresAt);
                      if (Number.isNaN(date.getTime())) return expiresAt;
                      return date.toLocaleString();
                    })()
                  : null;

                return (
                  <div className="space-y-3">
                    <div className="rounded-xl border border-border/60 bg-background/50 p-4">
                      <p className="text-sm text-muted-foreground">Token</p>
                      <p className="font-mono text-sm break-all">{token}</p>
                      {expiresText ? (
                        <p className="text-xs text-muted-foreground mt-2">
                          Expires: {expiresText}
                        </p>
                      ) : null}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        className="h-11 rounded-xl"
                        onClick={async () => {
                          await navigator.clipboard.writeText(token);
                          setTelegramCopied(true);
                          toast.success("Token copied");
                          window.setTimeout(
                            () => setTelegramCopied(false),
                            1200,
                          );
                        }}
                      >
                        {telegramCopied ? "Copied" : "Copy token"}
                      </Button>
                      <Button asChild className="h-11 rounded-xl">
                        <a
                          href={linkUrl || "https://web.telegram.org/"}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Open Telegram
                        </a>
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      In Telegram, start the bot and send the token.
                    </p>
                  </div>
                );
              })()}
            </div>
          ) : null}

          <div className="text-center text-sm text-muted-foreground">
            By continuing, you agree to Briefly&apos;s Terms and Privacy Policy.
          </div>

          <div className="w-full border-t border-border/60" />

          {step === "choice" || step === "email" ? (
            <div className="text-center text-sm text-muted-foreground">
              {mode === "login" ? (
                <>
                  Don&apos;t have an account?{" "}
                  <button
                    type="button"
                    className="font-semibold text-primary hover:text-primary/80 transition-colors"
                    onClick={switchAuthMode}
                  >
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    className="font-semibold text-primary hover:text-primary/80 transition-colors"
                    onClick={switchAuthMode}
                  >
                    Sign in
                  </button>
                </>
              )}
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
