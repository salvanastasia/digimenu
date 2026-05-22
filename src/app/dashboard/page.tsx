import type { Metadata } from "next";
import { Suspense } from "react";
import { DashboardApp } from "@/components/dashboard/DashboardApp";

export const metadata: Metadata = {
  title: "Dashboard clienti · DigiMenu",
  description: "Gestisci i clienti e le impostazioni del menu digitale.",
};

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#f7f7f7] text-[#606060]">
          Caricamento dashboard…
        </div>
      }
    >
      <DashboardApp />
    </Suspense>
  );
}
