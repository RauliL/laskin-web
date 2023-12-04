import { configureStore } from "@reduxjs/toolkit";

import { reducer } from "./reducer";
import { LaskinUIAction, State } from "./types";

export * from "./types";

export const createStore = () =>
  configureStore<State, LaskinUIAction>({ reducer });
