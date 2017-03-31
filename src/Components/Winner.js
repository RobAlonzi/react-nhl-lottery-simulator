import React from "react";
import BallList from "./BallList";
import "./Winner.scss";

const Winner = ({ pick, team, winningCombo, changeInPosition }) => {
	return (
		<div className="winning-team">
			<h2>Pick #{pick}</h2>
			<p>{team} <span className="change-up">({changeInPosition})</span></p>
			<BallList balls={winningCombo}/>
		</div>
	);
};

Winner.propTypes = { 
	pick: React.PropTypes.number.isRequired,
	team: React.PropTypes.string.isRequired,
	winningCombo: React.PropTypes.array.isRequired,
	changeInPosition: React.PropTypes.number.isRequired
};

export default Winner;
