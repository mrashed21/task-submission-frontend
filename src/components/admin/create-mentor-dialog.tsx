"use client";

import React, { useState } from "react";
import {
  AlertCircle,
  Check,
  Copy,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Mail,
  RefreshCw,
  User,
  UserCheck,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/lib/api-client";
import { MentorUser } from "@/lib/types";

interface CreateMentorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMentorCreated?: (newMentor: MentorUser) => void;
}

export function CreateMentorDialog({
  open,
  onOpenChange,
  onMentorCreated,
}: CreateMentorDialogProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdMentor, setCreatedMentor] = useState<{
    name: string;
    email: string;
    password?: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setError(null);
    setCreatedMentor(null);
    setCopied(false);
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const generateRandomPassword = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%";
    let pwd = "Mntr-";
    for (let i = 0; i < 8; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(pwd);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter the mentor's full name");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }
    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await apiRequest<MentorUser>("/admin/mentors", {
        method: "POST",
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      if (response.data) {
        setCreatedMentor({
          name: response.data.name,
          email: response.data.email,
          password,
        });
        if (onMentorCreated) {
          onMentorCreated(response.data);
        }
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to create mentor. Please check your credentials.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyCredentials = () => {
    if (!createdMentor) return;
    const text = `Mentor Credentials:\nName: ${createdMentor.name}\nEmail: ${createdMentor.email}\nPassword: ${createdMentor.password || "as configured"}\nLogin URL: http://localhost:3000/login`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400">
              <UserCheck className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle>Add New Mentor</DialogTitle>
              <DialogDescription>
                Create a qualified mentor account for evaluating student submissions.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {error && (
          <Alert variant="destructive" className="py-2.5">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs">{error}</AlertDescription>
          </Alert>
        )}

        {createdMentor ? (
          <div className="space-y-4 py-2">
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 text-emerald-950 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-200">
              <div className="flex items-center gap-2 font-semibold text-emerald-700 dark:text-emerald-400">
                <Check className="h-4 w-4" />
                <span>Mentor Registered Successfully!</span>
              </div>
              <p className="mt-1 text-xs text-emerald-800/80 dark:text-emerald-300/80">
                The account has been created with full evaluation permissions. Share these credentials with the mentor.
              </p>
            </div>

            <div className="space-y-2 rounded-xl border border-zinc-200 bg-zinc-50 p-4 font-mono text-xs dark:border-zinc-800 dark:bg-zinc-900/60">
              <div className="flex justify-between items-center py-1 border-b border-zinc-200/60 dark:border-zinc-800">
                <span className="text-zinc-500 dark:text-zinc-400 font-sans">Full Name:</span>
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">{createdMentor.name}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-zinc-200/60 dark:border-zinc-800">
                <span className="text-zinc-500 dark:text-zinc-400 font-sans">Email Address:</span>
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">{createdMentor.email}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-zinc-500 dark:text-zinc-400 font-sans">Temporary Password:</span>
                <span className="font-semibold text-purple-600 dark:text-purple-400">{createdMentor.password}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-2 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={handleCopyCredentials}
                className="gap-1.5 text-xs h-9"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                    <span>Copied Credentials</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy Credentials</span>
                  </>
                )}
              </Button>
              <Button
                type="button"
                onClick={handleClose}
                className="bg-purple-600 hover:bg-purple-700 text-white text-xs h-9"
              >
                Done
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Mentor Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                <Input
                  type="text"
                  placeholder="e.g. Dr. Alex Morgan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-9 h-10 text-sm"
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                <Input
                  type="email"
                  placeholder="mentor@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9 h-10 text-sm"
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={generateRandomPassword}
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
                >
                  <RefreshCw className="h-3 w-3" />
                  Generate Strong
                </button>
              </div>
              <div className="relative">
                <KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9 pr-10 h-10 text-sm font-mono"
                  disabled={isLoading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <DialogFooter className="pt-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
                className="h-9 text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="gap-2 bg-purple-600 hover:bg-purple-700 text-white font-medium h-9 text-xs"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <UserCheck className="h-3.5 w-3.5" />
                    Create Mentor Account
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
