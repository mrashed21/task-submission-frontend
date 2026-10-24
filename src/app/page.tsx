"use client";

import Link from "next/link";
import { ArrowRight, FileCheck2, GraduationCap, LayoutDashboard, LogIn, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";

export default function HomePage() {
  const { user } = useAuth();

  const isAdmin = user?.role === "ADMIN";
  const isMentor = user?.role === "MENTOR";
  const isStudent = user?.role === "STUDENT";

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-16 sm:px-6 lg:px-8 bg-[#f0f2f5] dark:bg-[#18191a]">
      <div className="mx-auto max-w-2xl text-center space-y-6">
        {/* Facebook Brand Icon */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1877f2] text-white shadow-lg shadow-[#1877f2]/25">
          <FileCheck2 className="h-8 w-8" />
        </div>

        {/* Facebook Soft Blue Pill */}
        <div className="inline-flex items-center gap-2 rounded-full border border-[#cbe4fc] bg-[#e7f3ff] px-4 py-1.5 text-xs font-semibold text-[#1877f2] dark:border-[#1877f2]/30 dark:bg-[#1877f2]/15 dark:text-[#2d88ff]">
          <span>Project Evaluation Portal</span>
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-extrabold tracking-tight text-[#050505] dark:text-[#e4e6eb] sm:text-5xl leading-tight">
          DevReviewHub
        </h1>

        {/* Short Subtitle */}
        <p className="mx-auto max-w-lg text-sm sm:text-base text-[#65676b] dark:text-[#b0b3b8] leading-relaxed">
          A role-based engineering platform for students to submit assignments and mentors to evaluate code submissions with actionable feedback.
        </p>

        {/* Role-based Dynamic Actions - Strictly isolated to user's assigned dashboard */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          {user ? (
            isAdmin ? (
              <Link href="/admin/dashboard">
                <Button size="lg" className="gap-2 bg-[#1877f2] hover:bg-[#166fe5] text-white font-semibold shadow-sm">
                  <ShieldCheck className="h-5 w-5" />
                  Open Admin Dashboard
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            ) : isMentor ? (
              <Link href="/mentor/dashboard">
                <Button size="lg" className="gap-2 bg-[#1877f2] hover:bg-[#166fe5] text-white font-semibold shadow-sm">
                  <LayoutDashboard className="h-4 w-4" />
                  Open Mentor Dashboard
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <div className="flex flex-wrap gap-3">
                <Link href="/student/submit">
                  <Button size="lg" className="gap-2 bg-[#1877f2] hover:bg-[#166fe5] text-white font-semibold shadow-sm">
                    <GraduationCap className="h-4 w-4" />
                    Submit Project
                  </Button>
                </Link>
                <Link href="/student/my-submissions">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-[#ced0d4] dark:border-[#3a3b3c] bg-white dark:bg-[#242526] text-[#050505] dark:text-[#e4e6eb] hover:bg-[#e4e6eb]/60 dark:hover:bg-[#3a3b3c]"
                  >
                    My Submissions
                  </Button>
                </Link>
              </div>
            )
          ) : (
            <div className="flex flex-wrap gap-3">
              <Link href="/login">
                <Button size="lg" className="gap-2 bg-[#1877f2] hover:bg-[#166fe5] text-white font-semibold shadow-sm">
                  <LogIn className="h-4 w-4" />
                  Sign In
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/signup">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-[#ced0d4] dark:border-[#3a3b3c] bg-white dark:bg-[#242526] text-[#050505] dark:text-[#e4e6eb] hover:bg-[#e4e6eb]/60 dark:hover:bg-[#3a3b3c]"
                >
                  Create Account
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
