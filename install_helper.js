/** @param {NS} ns */
export async function main(ns) {
	while(ns.scriptRunning(ns.args[0],'home')){
		await ns.sleep(0);
	}
	ns.singularity.installAugmentations();
}