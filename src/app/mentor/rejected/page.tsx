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
  XCircle,
} from "lucide-react";
import { SubmissionsTable } from "@/components/review/submissions-table";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/api-client";
import { useAuth } from "@/lib/auth-context";
import { DashboardStats, Submission } from "@/lib/types";

export default function MentorRejectedSubmissionsPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();

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
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

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

  const fetchRejectedSubmissions = useCallback(async () => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: "8",
        status: "REJECTED",
      });

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
      // Resilient mock fallback
      const mockList: Submission[] = [];
      setSubmissions(mockList);
      setTotalSubmissions(0);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchQuery]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    fetchRejectedSubmissions();
  }, [fetchRejectedSubmissions]);

  const handleSubmissionUpdated = (updated: Submission) => {
    setSubmissions((prev) =>
      updated.status === "REJECTED"
        ? prev.map((s) => (s.submission_id === updated.submission_id ? updated : s))
        : prev.filter((s) => s.submission_id !== updated.submission_id)
    );
    fetchStats();
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3.5 py-1 text-xs font-semibold text-red-600 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-400 mb-2">
            <XCircle className="h-3.5 w-3.5" />
            <span>Revisions Required</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#050505] dark:text-[#e4e6eb] sm:text-4xl">
            Submissions Needing Revisions
          </h1>
          <p className="mt-1 text-sm text-[#65676b] dark:text-[#b0b3b8]">
            Projects requiring architectural fixes, unit tests, or criteria fulfillment before re-evaluation.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            fetchStats();
            fetchRejectedSubmissions();
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
            variant="ghost"
            size="sm"
            className="text-xs h-8 text-[#65676b] hover:text-[#050505] dark:text-[#b0b3b8] dark:hover:text-[#e4e6eb]"
          >
            <FileCheck2 className="h-3.5 w-3.5 mr-1.5" />
            All Submissions
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
            size="sm"
            className="text-xs h-8 bg-[#1877f2] hover:bg-[#166fe5] text-white shadow-xs font-semibold"
          >
            <XCircle className="h-3.5 w-3.5 mr-1.5" />
            Needs Revisions ({stats.totalRejected})
          </Button>
        </Link>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Needs Revisions"
          value={stats.totalRejected}
          icon={XCircle}
          accentColor="rose"
          description="Requires changes"
        />
        <StatCard
          title="Total Submissions"
          value={stats.totalSubmissions}
          icon={FileCheck2}
          accentColor="indigo"
          description="All time submissions"
        />
        <StatCard
          title="Approved Projects"
          value={stats.totalApproved}
          icon={CheckCircle2}
          accentColor="emerald"
          description="Passing criteria"
        />
        <StatCard
          title="Pending Reviews"
          value={stats.totalPending}
          icon={Clock}
          accentColor="amber"
          description="Awaiting evaluation"
        />
      </div>

      {/* Submissions Table Filtered to REJECTED */}
      <div className="space-y-4">
        <SubmissionsTable
          submissions={submissions}
          total={totalSubmissions}
          page={currentPage}
          totalPages={totalPages}
          statusFilter="REJECTED"
          searchQuery={searchQuery}
          onPageChange={setCurrentPage}
          onStatusFilterChange={(st) => {
            if (st === "ALL") router.push("/mentor/dashboard");
            else if (st === "PENDING") router.push("/mentor/pending");
            else if (st === "APPROVED") router.push("/mentor/approved");
          }}
          onSearchChange={setSearchQuery}
          onSubmissionUpdated={handleSubmissionUpdated}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
