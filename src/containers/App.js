import React, { Component } from "react";
import * as Utils from "../utilities/index";
import "./App.scss";

import BallList from "../components/BallList";
import WinnerList from "../components/WinnerList";
import OddsTable from "../components/OddsTable";

class App extends Component{

	constructor() {
		super();
		this.state = {
			currentRound: undefined,
			numberOfRounds: undefined,
			roundInProgress : false,
			lowestNumberToDraw: 1,
			highestNumberToDraw: 14,
			ballsDrawnPerRound: 4,
			numbersAvailable: [],
			numbersPicked: [],
			winners: [
				// {
				// 	pick: 1,
				// 	team: "Detroit Red Wings",
				// 	winningCombo : [10, 11, 12, 13],
				// 	changeInPosition: 8
				// },
				// {
				// 	pick: 2,
				// 	team: "New Jersey Devils",
				// 	winningCombo : [3, 7, 9, 13],
				// 	changeInPosition: 6
				// },
				// {
				// 	pick: 3,
				// 	team: "San Jose Sharks",
				// 	winningCombo : [1, 3, 9, 12],
				// 	changeInPosition: -2
				// }
			],
			teams: []
		};
	}

	componentDidMount(){
		let {lowestNumberToDraw, highestNumberToDraw, ballsDrawnPerRound} = this.state;

		let numbersAvailable = Utils.generateAvailableNumbers(lowestNumberToDraw, highestNumberToDraw);
		let allCombos = Utils.getAllCombos(numbersAvailable, ballsDrawnPerRound);
		let teams = Utils.generateTeamsAndCombos(allCombos);

		this.setState({
			currentRound: 1,
			numberOfRounds: 3,
			roundInProgress : true,
			numbersAvailable,
			teams
		});
	}

	render(){
		let { roundInProgress, numbersPicked, winners, teams } = this.state;
		return (
			<div className="container">
				{ numbersPicked.length > 0 ? <BallList balls={numbersPicked}/> : null }
				<div className="row buttons">
					<div className="col-sm">
						{ !roundInProgress ? <button type="button" id="start-btn" className="btn btn-lg btn-primary hidden">Start Round</button> : null }
						{ roundInProgress ? <button type="button" id="draw-btn" className="btn btn-lg btn-primary">Draw Ball</button> : null }
						<button type="button" id="reset-btn" className="btn btn-lg btn-primary">Reset</button>
					</div>
				</div>
				{ winners.length > 0 ? <WinnerList winners={winners} /> : null } 
				<OddsTable teams={teams}  />
			</div>
		);
	}
}

export default App;
