import { createTheme } from "@mui/material/styles";

/** Gruvbox-inspired palette from the original SASS variables. */
export const gruvbox = {
  headerBackground: "#3c3836",
  headerForeground: "#928375",
  inputBackground: "#ebdbb2",
  inputForeground: "#282828",
  outputBackground: "#282828",
  outputForeground: "#fbf1c7",
  outputInputForeground: "#a89984",
  outputErrorForeground: "#cc241d",
  outputHoverBackground: "#3c3836",
  outputStackPreviewForeground: "#83a598",
  stackBackground: "#000000",
  stackForeground: "#fbf1c7",
  stackHoverBackground: "#1d2021",
} as const;

export const contentPadding = {
  py: "1em",
  px: "1.5em",
} as const;

export const monospaceFontFamily = '"Inconsolata", monospace';

export const theme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: gruvbox.outputBackground,
      paper: gruvbox.outputBackground,
    },
    text: {
      primary: gruvbox.outputForeground,
      secondary: gruvbox.outputInputForeground,
    },
    error: {
      main: gruvbox.outputErrorForeground,
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontFamilyMonospace: monospaceFontFamily,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: (theme) => ({
        html: {
          fontSize: 18,
          height: "100%",
          overflow: "hidden",
          [theme.breakpoints.up("md")]: {
            fontSize: 16,
          },
        },
        body: {
          backgroundColor: gruvbox.outputBackground,
          color: gruvbox.outputForeground,
          height: "100%",
          overflow: "hidden",
        },
        "#root": {
          height: "100%",
          overflow: "hidden",
        },
      }),
    },
  },
});
