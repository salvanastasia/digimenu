"use client";

import { useEffect, useState } from "react";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";

type ContactModalProps = {
  open: boolean;
  onClose: () => void;
};

type ContactFormState = {
  firstName: string;
  lastName: string;
  businessName: string;
  phone: string;
  email: string;
};

const EMPTY_FORM: ContactFormState = {
  firstName: "",
  lastName: "",
  businessName: "",
  phone: "",
  email: "",
};

function MailSentIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="mx-auto h-14 w-14 text-[#560200]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    >
      <rect x="3.5" y="5.5" width="17" height="13" rx="2.5" />
      <path
        d="M4 7.5 12 13l8-5.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ContactModal({ open, onClose }: ContactModalProps) {
  const [form, setForm] = useState<ContactFormState>(EMPTY_FORM);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useLockBodyScroll(open);

  useEffect(() => {
    if (!open) {
      setForm(EMPTY_FORM);
      setSubmitted(false);
      setIsSubmitting(false);
      setError(null);
    }
  }, [open]);

  if (!open) return null;

  const updateField = (field: keyof ContactFormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(payload.error ?? "Invio non riuscito.");
      }

      setSubmitted(true);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Invio non riuscito.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Chiudi"
        onClick={onClose}
        className="absolute inset-0 bg-[#141415]/40"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-modal-title"
        className="relative z-10 w-full max-w-[440px] rounded-[18px] border border-[#e4e4e4] bg-white p-5 shadow-[0_20px_60px_rgba(0,0,0,0.18)]"
      >
        {submitted ? (
          <div className="py-4 text-center">
            <MailSentIcon />
            <h2
              id="contact-modal-title"
              className="mt-5 text-[1.05rem] font-bold text-[#141415]"
            >
              Richiesta inviata
            </h2>
            <p className="mt-3 text-[0.92rem] leading-relaxed text-[#606060]">
              Verrai ricontattato telefonicamente e via email entro 48h dal
              nostro staff.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-6 rounded-full bg-[#560200] px-5 py-2.5 text-[0.84rem] font-semibold text-white transition-colors hover:bg-[#6d0200]"
            >
              Chiudi
            </button>
          </div>
        ) : (
          <>
            <h2
              id="contact-modal-title"
              className="text-[1.05rem] font-bold text-[#141415]"
            >
              Unisciti a noi
            </h2>
            <p className="mt-2 text-[0.9rem] leading-relaxed text-[#606060]">
              Lasciaci i tuoi dati: ti ricontattiamo per presentarti DigiMenu e
              capire le esigenze del tuo locale.
            </p>

            <form className="mt-5 space-y-3" onSubmit={(event) => void handleSubmit(event)}>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="flex flex-col gap-1.5">
                  <span className="text-[0.78rem] font-semibold text-[#606060]">
                    Nome
                  </span>
                  <input
                    type="text"
                    required
                    value={form.firstName}
                    onChange={(event) =>
                      updateField("firstName", event.target.value)
                    }
                    className="rounded-[10px] border border-[#d8dadc] bg-white px-3 py-2 text-[0.92rem] text-[#141415] outline-none focus:border-[#560200]"
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-[0.78rem] font-semibold text-[#606060]">
                    Cognome
                  </span>
                  <input
                    type="text"
                    required
                    value={form.lastName}
                    onChange={(event) =>
                      updateField("lastName", event.target.value)
                    }
                    className="rounded-[10px] border border-[#d8dadc] bg-white px-3 py-2 text-[0.92rem] text-[#141415] outline-none focus:border-[#560200]"
                  />
                </label>
              </div>

              <label className="flex flex-col gap-1.5">
                <span className="text-[0.78rem] font-semibold text-[#606060]">
                  Nome attività{" "}
                  <span className="font-normal text-[#a3a3a3]">(opzionale)</span>
                </span>
                <input
                  type="text"
                  value={form.businessName}
                  onChange={(event) =>
                    updateField("businessName", event.target.value)
                  }
                  className="rounded-[10px] border border-[#d8dadc] bg-white px-3 py-2 text-[0.92rem] text-[#141415] outline-none focus:border-[#560200]"
                />
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-[0.78rem] font-semibold text-[#606060]">
                  Numero di telefono
                </span>
                <input
                  type="tel"
                  required
                  autoComplete="tel"
                  value={form.phone}
                  onChange={(event) => updateField("phone", event.target.value)}
                  className="rounded-[10px] border border-[#d8dadc] bg-white px-3 py-2 text-[0.92rem] text-[#141415] outline-none focus:border-[#560200]"
                />
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-[0.78rem] font-semibold text-[#606060]">
                  Email
                </span>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={form.email}
                  onChange={(event) => updateField("email", event.target.value)}
                  className="rounded-[10px] border border-[#d8dadc] bg-white px-3 py-2 text-[0.92rem] text-[#141415] outline-none focus:border-[#560200]"
                />
              </label>

              {error ? (
                <p className="rounded-[10px] bg-[#fff1f1] px-3 py-2 text-[0.84rem] text-[#8a1f1f]">
                  {error}
                </p>
              ) : null}

              <div className="flex flex-wrap justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full border border-[#d8dadc] bg-white px-4 py-2 text-[0.84rem] font-semibold text-[#141415] transition-colors hover:bg-[#f5f5f5]"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-full bg-[#560200] px-4 py-2 text-[0.84rem] font-semibold text-white transition-colors hover:bg-[#6d0200] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? "Invio…" : "Invia richiesta"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
