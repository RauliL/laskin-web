import { Dispatch } from "@reduxjs/toolkit";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { LaskinContext, laskinValueToSource } from "laskin";
import laskinWasmUrl from "laskin/laskin.wasm?url";
import React, { FunctionComponent } from "react";
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

      <Box
        sx={{
          gridArea: "main",
          display: "flex",
          flexDirection: "column",
          overflow: "auto",
          minHeight: 0,
          bgcolor: gruvbox.outputBackground,
        }}
      >
        <OutputBuffer />
        <InputBuffer onInput={handleInput} />
      </Box>

      <StackDisplay />
    </Box>
  );
};
