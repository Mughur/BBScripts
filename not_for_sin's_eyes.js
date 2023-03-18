const materialSizes = {
	"Water": 0.05,
	"Energy": 0.01,
	"Food": 0.03,
	"Plants": 0.05,
	"Metal": 0.1,
	"Hardware": 0.06,
	"Chemicals": 0.05,
	"Drugs": 0.02,
	"Robots": 0.5,
	"AI Cores": 0.1,
	"Real Estate": 0.005,
}
const levelUpgrades = ["FocusWires", "Neural Accelerators", "Speech Processor Implants", "Nuoptimal Nootropic Injector Implants"]

const reqDict = {
	"Energy": ["Hardware", "Metal"]
	, "Water Utilities": ["Hardware", "Metal"]
	, "Agriculture": ["Water", "Energy"]
	, "Fishing": ["Energy"]
	, "Mining": ["Energy"]
	, "Food": ["Food", "Water", "Energy"]
	, "Tobacco": ["Plants", "Water"]
	, "Chemical": ["Plants", "Energy", "Water"]
	, "Pharmaceutical": ["Chemicals", "Energy", "Water"]
	, "Computer Hardware": ["Metal", "Energy"]
	, "Robotics": ["Hardware", "Energy"]
	, "Software": ["Hardware", "Energy"]
	, "Healthcare": ["Robots", "AI Cores", "Energy", "Water"]
	, "RealEstate": ["Metal", "Energy", "Water", "Hardware"]
}

const prodMatDict = {
	"Tobacco": { "Real Estate": 0.2, "Hardware": 0.2, "Robots": 0.4, "AI Cores": 0.2 },
	"Agriculture": { "Real Estate": 14 / 28, "Hardware": 4 / 28, "Robots": 5 / 28, "AI Cores": 5 / 28 },
	"Chemical": { "Real Estate": 5 / 18, "Hardware": 4 / 18, "Robots": 5 / 18, "AI Cores": 4 / 18 },
	"Computer Hardware": { "Real Estate": 5 / 16, "Hardware": 1 / 18, "Robots": 7 / 16, "AI Cores": 3 / 16 },
	"Energy": { "Real Estate": 13 / 20, "Hardware": 1 / 20, "Robots": 1 / 20, "AI Cores": 5 / 20 },
	"Fishing": { "Real Estate": 2 / 22, "Hardware": 6 / 22, "Robots": 10 / 22, "AI Cores": 4 / 22 },
	"Food": { "Real Estate": 1 / 13, "Hardware": 2 / 13, "Robots": 5 / 13, "AI Cores": 5 / 13 },
	"Healthcare": { "Real Estate": 2 / 8, "Hardware": 2 / 8, "Robots": 2 / 8, "AI Cores": 2 / 8 },
	"Mining": { "Real Estate": 5 / 31, "Hardware": 8 / 31, "Robots": 9 / 31, "AI Cores": 9 / 31 },
	"Pharmaceutical": { "Real Estate": 1 / 12, "Hardware": 2 / 12, "Robots": 5 / 12, "AI Cores": 4 / 12 },
	"RealEstate": { "Real Estate": 1 / 24, "Hardware": 1 / 24, "Robots": 11 / 24, "AI Cores": 11 / 24 },
	"Robotics": { "Real Estate": 6 / 17, "Hardware": 3 / 17, "Robots": 1 / 17, "AI Cores": 7 / 17 },
	"Software": { "Real Estate": 2 / 11, "Hardware": 5 / 11, "Robots": 1 / 11, "AI Cores": 3 / 11 },
	"Water Utilities": { "Real Estate": 10 / 27, "Hardware": 1 / 27, "Robots": 8 / 27, "AI Cores": 8 / 27 },
}

const prodNames = {
	"Tobacco": "Stick",
	"Food": "Sooubway",
	"Computer Hardware": "Brick",
	"Healthcare": "Hopsital",
	"Pharmaceutical": "Pill",
	"RealEstate": "State",
	"Robotics": "Mortti",
	"Software": "FF",
}

const divNames = {
	"Tobacco": "TB",
	"Agriculture": "AG",
	"Chemical": "chem",
	"Computer Hardware": "comp",
	"Energy": "en",
	"Fishing": "fish",
	"Food": "FD",
	"Healthcare": "HP",
	"Mining": "mine",
	"Pharmaceutical": "pharma",
	"RealEstate": "RE",
	"Robotics": "Robo",
	"Software": "SW",
	"Water Utilities": "UTI",
}

const matProducers = {
	"Water Utilities": ["Water"],
	"Energy": ["Energy"],
	"Agriculture": ["Plants", "Food"],
	"Fishing": ["Food"],
	"Mining": ["Metal"],
	"Chemical": ["Chemicals"],
	"Pharmaceutical": ["Drugs"],
	"Computer Hardware": ["Hardware"],
	"Robotics": ["Robots"],
	"Software": ["AI Cores"],
	"RealEstate": ["Real Estate"],
}
const boostMaterials = ["Hardware", "Robots", "AI Cores", "Real Estate"]
const jobs = ["Operations", "Engineer", "Business", "Management", "Research & Development", "Training"];

let name;
const cities = ["Sector-12", "Chongqing", "New Tokyo", "Ishima", "Volhaven", "Aevum"];
let cheapest = [["", 0]];
let foodcutoff = 1e20;
let starter = "Tobacco";
let finisher = "Food";

/** @param {NS} ns */
export async function main(ns) {
	ns.tail(); ns.clearLog(); ns.disableLog("ALL");
	await ns.sleep(10);
	ns.moveTail(10, 10);
	ns.resizeTail(780, 510)
	let a = true;
	const c = ns.corporation;

	let cycle = {};
	await timeStuff();
	let unOwnedDivisions = [];
	for (let dType in divNames) {
		for (let div of c.getCorporation().divisions) {
			if (dType == div.type) continue;
		}
		unOwnedDivisions.push({ "type": dType, "name": divNames[dType], "price": c.getExpandIndustryCost(dType) })
	}
	unOwnedDivisions = unOwnedDivisions.sort((a, b) => a.price - b.price)

	//try { if (c.getCorporation().funds > c.getUnlockUpgradeCost("Smart Supply") * 10) c.unlockUpgrade("Smart Supply"); } catch { }

	const augPrice = {
		"numberOfBN11": 0
		, "multAug": 1.9
	}
	try { augPrice.numberOfBN11 = ns.getOwnedSourceFiles()[11] } catch { augPrice.numberOfBN11 = 0 }
	augPrice["priceMult"] = [1, 0.96, 0.94, 0.93][augPrice.numberOfBN11]

	if (c.getCorporation().divisions.length == 0) {
		ns.tprint("Couldn't find any divisions");
		ns.exit();
	}
	let allProducts = [];
	let setMaterialSellings = {};
	let budget = c.getCorporation().funds;
	ns.print("reset product prices");
	for (let div of c.getCorporation().divisions) {
		for (let product of c.getDivision(div.name).products) {
			for (let city of cities) {
				c.sellProduct(div.name, city, product, "MAX", "MP*1", false);
			}
		}
	}
	ns.print("reset material prices");
	for (let div of c.getCorporation().divisions) {
		if (!Object.keys(matProducers).includes(div.type)) continue;
		for (let city of c.getDivision(div.name).cities) {
			for (let material of matProducers[div.type]) {
				c.sellMaterial(div.name, city, material, "MAX", "MP");
			}
		}
	}
	ns.print("buy base amount of materials");
	for (let div of c.getCorporation().divisions) {
		for (const city of c.getDivision(div.name).cities) {
			for (let material of reqDict[div.type]) {
				try { c.buyMaterial(div.name, city, material, 10 * c.getDivision(div.name).prodMult) } catch { continue; }
			}
		}
	}
	ns.print("Now for something completely different");

	while (c.getCorporation().state == "EXPORT") {
		if (c.getCorporation().funds > 100e9) {
			await bribeFactions()
		}
		await recruit(ns);
		await upgrade(ns);
		ns.clearLog();
		ns.print("waiting for the right part of loop, 2")
		await ns.sleep(0);
	}
	while (true) {
		await research();
		if ((c.getCorporation().revenue > 1e80 || ns.getPlayer().money > 112e15) && ns.args.length > 0) {
			ns.tprint("corp at 1e80 time: " + ns.tFormat((Date.now() + 1000 * 60 * 60 * 3) % (1000 * 60 * 60 * 24 * 365)))
			ns.clearLog();
			ns.print("Finishing time: " + ns.tFormat(Date.now() - ns.args[0]));
			ns.exit();
		}
		if (c.getInvestmentOffer().round <= 4) await investmentStuff();

		await refreshments();
		while (c.getCorporation().state != "EXPORT") {
			await recruit(ns);
			await upgrade(ns);
			await ns.sleep(0);
		}

		await newProduct();
		while (c.getCorporation().state == "EXPORT") {
			await ns.sleep(0);
		}
		if (c.getCorporation().funds>1e15){
			await bribeFactions()
		}

		ns.clearLog();
		ns.print(cheapest[0][0] + ": " + cheapest[0][1].toExponential(2))
		try { if (c.getInvestmentOffer().funds > 0) ns.print("available investment offer: " + c.getInvestmentOffer().funds.toExponential(2)) } catch { }
		//ns.print("next UPG: "+cheapest[0][0]+" - "+budget.toExponential(2)+"/"+parseFloat(cheapest[0][1]).toExponential(2))

		//if (!c.hasUnlockUpgrade("Smart Supply") && c.getCorporation().funds > c.getUnlockUpgradeCost("Smart Supply") * 10) c.unlockUpgrade("Smart Supply");
		if (!c.hasUnlockUpgrade("Shady Accounting") && c.getCorporation().revenue > c.getUnlockUpgradeCost("Shady Accounting") * 10) c.unlockUpgrade("Shady Accounting");
		if (!c.hasUnlockUpgrade("Government Partnership") && c.getCorporation().revenue > c.getUnlockUpgradeCost("Government Partnership") * 10) c.unlockUpgrade("Government Partnership");
		await priceProducts();
		//if (c.getCorporation().funds < 1e15) await priceMaterials();
		await prodMats();
		try { await log(); } catch { ns.print("hmm") }
		await timeStuff();
	}

	async function investmentStuff() {
		try {
			if (unOwnedDivisions.length > 0) {
				while (true) {
					let help = true;
					for (let d of c.getCorporation().divisions) {
						if (d.type == unOwnedDivisions[0].type) {
							unOwnedDivisions.shift();
							help = false;
						}
					}
					if (help) {
						if (c.getCorporation().funds > unOwnedDivisions[0].price) c.expandIndustry(unOwnedDivisions[0].type, unOwnedDivisions[0].name)
						else break;
					}
				}
			}
		} catch { }
		let offer = c.getInvestmentOffer();
		if (offer.round == 3 && offer.funds >= (1.1 ** c.getCorporation().divisions.length) * 1e15 * ns.getBitNodeMultipliers().CorporationValuation ** 3) {
			allProducts = [];
			ns.tprint("accepted offer for " + c.getInvestmentOffer().funds.toExponential(2) + " at " + ns.tFormat((Date.now() + 1000 * 60 * 60 * 3) % (1000 * 60 * 60 * 24 * 365)))
			c.acceptInvestmentOffer();

		}
		if (offer.round == 4 && offer.funds >= (0.5 ** 2 * 1.1 ** c.getCorporation().divisions.length) * 5e16 * ns.getBitNodeMultipliers().CorporationValuation ** 5) {
			allProducts = [];
			ns.tprint("accepted offer for " + c.getInvestmentOffer().funds.toExponential(2) + " at " + ns.tFormat((Date.now() + 1000 * 60 * 60 * 3) % (1000 * 60 * 60 * 24 * 365)))
			c.acceptInvestmentOffer();
			c.goPublic(0);
			c.issueDividends(0);
		}
	}

	async function ss() {
		for (const div of c.getCorporation().divisions) {
			for (const city of c.getDivision(div.name).cities) {
				if (!c.hasWarehouse(div.name, city)) continue;
				if (c.hasUnlockUpgrade("Smart Supply")) c.setSmartSupply(div.name, city, true)
				else {
					for (let material of reqDict[div.type]) {
						if (boostMaterials.includes(material)) continue;
						let amount = Math.abs(c.getMaterial(div.name, city, material).prod)
							+ (10 * Math.sqrt(c.getDivision(div.name).prodMult) - c.getMaterial(div.name, city, material).qty) / 10
						if (amount < 0) amount = 0;
						c.buyMaterial(div.name, city, material, amount * 1.5)
					}
				}
			}
		}
	}

	async function refreshments() {
		for (const div of c.getCorporation().divisions) {
			for (const city of div.cities) {
				if (c.getOffice(div.name, city).avgEne < 99) c.buyCoffee(div.name, city);
				if (c.getOffice(div.name, city).avgHap < 99 || c.getOffice(div.name, city).avgMor < 99) c.throwParty(div.name, city, 500000)
			}
		}
	}

	async function dealWithHybrids(div, material, size, city, forProduction) {
		if (!Object.keys(matProducers).includes(div.type)) return false;
		if (!div.makesProducts) return false;
		c.limitMaterialProduction(div.name, city, material, -1)
		let amount = (10 + size / materialSizes[material] - c.getMaterial(div.name, city, material).qty + Math.abs(10 * c.getMaterial(div.name, city, material).prod)) / 10
		if (!forProduction) amount = 0;
		amount = Math.max(0, amount);
		c.buyMaterial(div.name, city, material, amount)

		amount = c.getMaterial(div.name, city, material).qty - size / materialSizes[material]
		if (!forProduction) amount += c.getMaterial(div.name, city, material).prod
		amount = Math.max(0, amount);
		if (c.getMaterial(div.name, city, material).qty - size / materialSizes[material] < 0) amount = 0;
		if (!forProduction) {
			if (c.getCorporation().revenue < 1e10) {
				c.sellMaterial(div.name, city, material, amount / 10, "MP");
			}
			else {
				c.limitMaterialProduction(div.name, city, material, amount / 10)
			}
		}
		else c.sellMaterial(div.name, city, material, 0, "MP/100");
		return true;
	}

	async function prodMats() {
		for (const div of c.getCorporation().divisions) {
			if (!div.makesProducts) continue
			if (c.getCorporation().revenue < foodcutoff) {
				if (div.type != starter) continue;
			}
			else {
				if (div.type != finisher) continue;
			}
			if (div.products.length < 2 && !Object.keys(matProducers).includes(div.type)) continue;
			for (const city of c.getDivision(div.name).cities) {
				let matReqSpace = 10;
				for (let material of reqDict[div.type]) {
					matReqSpace += materialSizes[material] * (Math.abs(c.getMaterial(div.name, city, material).prod*10) + c.getMaterial(div.name, city, material).qty);
				}
				let wh = c.getWarehouse(div.name, city);
				for (let material in prodMatDict[div.type]) {

					let assignedSpace = Math.max(0,(wh.size - matReqSpace) * prodMatDict[div.type][material] * 0.95);
					if (reqDict[div.type].includes(material)) {
						await dealWithHybrids(div, material, assignedSpace, city, true);
						continue;
					}
					if (Object.keys(matProducers).includes(div.type)) {
						if (matProducers[div.type].includes(material)) {
							await dealWithHybrids(div, material, assignedSpace, city, false);
							continue;
						}
					}
					let amount = (assignedSpace / materialSizes[material] - c.getMaterial(div.name, city, material).qty) / 10;
					//amount = Math.min(Math.sqrt(c.getWarehouse(div.name, city).size) * 10, amount)
					amount /= 2;
					if (reqDict[div.type].includes(material)) {
						amount += Math.abs(c.getMaterial(div.name, city, material).prod)
					}
					if (amount < 0) amount = 0;
					if (c.getMaterial(div.name, city, material).qty * materialSizes[material] > assignedSpace) amount = 0;
					if (div.products.length >= 2){
						 c.buyMaterial(div.name, city, material, amount)
					}
					else{
						 c.buyMaterial(div.name, city, material, 0)
					}
					if (c.getMaterial(div.name, city, material).qty > assignedSpace / materialSizes[material]*1.01) {
						c.sellMaterial(div.name, city, material, c.getMaterial(div.name, city, material).qty/100, "MP/100")
					}
					else {
						c.sellMaterial(div.name, city, material, "0", "0")
					}
				}
			}
		}
	}

	async function priceProducts() {
		await ss();
		for (let div in allProducts) {
			for (let i = 0; i < allProducts[div].products.length; i++) {
				if (!c.getDivision(div).products.includes(allProducts[div].products[i].name)) {
					allProducts[div].products.splice(i, 1);
					i--
				}
			}
		}
		for (let div of c.getCorporation().divisions) {
			if (!div.makesProducts) continue
			if (!Object.keys(allProducts).includes(div.name)) {
				allProducts[div.name] = {
					"type": div.type,
					"products": [],
				};
			}
			//add missing products to list
			for (let product of c.getDivision(div.name).products) {
				if (c.getProduct(div.name, product).developmentProgress < 100) continue;
				if (!allProducts[div.name].products.some((a) => a.name == product)) {
					if (c.hasResearched(div.name, "Market-TA.II")) c.setProductMarketTA2(div.name, product, false);
					let min = 1;
					let max = 2;
					if (allProducts[div.name].products.length >= 1) {
						min = allProducts[div.name].products[allProducts[div.name].products.length - 1].min / 2;
						max = allProducts[div.name].products[allProducts[div.name].products.length - 1].min;
					}
					if (product.split(" ")[1] == 1) {
						allProducts[div.name].products.push({
							"name": product
							, "ta2": false,
							"min": 1,
							"max": 2,
							"done": false,
							"stage": 1
							, "starter": true
							, "up": 0
						})
					}
					else {
						allProducts[div.name].products.push({
							"name": product
							, "ta2": false,
							"min": min,
							"max": max,
							"done": false,
							"stage": 1
							, "starter": false
							, "up": 0
						})
					}
				}
			}
			for (let i = 0; i < allProducts[div.name].products.length; i++) {
				let product = allProducts[div.name].products[i];
				//find good price for product
				if (c.getDivision(div.name).research > 140000) {
					if (!c.hasResearched(div.name, "Market-TA.I")) c.research(div.name, "Market-TA.I");
					if (!c.hasResearched(div.name, "Market-TA.II")) c.research(div.name, "Market-TA.II");
				}
				if (c.hasResearched(div.name, "Market-TA.II")) {
					if (product.ta2 == true) continue;
					product.ta2 = true;
					for (let city of cities) {
						try {
							c.sellProduct(div.name, city, product.name, "MAX", "MP", false)
							c.setProductMarketTA2(div.name, product.name, true)
						} catch { };
					}
				}
				else {
					if (c.getProduct(div.name, product.name).developmentProgress < 100) {/*ns.print("next product progress: "+c.getProduct(div.name,product.name).developmentProgress.toFixed(1)+"%");*/continue; }
					//ns.print(product.name.split(" ")[1].padStart(3)+": "+product["Sector-12"].min.toPrecision(3)+"/"+product["Sector-12"].max.toPrecision(3))
					let data = c.getProduct(div.name, product.name).cityData;
					let city = "Sector-12"
					if (data[city][1] == 0) { c.sellProduct(div.name, city, product.name, "MAX", "MP*1", true); continue; }
					if (product.done == true) {
						if (data[city][0] == 0) {
							product.up++;
							product.min *= 1.01 * Math.sqrt(product.up);
							c.sellProduct(div.name, city, product.name, "MAX", "MP*" + String(product.min), true);
						}
						else {
							product.up = 0;
							product.min = Math.max(1, product.min / 1.05);
							c.sellProduct(div.name, city, product.name, "MAX", "MP*" + String(product.min), true);
						}
						continue;
					}
					if (data[city][2] >= data[city][1] && product.stage == 1) {
						if (data[city][2] > 0) {
							product.min = product.max;
							product.max = product.max * Math.floor(Math.log10(Math.max(10, c.getCorporation().funds)) / 2);
							c.sellProduct(div.name, city, product.name, "MAX", "MP*" + String(product.max), false);
						}
					}
					else {
						if (product.stage == 1) {
							let newPrice = (product.min + product.max) / 2
							c.sellProduct(div.name, city, product.name, "MAX", "MP*" + String(newPrice), false);
							product.stage = 0;
						}
						else {
							if (product.max - product.min <= .01) {
								product.done = true;
								ns.tprint(product.name + " is done")
								product.max = Math.floor(product.min * 1000) / 1000;
								product.min = product.max
								c.sellProduct(div.name, city, product.name, "MAX", "MP*" + String(product.min), false);
							}
							else if (data[city][2] >= data[city][1]) {
								product.min = (product.min + product.max) / 2
								let newPrice = (product.min + product.max) / 2
								c.sellProduct(div.name, city, product.name, "MAX", "MP*" + String(newPrice), false);
							}
							else {
								product.max = (product.min + product.max) / 2
								let newPrice = (product.min + product.max) / 2
								c.sellProduct(div.name, city, product.name, "MAX", "MP*" + String(newPrice), false);
							}
						}
					}
				}
			}
		}
	}

	async function priceMaterials() {
		for (let div of c.getCorporation().divisions) {
			if (!Object.keys(matProducers).includes(div.type)) continue;
			if (!Object.keys(setMaterialSellings).includes(div.type)) {
				setMaterialSellings[div.type] = {};
				for (let city of cities) {
					setMaterialSellings[div.type][city] = {};
					for (let material of matProducers[div.type]) {
						setMaterialSellings[div.type][city][material] = { "mult": 0, "ta": false }
						try { c.sellMaterial(div.name, city, material, "MAX", "MP") } catch { }
					}
				}
			}
			else {
				for (let city of c.getDivision(div.name).cities) {
					for (let material of matProducers[div.type]) {
						if (setMaterialSellings[div.type][city][material].ta) continue;
						if (c.hasResearched(div.name, "Market-TA.I")) {
							c.setMaterialMarketTA1(div.name, city, material, true);
							setMaterialSellings[div.type][city][material].ta = true;
							continue;
						}
						let matInfo = c.getMaterial(div.name, city, material)
						if (matInfo.prod == 0) continue;
						if (matInfo.prod <= matInfo.sell && matInfo.qty == 0) setMaterialSellings[div.type][city][material].mult += 10;
						if (matInfo.prod > matInfo.sell) setMaterialSellings[div.type][city][material].mult -= 10;
						c.sellMaterial(div.name, city, material, "MAX", "MP+" + setMaterialSellings[div.type][city][material].mult)
					}
				}
			}
		}
	}

	async function timeStuff() {
		for (let div of c.getCorporation().divisions) {
			if (!div.makesProducts) continue
			if (div.type != starter && div.type != finisher) continue;
			if (!Object.keys(cycle).includes(div.type)) cycle[div.type] = {
				"n": -1,
				"progress": -1,
			}
			if (div.products.length == 0) { cycle[div.type].n = 10; continue; }
			if (c.getProduct(div.name, div.products[div.products.length - 1]).progress < 100) {
				cycle[div.type].progress = c.getProduct(div.name, div.products[div.products.length - 1]).progress
				cycle[div.type].n = -1;
			}
			else {
				if (cycle[div.type].progress >= 100) {
					if (c.hasResearched(div.name, "Market-TA.II")) cycle[div.type].n += 2;
					cycle[div.type].n += 1;
					continue;
				}
				cycle[div.type].progress = 100;
				cycle[div.type].n = 0;
			}
		}
	}

	async function newProduct() {
		budget = c.getCorporation().funds / (Math.max(c.getCorporation().divisions.length - 1, 1));
		for (let div of c.getCorporation().divisions) {
			if (!div.makesProducts) continue
			if (c.getCorporation().revenue < foodcutoff) {
				if (div.type != starter) continue;
			}
			else {
				if (div.type != finisher) continue;
			}
			let products = c.getDivision(div.name).products
			if (products.length > 1) {
				let lowest = [products[0], c.getProduct(div.name, products[0]).rat];
				let highest = [products[0], c.getProduct(div.name, products[0]).rat]
				for (let product of products) {
					if (c.getProduct(div.name, product).developmentProgress < 100) continue;
					if (c.getProduct(div.name, product).rat < lowest[1]) lowest = [product, c.getProduct(div.name, product).rat]
					if (c.getProduct(div.name, product).rat > lowest[1]) lowest = [highest, c.getProduct(div.name, product).rat]
				}
				if (highest[1] / lowest[1] > 100) {
					c.discontinueProduct(div.name, lowest[0]);
				}
			}
			let capacity = 3;
			if (c.hasResearched(div.name, "uPgrade: Capacity.I") == true) capacity = 4;
			if (c.hasResearched(div.name, "uPgrade: Capacity.II") == true) capacity = 5;
			if (finisher == starter) {
				if (c.getCorporation().revenue > 1e40) capacity = 2;
			}
			else if (div.type == finisher) capacity = 2;
			if (cycle[div.type].n < 4) continue;
			if (products.length == 0) {
				if (budget < 2e9) continue;
				budget = 2e9;
				let name = prodNames[div.type] + " 1 " + (budget).toExponential(2)
				if (c.getCorporation().funds > 0) c.makeProduct(div.name, "Sector-12", name, budget / 2, budget / 2)
			}
			else if (products.length < capacity) {
				if (c.getProduct(div.name, products[products.length - 1]).developmentProgress >= 100) {
					let name = prodNames[div.type] + " " + ((parseInt(c.getProduct(div.name, products[products.length - 1]).name.split(" ")[1]) + 1) + " " + (budget).toExponential(2))
					ns.print("making product " + name)
					if (c.getCorporation().funds > 0) c.makeProduct(div.name, "Sector-12", name, budget / 2, budget / 2)
				}
			}
			else if (products.length == capacity) {
				let pricePoint = 0;
				for (let product of div.products) {
					let price = parseFloat(product.split(" ")[2])
					pricePoint = Math.max(pricePoint, price);
				}
				if (budget < pricePoint * 1.2) continue;
				if (c.getProduct(div.name, products[products.length - 1]).developmentProgress >= 100) {
					let lowest = [products[0], c.getProduct(div.name, products[0]).rat];
					for (let product of products) {
						if (c.getProduct(div.name, product).rat < lowest[1]) lowest = [product, c.getProduct(div.name, product).rat]
					}
					let name = prodNames[div.type] + " " + ((parseInt(c.getProduct(div.name, products[products.length - 1]).name.split(" ")[1]) + 1) + " " + (budget).toExponential(2))
					c.discontinueProduct(div.name, lowest[0])
					for (let i = 0; i < allProducts[div.name]; i++) {
						if (allProducts[div.name].products[i].name == lowest[0]) { allProducts[div.name].splice(i, 1); break; }
					}
					c.makeProduct(div.name, "Sector-12", name, budget / 2, budget / 2)
				}
			}
			else {
				ns.tprint("too many products")
				c.discontinueProduct(div.name, div.products[0])
			}
		}
	}

	async function research() {
		for (let div of c.getCorporation().divisions) {
			if (!c.hasResearched(div.name, "Hi-Tech R&D Laboratory")) try { c.research(div.name, c.getResearchNames()[0]) } catch { };
			if (c.hasResearched(div.name, "Market-TA.II")) {
				for (let r of c.getResearchNames()) {
					if (r == "Hi-Tech R&D Laboratory") continue;
					if (r == "HRBuddy-Recruitment") continue;
					if (r == "HRBuddy-Training") continue;
					if (r.includes("Capacity") || r.includes("Dashboard")) continue;
					try { if (div.research > 4 * c.getResearchCost(div.name, r) && !c.hasResearched(div.name, r)) c.research(div.name, r) } catch { }
				}
			}
		}
	}

	async function bribeFactions() {
		let factions = []
		if (ns.getPlayer().factions.length == 0) return;
		for (let faction of ns.getPlayer().factions) {
			let repCap = 0;
			for (let aug of ns.singularity.getAugmentationsFromFaction(faction)) {
				if (aug == "NeuroFlux Governor") continue;
				if (ns.singularity.getOwnedAugmentations(true).includes(aug)) continue;
				repCap = Math.max(repCap, ns.singularity.getAugmentationRepReq(aug));
			}
			factions.push([faction, repCap]);
		}
		factions = factions.sort((a, b) => a[1] - b[1]);
		for (let faction of factions) {
			if (faction[1] < ns.singularity.getFactionRep(faction[0])) continue;
			if (c.getCorporation().funds > (faction[1] - ns.singularity.getFactionRep(faction[0])) * Math.pow(10, 9)) {
				c.bribe(faction[0], (faction[1] - ns.singularity.getFactionRep(faction[0])) * Math.pow(10, 9));
			}
		}
	}

	async function getNFGs() {
		let faction = ns.getPlayer().factions[0];
		let repReg = [ns.singularity.getAugmentationRepReq("NeuroFlux Governor"), ns.singularity.getFactionRep(faction)];
		while (true) {
			if (repReg[1] < repReg[0]) try { c.bribe(faction, (repReg[0] - repReg[1]) * 1e9) } catch {}
			try { ns.singularity.purchaseAugmentation(faction, "NeuroFlux Governor") } catch {}
			await ns.sleep(0);
		}
		ns.singularity.installAugmentations("start.js");
	}

	async function log() {
		if (ns.args.length > 0) ns.print("Time since corp creation: " + ns.tFormat(Date.now() - ns.args[0]));
		let longest = c.getCorporation().name.length;
		for (let div of c.getCorporation().divisions) {
			if (div.name.length > longest) longest = div.name.length;
		}
		ns.print(" Name: " + c.getCorporation().name + "  ||  Funds: " + c.getCorporation().funds.toExponential(2) + "  ||  Revenue: " + (c.getCorporation().revenue - c.getCorporation().expenses).toExponential(2))
		ns.print("".padStart(longest + 53, "~"))
		ns.print(" Division ".padStart(longest + 1, "~") + "~  profit ~~~~ old ~~~~~~~~~ new ~~~~~~~ upcoming ~~")
		let mostProfitable = c.getCorporation().divisions[0];
		for (let div of c.getCorporation().divisions) {
			if (mostProfitable.lastCycleRevenue - mostProfitable.lastCycleExpenses < div.lastCycleRevenue - div.lastCycleExpenses) mostProfitable = div;
		}
		for (let div of c.getCorporation().divisions) {
			if (!div.makesProducts) continue;
			let text = div.name.padStart(longest, " ") + " : " + (div.lastCycleRevenue - div.lastCycleExpenses).toExponential(2).padEnd(9);
			if (div.lastCycleRevenue - div.lastCycleExpenses < 0) text = frontColorPicker(text, "red")
			if (mostProfitable.name == div.name) text = frontColorPicker(text, 82)
			text += "|"
			if (c.getDivision(div.name).products.length < 3) text += "|".padStart(13)
			if (c.getDivision(div.name).products.length < 2) text += "|".padStart(13)
			if (c.getDivision(div.name).products.length < 1) text += "|".padStart(13)
			for (let product of c.getDivision(div.name).products) {
				if (c.getProduct(div.name, product).developmentProgress >= 100) {
					let multi = parseFloat(c.getProduct(div.name, product).sCost.split("*")[1]).toExponential(2)
					text += " " + frontColorPicker(product.split(" ")[1].padStart(2), "cyan") + " @ " + frontColorPicker(multi.padEnd(6), 208) + "|"
				} else {
					text += " " + frontColorPicker(product.split(" ")[1].padStart(2), "cyan") + " % " + c.getProduct(div.name, product).developmentProgress.toFixed(2).padStart(5) + "|"
				}
			}
			ns.print(text)
		}
		ns.print(" Division ".padStart(longest + 1, "~") + "~  profit ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
		for (let div of c.getCorporation().divisions) {
			if (div.makesProducts) continue;
			let text = div.name.padStart(longest, " ") + " : " + (div.lastCycleRevenue - div.lastCycleExpenses).toExponential(2).padEnd(9);
			if (div.lastCycleRevenue - div.lastCycleExpenses < 0) text = frontColorPicker(text, "red")
			if (mostProfitable.name == div.name) text = frontColorPicker(text, 82)
			ns.print(text)
		}
	}

	function frontColorPicker(x, color) { // x = what you want colored
		let y;
		switch (color) {
			case "black":
				y = `\u001b[30m${x}\u001b[0m`
				break;
			case "red":
				y = `\u001b[31m${x}\u001b[0m`
				break;
			case "green":
				y = `\u001b[32m${x}\u001b[0m`
				break;
			case "yellow":
				y = `\u001b[33m${x}\u001b[0m`
				break;
			case "blue":
				y = `\u001b[34m${x}\u001b[0m`
				break;
			case "magenta":
				y = `\u001b[35m${x}\u001b[0m`
				break;
			case "cyan":
				y = `\u001b[36m${x}\u001b[0m`
				break;
			case "white":
				y = `\u001b[37m${x}\u001b[0m`
				break;
			default:
				y = `\u001b[38;5;${color}m${x}\u001b[0m`

		}
		return y;
	}
}

/** @param {NS} ns */
export async function upgrade(ns) {
	const c = ns.corporation;
	for (let div of c.getCorporation().divisions) {
		for (let city of div.cities) {
			if (c.getWarehouse(div.name, city).sizeUsed / c.getWarehouse(div.name, city).size > 0.9) {
				try { c.upgradeWarehouse(div.name, city) } catch { }
			}
		}
	}
	if (c.getCorporation().funds < 1e30) {
		cheapest = [];
		let help = false
		for (let div of c.getCorporation().divisions) {
			if (!div.makesProducts) continue
			if (!(div.type == starter || div.type == finisher)) continue
			if (div.cities.length < 6) {
				cheapest.push(["new city", 9e9, div.name])
				help = true;
			}
		}
		if (help == false) {
			if (c.getUpgradeLevel("DreamSense") < 20) cheapest.push(["dream", c.getUpgradeLevelCost("DreamSense")]);
			else {
				for (let div of c.getCorporation().divisions) {
					if (c.getCorporation().revenue < foodcutoff) {
						if (div.type != starter) continue;
					}
					else {
						if (div.type != finisher) continue;
					}
					if (!div.makesProducts) continue
					if (div.popularity > 1e+308 || div.awareness > 1e+301) continue
					cheapest.push(["adCost", c.getHireAdVertCost(div.name), div.name]);
				}
				cheapest.push(["wilson", c.getUpgradeLevelCost("Wilson Analytics") / 3]);
			}
			for (let div of c.getCorporation().divisions) {
				if (c.getCorporation().revenue < foodcutoff) {
					if (div.type != starter) continue;
				}
				else {
					if (div.type != finisher) continue;
				}
				if (!div.makesProducts) continue
				if (c.getOffice(div.name, "Sector-12").size < 3000) cheapest.push(["workers", c.getOfficeSizeUpgradeCost(div.name, "Sector-12", 3), div.name]);
				let s = [c.getOffice(div.name, "Aevum").size, "Aevum"];
				let s2 = [c.getWarehouse(div.name, "Sector-12").size, "Sector-12"]
				for (let city of div.cities) {
					if (s[0] > c.getOffice(div.name, city).size) s = [c.getOffice(div.name, city).size, city]
					if (s2[0] > c.getWarehouse(div.name, "Sector-12").size) s2 = [c.getOffice(div.name, city).size, city]
				}
				if (s[0] < 2900) cheapest.push(["others", c.getOfficeSizeUpgradeCost(div.name, s[1], 3) * 5, div.name]);
				if (s[0] < 9) cheapest.push(["others", c.getOfficeSizeUpgradeCost(div.name, s[1], 3), div.name]);
				if (div.products.length < 3) continue;
				cheapest.push(["storages", c.getUpgradeWarehouseCost(div.name, s2[1], 1) * 12, div.name]);
			}
			cheapest.push(["upgrades", c.getUpgradeLevelCost(levelUpgrades[0])
				+ c.getUpgradeLevelCost(levelUpgrades[1])
				+ c.getUpgradeLevelCost(levelUpgrades[2])
				+ c.getUpgradeLevelCost(levelUpgrades[3])]);
			cheapest.push(["smart", c.getUpgradeLevelCost("Smart Storage") * 2
				+ c.getUpgradeLevelCost("Smart Factories") * 2])
			cheapest.push(["research", c.getUpgradeLevelCost("Project Insight")
				+ c.getUpgradeLevelCost("ABC SalesBots")])

			cheapest = cheapest.sort((a, b) => a[1] - b[1]);
		}

		if (c.getCorporation().funds > cheapest[0][1]) {
			if ("new city" == cheapest[0][0]) {
				for (let city of cities) {
					try {
						c.expandCity(cheapest[0][2], city);
						c.purchaseWarehouse(cheapest[0][2], city);
					} catch { };
				}
			}
			else if ("dream" == cheapest[0][0]) {
				try { c.levelUpgrade("DreamSense"); } catch { }
			}
			else if ("adCost" == cheapest[0][0]) {
				try { c.hireAdVert(cheapest[0][2]); } catch { }
			}
			else if ("wilson" == cheapest[0][0]) {
				cheapest[0][1] *= 3
				try { c.levelUpgrade("Wilson Analytics"); } catch { }
			}
			else if ("workers" == cheapest[0][0]) {
				try { c.upgradeOfficeSize(cheapest[0][2], "Sector-12", 3); } catch { }
			}
			else if ("others" == cheapest[0][0]) {
				let min = Math.min(c.getOffice(cheapest[0][2], "Aevum").size,
					c.getOffice(cheapest[0][2], "Ishima").size,
					c.getOffice(cheapest[0][2], "Volhaven").size,
					c.getOffice(cheapest[0][2], "New Tokyo").size,
					c.getOffice(cheapest[0][2], "Chongqing").size);

				if (c.getOffice(cheapest[0][2], "Aevum").size == min) try { c.upgradeOfficeSize(cheapest[0][2], "Aevum", 3) } catch { }
				if (c.getOffice(cheapest[0][2], "Ishima").size == min) try { c.upgradeOfficeSize(cheapest[0][2], "Ishima", 3) } catch { }
				if (c.getOffice(cheapest[0][2], "Volhaven").size == min) try { c.upgradeOfficeSize(cheapest[0][2], "Volhaven", 3) } catch { }
				if (c.getOffice(cheapest[0][2], "New Tokyo").size == min) try { c.upgradeOfficeSize(cheapest[0][2], "New Tokyo", 3) } catch { }
				if (c.getOffice(cheapest[0][2], "Chongqing").size == min) try { c.upgradeOfficeSize(cheapest[0][2], "Chongqing", 3) } catch { }
			}
			else if ("upgrades" == cheapest[0][0]) {
				let min = Math.min(c.getUpgradeLevel(levelUpgrades[0]),
					c.getUpgradeLevel(levelUpgrades[1]),
					c.getUpgradeLevel(levelUpgrades[2]),
					c.getUpgradeLevel(levelUpgrades[3]))
				for (let up of levelUpgrades) {
					if (c.getUpgradeLevel(up) == min) c.levelUpgrade(up);
				}
			}
			else if ("research" == cheapest[0][0]) {
				c.levelUpgrade("ABC SalesBots")
				c.levelUpgrade("Project Insight")
			}
			else if ("smart" == cheapest[0][0]) {
				c.levelUpgrade("Smart Factories")
				c.levelUpgrade("Smart Storage")
			}
			else if ("storages" == cheapest[0][0]) {
				let smallest = 1e10;
				for (let city of c.getDivision(cheapest[0][2]).cities) {
					smallest = Math.min(smallest, c.getWarehouse(cheapest[0][2], city).size)
				}
				for (let city of c.getDivision(cheapest[0][2]).cities) {
					if (c.getWarehouse(cheapest[0][2], city).size == smallest) try { c.upgradeWarehouse(cheapest[0][2], city, 1); } catch { }
				}
			}
		}
	}
	else {
		for (let div of c.getCorporation().divisions) {
			if (c.getCorporation().revenue < foodcutoff) {
				if (div.type != starter) continue;
			}
			else {
				if (div.type != finisher) continue;
			}
			if (!div.makesProducts) continue;
			if (div.popularity < 1.797e+308 && div.awareness < 1e+303) try { c.hireAdVert(div.name) } catch { }
			for (let city of cities) {
				try {
					c.expandCity(div.name, city);
					c.purchaseWarehouse(div.name, city);
				} catch { };
				try { c.upgradeOfficeSize(div.name, city, 3) } catch { }
				try { c.upgradeWarehouse(div.name, city, 1); } catch { }
			}
		}
		try { c.levelUpgrade("Wilson Analytics") } catch { }
		try { c.levelUpgrade("Nuoptimal Nootropic Injector Implants") } catch { }
		try { c.levelUpgrade("Speech Processor Implants") } catch { }
		try { c.levelUpgrade("Neural Accelerators") } catch { }
		try { c.levelUpgrade("FocusWires") } catch { }
		try { c.levelUpgrade("ABC SalesBots") } catch { }
		try { c.levelUpgrade("Project Insight") } catch { }
		try { c.levelUpgrade("Smart Factories") } catch { }
		try { c.levelUpgrade("Smart Storage") } catch { }
	}
}

/** @param {NS} ns */
export async function recruit(ns) {
	const c = ns.corporation;
	for (let div of c.getCorporation().divisions) {
		if (!div.makesProducts) continue
		if (!(div.type == starter || div.type == finisher)) continue
		for (let city of div.cities) {
			await hirePeople(ns, div.name, city)
			if (c.getOffice(div.name, city).employeeJobs.Training > 0) {
				c.setAutoJobAssignment(div.name, city, "Training", 0)
			}
			let size = c.getOffice(div.name, city).employees;

			if (city == cities[0]) {
				if (div.products.length == 0) {
					c.setAutoJobAssignment(div.name, city, jobs[0], 0);
					c.setAutoJobAssignment(div.name, city, jobs[1], 0);
					c.setAutoJobAssignment(div.name, city, jobs[2], 0);
					c.setAutoJobAssignment(div.name, city, jobs[3], 0);
					c.setAutoJobAssignment(div.name, city, jobs[4], size);
				}
				else {
					if (c.getProduct(div.name, div.products[0]).developmentProgress >= 100) {
						let ratio = [1, 1.2, 1 / 4, 1, 0]
						let multi = ratio[0] + ratio[1] + ratio[2] + ratio[3] + ratio[4];
						for (let i = ratio.length - 1; i >= 0; i--) {
							c.setAutoJobAssignment(div.name, city, jobs[i], Math.ceil(size * ratio[i] / multi))
						}
					}
					else {
						let distribution = [0, 0, 0, 0, Math.ceil(size * 56 / 100), Math.ceil(size * 44 / 100)]
						if (div.makesProducts && Object.keys(matProducers).includes(div.type)) distribution = [1, 1, 0, 0, Math.ceil((size - 2) * 56 / 100), Math.ceil((size - 2) * 44 / 100)]
						c.setAutoJobAssignment(div.name, city, jobs[0], distribution[0]);
						c.setAutoJobAssignment(div.name, city, jobs[2], distribution[1]);
						c.setAutoJobAssignment(div.name, city, jobs[4], distribution[2]);
						c.setAutoJobAssignment(div.name, city, jobs[5], distribution[3]);
						c.setAutoJobAssignment(div.name, city, jobs[1], distribution[4]);
						c.setAutoJobAssignment(div.name, city, jobs[3], distribution[5]);
					}
				}
			}
			else {
				if (div.products.length == 0 && !Object.keys(matProducers).includes(div.type)) {
					c.setAutoJobAssignment(div.name, city, jobs[0], 0);
					c.setAutoJobAssignment(div.name, city, jobs[1], 0);
					c.setAutoJobAssignment(div.name, city, jobs[2], 0);
					c.setAutoJobAssignment(div.name, city, jobs[3], 0);
					c.setAutoJobAssignment(div.name, city, jobs[4], size);
				}
				else if (c.getProduct(div.name, div.products[0]).developmentProgress >= 100 || Object.keys(matProducers).includes(div.type)) {
					c.setAutoJobAssignment(div.name, city, jobs[0], 1);
					c.setAutoJobAssignment(div.name, city, jobs[1], 1);
					c.setAutoJobAssignment(div.name, city, jobs[2], 1);
					c.setAutoJobAssignment(div.name, city, jobs[3], 1);
					c.setAutoJobAssignment(div.name, city, jobs[4], size - 4);
				}
				else {
					c.setAutoJobAssignment(div.name, city, jobs[0], 0);
					c.setAutoJobAssignment(div.name, city, jobs[1], 0);
					c.setAutoJobAssignment(div.name, city, jobs[2], 0);
					c.setAutoJobAssignment(div.name, city, jobs[3], 0);
					c.setAutoJobAssignment(div.name, city, jobs[4], size);
				}
			}
		}
	}
}

export async function hirePeople(ns, division, city) {
	while (ns.corporation.hireEmployee(division, city)) { }
}