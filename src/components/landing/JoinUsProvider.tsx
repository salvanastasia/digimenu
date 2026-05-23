"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { ContactModal } from "@/components/landing/ContactModal";

type JoinUsContextValue = {
  openJoinUs: () => void;
};

const JoinUsContext = createContext<JoinUsContextValue | null>(null);

export function JoinUsProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  const openJoinUs = useCallback(() => {
    setOpen(true);
  }, []);

  return (
    <JoinUsContext.Provider value={{ openJoinUs }}>
      {children}
      <ContactModal open={open} onClose={() => setOpen(false)} />
    </JoinUsContext.Provider>
  );
}

export function useJoinUs() {
  const context = useContext(JoinUsContext);
  if (!context) {
    throw new Error("useJoinUs must be used within JoinUsProvider");
  }
  return context;
}

type JoinUsButtonProps = {
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  children?: ReactNode;
};

const VARIANT_CLASSES = {
  primary:
    "rounded-full bg-[#560200] px-4 py-2 text-[0.84rem] font-semibold text-white transition-colors hover:bg-[#6d0200]",
  secondary:
    "rounded-full bg-[#f2e8d8] px-5 py-3 text-[0.92rem] font-semibold text-[#560200] transition-transform hover:scale-[1.02]",
  ghost:
    "font-semibold text-[#606060] transition-colors hover:text-[#560200]",
} as const;

export function JoinUsButton({
  variant = "primary",
  className = "",
  children = "Unisciti a noi",
}: JoinUsButtonProps) {
  const { openJoinUs } = useJoinUs();

  return (
    <button
      type="button"
      onClick={openJoinUs}
      className={`${VARIANT_CLASSES[variant]} ${className}`.trim()}
    >
      {children}
    </button>
  );
}
