/** @param {NS} ns */
export async function main(ns) {
	ns.tail();ns.disableLog("ALL");ns.clearLog();
	while(true){
		await ns.sleep(0);
		ns.clearLog();
		let gAugs=ns.grafting.getGraftableAugmentations();
		let list=[];

		for (let aug of gAugs){
			//if(!(ns.singularity.getAugmentationStats(aug).hacking_mult>0))continue;//||ns.singularity.getAugmentationStats(aug).hacking_speed_mult>0))continue
			list.push([aug,ns.grafting.getAugmentationGraftTime(aug),ns.grafting.getAugmentationGraftPrice(aug)])			
		}
		//list=list.sort((a,b) => a[2]/a[1] - b[2]/b[1])
		list=list.sort((a,b)=> a[1]-b[1])
		for (let aug of list){
			ns.print(aug[0].padStart(54)+": "+aug[2].toExponential(2)+"/"+ns.tFormat(aug[1]))
		}
		
		var time=[ns.getTimeSinceLastAug(),0,list[0][1]]
		ns.read("saveAmount.txt");
		if (ns.singularity.isBusy()==true){await ns.write("saveAmount.txt",0,"w");}
		while(ns.singularity.isBusy()==true){
			time[1]=ns.getTimeSinceLastAug()-time[0]

			ns.print(list[0][0]+": "+ns.tFormat(time[1])+"/"+ns.tFormat(time[2]))
			await ns.sleep(1000);
			ns.clearLog();
		}
		//if (ns.singularity.getOwnedAugmentations().includes(gAugs[gAugs.length-1]))ns.exit();
		var stonk_gain=ns.getScriptIncome("stonks.js","home")
		ns.print((list[0][2]/list[0][1]*900).toExponential(2)+" / "+stonk_gain.toExponential(2))
		if (list[0][2]/list[0][1]*900<stonk_gain){
			await ns.write("saveAmount.txt",list[0][2],"w");
			ns.grafting.graftAugmentation(list[0][0]);
		}
		else{
			await ns.write("saveAmount.txt",0,"w");
		}
		ns.args
	}
}