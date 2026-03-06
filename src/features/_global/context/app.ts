import { createContext } from "react";
import { DashboardLayoutProps } from "../components";

export interface VokadashContextValue {
  appName: string;
  menus: DashboardLayoutProps["menus"];
  usermenus: DashboardLayoutProps["usermenus"];
}

const vokadashContextDefaultValue: VokadashContextValue = {
  appName: "",
  menus: [],
  usermenus: [],
};

export const VokadashContext = createContext(vokadashContextDefaultValue);

// Cari interface SidebarContextValue atau sejenisnya
export interface SidebarContextValue {
  visible: boolean;
  // Ubah dari () => void menjadi seperti di bawah ini:
  setVisible: (visible: boolean) => void; 
}

const sidebarContextDefaultValue: SidebarContextValue = {
  visible: false,
  setVisible: () => {},
};

export const SidebarContext = createContext(sidebarContextDefaultValue);
