import { Dispatch } from "@reduxjs/toolkit";
import Box from "@mui/material/Box";
import InputBase from "@mui/material/InputBase";
import React, {
  FunctionComponent,
  KeyboardEvent,
  useMemo,
  useRef,
  useState,
} from "react";
import { useDispatch } from "react-redux";

import { highlightSegments } from "../syntax-highlight";
import { contentPadding, gruvbox, monospaceFontFamily } from "../theme";
import { LaskinUIAction } from "../store";

export type InputBufferProps = {
  onInput: (text: string) => Promise<void>;
  dictionaryWords: ReadonlySet<string>;
};

const syntaxColors = {
  comment: gruvbox.syntaxComment,
  string: gruvbox.syntaxString,
  number: gruvbox.syntaxNumber,
  delimiter: gruvbox.syntaxDelimiter,
  symbol: gruvbox.syntaxSymbol,
  default: gruvbox.inputForeground,
} as const;

export const InputBuffer: FunctionComponent<InputBufferProps> = ({
  onInput,
  dictionaryWords,
}) => {
  const dispatch = useDispatch<Dispatch<LaskinUIAction>>();
  const inputRef = useRef<HTMLInputElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState("");

  const segments = useMemo(
    () => highlightSegments(value, dictionaryWords),
    [value, dictionaryWords],
  );

  const handleScroll = () => {
    const input = inputRef.current;
    const highlight = highlightRef.current;

    if (input && highlight) {
      highlight.scrollLeft = input.scrollLeft;
    }
  };

  const handleKeyDown = (ev: KeyboardEvent) => {
    if (ev.key === "Enter") {
      const text = value.trim();

      ev.preventDefault();
      if (!/^\s*$/.test(text)) {
        onInput(text)
          .then(() => {})
          .catch(() => {})
          .finally(() => {
            setValue("");
            inputRef.current?.focus();
          });
      }
    } else if (ev.key === "l" && ev.ctrlKey) {
      ev.preventDefault();
      dispatch({ type: "CLEAR_ALL_LINES" });
    }
  };

  return (
    <Box
      sx={{
        display: "block",
        bgcolor: gruvbox.inputBackground,
        fontFamily: monospaceFontFamily,
        ...contentPadding,
      }}
    >
      <Box sx={{ position: "relative" }}>
        <Box
          ref={highlightRef}
          aria-hidden
          sx={{
            position: "absolute",
            inset: 0,
            overflow: "hidden",
            whiteSpace: "pre",
            pointerEvents: "none",
            fontFamily: monospaceFontFamily,
            color: gruvbox.inputForeground,
          }}
        >
          {segments.map((segment, index) => (
            <Box
              component="span"
              key={index}
              sx={{ color: syntaxColors[segment.kind] }}
            >
              {segment.text}
            </Box>
          ))}
        </Box>
        <InputBase
          inputRef={inputRef}
          fullWidth
          value={value}
          onChange={(ev) => setValue(ev.target.value)}
          onScroll={handleScroll}
          onKeyDown={handleKeyDown}
          autoFocus
          inputProps={{
            autoCapitalize: "off",
            autoCorrect: "off",
            spellCheck: false,
          }}
          onFocus={() => {
            requestAnimationFrame(() => window.scrollTo(0, 0));
          }}
          sx={{
            display: "block",
            position: "relative",
            color: "transparent",
            caretColor: gruvbox.inputForeground,
            fontFamily: monospaceFontFamily,
            p: 0,
            "& .MuiInputBase-input": {
              fontFamily: monospaceFontFamily,
              p: 0,
              whiteSpace: "pre",
            },
          }}
        />
      </Box>
    </Box>
  );
};
