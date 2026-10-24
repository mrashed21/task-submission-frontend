"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, FileCheck2, Loader2, Lock, Mail } from "lucide-react";
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
      const userRole = result.user?.role;
      const emailLower = email.toLowerCase();
      if (userRole === "ADMIN" || emailLower.includes("admin")) {
        router.push("/admin/dashboard");
      } else if (userRole === "MENTOR" || emailLower.includes("mentor")) {
        router.push("/mentor/dashboard");
      } else {
        router.push("/student/my-submissions");
      }
    } else {
      setError(result.message || "Failed to sign in. Please verify your credentials.");
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center p-4">
      <Card className="w-full max-w-md border border-zinc-200 bg-white shadow-lg dark:border-zinc-800 dark:bg-black">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#1877f2] text-white shadow-sm">
            <FileCheck2 className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Sign In</CardTitle>
          <CardDescription className="text-zinc-500 dark:text-zinc-400">
            Log in with your mentor or student email address
          </CardDescription>
        </CardHeader>

        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
                  <Mail className="h-4 w-4" />
                </div>
                <Input
                  type="email"
                  placeholder="mentor@example.com or student@example.com"
                  className="pl-9"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
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
              className="w-full h-10 font-semibold bg-[#1877f2] hover:bg-[#166fe5] text-white shadow-sm"
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

          {/* Clean minimal hint */}
          <div className="mt-5 rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-[11px] text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
            <p className="font-semibold text-zinc-800 dark:text-zinc-200 mb-1">Demo Accounts:</p>
            <p>&bull; Mentor: <code className="font-mono text-zinc-900 dark:text-zinc-100">mentor@example.com</code> / <code className="font-mono">mentor1234</code></p>
            <p>&bull; Student: <code className="font-mono text-zinc-900 dark:text-zinc-100">student@example.com</code> / <code className="font-mono">student1234</code></p>
          </div>

          <p className="mt-5 text-center text-xs text-zinc-500 dark:text-zinc-400">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="font-semibold text-[#1877f2] hover:underline"
            >
              Sign up as Student
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
