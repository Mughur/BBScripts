/** @param {NS} ns */
export async function main(ns) {
	//ns.disableLog("ALL");
	ns.clearLog();//Visual clarity
	ns.tail();

	var temp=ns.getPlayer().factions;
	var factions=[];
	var donatable=[];
	var help=false;
	var ignore="NeuroFlux Governor";
	var g="";
	if (ns.gang.inGang()){g=ns.gang.getGangInformation().faction}
	for (var i=0;i<temp.length;i++){
		if (temp[i]!=g){
			factions.push(temp[i]);
		}
	}
	const donation_div=1e6;

	async function list_factions(){
		factions=ns.getPlayer().factions;
		donatable=[];
		for (var i=0;i<factions.length;i++){
			if (ns.getFactionFavor(factions[i])>150){
				donatable.push(factions[i]);
			}
		}
		for (var i=0;i<donatable.length;i++){
			help=false;
			var owned_augs=ns.singularity.getOwnedAugmentations(true);
			var f_augs=ns.getAugmentationsFromFaction(donatable[i]);
			for (var j=0;j<f_augs.length;j++){
				if (f_augs[j]==ignore){
					continue;
				}
				if (!owned_augs.includes(f_augs[j])){
					help=true;
				}
			}
			if (help){
				await donate(donatable[i]);
			}
		}
	}

	async function donate(faction){
		var rep_mult=ns.getPlayer().faction_rep_mult;
		var augs=ns.getAugmentationsFromFaction(faction);
		var owned=ns.singularity.getOwnedAugmentations(true);
		for (var n=0;n<augs.length;n++){
			if (augs[n]==ignore||owned.includes(augs[n])){
				continue;
			}
			if (ns.getAugmentationRepReq(augs[n])>ns.getFactionRep(faction)){
				var amount=(ns.getAugmentationRepReq(augs[n])-ns.getFactionRep(faction))*donation_div/rep_mult
				var p=100*ns.getPlayer().money/amount;
				ns.print(p.toFixed(2)+"% of money for "+faction);
				if (ns.getPlayer().money>amount){
					if (ns.singularity.donateToFaction(faction,amount)){
						ns.tprint("Donated "+amount.toLocaleString('en-GB')+" to "+faction);
					}
				}
				else{
					return;
				}
			}
		}
	}

	while(true){
		ns.clearLog();
		await list_factions();
		await ns.sleep(1000);
	}
}