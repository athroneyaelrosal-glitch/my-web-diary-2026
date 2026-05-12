import { createTheme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {
    tertiary: Palette["primary"];
  }
  interface PaletteOptions {
    tertiary?: PaletteOptions["primary"];
  }
}

const sharedTheme = {
  typography: {
    fontFamily: "'Roboto', 'Segoe UI', Arial, sans-serif",
    h4: {
      fontWeight: 800,
    },
    h5: {
      fontWeight: 800,
    },
    h6: {
      fontWeight: 800,
    },
    button: {
      fontWeight: 800,
      textTransform: "none" as const,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
};

export type CustomThemeColors = {
  website: string,
  background: string,
  card: string,
  accent: string,
}

export const lightThemeColors: CustomThemeColors = {
  website: "#4f46e5",
  background: "#f6f7fb",
  card: "#ffffff",
  accent: "#f59e0b",
}

export const darkThemeColors: CustomThemeColors = {
  website: "#312e81",
  background: "#0f172a",
  card: "#111827",
  accent: "#fbbf24",
}

function normalizeHex(color: string) {
  if (/^#[0-9a-f]{3}$/i.test(color)) {
    return `#${color[1]}${color[1]}${color[2]}${color[2]}${color[3]}${color[3]}`
  }

  if (/^#[0-9a-f]{6}$/i.test(color)) {
    return color
  }

  return "#ffffff"
}

function getLuminance(color: string) {
  const hex = normalizeHex(color).slice(1)
  const rgb = [0, 2, 4].map((index) => parseInt(hex.slice(index, index + 2), 16) / 255)
  const linear = rgb.map((channel) => (
    channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
  ))

  return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722
}

export function getReadableTextColor(color: string) {
  return getLuminance(color) > 0.48 ? "#111827" : "#ffffff"
}

function getSecondaryTextColor(color: string) {
  return getReadableTextColor(color) === "#ffffff" ? "#cbd5e1" : "#64748b"
}

function buildTheme(mode: "light" | "dark", colors: CustomThemeColors) {
  const cardText = getReadableTextColor(colors.card)

  return createTheme({
    ...sharedTheme,
    palette: {
      mode,
      primary: {
        main: colors.website,
        contrastText: getReadableTextColor(colors.website),
      },
      secondary: {
        main: colors.accent,
        contrastText: getReadableTextColor(colors.accent),
      },
      tertiary: {
        main: mode === "dark" ? "#1e1b4b" : "#eef2ff",
      },
      background: {
        default: colors.background,
        paper: colors.card,
      },
      text: {
        primary: cardText,
        secondary: getSecondaryTextColor(colors.card),
      },
    },
  })
}

export function createDiaryTheme(mode: "light" | "dark", colors: CustomThemeColors) {
  return buildTheme(mode, colors)
}

export const theme = createTheme({
  ...sharedTheme,
  palette: {
    mode: "light",
    primary: {
      main: "#4f46e5",
      dark: "#3730a3",
      light: "#818cf8",
    },
    secondary: {
      main: "#f59e0b",
      dark: "#b45309",
      light: "#fbbf24",
    },
    tertiary: {
      main: "#eef2ff",
    },
    background: {
      default: "#f6f7fb",
      paper: "#ffffff",
    },
    text: {
      primary: "#1f2937",
      secondary: "#64748b",
    },
  },
});

export const darkTheme = createTheme({
  ...sharedTheme,
  palette: {
    mode: "dark",
    primary: {
      main: "#818cf8",
      dark: "#6366f1",
      light: "#c7d2fe",
    },
    secondary: {
      main: "#fbbf24",
      dark: "#d97706",
      light: "#fde68a",
    },
    tertiary: {
      main: "#1e1b4b",
    },
    background: {
      default: "#0f172a",
      paper: "#111827",
    },
    text: {
      primary: "#f8fafc",
      secondary: "#cbd5e1",
    },
  },
});
