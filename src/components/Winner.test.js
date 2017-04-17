var React = require("react");
var expect = require("expect");
import { render } from 'enzyme';

import Winner from "./Winner";

describe("Winner", () => {
	it("should exist", () => {
		expect(Winner).toExist();
	});

	describe("render", () => {
		it("should render winner HTML properly", () => {
			let winnerData = {
				pick: 2,
				team: "Test Team",
				winningCombo: [1, 3, 5, 9],
				changeInPosition: -4,
				teamId: 16
			};

			let winner = render(<Winner {...winnerData} />);

			let headerText = winner.find("h2").text();
			let imgUrl = winner.find("img").eq(0).attr("src");
			let className = winner.find("p").eq(0).children("span").attr("class");

			//isolate change in position text
			winner.find("p").eq(0).children("span").children().empty();
			let changeInPosition = parseInt(winner.find("p").eq(0).children("span").text().slice(0, -1).slice(1));

			//isolate team name text
			winner.find("p").eq(0).children().empty();
			let teamTxt = winner.find("p").eq(0).text().trim();

			//counting number of lotto balls rendered
			let balls = winner.find(".ball").get().length;
			

			expect(headerText).toEqual(`Pick #${winnerData.pick}`);
			expect(imgUrl).toEqual(`https://www-league.nhlstatic.com/builds/site-core/8d679dc125a67f8bf52f63a8cb3e70be14f173e9_1491511772/images/logos/team/current/team-${winnerData.teamId}-dark.svg`);
			expect(className).toEqual("change-down");
			expect(changeInPosition).toEqual(Math.abs(winnerData.changeInPosition));
			expect(teamTxt).toEqual(winnerData.team);
			expect(balls).toEqual(winnerData.winningCombo.length);
		
			
		});

	
	});
});


