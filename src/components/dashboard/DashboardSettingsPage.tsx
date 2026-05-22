"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { DashboardAdminsPanel } from "@/components/dashboard/DashboardAdminsPanel";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { useDashboardAdmin } from "@/hooks/useDashboardAdmin";

export function DashboardSettingsPage() {
  const router = useRouter();
  const { email: adminEmail } = useDashboardAdmin();

  return (
    <DashboardShell
      title="Impostazioni"
      onNewClient={() => router.push("/dashboard?newClient=1")}
    >
      <Link
        href="/dashboard"
        className="mb-5 inline-flex text-[0.88rem] font-semibold text-[#560200] transition-colors hover:text-[#6d0200]"
      >
        ← Dashboard
      </Link>

      <p className="mb-6 text-[0.92rem] text-[#606060]">
        Gestisci gli account autorizzati ad accedere alla dashboard.
      </p>

      <DashboardAdminsPanel currentEmail={adminEmail} />
    </DashboardShell>
  );
}
