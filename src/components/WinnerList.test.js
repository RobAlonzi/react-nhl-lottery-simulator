var React = require("react");
var expect = require("expect");
import { render } from 'enzyme';

import WinnerList from "./WinnerList";

describe("WinnerList", () => {
	it("should exist", () => {
		expect(WinnerList).toExist();
	});

	describe("render", () => {
		it("should render correct amount of Winner components", () => {
			let winnerListData = [
				{
					pick: 1,
					team: "Test Team",
					winningCombo: [1, 3, 5, 9],
					changeInPosition: -4,
					teamId: 16
				},
				{
					pick: 2,
					team: "Test Team 2",
					winningCombo: [1, 7, 5, 9],
					changeInPosition: -9,
					teamId: 26
				},
			];

			let winnerList = render(<WinnerList winners={winnerListData} />);
			let winners = winnerList.find(".winning-team").get().length;
			expect(winners).toEqual(winnerListData.length);
		});
	});
});


