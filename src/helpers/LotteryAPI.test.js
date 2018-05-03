var expect = require("expect");

import * as API from "../api/LotteryAPI";

describe("LotteryAPI", () => {
	it("should exist", () => {
		expect(API).toExist();
	});

	describe("Local Storage", () => {
		it("should return null if no local storage", () => {
			window.localStorage.clear(); 
			let lastRan = API.getLastRan();
			expect(lastRan).toEqual(null);
		});

		it("should return timestamp if local storage", () => {
			let timestamp = 100;
			API.setLastRan(timestamp);
			let lastRan = API.getLastRan();
			expect(lastRan).toEqual(timestamp);
		});

		it("should return timestamp after saving local storage", () => {
			let timestamp = API.setLastRan(1234);
			expect(timestamp).toEqual(1234);
		});
	});

	describe("Init Functions", () => {
		// it("should generate teams array with no redraws", () => {
		// 	let defaultTeams = [
		// 		{
		// 			id: "col",
		// 			teamId: 21,
		// 			name: "Colorado Avalanche",
		// 			percent: 75,
		// 			combos: [],
		// 		},{
		// 			id: "van",
		// 			teamId: 23,
		// 			name: "Vancouver Canucks",
		// 			percent: 25,
		// 			combos: [],
		// 		}							
		// 	];

		// 	let combos = [[1,2,3], [1,2,4], [1,3,4], [2,3,4]];
		// 	let teams = API.generateTeamsAndCombos(combos);

		// 	expect(teams.length).toEqual(2);
		// 	expect(teams[0].combos.length).toEqual(3);
		// 	expect(teams[1].combos.length).toEqual(1);
		// });

		// it("should generate teams array with redraw team", () => {
		// 	let defaultTeams = [
		// 		{
		// 			id: "col",
		// 			teamId: 21,
		// 			name: "Colorado Avalanche",
		// 			percent: 25,
		// 			combos: [],
		// 		},{
		// 			id: "van",
		// 			teamId: 23,
		// 			name: "Vancouver Canucks",
		// 			percent: 25,
		// 			combos: [],
		// 		}							
		// 	];

		// 	let combos = [[1,2,3], [1,2,4], [1,3,4], [2,3,4]];
		// 	let teams = API.generateTeamsAndCombos(combos);

		// 	expect(teams.length).toEqual(3);
		// 	expect(teams[0].combos.length).toEqual(1);
		// 	expect(teams[1].combos.length).toEqual(1);
		// 	expect(teams[2].combos.length).toEqual(2);
		// 	expect(teams[2].name).toEqual("Redraw");
		// });


		it("should create array of balls to choose from", () => {
			let ballsInLotto = API.generateAvailableNumbers(10,20);
			expect(ballsInLotto.length).toEqual(11);
			expect(ballsInLotto).toEqual([10,11,12,13,14,15,16,17,18,19,20]);
		});

		it("should create array of all possible combos", () => {
			let range = [1,2,3,4];
			let draws = 3;

			let combos = API.getAllCombos(range, draws);

			expect(combos.length).toEqual(4);
			expect(combos[0]).toEqual([1,2,3]);
			expect(combos[1]).toEqual([1,2,4]);
			expect(combos[2]).toEqual([1,3,4]);
			expect(combos[3]).toEqual([2,3,4]);

		});
	});

	describe("Lottery in Progress", () => {
		it("should draw new ball", () => {
			let balls = [1,2,3,4];
			let ballsPicked = [2,3,4];

			let ball = API.drawNewBall(balls, ballsPicked);

			expect(ball).toEqual(1);
		});

		it("should find winner", () => {
			let defaultTeams = [
				{
					id: "col",
					teamId: 21,
					name: "Colorado Avalanche",
					percent: 75,
					combos: [[1,2,3], [1,2,4], [2,3,4]]
				},{
					id: "van",
					teamId: 23,
					name: "Vancouver Canucks",
					percent: 25,
					combos: [[1,3,4]]
				}							
			];

			let numbers = [1,3,4];
			let winner = API.findWinner(defaultTeams, numbers);
			expect(winner.name).toEqual(defaultTeams[1].name);
		});

		it("should find change in position", () => {
			let defaultTeams = [
				{
					id: "col",
					teamId: 21,
					name: "Colorado Avalanche",
					percent: 75,
					combos: [[1,2,3], [1,2,4], [2,3,4]]
				},{
					id: "van",
					teamId: 23,
					name: "Vancouver Canucks",
					percent: 25,
					combos: [[1,3,4]]
				}							
			];

			let team = {
				id: "van",
				teamId: 23,
				name: "Vancouver Canucks",
				percent: 25,
				combos: [[1,3,4]]
			};

			let currentPick = 1;
			let changeInPosition = API.findChangeInPosition(team, defaultTeams, currentPick);

			expect(changeInPosition).toEqual(1);
		});


		it("should remove winning teams from lottery", () => {
			let teams = [
				{
					id: "col",
					teamId: 21,
					name: "Colorado Avalanche",
					percent: 75,
					combos: [[1,2,3], [1,2,4], [2,3,4]]
				},{
					id: "van",
					teamId: 23,
					name: "Vancouver Canucks",
					percent: 25,
					combos: [[1,3,4]]
				}							
			];

			let winners = [{
				id: "col",
				teamId: 21,
				name: "Colorado Avalanche",
				percent: 75,
				combos: [[1,2,3], [1,2,4], [2,3,4]]
			}];

			let updTeams = API.removeWinningTeamsFromLottery(teams, winners);

			expect(updTeams.length).toEqual(1);
			expect(updTeams[0].name).toEqual(teams[1].name);
		});

		it("should recalculate odds", () => {
			let teams = [
				{
					id: "col",
					teamId: 21,
					name: "Colorado Avalanche",
					percent: 75,
					combos: [[1,3,4]]
				},{
					id: "van",
					teamId: 23,
					name: "Vancouver Canucks",
					percent: 25,
					combos: [[1,2,3], [1,2,4], [2,3,4]]
				}							
			];

			let numbersPicked = [1,2];

			let updTeams = API.recalculateOdds(teams, numbersPicked);
			
			expect(updTeams.length).toEqual(2);
			expect(updTeams[0].combos.length).toEqual(2);
			expect(updTeams[0].name).toEqual("Vancouver Canucks");
			expect(updTeams[1].combos.length).toEqual(0);
			expect(updTeams[1].name).toEqual("Colorado Avalanche");
		});


		it("should show winning numbers", () => {
			let teams = [
				{
					id: "col",
					teamId: 21,
					name: "Colorado Avalanche",
					percent: 75,
					combos: []
				},{
					id: "van",
					teamId: 23,
					name: "Vancouver Canucks",
					percent: 25,
					combos: [[1,2,3], [1,2,4]]
				}							
			];

			let numbersPicked = [1,2];

			let updTeams = API.showWinningNumbers(teams, numbersPicked);
			
			expect(updTeams[0].winningNumbers).toEqual(0);
			expect(updTeams[1].winningNumbers.length).toEqual(2);
			expect(updTeams[1].winningNumbers[0]).toEqual(3);
			expect(updTeams[1].winningNumbers[1]).toEqual(4);
		});

		it("should reveal final draft order", () => {
			let teams = [
				{
					id: "col",
					teamId: 21,
					name: "Colorado Avalanche",
					percent: 75,
					combos: []
				},{
					id: "det",
					teamId: 23,
					name: "Detroit Red Wings",
					percent: 25,
					combos: [[1,2,3], [1,2,4]]
				},{
					id: "van",
					teamId: 23,
					name: "Vancouver Canucks",
					percent: 25,
					combos: [[1,2,3], [1,2,4]]
				},{
					id: "tor",
					teamId: 23,
					name: "Toronto Maple Leafs",
					percent: 25,
					combos: [[1,2,3], [1,2,4]]
				},
				{
					id: "sjs",
					teamId: 23,
					name: "San Jose Sharks",
					percent: 25,
					combos: [[1,2,3], [1,2,4]]
				}									
			];

			let winners = [
				{
					id: "col",
					teamId: 21,
					name: "Colorado Avalanche",
					percent: 75,
					combos: [[1,2,3], [1,2,4], [2,3,4]]
				},{
					id: "van",
					teamId: 23,
					name: "Vancouver Canucks",
					percent: 25,
					combos: [[1,2,3], [1,2,4]]
				}
			];

			let updTeams = API.revealFinalDraftOrder(teams, winners);
			
			expect(updTeams[0].name).toEqual("Detroit Red Wings");
			expect(updTeams[1].name).toEqual("Toronto Maple Leafs");
			expect(updTeams[0].difference).toEqual(-1);
			expect(updTeams[1].difference).toEqual(0);
		});

		
	});
});
