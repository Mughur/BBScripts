/** @param {NS} ns */
export async function main(ns) {
	ns.tail();ns.disableLog("ALL");
	while(true){
		if (ns.hacknet.hashCapacity()/2<ns.hacknet.hashCost("Improve Studying")){
			var min=[0,99999999999];
			for (let i=0;i<ns.hacknet.numNodes();i++){
				if (ns.hacknet.getNodeStats(i).hashCapacity<min[1]){
					min=[i,ns.hacknet.getNodeStats(i).hashCapacity];
				}
			}
			if (ns.getPlayer().money>ns.hacknet.getCacheUpgradeCost(min[0],1)*10){
				ns.hacknet.upgradeCache(min[0],1)
			}
		}
		if(ns.hacknet.spendHashes("Improve Studying")){
			ns.print(ns.hacknet.getHashUpgradeLevel("Improve Studying"));
		}
		await ns.sleep(0);
	}
}