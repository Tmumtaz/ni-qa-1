import React from "react";
import ReactDOM from "react-dom";
import reportWebVitals from "./reportWebVitals";
import App from "./App";
import { ThemeProvider } from "@material-ui/core/styles";
import theme from "./theme";
import CssBaseline from "@material-ui/core/CssBaseline";
import { Router } from "react-router-dom";
import { createBrowserHistory } from "history";

const history = createBrowserHistory();

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router history={history}>
        <App />
      </Router>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
