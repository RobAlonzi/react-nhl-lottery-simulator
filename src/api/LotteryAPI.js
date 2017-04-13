
//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////
///////////// LOCAL STORAGE
//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////
export function getLastRan(){
	return localStorage.getItem("lastRan");
}

export function setLastRan(timestamp){
	localStorage.setItem("lastRan", timestamp);
	return timestamp;
}


//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////
///////// INIT GENERATION OF TEAM COMBOS
//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////
export function generateTeamsAndCombos(combos){
	let teams = getDefaultTeams();
	let totalCombosNeeded = countTotalCombosNeeded(teams, combos.length);
	let {combosForTeams, redrawTeam} = createInitialRedrawTeam(combos, totalCombosNeeded);
	let shuffledCombos = shuffle(combosForTeams);

	assignCombosToTeams(teams, shuffledCombos);
	
	if(redrawTeam.combos.length > 0)
		teams.push(redrawTeam);	

	return JSON.parse(JSON.stringify(teams));
}

export function generateAvailableNumbers(min, max){
	let range = [];
	for(let i = min; i <= max; i++){
		range.push(i);
	}
	return range;
}

export function getAllCombos(range, draws){
	let makeCombos =  (draws, range, tmp, combos) => {
		if (draws == 0) {
			if (tmp.length > 0) {
				combos[combos.length] = tmp;
			}
			return;
		}

		for (var j = 0; j < range.length; j++) {
			makeCombos(draws - 1, range.slice(j + 1), tmp.concat([range[j]]), combos);
		}
		return;
	};

	let combos = [],
		tmp = [];
	
	makeCombos(draws, range, tmp, combos);

	return combos;
}


//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////
///////// LOTTERY IN PROGRESS FUNCTIONS
//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////
export function drawNewBall(balls, ballsPicked){
	const idx = Math.floor(Math.random() * balls.length);
	const ball = balls[idx];

	return ballsPicked.includes(ball) ? drawNewBall(balls, ballsPicked) : ball;
}


export function findWinner(teams, numbers){
	for(let i = 0, j = teams.length; i < j; i++){
		let combos = teams[i].combos;
		//loop through each teams winning combos
		let didTeamWin = checkCombosForMatch(combos, numbers);
		
		if(didTeamWin){
			teams[i].winningCombo = sortCombo(numbers);
			return teams[i];
		}
	}
}

function checkCombosForMatch(combos, winner){
	return combos.some(combo => {
		//if one combo has all matches, return true
		if(combo.every(number => winner.includes(number))){
			return true;
		}
	});
}


function sortCombo(combo){
	return combo.slice(0).sort((a, b) => {
		return a > b;
	});
}


export function findChangeInPosition(team, teams, currentPick){
	let difference = undefined;
	teams.forEach((curTeam, index) => {
		if(team.id === curTeam.id)
			difference = (index + 1) - currentPick;
	});

	return difference;
}

export function removeWinningTeamsFromLottery(teams, winners){
	let winnerIds = winners.map(a => a.id);
	let winningTeamsCombos = [];
	let updatedCombos = teams.map(team => {
		if(winnerIds.includes(team.id)){
			winningTeamsCombos.push(...team.combos);
			team.delete = true;
			return team;
		}
		return team;
	});
	//redraw will always be last
	updatedCombos[updatedCombos.length - 1].combos.push(...winningTeamsCombos);
	return teams.filter(team => !team.delete );

}


export function recalculateOdds(teams, numbersPicked){
	teams.forEach(team => {
		team.combos = removeLosingCombos(team.combos, numbersPicked);
		team.winningNumbers = undefined;
	});

	let totalCombos = getTotalCombosRemaining(teams);

	teams.forEach(team => {
		team.percent = parseFloat((team.combos.length / totalCombos * 100).toFixed(1));
		team.pctDif = (team.percent - team.origPct).toFixed(1);
	});

	teams.sort(sortTeams);

	return teams;
}


function removeLosingCombos(combos, numbersPicked){
	return combos.filter(combo => {
		return numbersPicked.every(number => combo.indexOf(number) > -1 );
	});
}

function getTotalCombosRemaining(teams){
	return teams.reduce((prev, team) => {
		return team.combos.length + prev; 
	}, 0);
}

export function showWinningNumbers(teams, numbersPicked){
	teams.forEach(team => {
		team.winningNumbers = team.combos.map((combo) => {
			return combo.filter(number => !numbersPicked.includes(number)).join();
		}, []);
		team.winningNumbers = sortCombo(team.winningNumbers);
	});

	return teams;
}

export function revealFinalDraftOrder(teams, winners){
	let winnerIds = winners.map(a => a.id);

	let nonWinningTeams = teams.filter(team => {
		return !winnerIds.includes(team.id) && team.id !== 'rdw';
	});

	return nonWinningTeams.map((team, i) => {
		team.difference = findChangeInPosition(team, teams, i + 4);
		return team;
	});
}

//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////
///////////// UTILITY FUNCTIONS
//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////

function getDefaultTeams(){
	// let defaultTeams = [
	// 	{
	// 		id: "wpg",
	// 		teamId: 52,
	// 		name: "Winnipeg Jets",
	// 		percent: 17.9,
	// 		combos: [],
	// 	},{
	// 		id: "van",
	// 		teamId: 23,
	// 		name: "Vancouver Canucks",
	// 		percent: 12.1,
	// 		combos: [],
	// 	},
	// 	{
	// 		id: "las",
	// 		teamId: 54,
	// 		name: "Las Vegas Golden Knights",
	// 		percent: 10.3,
	// 		combos: [],
	// 	},
	// 	{
	// 		id: "nyi",
	// 		teamId: 2,
	// 		name: "New York Islanders",
	// 		percent: 10.3,
	// 		combos: [],
	// 	},{
	// 		id: "mtl",
	// 		teamId: 8,
	// 		name: "Montreal Canadiens",
	// 		percent: 8.5,
	// 		combos: [],
	// 	},{
	// 		id: "car",
	// 		teamId: 12,
	// 		name: "Carolina Hurricanes",
	// 		percent: 7.6,
	// 		combos: [],
	// 	},{
	// 		id: "chi",
	// 		teamId: 16,
	// 		name: "Chicago Blackhawks",
	// 		percent: 6.7,
	// 		combos: [],
	// 	},{
	// 		id: "det",
	// 		teamId: 17,
	// 		name: "Detroit Red Wings",
	// 		percent: 5.8,
	// 		combos: [],
	// 	},{
	// 		id: "cgy",
	// 		teamId: 20,
	// 		name: "Calgary Flames",
	// 		percent: 5.4,
	// 		combos: [],
	// 	},{
	// 		id: "pit",
	// 		teamId: 5,
	// 		name: "Pittsburgh Penguins",
	// 		percent: 4.5,
	// 		combos: [],
	// 	},{
	// 		id: "min",
	// 		teamId: 30,
	// 		name: "Minnesota Wild",
	// 		percent: 3.1,
	// 		combos: [],
	// 	},{
	// 		id: "lak",
	// 		teamId: 26,
	// 		name: "Los Angeles Kings",
	// 		percent: 2.7,
	// 		combos: [],
	// 	},{
	// 		id: "phi",
	// 		teamId: 4,
	// 		name: "Philadelphia Flyers",
	// 		percent: 2.2,
	// 		combos: [],
	// 	},
	// 	{
	// 		id: "wsh",
	// 		teamId: 15,
	// 		name: "Washington Capitals",
	// 		percent: 1.8,
	// 		combos: [],
	// 	},{
	// 		id: "tor",
	// 		teamId: 10,
	// 		name: "Toronto Maple Leafs",
	// 		percent: 0.9,
	// 		combos: [],
	// 	}
	// ];


	let defaultTeams = [
		{
			id: "col",
			teamId: 21,
			name: "Colorado Avalanche",
			percent: 17.9,
			combos: [],
		},{
			id: "van",
			teamId: 23,
			name: "Vancouver Canucks",
			percent: 12.1,
			combos: [],
		},
		{
			id: "las",
			teamId: 54,
			name: "Las Vegas Golden Knights",
			percent: 10.3,
			combos: [],
		},
		{
			id: "arz",
			teamId: 53,
			name: "Arizona Coyotes",
			percent: 10.3,
			combos: [],
		},{
			id: "njd",
			teamId: 1,
			name: "New Jersey Devils",
			percent: 8.5,
			combos: [],
		},{
			id: "buf",
			teamId: 7,
			name: "Buffalo Sabres",
			percent: 7.6,
			combos: [],
		},{
			id: "det",
			teamId: 17,
			name: "Detroit Red Wings",
			percent: 6.7,
			combos: [],
		},{
			id: "dal",
			teamId: 25,
			name: "Dallas Stars",
			percent: 5.8,
			combos: [],
		},{
			id: "fla",
			teamId: 13,
			name: "Florida Panthers",
			percent: 5.4,
			combos: [],
		},{
			id: "lak",
			teamId: 26,
			name: "Los Angeles Kings",
			percent: 4.5,
			combos: [],
		},{
			id: "car",
			teamId: 12,
			name: "Carolina Hurricanes",
			percent: 3.1,
			combos: [],
		},{
			id: "wpg",
			teamId: 52,
			name: "Winnipeg Jets",
			percent: 2.7,
			combos: [],
		},{
			id: "phi",
			teamId: 4,
			name: "Philadelphia Flyers",
			percent: 2.2,
			combos: [],
		},
		{
			id: "tbl",
			teamId: 14,
			name: "Tampa Bay Lightning",
			percent: 1.8,
			combos: [],
		},{
			id: "nyi",
			teamId: 2,
			name: "New York Islanders",
			percent: 0.9,
			combos: [],
		}
	];

	defaultTeams.forEach(team => {
		team.origPct = team.percent;
	});

	return JSON.parse(JSON.stringify(defaultTeams)); 
}



function countTotalCombosNeeded(teams, total){
	return teams.reduce((prev, team) => {
		return Math.round((team.percent / 100) * total) + prev; 
	}, 0);
}


function createInitialRedrawTeam(combos, combosNeeded){
	let redrawCombos = combos.filter((combo, i) => {
		return i >= combosNeeded;
	});

	let combosForTeams = combos.filter((combo, i) => {
		return i < combosNeeded;
	}); 

	return{
		combosForTeams,
		redrawTeam:{
			id: "rdw",
			name: "Redraw",
			percent: parseFloat((redrawCombos.length / combos.length * 100).toFixed(1)),
			origPct: parseFloat((redrawCombos.length / combos.length * 100).toFixed(1)),
			combos: redrawCombos
		}
	};
}

function shuffle(a) {
	let tmpArr = Array.from(a);

	for (let i = tmpArr.length; i; i--) {
		let j = Math.floor(Math.random() * i);
		[tmpArr[i - 1], tmpArr[j]] = [tmpArr[j], tmpArr[i - 1]];
	}

	return tmpArr;
}


function assignCombosToTeams(teams, combos){
	let tmpCombos = Array.from(combos);
	let total = tmpCombos.length;

	teams.forEach((team) => {
		let numberOfCombos = Math.round((team.percent / 100) * total);
		team.combos = tmpCombos.filter((combo, i) => {
			return i < numberOfCombos;
		});

		tmpCombos.splice(0, numberOfCombos);
	});
}

function sortTeams(a, b){
	if(a.combos.length > b.combos.length)
		return -1;
	if(a.combos.length < b.combos.length)
		return 1;
	if(a.name === "Redraw")
		return 1;
	if(b.name === "Redraw")
		return -1;
	if(a.origPct > b.origPct)
		return -1;
	if(a.origPct < b.origPct)
		return 1;
	return 0;
}