import React from "react";
import PropTypes from "prop-types";

/**  
 * Component that will create a ping pong style looking ball
 * @param {Number} number - The number the ball should have on it
 * @param {String} style - Adds a default or small class to the ball for CSS purposes
 * @returns {Function}
 * */
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

