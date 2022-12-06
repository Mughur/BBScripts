/** @param {NS} ns */
export async function main(ns) {
	ns.tail();ns.clearLog();ns.disableLog("ALL");
	const allServers=["home"];
	for (let server of allServers){
		if (server=="The-Cave")continue
		for (let scanned of ns.scan(server)){
			if (scanned.includes("server"))continue;
			if (scanned.includes("node"))continue;
			if (!allServers.includes(scanned))allServers.push(scanned);
		}
	}
	let bd=[0,0,allServers.length];
	allServers.shift();
	while (true){
		bd=[0,0,allServers.length]
		ns.clearLog();
		for (let server of allServers){
			try{ns.brutessh(server)}catch{}
			try{ns.ftpcrack(server)}catch{}
			try{ns.sqlinject(server)}catch{}
			try{ns.httpworm(server)}catch{}
			try{ns.relaysmtp(server)}catch{}
			try{ns.nuke(server)}catch{}
			if (ns.getServer(server).backdoorInstalled==true){bd[0]++;bd[1]++;continue;}
			if (ns.getServer(server).hasAdminRights==false)continue;
			bd[0]++;
			if (ns.getServer(server).requiredHackingSkill>ns.getHackingLevel())continue;
			ns.singularity.connect("home");
			let route=[server]
			while (route[0]!="home"){
				route.unshift(ns.scan(route[0])[0])
			}
			for (let server of route){
				ns.singularity.connect(server);
			}
			await ns.singularity.installBackdoor();
			ns.singularity.connect("home");
		}
		ns.print("Total servers: "+bd[2])
		ns.print("Nuked servers: "+bd[0])
		ns.print("BD'd servers : "+bd[1])
		await ns.sleep(0);
	}
}