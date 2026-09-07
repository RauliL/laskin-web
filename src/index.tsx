import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";

import { App } from "./components";
import { createContext } from "./context";
import { createStore } from "./store";
import { theme } from "./theme";

const context = await createContext();
const store = createStore();
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);

root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Provider store={store}>
        <App context={context} />
      </Provider>
    </ThemeProvider>
  </React.StrictMode>,
);
