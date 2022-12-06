/** @param {NS} ns */
export async function main(ns) {
	ns.tail(); ns.disableLog("ALL"); ns.clearLog();
	/*checked to work in 1.7 and 2.0 (8e859d84) in BNs 3,9 and 11
	NOTE!! SF3.3 required for this to work

	Script created by Mughur, following step-by-step the guide compiled and arranged by /u/angrmgmt00 link: https://docs.google.com/document/d/e/2PACX-1vTzTvYFStkFjQut5674ppS4mAhWggLL5PEQ_IbqSRDDCZ-l-bjv0E6Uo04Z-UfPdaQVu4c84vawwq8E/pub
	Run this script before creating the corporation, running the script after corp creation or doing anything to corp manually during it's runtime may cause unwanted behaviour
	The script is designed to work on all BNs with the exception of BN13 (stops working in later BN12s, not sure at which point).
	In order for it to work properly in nodes with valuation <=0.5, one or more of the steps has to be skipped or tinkered.
	Script is purposefully not optimized, as I do not want to give out too many tricks on how to build the main corp script.
	Corporations are OP, I think people should put the work in in order to fully utilize them, but feel free to get inspirations from this script.

	This script will take about 20 minutes to run, starts by creating a corporation and ends after starting the development of 1st tobacco product and spending available money on upgrades.
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

	await startstuff();
	await initialPurchases();
	await waitForTheLazyFucksToGetTheirShitTogether();
	await invest(1);
	await upgradeStuff();
	await waitForTheLazyFucksToGetTheirShitTogether();
	await buyMoreStuff();
	await waitCycles(5);
	await invest(2);
	await buyEvenMoreStuff();
	await expandToTobacco();
	// enter the main corp script below or remove/comment out ns.spawn if you don't have one
	ns.spawn("corp.js");

	async function startstuff() {
		ns.corporation.createCorporation(companyName, false);
		ns.corporation.createCorporation(companyName, true);
		ns.corporation.expandIndustry("Agriculture", agricultureName);
		ns.corporation.unlockUpgrade("Smart Supply");

		for (let city of cities) {
			if (city != cities[5]) {
				ns.corporation.expandCity(agricultureName, city);
				ns.corporation.purchaseWarehouse(agricultureName, city);
			}
			ns.corporation.setSmartSupply(agricultureName, city, true);
			for (let i = 0; i < 3; i++) {
				await ns.corporation.assignJob(agricultureName, city, ns.corporation.hireEmployee(agricultureName, city).name, jobs[i])
			}
			ns.corporation.sellMaterial(agricultureName, city, "Plants", "MAX", "MP");
			ns.corporation.sellMaterial(agricultureName, city, "Food", "MAX", "MP");
		}

		try {
			ns.corporation.hireAdVert(agricultureName);
			ns.corporation.levelUpgrade(levelUpgrades[0])
			ns.corporation.levelUpgrade(levelUpgrades[2])
			ns.corporation.levelUpgrade(levelUpgrades[3])
			ns.corporation.levelUpgrade(levelUpgrades[4])
			ns.corporation.levelUpgrade(levelUpgrades[5])
			ns.corporation.levelUpgrade(levelUpgrades[0])
			ns.corporation.levelUpgrade(levelUpgrades[2])
			ns.corporation.levelUpgrade(levelUpgrades[3])
			ns.corporation.levelUpgrade(levelUpgrades[4])
			ns.corporation.levelUpgrade(levelUpgrades[5])
		} catch { }

		for (let i = 0; i < 2; i++) {
			for (let city of cities) {
				try { ns.corporation.upgradeWarehouse(agricultureName, city, 1); } catch { }
			}
		}
	}

	async function initialPurchases() {
		for (let city of cities) {
			ns.corporation.buyMaterial(agricultureName, city, boostMaterials[0], 12.5);
			ns.corporation.buyMaterial(agricultureName, city, boostMaterials[2], 7.5);
			ns.corporation.buyMaterial(agricultureName, city, boostMaterials[3], 2700);
		}

		while (ns.corporation.getMaterial(agricultureName, cities[0], boostMaterials[0]).qty == 0) {
			ns.print("waiting for the state loop to finish")
			await ns.sleep(0);
			ns.clearLog();
		}

		for (let city of cities) {
			ns.corporation.buyMaterial(agricultureName, city, boostMaterials[0], 0);
			ns.corporation.buyMaterial(agricultureName, city, boostMaterials[2], 0);
			ns.corporation.buyMaterial(agricultureName, city, boostMaterials[3], 0);
		}
	}

	async function waitForTheLazyFucksToGetTheirShitTogether() {
		while (true) {
			let avgs = [0, 0, 0];
			for (let city of cities) {
				for (let emp of ns.corporation.getOffice(agricultureName, city).employees) {
					avgs[0] += (ns.corporation.getEmployee(agricultureName, city, emp).mor) / ns.corporation.getOffice(agricultureName, city).employees.length
					avgs[1] += (ns.corporation.getEmployee(agricultureName, city, emp).hap) / ns.corporation.getOffice(agricultureName, city).employees.length
					avgs[2] += (ns.corporation.getEmployee(agricultureName, city, emp).ene) / ns.corporation.getOffice(agricultureName, city).employees.length
				}
			}
			ns.print("waiting for employee stats to rise");
			ns.print("   avg morale: " + (avgs[0]/6).toFixed(3) + "/100")
			ns.print("avg happiness: " + (avgs[1]/6).toFixed(3) + "/99.998")
			ns.print("   avg energy: " + (avgs[2]/6).toFixed(3) + "/99.998")
			await ns.sleep(1000);
			ns.clearLog();
			if (avgs[0]/6 >= 99.99999 && avgs[1]/6 >= 99.998 && avgs[2]/6 >= 99.998) break;
		}
	}

	async function invest(i) {
		await ns.sleep(10000);
		ns.tprint("investment offer round " + i + ": " + ns.nFormat(ns.corporation.getInvestmentOffer().funds, "0.00a"))
		ns.corporation.acceptInvestmentOffer();
	}

	async function waitCycles(n) {
		for (let i = 1; i <= n; i++) {
			while (ns.corporation.getCorporation().state != "START") {
				await ns.sleep(0);
			}

			while (ns.corporation.getCorporation().state == "START") {
				await ns.sleep(0);
			}
			ns.print("cycle " + i + "/" + n + ". Current investor offer: "+ns.nFormat(ns.corporation.getInvestmentOffer().funds,"$0.00a"))
		}
	}

	async function upgradeStuff() {
		try { ns.corporation.levelUpgrade(levelUpgrades[1]); } catch { }
		try { ns.corporation.levelUpgrade(levelUpgrades[1]); } catch { }
		for (let i = 0; i < 8; i++) {
			try { ns.corporation.levelUpgrade(levelUpgrades[0]) } catch { };
			try { ns.corporation.levelUpgrade(levelUpgrades[1]) } catch { };
		}
		for (let i = 0; i < 2; i++) {
			for (let city of cities) {
				try {
					ns.corporation.upgradeOfficeSize(agricultureName, city, 3);
					while (ns.corporation.hireEmployee(agricultureName, city)) { };
					ns.corporation.setAutoJobAssignment(agricultureName, city, jobs[0], 1+i)
					ns.corporation.setAutoJobAssignment(agricultureName, city, jobs[1], 1+i)
					ns.corporation.setAutoJobAssignment(agricultureName, city, jobs[2], 2+i)
					ns.corporation.setAutoJobAssignment(agricultureName, city, jobs[3], 2)
				} catch { }
			}
		}

		for (let i = 0; i < 7; i++) {
			for (let city of cities) {
				try { ns.corporation.upgradeWarehouse(agricultureName, city, 1); } catch { }
			}
		}
	}

	async function buyMoreStuff() {
		for (let city of cities) {
			ns.corporation.buyMaterial(agricultureName, city, boostMaterials[0], 267.5);
			ns.corporation.buyMaterial(agricultureName, city, boostMaterials[1], 9.6);
			ns.corporation.buyMaterial(agricultureName, city, boostMaterials[2], 244.5);
			ns.corporation.buyMaterial(agricultureName, city, boostMaterials[3], 11940);
		}
		while (ns.corporation.getMaterial(agricultureName, cities[0], boostMaterials[0]).qty < 2800) {
			ns.print("waiting for the state loop to finish")
			await ns.sleep(0);
			ns.clearLog();
		}
		for (let city of cities) {
			ns.corporation.buyMaterial(agricultureName, city, boostMaterials[0], 0);
			ns.corporation.buyMaterial(agricultureName, city, boostMaterials[1], 0);
			ns.corporation.buyMaterial(agricultureName, city, boostMaterials[2], 0);
			ns.corporation.buyMaterial(agricultureName, city, boostMaterials[3], 0);
		}
	}

	async function buyEvenMoreStuff() {
		for (let i = 0; i < 9; i++) {
			for (let city of cities) {
				try { ns.corporation.upgradeWarehouse(agricultureName, city, 1); } catch { }
			}
		}

		for (let city of cities) {
			ns.corporation.buyMaterial(agricultureName, city, boostMaterials[0], 650);
			ns.corporation.buyMaterial(agricultureName, city, boostMaterials[1], 63);
			ns.corporation.buyMaterial(agricultureName, city, boostMaterials[2], 375);
			ns.corporation.buyMaterial(agricultureName, city, boostMaterials[3], 8400);
		}
		while (ns.corporation.getMaterial(agricultureName, cities[0], boostMaterials[0]).qty < 9300) {
			ns.print("waiting for the state loop to finish")
			await ns.sleep(0);
			ns.clearLog();
		}
		for (let city of cities) {
			ns.corporation.buyMaterial(agricultureName, city, boostMaterials[0], 0);
			ns.corporation.buyMaterial(agricultureName, city, boostMaterials[1], 0);
			ns.corporation.buyMaterial(agricultureName, city, boostMaterials[2], 0);
			ns.corporation.buyMaterial(agricultureName, city, boostMaterials[3], 0);
		}
	}

	async function expandToTobacco() {
		try { ns.corporation.expandIndustry("Tobacco", tobaccoName); } catch { ns.tprint("Couldn't expand.. no money"); ns.exit(); }
		ns.corporation.expandCity(tobaccoName, cities[0]);
		ns.corporation.purchaseWarehouse(tobaccoName, cities[0]);
		try {
			for (let i = 0; i < 9; i++) {
				ns.corporation.upgradeOfficeSize(tobaccoName, cities[0], 3);
				while (ns.corporation.hireEmployee(tobaccoName, cities[0])) { }
				ns.corporation.setAutoJobAssignment(tobaccoName, cities[0], jobs[0], Math.floor(ns.corporation.getOffice(tobaccoName, cities[0]).employees.length / 3.5))
				ns.corporation.setAutoJobAssignment(tobaccoName, cities[0], jobs[1], Math.floor(ns.corporation.getOffice(tobaccoName, cities[0]).employees.length / 3.5))
				ns.corporation.setAutoJobAssignment(tobaccoName, cities[0], jobs[2], Math.floor(0.5 * ns.corporation.getOffice(tobaccoName, cities[0]).employees.length / 3.5))
				ns.corporation.setAutoJobAssignment(tobaccoName, cities[0], jobs[3], Math.ceil(ns.corporation.getOffice(tobaccoName, cities[0]).employees.length / 3.5))
			}
		} catch { }

		for (let i = 0; i < 2; i++) {
			for (let city of cities) {
				if (city == cities[0]) continue;
				try {
					ns.corporation.expandCity(tobaccoName, city);
					ns.corporation.purchaseWarehouse(tobaccoName, city);
				} catch { }
				ns.corporation.upgradeOfficeSize(tobaccoName, city, 3);
				while (ns.corporation.hireEmployee(tobaccoName, city)) { }
				ns.corporation.setAutoJobAssignment(tobaccoName, city, jobs[0], 1)
				ns.corporation.setAutoJobAssignment(tobaccoName, city, jobs[1], 1)
				ns.corporation.setAutoJobAssignment(tobaccoName, city, jobs[2], 1)
				ns.corporation.setAutoJobAssignment(tobaccoName, city, jobs[3], 1)
				ns.corporation.setAutoJobAssignment(tobaccoName, city, jobs[4], 5)
			}
		}

		ns.corporation.makeProduct(tobaccoName, cities[0], "Stick 1", 1e9, 1e9);
		try {
			for (let i = 2; i < 6; i++) {
				ns.corporation.levelUpgrade("DreamSense");
			}
		} catch { }
		try {
			for (let i = 2; i < 6; i++) {
				while (ns.corporation.getUpgradeLevel(levelUpgrades[i]) < 20) {
					ns.corporation.levelUpgrade(levelUpgrades[i]);
				}
			}
		} catch { }
		try {
			for (let i = 0; i < 10; i++) {
				ns.corporation.levelUpgrade("Project Insight");
			}
		} catch { }
	}
}