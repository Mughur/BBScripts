/** @param {NS} ns */
export async function main(ns) {
	while(true){
		await ns.stanek.chargeFragment(ns.args[0],ns.args[1])
	}
}