"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ConfirmDialog } from "@/components/dashboard/ConfirmDialog";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import {
  deleteContactRequest,
  formatContactRequestDate,
  markContactRequestsRead,
  useContactRequests,
  type ContactRequestRow,
} from "@/hooks/useContactRequests";

function TrashIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M10 11v6M14 11v6M6 7l1 12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-12"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ContactRequestsPage() {
  const router = useRouter();
  const { requests, isLoading, error } = useContactRequests();
  const markedRef = useRef(false);
  const [pendingDelete, setPendingDelete] = useState<ContactRequestRow | null>(
    null,
  );
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (isLoading || markedRef.current) return;

    const unreadIds = requests.filter((request) => !request.read).map(
      (request) => request.id,
    );
    if (unreadIds.length === 0) return;

    markedRef.current = true;
    void markContactRequestsRead(unreadIds);
  }, [isLoading, requests]);

  const handleConfirmDelete = async () => {
    if (!pendingDelete || isDeleting) return;

    setIsDeleting(true);
    setDeleteError(null);

    try {
      await deleteContactRequest(pendingDelete.id);
      setPendingDelete(null);
    } catch (deleteRequestError) {
      setDeleteError(
        deleteRequestError instanceof Error
          ? deleteRequestError.message
          : "Eliminazione non riuscita.",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <DashboardShell
      title="Richieste"
      onNewClient={() => router.push("/dashboard?newClient=1")}
    >
      <ConfirmDialog
        open={pendingDelete !== null}
        title="Elimina richiesta"
        message={
          pendingDelete
            ? `Vuoi eliminare la richiesta di ${pendingDelete.firstName} ${pendingDelete.lastName}? L'operazione non è reversibile.`
            : ""
        }
        confirmLabel={isDeleting ? "Eliminazione…" : "Elimina"}
        cancelLabel="Annulla"
        destructive
        onConfirm={() => void handleConfirmDelete()}
        onCancel={() => {
          if (isDeleting) return;
          setPendingDelete(null);
          setDeleteError(null);
        }}
      />

      <Link
        href="/dashboard"
        className="mb-5 inline-flex text-[0.88rem] font-semibold text-[#560200] transition-colors hover:text-[#6d0200]"
      >
        ← Dashboard
      </Link>

      <p className="mb-6 text-[0.92rem] text-[#606060]">
        Richieste di contatto inviate dal form &ldquo;Unisciti a noi&rdquo; sulla
        landing page.
      </p>

      {deleteError ? (
        <p className="mb-4 rounded-[12px] bg-[#fff1f1] px-4 py-3 text-[0.88rem] text-[#8a1f1f]">
          {deleteError}
        </p>
      ) : null}

      {error ? (
        <p className="rounded-[12px] bg-[#fff1f1] px-4 py-3 text-[0.88rem] text-[#8a1f1f]">
          Impossibile caricare le richieste.
        </p>
      ) : null}

      {isLoading ? (
        <p className="text-[0.92rem] text-[#606060]">Caricamento richieste…</p>
      ) : requests.length === 0 ? (
        <p className="rounded-[14px] border border-[#e4e4e4] bg-white px-5 py-8 text-center text-[0.92rem] text-[#606060]">
          Nessuna richiesta per ora.
        </p>
      ) : (
        <div className="space-y-3">
          {requests.map((request) => (
            <article
              key={request.id}
              className="relative rounded-[14px] border border-[#e4e4e4] bg-white p-5 pb-14 shadow-[0_2px_12px_rgba(0,0,0,0.04)]"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-[1rem] font-bold text-[#141415]">
                      {request.firstName} {request.lastName}
                    </h2>
                    {!request.read ? (
                      <span className="rounded-full bg-[#560200]/10 px-2 py-0.5 text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-[#560200]">
                        Nuova
                      </span>
                    ) : null}
                  </div>
                  {request.businessName ? (
                    <p className="mt-1 text-[0.88rem] text-[#606060]">
                      {request.businessName}
                    </p>
                  ) : null}
                </div>
                <time
                  dateTime={request.createdAt}
                  className="text-[0.78rem] tabular-nums text-[#606060]"
                >
                  {formatContactRequestDate(request.createdAt)}
                </time>
              </div>

              <dl className="mt-4 grid gap-2 text-[0.88rem] sm:grid-cols-2">
                <div>
                  <dt className="text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-[#606060]">
                    Telefono
                  </dt>
                  <dd>
                    <a
                      href={`tel:${request.phone.replace(/\s+/g, "")}`}
                      className="font-medium text-[#141415] hover:text-[#560200]"
                    >
                      {request.phone}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-[#606060]">
                    Email
                  </dt>
                  <dd>
                    <a
                      href={`mailto:${request.email}`}
                      className="font-medium text-[#141415] hover:text-[#560200]"
                    >
                      {request.email}
                    </a>
                  </dd>
                </div>
              </dl>

              <button
                type="button"
                aria-label={`Elimina richiesta di ${request.firstName} ${request.lastName}`}
                onClick={() => {
                  setDeleteError(null);
                  setPendingDelete(request);
                }}
                className="absolute bottom-4 right-4 flex h-9 w-9 items-center justify-center rounded-full border border-[#d8dadc] bg-white text-[#8a1f1f] transition-colors hover:border-[#8a1f1f]/30 hover:bg-[#fff1f1]"
              >
                <TrashIcon />
              </button>
            </article>
          ))}
        </div>
      )}
    </DashboardShell>
  );
}
