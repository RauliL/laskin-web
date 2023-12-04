import { Dispatch } from "@reduxjs/toolkit";
import React, { FunctionComponent, KeyboardEvent, useRef } from "react";
import { useDispatch } from "react-redux";
import { LaskinUIAction } from "../store";

import "./InputBuffer.sass";

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
            input.scrollIntoView();
          });
      }
    } else if (ev.key === "l" && ev.ctrlKey) {
      ev.preventDefault();
      dispatch({ type: "CLEAR_ALL_LINES" });
    }
  };

  return (
    <input ref={inputRef} className="InputBuffer" onKeyDown={handleKeyDown} />
  );
};
