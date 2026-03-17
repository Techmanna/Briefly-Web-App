"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, type SignupInput } from "@/lib/validations/auth";
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
import { useRegisterMutation } from "@/api";
import { GoogleSignInButton } from "@/components/auth/google-signin-button";
import { toast } from "@/lib/toast";
import { WhatsAppIcon, TelegramIcon } from "@/components/icons";
import { useAtomValue } from "jotai";
import { authHydratedAtom } from "@/lib/auth/session-atom";
import { useAuth } from "@/lib/auth/use-auth";

export default function SignupPage() {
  const router = useRouter();
  const hydrated = useAtomValue(authHydratedAtom);
  const { isAuthenticated } = useAuth();
  const registerMutation = useRegisterMutation();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
  });

  useEffect(() => {
    if (!hydrated) return;
    if (!isAuthenticated) return;
    router.replace("/dashboard");
  }, [hydrated, isAuthenticated, router]);

  if (!hydrated) return null;
  if (isAuthenticated) return null;

  const onSubmit = async (data: SignupInput) => {
    try {
      await registerMutation.mutateAsync({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      toast.success("Account created");
      router.push("/onboarding");
    } catch (e) {
      toast.error((e as Error).message || "Sign up failed");
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
            Create an account
          </CardTitle>
          <CardDescription className="text-base text-muted-foreground/80">
            Enter your email below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium ml-1">
                Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Ada Lovelace"
                className="h-11 rounded-xl bg-background/50 border-border/60 focus:bg-background transition-all duration-200"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-sm text-destructive font-medium ml-1">
                  {errors.name.message}
                </p>
              )}
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
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm text-destructive font-medium ml-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium ml-1">
                Password
              </Label>
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
                {...register("confirmPassword")}
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
              disabled={isSubmitting || registerMutation.isPending}
            >
              {isSubmitting || registerMutation.isPending
                ? "Creating account..."
                : "Create Account"}
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

          <GoogleSignInButton onSuccess={() => router.push("/onboarding")} />

          <div className="grid grid-cols-2 gap-3">
            <Button
              asChild
              variant="outline"
              className="h-11 rounded-xl"
              aria-label="Continue with WhatsApp"
            >
              <Link href="/whatsapp">
                <WhatsAppIcon className="h-5 w-5 text-[#25D366]" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-11 rounded-xl"
              aria-label="Continue with Telegram"
              disabled={true}
            >
              <Link href="#">
                {/* /telegram */}
                <TelegramIcon className="h-5 w-5 text-[#24A1DE]" />
              </Link>
            </Button>
          </div>
        </CardContent>
        <CardFooter className="justify-center pb-8 border-t border-border/40 pt-6">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
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
