import { LaskinUIAction, State } from "./types";

const initialState: State = {
  lines: [],
  stack: [],
};

export const reducer = (
  state: State | undefined = initialState,
  action: LaskinUIAction
): State => {
  switch (action.type) {
    case "ADD_LINE":
      return {
        ...state,
        lines: [...state.lines, action.line],
      };

    case "CLEAR_ALL_LINES":
      return {
        ...state,
        lines: [],
      };

    case "UPDATE_STACK": {
      return {
        ...state,
        stack: action.stack,
      };
    }
  }

  return state;
};
