"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Code2,
  ExternalLink,
  MessageSquare,
  PlusCircle,
  Sparkles,
} from "lucide-react";
import { GithubIcon } from "@/components/ui/icons";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { apiRequest } from "@/lib/api-client";
import { useAuth } from "@/lib/auth-context";
import { Submission } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export default function MySubmissionsPage() {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            My Submissions
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Track evaluation status and feedback for your submitted projects
          </p>
        </div>

        <Link href="/student/submit">
          <Button className="gap-2">
            <PlusCircle className="h-4 w-4" />
            Submit New Project
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-slate-400">Loading your submissions...</div>
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
              className="border-slate-800 bg-slate-900/60 shadow-xl overflow-hidden hover:border-slate-700 transition-colors"
            >
              <CardHeader className="p-6 pb-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      {sub.project_name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Submitted on {formatDate(sub.created_at)}
                    </p>
                  </div>
                  <div>
                    <StatusBadge status={sub.status} />
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6 pt-0 space-y-4">
                <p className="text-sm text-slate-300 leading-relaxed">
                  {sub.description}
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <a
                    href={sub.repo_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white"
                  >
                    <GithubIcon className="h-3.5 w-3.5" />
                    Source Code
                  </a>
                  <a
                    href={sub.live_link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-500/30 bg-indigo-950/40 px-3 py-1.5 text-xs font-semibold text-indigo-300 hover:bg-indigo-900/60 hover:text-white"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    Live Demo
                  </a>
                </div>

                {/* Mentor Feedback Section if available */}
                {sub.reviews && sub.reviews.length > 0 && (
                  <div className="mt-4 rounded-xl border border-indigo-500/20 bg-indigo-950/20 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare className="h-4 w-4 text-indigo-400" />
                      <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                        Mentor Evaluation & Feedback
                      </h4>
                      <span className="text-[11px] text-slate-400 ml-auto">
                        Reviewed on {formatDate(sub.reviews[0].review_date)}
                      </span>
                    </div>
                    <p className="text-sm text-slate-200 italic">
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
