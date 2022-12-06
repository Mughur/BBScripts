/** @param {NS} ns */
export async function main(ns) {
	let serv=["home"]
	for (let s of serv){
		for (let sc of ns.scan(s)){
			if(!serv.includes(sc))serv.push(sc)
		}
	}
	for (let s of serv){
		for (let scr of ns.ps(s)){
			if (scr.filename.includes("weak"))ns.kill(scr.pid)
		}
	}
}