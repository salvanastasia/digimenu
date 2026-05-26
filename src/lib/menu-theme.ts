import type { CSSProperties } from "react";
import type { ClientConfig, MenuTheme } from "@/types/client";

export function getMenuTheme(client?: ClientConfig | null): MenuTheme {
  return client?.customizations.menuTheme ?? "classic";
}

export function isFramedMenuTheme(theme: MenuTheme): boolean {
  return theme === "framed";
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
): CSSProperties {
  return {
    backgroundColor: secondaryColor,
    backgroundImage: `
      linear-gradient(45deg, ${primaryColor} 25%, transparent 25%),
      linear-gradient(-45deg, ${primaryColor} 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, ${primaryColor} 75%),
      linear-gradient(-45deg, transparent 75%, ${primaryColor} 75%)
    `,
    backgroundSize: "14px 14px",
    backgroundPosition: "0 0, 0 7px, 7px -7px, -7px 0",
  };
}
