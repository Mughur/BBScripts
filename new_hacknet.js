/** @param {NS} ns */
export async function main(ns) {
	ns.tail();ns.clearLog();ns.disableLog("ALL");
	const upgrades=ns.hacknet.getHashUpgrades();
	const con=ns.formulas.hacknetServers.constants();
	var multi=ns.getPlayer().hacknet_node_money_mult;
	var abs_optimal=[-1,-1,-1,9999999999999999999999999];
	var only_sell=false;
	var end_time=ns.args[0]/4
	var gain=0;
	if (ns.args.length>0){
		if (ns.args[0]==0){
			only_sell=true;
		}
	}

	async function start(){
		ns.rm("hackserver_level.txt","home");
		ns.rm("hackserver_ram.txt","home");
		ns.rm("hackserver_core.txt","home");
		var level_costs=[0];
		var ram_costs=[0];
		var core_costs=[0];
		for (var i=1;i<con.MaxLevel;i++){level_costs.push(ns.formulas.hacknetServers.levelUpgradeCost(1,i,con.UpgradeLevelMult));}
		for (var i=1;i<Math.log2(con.MaxRam);i++){ram_costs.push(ns.formulas.hacknetServers.ramUpgradeCost(1,i,con.UpgradeRamMult));}
		for (var i=1;i<con.MaxCores;i++){core_costs.push(ns.formulas.hacknetServers.coreUpgradeCost(1,i,con.UpgradeCoreMult));}
		await ns.write("hackserver_level.txt",level_costs.toString());
		await ns.write("hackserver_ram.txt",ram_costs.toString());
		await ns.write("hackserver_core.txt",core_costs.toString());
		await calc_optimal();
		await calc_gain();
	}

	async function calc_optimal(){
		var first=ns.hacknet.getNodeStats(0);
		abs_optimal=[-1,-1,-1,1,-1];
		var level_costs= await ns.read("hackserver_level.txt",level_costs).split(",");
		var core_costs= await ns.read("hackserver_core.txt",core_costs).split(",");
		var ram_costs= await ns.read("hackserver_ram.txt",ram_costs).split(",");
		for (var i=0;i<Math.log2(first.ram)+1;i++){
			for (var j=0;j<first.cores+1;j++){
				for (var k=0;k<first.level+1;k++){
					var price=parseInt(ram_costs[i]);
					price=price+parseInt(core_costs[j]);
					price=price+parseInt(level_costs[k]);
					price=price+parseInt(ns.hacknet.getPurchaseNodeCost());
					var gain=ns.formulas.hacknetServers.hashGainRate(k+1,0,Math.pow(2,i),j+1)
					var roi=gain/price;
					if (roi>abs_optimal[3]/abs_optimal[4]){
						abs_optimal=[k,i,j,gain,price]
					}
				}
			}
		}
	}

	async function spend_hashes(){
		return
		ns.hacknet.spendHashes(upgrades[0]);
		let enough=true;
		for (let up of upgrades){
			if (ns.hacknet.hashCost(up)>ns.hacknet.hashCapacity())enough=false;
		}
		if (enough==false){
			let cheapest=[0,ns.hacknet.getCacheUpgradeCost(0,1)];
			for (let i=1;i<ns.hacknet.numNodes();i++){
				if (ns.hacknet.getCacheUpgradeCost(i,1)<cheapest[1])cheapest=[i,ns.hacknet.getCacheUpgradeCost(i,1)]
			}
			try{ns.hacknet.upgradeCache(cheapest[0],1)}catch{}
		}

		ns.hacknet.spendHashes(upgrades[1]);
		ns.hacknet.spendHashes(upgrades[6]);
	}

	async function upgrade(){
		for (let i=0;i<ns.hacknet.numNodes();i++){
			let cur_stats=ns.hacknet.getNodeStats(i);
			let gains=[ns.formulas.hacknetServers.hashGainRate(cur_stats.level,cur_stats.ramUsed,cur_stats.ram,cur_stats.cores)];
			gains.push(ns.formulas.hacknetServers.hashGainRate(cur_stats.level+1,cur_stats.ramUsed,cur_stats.ram,cur_stats.cores))
			gains.push(ns.formulas.hacknetServers.hashGainRate(cur_stats.level,cur_stats.ramUsed,cur_stats.ram*2,cur_stats.cores))
			gains.push(ns.formulas.hacknetServers.hashGainRate(cur_stats.level,cur_stats.ramUsed,cur_stats.ram,cur_stats.cores+1))
			let costs=[ns.hacknet.getLevelUpgradeCost(i)]
			costs.push(ns.hacknet.getRamUpgradeCost(i))
			costs.push(ns.hacknet.getCoreUpgradeCost(i))
			for (let j=0;j<3;j++){
				if ((gains[j+1]-gains[0])/costs[j]>path[0]){
					path=[(gains[j+1]-gains[0])/costs[j],i,j];
				}
			}
		}
	}
	
	async function buy_stuff(){
		ns.print("new node score: "+(abs_optimal[3]/abs_optimal[4]).toExponential(2))
		ns.print("purchase score: "+path[0].toExponential(2))
		var help=-1
		if (path[2]==-1){
			ns.print("Target: new node")
			let cost=ns.hacknet.getPurchaseNodeCost()
			ns.print("cost: "+cost.toExponential(2))
			let time=(cost-ns.hacknet.numHashes()/4*1000000-ns.getPlayer().money)/(gain/4*1000000);
			ns.print("estimated time until: "+time.toFixed())
			help=ns.hacknet.purchaseNode();
			if (help!=-1){ns.print("bought new node");}
		}
		if (path[2]==0){
			ns.print("Target: node "+path[1]+" level");
			let cost=ns.hacknet.getLevelUpgradeCost(path[1])
			ns.print("cost: "+cost.toExponential(2))
			let time=(cost-ns.hacknet.numHashes()/4*1000000-ns.getPlayer().money)/(gain/4*1000000);
			ns.print("estimated time until: "+time.toFixed())
			help=ns.hacknet.upgradeLevel(path[1]);
			if (help){ns.print("upgraded "+path[1]+" level. "+path[0].toExponential(2)+"/"+(abs_optimal[3]/abs_optimal[4]).toExponential(2))}
		}
		if (path[2]==1){
			ns.print("Target: node "+path[1]+" ram");
			let cost=ns.hacknet.getRamUpgradeCost(path[1])
			ns.print("cost: "+cost.toExponential(2))
			let time=(cost-ns.hacknet.numHashes()/4*1000000-ns.getPlayer().money)/(gain/4*1000000);
			ns.print("estimated time until: "+time.toFixed())
			help=ns.hacknet.upgradeRam(path[1]);
			if (help){ns.print("upgraded "+path[1]+" ram.   "+path[0].toExponential(2)+"/"+(abs_optimal[3]/abs_optimal[4]).toExponential(2))}
		}
		if (path[2]==2){
			ns.print("Target: node "+path[1]+" core");
			let cost=ns.hacknet.getCoreUpgradeCost(path[1])
			ns.print("cost: "+cost.toExponential(2))
			let time=(cost-ns.hacknet.numHashes()/4*1000000-ns.getPlayer().money)/(gain/4*1000000);
			ns.print("estimated time until: "+time.toFixed())
			help=ns.hacknet.upgradeCore(path[1]);
			if (help){ns.print("upgraded "+path[1]+" core.  "+path[0].toExponential(2)+"/"+(abs_optimal[3]/abs_optimal[4]).toExponential(2))}
		}
		
		if (help==true||help>0){
			await calc_optimal();
		}
	}

	async function calc_gain(){
		gain=0;
		for (let i=0;i<ns.hacknet.numNodes();i++){
			gain+=ns.hacknet.getNodeStats(i).production;
		}
	}

	var path=[-1,-1,-1];
	while(ns.hacknet.numNodes()==0){
		ns.hacknet.purchaseNode();
		await ns.sleep(100);
	}
	await start();
	while(true){
		await calc_gain();
		ns.clearLog();
		ns.print((gain/4*1_000_000).toExponential(2)+" per second")
		ns.print(ns.tFormat(1000*(150_000_000_000-ns.getPlayer().money)/(gain/4*1_000_000))+" till corp")
		if (ns.getTimeSinceLastAug()/1000/60/60>end_time){
			
			ns.closeTail();
			ns.exit();
		}
		await spend_hashes();
		var path=[abs_optimal[3]/abs_optimal[4],-1,-1]

		await upgrade();
		await buy_stuff();
		for (let i=0;i<ns.hacknet.numNodes();i++){
			try{ns.hacknet.upgradeCache(i,1)}catch{}
			try{ns.hacknet.upgradeCore(i,1)}catch{}
			try{ns.hacknet.upgradeLevel(i,1)}catch{}
			try{ns.hacknet.upgradeRam(i,1)}catch{}
		}
		await ns.sleep(0);
	}
}