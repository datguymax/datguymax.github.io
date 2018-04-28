/* exported adjustMinMax, calculateDays, getStats */

function adjustMinMax(element) {
	const id = element.id;
	const type = element.value;
	const tb = (id === "dd-prayer-target-type") ? document.getElementById("tb-prayer-goal") :
		(id === "dd-farming-target-type") ? document.getElementById("tb-farming-goal") :
		(id === "dd-mining-target-type") ? document.getElementById("tb-mining-goal") :
		(id === "dd-dungeoneering-target-type") ? document.getElementById("tb-dungeoneering-goal") : null;

	if (tb !== null) {
		if (type === "xp") {
			tb.min = 0;
			tb.max = 200000000;
		} else if (type === "level") {
			tb.min = 1;
			tb.max = 120;
		}
	}
}

function nemi(level, cap) {
	return ((2 / 3) * (Math.pow(Math.min(level, cap), 2) - (2 * Math.min(level, cap)) + 100));
}

function calculateDays() {
	const tbIds = [
		document.getElementById("tb-current-prayer-xp").value,
		document.getElementById("tb-current-farming-xp").value,
		document.getElementById("tb-current-mining-xp").value,
		document.getElementById("tb-current-dungeoneering-xp").value
	];
	const tarTypes = [
		document.getElementById("dd-prayer-target-type").value,
		document.getElementById("dd-farming-target-type").value,
		document.getElementById("dd-mining-target-type").value,
		document.getElementById("dd-dungeoneering-target-type").value
	];
	const tarGoals = [
		document.getElementById("tb-prayer-goal").value,
		document.getElementById("tb-farming-goal").value,
		document.getElementById("tb-mining-goal").value,
		document.getElementById("tb-dungeoneering-goal").value
	];
	const spnIds = [
		document.getElementById("spn-days-prayer"),
		document.getElementById("spn-days-farming"),
		document.getElementById("spn-days-mining"),
		document.getElementById("spn-days-dungeoneering")
	];
	const nodes = [4, 3, 1, 1];
	const cap = [99, 99, 99, 120];

	for (let i = 0; i < tbIds.length; i++) {
		let currentXP = parseFloat(tbIds[i]);
		let goal;
		let days = 0;

		if (tarTypes[i] === "xp") {
			goal = parseFloat(tarGoals[i]);
		} else if (tarTypes[i] === "level") {
			goal = parseFloat(tarGoals[i]).toXP();
		}

		while (currentXP < goal) {
			for (let j = 0; j < nodes[i]; j++) {
				currentXP += nemi(currentXP.toLevel(), cap[i]);
			}
			days++;
		}

		spnIds[i].textContent = days.toLocaleString();
	}
}

function getStats() {
	const tbIds = ["tb-current-prayer-xp", "tb-current-farming-xp", "tb-current-mining-xp", "tb-current-dungeoneering-xp"];
	const username = document.getElementById("tb-username").value;
	if (username === "") { //don't try to fetch empty string
		return;
	}
	fetch(`https://cors-anywhere.herokuapp.com/http://services.runescape.com/m=hiscore/index_lite.ws?player=${username}`) //use cors proxy because of Access-Control-Allow-Origin
		.then(res => res.text()) //convert response object to text data
		.then(data => data.split(/[\s\r\n,]+/)) //split csv by spaces, newlines, and commas into an array
		.then(data => {
			//indicies in hiscore csv for each skill
			const prayIndex = 20;
			const farmIndex = 62;
			const mineIndex = 47;
			const dgIndex = 77;

			//put in ordered array
			const skills = [data[prayIndex], data[farmIndex], data[mineIndex], data[dgIndex]];

			//set value in each xp input
			for (let i = 0; i < skills.length; i++) {
				document.getElementById(tbIds[i]).value = skills[i];
			}
		}).catch(console.error);
}
