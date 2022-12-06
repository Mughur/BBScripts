/** @param {NS} ns */
export async function main(ns) {
	ns.tail();ns.clearLog();ns.disableLog("ALL");
	ns.print(ns.heart.break()+" / "+54000);
	ns.kill('sleeve.js','home');
	//ns.run('temp.js');
	while(ns.heart.break()>-54000){
		ns.singularity.commitCrime("Homicide");
		while(ns.singularity.isBusy()){
			ns.clearLog();
			ns.print(ns.heart.break()+" / "+54000);
			await ns.sleep(0);
		}
	}
	ns.closeTail();
	
}