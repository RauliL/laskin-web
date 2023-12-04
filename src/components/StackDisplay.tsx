import React, { FunctionComponent } from "react";
import { useSelector } from "react-redux";

import "./StackDisplay.sass";

import { State } from "../store";

export const StackDisplay: FunctionComponent = () => {
  const stack = useSelector<State, string[]>((state) => state.stack);

  return (
    <ul className="StackDisplay">
      {stack.map((value, index) => (
        <li key={index}>{value}</li>
      ))}
    </ul>
  );
};
