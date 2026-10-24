"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { useTheme } from "@/lib/theme-context";
import { cn } from "@/lib/utils";
import {
    FileCheck2,
    LayoutDashboard,
    LogOut,
    Moon,
    ShieldCheck,
    Sun,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const isAdmin = user?.role === "ADMIN";
  const isMentor = user?.role === "MENTOR";
  const isStudent = user?.role === "STUDENT";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200 bg-white text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 transition-colors duration-150">
      <div className="flex h-16 w-full items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand / Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1877f2] text-white shadow-sm">
              <FileCheck2 className="h-5 w-5" />
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                Task Submission
              </span>
            </div>
          </Link>

          {/* Navigation links based strictly on logged-in role - NO cross-dashboard links */}
          <nav className="hidden md:flex items-center gap-1.5 text-sm font-medium">
            {isAdmin && (
              <Link
                href="/admin/dashboard"
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors",
                  pathname.startsWith("/admin")
                    ? "bg-[#e7f3ff] text-[#1877f2] dark:bg-[#1877f2]/20 dark:text-[#2d88ff] font-semibold shadow-xs"
                    : "text-zinc-600 hover:bg-[#e4e6eb]/60 hover:text-[#050505] dark:text-zinc-300 dark:hover:bg-[#3a3b3c] dark:hover:text-white"
                )}
              >
                <ShieldCheck className="h-4 w-4" />
                Admin Dashboard
              </Link>
            )}

            {isMentor && (
              <Link
                href="/mentor/dashboard"
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors",
                  pathname.startsWith("/mentor")
                    ? "bg-[#e7f3ff] text-[#1877f2] dark:bg-[#1877f2]/20 dark:text-[#2d88ff] font-semibold shadow-xs"
                    : "text-zinc-600 hover:bg-[#e4e6eb]/60 hover:text-[#050505] dark:text-zinc-300 dark:hover:bg-[#3a3b3c] dark:hover:text-white"
                )}
              >
                <LayoutDashboard className="h-4 w-4" />
                Review Dashboard
              </Link>
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
              <Sun className="h-4 w-4 text-zinc-300" />
            ) : (
              <Moon className="h-4 w-4 text-zinc-700" />
            )}
          </button>

          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">{user.name}</p>
                <p className="text-[10px] text-zinc-500 font-mono font-medium">
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
                <Button size="sm" className="text-xs h-8 bg-zinc-900 hover:bg-zinc-800 text-zinc-50 dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-900 shadow-sm">
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
