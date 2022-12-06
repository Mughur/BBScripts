/** @param {NS} ns */
export async function main(ns) {
	try{if (ns.hacknet.hashCapacity()==0){ns.run('new_hacknet.js',1,ns.args[0]);}}catch{ns.run('new_hacknet.js',1,12);}
	await ns.sleep(1000);
	ns.tail();ns.disableLog("ALL");ns.clearLog();
	var a=0;
	while(true){
		ns.clearLog();
		var rank=ns.hacknet.hashCost("Exchange for Bladeburner Rank");
		var point=ns.hacknet.hashCost("Exchange for Bladeburner SP")
		if (ns.hacknet.hashCapacity()<ns.hacknet.hashCost("Exchange for Bladeburner Rank")){
			var min=[0,99999999999];
			for (let i=0;i<ns.hacknet.numNodes();i++){
				if (ns.hacknet.getNodeStats(i).hashCapacity<min[1]){
					min=[i,ns.hacknet.getNodeStats(i).hashCapacity];
				}
			}
			if (ns.getPlayer().money/10>ns.hacknet.getCacheUpgradeCost(min[0],1)){
				ns.hacknet.upgradeCache(min[0],1)
			}
		}
		ns.print(rank+"/"+point)
		ns.print((rank/point).toFixed(2)+"/"+(1/3*10).toFixed(2))
		if (rank/3<point){
			ns.hacknet.spendHashes("Exchange for Bladeburner Rank")
			ns.hacknet.spendHashes("Exchange for Bladeburner SP")
		}
		else{
			ns.hacknet.spendHashes("Exchange for Bladeburner SP")
			ns.hacknet.spendHashes("Exchange for Bladeburner Rank")
		}
		if (ns.hacknet.hashCapacity()<ns.hacknet.hashCost("Exchange for Bladeburner Rank")){
			ns.hacknet.spendHashes("Sell for Money")
		}
		/*if(a==0){
			ns.hacknet.spendHashes("Exchange for Bladeburner Rank")
			ns.hacknet.spendHashes("Exchange for Bladeburner SP")
			a++;
		}else{
			ns.hacknet.spendHashes("Exchange for Bladeburner SP")
			ns.hacknet.spendHashes("Exchange for Bladeburner Rank")
			a=0;;
		}*/
		
		await ns.sleep(0);
	}
}