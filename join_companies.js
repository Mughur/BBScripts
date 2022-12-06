/** @param {NS} ns */
export async function main(ns) {
	var companies=["ECorp","MegaCorp","KuaiGong International","Four Sigma","NWO","Blade Industries","OmniTek Incorporated","Bachman & Associates","Clarke Incorporated","Fulcrum Technologies"];
	for (var i=0;i<companies.length;i++){
		ns.applyToCompany(companies[i],"IT");
	}
}