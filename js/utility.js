const MAX_XP = 200000000;
const MAX_LEVEL = 126;

Number.prototype.toLevel = function() {
	const valueOf = Math.round(this.valueOf());
	if (valueOf <= 0 || valueOf >= MAX_XP) {
		return (valueOf <= 0) ? 1 : MAX_XP;
	}
	for (let i = 1; i <= MAX_LEVEL + 1; i++) {
		if (valueOf >= i.toXP() && valueOf < (i + 1).toXP()) {
			return i;
		}
	}
};
Number.prototype.toXP = function() {
	const valueOf = Math.round(this.valueOf());
	let totalXP = 0;
	if (valueOf <= 1 || valueOf >= MAX_LEVEL + 1) {
		return (valueOf <= 1) ? 0 : MAX_XP;
	}
	if (typeof Number.prototype.toXP.arrayOfXP === "undefined") {
		Number.prototype.toXP.arrayOfXP = new Array();
		for (let i = 1; i <= MAX_LEVEL - 1; i++) {
			Number.prototype.toXP.arrayOfXP[i + 1] = Math.floor((totalXP += Math.floor(i + 300 * (Math.pow(2, (i / 7))))) / 4);
		}
	}
	return Number.prototype.toXP.arrayOfXP[valueOf];
};
