import React from "react";
import PropTypes from "prop-types";
import Grid from 'material-ui/Grid';

import Ball from "./Ball";

/**  
 * Component that will hold a list of balls selected
 * @param {Array} balls - The array of balls selected
 * @param {String} style - Adds a default or small class to the ball for CSS purposes
 * @returns {Function}
 * */
const BallList = ({ balls, style = "default" }) => {
	const ballsArray = balls.map(ball => {
		return (
			<Grid key={ball} item xs={3}>
				<Ball number={ball} style={style} />
			</Grid>
		)
	});

	return (
		<Grid container spacing={24}>
			{ballsArray}
		</Grid>
	);
};

BallList.propTypes = { 
	balls: PropTypes.array.isRequired, 
	style: PropTypes.string 
};

export default BallList;