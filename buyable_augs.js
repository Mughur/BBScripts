/** @param {NS} ns */
export async function main(ns) {
	ns.tail();ns.disableLog("ALL");
	var factions=ns.getPlayer().factions;
	while(true){
		ns.clearLog();
		factions=ns.getPlayer().factions;
		var owned=ns.singularity.getOwnedAugmentations(true);
		for (let i=0;i<factions.length;i++){
			var augs=ns.singularity.getAugmentationsFromFaction(factions[i]);
			for (var aug of augs){
				if (!owned.includes(aug)){
					if (ns.singularity.getFactionRep(factions[i])>ns.singularity.getAugmentationRepReq(aug)){
						ns.print(ns.singularity.getAugmentationPrice(aug).toExponential(2).padEnd(8)+" - "+factions[i]+": "+aug);
					}
				}
			}
		}
		await ns.sleep(10000);
	}
}