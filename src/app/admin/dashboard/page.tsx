"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Award,
  Clock,
  FileCheck2,
  GraduationCap,
  Percent,
  PlusCircle,
  RefreshCw,
  ShieldCheck,
  Users,
} from "lucide-react";
import { CreateMentorDialog } from "@/components/admin/create-mentor-dialog";
import { StatCard } from "@/components/shared/stat-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { AdminStats, MentorUser, Submission } from "@/lib/types";
import { formatDate } from "@/lib/utils";

interface StudentUser {
  user_id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
  _count?: {
    submissions?: number;
  };
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();

  // Strict role enforcement: Only ADMIN allowed
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

  // Backward compatibility: If accessed via ?tab= redirect to dedicated page
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get("tab");
      if (tab === "students") {
        router.replace("/admin/students");
      } else if (tab === "mentors") {
        router.replace("/admin/mentors");
      } else if (tab === "submissions") {
        router.replace("/admin/submissions");
      }
    }
  }, [router]);

  // Stats State
  const [stats, setStats] = useState<AdminStats>({
    totalMentors: 2,
    totalStudents: 1,
    totalAdmins: 1,
    totalSubmissions: 3,
    totalPending: 1,
    totalApproved: 2,
    totalRejected: 0,
    totalReviews: 2,
    approvalRate: 100,
  });

  const [mentors, setMentors] = useState<MentorUser[]>([]);
  const [students, setStudents] = useState<StudentUser[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Create Mentor Dialog
  const [createMentorOpen, setCreateMentorOpen] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // Fetch admin stats and quick overview lists
  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [statsRes, mentorsRes, studentsRes, subsRes] = await Promise.allSettled([
        apiRequest<AdminStats>("/admin/stats"),
        apiRequest<MentorUser[]>("/admin/mentors"),
        apiRequest<StudentUser[]>("/admin/users?role=STUDENT"),
        apiRequest<Submission[]>("/submissions?limit=5"),
      ]);

      if (statsRes.status === "fulfilled" && statsRes.value?.data) {
        setStats(statsRes.value.data);
      }
      if (mentorsRes.status === "fulfilled" && mentorsRes.value?.data) {
        setMentors(mentorsRes.value.data.slice(0, 4));
      }
      if (studentsRes.status === "fulfilled" && studentsRes.value?.data) {
        setStudents(studentsRes.value.data.slice(0, 4));
      }
      if (subsRes.status === "fulfilled" && subsRes.value?.data) {
        setSubmissions(subsRes.value.data.slice(0, 5));
      }
    } catch {
      // Keep state
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user?.role === "ADMIN") {
      fetchDashboardData();
    }
  }, [user, fetchDashboardData]);

  return (
    <div className="space-y-8">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#cbe4fc] bg-[#e7f3ff] px-3 py-1 text-xs font-semibold text-[#1877f2] dark:border-[#1877f2]/30 dark:bg-[#1877f2]/20 dark:text-[#2d88ff]">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Administrator Control Center</span>
            </span>
          </div>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
            Admin Management Portal
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Create mentors, oversee student submissions, and manage platform operations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchDashboardData}
            disabled={isLoading}
            className="h-10 border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 text-xs"
            title="Refresh statistics"
          >
            <RefreshCw className={`h-3.5 w-3.5 text-zinc-500 ${isLoading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline ml-1.5">Refresh</span>
          </Button>

          <Button
            onClick={() => setCreateMentorOpen(true)}
            size="lg"
            className="gap-2 bg-[#1877f2] hover:bg-[#166fe5] text-white font-semibold shadow-sm transition-all"
          >
            <PlusCircle className="h-5 w-5" />
            <span>Create New Mentor</span>
          </Button>
        </div>
      </div>

      {/* Action Notification Banner */}
      {actionMessage && (
        <Alert className="border-zinc-200 bg-zinc-50 text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100">
          <AlertDescription className="text-xs font-medium">
            {actionMessage}
          </AlertDescription>
        </Alert>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <StatCard
          title="Total Mentors"
          value={stats.totalMentors}
          description="Active evaluators"
          icon={Users}
        />
        <StatCard
          title="Total Students"
          value={stats.totalStudents}
          description="Enrolled candidates"
          icon={GraduationCap}
        />
        <StatCard
          title="All Submissions"
          value={stats.totalSubmissions}
          description="Projects submitted"
          icon={FileCheck2}
        />
        <StatCard
          title="Pending Reviews"
          value={stats.totalPending}
          description="Awaiting evaluation"
          icon={Clock}
        />
        <StatCard
          title="Approval Rate"
          value={`${stats.approvalRate}%`}
          description="Overall success rate"
          icon={Percent}
        />
      </div>

      {/* Dedicated Section Cards (Quick Navigation) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Manage Mentors Card */}
        <Card className="border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 shadow-sm hover:border-zinc-300 dark:hover:border-zinc-700 transition-all flex flex-col justify-between">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e7f3ff] dark:bg-[#1877f2]/20 text-[#1877f2] dark:text-[#2d88ff]">
                <Users className="h-5 w-5" />
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#e7f3ff] dark:bg-[#1877f2]/20 text-[#1877f2] dark:text-[#2d88ff]">
                {stats.totalMentors} Registered
              </span>
            </div>
            <CardTitle className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-3">
              Mentor Directory
            </CardTitle>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Create and manage qualified evaluator accounts, monitor review performance.
            </p>
          </CardHeader>
          <CardContent className="pt-0">
            <Link href="/admin/mentors">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-between text-xs h-9 border-[#ced0d4] dark:border-[#3a3b3c] font-semibold text-[#1877f2] hover:bg-[#e7f3ff]/60 dark:hover:bg-[#1877f2]/20"
              >
                <span>Manage Mentors</span>
                <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Student Directory Card */}
        <Card className="border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 shadow-sm hover:border-zinc-300 dark:hover:border-zinc-700 transition-all flex flex-col justify-between">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e7f3ff] dark:bg-[#1877f2]/20 text-[#1877f2] dark:text-[#2d88ff]">
                <GraduationCap className="h-5 w-5" />
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#e7f3ff] dark:bg-[#1877f2]/20 text-[#1877f2] dark:text-[#2d88ff]">
                {stats.totalStudents} Enrolled
              </span>
            </div>
            <CardTitle className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-3">
              Student Directory
            </CardTitle>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Inspect registered engineering students and view project submission metrics.
            </p>
          </CardHeader>
          <CardContent className="pt-0">
            <Link href="/admin/students">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-between text-xs h-9 border-[#ced0d4] dark:border-[#3a3b3c] font-semibold text-[#1877f2] hover:bg-[#e7f3ff]/60 dark:hover:bg-[#1877f2]/20"
              >
                <span>View Students</span>
                <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Submissions Oversight Card */}
        <Card className="border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 shadow-sm hover:border-zinc-300 dark:hover:border-zinc-700 transition-all flex flex-col justify-between">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e7f3ff] dark:bg-[#1877f2]/20 text-[#1877f2] dark:text-[#2d88ff]">
                <FileCheck2 className="h-5 w-5" />
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#e7f3ff] dark:bg-[#1877f2]/20 text-[#1877f2] dark:text-[#2d88ff]">
                {stats.totalSubmissions} Total
              </span>
            </div>
            <CardTitle className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-3">
              Submissions Stream
            </CardTitle>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Live oversight of all project submissions, code repositories, and grading.
            </p>
          </CardHeader>
          <CardContent className="pt-0">
            <Link href="/admin/submissions">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-between text-xs h-9 border-[#ced0d4] dark:border-[#3a3b3c] font-semibold text-[#1877f2] hover:bg-[#e7f3ff]/60 dark:hover:bg-[#1877f2]/20"
              >
                <span>View Submissions</span>
                <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Submissions Preview */}
      <Card className="border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 shadow-sm">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4">
          <div>
            <CardTitle className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              Recent Submissions Activity
            </CardTitle>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Latest projects logged by students across the system.
            </p>
          </div>
          <Link href="/admin/submissions">
            <Button variant="ghost" size="sm" className="text-xs font-semibold gap-1">
              <span>View All Submissions</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </CardHeader>

        <CardContent className="p-0">
          {submissions.length === 0 ? (
            <div className="py-8 text-center text-xs text-zinc-500">
              No recent submissions available.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-zinc-200 dark:border-zinc-800">
                    <TableHead className="text-xs font-semibold">Project</TableHead>
                    <TableHead className="text-xs font-semibold">Student</TableHead>
                    <TableHead className="text-xs font-semibold text-center">Status</TableHead>
                    <TableHead className="text-xs font-semibold">Submitted Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submissions.map((sub) => (
                    <TableRow key={sub.submission_id} className="border-b border-zinc-100 dark:border-zinc-800/60">
                      <TableCell className="font-semibold text-sm py-3">
                        {sub.project_name}
                      </TableCell>
                      <TableCell className="text-xs text-zinc-600 dark:text-zinc-400">
                        {sub.user?.name || "Student"}
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

      {/* Create Mentor Dialog */}
      <CreateMentorDialog
        open={createMentorOpen}
        onOpenChange={setCreateMentorOpen}
        onMentorCreated={(newMentor) => {
          setActionMessage(`Mentor "${newMentor.name}" has been created successfully!`);
          fetchDashboardData();
        }}
      />
    </div>
  );
}
