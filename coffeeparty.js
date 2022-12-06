/** @param {NS} ns */
export async function main(ns) {
	let c=eval("ns.corporation");
	while(true){
		for (let div of c.getCorporation().divisions){
			for (let city of div.cities){
				if (c.getOffice(div.name,city).avgEne<95)c.buyCoffee(div.name,city);
				if (c.getOffice(div.name,city).avgHap<95 || c.getOffice(div.name,city).avgMor<95)c.throwParty(div.name,city,500000);		
			}
		}
		while(c.getCorporation().state=="EXPORT"){
			await ns.sleep(100);
		}
		while(c.getCorporation().state!="EXPORT"){
			await ns.sleep(100);
		}

	}
}