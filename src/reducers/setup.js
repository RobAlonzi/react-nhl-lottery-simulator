import { SETUP_INIT, SETUP_SET_BALL_RANGE } from "../actions/types";

const initialState = {
	ballRange : [],
	teams : []
};

export default function(state = initialState, action){
	switch(action.type){
		case SETUP_INIT:
			return { ...state, teams: action.payload };
		case SETUP_SET_BALL_RANGE:
			return { ...state, ballRange: action.payload };					
		default: {
			return state;
		}
	}
}