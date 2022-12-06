/** @param {NS} ns */
export async function main(ns) {

	ns.tail();ns.disableLog("ALL");ns.clearLog();
	try{ns.run('up_blade.js',1,ns.args[0]);}catch{ns.run('up_blade.js',1,12);}
	const contracts=['Tracking','Bounty Hunter','Retirement'];
	//const operations=['Investigation','Undercover Operation','Sting Operation','Assassination'];
	const operations=['Investigation','Assassination'];
	var blackops=["Operation Typhoon","Operation Zero","Operation X","Operation Titan","Operation Ares","Operation Archangel","Operation Juggernaut","Operation Red Dragon","Operation K","Operation Deckard","Operation Tyrell","Operation Wallace","Operation Shoulder of Orion","Operation Hyron","Operation Morpheus","Operation Ion Storm","Operation Annihilus","Operation Ultron","Operation Centurion","Operation Vindictus","Operation Daedalus"]
	var bol=blackops.length;
	//const skill=["Hands of Midas","Blade's Intuition",'Cloak','Short-Circuit','Digital Observer','Overclock','Reaper','Evasive System','Hyperdrive']
	const skill=['Hyperdrive']
	const cities=["Sector-12","Aevum","Volhaven","Chongqing","New Tokyo","Ishima"]
	var task_chance=1;
	var pause=[];
	var help=true;
	
	async function task(){
		ns.print(pause)
		var lack=false;	
		var x=12;
		var y=" Operations ";
		/*while (ns.bladeburner.getActionCountRemaining("BlackOp",blackops[0])==0){
			blackops.shift()
		}
		if (ns.bladeburner.getActionEstimatedSuccessChance("BlackOp",blackops[0])[0]>=0.9&&ns.bladeburner.getBlackOpRank(blackops[0])<=ns.bladeburner.getRank()){
			ns.print(" Doing next BlackOp ("+blackops[0]+")");
			ns.print(" "+ns.bladeburner.getActionCurrentTime()/1000+"/"+ns.bladeburner.getActionTime("BlackOp",blackops[0])/1000)
			if (ns.bladeburner.getCurrentAction().name!=blackops[0]){
				ns.bladeburner.startAction('BlackOp',blackops[0])
			}
			return;
		}
		else{
			if (ns.bladeburner.getBlackOpRank(blackops[0])>ns.bladeburner.getRank()){
				ns.print(" "+blackops[0].padEnd(18,'-')+": "+ns.bladeburner.getRank().toFixed(0)+"/"+ns.bladeburner.getBlackOpRank(blackops[0]))
			}
			else{
				ns.print(" "+blackops[0].padEnd(18,'-')+": "+(100*ns.bladeburner.getActionEstimatedSuccessChance('BlackOp',blackops[0])[0]).toFixed(2)+"%")
			}
		}*/
		if (ns.bladeburner.getActionEstimatedSuccessChance("BlackOp",blackops[0])[0]<ns.bladeburner.getActionEstimatedSuccessChance("BlackOp",blackops[0])[1]){
			ns.print(" Field Analysis, "+(ns.bladeburner.getActionEstimatedSuccessChance("BlackOp",blackops[0])[0]/ns.bladeburner.getActionEstimatedSuccessChance("BlackOp",blackops[0])[1]).toFixed(3));
			if (ns.bladeburner.getCurrentAction().name!='Field Analysis'){
				ns.bladeburner.startAction('General','Field Analysis');
			}
			return;
		}

		var best=["","",0,1]
		for (var op of operations){
			if (ns.bladeburner.getActionCountRemaining("Operations",op)<2){if(!pause.includes(op)){pause[pause.length]=op}continue;}
			if (ns.bladeburner.getActionCountRemaining("Operations",op)>10&&pause.includes(op)){pause.splice(pause.indexOf(op))}
			if (pause.includes(op)){continue}
			var chance=ns.bladeburner.getActionEstimatedSuccessChance("Operations",op)[0]
			if (chance==1&&ns.bladeburner.getActionCountRemaining("Operations",op)>0){
				var time=ns.bladeburner.getActionTime("Operations",op);
				var gain=ns.bladeburner.getActionRepGain("Operations",op,ns.bladeburner.getActionMaxLevel("Operations",op));
				if (best[2]/best[3]<gain/time){
					best=["Operations",op,gain,time]
				}
			}
		}
		for (var cont of contracts){
			if (ns.bladeburner.getActionCountRemaining("Contracts",cont)<2){if(!pause.includes(cont)){pause.push(cont)}continue;}
			if (ns.bladeburner.getActionCountRemaining("Contracts",cont)>10&&pause.includes(cont)){pause.splice(pause.indexOf(cont))}
			if (pause.includes(cont)){continue}
			var chance=ns.bladeburner.getActionEstimatedSuccessChance("Contracts",cont)[0]
			if (chance==1&&ns.bladeburner.getActionCountRemaining("Operations",op)>0){
				var time=ns.bladeburner.getActionTime("Contracts",cont);
				var gain=ns.bladeburner.getActionRepGain("Contracts",cont,ns.bladeburner.getActionMaxLevel("Contracts",cont));
				if (best[2]/best[3]<gain/time){
					best=["Contracts",cont,gain,time]
				}
			}
		}
		if (ns.bladeburner.getRank()<ns.bladeburner.getBlackOpRank(blackops[0])){
			ns.print(ns.tFormat((ns.bladeburner.getBlackOpRank(blackops[0])-ns.bladeburner.getRank())/(best[2]/best[3]))+" to next BO")
		}
		ns.print(" "+ns.tFormat((ns.bladeburner.getBlackOpRank(blackops[blackops.length-1])-ns.bladeburner.getRank())/(best[2]/best[3]))+" to last BO")
		var rate=best[2]/best[3]*1000;
		var sp_rate=3/rate;
		ns.print(" "+best[1]+" gives "+rate.toFixed(5)+" rank per s");
		if (sp_rate>1){
			ns.print(" 1 skillpoint every "+ns.tFormat(1000*sp_rate))
		}
		else{
			ns.print(" "+(rate/3).toFixed(3)+" skillpoints per second ")
		}
		if (ns.bladeburner.getCurrentAction().name!=best[1]){
			ns.bladeburner.startAction(best[0],best[1])
		}
		/*ns.print(" "+y.padEnd(x+y.length,"~").padStart(2*x+y.length+1,"~"))
		for (let i=operations.length-1;i>=0;i--){
			var chance=ns.bladeburner.getActionEstimatedSuccessChance("Operations",operations[i]);
			var remaining=ns.bladeburner.getActionCountRemaining("Operations",operations[i]);
			var text=operations[i];
			if (text.includes("Operation")){
				text=text.slice(0,text.length-10)
			}
			ns.print(" "+text.padEnd(18,'-')+": "+String(remaining).padEnd(3)+" - "+chance[0].toFixed(3)+"/"+chance[1].toFixed(3))
			if (chance[0]>=task_chance){
				if (remaining==0){
					lack=true;
					continue;
				}
				if (ns.bladeburner.getCurrentAction().name!=operations[i]){
					ns.bladeburner.startAction('Operations',operations[i]);
				}
				return;
			}
		}
		y=" Contracts "
		x++;
		ns.print(" "+y.padEnd(x+y.length,"~").padStart(2*x+y.length,"~"))
		for (let i=contracts.length-1;i>=0;i--){
			var chance=ns.bladeburner.getActionEstimatedSuccessChance("Contracts",contracts[i]);
			var remaining=ns.bladeburner.getActionCountRemaining("Contracts",contracts[i]);
			ns.print(" "+contracts[i].padEnd(18,'-')+": "+String(remaining).padEnd(3)+" - "+chance[0].toFixed(3)+"/"+chance[1].toFixed(3))
			
			if (chance[0]>=task_chance){
				if (remaining==0){
					lack=true;
					continue;
				}
				if (ns.bladeburner.getCurrentAction().name!=contracts[i]){
					ns.bladeburner.startAction('Contracts',contracts[i]);
				}
				return;
			}
		}
		y=" General "
		x++;
		ns.print(" "+y.padEnd(x+y.length,"~").padStart(2*x+y.length,"~"))
		if (ns.bladeburner.getCityChaos(ns.bladeburner.getCity())>10){
			ns.print(" Diplomacy")
			if (ns.bladeburner.getCurrentAction().name!='Diplomacy'){
				ns.bladeburner.startAction('General','Diplomacy');
			}
		}
		else if (ns.bladeburner.getActionEstimatedSuccessChance('BlackOp',blackops[0])[0]!=ns.bladeburner.getActionEstimatedSuccessChance('BlackOp',blackops[0])[1]){
			ns.print(" Field Analysis");
			if (ns.bladeburner.getCurrentAction().name!='Field Analysis'){
				ns.bladeburner.startAction('General','Field Analysis');
			}
		}
		else if (lack){
			ns.print(" Getting more contracts and operations");
			if (ns.bladeburner.getCurrentAction().name!='Incite Violence'){
				ns.bladeburner.startAction('General','Incite Violence');
			}
		}
		else{
			ns.print(" Training");
			if (ns.bladeburner.getCurrentAction().name!='Training'){
				ns.bladeburner.startAction('General','Training');
			}
		}*/
	}
	
	async function spendSkillPoints(){
		var lowest=["",1e10];
		let x=false;
		if (ns.bladeburner.getActionEstimatedSuccessChance('Operations','Assassination')[0]==1){
			if (ns.bladeburner.getSkillLevel("Overclock")<90){
				x=true;
				lowest=["Overclock",ns.bladeburner.getSkillUpgradeCost("Overclock")]
			}
		}
		if (!x){
			for (var i=0;i<skill.length;i++){
				if (skill[i]=="Overclock"){
					let lvl=ns.bladeburner.getSkillLevel("Overclock")
					if (lvl==90){
						continue;
					}
					if (ns.bladeburner.getSkillUpgradeCost(skill[i])<lowest[1]){
						lowest=[skill[i],ns.bladeburner.getSkillUpgradeCost(skill[i])]
					}
				}
				else if (ns.bladeburner.getSkillUpgradeCost(skill[i])<lowest[1]){
					lowest=[skill[i],ns.bladeburner.getSkillUpgradeCost(skill[i])]
				}
			}
		}
		if (lowest[0]=="Overclock"){
			ns.print(" "+lowest[0]+" with value of "+lowest[1]+", actual cost: "+ns.bladeburner.getSkillUpgradeCost("Overclock"))
		}
		else{
			ns.print(" "+lowest[0]+" with value of "+lowest[1])
		}
		if (lowest[0]!=""){
			ns.bladeburner.upgradeSkill(lowest[0])
		}
	}

	async function move(){
		var ends=[["",1e100],["",0]]
		for (var city of cities){
			if (ns.bladeburner.getCityEstimatedPopulation(city)<ends[0][1]){ends[0]=[city,ns.bladeburner.getCityEstimatedPopulation(city)]}
			if (ns.bladeburner.getCityEstimatedPopulation(city)>ends[1][1]){ends[1]=[city,ns.bladeburner.getCityEstimatedPopulation(city)]}
		}
		if (ns.bladeburner.getCity()==ends[0][0]&&ends[0][1]<ends[1][1]/2){
			ns.bladeburner.switchCity(ends[1][0]);
		}
		ns.print(" Current: "+ns.bladeburner.getCity().padEnd(10)+",P:"+ns.bladeburner.getCityEstimatedPopulation(ns.bladeburner.getCity()).toExponential(2)+",C:"+ns.bladeburner.getCityChaos(ns.bladeburner.getCity()).toFixed(2))
		ns.print("  Lowest: "+ends[0][0].padEnd(10)+",P:"+ends[0][1].toExponential(2)+",C:"+ns.bladeburner.getCityChaos(ends[0][0]).toFixed(2))
		ns.print(" Highest: "+ends[1][0].padEnd(10)+",P:"+ends[1][1].toExponential(2)+",C:"+ns.bladeburner.getCityChaos(ends[1][0]).toFixed(2))
		var y=" Black Operations "+(bol-blackops.length)+"/"+bol+" "
		var x=7;
		ns.print(" "+y.padEnd(x+y.length,"~").padStart(2*x+y.length,"~"))
	}

	while(true){
		ns.clearLog();
		await move();
		if (ns.getPlayer().hp<ns.getPlayer().max_hp){
			if (ns.bladeburner.getCurrentAction().name!='Hyperbolic Regeneration Chamber'){
				ns.bladeburner.startAction('General','Hyperbolic Regeneration Chamber');
			}
		}
		else if (ns.bladeburner.getStamina()[0]>ns.bladeburner.getStamina()[1]*0.55&&help==true){
			await task();
		}
		else{
			help=false;
			if (ns.bladeburner.getStamina()[0]>ns.bladeburner.getStamina()[1]*0.75){help=true}
			ns.print("recovering some stamina")
			/*if (ns.bladeburner.getCurrentAction().name!='Field Analysis'){
				ns.bladeburner.startAction('General','Field Analysis');
			}*/
			if (ns.bladeburner.getCurrentAction().name!='Training'){
				ns.bladeburner.startAction('General','Training');
			}
			
		}
		await spendSkillPoints()
		await ns.sleep(1000);
	}
}