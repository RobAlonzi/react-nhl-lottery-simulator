import config from "../config";
import Setup from "../helpers/Setup";

import { updateTeamList, startLottery } from "./lottery";
import { SETUP_INIT, SETUP_SET_BALL_RANGE } from "./types";

/**  
 * Action generator that will store the inital team information
 * @param {Object[]} teams - The array of team information
 * @returns {Function}
 * */
export function setInitialTeams(teams){
	return {
		type: SETUP_INIT,
		payload: teams
	}
}

/**  
 * Action generator that will store the ball range
 * @param {Array} range - The range of balls to choose from
 * @returns {Function}
 * */
export function setBallRange(range){
	return {
		type: SETUP_SET_BALL_RANGE,
		payload: range
	}
}

/**  
 * Action generator that will set up the lottery (called on page load)
 * Dispatches setBallRange, setInitialTeams, updateTeamList [from Lottery], startLottery [From Lottery]
 * @returns {Function}
 * */
export function setupLottery(){
	return dispatch => {

		// Initialize the teams
		const initalSetup = Setup(config);

		// Set Ball Range
		dispatch(setBallRange(initalSetup.ballRange));

		// Set initial teams (for future referance to avoid the work above)
		dispatch(setInitialTeams(initalSetup.teams));
		
		// Push this same defaults to the lottery state, and start lottery 
		dispatch(updateTeamList(initalSetup.teams));
		dispatch(startLottery());
	}
}