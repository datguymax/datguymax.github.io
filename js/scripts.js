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

	const tbIds = ["tb-current-prayer-xp", "tb-current-farming-xp", "tb-current-mining-xp", "tb-current-dungeoneering-xp"];
	const tarTypes = ["dd-prayer-target-type", "dd-farming-target-type", "dd-mining-target-type", "dd-dungeoneering-target-type"];
	const tarGoals = ["tb-prayer-goal", "tb-farming-goal", "tb-mining-goal", "tb-dungeoneering-goal"];
	const spnIds = ["spn-days-prayer", "spn-days-farming", "spn-days-mining", "spn-days-dungeoneering"];
	const nodes = [4, 3, 1, 1];
	const cap = [99, 99, 99, 120];

	for (let i = 0; i < tbIds.length; i++) {
		const targetType = document.getElementById(tarTypes[i]).value;
		let currentXP = parseFloat(document.getElementById(tbIds[i]).value);
		let goal;
		let days = 0;

		if (targetType === "xp") {
			goal = parseFloat(document.getElementById(tarGoals[i]).value);
		} else if (targetType === "level") {
			goal = parseFloat(document.getElementById(tarGoals[i]).value).toXP();
		}

		while (currentXP < goal) {
			for (let j = 0; j < nodes[i]; j++) {
				currentXP += nemi(currentXP.toLevel(), cap[i]);
			}
			days++;
		}

		document.getElementById(spnIds[i]).textContent = days.toLocaleString();
	}
}

function getStats() {
	const tbIds = ["tb-current-prayer-xp", "tb-current-farming-xp", "tb-current-mining-xp", "tb-current-dungeoneering-xp"];
	const username = document.getElementById("tb-username").value;
	if (username === "") {
		return;
	}
	fetch(`https://cors-anywhere.herokuapp.com/http://services.runescape.com/m=hiscore/index_lite.ws?player=${username}`)
		.then(res => res.text())
		.then(data => data.split(/[\s\r\n,]+/))
		.then(data => {
			const skills = [parseInt(data[20]), parseInt(data[62]), parseInt(data[47]), parseInt(data[77])];
			for (let i = 0; i < skills.length; i++) {
				document.getElementById(tbIds[i]).value = skills[i];
			}
		}).catch(console.error);
}
