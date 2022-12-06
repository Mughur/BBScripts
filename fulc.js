/** @param {NS} ns */
export async function main(ns) {
	ns.tail();
	ns.clearLog();
	ns.print(ns.getPlayer().jobs)
	ns.applyToCompany("FoodNStuff","Employee");
}