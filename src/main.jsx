import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import Selector from "./selector.jsx";
import "./index.css";

const RouteWrapper = () => {
  const path = window.location.pathname.split("/");

  if (path.length > 1 && path[1] === "selector") {
    return <Selector />;
  }

  return <App />;
};

ReactDOM.createRoot(document.getElementById("root")).render(<RouteWrapper />);
