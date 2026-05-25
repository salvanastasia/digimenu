"use client";

import { useEffect, useRef, useState } from "react";
import { WifiIcon } from "@/components/WifiIcon";
import { useLanguage } from "@/context/LanguageContext";
import {
  canOpenMobileWifiSettings,
  formatWifiConnectHint,
  hasWifiPassword,
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
  const secured = hasWifiPassword(password);

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

            const hintTemplate = secured
              ? content.ui.wifiConnectHint
              : content.ui.wifiConnectHintOpen;

            setHint(formatWifiConnectHint(hintTemplate, result.ssid));

            if (canOpenMobileWifiSettings()) {
              settingsTimeoutRef.current = window.setTimeout(() => {
                openMobileWifiSettings();
                settingsTimeoutRef.current = null;
              }, WIFI_SETTINGS_DELAY_MS);
            }
          });
        }}
        className="flex w-full items-center gap-3 overflow-hidden rounded-[18px] text-left shadow-[0_4px_18px_rgba(0,0,0,0.12)] transition-transform active:scale-[0.99]"
        style={{
          backgroundColor: primaryColor,
          color: secondaryColor,
        }}
      >
        <div className="flex shrink-0 items-center overflow-hidden pl-0">
          <WifiIcon className="ml-[-18px] h-20 w-auto" />
        </div>
        <div className="flex min-h-[5.25rem] flex-1 flex-col justify-center py-4 pr-4">
          {secured ? (
            <>
              <p className="text-[1rem] font-bold leading-snug">{label}</p>
              <p className="mt-1 text-[0.82rem] font-normal leading-snug opacity-90">
                {subtitle}
              </p>
            </>
          ) : (
            <p
              className="text-[0.9rem] font-medium leading-snug [&_strong]:font-bold"
              dangerouslySetInnerHTML={{
                __html: formatWifiConnectHint(
                  content.ui.wifiConnectHintOpen,
                  ssid.trim(),
                ),
              }}
            />
          )}
        </div>
      </button>
    </div>
  );
}
