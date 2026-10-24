"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  RefreshCw,
  Search,
  Users,
} from "lucide-react";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

export default function AdminStudentsPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [students, setStudents] = useState<StudentUser[]>([]);
  const [studentSearch, setStudentSearch] = useState("");
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

  const fetchStudents = useCallback(async () => {
    setIsLoading(true);
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
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user?.role === "ADMIN") {
      fetchStudents();
    }
  }, [user, fetchStudents]);

  const filteredStudents = students.filter(
    (st) =>
      st.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
      st.email.toLowerCase().includes(studentSearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#cbe4fc] bg-[#e7f3ff] px-3 py-1 text-xs font-semibold text-[#1877f2] dark:border-[#1877f2]/30 dark:bg-[#1877f2]/20 dark:text-[#2d88ff]">
              <GraduationCap className="h-3.5 w-3.5" />
              <span>Student Directory</span>
            </span>
          </div>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
            Enrolled Students
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            View and manage engineering candidates registered across the review platform.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchStudents}
            disabled={isLoading}
            className="h-9 border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 text-xs"
            title="Refresh student list"
          >
            <RefreshCw className={`h-3.5 w-3.5 text-zinc-500 ${isLoading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline ml-1.5">Refresh</span>
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Students"
          value={students.length}
          description="Enrolled candidates"
          icon={GraduationCap}
        />
        <StatCard
          title="Active Submissions"
          value={students.reduce((acc, curr) => acc + (curr._count?.submissions || 0), 0)}
          description="Projects submitted"
          icon={Users}
        />
        <StatCard
          title="Search Matches"
          value={filteredStudents.length}
          description="Filtered results"
          icon={Search}
        />
      </div>

      {/* Main Student Card */}
      <Card className="border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 shadow-sm">
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-4">
          <div>
            <CardTitle className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <span>Candidate Directory</span>
              <span className="rounded-full bg-[#e7f3ff] px-2.5 py-0.5 text-xs font-semibold text-[#1877f2] dark:bg-[#1877f2]/20 dark:text-[#2d88ff] border border-[#cbe4fc] dark:border-[#1877f2]/30">
                {filteredStudents.length} Students
              </span>
            </CardTitle>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Engineering candidates submitting projects for code review and feedback.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
            <Input
              type="text"
              placeholder="Search students by name or email..."
              value={studentSearch}
              onChange={(e) => setStudentSearch(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex h-48 items-center justify-center">
              <div className="flex flex-col items-center gap-2">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-900 dark:border-zinc-100 border-t-transparent" />
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
                    <TableHead className="text-xs font-semibold">Joined Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((st) => (
                    <TableRow key={st.user_id} className="border-b border-zinc-100 dark:border-zinc-800/60">
                      <TableCell className="py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#e7f3ff] text-xs font-bold text-[#1877f2] dark:bg-[#1877f2]/20 dark:text-[#2d88ff]">
                            {st.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2)
                              .toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                              {st.name}
                            </p>
                            <span className="text-[10px] text-[#1877f2] dark:text-[#2d88ff] font-medium">
                              Candidate
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-zinc-600 dark:text-zinc-400">
                        {st.email}
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#e7f3ff] px-2.5 py-0.5 text-xs font-semibold text-[#1877f2] dark:bg-[#1877f2]/20 dark:text-[#2d88ff]">
                          {st._count?.submissions ?? 0} submitted
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
    </div>
  );
}
