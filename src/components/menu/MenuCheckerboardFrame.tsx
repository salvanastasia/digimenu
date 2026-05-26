import type { ReactNode } from "react";
import { getCheckerboardFrameStyle } from "@/lib/menu-theme";

type MenuCheckerboardFrameProps = {
  primaryColor: string;
  secondaryColor: string;
  children: ReactNode;
};

export function MenuCheckerboardFrame({
  primaryColor,
  secondaryColor,
  children,
}: MenuCheckerboardFrameProps) {
  return (
    <div className="p-2.5" style={getCheckerboardFrameStyle(primaryColor, secondaryColor)}>
      <div className="flex min-h-[calc(100dvh-20px)] flex-col bg-white">{children}</div>
    </div>
  );
}
