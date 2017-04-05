import React from "react";
import "./BallList.scss";

import Ball from "./Ball";

const BallList = ({ balls, style = "default" }) => {
	const ballsArray = balls.map(ball => <Ball key={ball} number={ball} style={style} /> );

	return (
    <div className="row lottery-balls">
      {ballsArray}
    </div>
	);
};

BallList.propTypes = { balls: React.PropTypes.array.isRequired };

export default BallList;