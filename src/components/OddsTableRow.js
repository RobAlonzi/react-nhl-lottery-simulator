import React from "react";
import "./OddsTableRow.scss";



const OddsTableRow = ({ combos, id, name, percent, place, teamId, winningNumbers, difference, lotteryOver }) => {
	let logoUrl = teamId ? <img src={`https://www-league.nhlstatic.com/builds/site-core/8d679dc125a67f8bf52f63a8cb3e70be14f173e9_1491511772/images/logos/team/current/team-${teamId}-dark.svg`} /> : null;
	
	let changeClass = difference === 0 ? "none" : difference > 0 ? "up" : "down";
	let absDifference = Math.abs(difference);

	let makeRow = () => {
		if(lotteryOver){
			return (
				<tr className="final-row">
				<th scope="row">#{place}</th>
				<td>{logoUrl} <p>{name}</p></td>
				<td className={`change-${changeClass}`}><i className={`ion-arrow-${changeClass}-a`}></i> {absDifference}</td>
				</tr>
			);
		}else{
			return (
				<tr className={combos.length == 0 ? "eliminated" : ""}>
				<th scope="row">{place}</th>
				<td>{logoUrl} {name}</td>
				{combos.length > 0 ?
					<td>
						<span>{combos.length}</span> ({percent}% chance)
						{ winningNumbers ? <span className="wins-with">Wins with: {winningNumbers.join(", ")} </span> : null}
					</td>
				:
					<td>{combos.length}</td>
				}
				</tr>
			);
		}
	};

	return makeRow();
};

// OddsTableRow.propTypes = { 
// 	number: React.PropTypes.number.isRequired,
// };

export default OddsTableRow;

			