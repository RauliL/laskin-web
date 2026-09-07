import { Dispatch } from "@reduxjs/toolkit";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { LaskinContext, laskinValueToSource } from "laskin";
import laskinWasmUrl from "laskin/laskin.wasm?url";
import React, { FunctionComponent, useState } from "react";
import { useDispatch } from "react-redux";

import { contentPadding, gruvbox } from "../theme";
import { LaskinUIAction } from "../store";
import { InputBuffer } from "./InputBuffer";
import { OutputBuffer } from "./OutputBuffer";
import { StackDisplay } from "./StackDisplay";

export type AppProps = {
  context: LaskinContext;
};

export const App: FunctionComponent<AppProps> = ({ context }) => {
  const dispatch = useDispatch<Dispatch<LaskinUIAction>>();
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("md"));
  const [mobileTab, setMobileTab] = useState(0);

  const handleOutput = (text: string) => {
    if (!/^\s*$/.test(text)) {
      dispatch({ type: "ADD_LINE", line: { type: "output", text } });
    }
  };

  const handleInput = async (text: string): Promise<void> => {
    dispatch({ type: "ADD_LINE", line: { type: "input", text } });

    try {
      handleOutput(context.run(text));
    } catch (err) {
      dispatch({ type: "ADD_LINE", line: { type: "error", text: `${err}` } });
      throw err;
    } finally {
      dispatch({
        type: "UPDATE_STACK",
        stack: await Promise.all(
          context
            .stack()
            .map((value) =>
              laskinValueToSource(value, { locateFile: () => laskinWasmUrl }),
            ),
        ),
      });
    }
  };

  const replPanel = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
        height: "100%",
        overflow: "hidden",
        bgcolor: gruvbox.outputBackground,
      }}
    >
      <OutputBuffer />
      <InputBuffer onInput={handleInput} />
    </Box>
  );

  if (isLargeScreen) {
    return (
      <Box
        sx={{
          display: "grid",
          gridTemplateAreas: `"header header" "main sidebar"`,
          gridTemplateColumns: "5fr 1fr",
          gridTemplateRows: "auto 1fr",
          height: "100vh",
          overflow: "hidden",
        }}
      >
        <AppBar
          position="static"
          elevation={0}
          sx={{
            gridArea: "header",
            bgcolor: gruvbox.headerBackground,
          }}
        >
          <Toolbar sx={{ ...contentPadding, minHeight: "unset" }}>
            <Typography
              component="h1"
              variant="h6"
              sx={{ color: gruvbox.headerForeground, fontWeight: 400 }}
            >
              🧮 Laskin
            </Typography>
          </Toolbar>
        </AppBar>

        <Box sx={{ gridArea: "main", minHeight: 0 }}>{replPanel}</Box>

        <StackDisplay sx={{ gridArea: "sidebar" }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <AppBar
        position="static"
        elevation={0}
        sx={{ bgcolor: gruvbox.headerBackground, flexShrink: 0 }}
      >
        <Toolbar sx={{ ...contentPadding, minHeight: "unset" }}>
          <Typography
            component="h1"
            variant="h6"
            sx={{ color: gruvbox.headerForeground, fontWeight: 400 }}
          >
            🧮 Laskin
          </Typography>
        </Toolbar>
      </AppBar>

      <Tabs
        value={mobileTab}
        onChange={(_, value) => setMobileTab(value)}
        variant="fullWidth"
        sx={{
          flexShrink: 0,
          bgcolor: gruvbox.headerBackground,
          minHeight: 48,
          "& .MuiTab-root": {
            color: gruvbox.headerForeground,
            opacity: 0.7,
            textTransform: "none",
            fontSize: "1rem",
          },
          "& .Mui-selected": {
            color: gruvbox.outputForeground,
            opacity: 1,
          },
          "& .MuiTabs-indicator": {
            bgcolor: gruvbox.outputForeground,
          },
        }}
      >
        <Tab label="REPL" />
        <Tab label="Stack" />
      </Tabs>

      <Box sx={{ flex: 1, minHeight: 0, overflow: "hidden" }}>
        {mobileTab === 0 ? replPanel : <StackDisplay sx={{ height: "100%" }} />}
      </Box>
    </Box>
  );
};
