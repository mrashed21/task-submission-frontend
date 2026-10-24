"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { useTheme } from "@/lib/theme-context";
import { cn } from "@/lib/utils";
import {
    Award,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Clock,
    Code2,
    FileCheck2,
    GraduationCap,
    LayoutDashboard,
    LogOut,
    Moon,
    PlusCircle,
    Send,
    ShieldCheck,
    Sparkles,
    Sun,
    Users,
    X,
    XCircle
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { CreateMentorDialog } from "../admin/create-mentor-dialog";

interface DashboardSidebarProps {
  onCloseMobile?: () => void;
  className?: string;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function DashboardSidebar({
  onCloseMobile,
  className,
  isCollapsed = false,
  onToggleCollapse,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [createMentorOpen, setCreateMentorOpen] = useState(false);

  const role = user?.role || "STUDENT";
  const isAdmin = role === "ADMIN";
  const isMentor = role === "MENTOR";
  const isStudent = role === "STUDENT";

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const roleLabel = {
    ADMIN: "Admin Portal",
    MENTOR: "Mentor Portal",
    STUDENT: "Student Portal",
  }[role] || "Portal";

  const RoleIcon = isAdmin ? ShieldCheck : isMentor ? Award : GraduationCap;

  return (
    <>
      <aside
        className={cn(
          "flex flex-col border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 transition-all duration-200 select-none",
          isCollapsed ? "w-20" : "w-64",
          className
        )}
      >
        {/* Sidebar Header with Role Pill & Mobile Close */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-zinc-200/80 dark:border-zinc-800/80">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#1877f2] text-white shadow-sm transition-transform hover:scale-105">
              <RoleIcon className="h-5 w-5" />
            </div>
            {!isCollapsed && (
              <div className="min-w-0">
                <span className="block truncate text-xs font-bold uppercase tracking-wider text-[#1877f2] dark:text-[#2d88ff]">
                  {roleLabel}
                </span>
                <span className="block truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  Task Submission
                </span>
              </div>
            )}
          </div>

          {/* Close button on mobile */}
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="md:hidden rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-900 dark:hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          )}

          {/* Collapse button on desktop */}
          {onToggleCollapse && !onCloseMobile && (
            <button
              onClick={onToggleCollapse}
              className="hidden md:flex h-7 w-7 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-500 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800"
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </button>
          )}
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {/* ADMIN NAVIGATION (STRICTLY WITHIN ADMIN DASHBOARD) */}
          {isAdmin && (
            <div className="space-y-1">
              {!isCollapsed && (
                <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-2">
                  Administration
                </p>
              )}
              <Link
                href="/admin/dashboard"
                onClick={onCloseMobile}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group",
                  pathname === "/admin/dashboard"
                    ? "bg-[#e7f3ff] text-[#1877f2] dark:bg-[#1877f2]/20 dark:text-[#2d88ff] font-semibold shadow-xs"
                    : "text-zinc-600 hover:bg-[#e4e6eb]/60 hover:text-[#050505] dark:text-zinc-400 dark:hover:bg-[#3a3b3c] dark:hover:text-[#e4e6eb]"
                )}
                title="Admin Dashboard"
              >
                <LayoutDashboard className="h-4 w-4 shrink-0" />
                {!isCollapsed && <span>Admin Overview</span>}
              </Link>

              <Link
                href="/admin/mentors"
                onClick={onCloseMobile}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group",
                  pathname === "/admin/mentors"
                    ? "bg-[#e7f3ff] text-[#1877f2] dark:bg-[#1877f2]/20 dark:text-[#2d88ff] font-semibold shadow-xs"
                    : "text-zinc-600 hover:bg-[#e4e6eb]/60 hover:text-[#050505] dark:text-zinc-400 dark:hover:bg-[#3a3b3c] dark:hover:text-[#e4e6eb]"
                )}
                title="Manage Mentors"
              >
                <Users className="h-4 w-4 shrink-0" />
                {!isCollapsed && <span>Manage Mentors</span>}
              </Link>

              <Link
                href="/admin/students"
                onClick={onCloseMobile}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group",
                  pathname === "/admin/students"
                    ? "bg-[#e7f3ff] text-[#1877f2] dark:bg-[#1877f2]/20 dark:text-[#2d88ff] font-semibold shadow-xs"
                    : "text-zinc-600 hover:bg-[#e4e6eb]/60 hover:text-[#050505] dark:text-zinc-400 dark:hover:bg-[#3a3b3c] dark:hover:text-[#e4e6eb]"
                )}
                title="Student Directory"
              >
                <GraduationCap className="h-4 w-4 shrink-0" />
                {!isCollapsed && <span>Student Directory</span>}
              </Link>

              <Link
                href="/admin/submissions"
                onClick={onCloseMobile}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group",
                  pathname === "/admin/submissions"
                    ? "bg-[#e7f3ff] text-[#1877f2] dark:bg-[#1877f2]/20 dark:text-[#2d88ff] font-semibold shadow-xs"
                    : "text-zinc-600 hover:bg-[#e4e6eb]/60 hover:text-[#050505] dark:text-zinc-400 dark:hover:bg-[#3a3b3c] dark:hover:text-[#e4e6eb]"
                )}
                title="Submissions Oversight"
              >
                <FileCheck2 className="h-4 w-4 shrink-0" />
                {!isCollapsed && <span>Submissions Stream</span>}
              </Link>

              {/* Quick action: Create Mentor */}
              <div className="pt-3">
                <Button
                  onClick={() => setCreateMentorOpen(true)}
                  className={cn(
                    "w-full gap-2 bg-[#1877f2] hover:bg-[#166fe5] text-white text-xs font-semibold shadow-sm transition-all",
                    isCollapsed ? "px-0 justify-center h-10" : "h-9"
                  )}
                  title="Create Mentor"
                >
                  <PlusCircle className="h-4 w-4 shrink-0" />
                  {!isCollapsed && <span>+ Create Mentor</span>}
                </Button>
              </div>
            </div>
          )}

          {/* MENTOR NAVIGATION (STRICTLY WITHIN MENTOR DASHBOARD) */}
          {isMentor && (
            <div className="space-y-1">
              {!isCollapsed && (
                <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-2">
                  Review Center
                </p>
              )}
              <Link
                href="/mentor/dashboard"
                onClick={onCloseMobile}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group",
                  pathname === "/mentor/dashboard"
                    ? "bg-[#e7f3ff] text-[#1877f2] dark:bg-[#1877f2]/20 dark:text-[#2d88ff] font-semibold shadow-xs"
                    : "text-zinc-600 hover:bg-[#e4e6eb]/60 hover:text-[#050505] dark:text-zinc-400 dark:hover:bg-[#3a3b3c] dark:hover:text-[#e4e6eb]"
                )}
                title="All Submissions"
              >
                <LayoutDashboard className="h-4 w-4 shrink-0" />
                {!isCollapsed && <span>All Submissions</span>}
              </Link>

              <Link
                href="/mentor/pending"
                onClick={onCloseMobile}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group",
                  pathname === "/mentor/pending"
                    ? "bg-[#e7f3ff] text-[#1877f2] dark:bg-[#1877f2]/20 dark:text-[#2d88ff] font-semibold shadow-xs"
                    : "text-zinc-600 hover:bg-[#e4e6eb]/60 hover:text-[#050505] dark:text-zinc-400 dark:hover:bg-[#3a3b3c] dark:hover:text-[#e4e6eb]"
                )}
                title="Pending Reviews"
              >
                <Clock className="h-4 w-4 shrink-0" />
                {!isCollapsed && <span>Pending Reviews</span>}
              </Link>

              <Link
                href="/mentor/approved"
                onClick={onCloseMobile}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group",
                  pathname === "/mentor/approved"
                    ? "bg-[#e7f3ff] text-[#1877f2] dark:bg-[#1877f2]/20 dark:text-[#2d88ff] font-semibold shadow-xs"
                    : "text-zinc-600 hover:bg-[#e4e6eb]/60 hover:text-[#050505] dark:text-zinc-400 dark:hover:bg-[#3a3b3c] dark:hover:text-[#e4e6eb]"
                )}
                title="Approved Submissions"
              >
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                {!isCollapsed && <span>Approved Submissions</span>}
              </Link>

              <Link
                href="/mentor/rejected"
                onClick={onCloseMobile}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group",
                  pathname === "/mentor/rejected"
                    ? "bg-[#e7f3ff] text-[#1877f2] dark:bg-[#1877f2]/20 dark:text-[#2d88ff] font-semibold shadow-xs"
                    : "text-zinc-600 hover:bg-[#e4e6eb]/60 hover:text-[#050505] dark:text-zinc-400 dark:hover:bg-[#3a3b3c] dark:hover:text-[#e4e6eb]"
                )}
                title="Needs Revisions"
              >
                <XCircle className="h-4 w-4 shrink-0" />
                {!isCollapsed && <span>Needs Revisions</span>}
              </Link>
            </div>
          )}

          {/* STUDENT NAVIGATION (STRICTLY WITHIN STUDENT DASHBOARD) */}
          {isStudent && (
            <div className="space-y-1">
              {!isCollapsed && (
                <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-2">
                  My Projects
                </p>
              )}
              <Link
                href="/student/my-submissions"
                onClick={onCloseMobile}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group",
                  pathname === "/student/my-submissions"
                    ? "bg-[#e7f3ff] text-[#1877f2] dark:bg-[#1877f2]/20 dark:text-[#2d88ff] font-semibold shadow-xs"
                    : "text-zinc-600 hover:bg-[#e4e6eb]/60 hover:text-[#050505] dark:text-zinc-400 dark:hover:bg-[#3a3b3c] dark:hover:text-[#e4e6eb]"
                )}
                title="My Submissions"
              >
                <Code2 className="h-4 w-4 shrink-0" />
                {!isCollapsed && <span>My Submissions</span>}
              </Link>

              <Link
                href="/student/submit"
                onClick={onCloseMobile}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group",
                  pathname === "/student/submit"
                    ? "bg-[#e7f3ff] text-[#1877f2] dark:bg-[#1877f2]/20 dark:text-[#2d88ff] font-semibold shadow-xs"
                    : "text-zinc-600 hover:bg-[#e4e6eb]/60 hover:text-[#050505] dark:text-zinc-400 dark:hover:bg-[#3a3b3c] dark:hover:text-[#e4e6eb]"
                )}
                title="Submit Project"
              >
                <Send className="h-4 w-4 shrink-0" />
                {!isCollapsed && <span>Submit Project</span>}
              </Link>

              {/* Student tip card */}
              {!isCollapsed && (
                <div className="mt-4 rounded-xl border border-[#cbe4fc] bg-[#e7f3ff]/60 p-3 text-xs dark:border-[#1877f2]/30 dark:bg-[#1877f2]/10">
                  <div className="flex items-center gap-1.5 font-semibold text-[#1877f2] dark:text-[#2d88ff]">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Submission Tip</span>
                  </div>
                  <p className="mt-1 text-[11px] text-zinc-600 dark:text-zinc-300 leading-relaxed">
                    Always test your live link and ensure repository visibility is Public before submitting.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* User Card & Controls at Bottom */}
        <div className="border-t border-zinc-200 p-3 dark:border-zinc-800 space-y-2">
          {user ? (
            <div
              className={cn(
                "flex items-center gap-3 rounded-xl p-2 bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800",
                isCollapsed && "justify-center p-1"
              )}
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-bold text-xs bg-[#1877f2] text-white">
                {getInitials(user.name || "User")}
              </div>
              {!isCollapsed && (
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                    {user.name}
                  </p>
                  <p className="truncate text-[10px] text-zinc-500 dark:text-zinc-400 font-mono">
                    {user.role}
                  </p>
                </div>
              )}
            </div>
          ) : null}

          {/* Bottom actions: Theme Toggle + Logout */}
          <div className={cn("flex items-center gap-1.5", isCollapsed ? "flex-col" : "justify-between")}>
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-600 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 transition-colors"
              title={theme === "dark" ? "Light Mode" : "Dark Mode"}
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4 text-zinc-300" />
              ) : (
                <Moon className="h-4 w-4 text-zinc-700" />
              )}
            </button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                logout();
                router.push("/login");
              }}
              className={cn(
                "text-xs text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-900 h-8",
                isCollapsed ? "w-8 p-0" : "flex-1 justify-start gap-2"
              )}
              title="Sign Out"
            >
              <LogOut className="h-3.5 w-3.5 shrink-0" />
              {!isCollapsed && <span>Sign Out</span>}
            </Button>
          </div>
        </div>
      </aside>

      {/* Admin quick create mentor dialog instance */}
      {isAdmin && (
        <CreateMentorDialog
          open={createMentorOpen}
          onOpenChange={setCreateMentorOpen}
          onMentorCreated={() => {
            if (typeof window !== "undefined") {
              window.dispatchEvent(new CustomEvent("mentor-created"));
            }
          }}
        />
      )}
    </>
  );
}
