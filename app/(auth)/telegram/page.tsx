"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useTelegramRegisterMutation } from "@/api";
import type { TelegramRegisterResponse } from "@/api/clients/auth";
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

export default function TelegramAuthPage() {
  const mutation = useTelegramRegisterMutation();
  const [copied, setCopied] = useState(false);

  const data = mutation.data as TelegramRegisterResponse | undefined;
  const token = data?.telegram?.token;
  const linkUrl = data?.telegram?.linkUrl;
  const expiresAt = data?.telegram?.expiresAt;

  const expiresText = useMemo(() => {
    if (!expiresAt) return null;
    const date = new Date(expiresAt);
    if (Number.isNaN(date.getTime())) return expiresAt;
    return date.toLocaleString();
  }, [expiresAt]);

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
            Continue with Telegram
          </CardTitle>
          <CardDescription className="text-base text-muted-foreground/80">
            Create a one-time token and connect via Telegram
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            type="button"
            className="w-full h-11 text-base rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300"
            onClick={async () => {
              try {
                await mutation.mutateAsync();
                toast.success("Telegram token created");
              } catch (e) {
                toast.error((e as Error).message || "Failed to create token");
              }
            }}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Creating..." : "Create Telegram token"}
          </Button>

          {token ? (
            <div className="space-y-2">
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
                    setCopied(true);
                    toast.success("Token copied");
                    window.setTimeout(() => setCopied(false), 1200);
                  }}
                >
                  {copied ? "Copied" : "Copy token"}
                </Button>
                {linkUrl ? (
                  <Button asChild className="h-11 rounded-xl">
                    <a href={linkUrl} target="_blank" rel="noreferrer">
                      Open Telegram
                    </a>
                  </Button>
                ) : (
                  <Button asChild className="h-11 rounded-xl" variant="outline">
                    <a
                      href="https://web.telegram.org/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Open Telegram
                    </a>
                  </Button>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                In Telegram, start the bot and send the token.
              </p>
            </div>
          ) : null}
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
