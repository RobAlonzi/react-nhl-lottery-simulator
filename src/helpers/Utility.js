const getLastRan = () => {
	return localStorage.getItem("lastRan");
}

const setLastRan = timestamp => {
	localStorage.setItem("lastRan", timestamp);
	return timestamp;
}

export default {
	getLastRan,
	setLastRan
}
