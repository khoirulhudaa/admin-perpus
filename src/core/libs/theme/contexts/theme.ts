import { createContext } from "react";
import { RawColors, Theme } from "../types/colors";

export interface ThemeContextValue {
  colors?: RawColors;
  theme?: Theme;
  setTheme: (theme: Theme) => void;
}

const defaultThemeContextValue: ThemeContextValue = {
  colors: undefined,
  theme: "system",
  setTheme: () => {},
};

export const ThemeContext = createContext(defaultThemeContextValue);
