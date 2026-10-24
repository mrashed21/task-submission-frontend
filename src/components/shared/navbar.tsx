"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Code2,
  FileCheck2,
  LayoutDashboard,
  LogOut,
  Moon,
  Send,
  ShieldCheck,
  Sun,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { useTheme } from "@/lib/theme-context";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const isAdmin = user?.role === "ADMIN";
  const isMentor = user?.role === "MENTOR";
  const isStudent = user?.role === "STUDENT";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200 bg-white text-zinc-900 dark:border-zinc-800 dark:bg-black dark:text-zinc-100 transition-colors duration-150">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand / Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1877f2] text-white shadow-sm">
              <FileCheck2 className="h-5 w-5" />
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                DevReview<span className="text-[#1877f2]">Hub</span>
              </span>
            </div>
          </Link>

          {/* Navigation links based on logged-in role */}
          <nav className="hidden md:flex items-center gap-1.5 text-sm font-medium">
            {isAdmin && (
              <>
                <Link
                  href="/admin/dashboard"
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors",
                    pathname.startsWith("/admin")
                      ? "bg-purple-600/10 text-purple-600 font-semibold dark:bg-purple-600/20 dark:text-purple-400"
                      : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-white"
                  )}
                >
                  <ShieldCheck className="h-4 w-4" />
                  Admin Dashboard
                </Link>
                <Link
                  href="/mentor/dashboard"
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors",
                    pathname === "/mentor/dashboard"
                      ? "bg-[#1877f2]/10 text-[#1877f2] font-semibold dark:bg-[#1877f2]/20"
                      : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-white"
                  )}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Review Dashboard
                </Link>
              </>
            )}

            {isMentor && (
              <Link
                href="/mentor/dashboard"
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors",
                  pathname === "/mentor/dashboard"
                    ? "bg-[#1877f2]/10 text-[#1877f2] font-semibold dark:bg-[#1877f2]/20"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-white"
                )}
              >
                <LayoutDashboard className="h-4 w-4" />
                Review Dashboard
              </Link>
            )}

            {isStudent && (
              <>
                <Link
                  href="/student/submit"
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors",
                    pathname === "/student/submit"
                      ? "bg-[#1877f2]/10 text-[#1877f2] font-semibold dark:bg-[#1877f2]/20"
                      : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-white"
                  )}
                >
                  <Send className="h-4 w-4" />
                  Submit Project
                </Link>
                <Link
                  href="/student/my-submissions"
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors",
                    pathname === "/student/my-submissions"
                      ? "bg-[#1877f2]/10 text-[#1877f2] font-semibold dark:bg-[#1877f2]/20"
                      : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-white"
                  )}
                >
                  <Code2 className="h-4 w-4" />
                  My Submissions
                </Link>
              </>
            )}
          </nav>
        </div>

        {/* Right Action controls: Dark/Light toggle + User/Auth actions */}
        <div className="flex items-center gap-3">
          {/* Dark / Light Mode Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle dark/light theme"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors"
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4 text-amber-400" />
            ) : (
              <Moon className="h-4 w-4 text-zinc-700" />
            )}
          </button>

          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">{user.name}</p>
                <p className="text-[10px] text-[#1877f2] font-mono font-medium">
                  {user.role}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  logout();
                  router.push("/login");
                }}
                className="gap-1.5 text-xs h-8 border-zinc-200 bg-white hover:bg-zinc-100 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:text-zinc-200"
              >
                <LogOut className="h-3.5 w-3.5 text-zinc-400" />
                <span>Logout</span>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="text-xs h-8 text-zinc-700 dark:text-zinc-200">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm" className="text-xs h-8 bg-[#1877f2] hover:bg-[#166fe5] text-white shadow-sm">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
