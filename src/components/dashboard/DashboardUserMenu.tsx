"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { db } from "@/lib/db";

export function DashboardUserMenu() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Menu account"
        className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#FFFAE6] ring-2 ring-[#560200]/15 transition-shadow hover:ring-[#560200]/35 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#560200]"
      >
        <img
          src="/digimenu-avatar.svg"
          alt=""
          aria-hidden
          className="size-[88%] object-contain"
          draggable={false}
        />
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 min-w-[11rem] overflow-hidden rounded-[12px] border border-[#e4e4e4] bg-white py-1 shadow-lg"
        >
          <Link
            href="/settings"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="block px-4 py-2.5 text-[0.88rem] font-medium text-[#141415] transition-colors hover:bg-[#f5f5f5]"
          >
            Impostazioni
          </Link>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              void db.auth.signOut();
            }}
            className="block w-full px-4 py-2.5 text-left text-[0.88rem] font-medium text-[#8a1f1f] transition-colors hover:bg-[#fff1f1]"
          >
            Logout
          </button>
        </div>
      ) : null}
    </div>
  );
}
