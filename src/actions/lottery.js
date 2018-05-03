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

/**  
 * Dispatches action to notifiy the app that the round needs to be redrawn
 * @returns {Object}
 * */
function setRedrawRound(){
	return {
		type: LOTTERY_SET_REDRAW_ROUND
	}
}

/**  
 * Dispatches action to set new round information
 * @param { Object } round - New round information
 * @returns {Object}
 * */
function setRound(round){
	return {
		type: LOTTERY_START_NEW_ROUND,
		payload: round
	}
}

/**  
 * Dispatches action to reset the lottery to the start
 * @returns {Object}
 * */
function handleResetLottery(){
	return {
		type: LOTTERY_RESET
	}
}

/**  
 * Dispatches action to set a new winner
 * @param { Object } options - Winner information
 * @returns {Object}
 * */
function setRoundWinner(options){
	return {
		type: LOTTERY_SET_ROUND_WINNER,
		payload: options
	}
}

/**  
 * Dispatches action to add a ball to the ball drawn list
 * @param { Number } ball - The new ball chosen
 * @returns {Object}
 * */
function addBallToDrawnBallList(ball){
	return {
		type: LOTTERY_ADD_BALL,
		payload: ball
	}
}

/**  
 * Dispatches action to notify the app that this round is not in progress
 * @returns {Object}
 * */
function setRoundNotInProgress(){
	return {
		type: LOTTERY_SET_ROUND_NOT_IN_PROGRESS
	}
}

/**  
 * Dispatches action to tell the app the lottery is over
 * @returns {Object}
 * */
function endLottery(){
	return {
		type: LOTTERY_END
	}
}

/**  
 * Dispatches action to add the remaining order of the lottery (apart from selected winners)
 * @param { Object[] } remainingOrder - The losing teams in sorted order
 * @returns {Object}
 * */
function setRemainingOrder(remainingOrder){
	return {
		type: LOTTERY_SET_REMAINING_ORDER,
		payload: remainingOrder
	}
}

/**  
 * Dispatches action to update the team information
 * @param { Object[] } teams - The teams information in order of odds
 * @returns {Object}
 * */
export function updateTeamList(teams){
	return {
		type: LOTTERY_UPDATE_TEAM_LIST,
		payload: teams
	}
}

/**  
 * Action generator that will advance a new round
 * Will remove the winning team from the eligible teams list if neccessary
 * Will recalculate team offs
 * Dispatches: updateTeamList, setRound
 * @returns {Function}
 * */
export function startRound(){
	return (dispatch, getState) => {

		// Get state and neccessary information
		const { setup, lottery } = getState();
		const isNewRound = !lottery.round.isRedrawWinner;

		// Create the round information
		const round = {
			id: isNewRound ? ++lottery.round.id : lottery.round.id,
			inProgress: true,
			ballsDrawn: [],
			isRedrawWinner: false
		};

		// Map over the team list, placing their losing combos back into their winning combo list
		let teams = lottery.teams.map(team => {
			
			// Delete the winsWith array
			delete team.winsWith;

			return {
				...team,
				combos: [...team.combos, ...team.losingCombos],
				losingCombos: []
			}
		});

		// If it's a new round, we have to do some extra logic
		if(isNewRound){
			// Take out the winner and the redraw combo from the teams array (will always be first and last respectively)
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

/**  
 * Action generator that will draw a new ball
 * Will add a "wins with" column for each team if balls drawn is second to last
 * Will set a winner if balls drawn is reached for each round
 * Dispatches Always: addBallToDrawnBallList, updateTeamList,
 * Dispatches Sometimes: setRedrawRound, setRoundWinner, setRemainingOrder, endLottery, setRoundNotInProgress
 * TODO: separate into smaller functions
 * @returns {Function}
 * */
export function drawBall(){

	return (dispatch, getState) => {

		const { setup, lottery } = getState();

		// Draw new ball, passing in already picked numbers and dispatch action
		const ball = Lottery.drawBall(setup.ballRange, lottery.round.ballsDrawn);
		dispatch(addBallToDrawnBallList(ball));

		// Add the new ball into the ball list manually to avoid fetching again
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
				// Dispacth
				dispatch(setRedrawRound());
			} else{
				// A winner is valid, create the info object
				const winner = {
					pick: lottery.round.id,
					team: teams[0],
					winningCombo: Lottery.sortCombo(updatedBallsDrawn),
					changeInPosition: Lottery.findChangeInPosition(teams[0], setup.teams, lottery.round.id)
				}

				//Dispatch
				dispatch(setRoundWinner(winner));

				// If we have reached the amount of rounds complete we want, end the lottery
				if(lottery.round.id === config.numberOfRounds){
					
					// Remove the winning team, and create the final order, also leave one off the end
					// to not include the redraw team (will always be last in the array)
					const remainingOrder = teams.slice(1, teams.length - 1).map((team, i) => {
						
						// Ex: Need to add one to account for 0 index i
						const pick = lottery.round.id + ( i + 1 );

						// Create object
						return {
							pick,
							team,
							winningCombo: [],
							changeInPosition: Lottery.findChangeInPosition(team, setup.teams, pick)
						}

					});

					// Set last ran
					Utility.setLastRan(moment().unix());
					
					// Dispatch relevant events
					dispatch(setRemainingOrder(remainingOrder));
					dispatch(endLottery());
				}
			}
			
			// Round is over, dispatch
			dispatch(setRoundNotInProgress());
		}

		// Dispatch
		dispatch(updateTeamList(teams));
	}
}

/**  
 * Action generator that will start the lottery by moving the round to round one.
 * Dispatches setRound
 * @returns {Function}
 * */
export function startLottery(){

	return dispatch => {

		// Kick off round 1
		const round = {
			id: 1,
			inProgress: true,
			ballsDrawn: [],
			isRedrawWinner: false
		}
		
		dispatch(setRound(round));
	}
}

/**  
 * Action generator that will reset the lottery
 * Dispatches handleResetLottery, updateTeamList, startLottery
 * @returns {Function}
 * */
export function resetLottery(){

	return (dispatch, getState) => {

		const { setup } = getState();
		
		// Dispatch the action to reset lottery to initial props
		dispatch(handleResetLottery());
		// Get the original team array
		dispatch(updateTeamList(setup.teams));
		// Start the lottery up again
		dispatch(startLottery());
	}
}