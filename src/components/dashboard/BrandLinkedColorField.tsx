"use client";

import { useState } from "react";

type BrandLinkedColorFieldProps = {
  label: string;
  brandLabel: string;
  value: string;
  isCustom: boolean;
  onApplyCustom: (value: string) => void;
  onReset: () => void;
};

export function BrandLinkedColorField({
  label,
  brandLabel,
  value,
  isCustom,
  onApplyCustom,
  onReset,
}: BrandLinkedColorFieldProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  const openEditor = () => {
    setDraft(value);
    setEditing(true);
  };

  const apply = () => {
    onApplyCustom(draft);
    setEditing(false);
  };

  const reset = () => {
    onReset();
    setEditing(false);
  };

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[0.78rem] font-semibold text-[#606060]">{label}</span>
      <div className="flex flex-wrap items-center gap-2 rounded-[10px] border border-[#d8dadc] bg-white px-3 py-2">
        <span
          className="h-8 w-8 shrink-0 rounded-[8px] border border-black/10"
          style={{ backgroundColor: value }}
          aria-hidden="true"
        />
        <input
          type="text"
          readOnly={!editing}
          value={editing ? draft : value}
          onChange={(event) => setDraft(event.target.value.toUpperCase())}
          className="min-w-[88px] flex-1 bg-transparent text-[0.84rem] uppercase tracking-wide text-[#141415] outline-none"
        />
        <span className="rounded-full bg-[#f5f5f5] px-2 py-0.5 text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-[#606060]">
          {isCustom ? "Custom" : brandLabel}
        </span>
        {!editing ? (
          <button
            type="button"
            onClick={openEditor}
            className="ml-auto rounded-full border border-[#d8dadc] px-3 py-1 text-[0.76rem] font-semibold text-[#141415] transition-colors hover:bg-[#f5f5f5]"
          >
            Cambia
          </button>
        ) : (
          <>
            <input
              type="color"
              value={draft}
              onChange={(event) => setDraft(event.target.value.toUpperCase())}
              className="h-8 w-10 cursor-pointer rounded-[8px] border border-[#d8dadc] bg-white p-0.5"
            />
            <button
              type="button"
              onClick={apply}
              className="rounded-full bg-[#560200] px-3 py-1 text-[0.76rem] font-semibold text-white"
            >
              Applica
            </button>
            <button
              type="button"
              onClick={reset}
              className="rounded-full border border-[#d8dadc] px-3 py-1 text-[0.76rem] font-semibold text-[#141415]"
            >
              Ripristina
            </button>
          </>
        )}
      </div>
    </div>
  );
}

type LogoUploadFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

const ACCEPTED_LOGO_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/svg+xml",
  "video/webm",
];

export function LogoUploadField({
  label,
  value,
  onChange,
}: LogoUploadFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[0.78rem] font-semibold text-[#606060]">{label}</span>

      {value ? (
        <div className="flex items-center gap-3 rounded-[10px] border border-[#d8dadc] bg-[#fafafa] p-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Anteprima logo"
            className="h-10 max-w-[160px] object-contain"
          />
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-[0.78rem] font-semibold text-[#8a1f1f] hover:underline"
          >
            Rimuovi
          </button>
        </div>
      ) : null}

      <label className="flex cursor-pointer flex-col gap-1 rounded-[10px] border border-dashed border-[#d8dadc] bg-white px-4 py-4 text-center transition-colors hover:border-[#560200]/40 hover:bg-[#560200]/[0.03]">
        <span className="text-[0.84rem] font-semibold text-[#141415]">
          Carica logo
        </span>
        <span className="text-[0.74rem] text-[#606060]">
          PNG, JPG, WEBP, SVG o WEBM
        </span>
        <input
          type="file"
          accept={ACCEPTED_LOGO_TYPES.join(",")}
          className="sr-only"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = () => {
              if (typeof reader.result === "string") {
                onChange(reader.result);
              }
            };
            reader.readAsDataURL(file);
            event.target.value = "";
          }}
        />
      </label>

      <TextFieldInline
        label="Oppure URL / path"
        value={value.startsWith("data:") ? "" : value}
        onChange={onChange}
        placeholder="/logo.svg"
      />
    </div>
  );
}

function TextFieldInline({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[0.72rem] font-semibold text-[#606060]">{label}</span>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-[10px] border border-[#d8dadc] bg-white px-3 py-2 text-[0.88rem] text-[#141415] outline-none focus:border-[#560200]"
      />
    </label>
  );
}
