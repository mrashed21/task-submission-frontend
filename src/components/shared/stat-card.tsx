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
  accentColor?: string;
}

const fbStyle = {
  bg: "bg-white dark:bg-[#242526]",
  border: "border-[#e4e6eb] dark:border-[#3a3b3c]",
  iconBg: "bg-[#e7f3ff] text-[#1877f2] dark:bg-[#1877f2]/20 dark:text-[#2d88ff]",
  glow: "hover:border-[#1877f2]/40 transition-colors",
};

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
}: StatCardProps) {
  const styles = fbStyle;

  return (
    <Card
      className={cn(
        "relative overflow-hidden transition-all duration-150 border-[#e4e6eb] bg-white dark:border-[#3a3b3c] dark:bg-[#242526] shadow-xs",
        styles.glow
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
            <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
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
