/** @param {NS} ns */
export async function main(ns) {
	var route=[ns.args[0]];

	while(route[0]!="home"){
		route.unshift(ns.scan(route[0])[0]);
	}
	for (var i=0; i<route.length; i++){
		ns.singularity.connect(route[i]);
	}
}