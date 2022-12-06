/** @param {NS} ns**/
export async function main(ns) {

	ns.disableLog("ALL"); ns.clearLog();ns.tail();
	var pServerList = [];
	var lowest = 0;
	var highest = 0;
	var lowest_ram = 6;
	var highest_ram = 6;
	var levels = [];
	var limit = 2;
	var ram_limit = Math.log2(ns.getPurchasedServerMaxRam());
	var prices = []
	var install_time_h=12
	if (ns.args.length>0){
		install_time_h=ns.args[0]/2;
	}

	async function ownServers() {
		pServerList = ns.getPurchasedServers();
		lowest = pServerList[0];
		highest = pServerList[pServerList.length - 1];
		if (pServerList.length > 0) {
			for (var i = 0; i < pServerList.length; i++) {
				if (ns.getServerMaxRam(pServerList[i]) < ns.getServerMaxRam(lowest)) {
					lowest = pServerList[i];
				}
				if (ns.getServerMaxRam(pServerList[i]) > ns.getServerMaxRam(highest)) {
					highest = pServerList[i];
				}
			}
			lowest_ram = Math.log2(ns.getServerMaxRam(lowest));
			highest_ram = Math.log2(ns.getServerMaxRam(highest));
			if (lowest_ram == ram_limit && ns.getPurchasedServers().length == ns.getPurchasedServerLimit()) {
				ns.tprint("servers capped");
				//ns.run("church.js");
				ns.closeTail();
				ns.exit();
			}
		}
	}

	async function buyBetter() {
		try{ns.purchaseServer("server",16)}catch{}
		for (let server of ns.getPurchasedServers()){
			try{ns.upgradePurchasedServer(server,ns.getServerMaxRam(server)*2)}catch{}
		}
		return;
		var max = lowest_ram;
		for (var i = lowest_ram; i <= ram_limit; i++) {
			if (ns.getPlayer().money/2 > prices[i]) {
				max = i;
			}
		}
		max = Math.max(highest_ram, max);
		if (levels[max] >= limit&& highest_ram!=ram_limit) {max++;}
		if (ns.getPlayer().money/2 > prices[max]) {
			if (pServerList.length == ns.getPurchasedServerLimit()) {
				ns.killall(lowest);
				ns.upgradePurchasedServer(lowest,Math.pow(2, max))
			}
			ns.tprint("bought lvl: " + max + ", when lowest was lvl: " + lowest_ram + ", and highest was lvl: " + highest_ram);
		}
	}
	
	async function show() {
		ns.clearLog();
		var levels_temp = [];
		var sum=0;
		for (var i=0;i<Math.log2(ns.getPurchasedServerMaxRam()+1);i++){
			levels_temp.push(0);
		}
		var servers = ns.getPurchasedServers()
		for (var i = 0; i < ns.getPurchasedServers().length; i++) {
			levels_temp[Math.log2(ns.getServerMaxRam(servers[i]))]++;
			sum=sum+ns.getServerMaxRam(servers[i]);
		}
		levels = levels_temp;
		for (var i = 0; i <= ram_limit; i++) {
			if (levels[i] != 0) {
				ns.print("level " + i + " has " + levels[i] + " servers on it");
			}
		}
		ns.print("Total ram:"+sum)
		ns.print("home ram: "+ns.getServerMaxRam("home"));
		if (levels[highest_ram]==5&&highest_ram!=ram_limit){
			ns.print("money: " + (ns.getPlayer().money.toExponential(2))+"/"+prices[highest_ram+1].toExponential(2));
			ns.print("need:  " + (prices[highest_ram+1] - ns.getPlayer().money).toExponential(4));
		}
		else{
			ns.print("money: " + (ns.getPlayer().money.toExponential(2))+"/"+prices[highest_ram].toExponential(2));
			ns.print("need:  " + (prices[highest_ram] - ns.getPlayer().money).toExponential(4));
		}
	}

	async function getPrices() {
		for (var i = 0; i <= Math.log2(ns.getPurchasedServerMaxRam()); i++) {
			prices.push(ns.getPurchasedServerCost(Math.pow(2, i)));
		}
		for (var i=0;i<prices.length;i++){
			ns.tprint(i+": "+prices[i].toExponential(2));
		}
	}

	await getPrices();
	while(true){
		/*if (ns.getTimeSinceLastAug()>install_time_h*60*60*1000){
			if (ns.getServerMaxRam('home')-ns.getServerUsedRam('home')>ns.getScriptRam('donate.js')){
				ns.run("donate.js");
			}
			ns.print("closing tail");
			await ns.sleep(10000)
			ns.closeTail();
			ns.exit();
		}*/
		await show();
		await ownServers();
		await buyBetter();
		await ns.sleep(100);
	}

}