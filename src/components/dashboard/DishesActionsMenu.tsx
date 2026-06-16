"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { AiSparklesIcon } from "@/components/dashboard/AiSparklesIcon";

type DishesActionsMenuProps = {
  disabled?: boolean;
  hasDishes: boolean;
  isImporting: boolean;
  importError: string | null;
  onExportCsv: () => void;
  onExportJson: () => void;
  onImportCsvFile: (file: File) => void;
  onImportGemini: (menuText: string) => Promise<void>;
  onImportGeminiFile: (file: File) => Promise<void>;
  onDeleteAll: () => void;
};

type GeminiInputMode =
  | { kind: "text" }
  | { kind: "file"; file: File; fileText: string | null };

const ACCEPTED_TYPES = [
  "application/pdf",
  "text/csv",
  "text/plain",
  ".csv",
  ".pdf",
  ".txt",
];

function isAcceptedFile(file: File): "pdf" | "csv" | null {
  if (
    file.type === "application/pdf" ||
    file.name.toLowerCase().endsWith(".pdf")
  ) {
    return "pdf";
  }
  if (
    file.type === "text/csv" ||
    file.type === "text/plain" ||
    file.name.toLowerCase().endsWith(".csv") ||
    file.name.toLowerCase().endsWith(".txt")
  ) {
    return "csv";
  }
  return null;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function DishesActionsMenu({
  disabled = false,
  hasDishes,
  isImporting,
  importError,
  onExportCsv,
  onExportJson,
  onImportCsvFile,
  onImportGemini,
  onImportGeminiFile,
  onDeleteAll,
}: DishesActionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [geminiOpen, setGeminiOpen] = useState(false);
  const [menuText, setMenuText] = useState("");
  const [inputMode, setInputMode] = useState<GeminiInputMode>({ kind: "text" });
  const [isDragging, setIsDragging] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const csvInputRef = useRef<HTMLInputElement>(null);
  const geminiFileRef = useRef<HTMLInputElement>(null);
  const textareaId = useId();
  const dropZoneId = useId();

  useEffect(() => {
    if (!isOpen) return;
    const handlePointerDown = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [isOpen]);

  const closeMenu = () => setIsOpen(false);

  const closeGeminiModal = () => {
    if (isImporting) return;
    setGeminiOpen(false);
    setMenuText("");
    setInputMode({ kind: "text" });
  };

  const handleCsvMenuChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    closeMenu();
    onImportCsvFile(file);
  };

  const processDroppedFile = useCallback(
    async (file: File) => {
      const kind = isAcceptedFile(file);
      if (!kind) return;

      if (kind === "csv") {
        const text = await file.text();
        setMenuText(text);
        setInputMode({ kind: "text" });
      } else {
        setInputMode({ kind: "file", file, fileText: null });
        setMenuText("");
      }
    },
    [],
  );

  const handleGeminiFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    void processDroppedFile(file);
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node)) {
      setIsDragging(false);
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (!file) return;
    void processDroppedFile(file);
  };

  const handleGeminiSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (inputMode.kind === "file") {
      void onImportGeminiFile(inputMode.file)
        .then(() => {
          setGeminiOpen(false);
          setInputMode({ kind: "text" });
        })
        .catch(() => undefined);
      return;
    }

    const text = menuText.trim();
    if (!text) return;

    void onImportGemini(text)
      .then(() => {
        setGeminiOpen(false);
        setMenuText("");
      })
      .catch(() => undefined);
  };

  const canSubmit =
    inputMode.kind === "file"
      ? !isImporting
      : !isImporting && Boolean(menuText.trim());

  return (
    <>
      <div ref={menuRef} className="relative">
        <button
          type="button"
          disabled={disabled || isImporting}
          aria-label="Azioni piatti"
          aria-expanded={isOpen}
          aria-haspopup="menu"
          onClick={() => setIsOpen((current) => !current)}
          className="inline-flex items-center gap-2 rounded-full border border-[#d8dadc] bg-white px-4 py-2 text-[0.82rem] font-semibold text-[#141415] transition-colors hover:bg-[#f5f5f5] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Altro
          <VerticalDotsIcon />
        </button>

        {isOpen ? (
          <div
            role="menu"
            className="absolute right-0 top-[calc(100%+6px)] z-30 min-w-[14rem] overflow-hidden rounded-[12px] border border-[#e4e4e4] bg-white py-1 shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
          >
            <MenuItem disabled={!hasDishes} onClick={() => { closeMenu(); onExportCsv(); }}>
              Esporta CSV
            </MenuItem>
            <MenuItem disabled={!hasDishes} onClick={() => { closeMenu(); onExportJson(); }}>
              Esporta JSON
            </MenuItem>
            <MenuDivider />
            <MenuItem onClick={() => { closeMenu(); csvInputRef.current?.click(); }}>
              Importa CSV
            </MenuItem>
            <MenuItem
              onClick={() => {
                closeMenu();
                setInputMode({ kind: "text" });
                setMenuText("");
                setGeminiOpen(true);
              }}
            >
              <span className="inline-flex items-center gap-2">
                <AiSparklesIcon className="h-4 w-4 text-[#5b6cff]" />
                Importa con Gemini
              </span>
            </MenuItem>
            {hasDishes ? (
              <>
                <MenuDivider />
                <MenuItem destructive onClick={() => { closeMenu(); onDeleteAll(); }}>
                  Elimina tutti i piatti
                </MenuItem>
              </>
            ) : null}
          </div>
        ) : null}

        <input
          ref={csvInputRef}
          type="file"
          accept=".csv,text/csv"
          className="hidden"
          onChange={handleCsvMenuChange}
        />
        <input
          ref={geminiFileRef}
          type="file"
          accept={ACCEPTED_TYPES.join(",")}
          className="hidden"
          onChange={handleGeminiFileChange}
        />
      </div>

      {geminiOpen ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Chiudi"
            onClick={closeGeminiModal}
            className="absolute inset-0 bg-[#141415]/40"
          />
          <form
            onSubmit={handleGeminiSubmit}
            className="relative z-10 w-full max-w-lg rounded-[18px] border border-[#e4e4e4] bg-white p-6 shadow-[0_16px_48px_rgba(0,0,0,0.18)]"
          >
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[#5b6cff]">
              Importa con Gemini
            </p>
            <h2 className="mt-2 text-[1.2rem] font-bold text-[#141415]">
              Incolla il menu o carica un file
            </h2>
            <p className="mt-1.5 text-[0.84rem] leading-relaxed text-[#606060]">
              L&apos;AI estrae categorie e piatti e li aggiunge al menu esistente.
            </p>

            {/* Drop zone */}
            <div
              id={dropZoneId}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => !isImporting && geminiFileRef.current?.click()}
              className={`mt-4 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-[12px] border-2 border-dashed px-4 py-5 text-center transition-colors ${
                isDragging
                  ? "border-[#5b6cff] bg-[#eef0ff]"
                  : "border-[#d8dadc] hover:border-[#5b6cff]/60 hover:bg-[#f8f8ff]"
              } ${isImporting ? "pointer-events-none opacity-60" : ""}`}
            >
              {inputMode.kind === "file" ? (
                <div className="flex w-full items-center gap-3">
                  <FileIcon mimeType={inputMode.file.type} />
                  <div className="min-w-0 flex-1 text-left">
                    <p className="truncate text-[0.88rem] font-semibold text-[#141415]">
                      {inputMode.file.name}
                    </p>
                    <p className="text-[0.75rem] text-[#606060]">
                      {formatBytes(inputMode.file.size)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setInputMode({ kind: "text" });
                    }}
                    className="shrink-0 rounded-full p-1 text-[#606060] hover:bg-[#f0f0f0] hover:text-[#141415]"
                    aria-label="Rimuovi file"
                  >
                    <XIcon />
                  </button>
                </div>
              ) : (
                <>
                  <UploadCloudIcon />
                  <p className="text-[0.84rem] font-semibold text-[#141415]">
                    Trascina un file PDF o CSV
                  </p>
                  <p className="text-[0.78rem] text-[#606060]">
                    oppure{" "}
                    <span className="font-semibold text-[#5b6cff]">
                      seleziona dal computer
                    </span>
                    {" "}· PDF, CSV, TXT
                  </p>
                </>
              )}
            </div>

            {/* Text input (only in text mode) */}
            {inputMode.kind === "text" ? (
              <div className="mt-3 flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor={textareaId}
                    className="text-[0.78rem] font-semibold text-[#606060]"
                  >
                    Oppure incolla il testo
                  </label>
                  {menuText ? (
                    <button
                      type="button"
                      onClick={() => setMenuText("")}
                      className="text-[0.72rem] text-[#909090] hover:text-[#8a1f1f]"
                    >
                      Svuota
                    </button>
                  ) : null}
                </div>
                <textarea
                  id={textareaId}
                  value={menuText}
                  onChange={(event) => setMenuText(event.target.value)}
                  rows={7}
                  disabled={isImporting}
                  placeholder={"Antipasti\nBruschetta — pomodoro, basilico — €8\n..."}
                  className="resize-y rounded-[10px] border border-[#d8dadc] px-3 py-2.5 text-[0.9rem] text-[#141415] outline-none transition-colors focus:border-[#5b6cff] disabled:opacity-60"
                />
              </div>
            ) : null}

            {importError ? (
              <p className="mt-3 text-[0.82rem] font-medium text-[#8a1f1f]">
                {importError}
              </p>
            ) : null}

            <div className="mt-5 flex flex-wrap justify-end gap-2">
              <button
                type="button"
                disabled={isImporting}
                onClick={closeGeminiModal}
                className="rounded-full border border-[#d8dadc] px-4 py-2 text-[0.84rem] font-semibold text-[#141415] disabled:opacity-50"
              >
                Annulla
              </button>
              <button
                type="submit"
                disabled={!canSubmit}
                className="inline-flex items-center gap-2 rounded-full bg-[#560200] px-4 py-2 text-[0.84rem] font-semibold text-white transition-colors hover:bg-[#6d0200] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isImporting ? (
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                ) : (
                  <AiSparklesIcon className="h-4 w-4" />
                )}
                Importa
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </>
  );
}

function MenuItem({
  children,
  onClick,
  disabled = false,
  destructive = false,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  destructive?: boolean;
}) {
  return (
    <button
      type="button"
      role="menuitem"
      disabled={disabled}
      onClick={onClick}
      className={`w-full px-3.5 py-2.5 text-left text-[0.82rem] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
        destructive
          ? "text-[#8a1f1f] hover:bg-[#fff1f1]"
          : "text-[#141415] hover:bg-[#f5f5f5]"
      }`}
    >
      {children}
    </button>
  );
}

function MenuDivider() {
  return <div className="my-1 border-t border-[#ececec]" />;
}

function VerticalDotsIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[1.125rem] w-[1.125rem]" fill="currentColor">
      <circle cx="12" cy="5" r="1.35" />
      <circle cx="12" cy="12" r="1.35" />
      <circle cx="12" cy="19" r="1.35" />
    </svg>
  );
}

function UploadCloudIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-8 w-8 text-[#909090]" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 16 12 12 8 16" />
      <line x1="12" y1="12" x2="12" y2="21" />
      <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function FileIcon({ mimeType }: { mimeType: string }) {
  const isPdf = mimeType === "application/pdf";
  return (
    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] text-[0.6rem] font-bold uppercase tracking-wide ${isPdf ? "bg-[#fff1f1] text-[#8a1f1f]" : "bg-[#eef0ff] text-[#5b6cff]"}`}>
      {isPdf ? "PDF" : "CSV"}
    </div>
  );
}
