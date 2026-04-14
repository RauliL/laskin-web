import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";

import "./index.sass";

import { App } from "./components";
import { createContext } from "./context";
import { createStore } from "./store";

const context = createContext();
const store = createStore();
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App context={context} />
    </Provider>
  </React.StrictMode>
);
