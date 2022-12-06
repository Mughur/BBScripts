/** @param {NS} ns */
export async function main(ns) {
	ns.tail();ns.disableLog("ALL");ns.clearLog();
	for (let i=0;i<ns.sleeve.getNumSleeves();i++){
		ns.sleeve.setToCommitCrime(i, "MUG"); 
	}
	for (let i=0;i<ns.sleeve.getNumSleeves();i++){
		ns.sleeve.setToBladeburnerAction(i, "Infiltrate synthoids");
		await ns.sleep(1000);
	}
	let task=3;
	while(true){
		await ns.sleep(0);
		if (task==0){
			if (ns.bladeburner.getCurrentAction().name!='Investigation'){
				if (ns.bladeburner.getActionCountRemaining('Operations','Investigation')>10){
					ns.bladeburner.startAction('Operations','Investigation');
				}
				else{
					task++;
				}
			}
		}
		else if (task==1){
			if (ns.bladeburner.getCurrentAction().name!='Undercover Operation'){
				if (ns.bladeburner.getActionCountRemaining('Operations','Undercover Operation')>10){
					ns.bladeburner.startAction('Operations','Undercover Operation');
				}
				else{
					task++;
				}
			}
		}
		else if (task==2){
			if (ns.bladeburner.getCurrentAction().name!='Assassination'){
				if (ns.bladeburner.getActionCountRemaining('Operations','Assassination')>10){
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
			if (ns.bladeburner.getActionCountRemaining('Operations','Assassination')>2e3){
				task++;
				ns.print("time to do those operations");
			}
		}
		else if (task==4){
			if (ns.bladeburner.getCityChaos(ns.bladeburner.getCity())<1)task=1;
			else if (ns.bladeburner.getCurrentAction().name!='Diplomacy'){
				ns.bladeburner.startAction('General','Diplomacy');
			}
		}
		else{
			if (ns.bladeburner.getCityChaos(ns.bladeburner.getCity())<1)task=1;
			else if (ns.bladeburner.getCurrentAction().name!='Diplomacy'){
				ns.bladeburner.startAction('General','Diplomacy');
			}
		}
		let n=1;
		if (ns.bladeburner.getActionEstimatedSuccessChance('Operations','Undercover Operation')[1]<1
		||ns.bladeburner.getActionEstimatedSuccessChance('Operations','Investigation')[1]<1
		||ns.bladeburner.getActionEstimatedSuccessChance('Operations','Assassination')[1]<1
		){
			ns.bladeburner.upgradeSkill("Blade's Intuition",n)
			ns.bladeburner.upgradeSkill("Cloak",n)
			ns.bladeburner.upgradeSkill("Short-Circuit",n)
			ns.bladeburner.upgradeSkill("Digital Observer",n)
			ns.bladeburner.upgradeSkill("Reaper",n)
			ns.bladeburner.upgradeSkill("Evasive System",n)
		}
		while(ns.bladeburner.getSkillUpgradeCost("Hyperdrive",n*2)<ns.bladeburner.getSkillPoints())n*=2;

		for (let i=n;i>=1;i/=2){
			if (ns.bladeburner.getSkillUpgradeCost("Hyperdrive",n+i)<ns.bladeburner.getSkillPoints())n+=i;
		}
		if (n>=1 && ns.bladeburner.getSkillUpgradeCost("Hyperdrive",1)<ns.bladeburner.getSkillPoints()){
			ns.print("upgraded Hyperdrive by "+ns.nFormat(n,"0,0")+" levels for "+ns.bladeburner.getSkillUpgradeCost("Hyperdrive",n).toExponential(2)+" points");
			ns.bladeburner.upgradeSkill("Hyperdrive",n);
		}
	}
}