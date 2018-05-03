/**  
 * Gets the lastRan value from local storage
 * @returns { Number || null } - UNIX timestamp of when the user last ran the draft 
 * */
const getLastRan = () => {
	return localStorage.getItem("lastRan");
}

/**  
 * Gets the lastRan value from local storage
 * @param { Number } timestamp - UNIX timestamp of when the user last ran the draft 
 * @returns { Number } - UNIX timestamp of when the user last ran the draft 
 * */
const setLastRan = timestamp => {
	localStorage.setItem("lastRan", timestamp);
	return timestamp;
}

export default {
	getLastRan,
	setLastRan
}
