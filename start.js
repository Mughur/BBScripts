/** @param {NS} ns */
export async function main(ns) {
	if (ns.getPlayer().hasCorporation==true){
		ns.run("corp.js");
	}
	var help=12;
	if (ns.args.length>0){help=ns.args[0]}
	var programs=["yoink.js","install.js","backdoor.js",
				"faction_controller.js","overview.js",/*"growing.js"*/,"new_hacknet.js"];
	if (ns.singularity.getOwnedAugmentations(true).includes('The Red Pill')){
		ns.run('end_BN.js');
		programs=["yoink.js","install.js","faction_controller.js","simple_gang.js","overview.js",'player.js',"new_hacknet.js","up_study.js"/*,"growing.js"*/];
	}
	if (ns.gang.inGang()){
		ns.run('simple_gang.js',1,help);
	}
	if (ns.getPlayer().factions.includes("BladeBurners")){
		programs.push("bladeBurner.js")
		programs.push("blade_sleeves.js")
	}
	else{
		programs.push("sleeves.ns.js");
	}
	for (var i=0;i<programs.length;i++){
		if (!ns.scriptRunning(programs[i],'home')){
			ns.run(programs[i],1,help,0);
		}
	}
}