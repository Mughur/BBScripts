/** @param {NS} ns */
export async function main(ns) {
	let servers=["home"];
	for (let s of servers){
		for (let scanned of ns.scan(s)){
			if(!servers.includes(scanned))servers.push(scanned);
		}
	}
	let hasRam=0;
	for (let s of servers){
		if (ns.getPurchasedServers().includes(s))continue;
		if (s.includes("node"))continue;
		if (ns.getServerMaxRam(s)>0)hasRam++;
	}

	ns.tprint(hasRam);
}