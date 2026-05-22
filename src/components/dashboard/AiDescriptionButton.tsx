"use client";

import { AiSparklesIcon } from "@/components/dashboard/AiSparklesIcon";

type AiDescriptionButtonProps = {
  label: string;
  disabled?: boolean;
  loading?: boolean;
  onClick: () => void;
};

export function AiDescriptionButton({
  label,
  disabled = false,
  loading = false,
  onClick,
}: AiDescriptionButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled || loading}
      onClick={onClick}
      className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#d8dadc] bg-white text-[#5b6cff] transition-colors hover:border-[#5b6cff]/40 hover:bg-[#eef0ff] disabled:cursor-not-allowed disabled:opacity-45"
    >
      {loading ? (
        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#5b6cff]/25 border-t-[#5b6cff]" />
      ) : (
        <AiSparklesIcon className="h-4 w-4" />
      )}
    </button>
  );
}
