/** @param {NS} ns */
export async function main(ns) {
	for (let i=0;i<Math.log2(ns.getPurchasedServerMaxRam());i++){
		ns.tprint("2^"+i+"("+Math.pow(2,i)+"): "+ns.getPurchasedServerCost(Math.pow(2,i)).toExponential(2))
	}
}