/** @param {NS} ns */
export async function main(ns) {
	ns.tail();ns.disableLog("ALL");ns.clearLog();
	var tasks=["","","","","","","",""]
	ns.sleeve.setToGymWorkout(0,"Powerhouse Gym","strength");
	ns.sleeve.setToGymWorkout(1,"Powerhouse Gym","defense");
	ns.sleeve.setToGymWorkout(2,"Powerhouse Gym","dexterity");
	ns.sleeve.setToGymWorkout(3,"Powerhouse Gym","agility");
	while (true){
		var stats=ns.getPlayer();
		var min=Math.min(stats.agility,stats.strength,stats.defense,stats.dexterity);
		var scale=Math.ceil(min/30)*30
		for (var i=4;i<8;i++){
			 if (stats.strength<scale){
				if (tasks[i]!="str"){
					ns.sleeve.setToGymWorkout(i,"Powerhouse Gym","strength");
					tasks[i]="str"
				}
			}
			else if (stats.defense<scale){
				if (tasks[i]!="def"){
					ns.sleeve.setToGymWorkout(i,"Powerhouse Gym","defense");
					tasks[i]="def"
				}
			}
			else if (stats.dexterity<scale){
				if (tasks[i]!="dex"){
					ns.sleeve.setToGymWorkout(i,"Powerhouse Gym","dexterity");
					tasks[i]="dex"
				}
			}
			else {
				if (tasks[i]!="agi"){
					ns.sleeve.setToGymWorkout(i,"Powerhouse Gym","agility");
					tasks[i]="agi"
				}
			}
		}
		await ns.sleep(0);
	}
}