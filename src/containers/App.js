import React, { Component } from "react";
import moment from "moment";
import * as API from "../api/LotteryAPI";
import "./App.scss";

import BallList from "../components/BallList";
import WinnerList from "../components/WinnerList";
import OddsTable from "../components/OddsTable";

const lowestNumberToDraw = 1,
	highestNumberToDraw = 14,
	ballsDrawnPerRound = 4;

const numbersAvailable = Object.freeze(API.generateAvailableNumbers(lowestNumberToDraw, highestNumberToDraw)),
	allCombos = Object.freeze(API.getAllCombos(numbersAvailable, ballsDrawnPerRound)),
	teamsStart = Object.freeze(API.generateTeamsAndCombos(allCombos));


class App extends Component{
	
	constructor() {
		super();
		this.state = {
			currentRound: undefined,
			numberOfRounds: undefined,
			ballsPerRound: undefined,
			roundInProgress : undefined,
			replayLastRound: undefined,
			lotteryOver: undefined,
			numbersAvailable: [],
			numbersPicked: [],
			winners: [],
			teams: [],
			lastRan: undefined
		};

		//binding functions
		this.handleReset = this.handleReset.bind(this);
		this.handleDrawBall = this.handleDrawBall.bind(this);
		this.handleStartRound = this.handleStartRound.bind(this);
		this.handleEndRound = this.handleEndRound.bind(this);
		this.handleEndLottery = this.handleEndLottery.bind(this);
	}

	componentDidMount(){
		this.setState({
			currentRound: 1,
			numberOfRounds: 3,
			ballsPerRound: 4,
			roundInProgress : true,
			replayLastRound: false,
			lotteryOver: false,
			numbersAvailable,
			teams: JSON.parse(JSON.stringify(teamsStart)),
			lastRan: API.getLastRan()
		});
	}

	handleReset(){
		this.setState({
			currentRound: 1,
			roundInProgress: true,
			lotteryOver: false,
			replayLastRound: false,
			numbersAvailable,
			numbersPicked : [],
			winners: [],
			teams: JSON.parse(JSON.stringify(teamsStart))
		});
	}

	handleDrawBall(){
		let { numbersPicked, numbersAvailable, teams } = this.state;

		numbersPicked.push(API.drawNewBall(numbersAvailable, numbersPicked));

		this.setState({
			numbersPicked
		});

		let updTeamPcts = API.recalculateOdds(teams, numbersPicked);
		if(this.state.numbersPicked.length === this.state.ballsPerRound - 1){
			updTeamPcts = API.showWinningNumbers(updTeamPcts, numbersPicked);
		}

		this.setState({
			teams:updTeamPcts
		});


		if(this.state.numbersPicked.length === this.state.ballsPerRound){
			this.handleEndRound();
		}
	}

	handleStartRound(){
		let { currentRound, winners, replayLastRound } = this.state;
		let updatedTeams = API.removeWinningTeamsFromLottery(JSON.parse(JSON.stringify(teamsStart)), winners);
		updatedTeams = API.recalculateOdds(updatedTeams, []);

		this.setState({
			roundInProgress: true,
			currentRound: replayLastRound ? currentRound : ++currentRound,
			numbersPicked: [],
			teams: updatedTeams,
			replayLastRound: false
		});
	}

	handleEndRound(){
		let { numbersPicked, teams, winners, currentRound, numberOfRounds } = this.state;
		let winningTeam = API.findWinner(teams, numbersPicked);

		if(winningTeam.id === "rdw"){
			this.setState({
				roundInProgress: false,
				replayLastRound: true
			});

			return;
		}

		
		this.setState({
			winners:[
				...winners,
				{
					id: winningTeam.id,
					pick: currentRound,
					teamId: winningTeam.teamId,
					team: winningTeam.name,
					winningCombo: winningTeam.winningCombo,
					changeInPosition: API.findChangeInPosition(winningTeam, JSON.parse(JSON.stringify(teamsStart)), currentRound)
				}
			],
			roundInProgress: false
		}, () => {

			if(currentRound === numberOfRounds){
				this.handleEndLottery();
				return;
			}

		});
	}

	handleEndLottery(){
		let {winners} = this.state;

		let finalTeams = API.revealFinalDraftOrder(JSON.parse(JSON.stringify(teamsStart)), winners);
		let lastRan = API.setLastRan(moment().unix());

		this.setState({
			teams: finalTeams,
			lotteryOver: true,
			lastRan
		});


	}

	render(){
		let { roundInProgress, numbersPicked, winners, teams, replayLastRound, lotteryOver, lastRan } = this.state;
		return (
			<div>
				<span className="last-ran">Lottery last ran: {lastRan ? moment.unix(lastRan).format("MMM Do YYYY @ h:mm A") : "never"}</span>
				<div className="container">
					{ replayLastRound ? <p className="alert alert-danger">Redraw combo has been selected. Please start the round over.</p> : null }
					{ numbersPicked.length > 0 ? <BallList balls={numbersPicked}/> : null }
					<div className="row buttons">
						<div className="col-sm">
							{ !roundInProgress && !lotteryOver ? <button type="button" id="start-btn" className="btn btn-lg btn-primary hidden" onClick={this.handleStartRound}>Start Round</button> : null }
							{ roundInProgress ? <button type="button" id="draw-btn" className="btn btn-lg btn-primary" onClick={this.handleDrawBall}>Draw Ball</button> : null }
							<button type="button" id="reset-btn" className="btn btn-lg btn-primary" onClick={this.handleReset}>Reset</button>
						</div>
					</div>
					{ lotteryOver ? <h2 className="draft-order">Draft Order:</h2> : null }
					{ winners.length > 0 ? <WinnerList winners={winners} /> : null } 
					<OddsTable teams={teams}  lotteryOver={lotteryOver}/>
				</div>
			</div>
		);
	}
}

export default App;
