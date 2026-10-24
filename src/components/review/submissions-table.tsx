"use client";

import React, { useState } from "react";
import {
  ExternalLink,
  MessageSquare,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { GithubIcon } from "@/components/ui/icons";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Submission, SubmissionStatus } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { ReviewModal } from "./review-modal";

interface SubmissionsTableProps {
  submissions: Submission[];
  total: number;
  page: number;
  totalPages: number;
  statusFilter: "ALL" | "PENDING" | "APPROVED" | "REJECTED";
  searchQuery: string;
  onPageChange: (newPage: number) => void;
  onStatusFilterChange: (status: "ALL" | "PENDING" | "APPROVED" | "REJECTED") => void;
  onSearchChange: (search: string) => void;
  onSubmissionUpdated: (updated: Submission) => void;
  isLoading?: boolean;
}

export function SubmissionsTable({
  submissions,
  total,
  page,
  totalPages,
  statusFilter,
  searchQuery,
  onPageChange,
  onStatusFilterChange,
  onSearchChange,
  onSubmissionUpdated,
  isLoading = false,
}: SubmissionsTableProps) {
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filterTabs: Array<{ id: "ALL" | "PENDING" | "APPROVED" | "REJECTED"; label: string }> = [
    { id: "ALL", label: "All Projects" },
    { id: "PENDING", label: "Pending" },
    { id: "APPROVED", label: "Approved" },
    { id: "REJECTED", label: "Rejected" },
  ];

  const handleOpenReview = (submission: Submission) => {
    setSelectedSubmission(submission);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-4">
      {/* Table Controls: Server-side filters & Search */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Status Filter Tabs (Server-side) */}
        <div className="flex items-center gap-1 rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 p-1">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onStatusFilterChange(tab.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                statusFilter === tab.id
                  ? "bg-[#1877f2] text-white shadow-xs"
                  : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <Input
            placeholder="Search projects or students..."
            className="pl-9 h-9 text-xs"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      {/* Paginated Data Table */}
      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-black shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[260px]">Project</TableHead>
              <TableHead className="w-[180px]">Student</TableHead>
              <TableHead className="w-[150px]">Links</TableHead>
              <TableHead className="w-[140px]">Submitted</TableHead>
              <TableHead className="w-[130px]">Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-40 text-center text-zinc-500 dark:text-zinc-400">
                  Loading submissions...
                </TableCell>
              </TableRow>
            ) : submissions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-40 text-center text-zinc-500 dark:text-zinc-400">
                  No project submissions found for the selected filter.
                </TableCell>
              </TableRow>
            ) : (
              submissions.map((sub) => (
                <TableRow key={sub.submission_id}>
                  <TableCell>
                    <div className="font-semibold text-zinc-900 dark:text-zinc-100">{sub.project_name}</div>
                    <div className="mt-0.5 line-clamp-1 max-w-[240px] text-xs text-zinc-500 dark:text-zinc-400">
                      {sub.description ? sub.description.replace(/<[^>]*>?/gm, "") : ""}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs font-medium text-zinc-800 dark:text-zinc-200">
                      {sub.user?.name || "Student"}
                    </div>
                    <div className="text-[11px] text-zinc-500 dark:text-zinc-400">{sub.user?.email}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <a
                        href={sub.repo_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 rounded-md border border-[#ced0d4] bg-[#f0f2f5] px-2 py-0.5 text-[11px] font-medium text-[#050505] hover:bg-[#e4e6eb] dark:border-[#3a3b3c] dark:bg-[#18191a] dark:text-[#e4e6eb]"
                        title={sub.repo_url}
                      >
                        <GithubIcon className="h-3 w-3" />
                        Repo
                      </a>
                      <a
                        href={sub.live_link}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 rounded-md border border-[#ced0d4] bg-[#f0f2f5] px-2 py-0.5 text-[11px] font-medium text-[#050505] hover:bg-[#e4e6eb] dark:border-[#3a3b3c] dark:bg-[#18191a] dark:text-[#e4e6eb]"
                        title={sub.live_link}
                      >
                        <ExternalLink className="h-3 w-3" />
                        Live
                      </a>
                      {sub.additional_links && sub.additional_links.length > 0 && (
                        <span
                          className="inline-flex items-center rounded-md border border-[#cbe4fc] bg-[#e7f3ff] px-1.5 py-0.5 text-[10px] font-semibold text-[#1877f2] dark:border-[#1877f2]/30 dark:bg-[#1877f2]/15 dark:text-[#2d88ff]"
                          title={`${sub.additional_links.length} additional links`}
                        >
                          +{sub.additional_links.length}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-zinc-500 dark:text-zinc-400">
                    {formatDate(sub.created_at)}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={sub.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      id={`btn-review-${sub.submission_id}`}
                      data-testid="review-button"
                      size="sm"
                      variant={(sub.status || "").toUpperCase() === "PENDING" ? "default" : "secondary"}
                      className="h-8 text-xs gap-1.5"
                      onClick={() => handleOpenReview(sub)}
                    >
                      <MessageSquare className="h-3.5 w-3.5" />
                      {(sub.status || "").toUpperCase() === "PENDING" ? "Review" : "Update"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination Footer */}
        <div className="flex items-center justify-between border-t border-zinc-200 dark:border-zinc-800 px-4 py-3 text-xs text-zinc-500 dark:text-zinc-400">
          <div>
            Showing <span className="font-semibold text-zinc-900 dark:text-zinc-100">{submissions.length}</span> of{" "}
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">{total}</span> total entries
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs border-zinc-300 bg-white hover:bg-zinc-100 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:text-zinc-200"
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1 || isLoading}
            >
              Previous
            </Button>
            <span className="px-2 font-medium text-zinc-700 dark:text-zinc-300">
              Page {page} of {totalPages || 1}
            </span>
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs border-zinc-300 bg-white hover:bg-zinc-100 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:text-zinc-200"
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages || isLoading}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      <ReviewModal
        submission={selectedSubmission}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onReviewSubmitted={onSubmissionUpdated}
      />
    </div>
  );
}
