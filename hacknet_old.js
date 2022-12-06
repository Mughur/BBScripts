/** @param {NS} ns */
export async function main(ns) {
	ns.disableLog("ALL"); ns.clearLog();
	ns.tail();
	var optimal=[-2,-2,9999999999999999999999999];
	var constant=ns.formulas.hacknetNodes.constants();
	var multi=ns.getPlayer().hacknet_node_money_mult
	var options=["Level","Ram","Core"];
	var abs_optimal=[-1,-1,-1,9999999999999999999999999];
	var install_time_h=10;
	if (ns.args.length>0){
		install_time_h=ns.args[0]-1;
	}
	
	async function start(){
		while(ns.hacknet.numNodes()==0){
			var new_n=ns.hacknet.purchaseNode()	
		}
		ns.rm("hacknet_level.txt","home");
		ns.rm("hacknet_ram.txt","home");
		ns.rm("hacknet_core.txt","home");
		var level_costs=[0];
		var ram_costs=[0];
		var core_costs=[0];
		for (let i=1;i<constant.MaxLevel;i++){level_costs.push(ns.hacknet.getLevelUpgradeCost(0,i));}
		for (let i=1;i<Math.log2(constant.MaxRam);i++){ram_costs.push(ns.hacknet.getRamUpgradeCost(0,i));}
		for (let i=1;i<constant.MaxCores;i++){core_costs.push(ns.hacknet.getCoreUpgradeCost(0,i));}
		await ns.write("hacknet_level.txt",level_costs.toString());
		await ns.write("hacknet_ram.txt",ram_costs.toString());
		await ns.write("hacknet_core.txt",core_costs.toString());
	}

	async function calc_optimal(){
		abs_optimal=[-1,-1,-1,1,9999999999999999999999999];
		var level_costs= await ns.read("hacknet_level.txt",level_costs).split(",");
		var core_costs= await ns.read("hacknet_core.txt",core_costs).split(",");
		var ram_costs= await ns.read("hacknet_ram.txt",ram_costs).split(",");
		for (var i=0;i<Math.log2(constant.MaxRam);i++){
			for (var j=0;j<constant.MaxCores;j++){
				for (var k=0;k<constant.MaxLevel;k++){
					var price=parseInt(ram_costs[i]);
					price=price+parseInt(core_costs[j]);
					price=price+parseInt(level_costs[k]);
					price=price+parseInt(ns.hacknet.getPurchaseNodeCost());
					var gain=ns.formulas.hacknetNodes.moneyGainRate(k+1,Math.pow(2,i),j+1,multi);
					var roi=price/gain;
					if (roi<abs_optimal[4]/abs_optimal[3]){
						abs_optimal=[k,i,j,gain,price]
					}
				}
			}
		}
	}

	async function manage(){
		await eval_new();
		await eval_old();
		/*if (optimal[2]>install_time_h*60*60-ns.getTimeSinceLastAug()/1000){
			var time=await s_to_time(optimal[2],1);
			var time_left=await s_to_time(install_time_h*60*60-ns.getTimeSinceLastAug()/1000,1);
			ns.print("ROI:      "+time[0]+"h "+time[1]+"min "+time[2]+"s");
			ns.print("Time left:"+time_left[0]+"h "+time_left[1]+"min "+time_left[2]+"s");
			ns.exit();
		}*/
		if (optimal[0]==-1){
			ns.hacknet.purchaseNode();
			await calc_optimal();
		}
		else if(optimal[1]==0){
			ns.hacknet.upgradeLevel(optimal[0],1);
		}
		else if(optimal[1]==1){
			ns.hacknet.upgradeRam(optimal[0],1);
		}
		else if(optimal[1]==2){
			ns.hacknet.upgradeCore(optimal[0],1);
		}
	}

	async function eval_old(){
		for (var i=0;i<ns.hacknet.numNodes();i++){
			var h_stat=ns.hacknet.getNodeStats(i);
			var base_gain=ns.formulas.hacknetNodes.moneyGainRate(h_stat.level,h_stat.ram,h_stat.cores,multi)
			var temp=[];
			if (h_stat.level==constant.MaxLevel){temp.push(999999999999);}
			else{
				temp.push(ns.hacknet.getLevelUpgradeCost(i,1)/(ns.formulas.hacknetNodes.moneyGainRate(h_stat.level+1,h_stat.ram,h_stat.cores,multi)-base_gain))
			}
			if (h_stat.ram==constant.MaxRam){temp.push(999999999999);}
			else{
				temp.push(ns.hacknet.getRamUpgradeCost(i,1)/(ns.formulas.hacknetNodes.moneyGainRate(h_stat.level,h_stat.ram*2,h_stat.cores,multi)-base_gain))
			}
			if (h_stat.cores==constant.MaxCores){temp.push(999999999999);}
			else{
				temp.push(ns.hacknet.getCoreUpgradeCost(i,1)/(ns.formulas.hacknetNodes.moneyGainRate(h_stat.level,h_stat.ram,h_stat.cores+1,multi)-base_gain))
			}
			for (var n=0;n<3;n++){
				if (temp[n]<optimal[2]){
					optimal=[i,n,temp[n]];
				}
			}
		}
	}

	async function eval_new(){
		var new_time=abs_optimal[4]/abs_optimal[3];
		if (new_time<optimal[2]){
			optimal=[-1,-1,new_time];
		}
	}
	
	async function show(){
		ns.print("next target:");
		if (optimal[0]==-1){
			ns.print("new node");
		}
		else{
			ns.print("node "+optimal[0]+" "+options[optimal[1]]+" upgrade");
		}
		var time=await s_to_time(optimal[2],1);

		if (time[0]>0){
			ns.print("ROI:" +time[0]+"h "+time[1]+"min "+time[2]+"s");
		}
		else if (time[1]>0){
			ns.print("ROI:" +time[1]+"min "+time[2]+"s");
		}
		else {
			ns.print("ROI:" +time[2]+"s");
		}
		var time_left=await s_to_time(install_time_h*60*60-ns.getTimeSinceLastAug()/1000,1)
		ns.print("time left: "+time_left[0]+"h "+time_left[1]+"min "+time_left[2]+"s");
	}

	async function s_to_time(milliseconds,n){
		var time_s=Math.ceil(milliseconds)/n;
		var time_min=Math.floor(time_s/60);
		time_s=time_s-time_min*60;
		var time_h=Math.floor(time_min/60);
		time_min=time_min-time_h*60;
		return([time_h,time_min,time_s]);
	}

	if (ns.hacknet.numNodes()==0){
		await start();
	}
	await calc_optimal();
	while(true){
		ns.clearLog();
		var optimal=[-2,-2,9999999999999999999999999];
		await manage();
		await show();
		await ns.sleep(0);
	}
}