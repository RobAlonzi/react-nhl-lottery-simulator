import config from "../config";
import Setup from "../helpers/Setup";

import { updateTeamList, startLottery } from "./lottery";
import { SETUP_INIT, SETUP_SET_BALL_RANGE } from "./types";

export function setInitialTeams(teams){
	return {
		type: SETUP_INIT,
		payload: teams
	}
}

export function setBallRange(range){
	return {
		type: SETUP_SET_BALL_RANGE,
		payload: range
	}
}

export function setupLottery(){
	return dispatch => {

		// Initialize the teams
		const initalSetup = Setup(config);

		// Set Ball Range
		dispatch(setBallRange(initalSetup.ballRange));

		// Set initial teams and update the lottery teams
		dispatch(setInitialTeams(initalSetup.teams));
		dispatch(updateTeamList(initalSetup.teams));
		dispatch(startLottery());
	}
}