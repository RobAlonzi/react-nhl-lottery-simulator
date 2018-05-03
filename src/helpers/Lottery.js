
/**  
 * Filters the losing combos from the still eligible combos
 * @param { Array } combos - The array of combos to check
 * @param { Array } numbersPicked - The array of numbers selected
 * @returns { Object } - An object containing the array of losing combos and still eligible combos
 * */
const removeLosingCombos = (combos, numbersPicked) => {
	let losingCombos = [],
		availableCombos = [];

	combos.forEach(combo => {
		// Combo still has a chance because EVERY number in the numbersPicked array 
		// can be found in this combo
		if((numbersPicked.every(number => combo.indexOf(number) > -1))){
			availableCombos.push(combo);
		// Combo can't win, it didn't have one of the numbers picked
		} else{
			losingCombos.push(combo);
		}
	});

	return {
		losingCombos,
		availableCombos
	}
}

/**  
 * Calculate total combos that are still left in play
 * @param { Object[] } teams - The array of teams
 * @returns { Number } - How many total combos are still left in play
 * */
const getTotalCombosRemaining = teams => {
	// Start with 0, add each teams combo array length
	return teams.reduce((prev, team) => {
		return team.combos.length + prev; 
	}, 0);
}

/**  
 * Sort combo lowest to highest
 * @param { Array } combo - The combo to sort
 * @returns { Array } - The combo but sorted numerically 
 * */
const sortCombo = combo => {
	return combo.slice(0).sort((a, b) => {
		return parseInt(a) > parseInt(b);
	});
}

/**  
 * Sort Teams 
 * 1. If the new percentage is higher
 * 2. Redraw is always below the real teams
 * 3. If everything is tied, original percentage is ahead
 * @param { Object } a - Team A
 * @param { Object } b - Team B
 * @returns { Number } - If it should be ahead, behind or tied
 * */
const sortTeams = (a, b) => {
	if(a.updatedPct > b.updatedPct)
		return -1;
	if(a.updatedPct < b.updatedPct)
		return 1;
	if(a.name === "Redraw")
		return 1;
	if(b.name === "Redraw")
		return -1;
	if(a.percent > b.percent)
		return -1;
	if(a.percent < b.percent)
		return 1;
	return 0;
}

/**  
 * Draw a ball from the range of balls, if already picked, try again
 * @param { Array } balls - The range of balls to choose from
 * @param { Array } ballsPicked - Already chosen balls
 * @returns { Number } - The ball that was chosen
 * */
const drawBall = (balls, ballsPicked) => {

	// Get a random index from the array
	const idx = Math.floor(Math.random() * balls.length);
	const ball = balls[idx];

	// If the ball was picked, run this again, otherwise return the ball 
	return ballsPicked.includes(ball) ? drawBall(balls, ballsPicked) : ball;
}

/**  
 * Recalculate odds for the teams, by first moving the losing combos into the losingCombos array
 * @param { Object[] } teams - The array of teams
 * @param { Array } numbersPicked - The array of numbers picked
 * @returns { Object[] } - Array of teams with updated odds
 * */
const recalculateOdds = (teams, numbersPicked) => {

	// Update the teams combos remaining by removing the losing combos
	let updatedTeams = teams.map(team => {

		// Get list of losing combos and still eligible combos
		var combos = removeLosingCombos(team.combos, numbersPicked);

		// Move the new losing combos in the losingCombos array, keep the availableCombos 
		return {
			...team,
			combos: combos.availableCombos,
			losingCombos: [...(team.losingCombos || []), ...(combos.losingCombos || [])]
		}
	});

	// Add up the total amount of combos remaining
	let totalCombosRemaining = getTotalCombosRemaining(updatedTeams);

	// Update the teams again, but now calculate their new pct chance of winning
	updatedTeams = updatedTeams.map(team => {
		return {
			...team,
			updatedPct: parseFloat((team.combos.length / totalCombosRemaining * 100).toFixed(1))
		}
	});

	// Sort the teams in order of percentage
	updatedTeams.sort(sortTeams);

	return updatedTeams;
}


/**  
 * Find the difference between the original team's position vs the passed position
 * @param { Object } team - The team to look for
 * @param { Object[] } teams - The ORIGINAL order of teams to search
 * @param { Number } currentPick - The current pick this team is slotted at
 * @returns { Number } - The difference between the original team's pick vs the new pick
 * */
const findChangeInPosition = (team, teams, currentPick) => {
	let difference;
	
	for(let i = 0, length = teams.length; i < length; i++){

		// We've found the team, calculate the difference and stop searching 
		if(team.id === teams[i].id){
			difference = (i + 1) - currentPick;
			break;
		}
	}

	return difference;
}

/**  
 * Maps over the list of combos, finds out which number(s) are needed to "win"
 * @param { Array } combos - The array of unique combinations
 * @param { Array } numbersPicked - The array of already selected numbers
 * @returns { Array } - The teams array with combos added.
 * */
const showWinningNumbers = (combos, numbersPicked) => {

	// Map over the array of possible combinations
	let winningNumbers = combos.map((combo) => {
		// Filter the array, return the number if is not included in the numbersPicked array
		// To create a new array
		return combo.filter(number => !numbersPicked.includes(number)).join();
	}, []);

	// Sort the array for consistency 
	winningNumbers = sortCombo(winningNumbers);

	return winningNumbers;

}

export default {
	drawBall,
	recalculateOdds,
	findChangeInPosition,
	showWinningNumbers,
	sortCombo
}
