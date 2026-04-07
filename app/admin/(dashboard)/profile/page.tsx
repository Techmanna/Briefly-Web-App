"use client";

import { useState } from "react";
import { useUpdateAdminProfileMutation } from "@/api/queries/admin";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "@/lib/toast";
import { Loader2, ShieldCheck, User, Mail, Lock } from "lucide-react";

export default function AdminProfilePage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const updateMutation = useUpdateAdminProfileMutation();

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name && !email && !password) {
      toast.info("No changes to update");
      return;
    }

    try {
      await updateMutation.mutateAsync({
        ...(name ? { name } : {}),
        ...(email ? { email } : {}),
        ...(password ? { password } : {}),
      });
      toast.success("Profile updated successfully");
      setPassword("");
    } catch (err) {
      toast.error("Update failed", { description: (err as Error).message });
    }
  };

  return (
    <div className="space-y-8 max-w-2xl">
      <div className="space-y-2">
        <h1 className="text-3xl font-heading font-bold tracking-tight">
          Admin Profile
        </h1>
        <p className="text-muted-foreground">
          Manage your administrative account settings.
        </p>
      </div>

      <Card className="border-border shadow-none rounded-lg overflow-hidden">
        <CardHeader className="bg-secondary/20 pb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
              <ShieldCheck className="h-8 w-8 text-primary" />
            </div>
            <div className="space-y-1">
              <CardTitle className="text-2xl font-heading font-bold">
                Account Settings
              </CardTitle>
              <CardDescription>
                Update your name, email, or password.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <form onSubmit={handleUpdate}>
          <CardContent className="space-y-6 pt-8">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="h-3.5 w-3.5 text-muted-foreground" />
                  Full Name
                </Label>
                <Input
                  id="name"
                  placeholder="Admin Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="rounded-xl h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@joinbriefly.ng"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-xl h-11"
                />
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <Label htmlFor="password" className="flex items-center gap-2">
                <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                New Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Leave blank to keep current"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-xl h-11"
              />
              <p className="text-[10px] text-muted-foreground ml-1">
                Must be at least 8 characters long.
              </p>
            </div>
          </CardContent>
          <CardFooter className="bg-secondary/10 px-6 py-4 flex justify-end">
            <Button
              type="submit"
              className="rounded-xl h-11 px-8 font-bold"
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
