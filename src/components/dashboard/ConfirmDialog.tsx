"use client";

import { useEffect, useState } from "react";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  /** Se impostato, il pulsante conferma resta disabilitato finché il testo non coincide. */
  confirmationPhrase?: string;
  confirmationInputLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Conferma",
  cancelLabel = "Annulla",
  destructive = false,
  confirmationPhrase,
  confirmationInputLabel = "Digita il nome del cliente per confermare",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const [typed, setTyped] = useState("");

  useEffect(() => {
    if (open) {
      setTyped("");
    }
  }, [open, confirmationPhrase]);

  if (!open) return null;

  const confirmDisabled = confirmationPhrase
    ? typed.trim() !== confirmationPhrase
    : false;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label={cancelLabel}
        onClick={onCancel}
        className="absolute inset-0 bg-[#141415]/40"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        className="relative z-10 w-full max-w-[420px] rounded-[18px] border border-[#e4e4e4] bg-white p-5 shadow-[0_20px_60px_rgba(0,0,0,0.18)]"
      >
        <h2
          id="confirm-dialog-title"
          className="text-[1.05rem] font-bold text-[#141415]"
        >
          {title}
        </h2>
        <p className="mt-2 text-[0.9rem] leading-relaxed text-[#606060]">
          {message}
        </p>

        {confirmationPhrase ? (
          <label className="mt-4 flex flex-col gap-1.5">
            <span className="text-[0.78rem] font-semibold text-[#606060]">
              {confirmationInputLabel}
            </span>
            <input
              type="text"
              value={typed}
              onChange={(event) => setTyped(event.target.value)}
              autoComplete="off"
              spellCheck={false}
              className="rounded-[10px] border border-[#d8dadc] bg-white px-3 py-2 text-[0.92rem] text-[#141415] outline-none focus:border-[#560200]"
            />
          </label>
        ) : null}

        <div className="mt-5 flex flex-wrap justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-[#d8dadc] bg-white px-4 py-2 text-[0.84rem] font-semibold text-[#141415] transition-colors hover:bg-[#f5f5f5]"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            disabled={confirmDisabled}
            onClick={onConfirm}
            className={`rounded-full px-4 py-2 text-[0.84rem] font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-45 ${
              destructive
                ? "bg-[#8a1f1f] hover:bg-[#6d1818]"
                : "bg-[#560200] hover:bg-[#6d0200]"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
