import React, { Component } from "react";
import moment from "moment";
import { connect } from "react-redux";
import Grid from 'material-ui/Grid';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import Snackbar from 'material-ui/Snackbar';
import Hidden from 'material-ui/Hidden';

import { setupLottery } from "../actions/setup";
import Utility from "../helpers/Utility";
import { resetLottery, startRound, drawBall } from "../actions/lottery";
import "./App.scss";

import BallList from "../components/BallList";
import DraftOrder from "../components/DraftOrder";
import OddsTable from "../components/OddsTable";

class App extends Component{

	componentDidMount(){
		// Setup the lottery on mount
		this.props.setupLottery();
	}

	render(){
		let { teams, round, winners, draftComplete } = this.props.lottery;
		return (
			<Grid container spacing={0}>
				<AppBar position="static" justify="space-between" className="appHeader">
					<Toolbar className="appHeader--content">
						<Typography variant="title" color="inherit" component="h1">
							2018 NHL Lottery Simulator
						</Typography>
						<Button onClick={this.props.resetLottery} variant="raised" color="secondary">Reset</Button>
					</Toolbar>
				</AppBar>
				<Grid item xs={12} lg={6} className="appDetails appDetails--gitHub">
					<Typography component="p" variant="title" color="inherit">
					Made by <a href="http://www.robalonzi.com" target="_blank">Rob Alonzi </a>. 
					Find me on <a href="https://github.com/RobAlonzi" target="_blank"><img className="githubLogo" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACoklEQVQ4T32TXUhUQRTH/2furrrr3jJJeshC83pNAiu0uwgFIghKQUG9RlCQGRGBRPbUY/RBRT24hNRLgVAEUYg+FNFDuqs+RJnrerWPB0OirJ3dza87J+5eUzNxnubMzP83Z/5zDmHFCBo1uzVNNCvl1AvStrrbSuGzpuGlw4ikE7G3yyW0GBTXBvTg3B0m0UDMt0H8XI6U2qj7RvqENMC+A0R8lgldciZ4Dp9eTbtaD5AVz/cANK6nnNMTE4OZlZm58aaqqvzMdCAC4i1yJtjoQrIA3azpAOCXiYFjhUZ43Q87mlwNsGFb9fqp8cFfoXLrgRCQyZFYC7lv9gnxNJRytrs360Z4GEKlAXqiGGUuSBDGCDjCin3S7q8q2lEXmp6TcQVtP+kVVgQKY3I0ds09HDQtW4Mn/G8oiks7WullHb5IQDHll1cniH2HUnb0g25a+wC8XlW8sEiKapN2tC/ftHYKRZ2kG9aMzE3rGBqa1c09bQBdXgsAoFUmYjc8Q/O+/wMIlVvNRIisCWA6Lkej9xcB+YY1Qn51ODU88D5g1m7WyEkQI7gaxFFIkUNG+mN0MltwAg9pXYXVzkxf5GzgZiiQMjBPhSBcIZDlfsACSDlAnyb4vIz3v3HXQqZ1CcBG8szgLj9E5ZxQbVDolXb/M90MXwe4NQtgdVWODlz4m1VBya4CJ8cXV8Lf4BVShRUhhwoCwd8nMpncXsWUI0iVQQjfgqhbJmJNC3Ohm+FHpNTXpN1/xivlkro8PTfTTYxJ+LUWnp8rghIdIOzNJsDoSY3GGr2bc+4BqkCqn02w7ZmlZvIgt8A4yKB2BT6qAYYLUA5GNA2dDHWKFD1OYqrVFS810zLLXU800ElWqIfgUm9LjTPECxba3XS8993yH/oDcTgiiDDH21UAAAAASUVORK5CYII="/></a>
					</Typography>
				</Grid>
				<Grid item xs={12} lg={6} className="appDetails appDetails--lastRan">
					<Typography component="p" variant="title" color="inherit">
						Draft Last Ran: {
							Utility.getLastRan() ? moment.unix(Utility.getLastRan()).format("MMM Do YYYY @ h:mm A") : "Never"
						}
					</Typography>
				</Grid>


				{ draftComplete ? null :  
				<Grid container spacing={0} justify={'center'} className="buttonContainer">
					<Grid item>
						<Button 
							onClick={this.props.lottery.round.inProgress ? this.props.drawBall : this.props.startRound} 
							variant="raised" 
							color="primary">
							{ this.props.lottery.round.inProgress ? "Draw Ball" : "Start Round" }
						</Button>
					</Grid>
				</Grid> }

				<Grid container spacing={0} justify={'space-around'}>
					{ draftComplete ? null :
					<Grid item xs={12} lg={4}>
						<Grid item xs={12}>
							<BallList balls={round.ballsDrawn}/>
						</Grid>

						<Hidden smUp>
							<Grid item xs={12} lg={4}>
								<DraftOrder order={winners} />
							</Grid>						
						</Hidden>


						<Grid item xs={12}>
							<OddsTable teams={teams} inProgress={this.props.lottery.round.inProgress}/>
						</Grid>	

						
					</Grid> }
					<Grid item xs={12} lg={4}>
						{ draftComplete ?
						<Toolbar>
							<Typography className="draftOrder--title" variant="title" color="inherit" component="h1">
								Final Order
							</Typography>
						</Toolbar>	
						: null}
						<DraftOrder order={winners} />
					</Grid>
				</Grid>
				<Snackbar 
					open={ round.isRedrawWinner }
					anchorOrigin={{
						vertical: 'bottom',
						horizontal: 'right',
					}}
					SnackbarContentProps={{
						className: 'main-snackbar',
					  }}
					message={<span id="message-id">Redraw combo has been selected. Please start the round over.</span>}
				/>
			</Grid>
		);
	}
}

function mapStateToProps(state){
	return {
		lottery: state.lottery
	}
}

export default connect(mapStateToProps, { setupLottery, resetLottery, startRound, drawBall })(App);
