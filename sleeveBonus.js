/** @param {NS} ns */
export async function main(ns) {
	ns.tail(); ns.disableLog("ALL");ns.clearLog();
	let startTime = Date.now();
	let startCycles = 0;
	let startAss = ns.bladeburner.getActionCountRemaining('Operations','Assassination')+
		ns.bladeburner.getActionSuccesses('Operations','Assassination')
	for (let i=0;i<ns.sleeve.getNumSleeves();i++){
		startCycles+=ns.sleeve.getSleeve(i).storedCycles
	}
	while(true){
		await ns.sleep(1000);
		ns.clearLog();
		for (let i=0;i<ns.sleeve.getNumSleeves();i++){
			let bTime=ns.sleeve.getSleeve(i).storedCycles/75*1000
			ns.print(i+": "+ns.tFormat(bTime))
			ns.print(i+": "+ns.sleeve.getSleeve(i).storedCycles)
		}
		let currTime =  Date.now();
		let currCycles = 0;
		for (let i=0;i<ns.sleeve.getNumSleeves();i++){
			currCycles+=ns.sleeve.getSleeve(i).storedCycles
		}
		let currAss = ns.bladeburner.getActionCountRemaining('Operations','Assassination')+
		ns.bladeburner.getActionSuccesses('Operations','Assassination')
		let assDiff = currAss-startAss;
		let timeDiff = currTime-startTime;
		let cycleDiff = Math.abs(currCycles-startCycles);
		let useRate = cycleDiff/timeDiff
		let gainRate = assDiff/timeDiff
		let timeLeft = currCycles/useRate
		ns.print(ns.tFormat(timeDiff)+", "+cycleDiff);
		ns.print("avg cycle use: "+(1000*useRate).toPrecision(5)+"/s")
		ns.print("running out in: "+ns.tFormat(timeLeft))
		ns.print("avg assassination gain: "+(1000*gainRate).toPrecision(5)+"/s")
		ns.print("avg assassination gain: "+(60*1000*gainRate).toPrecision(5)+"/min")
		ns.print("avg assassination gain: "+(60*60*1000*gainRate).toPrecision(5)+"/h")
		ns.print("10k ass' batch every: "+ns.tFormat(10000/gainRate));
		ns.print("time until next batch: "+ns.tFormat((10000-ns.bladeburner.getActionCountRemaining('Operations','Assassination'))/gainRate))
		ns.print("expected ass' when bonustime runs out: "+Math.floor(currAss+gainRate*timeLeft));
	}
}