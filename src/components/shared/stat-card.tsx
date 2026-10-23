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
  accentColor?: "indigo" | "amber" | "emerald" | "rose" | "purple" | "blue";
}

const colorStyles = {
  indigo: {
    bg: "bg-[#1877f2]/10",
    border: "border-[#1877f2]/25",
    iconBg: "bg-[#1877f2]/15 text-[#1877f2]",
    glow: "hover:border-[#1877f2]/50",
  },
  blue: {
    bg: "bg-[#1877f2]/10",
    border: "border-[#1877f2]/25",
    iconBg: "bg-[#1877f2]/15 text-[#1877f2]",
    glow: "hover:border-[#1877f2]/50",
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
    bg: "bg-zinc-800/60",
    border: "border-zinc-700/60",
    iconBg: "bg-zinc-800 text-zinc-200",
    glow: "hover:border-zinc-600",
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
  const styles = colorStyles[accentColor] || colorStyles.indigo;

  return (
    <Card
      className={cn(
        "relative overflow-hidden transition-all duration-150 border-zinc-200 bg-white dark:border-zinc-800 dark:bg-black shadow-sm",
        styles.border
      )}
    >
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            {title}
          </p>
          <div className={cn("rounded-lg p-2.5", styles.iconBg)}>
            <Icon className="h-5 w-5" />
          </div>
        </div>

        <div className="mt-4 flex items-baseline justify-between">
          <div className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
            {value}
          </div>
          {trend && (
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
              {trend}
            </span>
          )}
        </div>

        {description && (
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}
