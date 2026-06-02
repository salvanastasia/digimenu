"use client";

import { useEffect, useId, useRef, useState } from "react";
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
  onDeleteAll: () => void;
};

export function DishesActionsMenu({
  disabled = false,
  hasDishes,
  isImporting,
  importError,
  onExportCsv,
  onExportJson,
  onImportCsvFile,
  onImportGemini,
  onDeleteAll,
}: DishesActionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [geminiOpen, setGeminiOpen] = useState(false);
  const [menuText, setMenuText] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);
  const csvInputRef = useRef<HTMLInputElement>(null);
  const textareaId = useId();

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

  const handleCsvChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    closeMenu();
    onImportCsvFile(file);
  };

  const handleGeminiSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = menuText.trim();
    if (!text) return;

    void onImportGemini(text)
      .then(() => {
        setGeminiOpen(false);
        setMenuText("");
      })
      .catch(() => undefined);
  };

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
            className="absolute left-0 top-[calc(100%+6px)] z-30 min-w-[14rem] overflow-hidden rounded-[12px] border border-[#e4e4e4] bg-white py-1 shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
          >
            <MenuItem
              disabled={!hasDishes}
              onClick={() => {
                closeMenu();
                onExportCsv();
              }}
            >
              Esporta CSV
            </MenuItem>
            <MenuItem
              disabled={!hasDishes}
              onClick={() => {
                closeMenu();
                onExportJson();
              }}
            >
              Esporta JSON
            </MenuItem>
            <MenuDivider />
            <MenuItem
              onClick={() => {
                closeMenu();
                csvInputRef.current?.click();
              }}
            >
              Importa CSV
            </MenuItem>
            <MenuItem
              onClick={() => {
                closeMenu();
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
                <MenuItem
                  destructive
                  onClick={() => {
                    closeMenu();
                    onDeleteAll();
                  }}
                >
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
          onChange={handleCsvChange}
        />
      </div>

      {geminiOpen ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Chiudi"
            onClick={() => {
              if (isImporting) return;
              setGeminiOpen(false);
              setMenuText("");
            }}
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
              Incolla il menu
            </h2>
            <p className="mt-2 text-[0.88rem] leading-relaxed text-[#606060]">
              Incolla testo da PDF, sito o documento. L&apos;AI estrae categorie e
              piatti e li aggiunge al menu esistente (non sostituisce quelli già
              presenti).
            </p>
            <label htmlFor={textareaId} className="mt-4 flex flex-col gap-1.5">
              <span className="text-[0.78rem] font-semibold text-[#606060]">
                Testo menu
              </span>
              <textarea
                id={textareaId}
                value={menuText}
                onChange={(event) => setMenuText(event.target.value)}
                rows={10}
                disabled={isImporting}
                placeholder={"Antipasti\nBruschetta — pomodoro, basilico — €8\n..."}
                className="resize-y rounded-[10px] border border-[#d8dadc] px-3 py-2.5 text-[0.9rem] text-[#141415] outline-none transition-colors focus:border-[#560200] disabled:opacity-60"
              />
            </label>
            {importError ? (
              <p className="mt-3 text-[0.82rem] font-medium text-[#8a1f1f]">
                {importError}
              </p>
            ) : null}
            <div className="mt-5 flex flex-wrap justify-end gap-2">
              <button
                type="button"
                disabled={isImporting}
                onClick={() => {
                  setGeminiOpen(false);
                  setMenuText("");
                }}
                className="rounded-full border border-[#d8dadc] px-4 py-2 text-[0.84rem] font-semibold text-[#141415] disabled:opacity-50"
              >
                Annulla
              </button>
              <button
                type="submit"
                disabled={isImporting || !menuText.trim()}
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
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-[1.125rem] w-[1.125rem]"
      fill="currentColor"
    >
      <circle cx="12" cy="5" r="1.35" />
      <circle cx="12" cy="12" r="1.35" />
      <circle cx="12" cy="19" r="1.35" />
    </svg>
  );
}
