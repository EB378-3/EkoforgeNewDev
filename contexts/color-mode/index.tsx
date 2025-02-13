// contexts/color-mode/index.tsx
"use client";

import CssBaseline from "@mui/material/CssBaseline";
import GlobalStyles from "@mui/material/GlobalStyles";
import { ThemeProvider } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Cookies from "js-cookie";
import React, { PropsWithChildren, createContext, useEffect, useState } from "react";
import { getTheme } from "@/theme/theme";

type ColorMode = "light" | "dark";

type ColorModeContextType = {
  mode: ColorMode;
  setMode: () => void;
};

export const ColorModeContext = createContext<ColorModeContextType>(
  {} as ColorModeContextType
);

type ColorModeContextProviderProps = {
  defaultMode?: ColorMode;
};

export const ColorModeContextProvider: React.FC<
  PropsWithChildren<ColorModeContextProviderProps>
> = ({ children, defaultMode = "light" }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [mode, setMode] = useState<ColorMode>(defaultMode);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const systemPrefersDark = useMediaQuery("(prefers-color-scheme: dark)");

  useEffect(() => {
    if (isMounted) {
      const cookieTheme = Cookies.get("theme");
      const newMode: ColorMode =
        cookieTheme === "dark" || (!cookieTheme && systemPrefersDark)
          ? "dark"
          : "light";
      setMode(newMode);
    }
  }, [isMounted, systemPrefersDark]);

  const toggleTheme = () => {
    const nextMode: ColorMode = mode === "light" ? "dark" : "light";
    setMode(nextMode);
    Cookies.set("theme", nextMode);
  };

  const theme = getTheme(mode);

  return (
    <ColorModeContext.Provider value={{ mode, setMode: toggleTheme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles styles={{ html: { WebkitFontSmoothing: "auto" } }} />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

// Custom hook to easily access the color mode context.
export const useColorMode = (): ColorModeContextType =>
  React.useContext(ColorModeContext);
