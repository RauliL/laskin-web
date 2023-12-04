import { Action } from "@reduxjs/toolkit";

export type LineType = "error" | "input" | "output";

export type Line = {
  text: string;
  type: LineType;
};

export type State = Readonly<{
  lines: Line[];
  stack: string[];
}>;

export type AddLineAction = Action<"ADD_LINE"> & { line: Line };

export type ClearAllLinesAction = Action<"CLEAR_ALL_LINES">;

export type UpdateStackAction = Action<"UPDATE_STACK"> & { stack: string[] };

export type LaskinUIAction =
  | AddLineAction
  | ClearAllLinesAction
  | UpdateStackAction;
