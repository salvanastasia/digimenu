"use client";

import { DashboardUserMenu } from "@/components/dashboard/DashboardUserMenu";

type DashboardNavbarProps = {
  title: string;
  hidden?: boolean;
  onNewClient?: () => void;
};

export function DashboardNavbar({
  title,
  hidden = false,
  onNewClient,
}: DashboardNavbarProps) {
  return (
    <header className="border-b border-[#e4e4e4] bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <div className="min-w-0">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[#560200]">
            DigiMenu
          </p>
          <h1 className="truncate text-[1.35rem] font-bold text-[#141415]">
            {title}
            {hidden ? (
              <span className="ml-2 align-middle text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-[#8a1f1f]">
                Nascosto
              </span>
            ) : null}
          </h1>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          {onNewClient ? (
            <button
              type="button"
              onClick={onNewClient}
              className="rounded-full bg-[#560200] px-4 py-2 text-[0.84rem] font-semibold text-white transition-colors hover:bg-[#6d0200]"
            >
              + Nuovo cliente
            </button>
          ) : null}
          <DashboardUserMenu />
        </div>
      </div>
    </header>
  );
}
