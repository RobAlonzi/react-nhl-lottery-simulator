import React from "react";
import BallList from "./BallList";
import "./Winner.scss";

const Winner = ({ pick, team, winningCombo, changeInPosition, teamId }) => {
	let changeClass = changeInPosition === 0 ? "none" : changeInPosition > 0 ? "up" : "down";
	let absDifference = Math.abs(changeInPosition);


	let logoUrl =`https://www-league.nhlstatic.com/builds/site-core/8d679dc125a67f8bf52f63a8cb3e70be14f173e9_1491511772/images/logos/team/current/team-${teamId}-dark.svg`;
	return (
		<div className="col-sm-4">
			<div className="col-sm-12 winning-team">
				<h2>Pick #{pick}</h2>
				<p><img src={logoUrl} /> {team} <span className={`change-${changeClass}`}>(<i className={`ion-arrow-${changeClass}-a`}></i> {absDifference})</span></p>
				<BallList balls={winningCombo} style="small"/>
			</div>
		</div>
	);
};

Winner.propTypes = { 
	pick: React.PropTypes.number.isRequired,
	team: React.PropTypes.string.isRequired,
	winningCombo: React.PropTypes.array.isRequired,
	changeInPosition: React.PropTypes.number.isRequired,
	teamId: React.PropTypes.number.isRequired
};

export default Winner;
