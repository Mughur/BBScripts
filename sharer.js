/** @param {NS} ns */
export async function main(ns) {
	ns.tail();ns.disableLog("ALL");ns.clearLog();
	var servers=ns.scan('home');
	for (var server of servers){
		var temp=ns.scan(server);
		for (let i=0;i<temp.length;i++){
			if (!servers.includes(temp[i])){
				servers.push(temp[i]);
			}
		}
	}
	for (var server of servers){
		ns.print(server);
		if (server=='home'){
			continue;
		}
		if (ns.hasRootAccess(server)&&ns.getServerMaxRam(server)){
			await ns.scp('share.js','home',server);
			ns.killall(server);
			await ns.sleep(100);
			ns.exec('share.js',server,Math.floor((ns.getServerMaxRam(server)-ns.getServerUsedRam(server))/4));
		}
	}
}