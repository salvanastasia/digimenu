import Link from "next/link";
import type { ClientConfig } from "@/types/client";
import { getEffectiveHeader, getHeaderBackgroundStyle, hasHeaderBackgroundImage } from "@/lib/client-header";

type ClientCardProps = {
  client: ClientConfig;
  onOpen: () => void;
};

export function ClientCard({ client, onOpen }: ClientCardProps) {
  const dishCount = client.dishes.filter((dish) => dish.name.trim()).length;
  const languageCount = client.header.languages.length;
  const effectiveHeader = getEffectiveHeader(client);
  const headerBackgroundStyle = getHeaderBackgroundStyle(effectiveHeader);
  const showBackgroundOverlay = hasHeaderBackgroundImage(effectiveHeader);

  return (
    <div className="group flex w-full flex-col overflow-hidden rounded-[18px] border border-[#e4e4e4] bg-white text-left shadow-[0_2px_12px_rgba(0,0,0,0.04)] transition-all hover:-translate-y-0.5 hover:border-[#560200]/20 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
      <div
        className="relative flex h-24 items-end p-4"
        style={headerBackgroundStyle}
      >
        {showBackgroundOverlay ? (
          <div
            className="pointer-events-none absolute inset-0 bg-black/70"
            aria-hidden="true"
          />
        ) : null}
        <div className="relative z-10 flex flex-wrap gap-2">
          <div
            className="rounded-full px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.12em]"
            style={{
              backgroundColor: client.brand.secondaryColor,
              color: client.brand.primaryColor,
            }}
          >
            {client.brand.fontFamily.split(",")[0]}
          </div>
          {client.hidden ? (
            <div className="rounded-full bg-[#141415]/80 px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-white">
              Nascosto
            </div>
          ) : null}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-[1.05rem] font-bold text-[#141415]">
              {client.name || "Senza nome"}
            </h3>
            <p className="mt-1 text-[0.78rem] text-[#606060]">
              {dishCount} piatti · {languageCount} lingue
            </p>
            <p className="mt-1 text-[0.78rem] font-medium text-[#560200]">
              /{client.slug}
            </p>
          </div>
          <div className="flex shrink-0 gap-1.5">
            <span
              className="h-6 w-6 rounded-full border border-black/10"
              style={{ backgroundColor: client.brand.primaryColor }}
              title="Primario"
            />
            <span
              className="h-6 w-6 rounded-full border border-black/10"
              style={{ backgroundColor: client.brand.secondaryColor }}
              title="Secondario"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onOpen}
            className="rounded-full border border-[#560200] px-4 py-2 text-[0.78rem] font-semibold text-[#560200] transition-colors hover:bg-[#560200]/5"
          >
            Modifica
          </button>
          {client.hidden ? (
            <span
              className="rounded-full bg-[#ececec] px-4 py-2 text-[0.78rem] font-semibold text-[#606060]"
              title="Menu disattivato al pubblico"
            >
              Menu nascosto
            </span>
          ) : (
            <Link
              href={`/${client.slug}`}
              className="rounded-full bg-[#560200] px-4 py-2 text-[0.78rem] font-semibold text-white transition-colors hover:bg-[#6d0200]"
            >
              Apri menu
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
