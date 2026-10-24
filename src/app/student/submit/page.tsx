"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { SubmissionForm } from "@/components/submission/submission-form";
import { useAuth } from "@/lib/auth-context";

export default function StudentSubmitPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.replace("/login");
      } else if (user.role === "ADMIN") {
        router.replace("/admin/dashboard");
      } else if (user.role === "MENTOR") {
        router.replace("/mentor/dashboard");
      }
    }
  }, [user, isLoading, router]);

  return (
    <div className="mx-auto max-w-4xl py-2 space-y-8">
      <div className="mb-8 text-center sm:text-left">
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-4xl">
          Project Submission Portal
        </h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          Ensure your repository is accessible and provides clear documentation. Our mentors review submissions continuously.
        </p>
      </div>

      <SubmissionForm />
    </div>
  );
}
