"use client";

import { useEffect, useState } from "react";
import { usesOriginalLogoColors } from "@/lib/client-header";
import type { ClientConfig } from "@/types/client";

const DEFAULT_LOGO_ASPECT = 1842 / 354;

type ClientLogoProps = {
  client?: ClientConfig | null;
  logoUrl: string;
  logoColor: string;
  alt: string;
  className?: string;
};

function tintSvgMarkup(svg: string, color: string): string {
  return svg
    .replace(/\bfill="(?!none)[^"]*"/gi, `fill="${color}"`)
    .replace(/\bfill='(?!none)[^']*'/gi, `fill='${color}'`);
}

function MaskedLogo({
  logoUrl,
  logoColor,
  alt,
  className,
}: {
  logoUrl: string;
  logoColor: string;
  alt: string;
  className: string;
}) {
  const mask = `url(${JSON.stringify(logoUrl)}) center / contain no-repeat`;

  return (
    <span
      role="img"
      aria-label={alt}
      className={className}
      style={{
        aspectRatio: DEFAULT_LOGO_ASPECT,
        backgroundColor: logoColor,
        maskImage: mask,
        WebkitMaskImage: mask,
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        maskSize: "contain",
        WebkitMaskSize: "contain",
        maskPosition: "center",
        WebkitMaskPosition: "center",
      }}
    />
  );
}

export function ClientLogo({
  client,
  logoUrl,
  logoColor,
  alt,
  className = "",
}: ClientLogoProps) {
  const useOriginalColors = client
    ? usesOriginalLogoColors(client)
    : false;

  const sizeClass =
    "block h-9 max-h-9 w-auto max-w-[min(100%,190px)] min-w-[96px] object-contain object-left";
  const mergedClass = `${sizeClass} ${className}`.trim();

  const [tintedSvg, setTintedSvg] = useState<string | null>(null);
  const [useMaskFallback, setUseMaskFallback] = useState(false);

  useEffect(() => {
    if (useOriginalColors || !logoUrl) {
      setTintedSvg(null);
      setUseMaskFallback(false);
      return;
    }

    let cancelled = false;
    setTintedSvg(null);
    setUseMaskFallback(false);

    void fetch(logoUrl)
      .then((response) => {
        if (!response.ok) throw new Error("fetch failed");
        return response.text();
      })
      .then((markup) => {
        if (cancelled) return;
        if (!markup.includes("<svg")) {
          setUseMaskFallback(true);
          return;
        }
        setTintedSvg(tintSvgMarkup(markup, logoColor));
      })
      .catch(() => {
        if (!cancelled) setUseMaskFallback(true);
      });

    return () => {
      cancelled = true;
    };
  }, [logoColor, logoUrl, useOriginalColors]);

  if (useOriginalColors) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={logoUrl} alt={alt} className={mergedClass} />
    );
  }

  if (tintedSvg && !useMaskFallback) {
    return (
      <span
        role="img"
        aria-label={alt}
        className={`inline-flex h-9 max-w-[min(100%,190px)] [&_svg]:block [&_svg]:h-full [&_svg]:w-auto ${className}`.trim()}
        style={{ aspectRatio: DEFAULT_LOGO_ASPECT }}
        dangerouslySetInnerHTML={{ __html: tintedSvg }}
      />
    );
  }

  return (
    <MaskedLogo
      logoUrl={logoUrl}
      logoColor={logoColor}
      alt={alt}
      className={mergedClass}
    />
  );
}
