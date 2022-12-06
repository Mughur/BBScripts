/** @param {NS} ns */
export async function main(ns) {
	/*while (ns.getPlayer().money<ns.getPurchasedServerCost(Math.pow(2,11))){
		await ns.sleep(1000);
	}*/
	var server="server_for_corp"//ns.purchaseServer("server_for_corp",Math.pow(2,11));
	await ns.scp(["startCorp.js","corp.js"],server);
	while (ns.getPlayer().money<150_000_000_000){
		await ns.sleep(100);
	}
	ns.killall(server);
	ns.exec("startCorp.js",server);
}