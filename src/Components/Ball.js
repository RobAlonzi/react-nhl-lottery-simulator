import React from "react";
import "./Ball.scss";

const Ball = ({ number }) => {
	return (
		<div className="col-xs-12 col-md-6 col-lg-3">
			<div className="ball">
				<span>{number}</span>
			</div>
		</div>
	);
};

Ball.propTypes = { 
	number: React.PropTypes.number.isRequired,
};

export default Ball;

