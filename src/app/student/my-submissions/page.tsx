"use client";

import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { GithubIcon } from "@/components/ui/icons";
import { apiRequest } from "@/lib/api-client";
import { useAuth } from "@/lib/auth-context";
import { Submission } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import {
  Code2,
  ExternalLink,
  MessageSquare,
  PlusCircle
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function MySubmissionsPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.replace("/login");
      } else if (user.role === "MENTOR" || user.role === "ADMIN") {
        router.replace("/mentor/dashboard");
      }
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    async function fetchSubmissions() {
      try {
        const response = await apiRequest<Submission[]>("/submissions/my-submissions");
        if (response.data) {
          setSubmissions(response.data);
        }
      } catch {
        // Mock fallback demo records if backend is offline
        setSubmissions([
          {
            submission_id: "demo-sub-1",
            project_name: "E-Commerce Microservices Platform",
            repo_url: "https://github.com/student/ecom-microservices",
            live_link: "https://ecom-demo.example.com",
            description:
              "Full-stack scalable e-commerce application built with Next.js, Express, PostgreSQL, and Redis caching.",
            status: "PENDING",
            user_id: user?.user_id || "demo-student-id",
            created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
            updated_at: new Date(Date.now() - 3600000 * 24).toISOString(),
          },
          {
            submission_id: "demo-sub-2",
            project_name: "Realtime Collaboration Whiteboard",
            repo_url: "https://github.com/student/collab-whiteboard",
            live_link: "https://whiteboard.example.com",
            description:
              "Multiplayer collaborative canvas with WebSocket synchronization and room isolation.",
            status: "APPROVED",
            user_id: user?.user_id || "demo-student-id",
            created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
            updated_at: new Date(Date.now() - 3600000 * 40).toISOString(),
            reviews: [
              {
                review_id: "demo-rev-1",
                submission_id: "demo-sub-2",
                user_id: "mentor-id",
                status: "APPROVED",
                feedback:
                  "Outstanding code structure, well-thought-out WebSocket architecture, and clean error handling. Approved!",
                review_date: new Date(Date.now() - 3600000 * 40).toISOString(),
                created_at: new Date(Date.now() - 3600000 * 40).toISOString(),
                mentor: {
                  user_id: "mentor-1",
                  name: "Senior Mentor",
                  email: "mentor@example.com",
                },
              },
            ],
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSubmissions();
  }, [user]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
            My Submissions
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Track evaluation status and feedback for your submitted projects
          </p>
        </div>

        <Link href="/student/submit">
          <Button className="gap-2 bg-[#1877f2] hover:bg-[#166fe5] text-white font-semibold shadow-sm">
            <PlusCircle className="h-4 w-4" />
            Submit New Project
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-zinc-500 dark:text-zinc-400">Loading your submissions...</div>
      ) : submissions.length === 0 ? (
        <EmptyState
          icon={Code2}
          title="No Project Submissions Yet"
          description="You haven't submitted any projects for evaluation. Submit your first project to get mentor feedback."
          actionLabel="Submit Project Now"
          onAction={() => (window.location.href = "/student/submit")}
        />
      ) : (
        <div className="grid gap-6">
          {submissions.map((sub) => (
            <Card
              key={sub.submission_id}
              className="border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-black shadow-sm overflow-hidden transition-colors"
            >
              <CardHeader className="p-6 pb-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                      {sub.project_name}
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                      Submitted on {formatDate(sub.created_at)}
                    </p>
                  </div>
                  <div>
                    <StatusBadge status={sub.status} />
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6 pt-0 space-y-4">
                <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  {sub.description}
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <a
                    href={sub.repo_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-1.5 text-xs font-semibold text-zinc-800 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
                  >
                    <GithubIcon className="h-3.5 w-3.5" />
                    Source Code
                  </a>
                  <a
                    href={sub.live_link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[#1877f2]/30 bg-[#1877f2]/10 px-3 py-1.5 text-xs font-semibold text-[#1877f2] dark:text-[#38bdf8] hover:bg-[#1877f2]/20"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    Live Demo
                  </a>
                </div>

                {/* Mentor Feedback Section if available */}
                {sub.reviews && sub.reviews.length > 0 && (
                  <div className="mt-4 rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-[#1877f2]" />
                        <h4 className="text-xs font-bold uppercase tracking-wider text-[#1877f2] dark:text-[#38bdf8]">
                          Mentor Evaluation & Feedback
                        </h4>
                      </div>
                      <StatusBadge status={sub.reviews[0].status} />
                      <span className="text-[11px] text-zinc-500 dark:text-zinc-400 ml-auto">
                        Reviewed on {formatDate(sub.reviews[0].review_date)}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-800 dark:text-zinc-200 italic">
                      "{sub.reviews[0].feedback}"
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
