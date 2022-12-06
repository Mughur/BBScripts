/** @param {NS} ns */
export async function main(ns) {
	let allServers=['home']
	for (let server of allServers){
		for (let scanned of ns.scan(server)){
			if (!allServers.includes(scanned))allServers.push(scanned);
		}
	}
	while(ns.getServerSecurityLevel("joesguns")>ns.getServerMinSecurityLevel("joesguns")){
		for (let server of allServers){
			let threads=Math.floor((ns.getServerMaxRam(server)-ns.getServerUsedRam(server))/1.75)
			if (threads==0)continue;
			await ns.scp("inf_weak.js",server);
			ns.exec("inf_weak.js",server,threads,"joesguns")
		}
		await ns.sleep(1000);
	}
	for (let server of allServers){
		ns.scriptKill("inf_weak.js",server);
	}
	while(ns.getServerMoneyAvailable("joesguns")<ns.getServerMaxMoney("joesguns")){
		for (let server of allServers){
			let threads=Math.floor((ns.getServerMaxRam(server)-ns.getServerUsedRam(server))/1.75)
			if (threads==0)continue;
			await ns.scp("inf_grow.js",server);
			ns.exec("inf_grow.js",server,threads,"joesguns")
		}
		await ns.sleep(1000);
	}
	for (let server of allServers){
		ns.scriptKill("inf_grow.js",server);
	}
	while(ns.getServerSecurityLevel("joesguns")>ns.getServerMinSecurityLevel("joesguns")){
		for (let server of allServers){
			let threads=Math.floor((ns.getServerMaxRam(server)-ns.getServerUsedRam(server))/1.75)
			if (threads==0)continue;
			ns.exec("inf_weak.js",server,threads,"joesguns")
		}
		await ns.sleep(1000);
	}
	for (let server of allServers){
		let threads=Math.floor((ns.getServerMaxRam(server)-ns.getServerUsedRam(server))/1.75)
		if (threads==0)continue;
		ns.exec("inf_grow.js",server,threads,"joesguns")
	}
}