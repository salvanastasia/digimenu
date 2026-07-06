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
  /**
   * Forza la tinta del logo con `logoColor` ignorando la preferenza del client
   * sui colori originali. Utile per la vista scontrino dove l'utente sceglie
   * esplicitamente primario/secondario. I loghi non-SVG restano invariati.
   */
  forceTint?: boolean;
  /** Chiamato quando il logo non può essere mostrato (URL assente o errore di caricamento). */
  onUnavailable?: () => void;
};

function tintSvgMarkup(svg: string, color: string): string {
  return svg
    .replace(/\bfill="(?!none)[^"]*"/gi, `fill="${color}"`)
    .replace(/\bfill='(?!none)[^']*'/gi, `fill='${color}'`)
    .replace(/\bstroke="(?!none)[^"]*"/gi, `stroke="${color}"`)
    .replace(/\bstroke='(?!none)[^']*'/gi, `stroke='${color}'`);
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
  forceTint = false,
  onUnavailable,
}: ClientLogoProps) {
  const hasLogo = Boolean(logoUrl?.trim()) && !logoUrl.trim().startsWith("blob:");

  const useOriginalColors = forceTint
    ? false
    : client
      ? usesOriginalLogoColors(client)
      : false;

  const sizeClass = forceTint
    ? "block h-9 max-h-9 w-auto max-w-[min(100%,190px)] object-contain object-center"
    : "block h-9 max-h-9 w-auto max-w-[min(100%,190px)] min-w-[96px] object-contain object-left";
  const mergedClass = `${sizeClass} ${className}`.trim();

  const [tintedSvg, setTintedSvg] = useState<string | null>(null);
  const [useMaskFallback, setUseMaskFallback] = useState(false);
  const [isRaster, setIsRaster] = useState(false);

  useEffect(() => {
    if (useOriginalColors || !logoUrl) {
      setTintedSvg(null);
      setUseMaskFallback(false);
      setIsRaster(false);
      return;
    }

    let cancelled = false;
    setTintedSvg(null);
    setUseMaskFallback(false);
    setIsRaster(false);

    void fetch(logoUrl)
      .then((response) => {
        if (!response.ok) throw new Error("fetch failed");
        return response.text();
      })
      .then((markup) => {
        if (cancelled) return;
        if (!markup.includes("<svg")) {
          // Non è un SVG: in forceTint lasciamo il logo originale,
          // altrimenti usiamo la maschera colorata.
          if (forceTint) setIsRaster(true);
          else setUseMaskFallback(true);
          return;
        }
        setTintedSvg(tintSvgMarkup(markup, logoColor));
      })
      .catch(() => {
        if (cancelled) return;
        // Fetch fallito (es. CORS): in forceTint manteniamo l'originale.
        if (forceTint) setIsRaster(true);
        else setUseMaskFallback(true);
      });

    return () => {
      cancelled = true;
    };
  }, [logoColor, logoUrl, useOriginalColors, forceTint]);

  if (!hasLogo) return null;

  const handleImageError = () => {
    onUnavailable?.();
  };

  if (useOriginalColors || isRaster) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={logoUrl}
        alt={alt}
        className={mergedClass}
        onError={handleImageError}
      />
    );
  }

  if (tintedSvg && !useMaskFallback) {
    const spanHeight = forceTint ? "" : "h-9 max-h-9";
    return (
      <span
        role="img"
        aria-label={alt}
        className={`inline-flex ${spanHeight} max-w-[min(100%,190px)] min-w-0 items-center justify-center [&_svg]:block [&_svg]:h-full [&_svg]:max-h-full [&_svg]:w-auto ${className}`.trim()}
        dangerouslySetInnerHTML={{ __html: tintedSvg }}
      />
    );
  }

  if (useMaskFallback) {
    return (
      <MaskedLogo
        logoUrl={logoUrl}
        logoColor={logoColor}
        alt={alt}
        className={mergedClass}
      />
    );
  }

  // In attesa del fetch in forceTint: mostriamo l'originale per evitare flash.
  if (forceTint) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={logoUrl}
        alt={alt}
        className={mergedClass}
        onError={handleImageError}
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
