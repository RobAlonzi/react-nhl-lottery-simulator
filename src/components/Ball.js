import React from "react";
import PropTypes from "prop-types";

const Ball = ({ number, style }) => {
	return (
		<div className={`ball ball-${style}`}>
			<span>{number}</span>
		</div>
	);
};

Ball.propTypes = { 
	number: PropTypes.number.isRequired,
	style: PropTypes.string
};

export default Ball;

