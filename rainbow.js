/** @param {NS} ns */
export async function main(ns) {
	ns.disableLog("ALL"); ns.clearLog();ns.tail();
    //set color goals: red, orange, yellow, green, blue, indigo, violet
    const goals=[[255,0,0],[255,165,0],[255,255,0],[0,128,0],[0,0,255],[75,0,130],[238,100,238]];
    //which part of goals next
    var next=0;
    var dir=1;

    function intToRGB(rgb=[0,0,0]){ //int values to hex rgb
        let start="#"
        let r=rgb[0].toString(16).padStart(2,"0")
        let g=rgb[1].toString(16).padStart(2,"0")
        let b=rgb[2].toString(16).padStart(2,"0")
        return start.concat(r,g,b);
    }

    function hexToInt(num){ //int values from hex rgb
        let r=parseInt(num.slice(1,3),16)
        let g=parseInt(num.slice(3,5),16)
        let b=parseInt(num.slice(5,7),16)
        return [r,g,b]
    }

    while(true){
        await ns.sleep(0);
        var theme=ns.ui.getTheme()
        // colour hp based on hp/maxhp, green when health at max, red when at 0
        var hp_ratio=ns.getPlayer().hp/ns.getPlayer().max_hp
        var hp=intToRGB([255-Math.floor(hp_ratio*255),Math.floor(hp_ratio*255),0])
        theme.hp=hp

        let theme_rgb=hexToInt(theme.primary)
        //move to next goal when goal reached
        if (String(theme_rgb)===String(goals[next])){
            next=Math.floor(Math.random()*(goals.length))
            /*if(dir==1){
                if (next==goals.length-1){dir=0;next--;}
                else {next++;}
            }
            else{
                if (next==0){
                    dir=1;next++;}
                else {next--;}
            }*/
        }
        //shift colours by 10 or to goal if about to overshoot
        for (let i=0;i<3;i++){
            if (theme_rgb[i]<goals[next][i]){
                theme_rgb[i]=theme_rgb[i]+Math.min(10,goals[next][i]-theme_rgb[i])}
            if (theme_rgb[i]>goals[next][i])theme_rgb[i]=theme_rgb[i]-Math.min(10,theme_rgb[i]-goals[next][i])
        }
        theme.primary=intToRGB(theme_rgb);
        ns.print(theme.primary)

        //set new theme
        ns.ui.setTheme(theme);
    }
}