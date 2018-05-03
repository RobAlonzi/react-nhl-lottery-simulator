import { combineReducers } from 'redux';

import setupReducer from "./setup";
import lotteryReducer from "./lottery";

const rootReducer = combineReducers({
	setup: setupReducer,
	lottery: lotteryReducer
});

export default rootReducer;