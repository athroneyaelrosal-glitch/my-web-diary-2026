import { createTheme } from "@mui/material/styles";
import { deepPurple, lime, yellow } from "@mui/material/colors";

/* ---------------------------------------
   Extend MUI palette to support TERTIARY
--------------------------------------- */
declare module "@mui/material/styles" {
  interface Palette {
    tertiary: Palette["primary"];
  }
  interface PaletteOptions {
    tertiary?: PaletteOptions["primary"];
  }
}

/* ---------------------------------------
   LIGHT THEME
--------------------------------------- */
export const theme = createTheme({
  palette: {
    mode: "light",

    // 💜 Athrone color
    primary: {
      main: deepPurple[800],
    },

    // 💚 complementary of purple
    secondary: {
      main: yellow[800],
    },

    // 💜 near-primary (used for cards)
    tertiary: {
      main: deepPurple[100],
    },
  },
});

/* ---------------------------------------
   DARK THEME
--------------------------------------- */
export const darkTheme = createTheme({
  palette: {
    mode: "dark",

    primary: {
      main: deepPurple[400],
    },

    secondary: {
      main: lime[400],
    },

    tertiary: {
      main: deepPurple[900],
    },
  },
});