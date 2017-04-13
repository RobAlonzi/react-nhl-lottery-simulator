import React from "react";
import OddsTableRow from "./OddsTableRow";
import "./OddsTable.scss";

const OddsTable = ({ teams, lotteryOver }) => {
	let place = lotteryOver ? 4 : 1;

	const rowsArray = teams.map((row, i) => 
		<OddsTableRow key={row.id} {...row} place={i+place} lotteryOver={lotteryOver}/>
	);
	

	return (
    <div className="row odds">
			<div className="col-sm">
				{ lotteryOver ? null : <h2>Odds Chart</h2> }
				<table className="table table-striped table-hover">
					<thead>
						{ lotteryOver ? null :
						<tr>
							<th>#</th>
							<th>Team</th>
							<th>Combos Remaining</th>
						</tr>
						}
					</thead>
					<tbody>
						{rowsArray}
					</tbody>
				</table>
			</div>
    </div>
	);
};

OddsTable.propTypes = { 
	teams: React.PropTypes.array.isRequired,
	lotteryOver: React.PropTypes.bool.isRequired
};

export default OddsTable;