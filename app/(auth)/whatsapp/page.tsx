"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useWhatsappRequestOtpMutation,
  useWhatsappVerifyOtpMutation,
} from "@/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "@/lib/toast";
import { useAtomValue } from "jotai";
import { authHydratedAtom } from "@/lib/auth/session-atom";
import { useAuth } from "@/lib/auth/use-auth";

const requestSchema = z.object({
  phone: z.string().min(6, "Phone number is required"),
});

const verifySchema = z.object({
  code: z.string().min(4, "OTP code is required"),
});

type RequestValues = z.infer<typeof requestSchema>;
type VerifyValues = z.infer<typeof verifySchema>;

export default function WhatsappAuthPage() {
  const router = useRouter();
  const hydrated = useAtomValue(authHydratedAtom);
  const { isAuthenticated } = useAuth();
  const requestOtp = useWhatsappRequestOtpMutation();
  const verifyOtp = useWhatsappVerifyOtpMutation();
  const [phone, setPhone] = useState("");
  const [step, setStep] = useState<"request" | "verify">("request");

  useEffect(() => {
    if (!hydrated) return;
    if (!isAuthenticated) return;
    router.replace("/dashboard");
  }, [hydrated, isAuthenticated, router]);

  const requestForm = useForm<RequestValues>({
    resolver: zodResolver(requestSchema),
    defaultValues: { phone: "" },
  });

  const verifyForm = useForm<VerifyValues>({
    resolver: zodResolver(verifySchema),
    defaultValues: { code: "" },
  });

  const maskedPhone = useMemo(() => {
    if (!phone) return "";
    if (phone.length <= 6) return phone;
    return `${phone.slice(0, 3)}•••${phone.slice(-2)}`;
  }, [phone]);

  if (!hydrated) return null;
  if (isAuthenticated) return null;

  const onRequest = async (data: RequestValues) => {
    try {
      await requestOtp.mutateAsync({ phone: data.phone });
      toast.success("OTP sent");
      setPhone(data.phone);
      setStep("verify");
    } catch (e) {
      toast.error((e as Error).message || "Failed to send OTP");
    }
  };

  const onVerify = async (data: VerifyValues) => {
    try {
      await verifyOtp.mutateAsync({ phone, code: data.code });
      toast.success("Phone verified");
      router.push("/set-password");
    } catch (e) {
      toast.error((e as Error).message || "Failed to verify OTP");
    }
  };

  return (
    <div className="w-full max-w-md animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-heading font-bold tracking-tight text-primary">
          Briefly.
        </h1>
      </div>
      <Card className="glass-panel shadow-lg border-border/60 backdrop-blur-xl">
        <CardHeader className="space-y-1 text-center pb-8">
          <CardTitle className="text-2xl font-bold tracking-tight">
            Continue with WhatsApp
          </CardTitle>
          <CardDescription className="text-base text-muted-foreground/80">
            {step === "request"
              ? "We’ll send an OTP to your phone number"
              : `Enter the OTP sent to ${maskedPhone}`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === "request" ? (
            <form
              onSubmit={requestForm.handleSubmit(onRequest)}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium ml-1">
                  Phone number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+2348012345678"
                  className="h-11 rounded-xl bg-background/50 border-border/60 focus:bg-background transition-all duration-200"
                  {...requestForm.register("phone")}
                />
                {requestForm.formState.errors.phone && (
                  <p className="text-sm text-destructive font-medium ml-1">
                    {requestForm.formState.errors.phone.message}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                className="w-full h-11 text-base rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300"
                disabled={
                  requestForm.formState.isSubmitting || requestOtp.isPending
                }
              >
                {requestForm.formState.isSubmitting || requestOtp.isPending
                  ? "Sending..."
                  : "Send OTP"}
              </Button>
            </form>
          ) : (
            <form
              onSubmit={verifyForm.handleSubmit(onVerify)}
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
                  {...verifyForm.register("code")}
                />
                {verifyForm.formState.errors.code && (
                  <p className="text-sm text-destructive font-medium ml-1">
                    {verifyForm.formState.errors.code.message}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                className="w-full h-11 text-base rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300"
                disabled={
                  verifyForm.formState.isSubmitting || verifyOtp.isPending
                }
              >
                {verifyForm.formState.isSubmitting || verifyOtp.isPending
                  ? "Verifying..."
                  : "Verify OTP"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full h-11 rounded-xl"
                onClick={() => {
                  setStep("request");
                  verifyForm.reset();
                }}
                disabled={verifyOtp.isPending}
              >
                Use a different number
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter className="justify-center pb-8 border-t border-border/40 pt-6">
          <p className="text-sm text-muted-foreground">
            Prefer email?{" "}
            <Link
              href="/login"
              className="font-semibold text-primary hover:underline underline-offset-4 transition-all"
            >
              Login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
