import React, { Component } from "react";
import "./App.scss";

import BallList from "../Components/BallList";
import WinnerList from "../Components/WinnerList";
import OddsTable from "../Components/OddsTable";

class App extends Component{

	constructor() {
		super();
		this.state = {
			ballsPickedThisRound: [0, 1, 2, 3],
			winners: [
				{
					pick: 1,
					team: "Detroit Red Wings",
					winningCombo : [10, 11, 12, 13],
					changeInPosition: 8
				},
				{
					pick: 2,
					team: "New Jersey Devils",
					winningCombo : [3, 7, 9, 13],
					changeInPosition: 6
				},
				{
					pick: 3,
					team: "San Jose Sharks",
					winningCombo : [1, 3, 9, 12],
					changeInPosition: -2
				}
			],
			odds: [
				
			]
		};
	}

	componentDidMount(){
		console.log("Hello");
	}

	render(){
		let { ballsPickedThisRound, winners, odds } = this.state;
		return (
			<div>
				<BallList balls={ballsPickedThisRound}/>
				<div className="row buttons">
					<button type="button" id="start-btn" className="btn btn-lg btn-primary hidden">Start Round</button>
					<button type="button" id="draw-btn" className="btn btn-lg btn-primary">Draw Ball</button>
					<button type="button" id="reset-btn" className="btn btn-lg btn-primary">Reset</button>
				</div>
				<WinnerList winners={winners} />
				<OddsTable rows={odds} />
			</div>
		);
	}
}

export default App;
