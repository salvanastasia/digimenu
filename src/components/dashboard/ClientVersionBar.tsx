import Link from "next/link";

type ClientVersionBarProps = {
  versionIndex: number;
  versionCount: number;
  versionSavedAt?: string;
  onPrevious: () => void;
  onNext: () => void;
  onRestoreVersion: () => void;
  isDirty: boolean;
  saveStatus: "idle" | "saved";
  saveError: string | null;
  isSaving: boolean;
  onSave: () => void;
  menuSlug: string;
  menuHidden?: boolean;
  translationStaleFields?: number;
};

export function ClientVersionBar({
  versionIndex,
  versionCount,
  versionSavedAt,
  onPrevious,
  onNext,
  onRestoreVersion,
  isDirty,
  saveStatus,
  saveError,
  isSaving,
  onSave,
  menuSlug,
  menuHidden = false,
  translationStaleFields = 0,
}: ClientVersionBarProps) {
  const isViewingHistoricalVersion =
    versionCount > 0 && versionIndex < versionCount - 1;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-[14px] border border-[#e4e4e4] bg-white px-4 py-3">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          disabled={versionIndex <= 0}
          onClick={onPrevious}
          className="rounded-full border border-[#d8dadc] px-3 py-1.5 text-[0.82rem] font-semibold text-[#141415] disabled:opacity-40"
        >
          ← Versione
        </button>
        <span className="text-[0.82rem] text-[#606060]">
          {versionCount > 0
            ? `Versione ${versionIndex + 1} / ${versionCount}`
            : "Nessuna versione"}
          {versionSavedAt
            ? ` · ${new Intl.DateTimeFormat("it-IT", {
                day: "2-digit",
                month: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              }).format(new Date(versionSavedAt))}`
            : null}
        </span>
        <button
          type="button"
          disabled={versionIndex >= versionCount - 1}
          onClick={onNext}
          className="rounded-full border border-[#d8dadc] px-3 py-1.5 text-[0.82rem] font-semibold text-[#141415] disabled:opacity-40"
        >
          Versione →
        </button>
      </div>

      <div className="flex flex-col items-end gap-1 sm:flex-row sm:items-center sm:gap-2">
        {isDirty ? (
          <span className="text-[0.78rem] font-medium text-[#8a1f1f]">
            Modifiche non salvate
          </span>
        ) : saveStatus === "saved" ? (
          <span className="text-[0.78rem] font-medium text-[#1f6b3a]">
            ✅ Modifiche salvate
          </span>
        ) : null}
        {!isDirty && translationStaleFields > 0 ? (
          <span className="text-[0.78rem] font-medium text-amber-800">
            Traduzioni da aggiornare ({translationStaleFields}{" "}
            {translationStaleFields === 1 ? "campo" : "campi"})
          </span>
        ) : null}
        {saveError ? (
          <span className="text-[0.78rem] font-medium text-[#8a1f1f]">
            {saveError}
          </span>
        ) : null}
        {isDirty ? (
          <button
            type="button"
            onClick={onSave}
            disabled={isSaving}
            className="rounded-full bg-[#560200] px-5 py-2 text-[0.84rem] font-semibold text-white transition-colors hover:bg-[#6d0200] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaving ? "Salvataggio..." : "Salva"}
          </button>
        ) : isViewingHistoricalVersion ? (
          <button
            type="button"
            onClick={onRestoreVersion}
            disabled={isSaving}
            className="rounded-full bg-[#560200] px-5 py-2 text-[0.84rem] font-semibold text-white transition-colors hover:bg-[#6d0200] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaving ? "Ripristino..." : "Ripristina versione"}
          </button>
        ) : menuHidden ? (
          <span
            className="rounded-full bg-[#ececec] px-5 py-2 text-[0.84rem] font-semibold text-[#606060]"
            title="Menu disattivato al pubblico"
          >
            Menu nascosto
          </span>
        ) : menuSlug ? (
          <Link
            href={`/${menuSlug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-[#560200] px-5 py-2 text-[0.84rem] font-semibold text-white transition-colors hover:bg-[#6d0200]"
          >
            Apri menu
          </Link>
        ) : null}
      </div>
    </div>
  );
}
