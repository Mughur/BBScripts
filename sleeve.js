/** @param {NS} ns */
export async function main(ns) {
	/*if (ns.getPlayer().factions.includes("Bladeburners")){
		ns.closeTail();
		ns.run("blade_sleeves.js");
		ns.exit();
	}*/
	var n_sleeves=ns.sleeve.getNumSleeves();
	var stats;var augs;var highest;var req;
	var factions=ns.getPlayer().factions;
	var installed_augs=ns.getOwnedAugmentations(false);
	var companies=["ECorp","MegaCorp","KuaiGong International","Four Sigma","NWO","Blade Industries","OmniTek Incorporated","Bachman & Associates","Clarke Incorporated","Fulcrum Technologies"];
	var working_at_f=[];
	var working_at_c=[];
	var buyable=true;
	var completed=ns.read('completed_factions.txt').split(",");
	var owned_augs=ns.getOwnedAugmentations(true);
	var crime=["",0];
	var work_types=["Hacking Contracts","Field Work","Security Work"];

	ns.disableLog("ALL"); ns.clearLog();ns.tail();

	async function control(){
		for (var i=0;i<n_sleeves;i++){
			stats=ns.sleeve.getSleeveStats(i);	
			if (stats.sync<100){
				ns.sleeve.setToSynchronize(i);
				ns.print(i+": sync");
				continue;
			}
			if (stats.shock>0){
				ns.sleeve.setToShockRecovery(i);
				ns.print(i+": shock recovery "+stats.shock.toFixed(1));
				continue;
			}
			if (ns.getTimeSinceLastAug()/1000<60){
				if (ns.sleeve.getInformation(i).city=="Sector-12"){
					if (ns.sleeve.getTask(i).task!="Class"){
						ns.sleeve.setToUniversityCourse(i,"Rothman University","Study Computer Science");
					}
				}
				if (ns.sleeve.getInformation(i).city=="Volhaven"){
					if (ns.sleeve.getTask(i).task!="Class"){
						ns.sleeve.setToUniversityCourse(i,"ZB Institute of Technology","Study Computer Science");
					}
				}
				continue;
			}
			var help=await faction_to_donate(i);
			if (help[0]){
				await faction_print(i,help[1]);
				continue;
			}
			if (await check_company_work(i)){
				var target=200000;
				if (working_at_c[i]=="Fulcrum Technologies"){target=250000}
				if (working_at_c[i]=="Fulcrum Technologies"&&ns.singularity.getCompanyRep("Fulcrum Technologies")>target){target=800000}
				var time=await format_time((target-ns.getCompanyRep(working_at_c[i]))/(ns.sleeve.getInformation(i).workRepGain*5));
				var name=await format_name(working_at_c[i]);
				ns.print(i+":C "+name+", to go "+time[2]+"h "+time[1]+"min "+time[0]+"s");
				continue;
			}
			if (await check_faction_work(i)){
				await faction_print(i,false);
				continue;
			}
			if (ns.sleeve.getInformation(i).city!="Volhaven"){
				ns.sleeve.travel(i,"Volhaven");
			}
			if (ns.getPlayer().hacking<250){
				if (ns.sleeve.getTask(i).task!="Class"){
					ns.sleeve.setToUniversityCourse(i,"ZB Institute of Technology","Algorithms")
				}
				ns.print(i+": University, Hacking");
			}
			else if (ns.getPlayer().money>1e9&&ns.getPlayer().charisma<1500){
				ns.print(i+": University, Charisma");
				if (ns.sleeve.getTask(i).task=="Class"){
					continue;
				}
				ns.sleeve.setToUniversityCourse(i,"ZB Institute of Technology","Leadership")
			}
			else{
				if (ns.sleeve.getTask(i).task!="Class"){
					ns.sleeve.setToUniversityCourse(i,"ZB Institute of Technology","Algorithms")
				}
				ns.print(i+": University, Hacking");
			}
		}
	}
	
	async function faction_print(sleeve_i,donation){
		augs=ns.getAugmentationsFromFaction(working_at_f[sleeve_i]);
		highest=0;
		for (var n=0;n<augs.length;n++){
			if (ns.getAugmentationRepReq(augs[n])>highest){
				if (!owned_augs.includes(augs[n])){
					highest=ns.getAugmentationRepReq(augs[n]);
				}
			}
		}
		var gain=ns.sleeve.getInformation(sleeve_i).workRepGain*5;
		var time_s=0;
		var cur_rep=ns.getFactionRep(working_at_f[sleeve_i]);
		var cur_fav=ns.getFactionFavor(working_at_f[sleeve_i]);
		var previous_rep=ns.formulas.reputation.calculateFavorToRep(cur_fav);
		var tot_rep=cur_rep+previous_rep;
		var target_rep=ns.formulas.reputation.calculateFavorToRep(ns.getFavorToDonate())
		if (target_rep>highest){donation=false}
		if (!donation){time_s=(highest-ns.getFactionRep(working_at_f[sleeve_i]))/gain;}
		else{time_s=(target_rep-tot_rep)/gain;}
		var time= await format_time(time_s);
		var name= await format_name(working_at_f[sleeve_i]);
		if (donation){ns.print(sleeve_i+":F "+name+", donation "+time[2]+"h "+time[1]+"min "+time[0]+"s");}
		else {ns.print(sleeve_i+":F "+name+", complete "+time[2]+"h "+time[1]+"min "+time[0]+"s");}
	}

	async function format_time(time_s){
		var time=[time_s,0,0];
		time[1]=Math.floor(time[0]/60);
		time[2]=Math.floor(time[1]/60);
		time[0]=Math.floor(time[0]-time[1]*60);
		time[1]=time[1]-time[2]*60;
		return time;
	}

	async function format_name(text){
		var split=text.split(" ");
		if (split[0]=="The"){
			text=split[1];
		}
		else if (split[0]=="NWO"){
			text=text+" ";
		}
		var return_text=text[0]+text[1]+text[2]+text[3];
		return return_text;
	}

	async function faction_to_donate(sleeve_i){
		for (let f=0;f<factions.length;f++){
			if (ns.gang.inGang()){if (factions[f]==ns.gang.getGangInformation().faction){continue;}}
			if (factions[f]=="Bladeburners"||factions[f]=="Church of the Machine God"){continue}
			if (working_at_f.includes(factions[f])&&working_at_f[sleeve_i]!=factions[f]){continue;}
			augs=ns.getAugmentationsFromFaction(factions[f]);
			highest=0;
			for (var n=0;n<augs.length;n++){
				if (!owned_augs.includes(augs[n])&&ns.getAugmentationRepReq(augs[n])>highest){
					highest=ns.getAugmentationRepReq(augs[n]);
				}
			}
			var cur_rep=ns.getFactionRep(factions[f]);
			if (cur_rep>highest){continue;}
			var cur_fav=ns.getFactionFavor(factions[f]);
			var gain_fav=ns.getFactionFavorGain(factions[f]);
			var previous_rep=ns.formulas.reputation.calculateFavorToRep(cur_fav);
			var tot_rep=cur_rep+previous_rep;
			var target_rep=ns.formulas.reputation.calculateFavorToRep(ns.getFavorToDonate());
			if (cur_fav+gain_fav>ns.getFavorToDonate()&&ns.getFavorToDonate()!=0){
				continue;
			}
			var f_help=true;
			if (target_rep-tot_rep>highest){f_help=false;}
			if (working_at_f[sleeve_i]==factions[f]){return [true,true]}
			var best=[0,0];
			for (let i=0;i<3;i++){
				try{ns.sleeve.setToFactionWork(sleeve_i,factions[f],work_types[i]);
				await ns.sleep(300);
				let gain=ns.sleeve.getInformation(sleeve_i).workRepGain;
				if (gain>best[0]){best=[gain,i]};
				}
				catch{ns.tprint("failed to give faction work")}
			}
			ns.sleeve.setToCommitCrime(sleeve_i,"Mug");
			await ns.sleep(500);
			ns.sleeve.setToFactionWork(sleeve_i,factions[f],work_types[best[1]]);
			working_at_c[sleeve_i]="";
			working_at_f[sleeve_i]=factions[f]
			return[true,true]
		}
		return [false,false]
	}
	
	async function check_faction_work(sleeve_i){
		if (working_at_f[sleeve_i]!=""){
			augs=ns.getAugmentationsFromFaction(working_at_f[sleeve_i]);
			for (var n=0;n<augs.length;n++){
				if (ns.getAugmentationRepReq(augs[n])>ns.getFactionRep(working_at_f[sleeve_i])&&(ns.getAugmentationPrereq(augs[n]).length==0||installed_augs.includes(ns.getAugmentationPrereq(augs[n])))){
					if (augs[n]!="NeuroFlux Governor"&&!owned_augs.includes(augs[n])){
						return true;
					}
				}
			}		
		}
		for (let j=0;j<factions.length;j++){
			if (factions[j]=="Bladeburners"||factions[j]=="Church of the Machine God"){continue}
			if (ns.gang.inGang()){if (factions[j]==ns.gang.getGangInformation().faction){continue;}}
			augs=ns.getAugmentationsFromFaction(factions[j]);
			highest=0;
			for (let n=0;n<augs.length;n++){
				if (!owned_augs.includes(augs[n])&&ns.getAugmentationRepReq(augs[n])>highest){
					highest=ns.getAugmentationRepReq(augs[n]);
				}
			}
			if (ns.singularity.getFactionRep(factions[j])<highest&&working_at_f[sleeve_i]==factions[j]){
				return true;
			}
			if(working_at_f.includes(factions[j])){continue;}
			if(completed.includes(factions[j])){continue;}
			if (ns.singularity.getFactionRep(factions[j])<highest){
				var best=[0,0];
				for (let i=0;i<3;i++){
					try{
					ns.sleeve.setToFactionWork(sleeve_i,factions[j],work_types[i]);
					await ns.sleep(500);
					let gain=ns.sleeve.getInformation(sleeve_i).workRepGain;
					if (gain>best[0]){best=[gain,i]};
					}
					catch{ns.tprint("failed to give faction work 2")}
				}
				ns.sleeve.setToCommitCrime(sleeve_i,"Mug");
				await ns.sleep(500);
				ns.sleeve.setToFactionWork(sleeve_i,factions[j],work_types[best[1]]);
				working_at_c[sleeve_i]="";
				working_at_f[sleeve_i]=factions[j]
				return true;
			}
		} 
		return false;
	}

	async function check_company_work(sleeve_i){
		var x=JSON.stringify(ns.getPlayer().jobs).split(",");
		var comps=[];
		for (var i=0;i<x.length;i++){
			var comp=x[i].split('"')[1];
			if (comp!="FoodNStuff"){
				comps.push(comp);
			}
		}
		if (ns.getPlayer().hacking<225){return false;}
		else{
			for (var x=0;x<comps.length;x++){
				req=200000
				if(comps[x]=="Fulcrum Technologies"){req=800000}
				if (factions.includes(comps[x])||(comps[x]=="Fulcrum Technologies"&&factions.includes("Fulcrum Secret Technologies"))){
					continue;
				}
				if (ns.getCompanyRep(comps[x])<req&&working_at_c[sleeve_i]==comps[x]){return true;}
				if (working_at_c.includes(comps[x])){continue;}
				else{
					if(ns.getCompanyRep(comps[x])<req&&!working_at_c.includes(comps[x])){
						ns.sleeve.setToCompanyWork(sleeve_i,comps[x]);
						working_at_c[sleeve_i]=comps[x];
						working_at_f[sleeve_i]="";
						return true;
					}
				}
			}
			return false;
		}
	}

	async function crime_time(){
		crime=["Homicide",1]
	}

	async function augmentations(){
		if (ns.sleeve.getSleeveStats(0).shock>0){return}
		var div=80;
		if (ns.scriptRunning('growing.ns','home')){div=8}
		let a=ns.singularity.getOwnedAugmentations(false);
		let b=ns.singularity.getOwnedAugmentations(true);
		var c=b.length-a.length
		buyable= await purchasable_augs();
		var augs=[];
		for (let i=0;i<8;i++){
			var help=ns.sleeve.getSleevePurchasableAugs(i);
			for (var aug of help){
				if (!augs.includes(aug.name)){augs.push(aug.name)}
			}
		}
		var cheapest=[-1,1e100];
		for (let i=0;i<augs.length;i++){
			if (ns.singularity.getAugmentationPrice(augs[i])<cheapest[1]){cheapest=[augs[i],ns.singularity.getAugmentationPrice(augs[i])]}
		}
		if (ns.getPlayer().money/div>ns.singularity.getAugmentationPrice(cheapest[0])/ns.getBitNodeMultipliers().AugmentationMoneyCost/Math.pow(1.767,c)){
			for (let i=0;i<8;i++){
				ns.sleeve.purchaseSleeveAug(i,cheapest[0])	
			}
		}
	}

	async function purchasable_augs(){
		for (var p_n=0;p_n<n_sleeves;p_n++){
			var augs_check=ns.sleeve.getSleevePurchasableAugs(p_n);
			for (var i_n=0;i_n<augs_check.length;i_n++){
				if (!ns.getOwnedAugmentations().includes(augs_check[i_n])){
					return true;
				}
			}
		}
		return false;
	}

	async function check_work(){
		for (var i=0;i<n_sleeves;i++){
			if (ns.sleeve.getTask(i).task=="Faction"){
				working_at_f.push(ns.sleeve.getTask(i).location)
				working_at_c.push("");
			}
			else if (ns.sleeve.getTask(i).task=="Company"){
				working_at_f.push("");
				working_at_c.push(ns.sleeve.getTask(i).location)
			}
			else{
				working_at_f.push("");
				working_at_c.push("");
			}
		}
	}

	async function check_augs_for_player(){
		owned_augs=ns.getOwnedAugmentations(true);
		for (var i=0;i<factions.length;i++){
			augs=ns.getAugmentationsFromFaction(factions[i]);
			var highest_req=0;
			for (var n=0;n<augs.length;n++){
				if (ns.getAugmentationRepReq(augs[n])>highest_req&&!owned_augs.includes(augs[n])&&augs!="NeuroFlux Governor"){
					highest_req=ns.getAugmentationRepReq(augs[n]);
				}
			}
			if (highest_req>0&&ns.getFactionRep(factions[i])>highest_req){
				ns.run('augments.ns.js',1,factions[i]);
			}
		}
		if (ns.singularity.getOwnedAugmentations(true).length-ns.singularity.getOwnedAugmentations(false).length>20){
			ns.singularity.installAugmentations("start.js");
		}
	}

	async function update_factions(){
		ns.rm('completed_factions.txt','home');
		var completed_factions=["test"];
		for (var i=0;i<factions.length;i++){
			var augs=ns.getAugmentationsFromFaction(factions[i])
			for (var j=0;j<augs.length;j++){
				if (!ns.getOwnedAugmentations(true).includes(augs[j])){
					completed_factions.push(factions[i]);
					j=100;
				}
			}
		}
		await ns.write('completed_factions.txt','home');
	}

	await update_factions();
	await crime_time();
	completed=ns.read('completed_factions.txt').split(",");
	buyable= await purchasable_augs();
	//await augmentations();
	var help=0;
	for (let i=0;i<8;i++){
		ns.sleeve.setToShockRecovery(i);
	}
	
	await ns.sleep(100);
	check_work();
	while (true){
		if (help>10){
			factions=ns.getPlayer().factions;
			await crime_time();
			try{await augmentations();}catch{}
			//await check_augs_for_player();
			help=0;
		}
		try{await control();} catch{ns.print("b")}
		help++;
		await ns.sleep(0);
		ns.clearLog();
	}
}