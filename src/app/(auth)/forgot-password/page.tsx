"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema, ForgotPasswordInput } from "@/lib/validations/auth";
import { createClient } from "@/lib/supabase/client";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const [authError, setAuthError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (values: ForgotPasswordInput) => {
    setIsLoading(true);
    setAuthError(null);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/settings/profile`,
      });

      if (error) {
        setAuthError(error.message);
        return;
      }
      setSuccess(true);
    } catch {
      setSuccess(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-slate-800 bg-[#0F1626]/90 shadow-2xl backdrop-blur-md">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-xl">Reset your password</CardTitle>
        <CardDescription>We will send secure recovery instructions to your email</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {authError && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start space-x-2 text-xs text-red-300">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{authError}</span>
          </div>
        )}

        {success ? (
          <div className="py-6 text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <h3 className="text-sm font-semibold text-white">Reset Link Dispatched</h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Please inspect your inbox for the password recovery link. Follow the instructions to choose a new password.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              id="forgot-email"
              label="Work Email"
              type="email"
              placeholder="founder@company.com"
              error={errors.email?.message}
              {...register("email")}
            />

            <Button type="submit" isLoading={isLoading} className="w-full h-10 text-xs font-semibold">
              Send Reset Instructions
            </Button>
          </form>
        )}
      </CardContent>

      <CardFooter className="justify-center border-t border-slate-800/60 pt-4">
        <Link href="/login" className="inline-flex items-center text-xs text-slate-400 hover:text-white">
          <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Return to sign in
        </Link>
      </CardFooter>
    </Card>
  );
}
