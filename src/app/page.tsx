"use client";

import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Code2,
  FileCheck2,
  GraduationCap,
  Layers,
  LayoutDashboard,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/lib/auth-context";

export default function HomePage() {
  const { user, setDemoUser } = useAuth();

  return (
    <div className="relative isolate overflow-hidden">
      {/* Background glowing gradients */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-indigo-500/20 via-purple-500/20 to-pink-500/10 blur-3xl" />

      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold text-indigo-300">
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
            <span>Full-Stack Web Instructor Assessment System</span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl max-w-3xl mx-auto leading-tight">
            Seamless Project Submissions & <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Mentor Evaluations</span>
          </h1>

          <p className="mx-auto max-w-2xl text-base text-slate-300 sm:text-lg">
            Role-based dashboard featuring student submission portals with spam rate-limiting, duplicate prevention, and real-time mentor review workflows with server-side filters.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link href="/student/submit">
              <Button size="lg" className="gap-2 shadow-lg shadow-indigo-600/30">
                <GraduationCap className="h-5 w-5" />
                Submit Project (Student)
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>

            <Link href="/mentor/dashboard">
              <Button
                variant="outline"
                size="lg"
                className="gap-2 border-slate-700 bg-slate-900/60 hover:bg-slate-800"
              >
                <LayoutDashboard className="h-5 w-5 text-purple-400" />
                Mentor Review Dashboard
              </Button>
            </Link>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="mt-20 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="border-slate-800 bg-slate-900/40 hover:border-indigo-500/40 transition-colors">
            <CardContent className="p-6 space-y-3">
              <div className="rounded-lg bg-indigo-500/10 p-3 w-fit text-indigo-400">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Robust Validation & Spam Defense</h3>
              <p className="text-sm text-slate-400">
                Guards against duplicate repository links and implements rate limiting to prevent submission spam.
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-800 bg-slate-900/40 hover:border-purple-500/40 transition-colors">
            <CardContent className="p-6 space-y-3">
              <div className="rounded-lg bg-purple-500/10 p-3 w-fit text-purple-400">
                <LayoutDashboard className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Paginated Mentor Dashboard</h3>
              <p className="text-sm text-slate-400">
                Server-side filtered data tables by status, fast search, and one-click approval/rejection modal workflows.
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-800 bg-slate-900/40 hover:border-pink-500/40 transition-colors">
            <CardContent className="p-6 space-y-3">
              <div className="rounded-lg bg-pink-500/10 p-3 w-fit text-pink-400">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Aggregated Real-time Stats</h3>
              <p className="text-sm text-slate-400">
                High-level visibility into total submissions, pending queues, acceptance rates, and student participation.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Demo Switcher Section */}
        <div className="mt-16 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 text-center max-w-2xl mx-auto">
          <h2 className="text-lg font-bold text-white mb-2">Instant Role Demo Switcher</h2>
          <p className="text-xs text-slate-400 mb-6">
            Test the experience as either role without manually typing credentials:
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              onClick={() => {
                setDemoUser("STUDENT");
                window.location.href = "/student/submit";
              }}
              className="w-full sm:w-auto gap-2 bg-indigo-600 hover:bg-indigo-700"
            >
              <GraduationCap className="h-4 w-4" />
              Switch to Student View
            </Button>
            <Button
              onClick={() => {
                setDemoUser("MENTOR");
                window.location.href = "/mentor/dashboard";
              }}
              className="w-full sm:w-auto gap-2 bg-purple-600 hover:bg-purple-700"
            >
              <LayoutDashboard className="h-4 w-4" />
              Switch to Mentor View
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
