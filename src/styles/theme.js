import { createTheme } from "@mui/material/styles";

export const COLORS = {
  BG: "#000000",
  CARD: "#0A0A0A",
  CARD_ELEVATED: "#111111",
  BORDER: "#222222",
  GOLD: "#F4B400",
  GOLD_LIGHT: "#FFD54F",
  TEXT: "#FFFFFF",
  TEXT_SECONDARY: "#CCCCCC",
  TEXT_MUTED: "#888888",
  SUCCESS: "#21C55D",
  DANGER: "#EF4444",
  INFO: "#38BDF8"
};

const theme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: COLORS.BG,
      paper: COLORS.CARD
    },
    text: {
      primary: COLORS.TEXT,
      secondary: COLORS.TEXT_SECONDARY
    },
    primary: {
      main: COLORS.GOLD,
      light: COLORS.GOLD_LIGHT,
      contrastText: "#000000"
    },
    divider: COLORS.BORDER,
    success: {
      main: COLORS.SUCCESS
    },
    error: {
      main: COLORS.DANGER
    },
    info: {
      main: COLORS.INFO
    }
  },
  typography: {
    fontFamily: "Inter, Roboto, Arial, sans-serif",
    allVariants: {
      color: COLORS.TEXT
    },
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: {
      fontWeight: 700,
      textTransform: "none"
    }
  },
  shape: {
    borderRadius: 8
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: COLORS.BG,
          color: COLORS.TEXT
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: COLORS.CARD,
          border: `1px solid ${COLORS.BORDER}`,
          color: COLORS.TEXT
        }
      }
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          color: COLORS.TEXT
        }
      }
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          color: COLORS.TEXT
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8
        },
        containedPrimary: {
          backgroundColor: COLORS.GOLD,
          color: "#000000",
          "&:hover": {
            backgroundColor: COLORS.GOLD_LIGHT
          }
        },
        outlinedPrimary: {
          borderColor: COLORS.GOLD,
          color: COLORS.GOLD,
          "&:hover": {
            borderColor: COLORS.GOLD_LIGHT,
            backgroundColor: "rgba(244, 180, 0, 0.08)"
          }
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          color: COLORS.TEXT,
          backgroundColor: COLORS.CARD,
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: COLORS.BORDER
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: COLORS.GOLD
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: COLORS.GOLD
          }
        }
      }
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: COLORS.TEXT_SECONDARY,
          "&.Mui-focused": {
            color: COLORS.GOLD
          }
        }
      }
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: COLORS.BORDER
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none"
        }
      }
    }
  }
});

export default theme;
