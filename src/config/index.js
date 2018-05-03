const teams = {
	ana: {
		id: 24,
		name: "Anaheim Ducks"
	},
	arz: {
		id: 53,
		name: "Arizona Coyotes"
	},
	bos: {
		id: 6,
		name: "Boston Bruins"
	},
	buf: {
		id: 7,
		name: "Buffalo Sabres"
	},
	cgy: {
		id: 20,
		name: "Calgary Flames"
	},
	car: {
		id: 12,
		name: "Carolina Hurricanes"
	},
	chi: {
		id: 16,
		name: "Chicago Blackhawks"
	},
	col: {
		id: 21,
		name: "Colorado Avalanche"
	},
	cbj: {
		id: 29,
		name: "Columbus Blue Jackets"
	},
	dal: {
		id: 25,
		name: "Dallas Stars"
	},
	det: {
		id: 17,
		name: "Detroit Red Wings"
	},
	edm: {
		id: 22,
		name: "Edmonton Oilers"
	},
	fla: {
		id: 13,
		name: "Florida Panthers"
	},
	lak: {
		id: 26,
		name: "Los Angeles Kings"
	},
	min: {
		id: 30,
		name: "Minnesota Wild"
	},
	mtl: {
		id: 8,
		name: "Montréal Canadiens"
	},
	nsh: {
		id: 18,
		name: "Nashville Predators"
	},
	njd: {
		id: 1,
		name: "New Jersey Devils"
	},
	nyi: {
		id: 2,
		name: "New York Islanders"
	},
	nyr: {
		id: 3,
		name: "New York Rangers"
	},
	ott: {
		id: 9,
		name: "Ottawa Senators"
	},
	phi: {
		id: 4,
		name: "Philadelphia Flyers"
	},
	pit: {
		id: 5,
		name: "Pittsburgh Penguins"
	},
	sjs: {
		id: 28,
		name: "San Jose Sharks"
	},
	stl: {
		id: 19,
		name: "St. Louis Blues"
	},
	tbl: {
		id: 14,
		name: "Tampa Bay Lightning"
	},
	tor: {
		id: 10,
		name: "Toronto Maple Leafs"
	},
	van: {
		id: 23,
		name: "Vancouver Canucks"
	},
	vgk: {
		id: 54,
		name: "Vegas Golden Knights"
	},
	wsh: {
		id: 15,
		name: "Washington Capitals"
	},
	wpg: {
		id: 52,
		name: "Winnipeg Jets"
	}
};

const odds = [18.5, 13.5, 11.5, 9.5, 8.5, 7.5, 6.5, 6, 5, 3.5, 3, 2.5, 2, 1.5, 1];
const lotteryTeams = [
	teams.buf,
	teams.ott,
	teams.arz,
	teams.mtl,
	teams.det,
	teams.van,
	teams.chi,
	teams.nyr,
	teams.edm,
	teams.nyi,
	teams.car,
	teams.cgy,
	teams.dal,
	teams.stl,
	teams.fla
];


export default {
	lowestNumberToDraw: 1,
	highestNumberToDraw: 14,
	ballsDrawnPerRound: 4,
	numberOfRounds: 3,
	teams: lotteryTeams.map((team, i) => {
		return {
			...team,
			percent: odds[i],
			updatedPct: odds[i]
		}
	}),
}

