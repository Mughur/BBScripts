/** @param {NS} ns */
export async function main(ns) {
	ns.tail();ns.clearLog();ns.disableLog("ALL");
	let baseHackingPercent=0.9
	
	function getServers(){
		let allServes=["home"]
		for (let server of allServes){
			try{ns.brutessh(server)}catch{}
			try{ns.ftpcrack(server)}catch{}
			try{ns.sqlinject(server)}catch{}
			try{ns.httpworm(server)}catch{}
			try{ns.relaysmtp(server)}catch{}
			try{ns.nuke(server)}catch{}
			if (server!="home")ns.scp(["weaken.script","grow.js","hack.script"],server,"home");
			for (let scanned of ns.scan(server)){
				if (scanned.includes("node"))continue;
				if (!allServes.includes(scanned))allServes.push(scanned);
			}
		}
		return allServes;
	}
	
	function getServersWithRam(serverList){
		let ramServers=[];
		for (let server of serverList){
			if (server=="home")continue;
			if (ns.getServerMaxRam(server)>0){
				if (ns.getServerMaxRam(server)>=1.75){
					ramServers.push([server,ns.getServerMaxRam(server)-ns.getServerUsedRam(server),ns.getServer(server).cpuCores]);
				}
			}
		}
		return ramServers;
	}

	function getServersWithMoney(serverList){
		let moneyServers=[];
		for (let server of serverList){
			if (server=="home")continue;
			if (ns.getServerMaxMoney(server)>0)moneyServers.push(server)
		}
		return moneyServers;
	}

	function getNukedServers(serverList){
		let nukedServers=[];
		for (let server of serverList){
			if (ns.getServer(server).hasAdminRights)nukedServers.push(server)
		}
		return nukedServers;
	}

	function getTargetServer(serverList){
		let target=["",0];
		for (let server of serverList){
			if (ns.getServerMaxMoney(server)>target[1]&&ns.getServerRequiredHackingLevel(server)<=Math.max(1,ns.getHackingLevel()/2))target=[server,ns.getServerMaxMoney(server)]
		}
		return target
	}

	function getAvailableThreads(serverList){
		let avThreads=0;
		for (let server of serverList){
			avThreads+=Math.floor(server[1]/1.75)
		}
		return avThreads;
	}

	function getMaxThreads(serverList){
		let maxThreads=0;
		for (let server of serverList){
			maxThreads+=Math.floor(ns.getServerMaxRam(server[0])/1.75)
		}
		return maxThreads;
	}

	while(true){
		ns.clearLog();
		let allServers=getServers();
		let nukedServers=getNukedServers(allServers);
		let usableServers=getServersWithRam(nukedServers);
		let moneyServers=getServersWithMoney(nukedServers);
		let originalTarget=getTargetServer(moneyServers);
		let target=originalTarget;

		ns.print("lowering security of "+originalTarget[0])
		//get security to min
		while(ns.getServerSecurityLevel(originalTarget[0])>ns.getServerMinSecurityLevel(originalTarget[0])&&target[0]==originalTarget[0]){
			let pids=[]
			ns.clearLog();
			ns.print(ns.getServerSecurityLevel(originalTarget[0])-ns.getServerMinSecurityLevel(originalTarget[0])+" to go")
			for (let server of usableServers){
				let threads=server[1]/1.75;
				if (threads>=1){
					let pid=ns.exec("weaken.script",server[0],threads,originalTarget[0])
					if (pid!=0)pids.push(pid)
				}
			}
			ns.tprint(pids+", "+pids.some((a) => ns.isRunning(a)))
			while(pids.some((a) => ns.isRunning(a))){
				ns.clearLog();
				ns.print(ns.getServerSecurityLevel(originalTarget[0])-ns.getServerMinSecurityLevel(originalTarget[0])+" to go")	
				await ns.sleep(10);
			}
			await ns.sleep(10);
			allServers=getServers();
			nukedServers=getNukedServers(allServers);
			usableServers=getServersWithRam(nukedServers);
			target=getTargetServer(getServersWithMoney(nukedServers));
		}
		
		ns.print("increasing money on "+originalTarget[0]);
		//get money to max while keeping security at min
		ns.print(ns.getServerMaxMoney(originalTarget[0]).toExponential(2)+"/"+ns.getServerMoneyAvailable(originalTarget[0]).toExponential(2))
		if (ns.getServerMaxMoney(originalTarget[0])/2>ns.getServerMoneyAvailable(originalTarget[0])&&target[0]==originalTarget[0]){
			while(ns.getServerMaxMoney(originalTarget[0])/2>ns.getServerMoneyAvailable(originalTarget[0])&&target[0]==originalTarget[0]){
				let pids=[]
				ns.clearLog();
				ns.print("increasing money on "+originalTarget[0])
				ns.print(ns.getServerMaxMoney(originalTarget[0]).toExponential(2)+"/"+ns.getServerMoneyAvailable(originalTarget[0]).toExponential(2))
				for (let server of usableServers){
					if (server[1]<ns.getServerMaxRam(server[0]))continue
					let totThreads=Math.floor(server[1]/1.75);
					try{
						let pid=ns.exec("grow.js",server[0],Math.ceil(totThreads*9/10),originalTarget[0],Date.now())
						if (pid!=0)pids.push(pid);
						}catch{}
					try{
						let pid=ns.exec("weaken.script",server[0],Math.floor(totThreads*1/10),originalTarget[0],Date.now())
						if (pid!=0)pids.push(pid);
						}catch{}
				}
				while(pids.some((a) => ns.isRunning(a))){
					ns.clearLog();
					ns.print("increasing money on "+originalTarget[0])
					ns.print(ns.getServerMaxMoney(originalTarget[0]).toExponential(2)+"/"+ns.getServerMoneyAvailable(originalTarget[0]).toExponential(2))
					await ns.sleep(10);
				}
				allServers=getServers();
				nukedServers=getNukedServers(allServers);
				usableServers=getServersWithRam(nukedServers);
				target=getTargetServer(getServersWithMoney(nukedServers));
			}
			await ns.sleep(ns.getWeakenTime(target[0])/2)
		}
		ns.print("targeting "+originalTarget[0]+" in a moment");
		let capReached=false;
		let capMulti=5;
		while(target[0]==originalTarget[0]){
			allServers=getServers();
			nukedServers=getNukedServers(allServers);
			usableServers=getServersWithRam(nukedServers);
			await ns.sleep(0);
			if (!capReached&&ns.getServerMaxMoney(originalTarget[0])==ns.getServerMoneyAvailable(originalTarget[0])){capReached=true;capMulti=1;}
			let targetServer=ns.getServer(target[0]);
			targetServer.moneyAvailable=targetServer.moneyMax/2;
			let reqHackThreads=0;
			let weakenHackThreads=0;
			let growThreads=0;
			let weakenGrowThreads=0;
			let avThreads=getAvailableThreads(usableServers);
			let hp=baseHackingPercent
			let maxThreads=getMaxThreads(usableServers);
			let found=[false,0];
			do{
				if (maxThreads==0)break;
				if (!capReached&&ns.getServerMaxMoney(originalTarget[0])==ns.getServerMoneyAvailable(originalTarget[0])){capReached=true;capMulti=1;}
				await ns.sleep(0);
				if (ns.getServerMoneyAvailable(target[0])<ns.getServerMaxMoney(target[0])/2){capReached=false;capMulti=5}
				reqHackThreads=Math.ceil(ns.hackAnalyzeThreads(target[0],ns.getServerMoneyAvailable(target[0])*hp));
				weakenHackThreads=Math.ceil(1.5*(reqHackThreads*0.002)/0.05);
				growThreads=capMulti*Math.ceil(1.1*(Math.log(1/(1-hp))/Math.log(ns.formulas.hacking.growPercent(targetServer,1,ns.getPlayer()))));
				weakenGrowThreads=Math.ceil(1.5*growThreads*0.002*2/0.05);

				if ((reqHackThreads+weakenHackThreads+growThreads+weakenGrowThreads)>maxThreads||reqHackThreads<0){
					ns.print("dont have "+(reqHackThreads+weakenHackThreads+growThreads+weakenGrowThreads)+" threads, only have "+getAvailableThreads(usableServers)+"/"+maxThreads+" at "+hp)
					ns.print(reqHackThreads);
					ns.print(weakenHackThreads);
					ns.print(growThreads);
					ns.print(weakenGrowThreads)
					if (reqHackThreads==Infinity || (reqHackThreads<found[1] && reqHackThreads != -1)){
						hp=Math.min(baseHackingPercent,hp*1.01);
					}
					else{
						hp/=1.01;
					}
				}
				else{
					if (reqHackThreads>found[1]){
						found=[true,reqHackThreads,growThreads,weakenGrowThreads+weakenHackThreads];
					}
					ns.print(reqHackThreads);
					ns.tprint("tot threads: "+(reqHackThreads+weakenHackThreads+growThreads+weakenGrowThreads)+"/"+maxThreads)
				}
			}while(!found[0] && getAvailableThreads(usableServers)<maxThreads);
			let pids=[];
			let threadCount=[found[1],found[2],found[3]];
			usableServers=usableServers.sort((a,b) => b[1]-a[1] )
			for (let server of usableServers){
				//ns.print(server+": "+threadCount)
				if (threadCount[0]>0&&server[1]>=1.75){
					let threads=Math.floor(Math.min(server[1]/1.75,threadCount[0]));
					threadCount[0]-=threads;
					server[1]-=threads*1.75;
					let pid=ns.exec("hack.script",server[0],threads,target[0],Date.now());
					if (pid!=0)pids.push(pid);
					else ns.tprint(server[0]+" failed to run "+threads+" of hack")
				}
				if (threadCount[1]>0&&server[1]>=1.75){
					let threads=Math.floor(Math.min(server[1]/1.75,threadCount[1]));
					threadCount[1]-=threads;
					server[1]-=threads*1.75;
					let pid=ns.exec("grow.js",server[0],threads,target[0],Date.now());
					if (pid!=0)pids.push(pid);
					else ns.tprint(server[0]+" failed to run "+threads+" of grow")
				}
				if (threadCount[2]>0&&server[1]>=1.75){
					let threads=Math.floor(Math.min(server[1]/1.75,threadCount[2]));
					threadCount[2]-=threads;
					server[1]-=threads*1.75;
					let pid=ns.exec("weaken.script",server[0],threads,target[0],Date.now());
					if (pid!=0)pids.push(pid);
					else ns.tprint(server[0]+" failed to run "+threads+" of weaken")
				}
				if (threadCount[2]==0) break;
			}
			for (let server of usableServers){
				let threads=(ns.getServerMaxRam(server[0])-ns.getServerUsedRam(server[0]))/1.75
				if (threads<1)continue;
				pids.push(ns.exec("weaken.script",server[0],threads,"joesguns",Date.now()))
			}
			while(pids.some((a) => ns.isRunning(a))){
				ns.clearLog();
				ns.print("hacking "+originalTarget[0])
				ns.print(pids.length)
				await ns.sleep(10);
			}
			ns.print("done");
			allServers=getServers();
			nukedServers=getNukedServers(allServers);
			usableServers=getServersWithRam(nukedServers);
			target=getTargetServer(getServersWithMoney(nukedServers));
		}
	}
}