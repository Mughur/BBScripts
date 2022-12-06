/** @param {NS} ns */
export async function main(ns) {
    ns.exit;
//ns.tprint(ns.read('completed_factions.txt'));
var augs=String (ns.getAugmentationsFromFaction(ns.args[0]));
if (augs==""){
    ns.exit;
}
augs=augs.split(",");
var sorted_augs=[[]];
var all=ns.getOwnedAugmentations(true);
for (var i=0;i<augs.length;i++){
    if(augs[i]!="NeuroFlux Governor"&&!all.includes(augs[i])){
        sorted_augs.push([augs[i],ns.singularity.getAugmentationPrice(augs[i])]);
    }
}
sorted_augs.shift();
sorted_augs.sort((a,b) => b[1]-a[1]);
if (sorted_augs.length>0){
    while(sorted_augs[0][0]==null||sorted_augs[0][0]==""){
        sorted_augs.shift();
        if (sorted_augs.length==0){
            var completed=ns.read('completed_factions.txt');
            if (completed!=""){
                completed=completed.split(",");
                if (!completed.includes(ns.args[0])){
                    completed.push(ns.args[0]);
                }
            }
            await ns.rm('completed_factions.txt','home');
            await ns.write('completed_factions.txt',completed);
            ns.tprint('faction '+ns.args[0]+' completed.');
        }
    }
    for (var i=0;i<sorted_augs.length;i++){
        if (ns.getPlayer().money>sorted_augs[i][1]){
            ns.purchaseAugmentation(ns.args[0],sorted_augs[i][0]);
            ns.tprint("bought:"+ns.args[0]+","+sorted_augs[i][0]+", at "+sorted_augs[i][1].toExponential(2));
        }
        else{
            ns.exit();
        }
    }
}
all=ns.getOwnedAugmentations(true);
var to_be_bought=[];
for (var i=0;i<augs.length;i++){
    if (!all.includes(augs[i])){
        to_be_bought.push(augs[i]);
    }
}
var completed=ns.read('completed_factions.txt');
if (completed!=""){
    completed=completed.split(",");
    if (!completed.includes(ns.args[0])){
        completed.push(ns.args[0]);
    }
}

if (to_be_bought.length==0){
    await ns.rm('completed_factions.txt','home');
    await ns.write('completed_factions.txt',completed);
    ns.tprint('faction '+ns.args[0]+' completed.');
}
}