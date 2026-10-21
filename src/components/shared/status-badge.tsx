import React from "react";
import { CheckCircle2, Clock, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SubmissionStatus } from "@/lib/types";

interface StatusBadgeProps {
  status: SubmissionStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  switch (status) {
    case "APPROVED":
      return (
        <Badge variant="success" className={className}>
          <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
          Approved
        </Badge>
      );
    case "REJECTED":
      return (
        <Badge variant="destructive" className={className}>
          <XCircle className="mr-1 h-3.5 w-3.5" />
          Rejected
        </Badge>
      );
    case "PENDING":
    default:
      return (
        <Badge variant="warning" className={className}>
          <Clock className="mr-1 h-3.5 w-3.5" />
          Pending Review
        </Badge>
      );
  }
}
