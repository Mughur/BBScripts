/** @param {NS} ns */
export async function main(ns) {
	const cities = ["Sector-12", "Chongqing", "New Tokyo", "Ishima", "Volhaven", "Aevum"];
	let b = ns.bladeburner
	ns.tail(); ns.disableLog("ALL"); ns.clearLog();
	let task = 3;
	let count = [b.getActionCountRemaining('Operations','Assassination'),b.getActionCountRemaining('Operations','Undercover Operation')];
	const startTime = ns.getTimeSinceLastAug();
	const startHour = Math.floor(startTime/1000 / 60 / 60);
	let offset=0;
	let highest = 0;
	for (let i=1;i<ns.sleeve.getNumSleeves();i++){
		if (ns.sleeve.getSleeve(i).storedCycles>ns.sleeve.getSleeve(highest).storedCycles){highest=i}
	}
	while (true) {
		var chaos = false;
		await ns.sleep(0);
		await buySkills();
		await controlSleeves();
		await checkChaos();
		await controlPlayer();
	}
	async function controlPlayer(){
		if(b.getActionEstimatedSuccessChance('Operations', 'Assassination')[0] 
			!= b.getActionEstimatedSuccessChance('Operations', 'Assassination')[1])task=4;
		if (!chaos){
			if (task==1){
				if (b.getActionCountRemaining('Operations','Undercover Operation')>count[1]-5){
					if (b.getCurrentAction().name!='Undercover Operation'){
						let numbers = [b.getActionCountRemaining('Operations','Undercover Operation'),
						b.getActionSuccesses('Operations','Undercover Operation')]
						numbers.push(numbers[0]+numbers[1])
						ns.tprint("Undercover Operation: "+numbers)
						b.startAction('Operations','Undercover Operation');
					}
				}
				else{
					task++;
				}
			}
			else if (task==2){
				if (b.getActionCountRemaining('Operations','Assassination')>count[0]-10000){
					if (b.getCurrentAction().name!='Assassination'){
						let numbers = [b.getActionCountRemaining('Operations','Assassination'),
						b.getActionSuccesses('Operations','Assassination')]
						numbers.push(numbers[0]+numbers[1])
						ns.tprint("Assassination: "+numbers)
						b.startAction('Operations','Assassination');
					}
				}
				else{
					task++;
				}
			}
			else if (task==3){
				if (b.getActionCountRemaining('Operations','Assassination')>1e4){
					task=1;
					ns.print("time to do those operations");
					count = [b.getActionCountRemaining('Operations','Assassination'),b.getActionCountRemaining('Operations','Undercover Operation')];
				}
				else if (b.getCurrentAction().name!='Incite Violence'){
					ns.tprint("Inciting Violence ")
					b.startAction('General','Incite Violence');
				}
			}
			else{
				if(b.getActionEstimatedSuccessChance('Operations', 'Assassination')[0] 
					== b.getActionEstimatedSuccessChance('Operations', 'Assassination')[1])task=3;
				else{
					if (b.getCurrentAction().name!='Undercover Operation'){
						ns.tprint("Improve estimation");
						b.startAction('Operations','Undercover Operation');
					}
				}
			}
		}
	}
	async function buySkills(){
		let n = 1;
		if (b.getActionEstimatedSuccessChance('Operations', 'Undercover Operation')[1] < 1
			|| b.getActionEstimatedSuccessChance('Operations', 'Investigation')[1] < 1
			|| b.getActionEstimatedSuccessChance('Operations', 'Assassination')[1] < 1
		) {
			b.upgradeSkill("Blade's Intuition", n)
			b.upgradeSkill("Cloak", n)
			b.upgradeSkill("Short-Circuit", n)
			b.upgradeSkill("Digital Observer", n)
			b.upgradeSkill("Reaper", n)
			b.upgradeSkill("Evasive System", n)
		}
		while (b.getSkillUpgradeCost("Hyperdrive", n * 2) < b.getSkillPoints()) n *= 2;

		for (let i = n; i >= 1; i /= 2) {
			if (b.getSkillUpgradeCost("Hyperdrive", n + i) < b.getSkillPoints()) n += i;
		}
		if (n >= 1 && b.getSkillUpgradeCost("Hyperdrive", n) < b.getSkillPoints() 
		&& b.getSkillLevel("Hyperdrive")+n > b.getSkillLevel("Hyperdrive")) {
			ns.print("upgraded Hyperdrive by " + n.toExponential(2) + " levels for " + b.getSkillUpgradeCost("Hyperdrive", n).toExponential(2) + " points");
			b.upgradeSkill("Hyperdrive", n);
		}
		n=1;
		while(b.getSkillLevel("Datamancer")+n === b.getSkillLevel("Datamancer"))n*=2;
		b.upgradeSkill("Datamancer", n);
	}
	async function checkChaos() {
		for (let city of cities) {
			if (b.getCityChaos(city) > 1e100) {
				if (b.getCity() != city) b.switchCity(city);
				if (b.getCurrentAction().name != 'Diplomacy') {
					ns.print("reducing chaos in "+city)
					b.startAction('General', 'Diplomacy');
				}
				chaos = true;
				return;
			}
		}
		if (b.getCity() != "Sector-12") b.switchCity("Sector-12")
	}
	async function controlSleeves() {
		let currentTime = ns.getTimeSinceLastAug();
		let currentHour = Math.floor(currentTime/1000 / 60 / 60);
		let difference = currentHour - startHour
		if (offset != difference){
			offset = difference
			for (let i=0;i<ns.sleeve.getNumSleeves();i++){
				if (ns.sleeve.getSleeve(i).storedCycles>ns.sleeve.getSleeve(highest).storedCycles){highest=i}
			}
		}
		for (let i = 0; i < ns.sleeve.getNumSleeves(); i++) {
			if (i == highest) {
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