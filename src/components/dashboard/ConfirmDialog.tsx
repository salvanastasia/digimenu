"use client";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
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
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;

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
            onClick={onConfirm}
            className={`rounded-full px-4 py-2 text-[0.84rem] font-semibold text-white transition-colors ${
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
