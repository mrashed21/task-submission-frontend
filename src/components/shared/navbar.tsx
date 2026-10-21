"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Code2,
  FileCheck2,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Send,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, setDemoUser } = useAuth();

  const isStudent = user?.role === "STUDENT";
  const isMentor = user?.role === "MENTOR" || user?.role === "ADMIN";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <FileCheck2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-white">
                DevReview<span className="text-indigo-400">Hub</span>
              </span>
              <p className="text-[10px] font-medium text-slate-400">
                Project Evaluation Portal
              </p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1.5 text-sm font-medium">
            {isStudent && (
              <>
                <Link
                  href="/student/submit"
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors",
                    pathname === "/student/submit"
                      ? "bg-indigo-600/20 text-indigo-300 font-semibold"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
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
                      ? "bg-indigo-600/20 text-indigo-300 font-semibold"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  )}
                >
                  <Code2 className="h-4 w-4" />
                  My Submissions
                </Link>
              </>
            )}

            {isMentor && (
              <Link
                href="/mentor/dashboard"
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors",
                  pathname === "/mentor/dashboard"
                    ? "bg-indigo-600/20 text-indigo-300 font-semibold"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                )}
              >
                <LayoutDashboard className="h-4 w-4" />
                Review Dashboard
              </Link>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {/* Quick Role Switcher for instant evaluation & demoing */}
          <div className="hidden sm:flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs">
            <button
              onClick={() => {
                setDemoUser("STUDENT");
                router.push("/student/submit");
              }}
              className={cn(
                "flex items-center gap-1 px-2.5 py-1 rounded-md transition-all",
                isStudent
                  ? "bg-indigo-600 text-white font-semibold shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              )}
            >
              <GraduationCap className="h-3.5 w-3.5" />
              Student
            </button>
            <button
              onClick={() => {
                setDemoUser("MENTOR");
                router.push("/mentor/dashboard");
              }}
              className={cn(
                "flex items-center gap-1 px-2.5 py-1 rounded-md transition-all",
                isMentor
                  ? "bg-purple-600 text-white font-semibold shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              )}
            >
              <UserCheck className="h-3.5 w-3.5" />
              Mentor
            </button>
          </div>

          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden lg:block text-right">
                <p className="text-xs font-semibold text-white">{user.name}</p>
                <p className="text-[10px] text-indigo-400 font-mono">
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
                className="gap-1.5 text-xs h-8"
              >
                <LogOut className="h-3.5 w-3.5 text-slate-400" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="text-xs h-8">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm" className="text-xs h-8">
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
