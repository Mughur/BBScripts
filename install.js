/** @param {NS} ns */
export async function main(ns) {
	ns.tail();ns.disableLog("ALL");ns.clearLog();
	var time_limit=12;
	try{if(ns.args.length>0){time_limit=ns.args[0]}}catch{}
	await ns.write('PID_install.txt',time_limit,"w")
	var all_that_matters="NeuroFlux Governor";
	var time=[0,0,ns.getTimeSinceLastAug()/1000];
	time[1]=Math.floor(time[2]/60);
	time[0]=Math.floor(time[1]/60);
	time[2]=Math.floor(time[2]-time[1]*60)
	time[1]=time[1]-time[0]*60;
	ns.print(time[0]+"h "+time[1]+"min "+time[2]+"s/"+time_limit+"h");	
	while (ns.getTimeSinceLastAug()<time_limit*60*60*1000){
		ns.clearLog();
		ns.print(time_limit);
		var time=[0,0,ns.getTimeSinceLastAug()/1000];
		time[1]=Math.floor(time[2]/60);
		time[0]=Math.floor(time[1]/60);
		time[2]=Math.floor(time[2]-time[1]*60)
		time[1]=time[1]-time[0]*60;
		ns.print(time[0]+"h "+time[1]+"min "+time[2]+"s/"+time_limit+"h");
		await ns.sleep(10);
		if (ns.singularity.getOwnedAugmentations(true).includes("The Red Pill")&&!ns.singularity.getOwnedAugmentations(false).includes("The Red Pill")){
			ns.run('manual_install.js');
		}
	}
	ns.singularity.stopAction();
	ns.killall('home',true)
	var factions=ns.getPlayer().factions;

	async function buy_next(){
		var most_expensive=[0,"",""];
		var owned=ns.singularity.getOwnedAugmentations(true);
		for (var i=0;i<factions.length;i++){
			var augs=ns.singularity.getAugmentationsFromFaction(factions[i]);
			for (var j=0;j<augs.length;j++){
				if (owned.includes(augs[j])&&owned!=all_that_matters){
					continue;
				}
				if (ns.singularity.getAugmentationRepReq(augs[j])<ns.singularity.getFactionRep(factions[i])&&
					ns.singularity.getAugmentationPrice(augs[j])<ns.getPlayer().money&&
					ns.singularity.getAugmentationPrice(augs[j])>most_expensive[0]){
						most_expensive=[ns.singularity.getAugmentationPrice(augs[j]),augs[j],factions[i]];
					}
			}
		}
		if (most_expensive[0]==0){
			return false;
		}
		ns.singularity.purchaseAugmentation(most_expensive[2],most_expensive[1]);
		return true;
	}
	while(await buy_next()){
		await ns.sleep(10);
	}

	var highest=[0,""];
	for (var i=0;i<factions.length;i++){
		if (ns.gang.inGang()){if(ns.gang.getGangInformation().faction==factions[i]){continue;}}
		if (ns.singularity.getFactionRep(factions[i])>highest[0]){
			highest=[ns.singularity.getFactionRep(factions[i]),factions[i]];
		}
	}
	while (ns.singularity.getAugmentationPrice(all_that_matters)<ns.getPlayer().money&&ns.singularity.getAugmentationRepReq(all_that_matters)<ns.singularity.getFactionRep(highest[1])){
		ns.singularity.purchaseAugmentation(highest[1],all_that_matters);
	}
	ns.run('install_helper.js',1,ns.getScriptName());
	ns.spawn("start.js",1,Math.max(time_limit*3/5,1));
}