/** @param {NS} ns */
export async function main(ns) {
	ns.disableLog("ALL"); ns.clearLog();//Visual clarity
	ns.tail();
	ns.kill("player.js","home");
	while (ns.getPlayer().numPeopleKilled<30){
		var temp=ns.getPlayer().numPeopleKilled;
		ns.commitCrime("homicide");
		while(ns.isBusy()){
			await ns.sleep(100);
		}
		ns.clearLog();
		ns.print("Kill chance: "+(100*ns.singularity.getCrimeChance("Homicide")).toFixed(1)+"%")
		if (temp!=ns.getPlayer().numPeopleKilled){
			ns.print(ns.getPlayer().numPeopleKilled+"/30, newest kill successful");
		}
		else{
			ns.print(temp+"/30 newest kill fail");
		}
		if (ns.getPlayer().hp<ns.getPlayer().max_hp){
			ns.hospitalize();
		}
	}
	//ns.run('player.js')
	ns.closeTail();
}