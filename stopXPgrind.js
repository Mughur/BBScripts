/** @param {NS} ns */
export async function main(ns) {
	let allServers=["home"]
	for (let server of allServers){
		for (let scanned of ns.scan(server)){
			if (!allServers.includes(scanned))allServers.push(scanned)
		}
	}
	for (let server of allServers){
		for (let script of ns.ps(server)){
			if (script.filename=="inf_weak.js" || script.filename=="inf_grow.js") ns.kill(script.pid)
		}
	}
}