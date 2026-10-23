"use client";

import Link from "next/link";
import { ArrowRight, FileCheck2, GraduationCap, LayoutDashboard, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";

export default function HomePage() {
  const { user } = useAuth();

  const isMentor = user?.role === "MENTOR" || user?.role === "ADMIN";
  const isStudent = user?.role === "STUDENT";

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-16 sm:px-6 lg:px-8 bg-white dark:bg-black">
      <div className="mx-auto max-w-2xl text-center space-y-6">
        {/* Simple Brand Icon */}
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1877f2] text-white shadow-sm">
          <FileCheck2 className="h-7 w-7" />
        </div>

        {/* Minimal Pill */}
        <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3.5 py-1 text-xs font-medium text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
          <span>Project Evaluation Portal</span>
        </div>

        {/* Minimal Heading */}
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-5xl leading-tight">
          DevReview<span className="text-[#1877f2]">Hub</span>
        </h1>

        {/* Short Subtitle */}
        <p className="mx-auto max-w-lg text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
          A minimal, role-based platform for engineering students to submit assignments and mentors to evaluate code submissions with actionable feedback.
        </p>

        {/* Role-based Dynamic Actions */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          {user ? (
            isMentor ? (
              <Link href="/mentor/dashboard">
                <Button size="lg" className="gap-2 bg-[#1877f2] hover:bg-[#166fe5] text-white font-semibold">
                  <LayoutDashboard className="h-4 w-4" />
                  Open Mentor Dashboard
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <div className="flex flex-wrap gap-3">
                <Link href="/student/submit">
                  <Button size="lg" className="gap-2 bg-[#1877f2] hover:bg-[#166fe5] text-white font-semibold">
                    <GraduationCap className="h-4 w-4" />
                    Submit Project
                  </Button>
                </Link>
                <Link href="/student/my-submissions">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-zinc-300 dark:border-zinc-800 bg-transparent text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900"
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
                  className="border-zinc-300 dark:border-zinc-800 bg-transparent text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                >
                  Create Student Account
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
