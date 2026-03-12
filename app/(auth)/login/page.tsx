"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";
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
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLoginMutation } from "@/api";
import { GoogleSignInButton } from "@/components/auth/google-signin-button";
import { toast } from "@/lib/toast";
import { useAtomValue } from "jotai";
import { authHydratedAtom } from "@/lib/auth/session-atom";
import { useAuth } from "@/lib/auth/use-auth";

export default function LoginPage() {
  const router = useRouter();
  const hydrated = useAtomValue(authHydratedAtom);
  const { isAuthenticated } = useAuth();
  const loginMutation = useLoginMutation();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (!hydrated) return;
    if (!isAuthenticated) return;
    router.replace("/dashboard");
  }, [hydrated, isAuthenticated, router]);

  if (!hydrated) return null;
  if (isAuthenticated) return null;

  const onSubmit = async (data: LoginInput) => {
    try {
      await loginMutation.mutateAsync(data);
      toast.success("Signed in");
      router.push("/dashboard");
    } catch (e) {
      toast.error((e as Error).message || "Sign in failed");
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
            Welcome back
          </CardTitle>
          <CardDescription className="text-base text-muted-foreground/80">
            Enter your credentials to access your daily brief
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="identifier" className="text-sm font-medium ml-1">
                Email or phone
              </Label>
              <Input
                id="identifier"
                type="text"
                placeholder="name@example.com or +2348012345678"
                className="h-11 rounded-xl bg-background/50 border-border/60 focus:bg-background transition-all duration-200"
                {...register("identifier")}
              />
              {errors.identifier && (
                <p className="text-sm text-destructive font-medium ml-1">
                  {errors.identifier.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/forgot-password"
                  className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="h-11 rounded-xl bg-background/50 border-border/60 focus:bg-background transition-all duration-200"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-sm text-destructive font-medium ml-1">
                  {errors.password.message}
                </p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full h-11 text-base rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300"
              disabled={isSubmitting || loginMutation.isPending}
            >
              {isSubmitting || loginMutation.isPending
                ? "Signing in..."
                : "Sign In"}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border/60" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground/80 font-medium">
                Or continue with
              </span>
            </div>
          </div>

          <GoogleSignInButton onSuccess={() => router.push("/dashboard")} />

          <div className="grid grid-cols-2 gap-3">
            <Button asChild variant="outline" className="h-11 rounded-xl">
              <Link href="/whatsapp">Continue with WhatsApp</Link>
            </Button>
            <Button asChild variant="outline" className="h-11 rounded-xl">
              <Link href="/telegram">Continue with Telegram</Link>
            </Button>
          </div>
        </CardContent>
        <CardFooter className="justify-center pb-8 border-t border-border/40 pt-6">
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-semibold text-primary hover:underline underline-offset-4 transition-all"
            >
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
