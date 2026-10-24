"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  Award,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileCheck2,
  GraduationCap,
  Percent,
  PlusCircle,
  RefreshCw,
  Search,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  UserCheck,
  Users,
  XCircle,
} from "lucide-react";
import { CreateMentorDialog } from "@/components/admin/create-mentor-dialog";
import { StatCard } from "@/components/shared/stat-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"mentors" | "students" | "submissions">("mentors");

  // Stats State
  const [stats, setStats] = useState<AdminStats>({
    totalMentors: 3,
    totalStudents: 12,
    totalAdmins: 1,
    totalSubmissions: 15,
    totalPending: 4,
    totalApproved: 9,
    totalRejected: 2,
    totalReviews: 11,
    approvalRate: 81.8,
  });

  // Mentors State
  const [mentors, setMentors] = useState<MentorUser[]>([]);
  const [mentorSearch, setMentorSearch] = useState("");
  const [isLoadingMentors, setIsLoadingMentors] = useState(true);

  // Students State
  const [students, setStudents] = useState<StudentUser[]>([]);
  const [studentSearch, setStudentSearch] = useState("");
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);

  // Submissions State
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoadingSubmissions, setIsLoadingSubmissions] = useState(false);

  // Dialogs
  const [createMentorOpen, setCreateMentorOpen] = useState(false);
  const [deleteMentorTarget, setDeleteMentorTarget] = useState<MentorUser | null>(null);
  const [isDeletingMentor, setIsDeletingMentor] = useState(false);
  const [actionMessage, setActionMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Fetch admin stats
  const fetchStats = useCallback(async () => {
    try {
      const res = await apiRequest<AdminStats>("/admin/stats");
      if (res.data) {
        setStats(res.data);
      }
    } catch {
      // Keep resilient fallback
    }
  }, []);

  // Fetch mentors
  const fetchMentors = useCallback(async () => {
    setIsLoadingMentors(true);
    try {
      const res = await apiRequest<MentorUser[]>("/admin/mentors");
      if (res.data) {
        setMentors(res.data);
      }
    } catch {
      // Mock fallback if offline
      setMentors([
        {
          user_id: "demo-mentor-1",
          name: "Senior Mentor",
          email: "mentor@example.com",
          role: "MENTOR",
          created_at: new Date(Date.now() - 3600000 * 24 * 7).toISOString(),
          reviewCount: 8,
        },
        {
          user_id: "demo-mentor-2",
          name: "Dr. Sarah Connor",
          email: "sarah.mentor@example.com",
          role: "MENTOR",
          created_at: new Date(Date.now() - 3600000 * 24 * 3).toISOString(),
          reviewCount: 3,
        },
      ]);
    } finally {
      setIsLoadingMentors(false);
    }
  }, []);

  // Fetch students
  const fetchStudents = useCallback(async () => {
    setIsLoadingStudents(true);
    try {
      const res = await apiRequest<StudentUser[]>("/admin/users?role=STUDENT");
      if (res.data) {
        setStudents(res.data);
      }
    } catch {
      setStudents([
        {
          user_id: "demo-student-1",
          name: "Alex Johnson",
          email: "student@example.com",
          role: "STUDENT",
          created_at: new Date(Date.now() - 3600000 * 24 * 5).toISOString(),
          _count: { submissions: 2 },
        },
      ]);
    } finally {
      setIsLoadingStudents(false);
    }
  }, []);

  // Fetch recent submissions
  const fetchSubmissions = useCallback(async () => {
    setIsLoadingSubmissions(true);
    try {
      const res = await apiRequest<Submission[]>("/submissions?limit=10");
      if (res.data) {
        setSubmissions(res.data);
      }
    } catch {
      // Resilient fallback
    } finally {
      setIsLoadingSubmissions(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    fetchMentors();

    const handleCustomEvent = () => {
      fetchMentors();
      fetchStats();
    };

    if (typeof window !== "undefined") {
      window.addEventListener("mentor-created", handleCustomEvent);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("mentor-created", handleCustomEvent);
      }
    };
  }, [fetchStats, fetchMentors]);

  // Tab change handlers
  useEffect(() => {
    if (activeTab === "students" && students.length === 0) {
      fetchStudents();
    } else if (activeTab === "submissions" && submissions.length === 0) {
      fetchSubmissions();
    }
  }, [activeTab, fetchStudents, fetchSubmissions, students.length, submissions.length]);

  // Delete Mentor Handler
  const handleDeleteMentor = async () => {
    if (!deleteMentorTarget) return;

    setIsDeletingMentor(true);
    try {
      await apiRequest(`/admin/mentors/${deleteMentorTarget.user_id}`, {
        method: "DELETE",
      });

      setMentors((prev) => prev.filter((m) => m.user_id !== deleteMentorTarget.user_id));
      setActionMessage({
        type: "success",
        text: `Mentor "${deleteMentorTarget.name}" removed successfully.`,
      });
      fetchStats();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete mentor";
      setActionMessage({ type: "error", text: msg });
    } finally {
      setIsDeletingMentor(false);
      setDeleteMentorTarget(null);
      setTimeout(() => setActionMessage(null), 5000);
    }
  };

  const filteredMentors = mentors.filter(
    (m) =>
      m.name.toLowerCase().includes(mentorSearch.toLowerCase()) ||
      m.email.toLowerCase().includes(mentorSearch.toLowerCase())
  );

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.email.toLowerCase().includes(studentSearch.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Banner / Welcome Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-purple-200/60 bg-gradient-to-r from-purple-50/80 via-white to-indigo-50/40 p-6 shadow-sm dark:border-purple-900/30 dark:from-purple-950/20 dark:via-zinc-950 dark:to-indigo-950/20">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-100/70 px-3 py-0.5 text-xs font-semibold text-purple-700 dark:border-purple-800 dark:bg-purple-950/60 dark:text-purple-300 mb-2">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Administrator Control Center</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-3xl">
            Admin Management Portal
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Create mentors, oversee student submissions, and manage evaluation operations.
          </p>
        </div>

        {/* Highlighted Create Mentor CTA */}
        <div className="flex items-center gap-3">
          <Button
            onClick={() => {
              fetchStats();
              fetchMentors();
            }}
            variant="outline"
            size="sm"
            className="h-10 border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 text-xs"
            title="Refresh statistics"
          >
            <RefreshCw className="h-3.5 w-3.5 text-zinc-500" />
            <span className="hidden sm:inline ml-1.5">Refresh</span>
          </Button>

          <Button
            onClick={() => setCreateMentorOpen(true)}
            size="lg"
            className="gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold shadow-md transition-all hover:shadow-lg"
          >
            <PlusCircle className="h-5 w-5" />
            <span>Create New Mentor</span>
          </Button>
        </div>
      </div>

      {/* Action Notification Banner */}
      {actionMessage && (
        <Alert
          variant={actionMessage.type === "success" ? "default" : "destructive"}
          className={
            actionMessage.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200"
              : ""
          }
        >
          {actionMessage.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <AlertDescription className="text-xs font-medium">
            {actionMessage.text}
          </AlertDescription>
        </Alert>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <StatCard
          title="Total Mentors"
          value={stats.totalMentors || mentors.length}
          description="Active evaluators"
          icon={Users}
          accentColor="purple"
        />
        <StatCard
          title="Total Students"
          value={stats.totalStudents}
          description="Enrolled candidates"
          icon={GraduationCap}
          accentColor="emerald"
        />
        <StatCard
          title="All Submissions"
          value={stats.totalSubmissions}
          description="Projects submitted"
          icon={FileCheck2}
          accentColor="blue"
        />
        <StatCard
          title="Pending Reviews"
          value={stats.totalPending}
          description="Awaiting evaluation"
          icon={Clock}
          accentColor="amber"
        />
        <StatCard
          title="Approval Rate"
          value={`${stats.approvalRate}%`}
          description="Overall success rate"
          icon={Percent}
          accentColor="indigo"
        />
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-zinc-200 dark:border-zinc-800">
        <nav className="flex space-x-6 text-sm font-medium">
          <button
            onClick={() => setActiveTab("mentors")}
            className={`pb-3 border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === "mentors"
                ? "border-purple-600 text-purple-600 dark:text-purple-400 font-semibold"
                : "border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
            }`}
          >
            <Users className="h-4 w-4" />
            <span>Mentor Management ({mentors.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("students")}
            className={`pb-3 border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === "students"
                ? "border-purple-600 text-purple-600 dark:text-purple-400 font-semibold"
                : "border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
            }`}
          >
            <GraduationCap className="h-4 w-4" />
            <span>Students Directory</span>
          </button>

          <button
            onClick={() => setActiveTab("submissions")}
            className={`pb-3 border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === "submissions"
                ? "border-purple-600 text-purple-600 dark:text-purple-400 font-semibold"
                : "border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
            }`}
          >
            <FileCheck2 className="h-4 w-4" />
            <span>Submissions Oversight</span>
          </button>
        </nav>
      </div>

      {/* TAB 1: MENTORS MANAGEMENT */}
      {activeTab === "mentors" && (
        <Card className="border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-black shadow-sm">
          <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-4">
            <div>
              <CardTitle className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <span>Evaluator & Mentor Directory</span>
                <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-semibold text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                  {mentors.length} Registered
                </span>
              </CardTitle>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                Mentors have access to the evaluation board to review and approve student code submissions.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                <Input
                  type="text"
                  placeholder="Search mentors by name or email..."
                  value={mentorSearch}
                  onChange={(e) => setMentorSearch(e.target.value)}
                  className="pl-9 h-9 text-xs"
                />
              </div>

              <Button
                onClick={() => setCreateMentorOpen(true)}
                size="sm"
                className="gap-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs h-9 shrink-0 shadow-sm"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                <span>Add Mentor</span>
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {isLoadingMentors ? (
              <div className="flex h-48 items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-purple-600 border-t-transparent" />
                  <p className="text-xs text-zinc-400">Loading mentors...</p>
                </div>
              </div>
            ) : filteredMentors.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center px-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400 mb-3">
                  <Users className="h-7 w-7" />
                </div>
                <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                  {mentorSearch ? "No mentors found matching your search" : "No mentors created yet"}
                </h3>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 max-w-sm">
                  {mentorSearch
                    ? "Try adjusting your search criteria or clear the filter."
                    : "Create your first mentor account so they can evaluate student project submissions."}
                </p>
                {!mentorSearch && (
                  <Button
                    onClick={() => setCreateMentorOpen(true)}
                    className="mt-4 gap-2 bg-purple-600 hover:bg-purple-700 text-white text-xs"
                  >
                    <PlusCircle className="h-4 w-4" />
                    <span>Create First Mentor</span>
                  </Button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-zinc-200 dark:border-zinc-800 hover:bg-transparent">
                      <TableHead className="text-xs font-semibold">Mentor Name</TableHead>
                      <TableHead className="text-xs font-semibold">Email Address</TableHead>
                      <TableHead className="text-xs font-semibold text-center">Reviews Completed</TableHead>
                      <TableHead className="text-xs font-semibold">Joined Date</TableHead>
                      <TableHead className="text-xs font-semibold text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMentors.map((mentor) => (
                      <TableRow
                        key={mentor.user_id}
                        className="border-b border-zinc-100 dark:border-zinc-800/60 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30"
                      >
                        <TableCell className="py-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 text-xs font-bold text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                              {mentor.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .slice(0, 2)
                                .toUpperCase()}
                            </div>
                            <div>
                              <p className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                                {mentor.name}
                              </p>
                              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                Active Evaluator
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-xs text-zinc-600 dark:text-zinc-400">
                          {mentor.email}
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-[#1877f2] dark:bg-blue-950/40 dark:text-blue-300">
                            <Award className="h-3 w-3" />
                            {mentor.reviewCount ?? 0} reviews
                          </span>
                        </TableCell>
                        <TableCell className="text-xs text-zinc-500">
                          {formatDate(mentor.created_at)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteMentorTarget(mentor)}
                            className="h-8 w-8 p-0 text-zinc-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/20 dark:hover:text-rose-400"
                            title="Remove mentor"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* TAB 2: STUDENTS DIRECTORY */}
      {activeTab === "students" && (
        <Card className="border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-black shadow-sm">
          <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-4">
            <div>
              <CardTitle className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <span>Enrolled Students</span>
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  {students.length} Total
                </span>
              </CardTitle>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                Engineering candidates enrolled in the project submission and review platform.
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
              <Input
                type="text"
                placeholder="Search students..."
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                className="pl-9 h-9 text-xs"
              />
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {isLoadingStudents ? (
              <div className="flex h-48 items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
                  <p className="text-xs text-zinc-400">Loading student directory...</p>
                </div>
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className="py-12 text-center text-xs text-zinc-500">
                No students found matching your search.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-zinc-200 dark:border-zinc-800">
                      <TableHead className="text-xs font-semibold">Student Name</TableHead>
                      <TableHead className="text-xs font-semibold">Email Address</TableHead>
                      <TableHead className="text-xs font-semibold text-center">Submissions</TableHead>
                      <TableHead className="text-xs font-semibold">Registered</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((st) => (
                      <TableRow key={st.user_id} className="border-b border-zinc-100 dark:border-zinc-800/60">
                        <TableCell className="font-semibold text-sm py-3">
                          {st.name}
                        </TableCell>
                        <TableCell className="font-mono text-xs text-zinc-600 dark:text-zinc-400">
                          {st.email}
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="font-semibold text-xs text-zinc-700 dark:text-zinc-300">
                            {st._count?.submissions ?? 0}
                          </span>
                        </TableCell>
                        <TableCell className="text-xs text-zinc-500">
                          {formatDate(st.created_at)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* TAB 3: SUBMISSIONS OVERSIGHT */}
      {activeTab === "submissions" && (
        <Card className="border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-black shadow-sm">
          <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-4">
            <div>
              <CardTitle className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <span>Recent Submissions Stream</span>
              </CardTitle>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                Monitor live project submission flow across all students and mentors.
              </p>
            </div>

            <Link href="/mentor/dashboard">
              <Button size="sm" className="gap-1.5 bg-[#1877f2] hover:bg-[#166fe5] text-white text-xs h-9">
                <FileCheck2 className="h-3.5 w-3.5" />
                <span>Open Full Review Board</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </CardHeader>

          <CardContent className="p-0">
            {isLoadingSubmissions ? (
              <div className="flex h-48 items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#1877f2] border-t-transparent" />
                  <p className="text-xs text-zinc-400">Loading submissions...</p>
                </div>
              </div>
            ) : submissions.length === 0 ? (
              <div className="py-12 text-center text-xs text-zinc-500">
                No submissions found.
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
      )}

      {/* Create Mentor Dialog */}
      <CreateMentorDialog
        open={createMentorOpen}
        onOpenChange={setCreateMentorOpen}
        onMentorCreated={(newMentor) => {
          setMentors((prev) => [newMentor, ...prev]);
          setActionMessage({
            type: "success",
            text: `Mentor "${newMentor.name}" has been created successfully!`,
          });
          fetchStats();
        }}
      />

      {/* Delete Mentor Confirmation Dialog */}
      <Dialog
        open={Boolean(deleteMentorTarget)}
        onOpenChange={(open) => !open && setDeleteMentorTarget(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle>Remove Mentor Account?</DialogTitle>
                <DialogDescription>
                  Are you sure you want to remove mentor{" "}
                  <strong className="text-zinc-900 dark:text-zinc-100">
                    {deleteMentorTarget?.name}
                  </strong>
                  ?
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            This will revoke their evaluator privileges and remove their account from the platform. This action cannot be undone.
          </p>

          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeleteMentorTarget(null)}
              disabled={isDeletingMentor}
              className="text-xs h-9"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDeleteMentor}
              disabled={isDeletingMentor}
              className="gap-2 bg-rose-600 hover:bg-rose-700 text-white text-xs h-9"
            >
              {isDeletingMentor ? "Deleting..." : "Confirm Removal"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
