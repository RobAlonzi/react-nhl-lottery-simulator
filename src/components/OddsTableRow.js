import React from "react";
import "./OddsTableRow.scss";

const OddsTableRow = ({ combos, id, name, percent, place }) => {
	return (
		<tr>
			<th scope="row">{place}</th>
			<td>{name}</td>
			<td>{combos.length} ({percent}% chance) </td>
		</tr>
	);
};

// OddsTableRow.propTypes = { 
// 	number: React.PropTypes.number.isRequired,
// };

export default OddsTableRow;

