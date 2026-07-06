"use client";

import { useState } from "react";
import { ClientLogo } from "@/components/ClientLogo";
import { isPlaceholderLogoUrl } from "@/lib/instant-file-storage";
import type { ClientConfig } from "@/types/client";

type ClientBrandMarkProps = {
  client?: ClientConfig | null;
  logoUrl: string;
  logoColor: string;
  name: string;
  isFramed?: boolean;
  primaryColor?: string;
  className?: string;
  textClassName?: string;
  forceTint?: boolean;
};

export function ClientBrandMark({
  client,
  logoUrl,
  logoColor,
  name,
  isFramed = false,
  primaryColor,
  className = "",
  textClassName = "",
  forceTint = false,
}: ClientBrandMarkProps) {
  const [logoUnavailable, setLogoUnavailable] = useState(false);
  const showImageLogo =
    !isPlaceholderLogoUrl(logoUrl) && !logoUnavailable && Boolean(name.trim());

  if (!showImageLogo) {
    if (!name.trim()) return null;

    return (
      <p
        className={`truncate font-bold leading-tight ${
          isFramed ? "text-lg sm:text-xl" : "text-2xl"
        } ${textClassName}`.trim()}
        style={isFramed ? { color: primaryColor } : undefined}
      >
        {name}
      </p>
    );
  }

  return (
    <ClientLogo
      client={client}
      logoUrl={logoUrl}
      logoColor={logoColor}
      alt={name}
      className={className}
      forceTint={forceTint}
      onUnavailable={() => setLogoUnavailable(true)}
    />
  );
}
