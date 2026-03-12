"use client";

import { Suspense, useEffect, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useVerifyEmailMutation } from "@/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/lib/toast";

function VerifyEmailInner() {
  const params = useSearchParams();
  const token = useMemo(() => params.get("token") ?? "", [params]);
  const mutation = useVerifyEmailMutation();
  const mutate = mutation.mutate;

  useEffect(() => {
    if (!token) return;
    mutate(token, {
      onSuccess: () => toast.success("Email verified"),
      onError: (e) =>
        toast.error((e as Error).message || "Email verification failed"),
    });
  }, [mutate, token]);

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
            Verify email
          </CardTitle>
          <CardDescription className="text-base text-muted-foreground/80">
            Confirming your email address
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          {!token ? (
            <p className="text-sm text-destructive font-medium">
              Missing verification token.
            </p>
          ) : null}
          {mutation.isPending ? (
            <p className="text-sm text-muted-foreground">Verifying...</p>
          ) : null}
          {mutation.isSuccess ? (
            <p className="text-sm text-muted-foreground">
              Your email has been verified.
            </p>
          ) : null}
          <Button
            asChild
            className="w-full h-11 text-base rounded-xl font-semibold"
          >
            <Link href="/login">Continue to login</Link>
          </Button>
        </CardContent>
        <CardFooter className="justify-center pb-8 border-t border-border/40 pt-6">
          <p className="text-sm text-muted-foreground">
            Need help?{" "}
            <Link
              href="/forgot-password"
              className="font-semibold text-primary hover:underline underline-offset-4 transition-all"
            >
              Reset password
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function VerifyEmailPage() {
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
                Verify email
              </CardTitle>
              <CardDescription className="text-base text-muted-foreground/80">
                Loading...
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      }
    >
      <VerifyEmailInner />
    </Suspense>
  );
}
