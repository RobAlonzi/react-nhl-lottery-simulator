import React from "react";
import OddsTableRow from "./OddsTableRow";
import "./OddsTable.scss";

const OddsTable = ({ teams }) => {
	const rowsArray = teams.map((row, i) => 
		<OddsTableRow key={row.id} {...row} place={i+1} />
	);

	return (
    <div className="row odds table-responsive">
			<div className="col-sm">
				<h2>Odds Chart</h2>
				<table className="table table-striped table-hover">
					<thead>
						<tr>
							<th>#</th>
							<th>Team</th>
							<th>Combos Remaining</th>
						</tr>
					</thead>
					<tbody>
						{rowsArray}
					</tbody>
				</table>
			</div>
    </div>
	);
};

OddsTable.propTypes = { teams: React.PropTypes.array.isRequired };

export default OddsTable;