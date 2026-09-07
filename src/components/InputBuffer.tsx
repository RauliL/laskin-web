import { Dispatch } from "@reduxjs/toolkit";
import InputBase from "@mui/material/InputBase";
import React, { FunctionComponent, KeyboardEvent, useRef } from "react";
import { useDispatch } from "react-redux";

import { contentPadding, gruvbox, monospaceFontFamily } from "../theme";
import { LaskinUIAction } from "../store";

export type InputBufferProps = {
  onInput: (text: string) => Promise<void>;
};

export const InputBuffer: FunctionComponent<InputBufferProps> = ({
  onInput,
}) => {
  const dispatch = useDispatch<Dispatch<LaskinUIAction>>();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (ev: KeyboardEvent) => {
    const input = inputRef.current;

    if (input && ev.key === "Enter") {
      const text = input.value.trim();

      ev.preventDefault();
      if (!/^\s*$/.test(text)) {
        onInput(text)
          .then(() => {})
          .catch(() => {})
          .finally(() => {
            input.value = "";
            input.focus();
          });
      }
    } else if (ev.key === "l" && ev.ctrlKey) {
      ev.preventDefault();
      dispatch({ type: "CLEAR_ALL_LINES" });
    }
  };

  return (
    <InputBase
      inputRef={inputRef}
      fullWidth
      onKeyDown={handleKeyDown}
      autoFocus
      onFocus={() => {
        requestAnimationFrame(() => window.scrollTo(0, 0));
      }}
      sx={{
        display: "block",
        bgcolor: gruvbox.inputBackground,
        color: gruvbox.inputForeground,
        fontFamily: monospaceFontFamily,
        ...contentPadding,
        "& .MuiInputBase-input": {
          fontFamily: monospaceFontFamily,
          p: 0,
        },
      }}
    />
  );
};
