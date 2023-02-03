/** @param {NS} ns */
export async function main(ns) {
	const cities = ["Sector-12", "Chongqing", "New Tokyo", "Ishima", "Volhaven", "Aevum"];
	ns.tail(); ns.disableLog("ALL"); ns.clearLog();
	let task = 3;
	let count = [ns.bladeburner.getActionCountRemaining('Operations','Assassination'),ns.bladeburner.getActionCountRemaining('Operations','Undercover Operation')];
	const startTime = ns.getTimeSinceLastAug();
	const startHour = Math.floor(startTime/1000 / 60 / 60);
	while (true) {
		var chaos = false;
		await ns.sleep(0);
		await buySkills();
		await controlSleeves();
		await checkChaos();
		if (!chaos){
			if (task==1){
				if (ns.bladeburner.getCurrentAction().name!='Undercover Operation'){
					if (ns.bladeburner.getActionCountRemaining('Operations','Undercover Operation')>count[1]-10){
						ns.bladeburner.startAction('Operations','Undercover Operation');
					}
					else{
						task++;
					}
				}
			}
			else if (task==2){
				if (ns.bladeburner.getCurrentAction().name!='Assassination'){
					if (ns.bladeburner.getActionCountRemaining('Operations','Assassination')>count[0]-10000){
						ns.bladeburner.startAction('Operations','Assassination');
					}
					else{
						task++;
					}
				}
			}
			else if (task==3){
				if (ns.bladeburner.getCurrentAction().name!='Incite Violence'){
					ns.bladeburner.startAction('General','Incite Violence');
				}
				if (ns.bladeburner.getActionCountRemaining('Operations','Assassination')>1e4){
					task=1;
					ns.print("time to do those operations");
					count = [ns.bladeburner.getActionCountRemaining('Operations','Assassination'),ns.bladeburner.getActionCountRemaining('Operations','Undercover Operation')];
				}
			}
		}
		async function buySkills(){
			let n = 1;
			if (ns.bladeburner.getActionEstimatedSuccessChance('Operations', 'Undercover Operation')[1] < 1
				|| ns.bladeburner.getActionEstimatedSuccessChance('Operations', 'Investigation')[1] < 1
				|| ns.bladeburner.getActionEstimatedSuccessChance('Operations', 'Assassination')[1] < 1
			) {
				ns.bladeburner.upgradeSkill("Blade's Intuition", n)
				ns.bladeburner.upgradeSkill("Cloak", n)
				ns.bladeburner.upgradeSkill("Short-Circuit", n)
				ns.bladeburner.upgradeSkill("Digital Observer", n)
				ns.bladeburner.upgradeSkill("Reaper", n)
				ns.bladeburner.upgradeSkill("Evasive System", n)
			}
			while (ns.bladeburner.getSkillUpgradeCost("Hyperdrive", n * 2) < ns.bladeburner.getSkillPoints()) n *= 2;

			for (let i = n; i >= 1; i /= 2) {
				if (ns.bladeburner.getSkillUpgradeCost("Hyperdrive", n + i) < ns.bladeburner.getSkillPoints()) n += i;
			}
			if (n >= 1 && ns.bladeburner.getSkillUpgradeCost("Hyperdrive", 1) < ns.bladeburner.getSkillPoints()) {
				ns.print("upgraded Hyperdrive by " + ns.nFormat(n, "0,0") + " levels for " + ns.bladeburner.getSkillUpgradeCost("Hyperdrive", n).toExponential(2) + " points");
				ns.bladeburner.upgradeSkill("Hyperdrive", n);
			}
		}
	}
	async function checkChaos() {
		for (let city of cities) {
			if (ns.bladeburner.getCityChaos(city) > 1e100) {
				if (ns.bladeburner.getCity() != city) ns.bladeburner.switchCity(city);
				if (ns.bladeburner.getCurrentAction().name != 'Diplomacy') {
					ns.print("reducing chaos in "+city)
					ns.bladeburner.startAction('General', 'Diplomacy');
				}
				chaos = true;
				return;
			}
		}
		if (ns.bladeburner.getCity() != "Sector-12") ns.bladeburner.switchCity("Sector-12")
	}
	async function controlSleeves() {
		let currentTime = ns.getTimeSinceLastAug();
		let currentHour = Math.floor(currentTime/1000 / 60 / 60);
		let difference = currentHour - startHour 
		let n = difference % 8;
		for (let i = 0; i < ns.sleeve.getNumSleeves(); i++) {
			if (i == n) {
				if (ns.sleeve.getTask(i) == null) ns.sleeve.setToBladeburnerAction(i, "Infiltrate synthoids");
				if (ns.sleeve.getTask(i).type != "INFILTRATE") ns.sleeve.setToBladeburnerAction(i, "Infiltrate synthoids");
			}
			else {
				if (ns.sleeve.getTask(i) != null) {
					ns.sleeve.setToShockRecovery(i);
				}
			}
		}
	}
}