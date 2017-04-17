var React = require("react");
var expect = require("expect");
import { render } from 'enzyme';

import OddsTable from "./OddsTable";

describe("OddsTable", () => {
	it("should exist", () => {
		expect(OddsTable).toExist();
	});

	describe("render", () => {
		it("should render correct amount of OddsTableRow components", () => {
			let oddsTableData = {
				teams: [{
					id: "tea",
					name: "Test Team",
					origPct: 17,
					percent: 17,
					teamId: 99,
					combos:[[1, 4, 8, 10], [1, 2, 3, 4], [9, 11, 13, 14]]
				},
				{
					id: "te2",
					name: "Test Team2",
					origPct: 17,
					percent: 17,
					teamId: 99,
					combos:[[1, 4, 8, 10], [1, 2, 3, 4], [9, 11, 13, 14]]
				}],
				lotteryOver: false
			};

			let oddsTable = render(<OddsTable {...oddsTableData} />);
			let tableRows = oddsTable.find("table tbody tr").get().length;
			expect(tableRows).toEqual(oddsTableData.teams.length);
		});

		it("should render header if lottery not over", () => {
			let oddsTableData = {
				teams: [{
					id: "tea",
					name: "Test Team",
					origPct: 17,
					percent: 17,
					teamId: 99,
					combos:[[1, 4, 8, 10], [1, 2, 3, 4], [9, 11, 13, 14]]
				},
				{
					id: "te2",
					name: "Test Team2",
					origPct: 17,
					percent: 17,
					teamId: 99,
					combos:[[1, 4, 8, 10], [1, 2, 3, 4], [9, 11, 13, 14]]
				}],
				lotteryOver: false
			};

			let oddsTable = render(<OddsTable {...oddsTableData} />);
			let headerRows = oddsTable.find("table thead tr").get().length;
			expect(headerRows).toEqual(1);
		});

		it("should not render header if lottery over", () => {
			let oddsTableData = {
				teams: [{
					id: "tea",
					name: "Test Team",
					origPct: 17,
					percent: 17,
					teamId: 99,
					combos:[[1, 4, 8, 10], [1, 2, 3, 4], [9, 11, 13, 14]]
				},
				{
					id: "te2",
					name: "Test Team2",
					origPct: 17,
					percent: 17,
					teamId: 99,
					combos:[[1, 4, 8, 10], [1, 2, 3, 4], [9, 11, 13, 14]]
				}],
				lotteryOver: true
			};

			let oddsTable = render(<OddsTable {...oddsTableData} />);
			let headerRows = oddsTable.find("table thead tr").get().length;
			expect(headerRows).toEqual(0);
		});
	});
});


