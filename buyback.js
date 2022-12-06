/** @param {NS} ns */
export async function main(ns) {
	ns.disableLog("ALL");ns.tail();ns.clearLog();
	let c = eval("ns.corporation");
	let sw="";
	for (let div of c.getCorporation().divisions){
		if (div.type=="Software")sw=div.name;
	}
	while(true){
		ns.print("wait");
		c.issueDividends(1);
		//try{c.bribe("Blade Industries",c.getCorporation().funds)}catch{}
		await ns.sleep(30000);
		ns.print("start buying");
		while(c.getCorporation().numShares != c.getCorporation().totalShares){
			let bought=0;
			let shares=c.getCorporation().numShares;
			try{c.sellShares(shares*0.1)}catch{}
			if (c.getCorporation().sharePrice*1.1*(c.getCorporation().totalShares-c.getCorporation().numShares)<ns.getPlayer().money/1000){
				try{
						c.buyBackShares((c.getCorporation().totalShares-c.getCorporation().numShares)/1000);
						c.buyBackShares((c.getCorporation().totalShares-c.getCorporation().numShares));
				}catch{}
			}
			if (shares!=c.getCorporation().numShares)ns.print("shares changed by "+(c.getCorporation().numShares-shares)+" shares. "+(c.getCorporation().numShares/c.getCorporation().totalShares*100).toPrecision(3)+"% done")
			await ns.sleep(1000);
		}
		ns.print("got all shares")
		c.issueDividends(0.5);
		let shares=c.getCorporation().numShares;
		while(c.getCorporation().totalShares == c.getCorporation().numShares){
			//try{c.sellShares(shares*0.1)}catch{}
			await ns.sleep(10000);
		}
	}
}