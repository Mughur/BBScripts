/** @param {NS} ns */
export async function main(ns) {
	/*ns.clearLog();ns.disableLog("ALL");
	while (ns.getPlayer().money<ns.getPurchasedServerCost(Math.pow(2,10))){
		ns.print(ns.getPlayer().money.toExponential(2))
		ns.print(ns.getPurchasedServerCost(Math.pow(2,10)).toExponential(2))
		await ns.sleep(0);
		ns.clearLog();
	}
	ns.killall("home",true);
	ns.purchaseServer("corpMaker",Math.pow(2,10));*/
	await ns.scp(["startCorp.js","c.js"],"corpMaker","home");
	await ns.sleep(100);
	let pid=ns.exec("startCorp.js","corpMaker");
	await ns.sleep(1000);
	await ns.scp("startTime.txt","corpMaker","home");
	let startTime=ns.read("startTime.txt");
	while(ns.isRunning(pid)){
		await ns.sleep(1000);
	}

	ns.exec("c.js","corpMaker",1,startTime);
	let code=0;
	while(code==0){
		let help=ns.readPort(1);
		if (help!=undefined){
			code=help;
		}
	}

	while (ns.getPlayer().money<ns.getPurchasedServerCost(Math.pow(2,11))){
		ns.print(ns.getPlayer().money.toExponential(2))
		ns.print(ns.getPurchasedServerCost(Math.pow(2,11)).toExponential(2))
		await ns.sleep(0);
		ns.clearLog();
	}

	ns.killall("home",true);
	ns.purchaseServer("corpMaker2",Math.pow(2,11));
	await ns.scp("corp.js","corpMaker","home");
	await ns.sleep(100);
	ns.exec("starCorp.js","corpMaker");
	await ns.sleep(1000);
	ns.killall("corpmaker");

}