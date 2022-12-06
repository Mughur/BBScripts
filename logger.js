/** @param {NS} ns */
export async function main(ns) {
	ns.tail();ns.disableLog("ALL");ns.clearLog();

	/* 	How to use:
	*	Select log options below, true for that thing to be logged, false to be skipped.
	*	Start simultaneously with a script that creates corporation.
	*	During the run the script's log will show the current cycle's object.
	*	The script will write a .txt file, which has to be then run through some 
	*	other script (I've made a python script) that will turn the data into an excel sheet.
	*	The sheet can be used to make pretty graphs
	*/
	const log_options={
		"corp_funds":true, //total corp funds
		"corp_revenue":true, //total corp revenue
		"corp_expenses":true, //total corp expense
		"corp_profit":true, //total corp profit
		"corp_sharePrice":true, //corp share price
		"investor_round":true, //which investor round is being offered
		"investor_money":true, //how much investors are offering
		"upgradeLevels":true, //all leveled upgrades
		"divisionCount":true, //number of divisions
		"divisions":true, //all division specific data, if false, none of the options below matter
		"division_revenue":true, //each division's revenue
		"division_expense":true, //each division's expense
		"division_profit":true, //each division's profit
		"division_awareness":true, //each division's awareness
		"division_popularity":true, //each division's popularity
		"division_research":true, //each division's research
		"division_prodMult":true, //each division's production multiplier
		"division_cities":true, //all city specific data, if false, none of the options below matter
		"city_morale":true, //each division's cities' employees' average morale
		"city_happiness":true, //each division's cities' employees' average happiness
		"city_energy":true, //each division's cities' employees' average energy
		"city_size":true, //each division's cities' office size
		"city_storage":true, //each division's cities' office size
		"city_prodMaterials":true, //each division's cities' all production materials
	}

	const cities=["Sector-12","Chongqing","New Tokyo","Ishima","Volhaven","Aevum"];

	//the script gets a Date.now() time from the corp starting script, or uses the current time. these are to ensure a searchable unique name for each log
	if (ns.args.length==0){var fileName="log"+Date.now()+".txt";}
	else{var fileName="log"+ns.args[0]+".txt";}
	ns.write(fileName,"","w");

	//let c=eval("ns.corporation"); //evil exploit for logging purposes
	let c=ns.corporation; //comment of this and previous switches to get autofill

	const corp_options = new Map([
		['funds', () => c.getCorporation().funds.toFixed(3)],
		['revenue', () => c.getCorporation().revenue.toFixed(3)],
		['expenses', () => c.getCorporation().expenses.toFixed(3)],
		['profit', () => (c.getCorporation().revenue-c.getCorporation().expenses).toFixed(3)],
	]);

	const investor_options = new Map([
		['round', () => c.getInvestmentOffer().round],
		['money', () => c.getInvestmentOffer().funds]
	])

	const div_options = new Map([
		['revenue', (div) => div.lastCycleRevenue.toFixed(3)],
		['expense', (div) => div.lastCycleExpenses.toFixed(3)],
		['profit', (div) => (div.lastCycleRevenue-div.lastCycleExpenses).toFixed(3)],
		['awareness', (div) => div.awareness.toFixed(3)],
		['popularity', (div) => div.popularity.toFixed(3)],
		['research', (div) => div.research.toFixed(3)],
		['prodMult', (div) => div.prodMult.toFixed(3)],
		['morale', () => ({})],
		['happiness', () => ({})],
		['energy', () => ({})],
		['size', () => ({})],
		['storage', () => ({})],
		['Hardware', () => ({})],
		['Robots', () => ({})],
		['AI Cores', () => ({})],
		['Real Estate', () => ({})],
	]);

	const city_options = new Map([
		['morale', () => ({})],
		['happiness', () => ({})],
		['energy', () => ({})],
		['size', () => ({})],
		['storage', () => ({})],
		['Hardware', () => ({})],
		['Robots', () => ({})],
		['AI Cores', () => ({})],
		['Real Estate', () => ({})],
	]);

	const storage_options = new Map([
		['storage', (div,city) => c.getWarehouse(div.name,city).size.toFixed(0)],
		['Hardware', (div,city) => c.getMaterial(div.name,city,'Hardware').qty.toFixed(3)],
		['Robots', (div,city) => c.getMaterial(div.name,city,'Robots').qty.toFixed(3)],
		['AI Cores', (div,city) => c.getMaterial(div.name,city,'AI Cores').qty.toFixed(3)],
		['Real Estate', (div,city) => c.getMaterial(div.name,city,'Real Estate').qty.toFixed(3)],
	]);

	const employee_options = new Map([
		['morale'],
		['happiness'],
		['energy'],
	]);

	let cycles=0; //used for counting cycles

	while(!ns.getPlayer().hasCorporation){
		await ns.sleep(0);
	}
	while(true){
		let divisionsObject={} //each cycle gets a fresh object
		//stuff are added to the object based on the logging options

		for (const [option, getValue] of corp_options) {
			if (log_options[`corp_${option}`]) divisionsObject[option] = getValue();
		}
		if (log_options["upgradeLevels"]){
			for (let level of c.getUpgradeNames()){
				divisionsObject[level]=c.getUpgradeLevel(level);
			}
		}
		for (const [option, getValue] of investor_options) {
			if (log_options[`investor_${option}`]) divisionsObject[`investor_${option}`] = getValue();
		}
		if (log_options["divisionCount"])divisionsObject["divisions"]=c.getCorporation().divisions.length;
		if (log_options["divisions"]){
			for (let div of c.getCorporation().divisions){
				divisionsObject[div.name]={}
				for (const [option, getValue] of div_options) {
					if (log_options[`division_${option}`]||log_options[`city_${option}`]) divisionsObject[div.name][option] = getValue(div);
					if (['Hardware','Robots','AI Cores','Real Estate'].includes(option)){
						divisionsObject[div.name][option] = getValue(div);
					}
				}
				if (log_options['division_cities']){
					for (let city of cities){
						if (!div.cities.includes(city)){
							for (const [option] of city_options){
								if(log_options[`city_${option}`]) divisionsObject[div.name][option][city]=-1;
							}
							if(log_options['city_size']) divisionsObject[div.name]['size'][city]=-1;
						}
						else{
							let [n,morale,happiness,energy]=[0,0,0,0];
							for (let emp of c.getOffice(div.name,city).employees){
								n++;
								morale+=c.getEmployee(div.name,city,emp).mor
								happiness+=c.getEmployee(div.name,city,emp).hap
								energy+=c.getEmployee(div.name,city,emp).ene
							}
							if(log_options[`city_morale`]) divisionsObject[div.name]['morale'][city]= (n!=0 ? ((morale)/n).toFixed(3) : 0);
							if(log_options[`city_happiness`]) divisionsObject[div.name]['happiness'][city]= (n!=0 ? ((happiness)/n).toFixed(3) : 0);
							if(log_options[`city_energy`]) divisionsObject[div.name]['energy'][city]= (n!=0 ? ((energy)/n).toFixed(3) : 0);
							if(log_options['city_size']) divisionsObject[div.name]['size'][city]=c.getOffice(div.name,city).size;
							for (const [option, getValue] of storage_options) {
								if (log_options[`city_${option}`]) divisionsObject[div.name][option][city] = getValue(div,city);
								if (['Hardware','Robots','AI Cores','Real Estate'].includes(option)){
									if (log_options[`city_prodMaterials`]){
										if (c.hasWarehouse(div.name,city)){
											divisionsObject[div.name][option][city] = getValue(div,city);
										}
										else{
											divisionsObject[div.name][option][city] = -1;
										}
									}
								}
							}
						}
					}
				}
			}
		}

		ns.write(fileName,cycles+": "+JSON.stringify(divisionsObject)+"\n")
		ns.print(cycles);
		for (var thing in divisionsObject){
			ns.print(thing+": "+JSON.stringify(divisionsObject[thing]))
		}
		cycles++;

		if (c.getCorporation().revenue>1e100||ns.getPlayer().money>112e15)ns.exit(); //check if target is reached and if so, exit

		//wait for the rest of the cycle
		while(c.getCorporation().state!="EXPORT"){
			await ns.sleep(1000);
		}

		while(c.getCorporation().state=="EXPORT"){
			await ns.sleep(0);
		}
		ns.clearLog();
	}
}