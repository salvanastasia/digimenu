"use client";

import { useEffect, useRef, useState } from "react";
import { WifiIcon } from "@/components/WifiIcon";
import { useLanguage } from "@/context/LanguageContext";
import {
  canOpenMobileWifiSettings,
  formatWifiConnectHint,
  openMobileWifiSettings,
  prepareWifiConnection,
  WIFI_SETTINGS_DELAY_MS,
} from "@/lib/wifi-connect";

type WifiAccessBannerProps = {
  ssid: string;
  password: string;
  label: string;
  subtitle: string;
  primaryColor: string;
  secondaryColor: string;
};

export function WifiAccessBanner({
  ssid,
  password,
  label,
  subtitle,
  primaryColor,
  secondaryColor,
}: WifiAccessBannerProps) {
  const { content } = useLanguage();
  const [hint, setHint] = useState<string | null>(null);
  const settingsTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (settingsTimeoutRef.current !== null) {
        window.clearTimeout(settingsTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="mt-8 space-y-3">
      {hint ? (
        <p
          className="rounded-[14px] px-4 py-3 text-[0.82rem] font-medium leading-snug [&_strong]:font-bold"
          style={{
            backgroundColor: `color-mix(in srgb, ${primaryColor} 15%, transparent)`,
            color: primaryColor,
          }}
          dangerouslySetInnerHTML={{ __html: hint }}
        />
      ) : null}

      <button
        type="button"
        onClick={() => {
          if (settingsTimeoutRef.current !== null) {
            window.clearTimeout(settingsTimeoutRef.current);
          }

          void prepareWifiConnection({ ssid, password }).then((result) => {
            if (!result) return;

            setHint(
              formatWifiConnectHint(content.ui.wifiConnectHint, result.ssid),
            );

            if (canOpenMobileWifiSettings()) {
              settingsTimeoutRef.current = window.setTimeout(() => {
                openMobileWifiSettings();
                settingsTimeoutRef.current = null;
              }, WIFI_SETTINGS_DELAY_MS);
            }
          });
        }}
        className="flex w-full overflow-hidden rounded-[18px] text-left shadow-[0_4px_18px_rgba(0,0,0,0.12)] transition-transform active:scale-[0.99]"
        style={{
          backgroundColor: primaryColor,
          color: secondaryColor,
        }}
      >
        <div className="flex w-[4.75rem] shrink-0 items-end justify-start overflow-hidden">
          <WifiIcon className="mb-[-0.35rem] ml-[-0.5rem] size-[4.75rem] opacity-70" />
        </div>
        <div className="flex min-h-[5.25rem] flex-1 flex-col justify-center py-4 pr-4">
          <p className="text-[1rem] font-bold leading-snug">{label}</p>
          <p className="mt-1 text-[0.82rem] font-normal leading-snug opacity-90">
            {subtitle}
          </p>
        </div>
      </button>
    </div>
  );
}
