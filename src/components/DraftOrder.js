import React from "react";
import PropTypes from "prop-types";

import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import Grid from 'material-ui/Grid';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';

import Winner from "./Winner";

const DraftOrder = ({ order }) => {

	// The top three picks 
	const winnerCards = order.slice(0, 3).map((item, i) => {
		const size = i === 0 ? 12 : 6;

		return ( 
			<Winner key={item.team.id} type='card' size={size} {...item} />
		);
	});

	const remaining = order.slice(3).map((item, i) => {
		return ( 
			<Winner key={item.team.id} {...item} />
		);
	});

	return (
		<Grid container spacing={0} justify={'space-between'}>
			<Grid item xs={12}>
			
				<Grid container spacing={0} justify={'space-between'}>
					{winnerCards}
				</Grid>

				<Table className="orderTable">
					<TableBody>
						{remaining}
					</TableBody>
				</Table>
			</Grid>
		</Grid>
	);
};

DraftOrder.propTypes = { order: PropTypes.array.isRequired };

export default DraftOrder;