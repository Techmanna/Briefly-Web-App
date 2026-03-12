"use client";

import { Suspense, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useResetPasswordMutation } from "@/api";
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

const schema = z
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

type FormValues = z.infer<typeof schema>;

function ResetPasswordInner() {
  const router = useRouter();
  const params = useSearchParams();
  const token = useMemo(() => params.get("token") ?? "", [params]);
  const mutation = useResetPasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormValues) => {
    try {
      await mutation.mutateAsync({ token, password: data.password });
      toast.success("Password updated");
      router.push("/login");
    } catch (e) {
      toast.error((e as Error).message || "Failed to reset password");
    }
  };

  const tokenMissing = !token;

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
            Reset password
          </CardTitle>
          <CardDescription className="text-base text-muted-foreground/80">
            Choose a new password for your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {tokenMissing ? (
            <p className="text-sm text-destructive font-medium">
              Missing reset token.
            </p>
          ) : null}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium ml-1">
                New password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="h-11 rounded-xl bg-background/50 border-border/60 focus:bg-background transition-all duration-200"
                {...register("password")}
                disabled={tokenMissing}
              />
              {errors.password && (
                <p className="text-sm text-destructive font-medium ml-1">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="confirmPassword"
                className="text-sm font-medium ml-1"
              >
                Confirm password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                className="h-11 rounded-xl bg-background/50 border-border/60 focus:bg-background transition-all duration-200"
                {...register("confirmPassword")}
                disabled={tokenMissing}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-destructive font-medium ml-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full h-11 text-base rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300"
              disabled={tokenMissing || isSubmitting || mutation.isPending}
            >
              {isSubmitting || mutation.isPending
                ? "Resetting..."
                : "Reset password"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center pb-8 border-t border-border/40 pt-6">
          <p className="text-sm text-muted-foreground">
            Back to{" "}
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

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full max-w-md animate-fade-in">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-heading font-bold tracking-tight text-primary">
              Briefly.
            </h1>
          </div>
          <Card className="glass-panel shadow-lg border-border/60 backdrop-blur-xl">
            <CardHeader className="space-y-1 text-center pb-8">
              <CardTitle className="text-2xl font-bold tracking-tight">
                Reset password
              </CardTitle>
              <CardDescription className="text-base text-muted-foreground/80">
                Loading...
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      }
    >
      <ResetPasswordInner />
    </Suspense>
  );
}
