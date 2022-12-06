/** @param {NS} ns */
export async function main(ns) {
	ns.disableLog("ALL");
	//let target="megacorp"
	let servers=["home"]
	for (let s of servers){
		for (let scanned of ns.scan(s)){
			if (!servers.includes(scanned))servers.push(scanned)
		}
	}
	servers.sort((a,b) => ns.getServerMaxMoney(b)-ns.getServerMaxMoney(a))
	let target=servers[0];
	while(true){
		await ns.sleep(100);
		servers.sort((a,b) => ns.getServerMinSecurityLevel(b)-ns.getServerMinSecurityLevel(a))
		ns.print(servers[0]+": "+ ns.getServerMinSecurityLevel(servers[0]))
		//ns.hacknet.spendHashes("Reduce Minimum Security",servers[0],1)
		let i=1;
		while(ns.hacknet.spendHashes("Increase Maximum Money",target,i)){}
		ns.print(ns.getServerMaxMoney(target).toExponential(2))
	}
}