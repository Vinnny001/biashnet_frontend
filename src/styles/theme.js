// src/theme/theme.js

import { createTheme } from "@mui/material/styles";

export const COLORS = {
  GOLD: "#F4B400",
  GOLD_LIGHT: "#FFD54F",

  DARK: {
    BG: "#000000",
    CARD: "#0A0A0A",
    CARD_ELEVATED: "#111111",
    BORDER: "#222222",
    TEXT: "#FFFFFF",
    TEXT_SECONDARY: "#CCCCCC",
    TEXT_MUTED: "#888888",
  },

  LIGHT: {
    BG: "#F7F8FA",
    CARD: "#FFFFFF",
    CARD_ELEVATED: "#FFFFFF",
    BORDER: "#E5E7EB",
    TEXT: "#111111",
    TEXT_SECONDARY: "#4B5563",
    TEXT_MUTED: "#6B7280",
  },

  SUCCESS: "#21C55D",
  DANGER: "#EF4444",
  INFO: "#38BDF8",
};

export const getTheme = (mode = "light") => {
  const dark = mode === "dark";
  const colors = dark ? COLORS.DARK : COLORS.LIGHT;

  return createTheme({
    palette: {
      mode,

      background: {
        default: colors.BG,
        paper: colors.CARD,
      },

      text: {
        primary: colors.TEXT,
        secondary: colors.TEXT_SECONDARY,
      },

      primary: {
        main: COLORS.GOLD,
        light: COLORS.GOLD_LIGHT,
        contrastText: "#000000",
      },

      divider: colors.BORDER,

      success: {
        main: COLORS.SUCCESS,
      },

      error: {
        main: COLORS.DANGER,
      },

      info: {
        main: COLORS.INFO,
      },
    },

    typography: {
      fontFamily: "Inter, Roboto, Arial, sans-serif",

      h1: {
        fontWeight: 800,
      },

      h2: {
        fontWeight: 800,
      },

      h3: {
        fontWeight: 800,
      },

      h4: {
        fontWeight: 800,
      },

      h5: {
        fontWeight: 700,
      },

      h6: {
        fontWeight: 700,
      },

      button: {
        fontWeight: 700,
        textTransform: "none",
      },
    },

    shape: {
      borderRadius: 10,
    },

    components: {
      MuiCssBaseline: {
        styleOverrides: {
          html: {
            backgroundColor: colors.BG,
          },

          body: {
            margin: 0,
            backgroundColor: colors.BG,
            color: colors.TEXT,
            transition: "background-color 0.25s ease, color 0.25s ease",
          },

          "*": {
            boxSizing: "border-box",
          },

          "*::-webkit-scrollbar": {
            width: 6,
            height: 6,
          },

          "*::-webkit-scrollbar-thumb": {
            backgroundColor: dark ? "#333" : "#C7C7C7",
            borderRadius: 10,
          },

          "*::-webkit-scrollbar-track": {
            backgroundColor: "transparent",
          },
        },
      },

      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: colors.CARD,
            border: `1px solid ${colors.BORDER}`,
            color: colors.TEXT,
            boxShadow: dark
              ? "0 2px 12px rgba(0,0,0,0.35)"
              : "0 2px 12px rgba(0,0,0,0.06)",
            transition:
              "background-color 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease",
          },
        },
      },

      MuiCardContent: {
        styleOverrides: {
          root: {
            color: colors.TEXT,
          },
        },
      },

      MuiTypography: {
        styleOverrides: {
          root: {
            color: colors.TEXT,
          },
        },
      },

      MuiButton: {
        styleOverrides: {
          root: {
            minHeight: 40,
            borderRadius: 10,
          },

          containedPrimary: {
            backgroundColor: COLORS.GOLD,
            color: "#000000",

            "&:hover": {
              backgroundColor: COLORS.GOLD_LIGHT,
            },
          },

          outlinedPrimary: {
            borderColor: COLORS.GOLD,
            color: COLORS.GOLD,

            "&:hover": {
              borderColor: COLORS.GOLD_LIGHT,
              backgroundColor: "rgba(244, 180, 0, 0.08)",
            },
          },
        },
      },

      MuiIconButton: {
        styleOverrides: {
          root: {
            color: colors.TEXT,
            borderRadius: 10,

            "&:hover": {
              backgroundColor: dark
                ? "rgba(255,255,255,0.06)"
                : "rgba(0,0,0,0.05)",
            },
          },
        },
      },

      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 20,
          },
        },
      },

      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            color: colors.TEXT,
            backgroundColor: colors.CARD,
            borderRadius: 10,

            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: colors.BORDER,
            },

            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: COLORS.GOLD,
            },

            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: COLORS.GOLD,
              borderWidth: 2,
            },
          },

          input: {
            "&::placeholder": {
              color: colors.TEXT_MUTED,
              opacity: 1,
            },
          },
        },
      },

      MuiInputLabel: {
        styleOverrides: {
          root: {
            color: colors.TEXT_SECONDARY,

            "&.Mui-focused": {
              color: COLORS.GOLD,
            },
          },
        },
      },

      MuiTextField: {
        defaultProps: {
          variant: "outlined",
        },
      },

      MuiDivider: {
        styleOverrides: {
          root: {
            borderColor: colors.BORDER,
          },
        },
      },

      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
            backgroundColor: colors.CARD,
          },
        },
      },

      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: colors.CARD,
            color: colors.TEXT,
            backgroundImage: "none",
            boxShadow: dark
              ? "0 1px 0 rgba(255,255,255,0.06)"
              : "0 1px 0 rgba(0,0,0,0.08)",
          },
        },
      },

      MuiBottomNavigation: {
        styleOverrides: {
          root: {
            backgroundColor: colors.CARD,
            borderTop: `1px solid ${colors.BORDER}`,
          },
        },
      },

      MuiBottomNavigationAction: {
        styleOverrides: {
          root: {
            color: colors.TEXT_MUTED,

            "&.Mui-selected": {
              color: COLORS.GOLD,
            },
          },
        },
      },

      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: colors.CARD,
            backgroundImage: "none",
            color: colors.TEXT,
          },
        },
      },

      MuiDialog: {
        styleOverrides: {
          paper: {
            backgroundColor: colors.CARD,
            backgroundImage: "none",
            color: colors.TEXT,
            border: `1px solid ${colors.BORDER}`,
          },
        },
      },

      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: 10,

            "&:hover": {
              backgroundColor: dark
                ? "rgba(255,255,255,0.05)"
                : "rgba(0,0,0,0.04)",
            },

            "&.Mui-selected": {
              backgroundColor: "rgba(244,180,0,0.12)",

              "&:hover": {
                backgroundColor: "rgba(244,180,0,0.16)",
              },
            },
          },
        },
      },
    },
  });
};

export default getTheme;