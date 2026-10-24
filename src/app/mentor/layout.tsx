import React from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";

export default function MentorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell allowedRoles={["MENTOR", "ADMIN"]}>{children}</DashboardShell>;
}
