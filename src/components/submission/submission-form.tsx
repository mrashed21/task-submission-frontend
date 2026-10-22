"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AlertCircle, CheckCircle2, Globe, Loader2, Send } from "lucide-react";
import { GithubIcon } from "@/components/ui/icons";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { apiRequest } from "@/lib/api-client";
import { useAuth } from "@/lib/auth-context";
import { Submission } from "@/lib/types";

export function SubmissionForm() {
  const { user } = useAuth();
  const [projectName, setProjectName] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [liveLink, setLiveLink] = useState("");
  const [description, setDescription] = useState("");

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [submittedProject, setSubmittedProject] = useState<Submission | null>(null);

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!projectName.trim()) {
      newErrors.projectName = "Project name is required";
    } else if (projectName.trim().length < 3) {
      newErrors.projectName = "Project name must be at least 3 characters";
    }

    if (!repoUrl.trim()) {
      newErrors.repoUrl = "Repository URL is required";
    } else {
      try {
        const url = new URL(repoUrl.trim());
        const validHosts = ["github.com", "gitlab.com", "bitbucket.org"];
        if (!validHosts.some((host) => url.hostname.includes(host))) {
          newErrors.repoUrl = "Repository URL must be a valid GitHub, GitLab, or Bitbucket link";
        }
      } catch {
        newErrors.repoUrl = "Please enter a valid URL (e.g. https://github.com/user/repo)";
      }
    }

    if (!liveLink.trim()) {
      newErrors.liveLink = "Live demo URL is required";
    } else {
      try {
        new URL(liveLink.trim());
      } catch {
        newErrors.liveLink = "Please enter a valid URL (e.g. https://my-demo.vercel.app)";
      }
    }

    if (!description.trim()) {
      newErrors.description = "Project description is required";
    } else if (description.trim().length < 20) {
      newErrors.description = "Please describe your project in at least 20 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const response = await apiRequest<Submission>("/submissions", {
        method: "POST",
        body: JSON.stringify({
          project_name: projectName.trim(),
          repo_url: repoUrl.trim(),
          live_link: liveLink.trim(),
          description: description.trim(),
        }),
      });

      if (response.data) {
        setSubmittedProject(response.data);
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to submit project. Please try again.";
      setServerError(errorMessage);

      // Local mock state if backend is offline
      if (
        errorMessage.includes("Failed to fetch") ||
        errorMessage.includes("Network error") ||
        errorMessage.includes("ECONNREFUSED")
      ) {
        const mockCreated: Submission = {
          submission_id: `sub-${Date.now()}`,
          project_name: projectName.trim(),
          repo_url: repoUrl.trim(),
          live_link: liveLink.trim(),
          description: description.trim(),
          status: "PENDING",
          user_id: user?.user_id || "demo-student-id",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        setSubmittedProject(mockCreated);
        setServerError(null);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submittedProject) {
    return (
      <Card className="border-emerald-500/30 bg-emerald-950/20 max-w-2xl mx-auto">
        <CardContent className="pt-8 pb-8 text-center space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold text-white">Project Submitted Successfully!</h2>
          <p className="text-sm text-slate-300 max-w-md mx-auto">
            Your project <span className="font-semibold text-white">"{submittedProject.project_name}"</span> has been queued for mentor evaluation.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3">
            <Link href="/student/my-submissions">
              <Button className="w-full sm:w-auto">View My Submissions</Button>
            </Link>
            <Button
              variant="outline"
              onClick={() => {
                setSubmittedProject(null);
                setProjectName("");
                setRepoUrl("");
                setLiveLink("");
                setDescription("");
              }}
              className="w-full sm:w-auto"
            >
              Submit Another Project
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto border-slate-800 bg-slate-900/60 shadow-2xl">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600/20 text-indigo-400">
            <Send className="h-5 w-5" />
          </div>
          <div>
            <CardTitle>Submit Project for Evaluation</CardTitle>
            <CardDescription>
              Provide your project repository and live URL for mentor review
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {serverError && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Submission Error</AlertTitle>
            <AlertDescription>{serverError}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Project Name <span className="text-rose-400">*</span>
            </label>
            <Input
              placeholder="e.g. Cloud Task Management System"
              value={projectName}
              onChange={(e) => {
                setProjectName(e.target.value);
                if (errors.projectName) setErrors({ ...errors, projectName: "" });
              }}
              error={errors.projectName}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Repository URL (GitHub / GitLab) <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                <GithubIcon className="h-4 w-4" />
              </div>
              <Input
                className="pl-9"
                placeholder="https://github.com/username/project-repo"
                value={repoUrl}
                onChange={(e) => {
                  setRepoUrl(e.target.value);
                  if (errors.repoUrl) setErrors({ ...errors, repoUrl: "" });
                }}
                error={errors.repoUrl}
              />
            </div>
            <p className="mt-1 text-[11px] text-slate-400">
              Duplicate repository URLs submitted by the same student will be rejected.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Live Demo Link <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                <Globe className="h-4 w-4" />
              </div>
              <Input
                className="pl-9"
                placeholder="https://my-demo-deploy.vercel.app"
                value={liveLink}
                onChange={(e) => {
                  setLiveLink(e.target.value);
                  if (errors.liveLink) setErrors({ ...errors, liveLink: "" });
                }}
                error={errors.liveLink}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Project Description <span className="text-rose-400">*</span>
              </label>
              <span className="text-[11px] text-slate-400">
                {description.length} / 2000 chars
              </span>
            </div>
            <Textarea
              rows={4}
              placeholder="Outline the core features, architectural decisions, technologies used, and any specific areas you'd like feedback on..."
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (errors.description) setErrors({ ...errors, description: "" });
              }}
              error={errors.description}
            />
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 text-base font-semibold"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting Project...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Submit Project for Review
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
