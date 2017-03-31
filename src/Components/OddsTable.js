import React from "react";
import OddsTableRow from "./OddsTableRow";
import "./OddsTable.scss";

const OddsTable = ({ rows }) => {
	// const rowsArray = rows.map(winner => 
	// 	<Winner key={winner.pick} pick={winner.pick} team={winner.team} winningCombo={winner.winningCombo} changeInPosition={winner.changeInPosition} /> 
	// );

	return (
    <div className="row winner-list">
		Table!
    </div>
	);
};

OddsTable.propTypes = { row: React.PropTypes.array.isRequired };

export default OddsTable;