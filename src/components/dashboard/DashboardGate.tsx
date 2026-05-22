"use client";

import { DashboardAccessCheck } from "@/components/dashboard/DashboardAccessCheck";
import { DashboardAuth } from "@/components/dashboard/DashboardAuth";
import { db, isInstantConfigured } from "@/lib/db";

export function DashboardGate() {
  if (!isInstantConfigured) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#f7f7f7] px-6 text-center">
        <h1 className="text-[1.4rem] font-bold text-[#141415]">
          InstantDB non configurato
        </h1>
        <p className="max-w-lg text-[0.95rem] leading-relaxed text-[#606060]">
          Aggiungi <code>NEXT_PUBLIC_INSTANT_APP_ID</code> al file{" "}
          <code>.env</code>, poi esegui <code>npm run instant:push</code>.
        </p>
      </div>
    );
  }

  return (
    <>
      <db.SignedOut>
        <DashboardAuth />
      </db.SignedOut>
      <db.SignedIn>
        <DashboardAccessCheck />
      </db.SignedIn>
    </>
  );
}
