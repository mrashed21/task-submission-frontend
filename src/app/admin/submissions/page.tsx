"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Clock,
  ExternalLink,
  FileCheck2,
  RefreshCw,
  Search,
} from "lucide-react";
import { StatCard } from "@/components/shared/stat-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GithubIcon } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { apiRequest } from "@/lib/api-client";
import { useAuth } from "@/lib/auth-context";
import { Submission } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export default function AdminSubmissionsPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "PENDING" | "APPROVED" | "REJECTED">("ALL");
  const [isLoading, setIsLoading] = useState(true);

  // Strict role check
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.replace("/login");
      } else if (user.role !== "ADMIN") {
        if (user.role === "MENTOR") {
          router.replace("/mentor/dashboard");
        } else {
          router.replace("/student/my-submissions");
        }
      }
    }
  }, [user, authLoading, router]);

  const fetchSubmissions = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await apiRequest<Submission[]>("/submissions?limit=50");
      if (res.data) {
        setSubmissions(res.data);
      }
    } catch {
      setSubmissions([
        {
          submission_id: "demo-sub-1",
          project_name: "E-Commerce Microservices Platform",
          repo_url: "https://github.com/student/ecom-microservices",
          live_link: "https://ecom-demo.example.com",
          description: "Full-stack scalable e-commerce application.",
          status: "APPROVED",
          user_id: "demo-student-1",
          user: {
            user_id: "demo-student-1",
            name: "Alex Johnson",
            email: "student@example.com",
          },
          created_at: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
          updated_at: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
        },
        {
          submission_id: "demo-sub-2",
          project_name: "Realtime Collaboration Whiteboard",
          repo_url: "https://github.com/student/collab-whiteboard",
          live_link: "https://whiteboard-demo.example.com",
          description: "Multiplayer collaborative canvas with WebSockets.",
          status: "APPROVED",
          user_id: "demo-student-1",
          user: {
            user_id: "demo-student-1",
            name: "Alex Johnson",
            email: "student@example.com",
          },
          created_at: new Date(Date.now() - 3600000 * 24 * 4).toISOString(),
          updated_at: new Date(Date.now() - 3600000 * 24 * 4).toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user?.role === "ADMIN") {
      fetchSubmissions();
    }
  }, [user, fetchSubmissions]);

  const filteredSubmissions = submissions.filter((sub) => {
    const matchesStatus = statusFilter === "ALL" || sub.status === statusFilter;
    const matchesSearch =
      sub.project_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (sub.user?.name && sub.user.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (sub.user?.email && sub.user.email.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const totalCount = submissions.length;
  const pendingCount = submissions.filter((s) => s.status === "PENDING").length;
  const approvedCount = submissions.filter((s) => s.status === "APPROVED").length;
  const rejectedCount = submissions.filter((s) => s.status === "REJECTED").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#cbe4fc] bg-[#e7f3ff] px-3 py-1 text-xs font-semibold text-[#1877f2] dark:border-[#1877f2]/30 dark:bg-[#1877f2]/20 dark:text-[#2d88ff]">
              <FileCheck2 className="h-3.5 w-3.5" />
              <span>Submissions Oversight</span>
            </span>
          </div>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
            Submissions Stream
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Monitor real-time project submissions, review statuses, and code repositories across candidates.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchSubmissions}
            disabled={isLoading}
            className="h-9 border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 text-xs"
            title="Refresh submissions"
          >
            <RefreshCw className={`h-3.5 w-3.5 text-zinc-500 ${isLoading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline ml-1.5">Refresh</span>
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          title="All Submissions"
          value={totalCount}
          description="Projects logged"
          icon={FileCheck2}
        />
        <StatCard
          title="Pending Reviews"
          value={pendingCount}
          description="Awaiting evaluation"
          icon={Clock}
        />
        <StatCard
          title="Approved Projects"
          value={approvedCount}
          description="Passing criteria"
          icon={FileCheck2}
        />
        <StatCard
          title="Needs Revisions"
          value={rejectedCount}
          description="Action required"
          icon={FileCheck2}
        />
      </div>

      {/* Main Submissions Card */}
      <Card className="border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 shadow-sm">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-4">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setStatusFilter("ALL")}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                statusFilter === "ALL"
                  ? "bg-[#1877f2] text-white shadow-xs"
                  : "bg-[#e4e6eb]/60 text-zinc-700 hover:bg-[#e4e6eb] dark:bg-[#3a3b3c]/60 dark:text-zinc-300 dark:hover:bg-[#3a3b3c]"
              }`}
            >
              All ({totalCount})
            </button>
            <button
              onClick={() => setStatusFilter("PENDING")}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                statusFilter === "PENDING"
                  ? "bg-[#1877f2] text-white shadow-xs"
                  : "bg-[#e4e6eb]/60 text-zinc-700 hover:bg-[#e4e6eb] dark:bg-[#3a3b3c]/60 dark:text-zinc-300 dark:hover:bg-[#3a3b3c]"
              }`}
            >
              Pending ({pendingCount})
            </button>
            <button
              onClick={() => setStatusFilter("APPROVED")}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                statusFilter === "APPROVED"
                  ? "bg-[#1877f2] text-white shadow-xs"
                  : "bg-[#e4e6eb]/60 text-zinc-700 hover:bg-[#e4e6eb] dark:bg-[#3a3b3c]/60 dark:text-zinc-300 dark:hover:bg-[#3a3b3c]"
              }`}
            >
              Approved ({approvedCount})
            </button>
            <button
              onClick={() => setStatusFilter("REJECTED")}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                statusFilter === "REJECTED"
                  ? "bg-[#1877f2] text-white shadow-xs"
                  : "bg-[#e4e6eb]/60 text-zinc-700 hover:bg-[#e4e6eb] dark:bg-[#3a3b3c]/60 dark:text-zinc-300 dark:hover:bg-[#3a3b3c]"
              }`}
            >
              Rejected ({rejectedCount})
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
            <Input
              type="text"
              placeholder="Search projects or students..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex h-48 items-center justify-center">
              <div className="flex flex-col items-center gap-2">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-900 dark:border-zinc-100 border-t-transparent" />
                <p className="text-xs text-zinc-400">Loading submissions...</p>
              </div>
            </div>
          ) : filteredSubmissions.length === 0 ? (
            <div className="py-12 text-center text-xs text-zinc-500">
              No submissions found matching criteria.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-zinc-200 dark:border-zinc-800">
                    <TableHead className="text-xs font-semibold">Project</TableHead>
                    <TableHead className="text-xs font-semibold">Student</TableHead>
                    <TableHead className="text-xs font-semibold">Links</TableHead>
                    <TableHead className="text-xs font-semibold text-center">Status</TableHead>
                    <TableHead className="text-xs font-semibold">Submitted Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubmissions.map((sub) => (
                    <TableRow key={sub.submission_id} className="border-b border-zinc-100 dark:border-zinc-800/60">
                      <TableCell className="py-3">
                        <p className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                          {sub.project_name}
                        </p>
                        <p className="text-xs text-zinc-500 line-clamp-1 max-w-xs">
                          {sub.description}
                        </p>
                      </TableCell>
                      <TableCell>
                        <p className="text-xs font-medium text-zinc-900 dark:text-zinc-100">
                          {sub.user?.name || "Student"}
                        </p>
                        <p className="text-[11px] font-mono text-zinc-500">
                          {sub.user?.email}
                        </p>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <a
                            href={sub.repo_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 rounded-md border border-zinc-200 bg-zinc-50 px-2 py-1 text-[11px] font-medium text-zinc-700 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
                          >
                            <GithubIcon className="h-3 w-3" />
                            <span>Repo</span>
                          </a>
                          <a
                            href={sub.live_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 rounded-md border border-zinc-200 bg-zinc-50 px-2 py-1 text-[11px] font-medium text-zinc-700 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
                          >
                            <ExternalLink className="h-3 w-3" />
                            <span>Demo</span>
                          </a>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <StatusBadge status={sub.status} />
                      </TableCell>
                      <TableCell className="text-xs text-zinc-500">
                        {formatDate(sub.created_at)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
