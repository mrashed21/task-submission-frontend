"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, FileCheck2, GraduationCap, Loader2, Lock, Mail, UserCheck } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth-context";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in both email and password.");
      return;
    }

    setIsLoading(true);
    setError(null);

    const result = await login(email, password);
    setIsLoading(false);

    if (result.success) {
      if (email.includes("mentor") || email.includes("admin")) {
        router.push("/mentor/dashboard");
      } else {
        router.push("/student/submit");
      }
    } else {
      setError(result.message || "Failed to sign in. Please verify your credentials.");
    }
  };

  const fillDemoAccount = (role: "mentor" | "student") => {
    if (role === "mentor") {
      setEmail("mentor@example.com");
      setPassword("mentor1234");
    } else {
      setEmail("student@example.com");
      setPassword("student1234");
    }
    setError(null);
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <Card className="w-full max-w-md border-slate-800 bg-slate-900/70 shadow-2xl backdrop-blur-md">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20">
            <FileCheck2 className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <CardDescription>Sign in to your DevReviewHub account</CardDescription>
        </CardHeader>

        <CardContent>
          {/* Quick preset buttons */}
          <div className="mb-6 rounded-xl border border-slate-800 bg-slate-950/60 p-3">
            <p className="text-[11px] font-semibold text-slate-400 mb-2 uppercase tracking-wider text-center">
              Quick Fill Demo Accounts:
            </p>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-xs gap-1.5 h-8 border-slate-700 bg-slate-900/60 hover:bg-slate-800"
                onClick={() => fillDemoAccount("student")}
              >
                <GraduationCap className="h-3.5 w-3.5 text-indigo-400" />
                Student Demo
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-xs gap-1.5 h-8 border-slate-700 bg-slate-900/60 hover:bg-slate-800"
                onClick={() => fillDemoAccount("mentor")}
              >
                <UserCheck className="h-3.5 w-3.5 text-purple-400" />
                Mentor Demo
              </Button>
            </div>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                  <Mail className="h-4 w-4" />
                </div>
                <Input
                  type="email"
                  placeholder="name@example.com"
                  className="pl-9"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                  <Lock className="h-4 w-4" />
                </div>
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="pl-9"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-10 font-semibold"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-400">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="font-semibold text-indigo-400 hover:text-indigo-300 hover:underline"
            >
              Sign up as Student
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
