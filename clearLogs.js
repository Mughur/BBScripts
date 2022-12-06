/** @param {NS} ns */
export async function main(ns) {
	for (let file of ns.ls("home")){
		if(file.includes("log16"))ns.rm(file);
	}
}