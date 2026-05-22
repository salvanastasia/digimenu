import type { ClientConfig, HeaderColorKey } from "@/types/client";

export type EffectiveHeader = {
  logoUrl: string;
  logoColor: string;
  backgroundMode: ClientConfig["header"]["backgroundMode"];
  backgroundImageUrl: string;
  backgroundColor: string;
  fabBackground: string;
  fabIconColor: string;
  languages: ClientConfig["header"]["languages"];
};

export type HeaderBackgroundStyle = {
  backgroundColor: string;
  backgroundImage?: string;
  backgroundSize?: string;
  backgroundPosition?: string;
};

const BRAND_MAP: Record<HeaderColorKey, "primaryColor" | "secondaryColor"> = {
  logoColor: "secondaryColor",
  backgroundColor: "primaryColor",
  fabBackground: "secondaryColor",
  fabIconColor: "primaryColor",
};

export function getEffectiveHeader(client: ClientConfig): EffectiveHeader {
  const { brand, header } = client;

  return {
    logoUrl: header.logoUrl,
    logoColor:
      header.colorOverrides.logoColor ?? brand.secondaryColor,
    backgroundMode: header.backgroundMode ?? "color",
    backgroundImageUrl: header.backgroundImageUrl ?? "",
    backgroundColor:
      header.colorOverrides.backgroundColor ?? brand.primaryColor,
    fabBackground:
      header.colorOverrides.fabBackground ?? brand.secondaryColor,
    fabIconColor:
      header.colorOverrides.fabIconColor ?? brand.primaryColor,
    languages: header.languages,
  };
}

export function getHeaderBackgroundStyle(
  effectiveHeader: EffectiveHeader,
): HeaderBackgroundStyle {
  if (
    effectiveHeader.backgroundMode === "image" &&
    effectiveHeader.backgroundImageUrl
  ) {
    return {
      backgroundColor: effectiveHeader.backgroundColor,
      backgroundImage: `url(${effectiveHeader.backgroundImageUrl})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    };
  }

  return { backgroundColor: effectiveHeader.backgroundColor };
}

export function hasHeaderBackgroundImage(
  effectiveHeader: EffectiveHeader,
): boolean {
  return (
    effectiveHeader.backgroundMode === "image" &&
    Boolean(effectiveHeader.backgroundImageUrl)
  );
}

export function getBrandLabelForHeaderColor(key: HeaderColorKey): string {
  return BRAND_MAP[key] === "primaryColor" ? "Primario" : "Secondario";
}

export function getBrandColorForHeaderKey(
  client: ClientConfig,
  key: HeaderColorKey,
): string {
  return client.brand[BRAND_MAP[key]];
}

export function isHeaderColorOverridden(
  client: ClientConfig,
  key: HeaderColorKey,
): boolean {
  return client.header.colorOverrides[key] !== undefined;
}
