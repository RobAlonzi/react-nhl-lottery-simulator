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
} from "../actions/types";

const initialState = {
	teams : [],
	round : {
		id: 0,
		inProgress: false,
		ballsDrawn: [],
		isRedrawWinner: false
	},
	winners: [],
	draftComplete: false
};

export default function(state = initialState, action){
	console.log(action.type);

	switch(action.type){
		case LOTTERY_UPDATE_TEAM_LIST:
			return { ...state, teams: action.payload };
		case LOTTERY_START_NEW_ROUND:
			return { ...state, round: action.payload };
		case LOTTERY_ADD_BALL:
			return { ...state, round: { ...state.round, ballsDrawn: [ ...state.round.ballsDrawn, action.payload ] }};
		case LOTTERY_SET_ROUND_WINNER:
			return { ...state, winners: [...state.winners, action.payload]};
		case LOTTERY_SET_ROUND_NOT_IN_PROGRESS:
			return { ...state, round: {...state.round, inProgress: false }};
		case LOTTERY_RESET:
			return initialState;
		case LOTTERY_SET_REDRAW_ROUND:
			return { ...state, round: { ...state.round, isRedrawWinner: true } }
		case LOTTERY_END:
			return { ...state, draftComplete: true }
		case LOTTERY_SET_REMAINING_ORDER:
			return { ...state, winners: [...state.winners, ...action.payload] }	
		default: {
			return state;
		}
	}
}