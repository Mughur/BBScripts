/** @param {NS} ns */
export async function main(ns) {
	ns.disableLog("ALL"); ns.clearLog();//Visual clarity
	ns.tail();
	ns.scriptKill("x.ns",'home');
	var info=ns.gang.getGangInformation();
	var members=ns.gang.getMemberNames();
	var names=ns.gang.getEquipmentNames();
	var equipment=[[],[],[],[],[]]
	var others=["Slum Snakes","Tetrads","The Syndicate","The Dark Army","Speakers for the Dead","The Black Hand","NiteSec"]
	others.splice(others.indexOf(ns.gang.getGangInformation().faction),1);
	
	for (var i=0;i<names.length;i++){
		var type=ns.gang.getEquipmentType(names[i])
		if (type=="Weapon"){equipment[0].push(names[i]);continue;}
		if (type=="Armor"){equipment[1].push(names[i]);continue;}
		if (type=="Vehicle"){equipment[2].push(names[i]);continue;}
		if (type=="Rootkit"){equipment[3].push(names[i]);continue;}
		if (type=="Augmentation"){equipment[4].push(names[i]);continue;}
	}

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
	}
	
	async function ascend(){
		for (var i=0;i<members.length;i++){
			var member_stats=ns.gang.getAscensionResult(members[i]);
			if (member_stats==null){
				ns.print(members[i]+": cant ascend");
				continue;
			}
			var results=Math.max(member_stats.hack,member_stats.str,member_stats.def,member_stats.dex,member_stats.agi,member_stats.cha/2);
			if (results>2){ns.gang.ascendMember(members[i]);}
			var mem_info=ns.gang.getMemberInformation(members[i]);
			var text="";
			let help=0;
			if (mem_info.task=="Money Laundering"){text=" +ML+ m"+(i+1);}
			else if (mem_info.task=="Cyberterrorism"){text=" +CT+ m"+(i+1);}
			else if (mem_info.task=="Ethical Hacking"){text=" +EH+ m"+(i+1);}
			else if (mem_info.task=="Train Hacking"){text=" *TH* m"+(i+1);help=1;}
			else if (mem_info.task=="Train Charisma"){text=" *TC* m"+(i+1);help=2;}
			else if (mem_info.task=="Train Combat"){text=" _TW_ m"+(i+1);help=3;}
			else if (mem_info.task=="Territory Warfare"){text=" -WW- m"+(i+1);}
			text=text.padEnd(9)+": "+results.toFixed(3)
			if (help==1){
				if (ns.gang.getMemberInformation("member1").hack_asc_mult>16){
					var goal=Math.pow(2,(Math.floor(Math.log2(ns.gang.getMemberInformation("member1").hack_asc_mult))));
				}
				else{
					var goal=16;
				}
				text=text+" | "+(mem_info.hack_asc_mult*member_stats.hack).toFixed(3)+"/"+goal;
				if (mem_info.hack_asc_mult<goal&&mem_info.hack_asc_mult*member_stats.hack>goal){
					ns.gang.ascendMember(members[i]);
				}
			}
			if (help==2){
				text=text+" | "+(mem_info.cha_asc_mult*member_stats.cha).toFixed(3)+"/2";
				if (mem_info.cha_asc_mult<2&&mem_info.cha_asc_mult*member_stats.cha>=2){
					ns.gang.ascendMember(members[i]);
				}
			}
			if (help==3){
				let largest=Math.max(mem_info.def_asc_mult*member_stats.def,
				mem_info.dex_asc_mult*member_stats.dex,
				mem_info.str_asc_mult*member_stats.str,
				mem_info.agi_asc_mult*member_stats.agi);
				text=text+" | "+largest.toFixed(3)+"/8";
				let cur=Math.max(mem_info.def_asc_mult,mem_info.dex_asc_mult,mem_info.str_asc_mult,mem_info.agi_asc_mult)
				if (cur<8&&largest>=8){
					ns.gang.ascendMember(members[i]);
				}
			}
			ns.print(text);
		}
	}
	
	async function give_jobs(member_n){

		var jobs=ns.gang.getTaskNames();
		var highest=[9,0];
        if ((member_n==0||member_n==1)&&members.length<12){
			var mult=1;
			try {mult=ns.gang.getMemberInformation(members[member_n]).hack_asc_mult}catch{mult=1}
            if (mult<16||ns.gang.getMemberInformation(members[member_n]).hack<mult*150){
                ns.gang.setMemberTask(members[member_n],jobs[jobs.length-3]);
                return;
            } 
			if (ns.gang.getGangInformation().respect<100000){
				if (ns.gang.getGangInformation().wantedLevel>1000&&member_n%2==1){
					ns.gang.setMemberTask(members[member_n],jobs[jobs.length-6]);
					return;
				}
                ns.gang.setMemberTask(members[member_n],jobs[jobs.length-7]);
                return
			}
            if (ns.gang.getGangInformation().wantedPenalty<0.95){
                ns.gang.setMemberTask(members[member_n],jobs[jobs.length-6]);
                return;
            }
            if (ns.singularity.getFactionRep(info.faction)<=2000000){
                ns.gang.setMemberTask(members[member_n],jobs[jobs.length-7]);
                return
            }
        }
		try {
			var mults=[ns.gang.getMemberInformation(members[member_n]).agi_asc_mult,ns.gang.getMemberInformation(members[member_n]).str_asc_mult,ns.gang.getMemberInformation(members[member_n]).def_asc_mult,ns.gang.getMemberInformation(members[member_n]).dex_asc_mult]
			mult=1;
			for (let i=0;i<4;i++){
				if (mult<mults[i]){
					mult=mults[i];
				}
			}
		}catch{mult=1}
		if (members.length<12&&mult<4){
			ns.gang.setMemberTask(members[member_n],jobs[jobs.length-4])
			return;
		}
		if (ns.gang.getGangInformation().territory<1){
			if (member_n>=21-20*min||member_n<2){
				if (ns.gang.getGangInformation().territory>0.5){
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
					if (ns.singularity.getFactionRep(info.faction)<=rep_cap&&member_n%2==0){
						ns.gang.setMemberTask(members[member_n],jobs[jobs.length-7]);
						return
					}
					if (ns.gang.getMemberInformation(members[member_n]).hack_asc_mult<Math.pow(2,Math.floor(Math.log2(ns.gang.getMemberInformation(members[0]).hack_asc_mult)))){
						ns.gang.setMemberTask(members[member_n],jobs[jobs.length-3]);
					}
					else if (ns.gang.getGangInformation().wantedPenalty<0.95){
						ns.gang.setMemberTask(members[member_n],jobs[jobs.length-6]);
					}
					else{
						ns.gang.setMemberTask(members[member_n],jobs[jobs.length-8]);
					}
					return;
				}
				if (ns.gang.getMemberInformation(members[member_n]).hack<ns.gang.getMemberInformation(members[member_n]).hack_asc_mult*150|| ns.gang.getMemberInformation(members[member_n]).hack_asc_mult<Math.pow(2,Math.floor(Math.log2(ns.gang.getMemberInformation(members[0]).hack_asc_mult)))){
					ns.gang.setMemberTask(members[member_n],jobs[jobs.length-3]);
				}
				else if (ns.gang.getMemberInformation(members[member_n]).cha_asc_mult<2){
					ns.gang.setMemberTask(members[member_n],jobs[jobs.length-2]);
				}	
				else if (ns.gang.getGangInformation().respect<100000){
					if (ns.gang.getGangInformation().wantedLevel>1000&&member_n%2==1){
						ns.gang.setMemberTask(members[member_n],jobs[jobs.length-6]);
						return;
					}
					ns.gang.setMemberTask(members[member_n],jobs[jobs.length-7]);
				}
				else if (ns.gang.getGangInformation().wantedPenalty<0.95){
					ns.gang.setMemberTask(members[member_n],jobs[jobs.length-6]);
				}
				else{
					ns.gang.setMemberTask(members[member_n],jobs[jobs.length-8]);
				}
				return;
			}
			if (ns.gang.getMemberInformation(members[member_n]).def_asc_mult<7){
				ns.gang.setMemberTask(members[member_n],jobs[jobs.length-4])
			}
			else if (ns.gang.getMemberInformation(members[member_n]).def>100*ns.gang.getMemberInformation(members[member_n]).def_asc_mult){
				ns.gang.setMemberTask(members[member_n],jobs[jobs.length-1]);
				ns.tprint("a")
			}
			else{
				ns.gang.setMemberTask(members[member_n],jobs[jobs.length-4]);
			}
			return;
		}
			
		var rep_cap=0;
		var owned=ns.singularity.getOwnedAugmentations(true);
		var to_get=ns.singularity.getAugmentationsFromFaction(info.faction);
		for (var aug of to_get){
			if (!owned.includes(aug)){
				if (ns.singularity.getAugmentationRepReq(aug)>rep_cap&&aug!="QLink"){
					rep_cap=ns.singularity.getAugmentationRepReq(aug);
				}
			}
		}
		if (ns.singularity.getFactionRep(info.faction)<=rep_cap&&member_n%2==0){
			ns.gang.setMemberTask(members[member_n],jobs[jobs.length-7]);
			return
		}
		if (ns.gang.getMemberInformation(members[member_n]).hack_asc_mult<Math.pow(2,Math.floor(Math.log2(ns.gang.getMemberInformation(members[0]).hack_asc_mult)))){
			ns.gang.setMemberTask(members[member_n],jobs[jobs.length-3]);
		}
		else if (ns.gang.getGangInformation().wantedPenalty<0.95){
			ns.gang.setMemberTask(members[member_n],jobs[jobs.length-6]);
		}
		else{
			ns.gang.setMemberTask(members[member_n],jobs[jobs.length-8]);
		}
		return;
	}

	async function buy_equipment(){
		for (var i=0;i<members.length;i++){
			if (i>=22-20*min||i<2){
				for (var j=0;j<equipment[3].length;j++){
					if (ns.getPlayer().money>ns.gang.getEquipmentCost(equipment[3][j])*10){
						ns.gang.purchaseEquipment(members[i],equipment[3][j]);
					}
				}
				for (var j=0;j<equipment[2].length;j++){
					if (ns.getPlayer().money>ns.gang.getEquipmentCost(equipment[2][j])*10){
						ns.gang.purchaseEquipment(members[i],equipment[2][j]);
					}
				}
			}
			else{
				if (ns.gang.getGangInformation().territory<1){
					var mult=1;
					try{mult=ns.gang.getMemberInformation(members[i]).agi_asc_mult}catch{mult=1}
					if (mult>=4){
						for (var j=0;j<equipment[3].length;j++){
							if (ns.getPlayer().money>ns.gang.getEquipmentCost(equipment[3][j])*10){
								ns.gang.purchaseEquipment(members[i],equipment[3][j]);
							}
						}
						for (var j=0;j<equipment[2].length;j++){
							if (ns.getPlayer().money>ns.gang.getEquipmentCost(equipment[2][j])*10){
								ns.gang.purchaseEquipment(members[i],equipment[2][j]);
							}
						}
					}
					for (var j=0;j<equipment[0].length;j++){
						if (ns.getPlayer().money>ns.gang.getEquipmentCost(equipment[0][j])*10){
							ns.gang.purchaseEquipment(members[i],equipment[0][j]);
						}
					}
					for (var j=0;j<equipment[1].length;j++){
						if (ns.getPlayer().money>ns.gang.getEquipmentCost(equipment[1][j])*10){
							ns.gang.purchaseEquipment(members[i],equipment[1][j]);
						}
					}
				}
			}
			for (var j=0;j<equipment[4].length;j++){
				var eqStats=ns.gang.getEquipmentStats(equipment[4][j]);
				if (ns.getPlayer().money>ns.gang.getEquipmentCost(equipment[4][j])&&(eqStats.hack>1||eqStats.cha>1)){
					ns.gang.purchaseEquipment(members[i],equipment[4][j]);
				}
			}

		}
	}
	
	var n=0;
	var count=0;
	var min=0;
	while(true){
		ns.clearLog();
		//ns.print("can recruit: "+ns.gang.canRecruitMember())
		if (ns.gang.canRecruitMember()){
			await recruit();
		}
		if (members.length<12&&ns.gang.getGangInformation().respectGainRate>0){
			ns.print("next members in: "+ns.tFormat((Math.pow(5,members.length-2)-ns.gang.getGangInformation().respect)/ns.gang.getGangInformation().respectGainRate*1000/5))
		}
		try{await ascend()}catch{ns.tprint("something went wrong")}
		min=1
		var help=0;
		for (var i=0;i<=6;i++){
			if (Object.values(ns.gang.getOtherGangInformation())[i].power==ns.gang.getGangInformation().power){help=-1;continue;}
			var terr=Object.values(ns.gang.getOtherGangInformation())[i].territory
			if (ns.gang.getChanceToWinClash(others[i+help])<min&&terr>0){
				min=ns.gang.getChanceToWinClash(others[i+help]);
			}
		}
		if (ns.gang.getGangInformation().territory<1){
			ns.print("territory: "+(100*ns.gang.getGangInformation().territory).toFixed(1)+"%")
			ns.print("win chance: "+(100*min).toFixed(5)+"%")
			if (min>0.51){
				ns.gang.setTerritoryWarfare(true);
			}
			else{
				ns.gang.setTerritoryWarfare(false);
			}
		}
		else{
				ns.gang.setTerritoryWarfare(false);
				ns.print("Total control");	
		}
		if (n%10==0){
			try{await give_jobs(count);}catch{ns.print("something went wrong 1");}
			count++;
			count=count%members.length
			/*if (count==0){
				ns.clearLog();
			}*/
			n=0;
		}
		try{await buy_equipment();}catch{}
		n++;
		
		await ns.sleep(0);
		//ns.clearLog();
	}
}