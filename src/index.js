import React from "react";
import ReactDOM from "react-dom";
import "mapbox-gl/dist/mapbox-gl.css";
import "./theme/index.css";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";

ReactDOM.render(<App />, document.getElementById("root"));
//registerServiceWorker()
