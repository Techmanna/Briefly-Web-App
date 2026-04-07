"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminLoginMutation } from "@/api/queries/admin";
import { setAccessToken } from "@/api/clients/session";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { toast } from "@/lib/toast";
import { Loader2, ShieldCheck } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const loginMutation = useAdminLoginMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await loginMutation.mutateAsync({ email, password });
      setAccessToken(res.access_token);
      toast.success("Login successful", {
        description: `Welcome back, ${res.user.name}`,
      });
      router.push("/admin/dashboard");
    } catch (err) {
      toast.error("Login failed", { description: (err as Error).message });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/30 p-4">
      <Card className="w-full max-w-md border-border/60 shadow-xl rounded-3xl overflow-hidden">
        <CardHeader className="space-y-3 pt-8 text-center">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-2">
            <ShieldCheck className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-heading font-bold">
            Admin Portal
          </CardTitle>
          <CardDescription>
            Enter your credentials to access the dashboard
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 px-8 pb-8">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@joinbriefly.ng"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="rounded-xl h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="rounded-xl h-12"
              />
            </div>
          </CardContent>
          <CardFooter className="px-8 pb-10 flex flex-col gap-4">
            <Button
              type="submit"
              className="w-full h-12 rounded-xl text-base font-medium"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Access Dashboard"
              )}
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              Unauthorized access is strictly prohibited.
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
