"use client";

import { useRef, useState } from "react";
import { db } from "@/lib/db";

export function DashboardAuth() {
  const [sentEmail, setSentEmail] = useState("");
  const [sendError, setSendError] = useState<string | null>(null);

  if (!sentEmail) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#f7f7f7] px-4">
        <div className="w-full max-w-md rounded-[18px] border border-[#e4e4e4] bg-white p-6 shadow-sm">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[#560200]">
            DigiMenu
          </p>
          <h1 className="mt-2 text-[1.35rem] font-bold text-[#141415]">
            Accedi alla dashboard
          </h1>
          <p className="mt-2 text-[0.92rem] leading-relaxed text-[#606060]">
            Inserisci la tua email. Ti invieremo un codice di verifica se sei
            autorizzato ad accedere.
          </p>
          <EmailStep
            sendError={sendError}
            onSendEmail={(email) => {
              setSendError(null);
              setSentEmail(email);
            }}
            onSendError={(message) => {
              setSentEmail("");
              setSendError(message);
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#f7f7f7] px-4">
      <div className="w-full max-w-md rounded-[18px] border border-[#e4e4e4] bg-white p-6 shadow-sm">
        <CodeStep
          sentEmail={sentEmail}
          onBack={() => {
            setSentEmail("");
            setSendError(null);
          }}
        />
      </div>
    </div>
  );
}

function EmailStep({
  sendError,
  onSendEmail,
  onSendError,
}: {
  sendError: string | null;
  onSendEmail: (email: string) => void;
  onSendError: (message: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const email = inputRef.current?.value.trim() ?? "";
    if (!email) return;

    onSendEmail(email);
    void db.auth.sendMagicCode({ email }).catch((err) => {
      const message =
        (err as { body?: { message?: string } })?.body?.message ??
        "Invio codice non riuscito.";
      onSendError(message);
    });
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
      <label className="flex flex-col gap-1.5">
        <span className="text-[0.78rem] font-semibold text-[#606060]">Email</span>
        <input
          ref={inputRef}
          type="email"
          required
          autoFocus
          placeholder="nome@esempio.it"
          className="rounded-[10px] border border-[#d8dadc] px-3 py-2.5 text-[0.95rem] text-[#141415] outline-none focus:border-[#560200]"
        />
      </label>
      {sendError ? (
        <p className="text-[0.82rem] font-medium text-[#8a1f1f]">{sendError}</p>
      ) : null}
      <button
        type="submit"
        className="rounded-full bg-[#560200] px-5 py-2.5 text-[0.88rem] font-semibold text-white transition-colors hover:bg-[#6d0200]"
      >
        Invia codice
      </button>
    </form>
  );
}

function CodeStep({
  sentEmail,
  onBack,
}: {
  sentEmail: string;
  onBack: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [verifyError, setVerifyError] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const code = inputRef.current?.value.trim() ?? "";
    if (!code) return;

    setVerifyError(null);
    void db.auth.signInWithMagicCode({ email: sentEmail, code }).catch((err) => {
      if (inputRef.current) inputRef.current.value = "";
      const message =
        (err as { body?: { message?: string } })?.body?.message ??
        "Codice non valido.";
      setVerifyError(message);
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <p className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[#560200]">
        DigiMenu
      </p>
      <h1 className="text-[1.35rem] font-bold text-[#141415]">Inserisci il codice</h1>
      <p className="text-[0.92rem] leading-relaxed text-[#606060]">
        Abbiamo inviato un codice a <strong>{sentEmail}</strong>. Controlla la
        posta e incolla il codice qui sotto.
      </p>
      <label className="flex flex-col gap-1.5">
        <span className="text-[0.78rem] font-semibold text-[#606060]">Codice</span>
        <input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          required
          autoFocus
          placeholder="123456"
          className="rounded-[10px] border border-[#d8dadc] px-3 py-2.5 text-[0.95rem] text-[#141415] outline-none focus:border-[#560200]"
        />
      </label>
      {verifyError ? (
        <p className="text-[0.82rem] font-medium text-[#8a1f1f]">{verifyError}</p>
      ) : null}
      <button
        type="submit"
        className="rounded-full bg-[#560200] px-5 py-2.5 text-[0.88rem] font-semibold text-white transition-colors hover:bg-[#6d0200]"
      >
        Verifica e accedi
      </button>
      <button
        type="button"
        onClick={onBack}
        className="text-[0.84rem] font-semibold text-[#606060] underline-offset-2 hover:underline"
      >
        Usa un&apos;altra email
      </button>
    </form>
  );
}
