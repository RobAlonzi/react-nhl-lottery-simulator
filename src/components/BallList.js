import React from "react";
import PropTypes from "prop-types";
import Grid from 'material-ui/Grid';

import Ball from "./Ball";


const BallList = ({ balls, style = "default" }) => {
	const ballsArray = balls.map(ball => {
		return (
			<Grid key={ball} item xs={6} sm={3}>
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