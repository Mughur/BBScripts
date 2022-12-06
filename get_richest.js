/** @param {NS} ns */
export async function main(ns) {
	ns.tprint("--------");
	var servers=['home']
	var help_servers=[['home',0,0,0]];
	for (let i=0;i<servers.length;i++){
		let scanned=ns.scan(servers[i]);
		for (let j=0;j<scanned.length;j++){
			if (!servers.includes(scanned[j])&&!scanned[j].includes("hacknet")&&!scanned[j].includes("server")){
				servers.push(scanned[j])
				help_servers.push([scanned[j],ns.getServerMaxMoney(scanned[j]).toExponential(2),ns.getServerMinSecurityLevel(scanned[j]),ns.getServerRequiredHackingLevel(scanned[j])])
			}
		}
	}
	ns.tprint("found "+servers.length+" servers");
	var screened=[];
	for (let i=1;i<servers.length;i++){
		if (ns.getServerRequiredHackingLevel(servers[i])<=180&&ns.getServerMaxMoney(servers[i])>0&&ns.getServerNumPortsRequired(servers[i])<=0){
			screened.push(servers[i]);
		}
	}
	
	servers=screened;
	ns.tprint("screened to "+servers.length);
	var richest=["",0]
	for (let i=0; i<servers.length;i++){
		if (ns.getServerMaxMoney(servers[i])>richest[1]){
			richest=[servers[i],ns.getServerMaxMoney(servers[i])]
		}
	}
	ns.tprint("currently richest server: "+richest[0]+" at "+richest[1].toExponential(2))
	ns.tprint("joesguns: "+ns.getServerMaxMoney("joesguns").toExponential(2))
	/*for (var i=0;i<help_servers.length;i++){
		if (help_servers[i][1]>0){
			ns.tprint(help_servers[i][0].padEnd(18)+": "+help_servers[i][1].padEnd(8)+", "+help_servers[i][2]+", "+help_servers[i][3])
		}
	}*/
	ns.tprint("--------");
	ns.print(servers)
}