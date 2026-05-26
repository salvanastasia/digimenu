import type { CSSProperties } from "react";
import type { ClientConfig, MenuTheme } from "@/types/client";

export type FramedThemeVariant = "framed" | "framed-big";

export type FramedThemeConfig = {
  checkerboardCellPx: number;
  headerBorderBottomPx: number;
  framePaddingClass: string;
  innerMinHeightClass: string;
  headerPaddingClass: string;
  accordionPaddingClass: string;
  bracketToggleOnRight: boolean;
};

export const FRAMED_THEME_CONFIG: Record<FramedThemeVariant, FramedThemeConfig> =
  {
    framed: {
      checkerboardCellPx: 14,
      headerBorderBottomPx: 2,
      framePaddingClass: "p-2.5",
      innerMinHeightClass: "min-h-[calc(100dvh-20px)]",
      headerPaddingClass:
        "px-4 pb-4 pt-[calc(1rem+env(safe-area-inset-top,0px))]",
      accordionPaddingClass: "px-4 py-3.5",
      bracketToggleOnRight: false,
    },
    "framed-big": {
      checkerboardCellPx: 22,
      headerBorderBottomPx: 2,
      framePaddingClass: "p-5",
      innerMinHeightClass: "min-h-[calc(100dvh-40px)]",
      headerPaddingClass:
        "px-5 pb-5 pt-[calc(1.25rem+env(safe-area-inset-top,0px))]",
      accordionPaddingClass: "px-5 py-4",
      bracketToggleOnRight: true,
    },
  };

export function getMenuTheme(client?: ClientConfig | null): MenuTheme {
  return client?.customizations.menuTheme ?? "classic";
}

export function isFramedMenuTheme(theme: MenuTheme): boolean {
  return theme === "framed" || theme === "framed-big";
}

export function getFramedThemeVariant(
  theme: MenuTheme,
): FramedThemeVariant | null {
  if (theme === "framed" || theme === "framed-big") {
    return theme;
  }
  return null;
}

export function getFramedThemeConfig(
  theme: MenuTheme,
): FramedThemeConfig | null {
  const variant = getFramedThemeVariant(theme);
  return variant ? FRAMED_THEME_CONFIG[variant] : null;
}

export function isMenuZebraRowsEnabled(client?: ClientConfig | null): boolean {
  return client?.customizations.menuZebraRows ?? false;
}

export function getAccordionHeaderBackground({
  expanded,
  zebraEnabled,
  categoryIndex,
  primaryColor,
  secondaryColor,
}: {
  expanded: boolean;
  zebraEnabled: boolean;
  categoryIndex: number;
  primaryColor: string;
  secondaryColor: string;
}): string | undefined {
  if (expanded) {
    return `color-mix(in srgb, ${primaryColor} 5%, transparent)`;
  }

  if (!zebraEnabled) {
    return undefined;
  }

  return categoryIndex % 2 === 0
    ? `color-mix(in srgb, ${primaryColor} 5%, transparent)`
    : `color-mix(in srgb, ${secondaryColor} 12%, transparent)`;
}

export function getCheckerboardFrameStyle(
  primaryColor: string,
  secondaryColor: string,
  cellPx: number,
): CSSProperties {
  const half = cellPx / 2;

  return {
    backgroundColor: secondaryColor,
    backgroundImage: `
      linear-gradient(45deg, ${primaryColor} 25%, transparent 25%),
      linear-gradient(-45deg, ${primaryColor} 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, ${primaryColor} 75%),
      linear-gradient(-45deg, transparent 75%, ${primaryColor} 75%)
    `,
    backgroundSize: `${cellPx}px ${cellPx}px`,
    backgroundPosition: `0 0, 0 ${half}px, ${half}px -${half}px, -${half}px 0`,
  };
}
