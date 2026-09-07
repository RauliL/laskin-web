import Box from "@mui/material/Box";
import React, { FunctionComponent } from "react";
import { useSelector } from "react-redux";

import { contentPadding, gruvbox, monospaceFontFamily } from "../theme";
import { Line, State } from "../store";

const lineColor = (type: Line["type"]) => {
  switch (type) {
    case "error":
      return gruvbox.outputErrorForeground;
    case "input":
      return gruvbox.outputInputForeground;
    default:
      return gruvbox.outputForeground;
  }
};

export const OutputBuffer: FunctionComponent = () => {
  const lines = useSelector<State, Line[]>((state) => state.lines);

  return (
    <Box
      component="ul"
      sx={{
        listStyle: "none",
        m: 0,
        p: 0,
        flex: 1,
        fontFamily: monospaceFontFamily,
      }}
    >
      {lines.map((line, index) => (
        <Box
          component="li"
          key={index}
          sx={{
            ...contentPadding,
            color: lineColor(line.type),
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            "&:hover": {
              bgcolor: gruvbox.outputHoverBackground,
            },
          }}
        >
          {line.text}
        </Box>
      ))}
    </Box>
  );
};
