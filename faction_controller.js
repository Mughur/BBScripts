/** @param {NS} ns */
export async function main(ns) {
	ns.disableLog("ALL"); ns.clearLog();
	ns.tail();
	var cities=["Sector-12","Aevum","Volhaven","Chongqing","New Tokyo","Ishima"];
	var cities_capped=[];
	var hacking_groups=["NiteSec","The Black Hand","BitRunners","Netburners","Tian Di Hui","CyberSec","Fulcrum Secret Technologies"];
	const companies=["ECorp","MegaCorp","KuaiGong International","Four Sigma","NWO","Blade Industries","OmniTek Incorporated","Bachman & Associates","Clarke Incorporated","Fulcrum Technologies"];
	var joined_companies=[];
	var factions=ns.getPlayer().factions;
	var fless_companies=[];
	var fless_cities=[];
	var ignore="NeuroFlux Governor";
	var city_combo=-1;
	var combos=[["Sector-12","Aevum"],["Chongqing","New Tokyo","Ishima"],["Volhaven"]];
	var combo_money=[[15,40],[20,20,30],[50]];
	var crimeFactions=["Slum Snakes","Tetrads","Silhouette","Speakers for the Dead","The Dark Army","The Syndicate"];
	var dealing=-1;
	var help=0;
	var noted=false;

	async function update_lists(){
		fless_companies=[];
		for (var i=0;i<companies.length;i++){
			if (factions.includes(companies[i])||(companies[i]=="Fulcrum Technologies"&&factions.includes("Fulcrum Secret Technologies"))){
				continue;
			}	
			else{
				if (!fless_cities.includes(companies[i])){
					fless_companies.push(companies[i]);
				}
			}
		}
		for (var i=0;i<cities.length;i++){
			var augs=ns.singularity.getAugmentationsFromFaction(cities[i]);
			var owned_augs=ns.singularity.getOwnedAugmentations(true);
			var avail_augs=[];
			for (var j=0;j<augs.length;j++){
				if (augs[j]==ignore||owned_augs.includes(augs[j])){
					continue;
				}
				else{
					avail_augs.push(augs[j]);
				}
			}
			if (avail_augs.length==0){
				cities_capped.push(cities[i]);
			}
			else{
				fless_cities.push(cities[i]);
			}
		}
	}
	
	async function join_companies(){
		for (var i=0;i<fless_companies.length;i++){
			if (ns.getPlayer().hacking>=225&&!joined_companies.includes(fless_companies[i])){
				if(ns.applyToCompany(fless_companies[i],"IT")){
					ns.print("joined company "+companies[i]);
					joined_companies.push(fless_companies[i]);
				}
			}
		}
	}

	async function join_factions(){
		var avail_factions=ns.singularity.checkFactionInvitations();
		for (var i=0;i<avail_factions.length;i++){
			if (!cities_capped.includes(avail_factions[i])){
				ns.print("a joined Faction "+avail_factions[i]);
				ns.singularity.joinFaction(avail_factions[i]);
				dealing=-1;
			}
		}
		await update_lists();
	}

	async function get_city_factions(){
		for (var i=0;i<cities.length;i++){
			if (factions.includes(cities[i])){
				for (var j=0;j<3;j++){
					if (combos[j].includes(cities[i])){
						if (city_combo==-1){
							ns.print("already in faction "+cities[i]+", going for combo "+(j+1))
						}
						city_combo=j;
						break;
					}
				}
			}
		}
		if (city_combo==-1){
			for (var i=0;i<cities.length;i++){
				if (cities_capped.includes(cities[i])){
					ns.print("city "+cities[i]+" already capped");
					continue;
				}
				else{
					ns.print("city "+cities[i]+" not capped")
					for (var j=0;j<3;j++){
						if (combos[j].includes(cities[i])){
							city_combo=j;
							break;
						}
					}
					break;
				}
			}
		}
		if (city_combo==-1){
			ns.print("all cities done");
			city_combo=-2;
			noted=true;
			return;
		}
		if (!noted){
			if (city_combo==0){
				ns.print("going for city combo 1: Sector-12 & Aevum");
				noted=true;
			}
			if (city_combo==1){
				ns.print("going for city combo 2: Chongqing, New Tokyo & Ishima");
				noted=true;
			}
			if (city_combo==2){
				ns.print("going for city combo 3: Volhaven");
				noted=true;
			}
		}
		for (var i=0;i<combos[city_combo].length;i++){
			if (!factions.includes(combos[city_combo][i])){
				if (ns.getPlayer().city!=combos[city_combo][i]){
					ns.print("c travel to "+combos[city_combo][i]);
					while (true){
						await ns.singularity.travelToCity(combos[city_combo][i]);
						await ns.sleep(100);
						await join_factions();
						ns.print("ct");
						if (ns.getPlayer().city==combos[city_combo][i]){return}
					}
				}
				if (ns.getPlayer().money<combo_money[city_combo][i]){
					return;
				}
				else if(!(ns.singularity.checkFactionInvitations().includes(combos[city_combo][i]||factions.includes(combos[city_combo][i])))){
					return;
				}
				else{
					if (ns.singularity.joinFaction(combos[city_combo][i])){
						ns.print("b joined Faction "+combos[city_combo][i]);
						return;
					}
				}
			}
		}
		ns.print("cities joined");
		city_combo=-2;
	}

	async function get_crime_factions(){
			var stats=ns.getPlayer();
			var combat_req=75;
		if (!factions.includes(crimeFactions[1])&&(dealing==-1||dealing==1)){
			dealing=-1;
			combat_req=75;
			if (stats.strength>=combat_req&&stats.defense>=combat_req&&stats.dexterity>=combat_req&&stats.agility>=combat_req&&ns.getPlayer().city!="Ishima"){
				ns.singularity.travelToCity("Ishima");
				ns.print("traveling to Ishima for Tetrads")
			}
		}
		if (!factions.includes(crimeFactions[3])&&(dealing==-1||dealing==3)){
			combat_req=300;
			if (stats.hacking>=100&&
			stats.strength>=combat_req&&stats.defense>=combat_req&&stats.dexterity>=combat_req&&stats.agility>=combat_req){
				if (stats.numPeopleKilled<30&&!ns.scriptRunning("killspree.ns","home")){
					ns.exec("killspree.ns","home");
				}
			}
		}
		if (!factions.includes(crimeFactions[4])&&(dealing==-1||dealing==4)){
			combat_req=300;
			if (stats.hacking>=300&&
			stats.strength>=combat_req&&stats.defense>=combat_req&&stats.dexterity>=combat_req&&stats.agility>=combat_req){
				if (stats.numPeopleKilled<5&&!ns.scriptRunning("killspree.ns","home")){
					ns.exec("killspree.ns","home");
				}
				if (stats.city!="Chongqing"){
					ns.singularity.travelToCity("Chongqing");
					ns.print("traveling to Chongqing for The Dark Army")
				}
			}
		}
		if (!factions.includes(crimeFactions[5])&&(dealing==-1||dealing==5)){
			combat_req=200;
			if (stats.hacking>=200&&
			stats.strength>=combat_req&&stats.defense>=combat_req&&stats.dexterity>=combat_req&&stats.agility>=combat_req){
				if (stats.numPeopleKilled<5&&!ns.scriptRunning("killspree.ns","home")){
					ns.exec("killspree.ns","home");
				}
				if (stats.city!="Chongqing"){
					ns.singularity.travelToCity("Chongqing");
					ns.print("traveling to Chongqing for The Syndicate")
				}
			}
		}

		if (dealing!=-1){
			if (factions.includes(crimeFactions[dealing])){
				dealing=-1;
			}
		}
		else{
			if (factions.includes(crimeFactions[0])
			&&factions.includes(crimeFactions[1])
			&&factions.includes(crimeFactions[3])
			&&factions.includes(crimeFactions[4])
			&&factions.includes(crimeFactions[5])){
				ns.print("crime factions joined");
				city_combo=-3;
			}
		}
	}

	update_lists();
	while(true){
		factions=ns.getPlayer().factions;
		await join_factions();
		await join_companies();
		dealing=-1;
		if (city_combo>-2){await get_city_factions();}
		if(city_combo==-2){await get_crime_factions();}
		await ns.sleep(1000);
	}
}