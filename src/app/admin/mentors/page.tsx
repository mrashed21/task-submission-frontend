"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  Award,
  CheckCircle2,
  PlusCircle,
  RefreshCw,
  Search,
  ShieldAlert,
  Trash2,
  Users,
} from "lucide-react";
import { CreateMentorDialog } from "@/components/admin/create-mentor-dialog";
import { StatCard } from "@/components/shared/stat-card";
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
import { MentorUser } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export default function AdminMentorsPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [mentors, setMentors] = useState<MentorUser[]>([]);
  const [mentorSearch, setMentorSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Dialogs
  const [createMentorOpen, setCreateMentorOpen] = useState(false);
  const [deleteMentorTarget, setDeleteMentorTarget] = useState<MentorUser | null>(null);
  const [isDeletingMentor, setIsDeletingMentor] = useState(false);
  const [actionMessage, setActionMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

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

  const fetchMentors = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await apiRequest<MentorUser[]>("/admin/mentors");
      if (res.data) {
        setMentors(res.data);
      }
    } catch {
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
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user?.role === "ADMIN") {
      fetchMentors();
    }
  }, [user, fetchMentors]);

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
        text: `Mentor "${deleteMentorTarget.name}" has been removed.`,
      });
      setDeleteMentorTarget(null);
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to delete mentor.";
      setActionMessage({
        type: "error",
        text: errorMsg,
      });
    } finally {
      setIsDeletingMentor(false);
    }
  };

  const filteredMentors = mentors.filter(
    (m) =>
      m.name.toLowerCase().includes(mentorSearch.toLowerCase()) ||
      m.email.toLowerCase().includes(mentorSearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#cbe4fc] bg-[#e7f3ff] px-3 py-1 text-xs font-semibold text-[#1877f2] dark:border-[#1877f2]/30 dark:bg-[#1877f2]/20 dark:text-[#2d88ff]">
              <Users className="h-3.5 w-3.5" />
              <span>Mentor Administration</span>
            </span>
          </div>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
            Manage Mentors
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Create mentor accounts, inspect evaluation activity, and configure evaluator access.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchMentors}
            disabled={isLoading}
            className="h-10 border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 text-xs"
            title="Refresh mentor list"
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
        <Alert
          variant={actionMessage.type === "success" ? "default" : "destructive"}
          className="border-zinc-200 bg-zinc-50 text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
        >
          {actionMessage.type === "success" ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <AlertDescription className="text-xs font-medium">
            {actionMessage.text}
          </AlertDescription>
        </Alert>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Mentors"
          value={mentors.length}
          description="Registered evaluators"
          icon={Users}
        />
        <StatCard
          title="Completed Reviews"
          value={mentors.reduce((acc, curr) => acc + (curr.reviewCount || 0), 0)}
          description="Total submissions evaluated"
          icon={Award}
        />
        <StatCard
          title="Search Matches"
          value={filteredMentors.length}
          description="Filtered results"
          icon={Search}
        />
      </div>

      {/* Main Mentor Card */}
      <Card className="border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 shadow-sm">
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-4">
          <div>
            <CardTitle className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <span>Evaluator & Mentor Directory</span>
              <span className="rounded-full bg-[#e7f3ff] px-2.5 py-0.5 text-xs font-semibold text-[#1877f2] dark:bg-[#1877f2]/20 dark:text-[#2d88ff] border border-[#cbe4fc] dark:border-[#1877f2]/30">
                {filteredMentors.length} Registered
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
              className="gap-1.5 bg-[#1877f2] hover:bg-[#166fe5] text-white text-xs h-9 shrink-0 shadow-sm font-semibold"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span>Add Mentor</span>
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex h-48 items-center justify-center">
              <div className="flex flex-col items-center gap-2">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-900 dark:border-zinc-100 border-t-transparent" />
                <p className="text-xs text-zinc-400">Loading mentors...</p>
              </div>
            </div>
          ) : filteredMentors.length === 0 ? (
            <div className="py-12 text-center text-xs text-zinc-500">
              No mentors found matching your search.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-zinc-200 dark:border-zinc-800">
                    <TableHead className="text-xs font-semibold">Mentor Name</TableHead>
                    <TableHead className="text-xs font-semibold">Email Address</TableHead>
                    <TableHead className="text-xs font-semibold text-center">Reviews Completed</TableHead>
                    <TableHead className="text-xs font-semibold">Joined Date</TableHead>
                    <TableHead className="text-xs font-semibold text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMentors.map((mentor) => (
                    <TableRow key={mentor.user_id} className="border-b border-zinc-100 dark:border-zinc-800/60">
                      <TableCell className="py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#e7f3ff] text-xs font-bold text-[#1877f2] dark:bg-[#1877f2]/20 dark:text-[#2d88ff]">
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
                            <span className="inline-flex items-center gap-1 text-[10px] text-[#1877f2] dark:text-[#2d88ff] font-medium">
                              <span className="h-1.5 w-1.5 rounded-full bg-[#1877f2]" />
                              Active Evaluator
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-zinc-600 dark:text-zinc-400">
                        {mentor.email}
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#e7f3ff] px-2.5 py-0.5 text-xs font-semibold text-[#1877f2] dark:bg-[#1877f2]/20 dark:text-[#2d88ff]">
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
                          className="h-8 w-8 p-0 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
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
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100">
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
              className="gap-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-50 dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-900 text-xs h-9"
            >
              {isDeletingMentor ? "Removing..." : "Confirm Removal"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
