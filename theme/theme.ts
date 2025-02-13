// theme.ts
import { createTheme } from "@mui/material/styles";
import { RefineThemes } from "@refinedev/mui";

// Define the light theme using RefineThemes.Orange.
export const lightTheme = createTheme(RefineThemes.Orange, {
  palette: {
    primary: {
      main: "#C15925", // Orange main
      light: "#CD7A51", // Orange light
      dark: "#A83800", // Orange dark
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#999999", // Grey main
      light: "#CCCCCC", // Grey light
      dark: "#737373", // Grey dark
      contrastText: "#000000",
    },
    error: {
      main: "#f44336",
      light: "#e57373",
      dark: "#d32f2f",
      contrastText: "#fff",
    },
    warning: {
      main: "#ffa726",
      light: "#ffb74d",
      dark: "#f57c00",
      contrastText: "#fff",
    },
    info: {
      main: "#29b6f6",
      light: "#4fc3f7",
      dark: "#0288d1",
      contrastText: "#fff",
    },
    success: {
      main: "#66bb6a",
      light: "#81c784",
      dark: "#388e3c",
      contrastText: "#fff",
    },
  },
});

// Define the dark theme using RefineThemes.OrangeDark.
export const darkTheme = createTheme(RefineThemes.OrangeDark, {
  palette: {
    primary: {
      main: "#C15925",
      light: "#CD7A51",
      dark: "#A83800",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#999999",
      light: "#CCCCCC",
      dark: "#737373",
      contrastText: "#000000",
    },
    error: {
      main: "#f44336",
      light: "#e57373",
      dark: "#d32f2f",
      contrastText: "#fff",
    },
    warning: {
      main: "#ffa726",
      light: "#ffb74d",
      dark: "#f57c00",
      contrastText: "#fff",
    },
    info: {
      main: "#29b6f6",
      light: "#4fc3f7",
      dark: "#0288d1",
      contrastText: "#fff",
    },
    success: {
      main: "#66bb6a",
      light: "#81c784",
      dark: "#388e3c",
      contrastText: "#fff",
    },
  },
});

// Helper to get the theme based on mode.
export const getTheme = (mode: "light" | "dark") =>
  mode === "light" ? lightTheme : darkTheme;
