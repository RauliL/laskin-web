import React, { FunctionComponent } from "react";
import { useSelector } from "react-redux";

import "./OutputBuffer.sass";

import { Line, State } from "../store";

export const OutputBuffer: FunctionComponent = () => {
  const lines = useSelector<State, Line[]>((state) => state.lines);

  return (
    <ul className="OutputBuffer">
      {lines.map((line, index) => (
        <li key={index} className={line.type}>
          {line.text}
        </li>
      ))}
    </ul>
  );
};
