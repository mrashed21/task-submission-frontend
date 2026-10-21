import React from "react";
import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: string;
  accentColor?: "indigo" | "amber" | "emerald" | "rose" | "purple";
}

const colorStyles = {
  indigo: {
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/20",
    iconBg: "bg-indigo-500/20 text-indigo-400",
    glow: "hover:border-indigo-500/40",
  },
  amber: {
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    iconBg: "bg-amber-500/20 text-amber-400",
    glow: "hover:border-amber-500/40",
  },
  emerald: {
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    iconBg: "bg-emerald-500/20 text-emerald-400",
    glow: "hover:border-emerald-500/40",
  },
  rose: {
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
    iconBg: "bg-rose-500/20 text-rose-400",
    glow: "hover:border-rose-500/40",
  },
  purple: {
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
    iconBg: "bg-purple-500/20 text-purple-400",
    glow: "hover:border-purple-500/40",
  },
};

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  accentColor = "indigo",
}: StatCardProps) {
  const styles = colorStyles[accentColor];

  return (
    <Card
      className={cn(
        "relative overflow-hidden transition-all duration-300 hover:shadow-lg",
        styles.border,
        styles.glow
      )}
    >
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {title}
          </p>
          <div className={cn("rounded-lg p-2.5", styles.iconBg)}>
            <Icon className="h-5 w-5" />
          </div>
        </div>

        <div className="mt-4 flex items-baseline justify-between">
          <div className="text-3xl font-extrabold tracking-tight text-white">
            {value}
          </div>
          {trend && (
            <span className="text-xs font-medium text-emerald-400">
              {trend}
            </span>
          )}
        </div>

        {description && (
          <p className="mt-1 text-xs text-slate-400">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}
