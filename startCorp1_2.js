/** @param {NS} ns */
export async function main(ns) {
	ns.tail(); ns.disableLog("ALL"); ns.clearLog();
	/*checked to work in 1.7 and 2.0 (8e859d84) in BNs 3,9 and 11
	NOTE!! SF3.3 required for this to work

	Script created by Mughur, following step-by-step the tinkered and expanded guide: https://docs.google.com/document/d/1eqQ_KTnk3VkW1XLHjM2fAQbCNY05CTCE85mJFjeFDE8/edit
	Run this script before creating the corporation, running the script after corp creation or doing anything to corp manually during it's runtime may cause unwanted behaviour
	The script is designed to work on all BNs with the exception of BN13 (stops working in later BN12s, not sure at which point).
	In order for it to work properly in nodes with valuation <=0.5, one or more of the steps has to be skipped or tinkered.
	Script is purposefully not optimized, as I do not want to give out too many tricks on how to build the main corp script.
	Corporations are OP, I think people should put the work in in order to fully utilize them, but feel free to get inspirations from this script.

	This script will take about 20-30 minutes to run depending on RNG, starts by creating a corporation and ends after starting the development of 1st tobacco product and spending available money on upgrades.
	*/

	// enter wanted corporation, agriculture and tobacco division names
	const companyName = "Money Printer";
	const agricultureName = "AG";
	const tobaccoName = "TB";

	//constants, do not touch
	const jobs = ["Operations", "Engineer", "Business", "Management", "Research & Development"];
	const boostMaterials = ["Hardware", "Robots", "AI Cores", "Real Estate"]
	const levelUpgrades = ["Smart Factories", "Smart Storage", "FocusWires", "Neural Accelerators", "Speech Processor Implants", "Nuoptimal Nootropic Injector Implants", "Wilson Analytics"]
	const cities = ["Aevum", "Chongqing", "New Tokyo", "Ishima", "Volhaven", "Sector-12"];

	//tinker with these at some point
	//Hardware, Robots, AI Cores, Real Estate
	const materialPhases = [
		[125, 0, 75, 27000],
		[2675, 96, 2445, 119400],
		[6500, 630, 3750, 84000]
	]
	let c=eval("ns.corporation")
	//if you have to reset the game/script for some reason, change the stage[0] to the proper stage
	let stage = [0, 0]; //stage, step

	while (true) {
		await checkStage();
		await coffeeParty();
		while (c.getCorporation().state != "EXPORT") {
			//when you make your main script, put things you want to be done 
			//potentially multiple time every cycle, like buying upgrades, here.
			await ns.sleep(0);
		}

		while (c.getCorporation().state == "EXPORT") {
			//same as above
			await ns.sleep(0);
		}
		//and to this part put things you want done exactly once per cycle
	}

	async function coffeeParty(){

	}

	async function checkStage() {
		switch (stage[0]) {
			case 0:
				ns.print("Initial purchases")
				await startstuff(); // stage 0
				break;
			case 1:
				ns.print("Buying first production multiplier materials")
				await purchaseMaterials(0); // stage 1
				break;
			case 2:
				await waitForTheLazyFucksToGetTheirShitTogether(); // stage 2
				break;
			case 3:
				await invest(1); // stage 3
				break;
			case 4:
				await upgradeStuff(1); // stage 4
				break;
			case 5:
				await waitForTheLazyFucksToGetTheirShitTogether(); // stage 5
				break;
			case 6:
				await purchaseMaterials(1); // stage 6
				break;
			case 7:
				await invest(2); // stage 7
				break;
			case 8:
				await purchaseMaterials(2); // stage 8
				break;
			case 9:
				await expandToTobacco(); // stage 9
				break;
			case 10:
				// enter the main corp script below or remove/comment out ns.spawn if you don't have one
				ns.spawn("corp.js");
		}
	}

	async function startstuff() {
		c.createCorporation(companyName, false);
		c.createCorporation(companyName, true);
		c.expandIndustry("Agriculture", agricultureName);
		c.unlockUpgrade("Smart Supply");

		for (let city of cities) {
			if (city != cities[5]) {
				c.expandCity(agricultureName, city);
				c.purchaseWarehouse(agricultureName, city);
			}
			c.setSmartSupply(agricultureName, city, true);
			while (c.hireEmployee(agricultureName, city)) { } // this looks odd but it works
			for (let i = 0; i < 3; i++) {
				c.setAutoJobAssignment(agricultureName, city, jobs[i], 1);
			}
			c.sellMaterial(agricultureName, city, "Plants", "MAX", "MP");
			c.sellMaterial(agricultureName, city, "Food", "MAX", "MP");
		}

		c.hireAdVert(agricultureName);
		c.levelUpgrade(levelUpgrades[0])
		c.levelUpgrade(levelUpgrades[2])
		c.levelUpgrade(levelUpgrades[3])
		c.levelUpgrade(levelUpgrades[4])
		c.levelUpgrade(levelUpgrades[5])
		c.levelUpgrade(levelUpgrades[0])
		c.levelUpgrade(levelUpgrades[2])
		c.levelUpgrade(levelUpgrades[3])
		c.levelUpgrade(levelUpgrades[4])
		c.levelUpgrade(levelUpgrades[5])

		for (let i = 0; i < 2; i++) {
			for (let city of cities) {
				try { c.upgradeWarehouse(agricultureName, city, 1); } catch { }
			}
		}
		stage[0] += 1;
	}

	async function purchaseMaterials(phase) {
		if (stage[1] == 0) {
			for (let city of cities) {
				for (let i = 0; i < 4; i++) {
					c.buyMaterial(agricultureName, city, boostMaterials[i], materialPhases[phase][i]/10);
				}
			}
			stage[1] += 1;
		}
		else {
			for (let city of cities) {
				for (let i = 0; i < 4; i++) {
					c.buyMaterial(agricultureName, city, boostMaterials[i], 0);
				}
			}
			stage[0] += 1;
			stage[1] = 0;
		}
	}

	async function waitForTheLazyFucksToGetTheirShitTogether() {
		let avgs = [0, 0, 0];
		for (let city of cities) {
			avgs[0] += c.getOffice(agricultureName, city).avgMor
			avgs[1] += c.getOffice(agricultureName, city).avgHap
			avgs[2] += c.getOffice(agricultureName, city).avgEne
		}
		ns.clearLog();
		ns.print("waiting for employee stats to rise");
		ns.print("   avg morale: " + (avgs[0] / 6).toFixed(3) + "/100")
		ns.print("avg happiness: " + (avgs[1] / 6).toFixed(3) + "/99.998")
		ns.print("   avg energy: " + (avgs[2] / 6).toFixed(3) + "/99.998")
		if (avgs[0] / 6 >= 99.99999 && avgs[1] / 6 >= 99.998 && avgs[2] / 6 >= 99.998) { stage[0] += 1; stage[1] = 0; }
	}

	async function invest(i) {
		if (stage[1] == 0) {
			ns.print("waiting for a bit, just in case the investors might give a bit more money")
		}
		// investor evaluation takes into account 5 cycles 
		// and we want them to take into account the current high earning cycles,
		// not the old low earning cycles, so we'll wait for a bit.
		if (stage[1] < 5) {
			ns.print("waiting cycles: " + stage[1] + "/5. investors are currently offering: " + ns.nFormat(c.getInvestmentOffer().funds, "0.00a"));
			stage[1] += 1;
		}
		else {
			ns.tprint("investment offer round " + i + ": " + ns.nFormat(c.getInvestmentOffer().funds, "0.00a"))
			c.acceptInvestmentOffer();
			stage[0] += 1;
			stage[1] = 0;
		}
	}

	async function upgradeStuff() {
		try { c.levelUpgrade(levelUpgrades[1]); } catch { }
		try { c.levelUpgrade(levelUpgrades[1]); } catch { }
		for (let i = 0; i < 8; i++) {
			try { c.levelUpgrade(levelUpgrades[0]) } catch { };
			try { c.levelUpgrade(levelUpgrades[1]) } catch { };
		}
		for (let i = 0; i < 2; i++) {
			for (let city of cities) {
				try {
					c.upgradeOfficeSize(agricultureName, city, 3);
					while (c.hireEmployee(agricultureName, city)) { };
					c.setAutoJobAssignment(agricultureName, city, jobs[0], 1 + i)
					c.setAutoJobAssignment(agricultureName, city, jobs[1], 1 + i)
					c.setAutoJobAssignment(agricultureName, city, jobs[2], 2 + i)
					c.setAutoJobAssignment(agricultureName, city, jobs[3], 2)
				} catch { }
			}
		}

		for (let i = 0; i < 7; i++) {
			for (let city of cities) {
				try { c.upgradeWarehouse(agricultureName, city, 1); } catch { }
			}
		}
		stage[0] += 1;
	}

	async function expandToTobacco() {
		try { c.expandIndustry("Tobacco", tobaccoName); } catch { ns.tprint("Couldn't expand.. no money"); ns.exit(); }
		c.expandCity(tobaccoName, cities[0]);
		c.purchaseWarehouse(tobaccoName, cities[0]);
		try {
			for (let i = 0; i < 9; i++) {
				c.upgradeOfficeSize(tobaccoName, cities[0], 3);
				while (c.hireEmployee(tobaccoName, cities[0])) { }
				c.setAutoJobAssignment(tobaccoName, cities[0], jobs[0], Math.floor(c.getOffice(tobaccoName, cities[0]).employees.length / 3.5))
				c.setAutoJobAssignment(tobaccoName, cities[0], jobs[1], Math.floor(c.getOffice(tobaccoName, cities[0]).employees.length / 3.5))
				c.setAutoJobAssignment(tobaccoName, cities[0], jobs[2], Math.floor(0.5 * c.getOffice(tobaccoName, cities[0]).employees.length / 3.5))
				c.setAutoJobAssignment(tobaccoName, cities[0], jobs[3], Math.ceil(c.getOffice(tobaccoName, cities[0]).employees.length / 3.5))
			}
		} catch { }

		for (let i = 0; i < 2; i++) {
			for (let city of cities) {
				if (city == cities[0]) continue;
				try {
					c.expandCity(tobaccoName, city);
					c.purchaseWarehouse(tobaccoName, city);
				} catch { }
				c.upgradeOfficeSize(tobaccoName, city, 3);
				while (c.hireEmployee(tobaccoName, city)) { }
				c.setAutoJobAssignment(tobaccoName, city, jobs[0], 1)
				c.setAutoJobAssignment(tobaccoName, city, jobs[1], 1)
				c.setAutoJobAssignment(tobaccoName, city, jobs[2], 1)
				c.setAutoJobAssignment(tobaccoName, city, jobs[3], 1)
				c.setAutoJobAssignment(tobaccoName, city, jobs[4], 5)
			}
		}

		c.makeProduct(tobaccoName, cities[0], "Stick 1", 1e9, 1e9);
		try {
			for (let i = 2; i < 6; i++) {
				c.levelUpgrade("DreamSense");
			}
		} catch { }
		try {
			for (let i = 2; i < 6; i++) {
				while (c.getUpgradeLevel(levelUpgrades[i]) < 20) {
					c.levelUpgrade(levelUpgrades[i]);
				}
			}
		} catch { }
		try {
			for (let i = 0; i < 10; i++) {
				c.levelUpgrade("Project Insight");
			}
		} catch { }

		stage[0] += 1;
	}
}