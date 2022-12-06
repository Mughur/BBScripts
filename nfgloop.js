/** @param {NS} ns */
export async function main(ns) {
	ns.run("new_hacknet.js")
	ns.run("corp.js");
	ns.run("buyback.js");
	ns.run("gang.js");
	ns.run("intGrind.js");
	//ns.run("up_blade.js");
	let bought=0;
	let faction="Blade Industries"
	let c = eval("ns.corporation");
	while(!ns.getPlayer().factions.includes(faction)){
		try{ns.singularity.joinFaction(faction);}catch{}
		await ns.sleep(10);
	}
	while(true){
		let help=true;
		while(help){
			help=false
			let donation = ns.formulas.reputation.repFromDonation(1e10,ns.getPlayer())

			let repReg = [ns.singularity.getAugmentationRepReq("NeuroFlux Governor"), ns.singularity.getFactionRep(faction)];
			if (repReg[1] < repReg[0]) try {ns.singularity.donateToFaction(faction,(repReg[0]-repReg[1])/donation*1e10) } catch {}
			try{if(ns.singularity.purchaseAugmentation(faction, "NeuroFlux Governor")){bought++;help=true;} } catch {}
		}
		if (bought>=1){
			await ns.sleep(1000)
			ns.singularity.installAugmentations("nfgloop.js");
		}
		await ns.sleep(1000);
	}
}