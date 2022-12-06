/** @param {NS} ns */
export async function main(ns) {
	ns.tail();ns.clearLog();ns.disableLog("ALL");
	var help=true;
	var ignore="NeuroFlux Governor";
	while(ns.getPlayer().hacking<225){
		while (ns.scriptRunning("killspree.ns","home")){
			await ns.sleep(1000);
		}
		if (help){
			ns.singularity.applyToCompany("FoodNStuff","Employee");
			ns.singularity.workForCompany("FoodNStuff",true);
			help=false;
		}
		await ns.sleep(1000);
	}
	while (ns.scriptRunning("killspree.ns","home")){
		await ns.sleep(1000);
	}

	var factions=ns.getPlayer().factions;
	var companies=["ECorp","MegaCorp","KuaiGong International","Four Sigma","NWO","Blade Industries","OmniTek Incorporated","Bachman & Associates","Clarke Incorporated","Fulcrum Technologies"];
	var servers=["ecorp","megacorp","kuai-gong","4sigma","nwo","blade","omnia","b-and-a","clarkinc","fulcrumtech"];
	var all_worked=false
	
	async function work(){
		all_worked=true;
		for (var i=0;i<companies.length;i++){
			var target=200000;
			if (companies[i]=="Fulcrum Technologies"){target=250000}
			if (factions.includes(companies[i])||ns.singularity.getCompanyRep(companies[i])>target||(companies[i]=="Fulcrum Technologies"&&factions.includes("Fulcrum Secret Technologies"))){
				continue;
			}
			if (ns.getPlayer().isWorking==true&&ns.getPlayer().companyName==companies[i]){
				var multiplier=0.5;
				if (ns.getServer(servers[i]).backdoorInstalled==true){multiplier=0.75}
				if (ns.singularity.getCompanyRep(companies[i])+ns.getPlayer().workRepGained*multiplier>target){
					ns.singularity.stopAction();
					continue;
				}
				else{
					all_worked=false;
					return;
				}
			}
			else{
				all_worked=false;
			}
			ns.singularity.workForCompany(companies[i],true);
			return;
		}
	}

	while (!all_worked){
		factions=ns.getPlayer().factions;
		await work();
		await ns.sleep(1000);
	}
	var work=0;
	while(!factions.includes("Silhouette")){
		if (ns.scriptRunning("killspree.ns","home")){
			ns.spawn("player.js");
			ns.exit();
		}
		ns.clearLog();
		factions=ns.getPlayer().factions;
		if (work!=1){
			ns.singularity.applyToCompany("Fulcrum Technologies","IT");
			ns.singularity.workForCompany("Fulcrum Technologies");
			work=1;
		}
		var multiplier=0.5;
		if (ns.getServer("fulcrumtech").backdoorInstalled==true){multiplier=0.75}
		var rep=ns.singularity.getCompanyRep("Fulcrum Technologies")+ns.getPlayer().workRepGained*multiplier;
		if (rep>800000){
			if (ns.getPlayer().hacking>300&&ns.getPlayer().charisma>725){
				ns.singularity.applyToCompany("Fulcrum Technologies","Business");
				ns.singularity.stopAction();
				break;
			}
			else{
				ns.run("silhouette.js");
				break;
			}
		}
		var time=[0,0,0];
		time[2]=(800000-rep)/(ns.getPlayer().workRepGainRate*5);
		time[1]=Math.floor(time[2]/60);
		time[0]=Math.floor(time[1]/60);
		time[2]=Math.floor(time[2]-time[1]*60);
		time[1]=time[1]-time[0]*60;
		ns.print("time to sihouette: "+time[0]+"h"+time[1]+"min"+time[2]+"s");
		if (ns.getPlayer().hacking<300&&ns.getPlayer().charisma<725){ns.print("lacking skills");}
		await ns.sleep(1000);
	}

	var hacking_groups=["NiteSec","The Black Hand","BitRunners","Netburners","Tian Di Hui","CyberSec","Fulcrum Secret Technologies"];
	
	while(true){
		ns.clearLog();
		factions=ns.getPlayer().factions;
		for (var i=0;i<factions.length;i++){
			/*var augs=[ns.singularity.getAugmentationsFromFaction(factions[i]),ns.singularity.getOwnedAugmentations(true)];
			var highest=0;
			for (var j=0;j<augs[0].length;j++){
				if (augs[0][j]==ignore){continue;}
				if (!augs[1].includes(augs[0][j])){
					if (ns.singularity.getAugmentationRepReq(augs[0][j]>highest)){
						highest=ns.singularity.getAugmentationRepReq(augs[0][j]);
					}
				}
			}*/
			if (ns.singularity.getFactionFavor(factions[i])+ns.singularity.getFactionFavorGain(factions[i])>ns.getFavorToDonate()){
				if (ns.getPlayer().currentWorkFactionName==factions[i]){
					ns.singularity.stopAction();
				}
				continue;
			}
			if (ns.getPlayer().currentWorkFactionName==factions[i]){
				break;
			}
			if (hacking_groups.includes(factions[i])){
				ns.singularity.workForFaction(factions[i],"Hacking Contracts");
				break;
			}
			else{
				ns.singularity.workForFaction(factions[i],"Field Work");
				break;
			}
		}
		var workin=ns.getPlayer().currentWorkFactionName;
		ns.print("working for "+ns.getPlayer().currentWorkFactionName);
		var time=[0,0,0];
		var target=ns.formulas.reputation.calculateFavorToRep(ns.getFavorToDonate())-ns.formulas.reputation.calculateFavorToRep(ns.getFactionFavor(workin))-ns.singularity.getFactionRep(workin);
		
		time[2]=target/(ns.getPlayer().workRepGainRate*5);
		time[1]=Math.floor(time[2]/60);
		time[0]=Math.floor(time[1]/60);
		time[2]=Math.floor(time[2]-time[1]*60);
		time[1]=time[1]-time[0]*60;
		ns.print("next job in "+time[0]+"h"+time[1]+"min"+time[2]+"s");
		await ns.sleep(1000);
	}
}