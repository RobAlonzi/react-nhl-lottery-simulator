var React = require("react");
var ReactDOM = require("react-dom");
var expect = require("expect");
import { render } from 'enzyme';

import OddsTableRow from "./OddsTableRow";

describe("OddsTableRow", () => {
	it("should exist", () => {
		expect(OddsTableRow).toExist();
	});

	describe("render", () => {
		it("should render row properly when lottery not over and not in final draw", () => {
			let tableRowData = {
				id: "team",
				combos: [[1,2,3,4],[2,3,4,5]],
				name: "Team Name",
				percent: 25,
				place: 1,
				teamId : 100,
				lotteryOver: false
			};

			let row = render(<OddsTableRow {...tableRowData} />);
			let th = row.find("th").text();
			
			let nameRowImg = row.find("td").eq(0).children("img").attr("src");
			let nameRowTxt = row.find("td").eq(0).last().text().trim();
			let comboRowNumber = parseInt(row.find("td").eq(1).find("span").text());
			row.find("td").eq(1).children().empty();
			let percentChanceText = row.find("td").eq(1).text().trim();
			
			expect(th).toEqual(tableRowData.place);
			expect(nameRowImg).toEqual(`https://www-league.nhlstatic.com/builds/site-core/8d679dc125a67f8bf52f63a8cb3e70be14f173e9_1491511772/images/logos/team/current/team-${tableRowData.teamId}-dark.svg`);
			expect(nameRowTxt).toEqual(tableRowData.name);
			expect(comboRowNumber).toEqual(tableRowData.combos.length);
			expect(percentChanceText).toEqual(`(${tableRowData.percent}% chance)`);
		});

		it("should render row properly when lottery not over and is in final draw", () => {
			let tableRowData = {
				id: "team",
				combos: [[1,2,3,4],[2,3,4,5]],
				name: "Team Name",
				percent: 25,
				place: 1,
				teamId : 100,
				winningNumbers: [1,5],
				lotteryOver: false
			};

			let row = render(<OddsTableRow {...tableRowData} />);
			let th = row.find("th").text();
			let nameRowImg = row.find("td").eq(0).children("img").attr("src");
			let nameRowTxt = row.find("td").eq(0).last().text().trim();
			let comboRowNumber = parseInt(row.find("td").eq(1).find("span").text());
			let winsWithText = row.find("td").eq(1).find("span.wins-with").text().trim();
			row.find("td").eq(1).children().empty();
			let percentChanceText = row.find("td").eq(1).text().trim();

			
			expect(th).toEqual(tableRowData.place);
			expect(nameRowImg).toEqual(`https://www-league.nhlstatic.com/builds/site-core/8d679dc125a67f8bf52f63a8cb3e70be14f173e9_1491511772/images/logos/team/current/team-${tableRowData.teamId}-dark.svg`);
			expect(nameRowTxt).toEqual(tableRowData.name);
			expect(comboRowNumber).toEqual(tableRowData.combos.length);
			expect(percentChanceText).toEqual(`(${tableRowData.percent}% chance)`);
			expect(winsWithText).toEqual(`Wins with: ${tableRowData.winningNumbers.join(", ")}`);
		});


		it("should render row properly when lottery is over", () => {
			let tableRowData = {
				id: "team",
				name: "Team Name",
				place: 4,
				teamId : 100,
				absDifference: -3,
				lotteryOver: true
			};

			let row = render(<OddsTableRow {...tableRowData} />);
			let th = row.find("th").text();
			let nameRowImg = row.find("td").eq(0).children("img").attr("src");
			let nameRowTxt = row.find("td").eq(0).last().text().trim();
			let changeClass = row.find("td").eq(1).attr("class");
			row.find("td").eq(1).children().empty();
			let difference = parseInt(row.find("td").eq(1).text().trim());

			
			expect(th).toEqual(`#${tableRowData.place}`);
			expect(nameRowImg).toEqual(`https://www-league.nhlstatic.com/builds/site-core/8d679dc125a67f8bf52f63a8cb3e70be14f173e9_1491511772/images/logos/team/current/team-${tableRowData.teamId}-dark.svg`);
			expect(nameRowTxt).toEqual(tableRowData.name);
			expect(changeClass).toEqual("change-down");
			expect(difference).toEqual(Math.abs(tableRowData.difference));
		});
	});
});


