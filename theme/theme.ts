// theme.ts
import { createTheme } from "@mui/material/styles";
import { RefineThemes } from "@refinedev/mui";

// Extend MUI's palette to include the custom "strong" property.
declare module "@mui/material/styles" {
  interface Palette {
    strong: {
      default: string;
    };
  }
  interface PaletteOptions {
    strong?: {
      default?: string;
    };
  }
}

// Light theme using RefineThemes.Orange.
export const lightTheme = createTheme(RefineThemes.Orange, {
  palette: {
    primary: {
      main: "#C15925", // Orange main
      light: "#CD7A51", // Orange light
      dark: "#A83800",  // Orange dark
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#005b96", // A deep blue for light mode
      light: "#337ab7",
      dark: "#003f6e",
      contrastText: "#000000",
    },
    error: {
      main: "#f44336",
      light: "#e57373",
      dark: "#d32f2f",
      contrastText: "#ffffff",
    },
    warning: {
      main: "#ffa726",
      light: "#ffb74d",
      dark: "#f57c00",
      contrastText: "#cc7e0a",
    },
    info: {
      main: "#29b6f6",
      light: "#4fc3f7",
      dark: "#0288d1",
      contrastText: "#666666",
    },
    success: {
      main: "#66bb6a",
      light: "#81c784",
      dark: "#388e3c",
      contrastText: "#000000",
    },
    strong: {
      default: "#ffffff",
    },
  },
});

// Dark theme using RefineThemes.OrangeDark.
export const darkTheme = createTheme(RefineThemes.OrangeDark, {
  palette: {
    primary: {
      main: "#C15925",
      light: "#CD7A51",
      dark: "#A83800",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#66b2ff", // A brighter blue tailored for dark mode
      light: "#99ccff",
      dark: "#3385ff",
      contrastText: "#000000",
    },
    error: {
      main: "#f44336",
      light: "#e57373",
      dark: "#d32f2f",
      contrastText: "#ffffff",
    },
    warning: {
      main: "#ffa726",
      light: "#ffb74d",
      dark: "#f57c00",
      contrastText: "#ffa726",
    },
    info: {
      main: "#4fc3f7", // A slightly lighter info color for better visibility on dark backgrounds
      light: "#80dfff",
      dark: "#0288d1",
      contrastText: "#aaaaaa",
    },
    success: {
      main: "#66bb6a",
      light: "#81c784",
      dark: "#388e3c",
      contrastText: "#ffffff",
    },
    strong: {
      default: "#000000",
    },
  },
});

// Helper to get the theme based on mode.
export const getTheme = (mode: "light" | "dark") =>
  mode === "light" ? lightTheme : darkTheme;
