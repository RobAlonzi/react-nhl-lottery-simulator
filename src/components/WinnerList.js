import React from "react";
import Winner from "./Winner";
import "./WinnerList.scss";

const WinnerList = ({ winners }) => {
	const winnersArray = winners.map(winner => 
		<Winner key={winner.pick} pick={winner.pick} team={winner.team} winningCombo={winner.winningCombo} changeInPosition={winner.changeInPosition} /> 
	);

	return (
    <div className="row winner-list">
		{winnersArray}
    </div>
	);
};

WinnerList.propTypes = { winners: React.PropTypes.array.isRequired };

export default WinnerList;