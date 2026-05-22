import type { Metadata } from "next";
import { DashboardGate } from "@/components/dashboard/DashboardGate";

export const metadata: Metadata = {
  title: "Dashboard clienti · DigiMenu",
  description: "Gestisci i clienti e le impostazioni del menu digitale.",
};

export default function DashboardPage() {
  return <DashboardGate />;
}
