type QuantitySelectorProps = {
  value: number;
  onChange: (value: number) => void;
  decreaseLabel: string;
  increaseLabel: string;
};

export function QuantitySelector({
  value,
  onChange,
  decreaseLabel,
  increaseLabel,
}: QuantitySelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        aria-label={decreaseLabel}
        onClick={() => onChange(value - 1)}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-[#d8dadc] bg-white text-[1.1rem] leading-none text-[#141415] transition-colors hover:bg-[#f5f5f5]"
      >
        −
      </button>
      <span className="min-w-[1.25rem] text-center text-[0.95rem] font-semibold text-[#141415]">
        {value}
      </span>
      <button
        type="button"
        aria-label={increaseLabel}
        onClick={() => onChange(value + 1)}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-[#d8dadc] bg-white text-[1.1rem] leading-none text-[#141415] transition-colors hover:bg-[#f5f5f5]"
      >
        +
      </button>
    </div>
  );
}
