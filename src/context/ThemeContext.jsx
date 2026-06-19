import { createContext, useMemo } from "react";
import { ThemeProvider as MuiThemeProvider, CssBaseline } from "@mui/material";
import theme from "../styles/theme";

export const ThemeContext = createContext({ theme });

export function AppThemeProvider({ children }) {
  const value = useMemo(() => ({ theme }), []);

  return (
    <ThemeContext.Provider value={value}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}
