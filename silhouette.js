/** @param {NS} ns */
export async function main(ns) {
	ns.tail();ns.clearLog();
	while(!ns.getPlayer().factions.includes("Silhouette")){
		if (ns.getPlayer().hacking>300&&ns.getPlayer().charisma>725&&ns.singularity.getCompanyRep("Fulcrum Technologies")>800000){
			ns.singularity.applyToCompany("Fulcrum Technologies","Business");
		}
		await ns.sleep(1000);
	}
}