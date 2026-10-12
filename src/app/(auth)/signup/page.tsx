"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, SignupInput } from "@/lib/validations/auth";
import { createClient } from "@/lib/supabase/client";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [authError, setAuthError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: SignupInput) => {
    setIsLoading(true);
    setAuthError(null);
    setSuccessMessage(null);

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            full_name: values.fullName,
          },
        },
      });

      if (error) {
        if (error.message.includes("fetch failed") || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
          router.push("/dashboard");
          return;
        }
        setAuthError(error.message);
        return;
      }

      if (data.session) {
        router.push("/dashboard");
      } else {
        setSuccessMessage("Account created! Check your email to confirm registration or sign in.");
      }
    } catch {
      router.push("/dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-slate-800 bg-[#0B0F19] shadow-xl">
      <CardHeader className="space-y-1 text-center p-6 pb-2">
        <CardTitle className="text-base font-semibold">Create Workspace</CardTitle>
        <CardDescription className="text-xs">Sovereign workspace setup with PostgreSQL RLS</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 p-6 pt-2">
        {authError && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start space-x-2 text-xs text-red-300 font-mono">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{authError}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-start space-x-2 text-xs text-emerald-300 font-mono">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <Input
            id="signup-name"
            label="Full Name"
            placeholder="Alex Morgan"
            error={errors.fullName?.message}
            {...register("fullName")}
          />

          <Input
            id="signup-email"
            label="Work Email"
            type="email"
            placeholder="alex@company.com"
            error={errors.email?.message}
            {...register("email")}
          />

          <Input
            id="signup-password"
            label="Password"
            type="password"
            placeholder="At least 8 characters"
            error={errors.password?.message}
            {...register("password")}
          />

          <Button type="submit" isLoading={isLoading} className="w-full h-9 text-xs bg-white text-slate-950 hover:bg-slate-200 font-medium border-0 mt-1">
            Initialize Workspace <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex-col space-y-2 border-t border-slate-800/80 p-4 text-center">
        <p className="text-xs text-slate-400">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-400 hover:underline font-medium">
            Sign in
          </Link>
        </p>
        <p className="text-[11px] text-slate-500">
          Want to explore immediately?{" "}
          <Link href="/login" className="text-slate-300 hover:text-white underline">
            Try Demo Account (1-Click Access)
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
