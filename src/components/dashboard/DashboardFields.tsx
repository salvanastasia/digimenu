import type { ReactNode } from "react";

type ColorFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

export function ColorField({ label, value, onChange }: ColorFieldProps) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[0.78rem] font-semibold text-[#606060]">{label}</span>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-10 w-12 cursor-pointer rounded-[10px] border border-[#d8dadc] bg-white p-1"
        />
        <input
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="min-w-0 flex-1 rounded-[10px] border border-[#d8dadc] bg-white px-3 py-2 text-[0.88rem] uppercase tracking-wide text-[#141415] outline-none focus:border-[#560200]"
        />
      </div>
    </label>
  );
}

type TextFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  hint?: string;
};

export function TextField({
  label,
  value,
  onChange,
  placeholder,
  maxLength,
  hint,
}: TextFieldProps) {
  return (
    <label className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-[0.78rem] font-semibold text-[#606060]">{label}</span>
        {maxLength ? (
          <span className="text-[0.72rem] tabular-nums text-[#606060]">
            {value.length}/{maxLength}
          </span>
        ) : null}
      </div>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        maxLength={maxLength}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-[10px] border border-[#d8dadc] bg-white px-3 py-2 text-[0.92rem] text-[#141415] outline-none focus:border-[#560200]"
      />
      {hint ? (
        <span className="text-[0.72rem] leading-snug text-[#606060]">{hint}</span>
      ) : null}
    </label>
  );
}

type SelectFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly { value: string; label: string }[];
};

export function SelectField({
  label,
  value,
  onChange,
  options,
}: SelectFieldProps) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[0.78rem] font-semibold text-[#606060]">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-[10px] border border-[#d8dadc] bg-white px-3 py-2 text-[0.92rem] text-[#141415] outline-none focus:border-[#560200]"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[18px] border border-[#e4e4e4] bg-white p-5">
      <h2 className="mb-4 text-[1rem] font-bold text-[#141415]">{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

export { Section };
