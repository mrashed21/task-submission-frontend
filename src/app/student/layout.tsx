import React from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell allowedRoles={["STUDENT"]}>{children}</DashboardShell>;
}
