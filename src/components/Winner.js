import React from "react";
import PropTypes from "prop-types";
import Card, { CardContent, CardMedia } from 'material-ui/Card';
import Grid from 'material-ui/Grid';
import Icon from 'material-ui/Icon';
import { TableCell, TableRow } from 'material-ui/Table';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';

import BallList from "./BallList";


/**  
 * Component that will build out either a Card component or Table row that will show a team's information
 * in the final draft order table
 * @param {String || null} type - Will be 'card' or null
 * @param {Number} size - For Card components, the size of the card
 * @param {Number} pick - What pick this team has
 * @param {Object} team - The team information
 * @param {Array} winningCombo - For winners, which combo won for them
 * @param {Number} changeInPosition - If they moved up or down
 * @returns {Function}
 * */
const Winner = ({ type, size, pick, team, winningCombo, changeInPosition }) => {
	let changeClass = changeInPosition > 0 ? "arrow_upward" : "arrow_downward";
	// Convert negative numbers to positive
	let absDifference = Math.abs(changeInPosition);
	let logoUrl =`https://www-league.nhlstatic.com/builds/site-core/8d679dc125a67f8bf52f63a8cb3e70be14f173e9_1491511772/images/logos/team/current/team-${team.id}-dark.svg`;
	
	// If we need to make a card
	if(type === 'card'){
		return (
		<Grid key={team.id} item xs={size}>
			<Card className="winnerCard">
				<CardContent className="winnerCard--content">
					<Typography className="winnerCard--pick" gutterBottom variant="headline" component="h2">Pick #{pick}</Typography>
					
					<div className="winnerCard--imageContainer">
						<img src={logoUrl} />
					</div>	
					
					<Typography className="winnerCard--teamName" gutterBottom variant="headline" component="h3">
						{team.name}
						{ absDifference ? <p className={`changeArrow changeArrow--${changeClass}`}>(<Icon>{changeClass}</Icon> {absDifference})</p> : null }
					</Typography>

					<BallList balls={winningCombo} style="small"/>
				</CardContent>
			</Card>
		</Grid> 
		);
	// It's a Table row, not a card	
	} else{
		return (
		<TableRow key={team.id}>
			<TableCell component="th" scope="row">{pick}</TableCell>
			<TableCell className="orderTable--nameCell"><img src={logoUrl} /> <p>{ team.name }</p> </TableCell>
			<TableCell>{ absDifference ? <p className={`changeArrow changeArrow--${changeClass}`}>(<Icon>{changeClass}</Icon> {absDifference})</p> : null }</TableCell>
		</TableRow>
		);
	}
};

Winner.propTypes = { 
	pick: PropTypes.number.isRequired,
	team: PropTypes.object.isRequired,
	winningCombo: PropTypes.array.isRequired,
	changeInPosition: PropTypes.number.isRequired
};

export default Winner;