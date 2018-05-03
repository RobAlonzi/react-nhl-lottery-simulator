import React from "react";
import PropTypes from "prop-types";
import Card, { CardContent, CardMedia } from 'material-ui/Card';
import Grid from 'material-ui/Grid';
import Icon from 'material-ui/Icon';
import { TableCell, TableRow } from 'material-ui/Table';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';

import BallList from "./BallList";

const Winner = ({ type, size, pick, team, winningCombo, changeInPosition }) => {
	let changeClass = changeInPosition > 0 ? "arrow_upward" : "arrow_downward";
	let absDifference = Math.abs(changeInPosition);
	let logoUrl =`https://www-league.nhlstatic.com/builds/site-core/8d679dc125a67f8bf52f63a8cb3e70be14f173e9_1491511772/images/logos/team/current/team-${team.id}-dark.svg`;
	
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






// <div className="winning-team">
// 			<h2>Pick #{pick}</h2>
// 			<p><img src={logoUrl} /> {team.name} <span className={`change-${changeClass}`}>(<i className={`fa fa-arrow-${changeClass}`}></i> {absDifference})</span></p>
// 			<BallList balls={winningCombo} style="small"/>
// 		</div>