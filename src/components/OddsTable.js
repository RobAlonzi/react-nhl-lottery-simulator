import React from "react";
import PropTypes from "prop-types";
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import Grid from 'material-ui/Grid';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';

/**  
 * Component that will build out an odds table
 * @param {Object[]} teams - The array of team information
 * @param {Boolean} inProgress - If the round is currently in progress
 * @returns {Function}
 * */
const OddsTable = ({ teams, inProgress }) => {

	// Create the table rows
	const rows = teams.map((team, i) => {
		let logo = team.id !== 'rdw' ? <img src={`https://www-league.nhlstatic.com/builds/site-core/8d679dc125a67f8bf52f63a8cb3e70be14f173e9_1491511772/images/logos/team/current/team-${team.id}-dark.svg`} /> : null;

		return ( 
			<TableRow className={`${!team.combos.length ? 'oddsTable--noCombos': null}`} key={team.id}>
				<TableCell numeric={true} component="th" scope="row">{i + 1}</TableCell>
				<TableCell className="oddsTable--nameCell">{ logo } <p>{ team.name }</p> </TableCell>
				<TableCell className={`oddsTable--combosCell`}>
					<span>{team.combos.length}</span> { team.combos.length ? `(${team.updatedPct}% chance)` : null }
					{ inProgress && team.winsWith && team.winsWith.length ? <p className="oddsTable--winsWith">Wins with: {team.winsWith.join(", ")} </p> : null}
				</TableCell>
			</TableRow>
		);
	});
	

	return (
		<Grid container spacing={0} justify={'space-between'}>
			<Grid item xs={12}>
				<Toolbar>
					<Typography variant="title" color="inherit">
						Odds
					</Typography>
				</Toolbar>
				<Table className="oddsTable">
					<TableHead>
						<TableRow>
							<TableCell numeric={true}>#</TableCell>
							<TableCell>Team</TableCell>
							<TableCell>Combos Remaining</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{ rows }
					</TableBody>
				</Table>
			</Grid>
		</Grid>
	);
};

OddsTable.propTypes = { 
	teams: PropTypes.array.isRequired,
	inProgress: PropTypes.bool.isRequired
};

export default OddsTable;