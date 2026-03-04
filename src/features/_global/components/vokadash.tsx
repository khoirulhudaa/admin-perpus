import React, { PropsWithChildren } from "react";

import { VokadashContext } from "../context";
import {
  RawColors,
  Theme,
  ThemeProvider,
  Toaster,
  VokadashHelmetProvider,
  VokadashQueryProvider,
} from "@/core/libs";
import { DashboardLayoutProps } from "./dashboard";
import { APP_CONFIG } from "@/core/configs";

export interface VokadashProps extends PropsWithChildren {
  appName: string;
  menus: DashboardLayoutProps["menus"];
  usermenus: DashboardLayoutProps["usermenus"];
  colors?: RawColors;
}

const VokadashWithContext = React.memo(
  ({ menus, usermenus, children, appName, ...props }: VokadashProps) => {
    return (
      <VokadashContext.Provider value={{ appName, menus, usermenus }}>
        <ThemeProvider
          colors={props.colors}
          defaultTheme={APP_CONFIG.defaultTheme as Theme}
          storageKey={APP_CONFIG.themeKey}
        >
          {children}
        </ThemeProvider>
        <Toaster />
      </VokadashContext.Provider>
    );
  },
);

VokadashWithContext.displayName = "VokadashWithContext";

export const Vokadash = React.memo((props: VokadashProps) => {
  return (
    <VokadashHelmetProvider>
      <VokadashQueryProvider>
        <VokadashWithContext {...props} />
      </VokadashQueryProvider>
    </VokadashHelmetProvider>
  );
});
