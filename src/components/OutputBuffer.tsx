import Box from "@mui/material/Box";
import React, { FunctionComponent, useEffect, useRef } from "react";
import { useSelector } from "react-redux";

import { useLongPressSelect } from "../hooks/useLongPressSelect";
import { contentPadding, gruvbox, monospaceFontFamily } from "../theme";
import { Line, LineType, State } from "../store";

const formatStackPreview = (text: string): string =>
  text.replace(/\s+/g, " ").trim();

const lineColor = (type: LineType) => {
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
  const topOfStack = useSelector<State, string | undefined>(
    (state) => state.stack[0],
  );
  const scrollRef = useRef<HTMLDivElement>(null);
  const longPressSelect = useLongPressSelect();

  useEffect(() => {
    const container = scrollRef.current;

    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [lines]);

  return (
    <Box
      sx={{
        flex: 1,
        minHeight: 0,
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <Box
        ref={scrollRef}
        sx={{
          flex: 1,
          minHeight: 0,
          minWidth: 0,
          overflow: "auto",
        }}
      >
        <Box
          component="ul"
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            minHeight: "100%",
            listStyle: "none",
            m: 0,
            p: 0,
            fontFamily: monospaceFontFamily,
          }}
        >
          {lines.map((line, index) => (
            <Box
              component="li"
              key={index}
              {...longPressSelect}
              sx={{
                ...contentPadding,
                color: lineColor(line.type),
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                userSelect: "text",
                WebkitUserSelect: "text",
                "&:hover": {
                  bgcolor: gruvbox.outputHoverBackground,
                },
              }}
            >
              {line.text}
            </Box>
          ))}
        </Box>
      </Box>

      {topOfStack !== undefined && (
        <Box
          title={topOfStack}
          {...longPressSelect}
          sx={{
            ...contentPadding,
            flexShrink: 0,
            minWidth: 0,
            maxWidth: "100%",
            color: gruvbox.outputStackPreviewForeground,
            fontFamily: monospaceFontFamily,
            userSelect: "text",
            WebkitUserSelect: "text",
            borderTop: `1px solid ${gruvbox.outputHoverBackground}`,
          }}
        >
          <Box
            component="span"
            sx={{
              display: "block",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {formatStackPreview(topOfStack)}
          </Box>
        </Box>
      )}
    </Box>
  );
};
