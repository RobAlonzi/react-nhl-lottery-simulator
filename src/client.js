import React from "react";
import ReactDOM from "react-dom";
import { Route, Router, IndexRoute, hashHistory } from "react-router";

import App from "./Containers/App";
import "./client.scss";


ReactDOM.render(
	<App />,
	document.getElementById('root')
);