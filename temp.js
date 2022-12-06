/** @param {NS} ns */
export async function main(ns) {
	var task=-1;
	ns.disableLog("ALL");ns.tail();
	for (let i=1;i<8;i++){ns.sleeve.setToCommitCrime(i,"Homicide")}
	while(ns.heart.break()>-54000){
		ns.clearLog();
		var stats=[[ns.sleeve.getSleeveStats(0).strength,"Strength"]];
		stats.push([ns.sleeve.getSleeveStats(0).defense,"Defense"])
		stats.push([ns.sleeve.getSleeveStats(0).dexterity,"Dexterity"])
		stats.push([ns.sleeve.getSleeveStats(0).agility,"Agility"])
		var help=[stats[0][0],stats[1][0],stats[2][0],stats[3][0]]
		ns.print(help)
		for (let i=0;i<4;i++){
			if (stats[i][0]==Math.min(stats[0][0],stats[1][0],stats[2][0],stats[3][0])){
				if (task!=i){
					ns.sleeve.setToGymWorkout(0,"Powerhouse Gym",stats[i][1]);
					task=i;
				}
				break;
			}
		}
	
		if (task==0){ns.print("training str")}
		if (task==1){ns.print("training def")}
		if (task==2){ns.print("training dex")}
		if (task==3){ns.print("training agi")}
		await ns.sleep(0);
	}
	for (var i=0;i<8;i++){
		ns.sleeve.setToShockRecovery(i);
	}
	ns.run('sleeve.js');
	while (!ns.gang.inGang()){
		ns.print("a")
		if (ns.getPlayer().factions.includes("NiteSec")){
		ns.print("b")
			ns.gang.createGang("NiteSec");
			ns.run('gang.js');
		}
		else if (ns.getPlayer().factions.includes("Slum Snakes")){
		ns.print("c")
			ns.gang.createGang("Slum Snakes")
			ns.run('simple_gang.js');
		}
	}
}