"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useForgotPasswordMutation } from "@/api";
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

const schema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type FormValues = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const mutation = useForgotPasswordMutation();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormValues) => {
    try {
      await mutation.mutateAsync(data);
      toast.success("Check your email", {
        description:
          "If the email exists, you’ll receive a reset link shortly.",
      });
    } catch (e) {
      toast.error((e as Error).message || "Failed to send reset link");
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
            Forgot password
          </CardTitle>
          <CardDescription className="text-base text-muted-foreground/80">
            We&apos;ll email you a reset link
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
            <Button
              type="submit"
              className="w-full h-11 text-base rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300"
              disabled={isSubmitting || mutation.isPending}
            >
              {isSubmitting || mutation.isPending
                ? "Sending..."
                : "Send reset link"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center pb-8 border-t border-border/40 pt-6">
          <p className="text-sm text-muted-foreground">
            Remembered your password?{" "}
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
