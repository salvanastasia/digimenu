"use client";

import { useCallback, useState } from "react";

const SLIDES = [
  {
    src: "/landing-menu-photo.jpg",
    alt: "Cliente consulta il menu digitale DigiMenu al ristorante",
  },
  {
    src: "/landing-qr-scan.jpg",
    alt: "Cliente scansiona il QR code del menu digitale al tavolo",
  },
] as const;

function ChevronIcon({ direction }: { direction: "prev" | "next" }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className="block"
    >
      <path
        d={direction === "prev" ? "M12 4L6 10l6 6" : "M8 4l6 6-6 6"}
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function LandingPhotoCarousel() {
  const [index, setIndex] = useState(0);
  const lastIndex = SLIDES.length - 1;
  const canGoPrev = index > 0;
  const canGoNext = index < lastIndex;

  const goTo = useCallback((next: number) => {
    setIndex(next);
  }, []);

  const goPrev = useCallback(() => {
    setIndex((current) => Math.max(0, current - 1));
  }, []);

  const goNext = useCallback(() => {
    setIndex((current) => Math.min(lastIndex, current + 1));
  }, [lastIndex]);

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="group relative aspect-square w-full overflow-hidden rounded-[18px] border border-[#e4e4e4] bg-[#fafafa] shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
        {SLIDES.map((slide, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={slide.src}
            src={slide.src}
            alt={slide.alt}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ease-out ${
              i === index ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
            aria-hidden={i !== index}
          />
        ))}

        <button
          type="button"
          onClick={goPrev}
          disabled={!canGoPrev}
          aria-label="Foto precedente"
          className={`absolute top-1/2 left-3 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/50 bg-white/92 text-[#141415] shadow-[0_4px_16px_rgba(0,0,0,0.12)] transition-[opacity,background-color,transform] duration-200 ease-out md:flex ${
            canGoPrev
              ? "cursor-pointer opacity-0 group-hover:opacity-100 hover:scale-[1.03] hover:bg-white active:scale-[0.97]"
              : "pointer-events-none opacity-0"
          }`}
        >
          <ChevronIcon direction="prev" />
        </button>

        <button
          type="button"
          onClick={goNext}
          disabled={!canGoNext}
          aria-label="Foto successiva"
          className={`absolute top-1/2 right-3 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/50 bg-white/92 text-[#141415] shadow-[0_4px_16px_rgba(0,0,0,0.12)] transition-[opacity,background-color,transform] duration-200 ease-out md:flex ${
            canGoNext
              ? "cursor-pointer opacity-0 group-hover:opacity-100 hover:scale-[1.03] hover:bg-white active:scale-[0.97]"
              : "pointer-events-none opacity-0"
          }`}
        >
          <ChevronIcon direction="next" />
        </button>
      </div>

      <div
        className="flex justify-center gap-1"
        role="tablist"
        aria-label="Galleria foto"
      >
        {SLIDES.map((slide, i) => (
          <button
            key={slide.src}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={`Foto ${i + 1} di ${SLIDES.length}`}
            onClick={() => goTo(i)}
            className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-[#f0f0f0]"
          >
            <span
              className={`block rounded-full transition-[width,background-color] duration-200 ease-out ${
                i === index
                  ? "h-2 w-5 bg-[#560200]"
                  : "h-2 w-2 bg-[#d8dadc]"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
