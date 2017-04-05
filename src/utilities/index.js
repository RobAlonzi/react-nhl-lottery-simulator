
export function generateTeamsAndCombos(combos){
	let teams = [
		{
			id: "sjs",
			name: "San Jose Sharks",
			percent: 20,
			combos: [],
		},{
			id: "car",
			name: "Carolina Hurricanes",
			percent: 13.5,
			combos: [],
		},{
			id: "fla",
			name: "Florida Panthers",
			percent: 11.5,
			combos: [],
		},{
			id: "mtl",
			name: "Montreal Canadiens",
			percent: 9.5,
			combos: [],
		},{
			id: "nsh",
			name: "Nashville Predators",
			percent: 8.5,
			combos: [],
		},{
			id: "nyr",
			name: "New York Rangers",
			percent: 7.5,
			combos: [],
		},{
			id: "pit",
			name: "Pittsburgh Penguins",
			percent: 6.5,
			combos: [],
		},{
			id: "njd",
			name: "New Jersey Devils",
			percent: 6,
			combos: [],
		},{
			id: "det",
			name: "Detroit Red Wings",
			percent: 5,
			combos: [],
		},{
			id: "min",
			name: "Minnesota Wild",
			percent: 3.5,
			combos: [],
		},{
			id: "tor",
			name: "Toronto Maple Leafs",
			percent: 3,
			combos: [],
		},{
			id: "chi",
			name: "Chicago Blackhawks",
			percent: 2.5,
			combos: [],
		},{
			id: "wpg",
			name: "Winnipeg Jets",
			percent: 2,
			combos: [],
		},{
			id: "van",
			name: "Vancouver Canucks",
			percent: 1,
			combos: [],
		}
	];

	let totalCombosNeeded = countTotalCombosNeeded(teams, combos.length);
	let {combosForTeams, redrawTeam} = createInitialRedrawTeam(combos, totalCombosNeeded);
	let shuffledCombos = shuffle(combosForTeams);
	assignCombosToTeams(teams, shuffledCombos);
	
	if(redrawTeam.combos.length > 0)
		teams.push(redrawTeam);	

	return teams;
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
			name: "Redraw Round",
			percent: parseFloat((redrawCombos.length / combos.length * 100).toFixed(1)),
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

// export function generateAvailableNumbers(){
// 	return ["Hi2"];
// }