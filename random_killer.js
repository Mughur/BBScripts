/** @param {NS} ns */
export async function main(ns) {
	await ns.sleep(1000);
	let current=ns.getServer();
	let connected =ns.scan(current);
	let next=connected(Math.floor(Math.random()*(connected.length)));
	ns.killall(current,true);
	ns.scp('random_killer.js',connected[next]);
	ns.exec('random_killer.js',connected[next]);
}