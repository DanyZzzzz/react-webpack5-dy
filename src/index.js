import React from "react";
import ReactDOM from "react-dom";
import "@style/index.less";
import App from "./App";
import { ReduxProvider } from "@/Component/Redux/index";
import { modules } from "@/module/index";
ReactDOM.render(
  <ReduxProvider value={modules}>
    <App />
  </ReduxProvider>,
  document.getElementById("root")
);
if (module.hot) {
  module.hot.accept();
}
