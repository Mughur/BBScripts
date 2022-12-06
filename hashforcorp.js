/** @param {NS} ns */
export async function main(ns) {
	while(true){
		if (ns.hacknet.hashCost(ns.hacknet.getHashUpgrades()[1])<ns.hacknet.hashCapacity()){
			ns.hacknet.spendHashes(ns.hacknet.getHashUpgrades()[1])
		}
		else if (ns.hacknet.hashCost(ns.hacknet.getHashUpgrades()[6])<ns.hacknet.hashCapacity()){
			ns.hacknet.spendHashes(ns.hacknet.getHashUpgrades()[6])
		}
		else{
			let smallest = [-1,1e100];
			for (let i=0;i<ns.hacknet.numNodes();i++){
				if (ns.hacknet.getNodeStats(i).hashCapacity<smallest[1])smallest=[i,ns.hacknet.getNodeStats(i).hashCapacity]
			}
			try{ns.hacknet.upgradeCache(smallest[0],1)}catch{}
			ns.hacknet.spendHashes(ns.hacknet.getHashUpgrades()[0])
		}
		await ns.sleep(100);
	}
}