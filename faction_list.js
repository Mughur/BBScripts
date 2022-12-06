/** @param {NS} ns */
export async function main(ns) {
	ns.rm('faction_list.txt','home');
	var data=ns.checkFactionInvitations();
	data=data.splice(",");
	var read_cities=ns.read('cityfactions.txt');
	var written_cities=[];
	if (read_cities!=""){
		read_cities=read_cities.splice(",");	
	}
	var processed_data=[];
	for (var i=0;i<data.length;i++){
		if (!read_cities.includes(data[i])){
			var augs=ns.getAugmentationsFromFaction(data[i]);
			var found=false;
			for (var j=0;j<augs.length;j++){
				if (!ns.getOwnedAugmentations(true).includes(augs[j])&&found==false){
					processed_data.push(data[i]);
					found=true;
				}
			}
			if (found==false){
				written_cities.push(data[i]);
			}
		}
		else{
			written_cities.push(data[i]);
		}
	}
	//ns.rm('cityFactions.txt','home');
	ns.rm('faction_list.txt','home');
	//await ns.write('cityFactions.txt',written_cities);
	await ns.write('faction_list.txt',processed_data);
}