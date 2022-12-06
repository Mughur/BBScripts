/** @param {NS} ns */
export async function main(ns) {
	if (!ns.fileExists("BruteSSh.exe","home")) {
		ns.singularity.purchaseProgram("BruteSSh.exe");}

	if (!ns.fileExists("FTPCrack.exe","home")) {
		ns.singularity.purchaseProgram("FTPCrack.exe");}

	if (!ns.fileExists("relaySMTP.exe","home")) {
		ns.singularity.purchaseProgram("relaySMTP.exe");}

	if (!ns.fileExists("HTTPWorm.exe","home")) {
		ns.singularity.purchaseProgram("HTTPWorm.exe");}

	if (!ns.fileExists("SQLinject.exe","home")) {
		ns.singularity.purchaseProgram("SQLinject.exe");}

}