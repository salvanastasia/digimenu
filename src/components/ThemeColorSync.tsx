"use client";

import { useEffect } from "react";

function setMetaContent(name: string, content: string) {
  let meta = document.querySelector(`meta[name="${name}"]`);
  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute("name", name);
    document.head.appendChild(meta);
  }
  meta.setAttribute("content", content);
}

type ThemeColorSyncProps = {
  color: string;
  fallbackColor?: string;
};

export function ThemeColorSync({
  color,
  fallbackColor = "#f7f7f7",
}: ThemeColorSyncProps) {
  useEffect(() => {
    setMetaContent("theme-color", color);

    return () => {
      setMetaContent("theme-color", fallbackColor);
    };
  }, [color, fallbackColor]);

  return null;
}
