// src/context/ThemeContext.jsx

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ThemeProvider as MuiThemeProvider,
  CssBaseline,
} from "@mui/material";

import { getTheme } from "../styles/theme";

const STORAGE_KEY = "biashnet-theme";

const getSystemTheme = () =>
  window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";

const getInitialPreference = () =>
  localStorage.getItem(STORAGE_KEY) || "system";

const ThemeContext = createContext(null);

export function AppThemeProvider({ children }) {
  const [preference, setPreference] = useState(getInitialPreference);

  const [systemMode, setSystemMode] = useState(getSystemTheme);

  const mode = preference === "system" ? systemMode : preference;

  const theme = useMemo(() => getTheme(mode), [mode]);

  const changeTheme = useCallback((value) => {
    setPreference(value);

    if (value === "system") {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, value);
    }
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (event) => {
      setSystemMode(event.matches ? "dark" : "light");
    };

    media.addEventListener("change", handleChange);

    return () => media.removeEventListener("change", handleChange);
  }, []);

  const value = useMemo(
    () => ({
      theme,
      mode,
      preference,
      changeTheme,
      isDark: mode === "dark",
    }),
    [theme, mode, preference, changeTheme]
  );

  return (
    <ThemeContext.Provider value={value}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}

export const useThemeMode = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error(
      "useThemeMode must be used inside AppThemeProvider"
    );
  }

  return context;
};

export default ThemeContext;