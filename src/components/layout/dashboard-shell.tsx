"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, ShieldCheck } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { UserRole } from "@/lib/types";
import { DashboardSidebar } from "./dashboard-sidebar";

interface DashboardShellProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export function DashboardShell({
  children,
  allowedRoles,
}: DashboardShellProps) {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.replace("/login");
      } else if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        // Redirect unauthorized roles appropriately
        if (user.role === "ADMIN") {
          router.replace("/admin/dashboard");
        } else if (user.role === "MENTOR") {
          router.replace("/mentor/dashboard");
        } else {
          router.replace("/student/my-submissions");
        }
      }
    }
  }, [user, isLoading, allowedRoles, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-white dark:bg-black">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#1877f2] border-t-transparent" />
          <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-zinc-50/50 dark:bg-black transition-colors duration-150">
      {/* Desktop Sidebar (pinned left, sticky under top navbar) */}
      <div className="hidden md:block shrink-0 sticky top-16 h-[calc(100vh-4rem)]">
        <DashboardSidebar
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
          className="h-full shadow-sm"
        />
      </div>

      {/* Mobile Drawer Backdrop & Sidebar */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileSidebarOpen(false)}
          />
          {/* Off-canvas sidebar */}
          <div className="relative z-50 flex h-full w-72 max-w-[85vw] flex-col bg-white shadow-2xl dark:bg-zinc-950 animate-in slide-in-from-left duration-200">
            <DashboardSidebar
              onCloseMobile={() => setMobileSidebarOpen(false)}
              className="h-full border-none"
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Mobile Header Bar with Hamburger toggle */}
        <div className="md:hidden flex h-12 items-center justify-between border-b border-zinc-200 bg-white px-4 dark:border-zinc-800 dark:bg-zinc-950">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="flex items-center gap-2 rounded-lg border border-zinc-200 p-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900"
          >
            <Menu className="h-4 w-4" />
            <span>Dashboard Menu</span>
          </button>

          <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
            {user.role} Portal
          </span>
        </div>

        {/* Page Content */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
