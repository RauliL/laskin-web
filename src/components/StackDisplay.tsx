import Box from "@mui/material/Box";
import React, { FunctionComponent } from "react";
import { useSelector } from "react-redux";

import { contentPadding, gruvbox, monospaceFontFamily } from "../theme";
import { State } from "../store";

export const StackDisplay: FunctionComponent = () => {
  const stack = useSelector<State, string[]>((state) => state.stack);

  return (
    <Box
      component="ul"
      sx={{
        gridArea: "sidebar",
        listStyle: "none",
        m: 0,
        p: 0,
        overflow: "auto",
        minHeight: 0,
        bgcolor: gruvbox.stackBackground,
        color: gruvbox.stackForeground,
        fontFamily: monospaceFontFamily,
      }}
    >
      {stack.map((value, index) => (
        <Box
          component="li"
          key={index}
          sx={{
            ...contentPadding,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            "&:hover": {
              bgcolor: gruvbox.stackHoverBackground,
            },
          }}
        >
          {value}
        </Box>
      ))}
    </Box>
  );
};
