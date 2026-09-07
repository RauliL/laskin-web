import { Dispatch } from "@reduxjs/toolkit";
import { LaskinContext } from "laskin";
import React, { FunctionComponent } from "react";
import { useDispatch } from "react-redux";

import { LaskinUIAction } from "../store";
import { InputBuffer } from "./InputBuffer";
import { OutputBuffer } from "./OutputBuffer";
import { StackDisplay } from "./StackDisplay";

import "./App.sass";

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

  const handleInput = (text: string) =>
    new Promise<void>((resolve, reject) => {
      dispatch({ type: "ADD_LINE", line: { type: "input", text } });

      try {
        handleOutput(context.run(text));
        resolve();
      } catch (err) {
        dispatch({ type: "ADD_LINE", line: { type: "error", text: `${err}` } });
        reject(err);
      } finally {
        dispatch({
          type: "UPDATE_STACK",
          stack: Array.from(context).map(String),
        });
      }
    });

  return (
    <div className="App">
      <h1>🧮 Laskin</h1>
      <div className="main">
        <OutputBuffer />
        <InputBuffer onInput={handleInput} />
      </div>
      <StackDisplay />
    </div>
  );
};
