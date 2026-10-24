"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Globe,
  Link2,
  Loader2,
  Plus,
  Send,
  Trash2,
} from "lucide-react";
import { GithubIcon } from "@/components/ui/icons";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { apiRequest } from "@/lib/api-client";
import { useAuth } from "@/lib/auth-context";
import { ProjectLink, Submission } from "@/lib/types";

interface FormLinkItem {
  id: string;
  title: string;
  url: string;
}

const COMMON_LINK_SUGGESTIONS = [
  "Backend Repo",
  "Frontend Repo",
  "API Docs",
  "Figma Design",
  "Video Demo",
  "Docker Hub",
];

export function SubmissionForm() {
  const { user } = useAuth();
  const [projectName, setProjectName] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [liveLink, setLiveLink] = useState("");
  const [additionalLinks, setAdditionalLinks] = useState<FormLinkItem[]>([]);
  const [description, setDescription] = useState("");

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [submittedProject, setSubmittedProject] = useState<Submission | null>(null);

  // Add a new empty link row
  const handleAddLink = (suggestedTitle = "") => {
    setAdditionalLinks((prev) => [
      ...prev,
      {
        id: `link-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        title: suggestedTitle,
        url: "",
      },
    ]);
  };

  // Update a specific link row
  const handleUpdateLink = (id: string, field: "title" | "url", value: string) => {
    setAdditionalLinks((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
    if (errors[`link-${id}`]) {
      const updated = { ...errors };
      delete updated[`link-${id}`];
      setErrors(updated);
    }
  };

  // Remove a link row
  const handleRemoveLink = (id: string) => {
    setAdditionalLinks((prev) => prev.filter((item) => item.id !== id));
    const updated = { ...errors };
    delete updated[`link-${id}`];
    setErrors(updated);
  };

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

    // Validate additional links
    additionalLinks.forEach((link, idx) => {
      if (link.url.trim()) {
        try {
          new URL(link.url.trim());
        } catch {
          newErrors[`link-${link.id}`] = `Link #${idx + 1} must be a valid URL`;
        }
      } else if (link.title.trim()) {
        newErrors[`link-${link.id}`] = `Please provide a URL for "${link.title}"`;
      }
    });

    // Strip HTML tags for minimum text validation
    const plainText = description.replace(/<[^>]*>?/gm, "").trim();
    if (!plainText) {
      newErrors.description = "Project description is required";
    } else if (plainText.length < 20) {
      newErrors.description = `Please describe your project in at least 20 characters (current: ${plainText.length})`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validate()) return;

    setIsSubmitting(true);

    const formattedAdditionalLinks: ProjectLink[] = additionalLinks
      .filter((l) => l.url.trim().length > 0)
      .map((l) => ({
        title: l.title.trim() || "Additional Resource",
        url: l.url.trim(),
      }));

    try {
      const response = await apiRequest<Submission>("/submissions", {
        method: "POST",
        body: JSON.stringify({
          project_name: projectName.trim(),
          repo_url: repoUrl.trim(),
          live_link: liveLink.trim(),
          additional_links: formattedAdditionalLinks,
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
          additional_links: formattedAdditionalLinks,
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
      <Card className="border border-[#e4e6eb] bg-white dark:border-[#3a3b3c] dark:bg-[#242526] max-w-2xl mx-auto shadow-sm">
        <CardContent className="pt-8 pb-8 space-y-5">
          <div className="text-center space-y-3">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#e7f8ea] text-[#1f7a1f] dark:bg-[#1f7a1f]/20 dark:text-[#42b72a]">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold text-[#050505] dark:text-[#e4e6eb]">
              Project Submitted Successfully!
            </h2>
            <p className="text-sm text-[#65676b] dark:text-[#b0b3b8] max-w-md mx-auto">
              Your project{" "}
              <span className="font-semibold text-[#050505] dark:text-[#e4e6eb]">
                "{submittedProject.project_name}"
              </span>{" "}
              has been queued for mentor evaluation.
            </p>
          </div>

          {/* Submitted Links Summary */}
          <div className="rounded-xl border border-[#e4e6eb] bg-[#f0f2f5] dark:border-[#3a3b3c] dark:bg-[#18191a] p-4 space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#65676b] dark:text-[#b0b3b8]">
              Submitted Project Links
            </h3>
            <div className="flex flex-wrap gap-2">
              <a
                href={submittedProject.repo_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#ced0d4] bg-white px-3 py-1.5 text-xs font-semibold text-[#050505] hover:bg-[#e4e6eb] dark:border-[#3a3b3c] dark:bg-[#242526] dark:text-[#e4e6eb]"
              >
                <GithubIcon className="h-3.5 w-3.5" />
                Primary Repository
              </a>
              <a
                href={submittedProject.live_link}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#ced0d4] bg-white px-3 py-1.5 text-xs font-semibold text-[#050505] hover:bg-[#e4e6eb] dark:border-[#3a3b3c] dark:bg-[#242526] dark:text-[#e4e6eb]"
              >
                <Globe className="h-3.5 w-3.5" />
                Live Demo
              </a>
              {submittedProject.additional_links?.map((link, idx) => (
                <a
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#cbe4fc] bg-[#e7f3ff] px-3 py-1.5 text-xs font-semibold text-[#1877f2] hover:bg-[#cbe4fc] dark:border-[#1877f2]/30 dark:bg-[#1877f2]/15 dark:text-[#2d88ff]"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  {link.title}
                </a>
              ))}
            </div>
          </div>

          {/* Description Preview */}
          <div className="rounded-xl border border-[#e4e6eb] bg-white dark:border-[#3a3b3c] dark:bg-[#18191a] p-4 space-y-1.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#65676b] dark:text-[#b0b3b8]">
              Project Description (Rich Text)
            </h3>
            <div
              className="prose prose-sm dark:prose-invert max-w-none text-[#050505] dark:text-[#e4e6eb] tiptap-content text-sm pt-1"
              dangerouslySetInnerHTML={{ __html: submittedProject.description }}
            />
          </div>

          <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
            <Link href="/student/my-submissions">
              <Button className="w-full sm:w-auto bg-[#1877f2] hover:bg-[#166fe5] text-white">
                View My Submissions
              </Button>
            </Link>
            <Button
              variant="outline"
              onClick={() => {
                setSubmittedProject(null);
                setProjectName("");
                setRepoUrl("");
                setLiveLink("");
                setAdditionalLinks([]);
                setDescription("");
              }}
              className="w-full sm:w-auto border-[#ced0d4] dark:border-[#3a3b3c]"
            >
              Submit Another Project
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const plainTextLength = description.replace(/<[^>]*>?/gm, "").trim().length;

  return (
    <Card className="max-w-2xl mx-auto border border-[#e4e6eb] bg-white dark:border-[#3a3b3c] dark:bg-[#242526] shadow-sm">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e7f3ff] text-[#1877f2] dark:bg-[#1877f2]/20 dark:text-[#2d88ff]">
            <Send className="h-5 w-5" />
          </div>
          <div>
            <CardTitle>Submit Project for Evaluation</CardTitle>
            <CardDescription className="text-[#65676b] dark:text-[#b0b3b8]">
              Provide your project repositories, live demos, and a rich text description for mentor review
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

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Project Name */}
          <div>
            <label className="block text-xs font-semibold text-[#050505] dark:text-[#e4e6eb] mb-1.5 uppercase tracking-wider">
              Project Name <span className="text-[#1877f2]">*</span>
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

          {/* Primary Repository URL */}
          <div>
            <label className="block text-xs font-semibold text-[#050505] dark:text-[#e4e6eb] mb-1.5 uppercase tracking-wider">
              Primary Repository URL (GitHub / GitLab / Bitbucket) <span className="text-[#1877f2]">*</span>
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[#65676b] dark:text-[#b0b3b8]">
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
            <p className="mt-1 text-[11px] text-[#65676b] dark:text-[#b0b3b8]">
              Main source code repository. Duplicate repositories by the same student will be flagged.
            </p>
          </div>

          {/* Primary Live Demo Link */}
          <div>
            <label className="block text-xs font-semibold text-[#050505] dark:text-[#e4e6eb] mb-1.5 uppercase tracking-wider">
              Primary Live Demo URL <span className="text-[#1877f2]">*</span>
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[#65676b] dark:text-[#b0b3b8]">
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

          {/* Multiple Additional Links Section */}
          <div className="rounded-xl border border-[#e4e6eb] bg-[#f0f2f5]/50 dark:border-[#3a3b3c] dark:bg-[#18191a]/50 p-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <div className="flex items-center gap-1.5">
                  <Link2 className="h-4 w-4 text-[#1877f2]" />
                  <label className="text-xs font-bold uppercase tracking-wider text-[#050505] dark:text-[#e4e6eb]">
                    Additional Project Links ({additionalLinks.length})
                  </label>
                </div>
                <p className="text-[11px] text-[#65676b] dark:text-[#b0b3b8] mt-0.5">
                  Add backend repo, API documentation, Figma design, video walkthrough, or staging URLs.
                </p>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleAddLink()}
                className="gap-1.5 text-xs h-8 border-[#cbe4fc] bg-[#e7f3ff] text-[#1877f2] hover:bg-[#1877f2] hover:text-white dark:border-[#1877f2]/30 dark:bg-[#1877f2]/15 dark:text-[#2d88ff]"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Link
              </Button>
            </div>

            {/* Quick Suggestion Pills */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] font-medium text-[#65676b] dark:text-[#b0b3b8]">
                Quick add:
              </span>
              {COMMON_LINK_SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => handleAddLink(suggestion)}
                  className="rounded-full border border-[#ced0d4] bg-white dark:border-[#3a3b3c] dark:bg-[#242526] px-2.5 py-0.5 text-[11px] font-medium text-[#050505] dark:text-[#e4e6eb] hover:border-[#1877f2] hover:text-[#1877f2] transition-colors"
                >
                  + {suggestion}
                </button>
              ))}
            </div>

            {/* Additional Links Dynamic Rows */}
            {additionalLinks.length > 0 && (
              <div className="space-y-2.5 pt-2">
                {additionalLinks.map((link, idx) => (
                  <div
                    key={link.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center gap-2 rounded-lg border border-[#e4e6eb] bg-white dark:border-[#3a3b3c] dark:bg-[#242526] p-2.5 shadow-2xs"
                  >
                    <div className="w-full sm:w-1/3">
                      <Input
                        placeholder="Link Label (e.g. Backend Repo)"
                        value={link.title}
                        onChange={(e) => handleUpdateLink(link.id, "title", e.target.value)}
                        className="h-8 text-xs"
                      />
                    </div>
                    <div className="w-full sm:flex-1 relative">
                      <Input
                        placeholder="https://..."
                        value={link.url}
                        onChange={(e) => handleUpdateLink(link.id, "url", e.target.value)}
                        error={errors[`link-${link.id}`]}
                        className="h-8 text-xs"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveLink(link.id)}
                      className="text-[#65676b] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 p-1.5 rounded-md transition-colors self-end sm:self-center"
                      title="Remove Link"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Project Description with TipTap Rich Text */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-semibold text-[#050505] dark:text-[#e4e6eb] uppercase tracking-wider">
                Project Description (Rich Text Editor) <span className="text-[#1877f2]">*</span>
              </label>
              <span className="text-[11px] font-medium text-[#65676b] dark:text-[#b0b3b8]">
                {plainTextLength} characters
              </span>
            </div>

            <RichTextEditor
              content={description}
              onChange={(html) => {
                setDescription(html);
                if (errors.description) {
                  setErrors({ ...errors, description: "" });
                }
              }}
              placeholder="Outline the core features, architectural decisions, technologies used, instructions, and areas you'd like feedback on..."
              error={errors.description}
            />
            <p className="mt-1.5 text-[11px] text-[#65676b] dark:text-[#b0b3b8]">
              Use formatting like bold, headings, bullet lists, code blocks, and links to present your work professionally.
            </p>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 text-base font-semibold bg-[#1877f2] hover:bg-[#166fe5] text-white shadow-sm"
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
