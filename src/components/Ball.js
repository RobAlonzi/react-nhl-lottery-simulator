import React from "react";
import "./Ball.scss";

const Ball = ({ number, style }) => {
	return (
		<div className={`ball ball-${style}`}>
			<span>{number}</span>
		</div>
	);
};

Ball.propTypes = { 
	number: React.PropTypes.number.isRequired,
	style: React.PropTypes.string
};

export default Ball;

