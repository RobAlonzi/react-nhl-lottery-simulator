const removeLosingCombos = (combos, numbersPicked) => {
	let losingCombos = [],
		availableCombos = [];

	combos.forEach(combo => {
		// Combo still has a chance
		if((numbersPicked.every(number => combo.indexOf(number) > -1))){
			availableCombos.push(combo);
		// Combo can't win
		} else{
			losingCombos.push(combo);
		}
	});

	return {
		losingCombos,
		availableCombos
	}
}

const getTotalCombosRemaining = (teams) => {
	return teams.reduce((prev, team) => {
		return team.combos.length + prev; 
	}, 0);
}

const sortCombo = combo => {
	return combo.slice(0).sort((a, b) => {
		return parseInt(a) > parseInt(b);
	});
}

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

const drawBall = (balls, ballsPicked) => {

	const idx = Math.floor(Math.random() * balls.length);
	const ball = balls[idx];

	return ballsPicked.includes(ball) ? drawBall(balls, ballsPicked) : ball;
}

const recalculateOdds = (teams, numbersPicked) => {

	// Update the teams combos remaining by removing the losing combos
	let updatedTeams = teams.map(team => {

		var combos = removeLosingCombos(team.combos, numbersPicked);

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


const findChangeInPosition = (team, teams, currentPick) => {
	let difference;
	
	for(let i = 0, length = teams.length; i < length; i++){

		if(team.id === teams[i].id){
			difference = (i + 1) - currentPick;
			break;
		}
	}

	return difference;
}

const showWinningNumbers = (combos, numbersPicked) => {
	let winningNumbers = combos.map((combo) => {
		return combo.filter(number => !numbersPicked.includes(number)).join();
	}, []);

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
