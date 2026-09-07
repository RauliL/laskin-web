import Box from "@mui/material/Box";
import { SxProps, Theme } from "@mui/material/styles";
import React, { FunctionComponent } from "react";
import { useSelector } from "react-redux";

import { contentPadding, gruvbox, monospaceFontFamily } from "../theme";
import { State } from "../store";

export type StackDisplayProps = {
  sx?: SxProps<Theme>;
};

export const StackDisplay: FunctionComponent<StackDisplayProps> = ({ sx }) => {
  const stack = useSelector<State, string[]>((state) => state.stack);

  return (
    <Box
      component="ul"
      sx={[
        {
          listStyle: "none",
          m: 0,
          p: 0,
          overflow: "auto",
          minHeight: 0,
          bgcolor: gruvbox.stackBackground,
          color: gruvbox.stackForeground,
          fontFamily: monospaceFontFamily,
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
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
