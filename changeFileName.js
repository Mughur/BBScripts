/** @param {NS} ns */
export async function main(ns) {
	const originalName=ns.args[0];
	const targetName=ns.args[1];
	let found=[false,false];
	for (const script of ns.ls("home")){
		if (script==originalName)found[0]=true
		if (script==targetName)found[1]=true
	}
	if (!found[0]){
		ns.tprint("file "+originalName+" not found.")
		ns.exit();
	}
	if (found[1]){
		ns.tprint("file with target name already exists")
		ns.exit();
	}
	{
		const contents=ns.read(originalName);
		ns.write(targetName,contents);
		if (!ns.rm(originalName))ns.tprint("file removal was unsuccessful");
		ns.tprint("file succesfully renamed");
	}
	for (const script of ns.ls("home")){
		let contents = ns.read(script)
		if (contents.includes(originalName)){
			contents=contents.replaceAll("'"+originalName+"'","'"+targetName+"'");
			contents=contents.replaceAll('"'+originalName+'"','"'+targetName+'"');
			ns.write(script,contents,"w");
		}
	}
	ns.tprint("name mentions updated");
}