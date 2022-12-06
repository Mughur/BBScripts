/** @param {NS} ns */
export async function main(ns) {
	ns.tprint(ns.getSharePower())
	await ns.sleep(1000);
	ns.run('share.js',Math.floor((ns.getServerMaxRam('home')-ns.getServerUsedRam('home'))/4))
	await ns.sleep(1000);
	ns.tprint(ns.getSharePower())

}