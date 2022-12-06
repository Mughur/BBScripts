/** @param {NS} ns */
export async function main(ns) {
	ns.tail();ns.clearLog();ns.disableLog("ALL");
	var thread_help=0;
	var f_help=0;

	var allServers=["home"];
	for (let server of allServers){
		for (let scanned of ns.scan(server)){
			if (!allServers.includes(scanned))allServers.push(scanned);
		}
	}

	for (let i=0;i<allServers.length;i++){
		ns.scriptKill("charge.js",allServers[i]);
	}
	while(true){
		ns.clearLog();
		var fragments=ns.stanek.activeFragments()
		var chargeable=[];
		for (let i=0;i<fragments.length;i++){
			if (fragments[i].id<100){
				chargeable.push(fragments[i]);
			}
		}
		var owned_servers=[];
		for (let server of allServers){
			if (!server.includes("node"))owned_servers.push(server);
		}
		//var owned_servers=ns.getPurchasedServers();
		//owned_servers.push("home")
		for (let i=0;i<owned_servers.length;i++){
			await ns.scp('charge.js',owned_servers[i])
		}
		var av_threads=0;
		var av_ram=0;
		for (let i=0;i<owned_servers.length;i++){
			if (ns.getServer(owned_servers[i]).hasAdminRights==false)continue;
			if (owned_servers[i].includes("node"))continue
			av_ram+=ns.getServerMaxRam(owned_servers[i])
		}
		if (av_ram!=thread_help||f_help!=fragments.length){
			thread_help=av_ram;
			for (let i=0;i<owned_servers.length;i++){
				if (ns.getServer(owned_servers[i]).hasAdminRights==false)continue;
				if (owned_servers[i].includes("node"))continue
				av_ram+=ns.getServerMaxRam(owned_servers[i])
				av_threads+=Math.floor((ns.getServerMaxRam(owned_servers[i])-ns.getServerUsedRam(owned_servers[i]))/2);
			}
			var threads_per=Math.floor(av_threads/chargeable.length);
			var chargers=[];
			for (let i=0;i<chargeable.length;i++)chargers.push(threads_per)
			var server_i=0;
			f_help=fragments.length;
			for (let i=0;i<allServers.length;i++){
				ns.scriptKill("charge.js",allServers[i]);
			}
			for (let i=0;i<chargeable.length;i++){
				let n=0;
				while(chargers[i]>0){
					await ns.sleep(0);
					var t=Math.floor((ns.getServerMaxRam(owned_servers[server_i])-ns.getServerUsedRam(owned_servers[server_i]))/2)
					if (t==0){server_i++;continue}
					var t_use=Math.min(t,chargers[i],1600000);
					ns.print(ns.exec('charge.js',owned_servers[server_i],t_use,chargeable[i].x,chargeable[i].y,n));
					n++;
					chargers[i]-=t_use;
					if (Math.floor((ns.getServerMaxRam(owned_servers[server_i])-ns.getServerUsedRam(owned_servers[server_i]))/2)==0){
						server_i++;
					}
				}
			}
		}
		await ns.sleep(10000);
	}
}