import type { ReactNode } from "react";
import type { MenuTheme } from "@/types/client";
import {
  getCheckerboardFrameStyle,
  getFramedThemeConfig,
} from "@/lib/menu-theme";

type MenuCheckerboardFrameProps = {
  menuTheme: MenuTheme;
  primaryColor: string;
  secondaryColor: string;
  children: ReactNode;
};

export function MenuCheckerboardFrame({
  menuTheme,
  primaryColor,
  secondaryColor,
  children,
}: MenuCheckerboardFrameProps) {
  const config = getFramedThemeConfig(menuTheme);

  if (!config) {
    return <>{children}</>;
  }

  return (
    <div
      className={config.framePaddingClass}
      style={getCheckerboardFrameStyle(
        primaryColor,
        secondaryColor,
        config.checkerboardCellPx,
      )}
    >
      <div className={`flex flex-col bg-white ${config.innerMinHeightClass}`}>
        {children}
      </div>
    </div>
  );
}
