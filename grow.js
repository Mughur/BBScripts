/** @param {NS} ns */
export async function main(ns) {
	if (ns.args.length==1){
		await ns.grow(ns.args[0])
	}
	else if (ns.args.length==2){
		await ns.grow(ns.args[0],{stock:true})
	}
	else{
		ns.exit();
	}
}