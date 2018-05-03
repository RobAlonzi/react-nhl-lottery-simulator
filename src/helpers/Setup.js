/**  
 * Generates an array based on the min and max ball numbers.
 * @param { Number } min - The smallest number on a drawn ball possible
 * @param { Number } max - The largest number on a drawn ball possible
 * @returns { Array } - An array with the numbers between the min and max. 
 * */
const createBallRange = (min, max) => {
	let range = [];
	for(let i = min; i <= max; i++){
		range.push(i);
	}
	return range;
};

/**  
 * Shuffles a given array. Does not mutate original.
 * @param { Array } range - A range of possible outcomes
 * @param { Number } lengthOfCombo - The length of each unique combination
 * @returns { Array } - An array of each unique combination available
 * */
const generateUniqueCombos = (range, lengthOfCombo) => {
	let combos = [],
		tmp = [],
		makeCombos = (lengthOfCombo, range, tmp, combos) => {
			
			if (lengthOfCombo == 0) {
				if (tmp.length > 0) {
					combos[combos.length] = tmp;
				}
				return;
			}
			

			for (var j = 0; j < range.length; j++) {
				makeCombos(lengthOfCombo - 1, range.slice(j + 1), tmp.concat([range[j]]), combos);
			}

			return;
	};
	
	makeCombos(lengthOfCombo, range, tmp, combos);
	return combos;
};

/**  
 * Given a list of teams (with percentage odds), this will return the total number
 * of combinations required to ensure each team has the correct amount of odds
 * @param { Array } teams - an array of teams
 * @param { Number } total - the total number of combinations available
 * @returns { Number } 
 * */
const calculateCombinationsNeeded = (teams, total) => {
	return teams.reduce((prev, team) => {
		return Math.round((team.percent / 100) * total) + prev; 
	}, 0);
};

/**  
 * Shuffles a given array. Does not mutate original.
 * @param { Array } array - the array to shuffle
 * @returns { Array } - The shuffled array
 * */
const shuffleCombos = array => {
	let tmpArr = [...array];

	for (let i = tmpArr.length; i; i--) {
		let j = Math.floor(Math.random() * i);
		[tmpArr[i - 1], tmpArr[j]] = [tmpArr[j], tmpArr[i - 1]];
	}

	return tmpArr;
}

/**  
 * Shuffles a given array. Does not mutate original.
 * @param { Array } teams - An array of teams
 * @param { Array } combos - The array of unique combinations
 * @returns { Array } - The teams array with combos added.
 * */
const assignCombinationsToTeams = (teams, combos) => {

	let tmpCombos = [...combos];
	let total = combos.length;
	
	teams.forEach((team) => {
		// Calculate how many combinations this team deserves
		let numberOfCombos = Math.round((team.percent / 100) * total);
		
		// Remove from temporary combos array and into this teams combos array
		team.combos = tmpCombos.splice(0, numberOfCombos);
	});

	return teams;
}

/**  
 * Setup the parameters for the lottery
 * */
const setup = (options) => {

	// Create range of numbers
	const ballRange = createBallRange(options.lowestNumberToDraw, options.highestNumberToDraw);

	// Generate an array of all possible unique combos
	const uniqueCombinationsAvailable = generateUniqueCombos(ballRange, options.ballsDrawnPerRound);

	// Determine how many combinations each team needs
	const combinationsNeeded = calculateCombinationsNeeded(options.teams, uniqueCombinationsAvailable.length);

	// Strip away leftover combos
	const redrawCombos = uniqueCombinationsAvailable.splice(combinationsNeeded, uniqueCombinationsAvailable.length - combinationsNeeded);

	// Assign combos to teams
	let teams = assignCombinationsToTeams(options.teams, shuffleCombos(uniqueCombinationsAvailable));

	// Create redraw group and assign remaining combos
	const redrawTeam = {
		id: 'rdw',
		name: 'Redraw',
		percent: parseFloat((redrawCombos.length / uniqueCombinationsAvailable.length * 100).toFixed(1)),
		updatedPct: parseFloat((redrawCombos.length / uniqueCombinationsAvailable.length * 100).toFixed(1)),
		combos: redrawCombos
	}

	// Add redraw team to the list of teams
	teams = [ ...teams, redrawTeam ];

	// Return the teams
	return { teams, ballRange }
}

export default setup;