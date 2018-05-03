import moment from "moment";

import config from "../config";
import Lottery from "../helpers/Lottery";
import Utility from "../helpers/Utility";
import { 
	LOTTERY_UPDATE_TEAM_LIST, 
	LOTTERY_START_NEW_ROUND, 
	LOTTERY_ADD_BALL, 
	LOTTERY_SET_ROUND_WINNER,
	LOTTERY_SET_ROUND_NOT_IN_PROGRESS,
	LOTTERY_RESET,
	LOTTERY_SET_REDRAW_ROUND,
	LOTTERY_END,
	LOTTERY_SET_REMAINING_ORDER
} from "./types";

function setRedrawRound(){
	return {
		type: LOTTERY_SET_REDRAW_ROUND
	}
}

function setRound(round){
	return {
		type: LOTTERY_START_NEW_ROUND,
		payload: round
	}
}

function handleResetLottery(){
	return {
		type: LOTTERY_RESET
	}
}

function setRoundWinner(options){
	return {
		type: LOTTERY_SET_ROUND_WINNER,
		payload: options
	}
}

function addBallToDrawnBallList(ball){
	return {
		type: LOTTERY_ADD_BALL,
		payload: ball
	}
}

function setRoundNotInProgress(){
	return {
		type: LOTTERY_SET_ROUND_NOT_IN_PROGRESS
	}
}

function endLottery(){
	return {
		type: LOTTERY_END
	}
}

function setRemainingOrder(remainingOrder){
	return {
		type: LOTTERY_SET_REMAINING_ORDER,
		payload: remainingOrder
	}
}

export function updateTeamList(teams){
	return {
		type: LOTTERY_UPDATE_TEAM_LIST,
		payload: teams
	}
}


export function startRound(){
	return (dispatch, getState) => {

		const { setup, lottery } = getState();
		const isNewRound = !lottery.round.isRedrawWinner;
		const round = {
			id: isNewRound ? ++lottery.round.id : lottery.round.id,
			inProgress: true,
			ballsDrawn: [],
			isRedrawWinner: false
		};

		// Map over the team list, placing their losing combos back into their winning combo list
		let teams = lottery.teams.map(team => {

			delete team.winsWith;

			return {
				...team,
				combos: [...team.combos, ...team.losingCombos],
				losingCombos: []
			}
		});

		// If it's a new round, we have to do some extra logic
		if(isNewRound){
			// Take out the winner and the redraw combo from the teams array
			const winner = teams.shift();
			const redraw = teams.pop();

			// Add the redraw value back in, with the updated combos
			teams.push({
				...redraw,
				combos: [...winner.combos, ...redraw.combos]
			});
		}

		// Recalculate the odds, sort the teams, and update the teams in the store
		teams = Lottery.recalculateOdds(teams, []);
		dispatch(updateTeamList(teams));

		// Start the new round. 
		dispatch(setRound(round));
	}
}

export function drawBall(){

	return (dispatch, getState) => {

		const { setup, lottery } = getState();

		// Draw new ball, passing in already picked numbers
		const ball = Lottery.drawBall(setup.ballRange, lottery.round.ballsDrawn);
		// Dispatch that
		dispatch(addBallToDrawnBallList(ball));

		const updatedBallsDrawn = [...lottery.round.ballsDrawn, ball ];

		// Recalculate odds
		let teams = Lottery.recalculateOdds(lottery.teams, updatedBallsDrawn);

		// If one more ball is left, show 'wins with' column
		if(updatedBallsDrawn.length === config.ballsDrawnPerRound - 1){

			// Add winsWith row
			teams = teams.map(team => {
				return {
					...team,
					winsWith: Lottery.showWinningNumbers(team.combos, updatedBallsDrawn)
				}
			});

		}
		// End round if pulled enough balls, should only have one by now
		else if(updatedBallsDrawn.length === config.ballsDrawnPerRound){


			// Redraw team won. Uh oh :(
			if(teams[0].id === 'rdw'){
				dispatch(setRedrawRound());
			} else{

				const winner = {
					pick: lottery.round.id,
					team: teams[0],
					winningCombo: Lottery.sortCombo(updatedBallsDrawn),
					changeInPosition: Lottery.findChangeInPosition(teams[0], setup.teams, lottery.round.id)
				}
	
				dispatch(setRoundWinner(winner));

				// If we have reached the amount of rounds complete we want, end the lottery
				if(lottery.round.id === config.numberOfRounds){
					
					// Remove the winning team, and create the final order
					const remainingOrder = teams.slice(1, teams.length - 1).map((team, i) => {
						
						// Ex: Need to add one to account for 0 index i
						const pick = lottery.round.id + ( i + 1 );

						return {
							pick,
							team,
							winningCombo: [],
							changeInPosition: Lottery.findChangeInPosition(team, setup.teams, pick)
						}

					});

					// Set last ran
					Utility.setLastRan(moment().unix());
					
					dispatch(setRemainingOrder(remainingOrder));
					dispatch(endLottery());
				}
			}
			
			dispatch(setRoundNotInProgress());

		}

		dispatch(updateTeamList(teams));

	}
}

export function startLottery(){

	return dispatch => {

		const round = {
			id: 1,
			inProgress: true,
			ballsDrawn: [],
			isRedrawWinner: false
		}
		
		dispatch(setRound(round));
	}
}


export function resetLottery(){

	return (dispatch, getState) => {

		const { setup } = getState();
		
		dispatch(handleResetLottery());
		dispatch(updateTeamList(setup.teams));
		dispatch(startLottery());
	}
}