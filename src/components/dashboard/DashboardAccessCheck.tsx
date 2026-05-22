"use client";

import { useDashboardAdmin } from "@/hooks/useDashboardAdmin";
import { db } from "@/lib/db";

export function DashboardAccessCheck({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, email, status, linkError, queryError } = useDashboardAdmin();

  if (status === "loading" || status === "linking") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-[#f7f7f7] text-[#606060]">
        <p>
          {status === "linking"
            ? "Collegamento account amministratore…"
            : "Verifica accesso…"}
        </p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#f7f7f7] px-6 text-center">
        <h1 className="text-[1.2rem] font-bold text-[#141415]">Errore accesso</h1>
        <p className="max-w-md text-[0.92rem] text-[#8a1f1f]">
          {linkError ?? queryError?.message ?? "Riprova tra poco."}
        </p>
        <button
          type="button"
          onClick={() => void db.auth.signOut()}
          className="rounded-full border border-[#d8dadc] bg-white px-4 py-2 text-[0.88rem] font-semibold text-[#141415]"
        >
          Esci
        </button>
      </div>
    );
  }

  if (status === "not_allowed") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#f7f7f7] px-6 text-center">
        <h1 className="text-[1.2rem] font-bold text-[#141415]">
          Accesso non autorizzato
        </h1>
        <p className="max-w-md text-[0.92rem] leading-relaxed text-[#606060]">
          L&apos;email{" "}
          <strong className="font-semibold text-[#141415]">{email || user.email}</strong>{" "}
          non è tra gli amministratori della dashboard. Contatta chi gestisce DigiMenu
          per richiedere l&apos;accesso.
        </p>
        <button
          type="button"
          onClick={() => void db.auth.signOut()}
          className="rounded-full bg-[#560200] px-5 py-2.5 text-[0.88rem] font-semibold text-white"
        >
          Esci
        </button>
      </div>
    );
  }

  return children;
}
