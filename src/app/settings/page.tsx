import type { Metadata } from "next";
import { DashboardGate } from "@/components/dashboard/DashboardGate";
import { DashboardSettingsPage } from "@/components/dashboard/DashboardSettingsPage";

export const metadata: Metadata = {
  title: "Impostazioni · DigiMenu",
  description: "Gestisci gli amministratori della dashboard DigiMenu.",
};

export default function SettingsPage() {
  return (
    <DashboardGate>
      <DashboardSettingsPage />
    </DashboardGate>
  );
}
