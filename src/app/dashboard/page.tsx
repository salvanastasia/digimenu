import type { Metadata } from "next";
import { DashboardApp } from "@/components/dashboard/DashboardApp";

export const metadata: Metadata = {
  title: "Dashboard clienti · DigiMenu",
  description: "Gestisci i clienti e le impostazioni del menu digitale.",
};

export default function DashboardPage() {
  return <DashboardApp />;
}
