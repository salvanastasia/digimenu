"use client";

import { useMemo, useState } from "react";
import {
  buildCreateAdminTransaction,
  buildDeleteAdminTransaction,
  normalizeAdminEmail,
  type DashboardAdminRow,
} from "@/lib/dashboard-admin";
import { db } from "@/lib/db";

type DashboardAdminsPanelProps = {
  currentEmail: string;
};

export function DashboardAdminsPanel({ currentEmail }: DashboardAdminsPanelProps) {
  const [newEmail, setNewEmail] = useState("");
  const [actionError, setActionError] = useState<string | null>(null);

  const { isLoading, error, data } = db.useQuery({ dashboardAdmins: {} });

  const admins = useMemo(
    () =>
      [...((data?.dashboardAdmins ?? []) as DashboardAdminRow[])].sort((a, b) =>
        a.email.localeCompare(b.email, "it"),
      ),
    [data?.dashboardAdmins],
  );

  const handleAdd = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const email = normalizeAdminEmail(newEmail);
    if (!email) return;

    if (admins.some((admin) => admin.email === email)) {
      setActionError("Questa email è già tra gli amministratori.");
      return;
    }

    setActionError(null);
    void db
      .transact(buildCreateAdminTransaction(email))
      .then(() => setNewEmail(""))
      .catch((err) => {
        setActionError(
          err instanceof Error ? err.message : "Aggiunta amministratore non riuscita.",
        );
      });
  };

  const handleRemove = (admin: DashboardAdminRow) => {
    if (admin.email === currentEmail) {
      setActionError("Non puoi rimuovere il tuo account amministratore.");
      return;
    }

    setActionError(null);
    void db.transact(buildDeleteAdminTransaction(admin.id)).catch((err) => {
      setActionError(
        err instanceof Error ? err.message : "Rimozione amministratore non riuscita.",
      );
    });
  };

  return (
    <section className="mb-8 rounded-[18px] border border-[#e4e4e4] bg-white p-5">
      <h2 className="text-[1.05rem] font-bold text-[#141415]">Amministratori</h2>
      <p className="mt-1 text-[0.88rem] text-[#606060]">
        Solo queste email possono accedere alla dashboard e modificare i clienti.
      </p>

      {isLoading ? (
        <p className="mt-4 text-[0.88rem] text-[#606060]">Caricamento…</p>
      ) : error ? (
        <p className="mt-4 text-[0.88rem] text-[#8a1f1f]">
          Impossibile caricare gli amministratori.
        </p>
      ) : (
        <ul className="mt-4 divide-y divide-[#ececec]">
          {admins.map((admin) => (
            <li
              key={admin.id}
              className="flex flex-wrap items-center justify-between gap-2 py-3 first:pt-0 last:pb-0"
            >
              <span className="text-[0.92rem] font-medium text-[#141415]">
                {admin.email}
                {admin.email === currentEmail ? (
                  <span className="ml-2 text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-[#560200]">
                    Tu
                  </span>
                ) : null}
              </span>
              {admin.email !== currentEmail ? (
                <button
                  type="button"
                  onClick={() => handleRemove(admin)}
                  className="rounded-full border border-[#d8dadc] px-3 py-1.5 text-[0.8rem] font-semibold text-[#8a1f1f] transition-colors hover:bg-[#fff1f1]"
                >
                  Rimuovi
                </button>
              ) : null}
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={handleAdd} className="mt-4 flex flex-wrap items-end gap-3">
        <label className="flex min-w-[220px] flex-1 flex-col gap-1.5">
          <span className="text-[0.78rem] font-semibold text-[#606060]">
            Aggiungi email
          </span>
          <input
            type="email"
            value={newEmail}
            onChange={(event) => setNewEmail(event.target.value)}
            placeholder="nuovo@esempio.it"
            className="rounded-[10px] border border-[#d8dadc] px-3 py-2 text-[0.92rem] outline-none focus:border-[#560200]"
          />
        </label>
        <button
          type="submit"
          className="rounded-full border border-[#d8dadc] bg-white px-4 py-2 text-[0.84rem] font-semibold text-[#141415] transition-colors hover:bg-[#f5f5f5]"
        >
          Aggiungi
        </button>
      </form>

      {actionError ? (
        <p className="mt-3 text-[0.82rem] font-medium text-[#8a1f1f]">{actionError}</p>
      ) : null}
    </section>
  );
}
