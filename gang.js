/** @param {NS} ns */
export async function main(ns) {
	ns.disableLog("ALL"); ns.clearLog();//Visual clarity
	ns.tail();
	var min=0
	var info=ns.gang.getGangInformation();
	var members=ns.gang.getMemberNames();
	var names=ns.gang.getEquipmentNames();
	var equipment=[[],[],[],[],[]]
	var others=["Slum Snakes","Tetrads","The Syndicate","The Dark Army","Speakers for the Dead","The Black Hand","NiteSec"]
	others.splice(others.indexOf(ns.gang.getGangInformation().faction),1);
	
	async function recruit(){
		members=ns.gang.getMemberNames();
		var name="member1";
		if (members.length!=0){
			name=members[members.length-1];
			var number=name.slice(6);
			number=number;
			number++;
			name="member"+number;
		}
		ns.gang.recruitMember(name);
		members=ns.gang.getMemberNames();
		ns.gang.setMemberTask(name,"Train Combat");
	}
	async function get_ascend(name,goal){
		var stats=ns.gang.getMemberInformation(name);
		if (Math.max(stats.agi_asc_mult,stats.cha_asc_mult,stats.def_asc_mult,stats.dex_asc_mult,stats.hack_asc_mult,stats.str_asc_mult)<goal){
			return false	
		}
		else{
			return true
		}
	}
	async function get_stats(name, goal){
		var stats=ns.gang.getMemberInformation(name);
		if (!(stats.agi>=stats.agi_asc_mult*stats.agi_mult*goal)){return false}
		if (!(stats.def>=stats.def_asc_mult*stats.def_mult*goal)){return false}
		if (!(stats.dex>=stats.dex_asc_mult*stats.dex_mult*goal)){return false}
		if (!(stats.str>=stats.str_asc_mult*stats.str_mult*goal)){return false}
		return true
	}
	
	for (var i=0;i<names.length;i++){
		var type=ns.gang.getEquipmentType(names[i])
		if (type=="Weapon"){equipment[0].push(names[i]);continue;}
		if (type=="Armor"){equipment[1].push(names[i]);continue;}
		if (type=="Vehicle"){equipment[2].push(names[i]);continue;}
		if (type=="Rootkit"){equipment[3].push(names[i]);continue;}
		if (type=="Augmentation"){equipment[4].push(names[i]);continue;}
	}

	while(true){
		var rep_cap=0;
		var owned=ns.getOwnedAugmentations(true);
		var to_get=ns.singularity.getAugmentationsFromFaction(info.faction);
		for (var aug of to_get){
			if (!owned.includes(aug)&&aug!="QLink"){
				if (ns.singularity.getAugmentationRepReq(aug)>rep_cap){
					rep_cap=ns.singularity.getAugmentationRepReq(aug);
				}
			}
		}
		ns.clearLog();
		while (ns.gang.canRecruitMember()){
			await recruit();
		}
		var members=ns.gang.getMemberNames();
		if (members.length<12){
			ns.print("time to next member: "+ns.tFormat((Math.pow(5,members.length-2)-ns.gang.getGangInformation().respect)/ns.gang.getGangInformation().respectGainRate*1000))
		}
		
		var first=ns.gang.getMemberInformation(members[0]);
		for (let i=0;i<members.length;i++){
			try{var asc=ns.gang.getAscensionResult(members[i]);
				var stats=ns.gang.getMemberInformation(members[i]);
				var result=Math.max(asc.cha,asc.def,asc.dex,asc.hack,asc.str);
				var highest=Math.max(stats.cha_asc_mult,stats.def_asc_mult,stats.dex_asc_mult,stats.hack_asc_mult,stats.str_asc_mult)
				
				if (result>=1.2&&(members.length<10||members.length==12)){ns.gang.ascendMember(members[i])}
				else if (result>=2){ns.gang.ascendMember(members[i])}
				if (highest<16){
					if(stats.agi_asc_mult*asc.agi>16){ns.gang.ascendMember(members[i])}
					if(stats.dex_asc_mult*asc.dex>16){ns.gang.ascendMember(members[i])}
					if(stats.def_asc_mult*asc.def>16){ns.gang.ascendMember(members[i])}
					if(stats.cha_asc_mult*asc.cha>16){ns.gang.ascendMember(members[i])}
					if(stats.str_asc_mult*asc.str>16){ns.gang.ascendMember(members[i])}
					if(stats.hack_asc_mult*asc.hack>16){ns.gang.ascendMember(members[i])}
				}
				ns.print(String(i+1).padEnd(2)+": "+result.toFixed(3));
			}
			catch{ns.print(String(i+1).padEnd(2)+": can't ascend");}
			var target=1;
			if (members.length<6){
				if (await get_ascend(members[i],target)){
					if (await get_stats(members[i],25)){
						if (i%2==1&&(ns.gang.getGangInformation().wantedPenalty<0.95&&ns.gang.getGangInformation().wantedLevel>1000)){
							ns.gang.setMemberTask(members[i],"Vigilante Justice");
						}
						else{
							ns.gang.setMemberTask(members[i],"Mug People");
						}
					}
					else{
						ns.gang.setMemberTask(members[i],"Train Combat");
					}
				}
				else{
					ns.gang.setMemberTask(members[i],"Train Combat");
				}
			}
			else if (members.length<10){
				target=4;
				if (await get_ascend(members[i],target)){
					if (await get_stats(members[i],100)){
						if (i%2==1&&(ns.gang.getGangInformation().wantedPenalty<0.95&&ns.gang.getGangInformation().wantedLevel>1000)){
							ns.gang.setMemberTask(members[i],"Vigilante Justice");
						}
						else{
							ns.gang.setMemberTask(members[i],"Terrorism");
						}
					}
					else{
						ns.gang.setMemberTask(members[i],"Train Combat");
					}
				}
				else{
					ns.gang.setMemberTask(members[i],"Train Combat");
				}
			}
			else if (members.length<12){
				target=16;
				if (await get_ascend(members[i],target)){
					if (await get_stats(members[i],100)){
						if (i%2==1&&(ns.gang.getGangInformation().wantedPenalty<0.95&&ns.gang.getGangInformation().wantedLevel>1000)){
							ns.gang.setMemberTask(members[i],"Vigilante Justice");
						}
						else{
							//ns.gang.setMemberTask(members[i],"Human Trafficking")
							ns.gang.setMemberTask(members[i],"Terrorism");
						}
					}
					else{
						ns.gang.setMemberTask(members[i],"Train Combat");
					}
				}
				else{
					ns.gang.setMemberTask(members[i],"Train Combat");
				}
			}
			else if (members.length==12){
				target=16;
				if (await get_ascend(members[i],target)){
					if (await get_stats(members[i],100)){
						if (min<0.90){
							ns.gang.setMemberTask(members[i],"Territory Warfare");
						}
						else{
							if (i%3==0&&ns.singularity.getFactionRep(info.faction)<rep_cap){
								ns.gang.setMemberTask(members[i],"Terrorism")
							}
							else{
								//ns.gang.setMemberTask(members[i],"Human Trafficking")
								ns.gang.setMemberTask(members[i],"Human Trafficking")
							}
						}
					}
					else{
						ns.gang.setMemberTask(members[i],"Train Combat");
					}
				}
				else{
					ns.gang.setMemberTask(members[i],"Train Combat");
				}
			}
			else{ns.tprint("what the fuck")}
		}
		/*if (ns.gang.getGangInformation().territory>0.5){
			for (let i=0;i<5;i++){
				if (i==3&&ns.gang.getGangInformation().territory<1){continue;}
				for (let j=0;j<equipment[i].length;j++){
					if (ns.getPlayer().money>24*ns.gang.getEquipmentCost(equipment[i][j])){
						for (let k=0;k<Math.min(members.length,12);k++){
							ns.gang.purchaseEquipment(members[k],equipment[i][j]);
						}
					}
				}
			}
		}*/
		min=1 
		var help=0;
		for (var i=0;i<=6;i++){
			if (Object.values(ns.gang.getOtherGangInformation())[i].power==ns.gang.getGangInformation().power){help=-1;continue;}
			var terr=Object.values(ns.gang.getOtherGangInformation())[i].territory
			var g=Object.keys(ns.gang.getOtherGangInformation())[i]
			if (ns.gang.getChanceToWinClash(g)<min&&terr>0){
				min=ns.gang.getChanceToWinClash(g);
			}
		}
		if (ns.gang.getGangInformation().territory<1){
			ns.print("territory: "+(100*ns.gang.getGangInformation().territory).toFixed(2)+"%")
			ns.print("win chance: "+(100*min).toFixed(5)+"%")
			if (min>0.51){
				ns.gang.setTerritoryWarfare(true);
			}
			else{
				ns.gang.setTerritoryWarfare(false);
			}
		}
		await ns.sleep(1000);
	}
}