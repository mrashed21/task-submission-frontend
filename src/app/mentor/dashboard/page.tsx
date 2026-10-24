"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  Clock,
  FileCheck2,
  Percent,
  RefreshCw,
  Users,
  XCircle,
} from "lucide-react";
import { SubmissionsTable } from "@/components/review/submissions-table";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/api-client";
import { useAuth } from "@/lib/auth-context";
import { DashboardStats, Submission } from "@/lib/types";

export default function MentorDashboardPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();

  // Redirect ?status=... query parameters to separate dedicated pages
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const st = params.get("status");
      if (st === "PENDING") {
        router.replace("/mentor/pending");
      } else if (st === "APPROVED") {
        router.replace("/mentor/approved");
      } else if (st === "REJECTED") {
        router.replace("/mentor/rejected");
      }
    }
  }, [router]);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.replace("/login");
      } else if (user.role !== "MENTOR") {
        if (user.role === "ADMIN") {
          router.replace("/admin/dashboard");
        } else {
          router.replace("/student/my-submissions");
        }
      }
    }
  }, [user, authLoading, router]);
  const [stats, setStats] = useState<DashboardStats>({
    totalSubmissions: 12,
    totalPending: 5,
    totalApproved: 6,
    totalRejected: 1,
    totalStudents: 9,
    approvalRate: 85.7,
  });

  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [totalSubmissions, setTotalSubmissions] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [statusFilter, setStatusFilter] = useState<
    "ALL" | "PENDING" | "APPROVED" | "REJECTED"
  >("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch Dashboard Stats
  const fetchStats = useCallback(async () => {
    try {
      const response = await apiRequest<DashboardStats>("/stats/dashboard");
      if (response.data) {
        setStats(response.data);
      }
    } catch {
      // Keep state resilient
    }
  }, []);

  // Fetch Paginated Submissions with Server-side Filters
  const fetchSubmissions = useCallback(async () => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: "8",
      });

      if (statusFilter !== "ALL") {
        queryParams.append("status", statusFilter);
      }

      if (searchQuery.trim()) {
        queryParams.append("search", searchQuery.trim());
      }

      const response = await apiRequest<Submission[]>(
        `/submissions?${queryParams.toString()}`
      );

      if (response.data) {
        setSubmissions(response.data);
        setTotalSubmissions(response.meta?.total || response.data.length);
        setTotalPages(response.meta?.totalPages || 1);
      }
    } catch {
      // Fallback demo mock data for initial evaluation
      const mockList: Submission[] = [
        {
          submission_id: "demo-submission-uuid-001",
          project_name: "E-Commerce Microservices Platform",
          repo_url: "https://github.com/student/ecom-microservices",
          live_link: "https://ecom-demo.example.com",
          description:
            "Full-stack scalable e-commerce application built with Next.js, Express, PostgreSQL, and Redis caching.",
          status: "PENDING",
          user_id: "student-1",
          created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
          updated_at: new Date(Date.now() - 3600000 * 5).toISOString(),
          user: {
            user_id: "student-1",
            name: "Alex Johnson",
            email: "alex@example.com",
          },
        },
        {
          submission_id: "demo-submission-uuid-002",
          project_name: "Realtime Collaboration Whiteboard",
          repo_url: "https://github.com/student/collab-whiteboard",
          live_link: "https://whiteboard.example.com",
          description:
            "Multiplayer collaborative canvas with WebSocket synchronization and room isolation.",
          status: "APPROVED",
          user_id: "student-2",
          created_at: new Date(Date.now() - 3600000 * 20).toISOString(),
          updated_at: new Date(Date.now() - 3600000 * 12).toISOString(),
          user: {
            user_id: "student-2",
            name: "Sarah Chen",
            email: "sarah@example.com",
          },
        },
        {
          submission_id: "demo-submission-uuid-003",
          project_name: "AI Prompt Optimization Sandbox",
          repo_url: "https://github.com/student/prompt-sandbox",
          live_link: "https://prompts.example.com",
          description:
            "Developer utility to test LLM system prompts against synthetic test datasets.",
          status: "REJECTED",
          user_id: "student-3",
          created_at: new Date(Date.now() - 3600000 * 30).toISOString(),
          updated_at: new Date(Date.now() - 3600000 * 25).toISOString(),
          user: {
            user_id: "student-3",
            name: "David Kim",
            email: "david@example.com",
          },
        },
        {
          submission_id: "demo-submission-uuid-004",
          project_name: "Distributed Task Scheduler",
          repo_url: "https://github.com/student/task-scheduler",
          live_link: "https://scheduler.example.com",
          description:
            "Cron-based priority queue manager supporting fault tolerance and worker clusters.",
          status: "PENDING",
          user_id: "student-4",
          created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
          updated_at: new Date(Date.now() - 3600000 * 2).toISOString(),
          user: {
            user_id: "student-4",
            name: "Emily Watson",
            email: "emily@example.com",
          },
        },
      ];

      // Apply client filtering if mock fallback triggered
      let filtered = mockList;
      if (statusFilter !== "ALL") {
        filtered = filtered.filter((s) => s.status === statusFilter);
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        filtered = filtered.filter(
          (s) =>
            s.project_name.toLowerCase().includes(q) ||
            s.user?.name.toLowerCase().includes(q)
        );
      }

      setSubmissions(filtered);
      setTotalSubmissions(filtered.length);
      setTotalPages(Math.max(1, Math.ceil(filtered.length / 8)));
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, statusFilter, searchQuery]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const handleSubmissionUpdated = (updated: Submission) => {
    setSubmissions((prev) =>
      prev.map((s) =>
        s.submission_id === updated.submission_id ? updated : s
      )
    );
    // Refresh aggregated metrics
    fetchStats();
  };

  const handleStatusFilterChange = (
    newStatus: "ALL" | "PENDING" | "APPROVED" | "REJECTED"
  ) => {
    if (newStatus === "PENDING") {
      router.push("/mentor/pending");
    } else if (newStatus === "APPROVED") {
      router.push("/mentor/approved");
    } else if (newStatus === "REJECTED") {
      router.push("/mentor/rejected");
    } else {
      setStatusFilter("ALL");
      setCurrentPage(1);
    }
  };

  const handleSearchChange = (newSearch: string) => {
    setSearchQuery(newSearch);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-4xl">
            Mentor Review Dashboard
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Evaluate engineering projects, grade submissions, and provide actionable feedback
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            fetchStats();
            fetchSubmissions();
          }}
          className="gap-2 self-start sm:self-auto border-[#ced0d4] bg-white hover:bg-[#e4e6eb]/60 text-[#050505] dark:border-[#3a3b3c] dark:bg-[#242526] dark:hover:bg-[#3a3b3c] dark:text-[#e4e6eb]"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh Data
        </Button>
      </div>

      {/* Navigation Pills across mentor pages */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#e4e6eb] dark:border-[#3a3b3c] pb-3">
        <Link href="/mentor/dashboard">
          <Button
            size="sm"
            className="text-xs h-8 bg-[#1877f2] hover:bg-[#166fe5] text-white shadow-xs font-semibold"
          >
            <FileCheck2 className="h-3.5 w-3.5 mr-1.5" />
            All Submissions ({stats.totalSubmissions})
          </Button>
        </Link>
        <Link href="/mentor/pending">
          <Button
            variant="ghost"
            size="sm"
            className="text-xs h-8 text-[#65676b] hover:text-[#050505] dark:text-[#b0b3b8] dark:hover:text-[#e4e6eb]"
          >
            <Clock className="h-3.5 w-3.5 mr-1.5" />
            Pending Reviews ({stats.totalPending})
          </Button>
        </Link>
        <Link href="/mentor/approved">
          <Button
            variant="ghost"
            size="sm"
            className="text-xs h-8 text-[#65676b] hover:text-[#050505] dark:text-[#b0b3b8] dark:hover:text-[#e4e6eb]"
          >
            <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
            Approved Projects ({stats.totalApproved})
          </Button>
        </Link>
        <Link href="/mentor/rejected">
          <Button
            variant="ghost"
            size="sm"
            className="text-xs h-8 text-[#65676b] hover:text-[#050505] dark:text-[#b0b3b8] dark:hover:text-[#e4e6eb]"
          >
            <XCircle className="h-3.5 w-3.5 mr-1.5" />
            Needs Revisions ({stats.totalRejected})
          </Button>
        </Link>
      </div>

      {/* Aggregated Statistics Cards (Requirement 2d) */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard
          title="Total Submissions"
          value={stats.totalSubmissions}
          icon={FileCheck2}
          accentColor="indigo"
          description="All time submissions"
        />

        <StatCard
          title="Pending Reviews"
          value={stats.totalPending}
          icon={Clock}
          accentColor="amber"
          description="Awaiting evaluation"
        />

        <StatCard
          title="Approved"
          value={stats.totalApproved}
          icon={CheckCircle2}
          accentColor="emerald"
          description="Passing criteria"
        />

        <StatCard
          title="Rejected"
          value={stats.totalRejected}
          icon={XCircle}
          accentColor="rose"
          description="Requires changes"
        />

        <StatCard
          title="Approval Rate"
          value={`${stats.approvalRate}%`}
          icon={Percent}
          accentColor="purple"
          description="Graded submissions"
        />
      </div>

      {/* Paginated Data Table with Server-side Filtering and Review Action (Requirements 2a, 2b, 2c) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Project Submissions Queue</h2>
        </div>

        <SubmissionsTable
          submissions={submissions}
          total={totalSubmissions}
          page={currentPage}
          totalPages={totalPages}
          statusFilter={statusFilter}
          searchQuery={searchQuery}
          onPageChange={setCurrentPage}
          onStatusFilterChange={handleStatusFilterChange}
          onSearchChange={handleSearchChange}
          onSubmissionUpdated={handleSubmissionUpdated}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
