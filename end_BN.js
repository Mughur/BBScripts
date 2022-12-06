/** @param {NS} ns */
export async function main(ns) {
	ns.tail();ns.clearLog();ns.disableLog("ALL");
	for (var i=0;i<8;i++){
		ns.sleeve.travel(i,'Volhaven');
		ns.sleeve.setToUniversityCourse(i,"ZB Institute of Technology","Algorithms");
	}
	while(ns.getPlayer().hacking<ns.getServerRequiredHackingLevel("w0r1d_d43m0n")){
		ns.clearLog();
		ns.print(ns.getPlayer().hacking+" / "+ns.getServerRequiredHackingLevel("w0r1d_d43m0n"))
		await ns.sleep(0);
	}
	ns.killall('home',true);
	var times=ns.read('times.txt');
	times=times+"\n"+ns.tFormat(ns.getPlayer().totalPlaytime)
	await ns.write('times.txt',times,"w");
	//ns.singularity.destroyW0r1dD43m0n(7,'start_BN.js')
}