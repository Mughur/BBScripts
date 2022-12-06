/** @param {NS} ns */
export async function main(ns) {
	const scripts=["get_gang.js","yoink.ns",'up_gym.js','new_hacknet.js','backdoor.ns','faction_controller.js','overview.js']
	var ram=0;
	
	for (var script of scripts){
		ns.run(script);
	}
}