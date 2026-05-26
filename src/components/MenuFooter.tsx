"use client";

import type { ReactNode } from "react";
import { WifiAccessBanner } from "@/components/WifiAccessBanner";
import { useClientMenu } from "@/context/ClientMenuContext";
import { useLanguage } from "@/context/LanguageContext";
import type { RestaurantConfig } from "@/types/menu";
import type { UiStrings } from "@/types/translation";

type MenuFooterProps = {
  restaurant: RestaurantConfig;
  ui: Pick<
    UiStrings,
    | "tableServiceFee"
    | "frozenProductNote"
    | "treesSavedLabel"
    | "oxygenProducedLabel"
  >;
};

function formatImpactValue(value: number) {
  return `+${new Intl.NumberFormat("it-IT").format(value)}`;
}

export function MenuFooter({ restaurant, ui }: MenuFooterProps) {
  const { content } = useLanguage();
  const clientMenu = useClientMenu();
  const impactStats = restaurant.impactStats;
  const wifiAccess = clientMenu?.client.customizations.wifiAccess;
  const showWifiBanner = Boolean(
    wifiAccess?.enabled && wifiAccess.ssid.trim().length > 0,
  );

  return (
    <footer className="border-t border-[#141415]/10 px-5 pb-5 pt-8 text-[0.85rem] leading-relaxed text-[#909090]">
      {restaurant.notes ? (
        <div
          className="menu-notes mb-8 text-[#141415]"
          dangerouslySetInnerHTML={{ __html: restaurant.notes }}
        />
      ) : null}

      {restaurant.address ? (
        <p className="mb-1 text-[#141415]">{restaurant.address}</p>
      ) : null}
      {restaurant.phone ? (
        <p className="mb-8">
          <a
            href={`tel:${restaurant.phone.replace(/\s/g, "")}`}
            className="underline underline-offset-2"
          >
            {restaurant.phone}
          </a>
        </p>
      ) : null}

      <div className="space-y-2 text-[#141415]">
        <p className="font-bold">{ui.tableServiceFee}</p>
        <p className="font-bold">{ui.frozenProductNote}</p>
      </div>

      {impactStats ? (
        <div className="mt-8 flex flex-wrap gap-x-10 gap-y-6">
          <ImpactStat
            icon={<TreesIcon />}
            value={formatImpactValue(impactStats.treesSaved)}
            label={ui.treesSavedLabel}
          />
          <ImpactStat
            icon={<OxygenIcon />}
            value={formatImpactValue(impactStats.oxygenProducedKg)}
            label={ui.oxygenProducedLabel}
          />
        </div>
      ) : null}

      {showWifiBanner ? (
        <div className="mt-8 border-t border-[#141415]" />
      ) : null}

      {showWifiBanner && wifiAccess && clientMenu ? (
        <WifiAccessBanner
          ssid={wifiAccess.ssid}
          password={wifiAccess.password}
          label={content.ui.wifiConnectLabel}
          subtitle={content.ui.wifiConnectSubtitle}
          primaryColor={clientMenu.client.brand.primaryColor}
          secondaryColor={clientMenu.client.brand.secondaryColor}
        />
      ) : null}
    </footer>
  );
}

function ImpactStat({
  icon,
  value,
  label,
}: {
  icon: ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-5">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center text-[#141415]">
        {icon}
      </div>
      <div>
        <p className="text-[1.35rem] font-bold leading-none text-[#141415]">
          {value}
        </p>
        <p className="mt-1 text-[0.78rem] leading-snug text-[#909090]">
          {label}
        </p>
      </div>
    </div>
  );
}

function TreesIcon() {
  return (
    <svg
      viewBox="0 0 842 595"
      aria-hidden
      className="h-10 w-10 fill-current"
    >
      <path d="M470 426.5 390.1 314.6h30.8c6.5 0 12.4-3.5 15.4-9.2 3.1-5.7 2.7-12.6-.8-17.9l-75-112.4h25.6c6.6 0 12.6-3.7 15.6-9.7 2.9-5.9 2.3-12.9-1.7-18.2L312.8 6.5c-6.6-8.8-21.3-8.8-27.9 0l-87.2 140.7c-3.9 5.3-4.6 12.3-1.6 18.2 2.9 6 9 9.7 15.6 9.7h25.5l-74.9 112.4c-3.6 5.3-3.9 12.2-.9 17.9 3 5.7 8.9 9.2 15.4 9.2h30.9l-81.1 111.9c-3.8 5.4-4.4 12.4-1.4 18.2 3 5.8 9 9.4 15.5 9.4h315.1c6.6 0 12.5-3.6 15.5-9.4 3-5.8 2.5-12.8-1.3-18.2zM701.1 559.9H577.9V489h-69.8v70.9H333.7V489H264v70.9H140.7c-9.6 0-17.4 7.8-17.4 17.5 0 9.6 7.8 17.4 17.4 17.4h560.4c9.7 0 17.5-7.8 17.5-17.4 0-9.7-7.8-17.5-17.5-17.5zM715.3 426.5l-81.1-111.9h30.9c6.4 0 12.3-3.5 15.4-9.2 3-5.7 2.7-12.6-.9-17.9l-74.9-112.4h25.5c6.6 0 12.7-3.7 15.6-9.7 3-5.9 2.3-12.9-1.6-18.2L557 6.5c-6.6-8.8-21.4-8.8-27.9 0l-87.2 140.7c-4 5.3-4.6 12.3-1.7 18.2 3 6 9 9.7 15.6 9.7h25.6l-39.5 59.2 22.6 33.8c10.7 16.1 11.7 36.7 2.6 53.7-4 7.4-9.5 13.5-16.1 18.2l47.4 66.3c10.1 14.1 12 31.8 6.2 47.8h196.5c6.6 0 12.6-3.6 15.5-9.4 3-5.8 2.5-12.8-1.3-18.2z" />
    </svg>
  );
}

function OxygenIcon() {
  return (
    <svg
      viewBox="0 0 384 271"
      aria-hidden
      className="h-10 w-10 fill-current"
    >
      <path
        fillRule="evenodd"
        d="M384 180.8c0 49.6-41.1 89.9-90.8 89.9H90.8c-49.7 0-90.8-40.3-90.8-90 0-21.7 8.8-42.5 23.5-59.1C25.6 53.9 80.2 0 147 0c37.7 0 73.3 18.1 96.8 47.6 5.4-1.3 10.6-1.9 15.7-1.9 34.8 0 64.9 22.5 75.1 55.3 29.7 15.4 49.4 46.3 49.4 79.7zm-180.8-56.2c.1-31-20.1-56.3-44.9-56.3-24.9 0-45 25.3-45 56.3 0 31 20.1 56.2 45 56.2 24.8 0 45-25.2 45-56.2zm48.2 78.7c10.4-9.3 19.3-20.9 19.3-33.7 0-18.6-15.2-33.8-33.8-33.8-18.6 0-33.7 15.2-33.7 33.8 0 6.2 5 11.2 11.2 11.2 6.2 0 11.3-5 11.3-11.2 0-6.2 5-11.3 11.2-11.3 6.2 0 11.3 5.1 11.3 11.3 0 10.1-22.6 26.8-38.8 34.9-4.7 2.4-7.1 7.6-5.9 12.7 1.2 5.1 5.7 8.6 10.9 8.6h45c6.2 0 11.3-5 11.3-11.2 0-6.2-5.1-11.3-11.3-11.3z"
      />
      <path d="M158.3 158.3c-12.2-.1-22.6-15.5-22.6-33.8 0-18.3 10.4-33.8 22.5-33.8 12.2 0 22.5 15.5 22.5 33.8 0 18.3-10.3 33.7-22.5 33.7z" />
    </svg>
  );
}
