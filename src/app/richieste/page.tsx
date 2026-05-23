import type { Metadata } from "next";
import { ContactRequestsPage } from "@/components/dashboard/ContactRequestsPage";
import { DashboardGate } from "@/components/dashboard/DashboardGate";

export const metadata: Metadata = {
  title: "Richieste · DigiMenu",
  description: "Richieste di contatto dalla landing page DigiMenu.",
};

export default function RichiestePage() {
  return (
    <DashboardGate>
      <ContactRequestsPage />
    </DashboardGate>
  );
}
