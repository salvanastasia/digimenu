"use client";

import { DashboardNavbar } from "@/components/dashboard/DashboardNavbar";

type DashboardShellProps = {
  children: React.ReactNode;
  title: string;
  hidden?: boolean;
  onNewClient?: () => void;
};

export function DashboardShell({
  children,
  title,
  hidden,
  onNewClient,
}: DashboardShellProps) {
  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      <DashboardNavbar title={title} hidden={hidden} onNewClient={onNewClient} />
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">{children}</main>
    </div>
  );
}
