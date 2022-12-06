/** @param {NS} ns */
export async function main(ns) {
	for (let s of ns.ls("home",".js")){
		if (ns.read(s).includes("import"))ns.tprint(s)
	}
}