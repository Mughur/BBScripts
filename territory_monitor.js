/** @param {NS} ns */
export async function main(ns) {
    ns.tail();ns.disableLog("ALL");
        var own_gang=ns.gang.getGangInformation().faction;
        var temp=[0,0,0,0,0,0,0];
        var check=[0,0,0,0,0,0,0];
        var change=[];
        for (let i=0;i<7;i++){
            change.push([0,0,0,0,0]);
        }
        var territories=[];
        async function check_gangs(){
            territories=[];
            var gangs=Object.keys(ns.gang.getOtherGangInformation())
            for (let i=0;i<7;i++){
                if (Object.values(ns.gang.getOtherGangInformation())[i].territory>0){		
                    if (gangs[i]=="Speakers for the Dead"){
                        gangs[i]="Speakers";
                    }
                    if (gangs[i].includes("The")){
                        gangs[i]=gangs[i].slice(4)
                    }
                    territories.push([Object.values(ns.gang.getOtherGangInformation())[i].power,gangs[i]])
                }
            }
        }
    
        while(true){
            check_gangs();
            temp=[];
            ns.clearLog();
            for (let i=0;i<territories.length;i++){
                var terr=territories[i][0]
                temp[i]=terr;
            }
            var help=true;
            for (let i=0;i<territories.length;i++){
                if (temp[i]!=check[i]){
                    help=false;
                }
            }
            if (!help){
                for (let i=0;i<territories.length;i++){
                    change[i][0]=change[i][1]
                    change[i][1]=change[i][2]
                    change[i][2]=change[i][3]
                    change[i][3]=change[i][4]
                    change[i][4]=temp[i]-check[i];
                }
                check=temp;
            }
            ns.print("- Faction --- Power ------ -4 ------ -3  ----- -2  ----- -1  ------ 0 ----- AVG")
            for (let i=0;i<territories.length;i++){
                var text=territories[i][1].padEnd(11)+": "+territories[i][0].toExponential(2);
                text=text+" -- ";
                for (let j=0;j<5;j++){
                    if (j>0){
                        text+=" < "
                    }
                    if (change[i][j]>=0){
                        text+=(" "+change[i][j].toExponential(1)).padEnd(6);
                    }
                    else{
                        text+=change[i][j].toExponential(1).padEnd(7);
                    }
                }
                var avg=change[i][0]+change[i][1]+change[i][2]+change[i][3]+change[i][4]
                avg=avg/5;
                if (avg>0){
                    ns.print(text+" > "+avg.toExponential(2))
                }
                else{
                    ns.print(text+" > "+avg.toExponential(2))
                }
            }
            await ns.sleep(1000);
        }
    }