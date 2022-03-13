import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { StateProvider } from "./store";
//SUB COMPONENTS
import App from "./App";
//Initialize PSMH, StorageService, Firebase
import "./init";

import "./assets/icons/remixicon/remixicon.css";
import "./assets/less/rq-theme.less";
import "./styles/theme.dark.less";
import "./styles/theme.light.less";
import "./styles/custom/custom.css";
import "./styles/custom/custom.scss";

ReactDOM.render(
  <StateProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StateProvider>,
  document.getElementById("root")
);
