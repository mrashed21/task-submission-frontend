import React from "react";
import { CheckCircle2, Clock, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SubmissionStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status?: SubmissionStatus | string | null;
  className?: string;
  showIcon?: boolean;
}

export function StatusBadge({
  status,
  className,
  showIcon = true,
}: StatusBadgeProps) {
  const normalized = String(status || "PENDING")
    .trim()
    .toUpperCase();

  switch (normalized) {
    case "APPROVED":
      return (
        <Badge
          variant="success"
          className={cn(
            "inline-flex items-center gap-1.5 whitespace-nowrap font-medium text-xs",
            className
          )}
        >
          {showIcon && <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />}
          <span>Approved</span>
        </Badge>
      );
    case "REJECTED":
      return (
        <Badge
          variant="destructive"
          className={cn(
            "inline-flex items-center gap-1.5 whitespace-nowrap font-medium text-xs",
            className
          )}
        >
          {showIcon && <XCircle className="h-3.5 w-3.5 shrink-0" />}
          <span>Rejected</span>
        </Badge>
      );
    case "PENDING":
    default:
      return (
        <Badge
          variant="warning"
          className={cn(
            "inline-flex items-center gap-1.5 whitespace-nowrap font-medium text-xs",
            className
          )}
        >
          {showIcon && <Clock className="h-3.5 w-3.5 shrink-0" />}
          <span>Pending Review</span>
        </Badge>
      );
  }
}
