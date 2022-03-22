var game = new Object();
game.running = true;
game.loop = function() {
	if (game.running === true) {
		world.drawNPC()
		tiles.set();
		for (i=0; i<world.current.npcArray.length; i+=1) {
			if (world.current.npcArray[i].type === "enemy") {
				world.current.npcArray[i].script();
			} else if (world.current.npcArray[i].type === "npc") {
				if (player.position[0] === world.current.npcArray[i].position[0]+7 && player.position[1] === world.current.npcArray[i].position[1]+4) {
					world.current.npcArray[i].script();
				}
			}
		}
		for (i=0; i<world.script.length; i+=1) {world.script[i].script();}
		setTimeout(game.loop, 50)
	}
}
game.init = function() {
	menu.createOptions();
	menu.createGameList();
	menu.createStoreLists();
	buttons.handler("keydown",true)
	buttons.handler("keyup",false)
//	world.createRandom(world.random,30,30)
//	world.createRandomHouse(8,5);
	tiles.create();
	buttons.loop();
}
var buttonVarArray = [];	fillArray(buttonVarArray, 10, 0);
var itemVarArray = [];		fillArray(itemVarArray, 24, 0);
var buyVarArray = [];		fillArray(buyVarArray, 60, 0);
var loadSaveArray = [];

var menu = new Object();
menu.createOptions = function() {
	for (i=0; i<10; i+=1) {document.getElementById("options").innerHTML += '<button id="button'+i+'" class="options" onclick="buttonVarArray['+i+']('+i+');"></button>'}
}
menu.createGameList = function() {
	for (i=0; i<24; i+=1) {document.getElementById("gameList").innerHTML += '<li id="item'+i+'" class="listitems" onclick="itemVarArray['+i+']('+i+');">ITEM</li>'}
}
menu.createStoreLists = function() {
	for (i=0; i<60; i+=1) {document.getElementById("storeBuy").innerHTML += '<li id="buy'+i+'" onclick="buyVarArray['+i+']('+i+');" class="listitems">ITEM'+i+'</li>'}
}
menu.createChar = function() {
	document.getElementById("start").style = ""
	document.getElementById("selectClass").style = "display: none";
	player = playerChar();
	player.name = window.prompt("What is your character's name?");
	document.getElementById("selectRace").style = "";
	document.getElementById("loadSaveStart").style = "display: none;"
}
menu.human = function() {
	player.race = "Human";
	player.dexterity += 5;
	menu.classSel();
}
menu.elf = function() {
	player.race = "Elf";
	player.iq += 5;
	player.mannaMax += 5;
	player.strength -= 5;
	menu.classSel();
}
menu.orc = function() {
	player.race = "Orc";
	player.defense += 5;
	player.strength += 5;
	player.iq -= 5;
	menu.classSel();
}
menu.dwarf = function() {
	player.race = "Dwarf";
	player.defense += 5;
	player.hitPoints += 5;
	player.dexterity -= 5;
	menu.classSel();
}
menu.classSel = function() {
	document.getElementById("selectRace").style = "display: none;";
	document.getElementById("selectClass").style = "";
	player.health = player.hitPoints; 
	player.manna = player.mannaMax; 
	player.armorClass = player.defense;
}
menu.warrior = function() {
	player.class = "Warrior";
	player.strength += 10;
	player.defense += 5;
	menu.startGame();
}
menu.mage = function() {
	player.class = "Mage";
	player.iq += 5;
	player.mannaMax += 10;
	menu.startGame();
}
menu.rogue = function() {
	player.class = "Rogue";
	player.dexterity += 10;
	player.hitPoints += 5;
	menu.startGame();
}
menu.paladin = function() {
	player.class = "Paladin";
	player.strength += 5;
	player.mannaMax += 5;
	player.iq += 5;
	menu.startGame();
}
menu.startGame = function() {
	world.array[player.currentWorld].load();
	game.loop();
	player.health = player.hitPoints;
	player.manna = player.mannaMax;
	player.armorClass = player.defense;
	display.char();
	document.getElementById("start").style = "display: none;"
	display.loadStats(); 
}
menu.loadChar = function() {
	player = playerChar()
	document.getElementById('inputDiv').style = "display: block"
	var loadFileRaw = [];
	document.getElementById('inputFile').addEventListener('change', function() {
		var fr = new FileReader();
		fr.onload=function() {loadFileRaw = fr.result;}
		fr.readAsText(this.files[0]);
	})
	document.getElementById('loadFile').addEventListener('click', function() {
		document.getElementById('inputDiv').style = "display: none"
		var loadFile = loadFileRaw.split("- ");
		for (i=0; i<loadFile.length; i+=1) {loadSaveArray[i] = loadFile[i];}
		menu.loadData();
		var tmp = player.position;
		world.array[player.currentWorld].load();
		player.position = tmp;
		game.loop();
		player.armorClass = player.defense;
		display.char();
		document.getElementById("start").style = "display: none;"
		display.loadStats();
	})
}
menu.saveChar = function() {
	menu.saveData();
	loadSaveArray = loadSaveArray.join("- ");
	document.getElementById("saveDiv").style = "display: button;"
	document.getElementById("download").addEventListener("click", downloadFile, true);
	alert("good")
	function downloadFile() {
		var elementText = document.createElement('a');
		elementText.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(loadSaveArray));		//input variable is fileData
		elementText.setAttribute('download', document.getElementById("exportFileName").value+".sav");						//export file name from text box
		elementText.click();
		elementText.remove();
		document.getElementById("saveDiv").style = "display: none;"
	}
}
menu.loadData = function() {
	player.name = 						loadSaveArray[0];
	player.race = 						loadSaveArray[1];
	player.class = 						loadSaveArray[2];
	player.level = 						parseInt(loadSaveArray[3]);
	player.progress = 					parseInt(loadSaveArray[4]);
	player.experience = 				parseInt(loadSaveArray[5]);
	player.strength = 					parseInt(loadSaveArray[6]);
	player.dexterity = 					parseInt(loadSaveArray[7]);
	player.iq = 						parseInt(loadSaveArray[8]);
	player.defense =	 				parseInt(loadSaveArray[9]);
	player.health = 					parseInt(loadSaveArray[10]);
	player.hitPoints = 					parseInt(loadSaveArray[11]);
	player.manna = 						parseInt(loadSaveArray[12]);
	player.mannaMax =	 				parseInt(loadSaveArray[13]);
	player.gold = 						parseInt(loadSaveArray[14]);
	player.weaponEquipped = 			parseInt(loadSaveArray[15]);
	player.weakness.length =	 		parseInt(loadSaveArray[16]);
	player.status.length = 				parseInt(loadSaveArray[17]);
	player.quests.length = 				parseInt(loadSaveArray[18]);
	player.items.length = 				parseInt(loadSaveArray[19]);
	player.weapons.length = 			parseInt(loadSaveArray[20]);
	player.armor.length =		 		parseInt(loadSaveArray[21]);
	player.armorTypeEquipped.length = 	parseInt(loadSaveArray[22]);
	player.spells.length = 				parseInt(loadSaveArray[23]);
	player.spellsAttack.length = 		parseInt(loadSaveArray[24]);
	player.position[0] = 				parseInt(loadSaveArray[25]);
	player.position[1] = 				parseInt(loadSaveArray[26]);
	player.currentWorld = 				parseInt(loadSaveArray[27]);
	homeInventory.gold = 				parseInt(loadSaveArray[28]);
	townBank.gold = 					parseInt(loadSaveArray[29]);
	var count = 30;
	for (i=count; i<count+player.items.length; i+=1){player.items[i-count] = items.array[parseInt(loadSaveArray[i])]}
	count += player.items.length;
	for (i=count; i<count+player.items.length; i+=1){player.itemsQuantity[i-count] = parseInt(loadSaveArray[i]);}
	count += player.items.length;
	for (i=count; i<count+player.weapons.length; i+=1){player.weapons[i-count] = weapons.array[parseInt(loadSaveArray[i])]}
	count += player.weapons.length;
	for (i=count; i<count+player.weapons.length; i+=1){player.weaponsQuantity[i-count] = parseInt(loadSaveArray[i]);}
	count += player.weapons.length;
	for (i=count; i<count+player.armor.length; i+=1){player.armor[i-count] = armor.array[parseInt(loadSaveArray[i])]}
	count += player.armor.length;
	for (i=count; i<count+player.armor.length; i+=1){player.armorQuantity[i-count] = parseInt(loadSaveArray[i]);}
	count += player.armor.length;
	for (i=count; i<count+player.armor.length; i+=1){if (loadSaveArray[i] === "t") {player.armorIsEquipped[i-count] = true;} else {player.armorIsEquipped[i-count] = false;}}
	count += player.armor.length;
	for (i=count; i<count+player.armorTypeEquipped.length; i+=1){player.armorTypeEquipped[i-count] = loadSaveArray[i]}
	count += player.armorTypeEquipped.length;
	for (i=count; i<count+player.spells.length; i+=1){player.spells[i-count] = spells.array[parseInt(loadSaveArray[i])]}
	count += player.spells.length;
	for (i=count; i<count+player.spellsAttack.length; i+=1){player.spellsAttack[i-count] = spells.attack.array[parseInt(loadSaveArray[i])]}
	count += player.spellsAttack.length;
	for (i=count; i<count+player.quests.length; i+=1){player.quests[i-count] = parseInt(loadSaveArray[i])}
	count += player.quests.length;
	for (i=count; i<count+player.quests.length; i+=1){player.questProgress[i-count] = parseInt(loadSaveArray[i])}
	count += player.quests.length;
	for (i=count; i<count+player.weakness.length; i+=1){player.weakness[i-count] = loadSaveArray[i]};
	count += player.weakness.length;
	for (i=count; i<count+player.status.length; i+=1){player.status[i-count] = loadSaveArray[i]};
	count += player.status.length;
	for (i=count; i<count+player.status.length; i+=1){player.statusRounds[i-count] = parseInt(loadSaveArray[i]);}	
	count += player.status.length;
	for (i=count; i<count+homeInventory.items.length; i+=1){homeInventory.items[i-count] = items.array[parseInt(loadSaveArray[i])]};
	count += homeInventory.items.length;
	for (i=count; i<count+homeInventory.items.length; i+=1){homeInventory.itemsQuantity[i-count] = parseInt(loadSaveArray[i]);}
	count += homeInventory.items.length;
	for (i=count; i<count+homeInventory.weapons.length; i+=1){homeInventory.weapons[i-count] = weapons.array[parseInt(loadSaveArray[i])]};
	count += homeInventory.weapons.length;
	for (i=count; i<count+homeInventory.weapons.length; i+=1){homeInventory.weaponsQuantity[i-count] = parseInt(loadSaveArray[i]);}
	count += homeInventory.weapons.length;
	for (i=count; i<count+homeInventory.armor.length; i+=1){homeInventory.armor[i-count] = armor.array[parseInt(loadSaveArray[i])]}
	count += homeInventory.armor.length;
	for (i=count; i<count+homeInventory.armor.length; i+=1){homeInventory.armorQuantity[i-count] = parseInt(loadSaveArray[i]);}
	count += homeInventory.armor.length;
	for (i=count; i<count+homeInventory.items.length; i+=1){homeInventory.items[i-count] = items.array[parseInt(loadSaveArray[i])]};
	count += townBank.items.length;
	for (i=count; i<count+townBank.items.length; i+=1){townBank.itemsQuantity[i-count] = parseInt(loadSaveArray[i]);}
	count += townBank.items.length;
	for (i=count; i<count+townBank.weapons.length; i+=1){townBank.weapons[i-count] = weapons.array[parseInt(loadSaveArray[i])]};
	count += townBank.weapons.length;
	for (i=count; i<count+townBank.weapons.length; i+=1){townBank.weaponsQuantity[i-count] = parseInt(loadSaveArray[i]);}
	count += townBank.weapons.length;
	for (i=count; i<count+townBank.armor.length; i+=1){townBank.armor[i-count] = armor.array[parseInt(loadSaveArray[i])]}
	count += townBank.armor.length;
	for (i=count; i<count+townBank.armor.length; i+=1){townBank.armorQuantity[i-count] = parseInt(loadSaveArray[i]);}
	count += townBank.armor.length;
	for (i=count; i<count+64; i+=1){if (loadSaveArray[i] === "t") {player.flags[i-count] = true;} else {player.flags[i-count] = false;}
	}
}
menu.saveData = function() {
	loadSaveArray = [];
	loadSaveArray[0] = player.name;
	loadSaveArray[1] = player.race;
	loadSaveArray[2] = player.class;
	loadSaveArray[3] = player.level;
	loadSaveArray[4] = player.progress;
	loadSaveArray[5] = player.experience;
	loadSaveArray[6] = player.strength;
	loadSaveArray[7] = player.dexterity;
	loadSaveArray[8] = player.iq;
	loadSaveArray[9] = player.defense;
	loadSaveArray[10] = player.health;
	loadSaveArray[11] = player.hitPoints;
	loadSaveArray[12] = player.manna;
	loadSaveArray[13] = player.mannaMax;
	loadSaveArray[14] = player.gold;
	loadSaveArray[15] = player.weaponEquipped;
	loadSaveArray[16] = player.weakness.length
	loadSaveArray[17] = player.status.length
	loadSaveArray[18] = player.quests.length
	loadSaveArray[19] = player.items.length
	loadSaveArray[20] = player.weapons.length
	loadSaveArray[21] = player.armor.length
	loadSaveArray[22] = player.armorTypeEquipped.length
	loadSaveArray[23] = player.spells.length
	loadSaveArray[24] = player.spellsAttack.length
	loadSaveArray[25] = player.position[0];
	loadSaveArray[26] = player.position[1];
	loadSaveArray[27] = player.currentWorld;
	loadSaveArray[28] = homeInventory.gold
	loadSaveArray[29] = townBank.gold
	var count = loadSaveArray.length;
	for (i=count; i<count+player.items.length; i+=1){loadSaveArray[i] = convert(items.array,player.items[i-count].name);}
	count = loadSaveArray.length;
	for (i=count; i<count+player.items.length; i+=1){loadSaveArray[i] = player.itemsQuantity[i-count];}
	count = loadSaveArray.length;
	for (i=count; i<count+player.weapons.length; i+=1){loadSaveArray[i] = convert(weapons.array,player.weapons[i-count].name);}
	count = loadSaveArray.length;
	for (i=count; i<count+player.weapons.length; i+=1){loadSaveArray[i] = player.weaponsQuantity[i-count];}
	count = loadSaveArray.length;
	for (i=count; i<count+player.armor.length; i+=1){loadSaveArray[i] = convert(armor.array,player.armor[i-count].name);}
	count = loadSaveArray.length;
	for (i=count; i<count+player.armor.length; i+=1){loadSaveArray[i] = player.armorQuantity[i-count];}
	count = loadSaveArray.length;
	for (i=count; i<count+player.armor.length; i+=1){if (player.armorIsEquipped[i-count] === true) {loadSaveArray[i] = "t"} else {loadSaveArray[i] = "f"}}
	count = loadSaveArray.length;
	for (i=count; i<count+player.armorTypeEquipped.length; i+=1){loadSaveArray[i] = player.armorTypeEquipped[i-count]}
	count = loadSaveArray.length;
	for (i=count; i<count+player.spells.length; i+=1){loadSaveArray[i] = convert(spells.array,player.spells[i-count].name);}
	count = loadSaveArray.length;
	for (i=count; i<count+player.spellsAttack.length; i+=1){loadSaveArray[i] = convert(spells.attack.array,player.spellsAttack[i-count].name);}
	count = loadSaveArray.length;
	for (i=count; i<count+player.quests.length; i+=1){loadSaveArray[i] = player.quests[i-count];}
	count = loadSaveArray.length;
	for (i=count; i<count+player.quests.length; i+=1){loadSaveArray[i] = player.questProgress[i-count];}
	count = loadSaveArray.length;
	for (i=count; i<count+player.weakness.length; i+=1){loadSaveArray[i] = player.weakness[i-count];}
	count = loadSaveArray.length;
	for (i=count; i<count+player.status.length; i+=1){loadSaveArray[i] = player.status[i-count];}
	count = loadSaveArray.length;
	for (i=count; i<count+player.statusRounds.length; i+=1){loadSaveArray[i] = player.statusRounds[i-count];}
	count = loadSaveArray.length;
	for (i=count; i<count+homeInventory.items.length; i+=1){loadSaveArray[i] = convert(items.array,homeInventory.items[i-count].name);}
	count = loadSaveArray.length;
	for (i=count; i<count+homeInventory.items.length; i+=1){loadSaveArray[i] = homeInventory.itemsQuantity[i-count];}
	count = loadSaveArray.length;
	for (i=count; i<count+homeInventory.weapons.length; i+=1){loadSaveArray[i] = convert(weapons.array,homeInventory.weapons[i-count].name);}
	count = loadSaveArray.length;
	for (i=count; i<count+homeInventory.weapons.length; i+=1){loadSaveArray[i] = homeInventory.weaponsQuantity[i-count];}
	count = loadSaveArray.length;
	for (i=count; i<count+homeInventory.armor.length; i+=1){loadSaveArray[i] = convert(armor.array,homeInventory.armor[i-count].name);}
	count = loadSaveArray.length;
	for (i=count; i<count+homeInventory.armor.length; i+=1){loadSaveArray[i] = homeInventory.armorQuantity[i-count];}
	count = loadSaveArray.length;
	for (i=count; i<count+townBank.items.length; i+=1){loadSaveArray[i] = convert(items.array,townBank.items[i-count].name);}
	count = loadSaveArray.length;
	for (i=count; i<count+townBank.items.length; i+=1){loadSaveArray[i] = townBank.itemsQuantity[i-count];}
	count = loadSaveArray.length;
	for (i=count; i<count+townBank.weapons.length; i+=1){loadSaveArray[i] = convert(weapons.array,townBank.weapons[i-count].name);}
	count = loadSaveArray.length;
	for (i=count; i<count+townBank.weapons.length; i+=1){loadSaveArray[i] = townBank.weaponsQuantity[i-count];}
	count = loadSaveArray.length;
	for (i=count; i<count+townBank.armor.length; i+=1){loadSaveArray[i] = convert(armor.array,townBank.armor[i-count].name);}
	count = loadSaveArray.length;
	for (i=count; i<count+townBank.armor.length; i+=1){loadSaveArray[i] = townBank.armorQuantity[i-count];}
	count = loadSaveArray.length;
	for (i=count; i<count+64; i+=1){if (player.flags[i-count] === true) {loadSaveArray[i] = "t"} else {loadSaveArray[i] = "f"}}
	function convert(arr,type) {for (let c=0; c<arr.length; c+=1) {if (arr[c].name === type) {return c;}}}
}

var display = new Object();
display.char = function() {
	var playerStatus = "ready";
	if (player.status.length > 0) {playerStatus = player.status;}
	document.getElementById("name").innerHTML = player.name;
	document.getElementById("level").innerHTML = player.level;
	document.getElementById("strength").innerHTML = player.strength;
	document.getElementById("dexterity").innerHTML = player.dexterity;
	document.getElementById("IQ").innerHTML = player.iq;
	document.getElementById("health").innerHTML = player.health + "/" + player.hitPoints;
	document.getElementById("defense").innerHTML = player.defense;
	document.getElementById("armorClass").innerHTML = player.armorClass;
	document.getElementById("manna").innerHTML = player.manna + "/" + player.mannaMax;
	document.getElementById("status").innerHTML = playerStatus;
	document.getElementById("experience").innerHTML = player.experience;
	document.getElementById("nextLevel").innerHTML = levelUpExpCheck();		
	document.getElementById("gold").innerHTML = player.gold;
	document.getElementById("raceClass").innerHTML = player.race+" "+player.class;
	var h = Math.floor(player.health*200/player.hitPoints)
	var m = Math.floor(player.manna*200/player.mannaMax)
	document.getElementById("healthBar").style = "width: "+h+";"
	document.getElementById("mannaBar").style = "width: "+m+";"
	document.getElementById("healthBarBack").style = "bottom: 480;"
	document.getElementById("mannaBarBack").style = "bottom: 510;"
};
display.message = {
	speaking: false,
	timeout: false,
	set: function(m,l) {
		var h = 30;
		if (l>1) {h = 30*l;}
		document.getElementById("message").style = "display: block; width: 850;"				// height: "+h+";";
		document.getElementById("message").innerHTML = m;
	},
	hide: function() {
		display.message.timeout = false;
		document.getElementById("message").style = "display: none;";
	},
	prompt: function(m,l) {
		this.set(m,l);
		if (display.message.timeout === false) {setTimeout(display.message.hide,5000)}
		display.message.timeout = true;
	},
	enterDialog: function() {
		display.message.speaking = true;
		document.getElementById("listQuests").style = "display: none;";
		document.getElementById("listButtons").style = "";
		display.loadButtons();
		buttons.keys[0] = function() {};
		buttons.keys[1] = function() {};
		buttons.keys[2] = function() {};
		buttons.keys[3] = function() {};
	},
	exitDialog: function() {
		display.message.hide();
		display.message.speaking = false;
		document.getElementById("listQuests").style = "";
		document.getElementById("listButtons").style = "display: none;";
		display.resetItemElements()
		buttons.keys[0] = buttons.u;
		buttons.keys[1] = buttons.d;
		buttons.keys[2] = buttons.l;
		buttons.keys[3] = buttons.r;
		display.loadInventory();
	},
	quest: function(m) {
		document.getElementById("questMessage").style = "display: block;";
		document.getElementById("questMessage").innerHTML = m;
		setTimeout(this.questHide,4000);
	},
	questHide: function() {document.getElementById("questMessage").style = "display: none;";},
}
display.resetItemElements = function() {
	document.getElementById("removeItem").style = "display: none";
	document.getElementById("checkItemInfo").style = "display: none";
	document.getElementById("removeWeapon").style = "display: none";
	document.getElementById("removeArmor").style = "display: none";
	document.getElementById("useItem").style = "display: none";
	document.getElementById("equipWeapon").style = "display: none";
	document.getElementById("checkWeaponInfo").style = "display: none";
	document.getElementById("equipArmor").style = "display: none";
	document.getElementById("checkArmorInfo").style = "display: none";
	document.getElementById("castSpell").style = "display: none";
	document.getElementById("checkAttackSpellInfo").style = "display: none";
	document.getElementById("checkEffectSpellInfo").style = "display: none";
	document.getElementById("checkQuest").style = "display: none";
	document.getElementById("listAttackSpells").style = "display: none";
	document.getElementById("listEffectSpells").style = "display: none";
	document.getElementById("gameList").style = "display: none;";
	document.getElementById("options").style = "display: none;";
	document.getElementById("stats").style = "display: none;";
}
display.loadInventory = function(loadBoth) {
	if (shopActive && !loadBoth) {loadShopInventory(true);}
	display.resetItemElements();
	itemReset();
	document.getElementById("gameList").style = "";
	document.getElementById("menuTitle").innerHTML = "INVENTORY";
	if (shopActive === false) {
		document.getElementById("removeItem").style = "";
		document.getElementById("useItem").style = "";
		document.getElementById("checkItemInfo").style = "";
	}
	for(i=0; i<24; i+=1) {document.getElementById("item"+i).style = "display: none";}
	for(i=0; i<player.items.length; i+=1) {
		document.getElementById("item"+i).innerHTML = player.items[i].name + "(" + player.itemsQuantity[i] + ")";
		document.getElementById("item"+i).style = "display: listitem";
		if (shopActive === true) {
			var salePrice = player.items[i].value;
			salePrice -= Math.ceil(salePrice/10);
			document.getElementById("item"+i).innerHTML += " (Gold: "+salePrice+")";
			document.getElementById("item"+i).style = "display: listitem";
		}
	}
	if (player.items.length < 13) {
		for(let i=player.items.length; i<13; i+=1) {
			document.getElementById("item"+i).style = "";											
			document.getElementById("item"+i).innerHTML = "";											
		}	
	}
}
display.loadWeapons = function(loadBoth) {
	if (shopActive && !loadBoth) {loadShopWeapons(true);}
	display.resetItemElements();
	itemReset();
	document.getElementById("gameList").style = "";
	document.getElementById("menuTitle").innerHTML = "WEAPONS";
	if (shopActive === false) {
		document.getElementById("removeWeapon").style = "";
		document.getElementById("equipWeapon").style = "";
		document.getElementById("checkWeaponInfo").style = "";
	}
	for(i=0; i<24; i+=1) {document.getElementById("item"+i).style = "display: none";}
	document.getElementById("item0").style = "";
	document.getElementById("item0").innerHTML = player.weapons[0].name;
	if (player.weaponEquipped === 0) {document.getElementById("item0").innerHTML += " (Equipped)";}
	for(i=1; i<player.weapons.length; i+=1) {	
		document.getElementById("item"+i).innerHTML = player.weapons[i].name + "(" + player.weaponsQuantity[i] + ")";
		document.getElementById("item"+i).style = "display: listitem";
		if (i === player.weaponEquipped) {document.getElementById("item"+i).innerHTML += " (Equipped)";}
		if (shopActive === true) {
			var salePrice = player.weapons[i].value;
			salePrice -= Math.ceil(salePrice/10);
			document.getElementById("item"+i).innerHTML += " (Gold: "+salePrice+")";
			document.getElementById("item"+i).style = "display: listitem";
		}
	}
	if (player.weapons.length < 13) {
		for(let i=player.weapons.length; i<13; i+=1) {
			document.getElementById("item"+i).style = "";											
			document.getElementById("item"+i).innerHTML = "";											
		}	
	}
}
display.loadArmor = function(loadBoth) {
	if (shopActive && !loadBoth) {loadShopArmor(true);}
	display.resetItemElements();
	itemReset();
	document.getElementById("gameList").style = "";
	document.getElementById("menuTitle").innerHTML = "ARMOR";
	if (shopActive === false) {
		document.getElementById("removeArmor").style = "";
		document.getElementById("equipArmor").style = "";
		document.getElementById("checkArmorInfo").style = "";
	}
	for(i=0; i<24; i+=1) {document.getElementById("item"+i).style = "display: none";}
	for(i=0; i<player.armor.length; i+=1) {
		document.getElementById("item"+i).innerHTML = player.armor[i].name + "(" + player.armorQuantity[i] + ")";
		document.getElementById("item"+i).style = "display: listitem";
	}
	player.armorClass = player.defense;
	for(i=0; i<player.armor.length; i+=1) {
		if (player.armorIsEquipped[i] === true) {
			player.armorClass += player.armor[i].stat;
			document.getElementById("item"+i).innerHTML += " (Equipped: " + player.armor[i].typeName + ")";
		}
		if (shopActive === true) {
			var salePrice = player.armor[i].value;
			salePrice -= Math.ceil(salePrice/10);
			document.getElementById("item"+i).innerHTML += " (Gold: "+salePrice+")";
		}
	}
	if (player.armor.length < 13) {
		for(let i=player.armor.length; i<13; i+=1) {
			document.getElementById("item"+i).style = "";											
			document.getElementById("item"+i).innerHTML = "";											
		}
	}
	display.char();
}
display.loadEffectSpells = function() {
	display.resetItemElements();
	itemReset();
	document.getElementById("gameList").style = "";
	document.getElementById("menuTitle").innerHTML = "EFFECT SPELLS";
	document.getElementById("castSpell").style = "";
	document.getElementById("checkEffectSpellInfo").style = "";
	document.getElementById("listAttackSpells").style = "";
	for(i=0; i<24; i+=1) {document.getElementById("item"+i).style = "display: none";}
	for (i=0; i<player.spells.length; i+=1) {
		document.getElementById("item"+i).innerHTML = player.spells[i].name;
		document.getElementById("item"+i).style = "display: listitem";
	}
	if (player.spells.length < 13) {
		for(let i=player.spells.length; i<13; i+=1) {
			document.getElementById("item"+i).style = "";											
			document.getElementById("item"+i).innerHTML = "";											
		}
	}
}	
display.loadAttackSpells = function() {
	display.resetItemElements();
	itemReset();
	document.getElementById("gameList").style = "";
	document.getElementById("menuTitle").innerHTML = "ATTACK SPELLS";
	document.getElementById("checkAttackSpellInfo").style = "";
	document.getElementById("listEffectSpells").style = "";
	for(i=0; i<24; i+=1) {document.getElementById("item"+i).style = "display: none";}
	for (i=0; i<player.spellsAttack.length; i+=1) {
		document.getElementById("item"+i).innerHTML = player.spellsAttack[i].name;
		document.getElementById("item"+i).style = "display: listitem";
	}
	if (player.spellsAttack.length < 13) {
		for(let i=player.spellsAttack.length; i<13; i+=1) {
			document.getElementById("item"+i).style = "";											
			document.getElementById("item"+i).innerHTML = "";											
		}
	}
}
display.loadQuests = function() {
	display.resetItemElements();
	itemReset();
	document.getElementById("gameList").style = "";
	document.getElementById("menuTitle").innerHTML = "QUESTS";
	document.getElementById("checkQuest").style = "";
	for(i=0; i<24; i+=1) {document.getElementById("item"+i).style = "display: none";}
	if (player.quests.length > 0) {
		for(i=0; i<player.quests.length; i+=1) {
			document.getElementById("item"+i).innerHTML = quests.nameArray[player.quests[i]];
			document.getElementById("item"+i).style = "display: listitem";
		}
	}
	if (player.quests.length < 13) {
		for(let i=player.quests.length; i<13; i+=1) {
			document.getElementById("item"+i).style = "";											
			document.getElementById("item"+i).innerHTML = "";											
		}
	}
}
display.loadStats = function() {
	display.resetItemElements();
	itemReset();
	document.getElementById("menuTitle").innerHTML = "PLAYER STATS";
	document.getElementById("stats").style = "font-size: 14px; font-weight: 600; width: 100%; height: 350px; display: block;";
}
display.loadButtons = function() {
	display.resetItemElements();
	itemReset();
	document.getElementById("menuTitle").innerHTML = "";
	document.getElementById("options").style = "display: button;";
}
function setBuySellVars(setBuy,setSell) {
	for(i=0; i<24; i+=1) {itemVarArray[i] = setSell;}
	for(i=0; i<60; i+=1) {buyVarArray[i] = setBuy;}
}
var shopActive = false;
function resetShopButtons() {
	document.getElementById("shopCheckItem").style = "display: none";
	document.getElementById("shopCheckWeapon").style = "display: none";
	document.getElementById("shopCheckArmor").style = "display: none";
}
function loadShop() {
	shopActive = true;
	document.getElementById("storePopUp").style = "";
	document.getElementById("storePrompt").innerHTML = "What would you like to buy or sell?";
	document.getElementById("depositGold").style = "display: none";
	document.getElementById("withdrawGold").style = "display: none";
	loadShopInventory();
}
function loadBank() {
	shopActive = true;
	document.getElementById("storePopUp").style = "";
	document.getElementById("storePrompt").innerHTML = "What would you like to withdraw or deposit?";
	document.getElementById("depositGold").style = "display: button";
	document.getElementById("withdrawGold").style = "display: button";
	document.getElementById("withdrawGold").innerHTML = "Withdraw Gold";
	loadShopInventory();
}
function loadLoot() {
	shopActive = true;
	document.getElementById("storePopUp").style = "display: block; ";
	document.getElementById("storePrompt").innerHTML = "Gather your loot from the enemy. ";
	document.getElementById("depositGold").style = "display: none;";
	document.getElementById("withdrawGold").style = "display: button;";
	document.getElementById("withdrawGold").innerHTML = "Loot Gold";
	loadShopInventory();
}
function exitShop() {
	shopActive = false;
	document.getElementById("storePopUp").style = "display: none";
	display.char();
	if (combat.active === true) {
		levelUp();
		display.loadButtons();
	} else {display.loadInventory();}
}
function loadShopInventory(loadBoth) {
	resetShopButtons();
	document.getElementById("shopCheckItem").style = "display: button";
	document.getElementById("shopListTitle").innerHTML = "INVENTORY";
	if (!loadBoth) {display.loadInventory(true);}
	for(i=0; i<60; i+=1) {
		document.getElementById("buy"+i).style = "display: none";
	}
	for(i=0; i<currentShop.items.length; i+=1) {
		document.getElementById("buy"+i).innerHTML = currentShop.items[i].name + "(" + currentShop.itemsQuantity[i] + ")";
		document.getElementById("buy"+i).style = "display: listitem";
		document.getElementById("buy"+i).innerHTML += " (Gold: "+currentShop.items[i].value+")";
	}
	document.getElementById("playerGold").innerHTML = "Gold: "+player.gold;
	document.getElementById("shopGold").innerHTML = "Gold: "+currentShop.gold;
	if (currentShop.items.length < 9) {
		for(let i=currentShop.items.length; i<9; i+=1) {
			document.getElementById("buy"+i).style = "";											
			document.getElementById("buy"+i).innerHTML = "";											
		}
	}
	var buyFunc = function(itemNum) {buySell(itemNum, 0, "buy", player.items, player.itemsQuantity, currentShop.items, currentShop.itemsQuantity, 1)}
	var sellFunc = function(itemNum) {buySell(itemNum, 0, "sell", player.items, player.itemsQuantity, currentShop.items, currentShop.itemsQuantity, 1)}
	var withdrawFunc = function(itemNum) {buySell(itemNum, 0, "withdraw", player.items, player.itemsQuantity, currentShop.items, currentShop.itemsQuantity, 1)}
	var depositFunc = function(itemNum) {buySell(itemNum, 0, "deposit", player.items, player.itemsQuantity, currentShop.items, currentShop.itemsQuantity, 1)}
	function checkBuy() {checkInfo('item', true)}
	function checkSell() {checkInfo('item', false)}
	if (currentShop.type === "shop") {setBuySellVars(buyFunc, sellFunc)} else {setBuySellVars(withdrawFunc, depositFunc)}
	document.getElementById("storeInfo").innerHTML = "Click on the \"Check Info\" button above and then click on the item you would like info on."
}
function loadShopWeapons(loadBoth) {
	resetShopButtons();
	document.getElementById("shopCheckWeapon").style = "display: button";
	document.getElementById("shopListTitle").innerHTML = "WEAPONS";
	if (!loadBoth) {display.loadWeapons(true);}
	for(i=0; i<60; i+=1) {document.getElementById("buy"+i).style = "display: none";}
	for(i=0; i<currentShop.weapons.length; i+=1) {
		document.getElementById("buy"+i).innerHTML = currentShop.weapons[i].name+"("+currentShop.weaponsQuantity[i]+") (Gold: "+currentShop.weapons[i].value+")";
		document.getElementById("buy"+i).style = "display: listitem";
	}
	document.getElementById("playerGold").innerHTML = "Gold: "+player.gold;
	document.getElementById("shopGold").innerHTML = "Gold: "+currentShop.gold;
	if (currentShop.weapons.length < 9) {
		for(let i=currentShop.weapons.length; i<9; i+=1) {
			document.getElementById("buy"+i).style = "";											
			document.getElementById("buy"+i).innerHTML = "";											
		}
	}
	var buyFunc = function(itemNum) {buySell(itemNum, 1, "buy", player.weapons, player.weaponsQuantity, currentShop.weapons, currentShop.weaponsQuantity, 1)}
	var sellFunc = function(itemNum) {buySell(itemNum, 1, "sell", player.weapons, player.weaponsQuantity, currentShop.weapons, currentShop.weaponsQuantity, 1)}
	var withdrawFunc = function(itemNum) {buySell(itemNum, 1, "withdraw", player.weapons, player.weaponsQuantity, currentShop.weapons, currentShop.weaponsQuantity, 1)}
	var depositFunc = function(itemNum) {buySell(itemNum, 1, "deposit", player.weapons, player.weaponsQuantity, currentShop.weapons, currentShop.weaponsQuantity, 1)}
	function checkBuy() {checkInfo('weapon', true)}
	function checkSell() {checkInfo('weapon', false)}
	if (currentShop.type === "shop") {setBuySellVars(buyFunc, sellFunc)} else {setBuySellVars(withdrawFunc, depositFunc)}
	itemVarArray[0] = 0;
	document.getElementById("storeInfo").innerHTML = "Click on the \"Check Info\" button above and then click on the item you would like info on."
}
function loadShopArmor(loadBoth) {
	resetShopButtons();
	document.getElementById("shopCheckArmor").style = "display: button";
	document.getElementById("shopListTitle").innerHTML = "ARMOR";
	if (!loadBoth) {display.loadArmor(true)};
	for(i=0; i<60; i+=1) {document.getElementById("buy"+i).style = "display: none";}
	for(i=0; i<currentShop.armor.length; i+=1) {
		document.getElementById("buy"+i).style = "display: listitem";
		document.getElementById("buy"+i).innerHTML = currentShop.armor[i].name+"("+currentShop.armorQuantity[i]+") (Gold: "+currentShop.armor[i].value+")";
	}
	document.getElementById("playerGold").innerHTML = "Gold: "+player.gold;
	document.getElementById("shopGold").innerHTML = "Gold: "+currentShop.gold;
	if (currentShop.armor.length < 9) {
		for(let i=currentShop.armor.length; i<9; i+=1) {
			document.getElementById("buy"+i).style = "";											
			document.getElementById("buy"+i).innerHTML = "";											
		}
	}
	var buyFunc = function(itemNum) {buySell(itemNum, 2, "buy", player.armor, player.armorQuantity, currentShop.armor, currentShop.armorQuantity, 1)}
	var sellFunc = function(itemNum) {buySell(itemNum, 2, "sell", player.armor, player.armorQuantity, currentShop.armor, currentShop.armorQuantity, 1)}
	var withdrawFunc = function(itemNum) {buySell(itemNum, 2, "withdraw", player.armor, player.armorQuantity, currentShop.armor, currentShop.armorQuantity, 1)}
	var depositFunc = function(itemNum) {buySell(itemNum, 2, "deposit", player.armor, player.armorQuantity, currentShop.armor, currentShop.armorQuantity, 1)}
	if (currentShop.type === "shop") {setBuySellVars(buyFunc, sellFunc)} else {setBuySellVars(withdrawFunc, depositFunc)}
	document.getElementById("storeInfo").innerHTML = "Click on the \"Check Info\" button above and then click on the item you would like info on."
}
function withdrawGold() {
	if (typeof currentShop.atkString === "undefined") {
		var amount = window.prompt("How much gold would you like to withdraw?")
	} else {
		var amount = combat.opponent.gold;
		document.getElementById("storePrompt").innerHTML = "You looted "+amount+" gold coins. "
	}
	amount = parseInt(amount);
	if (amount > 0 && amount < 1000000) {
		if (amount > currentShop.gold) {
			player.gold += currentShop.gold;
			currentShop.gold = 0;
		} else {
			player.gold += amount;
			currentShop.gold -= amount;
		}
		document.getElementById("playerGold").innerHTML = "Gold: "+player.gold;
		document.getElementById("shopGold").innerHTML = "Gold: "+currentShop.gold;
	} else {window.alert("That is not a valid number."); return;}
}
function depositGold() {
	var amount = window.prompt("How much gold would you like to deposit?")
	amount = parseInt(amount);
	if (amount > 0 && amount < 1000000) {
		if (amount > player.gold) {
			currentShop.gold += player.gold;
			player.gold = 0;
		} else {
			currentShop.gold += amount;
			player.gold -= amount;
		}
		document.getElementById("playerGold").innerHTML = "Gold: "+player.gold;
		document.getElementById("shopGold").innerHTML = "Gold: "+currentShop.gold;
	} else {window.alert("That is not a valid number."); return;}
}
function buySell(itemNum, type, action, arr, arrQuantity, storeArr, storeArrQuantity, amount) {
	var str, actionDone, refresh;
	var shopPitch = "What else would you like to buy or sell?";
	var bankPitch = "What else would you like to withdraw or deposit?";
	var lootPitch = "What else would you like to loot?";
	if (typeof currentShop.atkString !== "undefined") {
		shopPitch = lootPitch;
		bankPitch = lootPitch;
	}
	if (type === 0) {
		str = "item";
		refresh = loadShopInventory;
	} else if (type === 1) {
		str = "weapon";
		refresh = loadShopWeapons;
		if (action === "sell" && itemNum === 0) {
			document.getElementById("storePrompt").innerHTML ="You cannot "+action+" your fists. ";
			return;
		}
	} else if (type === 2) {
		str = "armor";
		refresh = loadShopArmor;
	}
	if (action === "sell") {
		var salePrice = arr[itemNum].value;
		salePrice -= Math.ceil(salePrice/10);
		if (salePrice > currentShop.gold) {
			document.getElementById("storePrompt").innerHTML = currentShop.name+" does not have enough gold. ";
		} else {
			meToYou("sold")	
			document.getElementById("storePrompt").innerHTML += " for "+salePrice+" gold coins. "+shopPitch;
			player.gold += salePrice;
			currentShop.gold -= salePrice;
			refresh();
		}
	} else if (action === "buy") {
		var itemPrice = storeArr[itemNum].value;
		if (itemPrice > player.gold) {
			document.getElementById("storePrompt").innerHTML = "You do not have enough gold. ";
		} else {
			youToMe("bought")
			document.getElementById("storePrompt").innerHTML += " for "+itemPrice+" gold coins. "+shopPitch;
			player.gold -= itemPrice;	
			currentShop.gold += itemPrice;
			refresh();
		}
	} else if (action === "deposit") {
		meToYou("deposited")
		document.getElementById("storePrompt").innerHTML += ". "+bankPitch;
		refresh();
	} else if (action === "withdraw") {
		youToMe("withdrew")
		document.getElementById("storePrompt").innerHTML += ". "+bankPitch;
		refresh();
	}
	function meToYou(actionDone) {
		document.getElementById("storePrompt").innerHTML = "You "+actionDone+" "+amount+" "+arr[itemNum].name;
		addStuff(storeArr, storeArrQuantity, amount, arr[itemNum], str)
		if (arrQuantity[itemNum] < 2){removeStuff(arr, arrQuantity, itemNum, str);} else {arrQuantity[itemNum] -= amount;}
	}
	function youToMe(actionDone) {
		document.getElementById("storePrompt").innerHTML = "You "+actionDone+" "+amount+" "+storeArr[itemNum].name;
		addStuff(arr, arrQuantity, amount, storeArr[itemNum], str)	
		if (storeArrQuantity[itemNum] < 2){removeStuff(storeArr, storeArrQuantity, itemNum, str);} else {storeArrQuantity[itemNum] -= amount;}
	}
}
function checkArrayFull(arr) {if(arr.length < 24){return false;} else {return true;}}
function checkQuantityFull(arr,arrQuantity,itemObj) {
	for (i=0; i<arr.length; i+=1) {if (arr[i] === itemObj) {if (arrQuantity[i] >= itemObj.max) {return true;};};};
	return checkArrayFull(arr);
}
function checkForStuff(arr, itemObj) {
	if (arr.length === 0) {return false;}
	for (i=0; i<arr.length; i+=1) {if (arr[i] === itemObj) {return i;}}
	return false;
}
function addStuff(arr, arrQuantity, amount, itemObj, str) {
	var location = checkForStuff(arr, itemObj);
	if (location !== false) {
		if (arrQuantity !== 0) {
			if (arrQuantity[location]+amount <= arr[location].max) {arrQuantity[location] += amount;}
			if (arrQuantity[location] === arr[location].max) {return;}
		} else {display.message.prompt("You already know this spell. ");}
	} else {
		if (arr.length < 24) {
			arr.push(itemObj);
			if (arrQuantity !== 0) {arrQuantity.push(amount);}
			if (str === "armor") {
				player.armorIsEquipped.length = player.armor.length;
				player.armorIsEquipped[player.armorIsEquipped.length-1] = false;
			}
		}
	}
	delete location;
}
function removeStuff(arr, arrQuantity, itemNum, str) {
	if (str === "item") {
		spliceStuff(itemNum)
		if (combat.active === true) {display.loadButtons();} else {display.loadInventory()};
	} else if (str === "weapon") {
		if (player.weaponEquipped === itemNum) {player.weaponEquipped = 0;}
		else if (player.weaponEquipped > itemNum && player.weaponEquipped !== 0) {player.weaponEquipped -= 1;}
		spliceStuff(itemNum)
		if (combat.active === true) {display.loadButtons();} else {display.loadWeapons()};
	} else if (str === "armor") {
		if (arr === player.armor) {
			for (i=0; i<player.armorTypeEquipped.length; i+=1) {
				if (player.armorTypeEquipped[i] === player.armor[itemNum].typeName) {player.armorTypeEquipped.splice(i,1)}
			}
			player.armorIsEquipped.splice(itemNum, 1);
		}
		spliceStuff(itemNum);
		if (combat.active === true) {display.loadButtons();} else {display.loadArmor()};
	}
	if (combat.active === true) {display.loadButtons();}
	function spliceStuff(itemNum) {
		arr.splice(itemNum, 1);
		arrQuantity.splice(itemNum, 1);
	}
}
function equipStuff(itemType) {
	if (itemType === 0) {equipWeapon();} else {equipArmor();}
	function equipWeapon() {
		display.message.set("Click the weapon you would like to equip.");
		if (combat.active === true) {buttonVarArray[0] = combat.displayAttacks;}
		display.loadWeapons();
		itemSet(weaponEquipped);
	}
	function equipArmor() {
		if (combat.active === true) {return;}
		display.message.set("Click the armor you would like to equip.");
		display.loadArmor();
		itemSet(armorEquipped);
	}
	function weaponEquipped(itemNum) {
		var ammo = player.weapons[itemNum].name === "arrow" || player.weapons[itemNum].name === "bolt" || player.weapons[itemNum].name === "bullet";
		var classLvl = checkClass(player.weapons[itemNum]);
		if (ammo === true) {
			document.getElementById("message").innerHTML = "You cannot equip ammo. ";
		} else if (typeof classLvl === "string") {
			document.getElementById("message").innerHTML = "You must be of the "+classLvl+" class to use this weapon. "
		} else if (typeof classLvl === "number") {
			document.getElementById("message").innerHTML = "You must be at least level "+classLvl+" to use this weapon. "
		} else if (player.weaponEquipped === itemNum) {
			if (itemNum === 0) {
				document.getElementById("message").innerHTML = "You cannot put your fists away. "
				return;
			}
			if (combat.active === true) {
				goBack("The "+player.weapons[itemNum].name+" was put away.");
				combat.turns[0] = true;
			} else {
				display.message.prompt("The "+player.weapons[itemNum].name+" was put away.");
			}
			player.weaponEquipped = 0;
		} else {
			if (combat.active === true) {
				combat.playerAction = [4,itemNum];
				combat.startRound();
				return;
			} else {playerEquip(itemNum);}
		}
		if (combat.active === true) {display.loadButtons();} else {display.loadWeapons();}
		itemSet(weaponEquipped);
	}
	function armorEquipped(itemNum) {
		function alreadyWearing() {
			display.message.prompt("You are already wearing ");
			if (player.armor[itemNum].typeName === "buckler" || player.armor[itemNum].typeName === "shield") {
				document.getElementById("message").innerHTML += "a shield. "
			} else {document.getElementById("message").innerHTML += "something on your "+player.armor[itemNum].typeName+".";}
			itemSet(armorEquipped);
		}
		var classLvl = checkClass(player.armor[itemNum]);
		if (typeof classLvl === "string") {
			document.getElementById("message").innerHTML = "You must be of the "+classLvl+" class to use this weapon. "
			display.loadArmor();
			itemSet(armorEquipped);
			return;
		} else if (typeof classLvl === "number") {
			document.getElementById("message").innerHTML = "You must be at least level "+classLvl+" to use this weapon. "
			display.loadArmor();
			itemSet(armorEquipped);
			return;
		}
		if (player.armorIsEquipped[itemNum] !== true) {
			if (checkForStuff(player.armorTypeEquipped,player.armor[itemNum].typeName) === false) {
				if (player.armor[itemNum].typeName === "shield" && checkForStuff(player.armorTypeEquipped,"buckler") !== false) {
					alreadyWearing();
					return;
				} else if (player.armor[itemNum].typeName === "buckler" && checkForStuff(player.armorTypeEquipped,"shield") !== false) {
					alreadyWearing();
					return;
				}
				player.armorIsEquipped[itemNum] = true;
				player.armorTypeEquipped.push(player.armor[itemNum].typeName);
				display.message.prompt("The "+player.armor[itemNum].name+" was equipped. ");
				if (player.armor[itemNum].resistance !== false) {
					player.weakness.push(player.armor[itemNum].resistance)
				}
			} else {alreadyWearing();} 
		} else {
			player.armorIsEquipped[itemNum] = false;
			var location = checkForStuff(player.armorTypeEquipped,player.armor[itemNum].typeName);
			player.armorTypeEquipped.splice(location,1);
			display.message.prompt("The "+player.armor[itemNum].name+" was taken off. ");
			if (player.armor[itemNum].resistance !== false) {removeWeakness(player.armor[itemNum].resistance)}
		}
		if (player.weapons[player.weaponEquipped].twoHanded === true && checkForStuff(player.armorTypeEquipped,"shield") !== false) {
			player.weaponEquipped = 0;
			document.getElementById("message").innerHTML += "However, you had to put up your weapon to hold it.";
			document.getElementById("message").style = "display: block; height: 60;"
		}
		display.loadArmor();
		itemSet(armorEquipped);
	}
}	
function playerEquip(itemNum) {
	if (combat.active === true) {
		goBack("The "+player.weapons[itemNum].name+" has been equipped. ");
	} else {
		display.message.prompt("The "+player.weapons[itemNum].name+" has been equipped. ");
	}
	if (player.weapons[itemNum].twoHanded === true) {
		for (i=0; i<player.armor.length; i+=1) {
			if (player.armor[i].typeName === "shield" && player.armorIsEquipped[i] === true) {
				player.armorIsEquipped[i] = false;
				player.armorTypeEquipped.splice(checkForStuff(player.armorTypeEquipped,"shield"), 1)
				document.getElementById("message").innerHTML += "However, you had to take off your shield to hold it.";
				if (player.armor[i].resistance !== false) {removeWeakness(player.armor[i].resistance)}
				break;
			}
		}
	}
	player.weaponEquipped = itemNum;
	if (combat.active === true) {display.loadButtons();} else {display.loadWeapons()};
}
function removeWeakness(weak) {for (i=0; i<player.weakness.length; i+=1) {if (weak === player.weakness[i]) {player.weakness.splice(i,1);}}}
function checkClass(itemObj) {
	if (itemObj.class.length === 0) {return true;}
	for (i=0; i<itemObj.class.length; i+=1) {
		var cls = itemObj.class[i].toLowerCase();
		var lvl = parseInt(cls[cls.length-1]);
		cls = cls.slice(0, cls.length-1);
		if (cls === "any" || player.class.toLowerCase() === cls) {
			if (lvl === 0 || player.level >= lvl) {return true;} else {return lvl;}
		} else if (i === itemObj.class.length-1 && player.class !== cls) {return cls;}
	}
}
function checkInfo(type, isShop) {	
	if (isShop === true) {
		document.getElementById("storeInfo").innerHTML = "Click the "+type+" you would like info on. ";
		setBuySellVars(checkShop, check)
	} else {
		display.message.prompt("Click the "+type+" you would like info on. ")
		itemSet(check);
	}
	function check(itemNum) {
		if (isShop === true) {
			document.getElementById("storeInfo").innerHTML = "To buy or sell, click \"Inventory\", \"Weapons\", or \"Armor\" above.<br><br>Info:<br>"
			if (type === "item") {
				document.getElementById("storeInfo").innerHTML += player.items[itemNum].name + ":<br>" + player.items[itemNum].info
			} else if (type === "weapon") {
				document.getElementById("storeInfo").innerHTML += player.weapons[itemNum].name + ":<br>" + player.weapons[itemNum].info
			} else if (type === "armor") {
				document.getElementById("storeInfo").innerHTML += player.armor[itemNum].name + ":<br>" + player.armor[itemNum].info
			}
		} else {
			if (type === "item") {
				display.message.prompt(player.items[itemNum].info)
			} else if (type === "weapon") {
				display.message.prompt(player.weapons[itemNum].info)
			} else if (type === "armor") {
				display.message.prompt(player.armor[itemNum].info)
			} else if (type === "effect spell") {
				display.message.prompt(player.spells[itemNum].info)
			} else if (type === "attack spell") {
				display.message.prompt(player.spellsAttack[itemNum].info)
			} else if (type === "quest") {
				if (player.questProgress[quests.find(itemNum)] >= quests.array[player.quests[itemNum]].length) {
					display.message.prompt("Quest Complete: "+quests.nameArray[player.quests[itemNum]])
					return;
				} else {display.message.prompt(quests.array[player.quests[itemNum]][player.questProgress[itemNum]])}
			}
		}
	}
	function checkShop(itemNum) {
		document.getElementById("storeInfo").innerHTML = "To buy or sell, click \"Inventory\", \"Weapons\", or \"Armor\" above.<br><br>Info:<br>"
		if (type === "item") {
			document.getElementById("storeInfo").innerHTML += currentShop.items[itemNum].name + ":<br>" + currentShop.items[itemNum].info
		} else if (type === "weapon") {
			document.getElementById("storeInfo").innerHTML += currentShop.weapons[itemNum].name + ":<br>" + currentShop.weapons[itemNum].info
		} else if (type === "armor") {
			document.getElementById("storeInfo").innerHTML += currentShop.armor[itemNum].name + ":<br>" + currentShop.armor[itemNum].info
		}
	}
}
function castSpell() {
	if (combat.active === true) {return;}
	display.loadEffectSpells();
	display.message.prompt("Click the effect spell you would like to cast. ")
	itemSet(cast);
	function cast(spellNum) {
		if (player.spells[spellNum].mannaCost>player.manna) {
			display.message.prompt("You do not have enough manna.")
		} else {
			player.spells[spellNum].use(player);
			display.char();
		}
	}
}
function fillArray(stat, length, data) {for(i=0; i<length; i+=1){stat[i] = data;}}
function setButton(buttonNum, text, func) {
	document.getElementById("button"+buttonNum).innerHTML = text;
	document.getElementById("button"+buttonNum).style = "display: button";
	buttonVarArray[buttonNum] = func;
}
function buttonReset() {
	for(i=0; i<10; i+=1) {
		document.getElementById("button"+i).style = "display: none";
		buttonVarArray[i]=0;
	}
}
function itemSet(set) {for(i=0; i<24; i+=1) {itemVarArray[i] = set;}}
function itemReset() {
	for(let i=0; i<24; i+=1) {
		document.getElementById("item"+i).style = "display: none";
		itemVarArray[i] = 0;
	}
}
function goBack(str,l) {
	buttonReset();
	setButton(0, "Go back.", combat.checkRound);
	if (combat.active === true) {
		buttonVarArray[0] = combat.checkRound;
		document.getElementById("battlePrompt").innerHTML = str;
	} else {display.message.prompt(str, l);}
}
var tiles = new Object();
tiles.alt = false;
tiles.create = function() {
	for (x=0; x<11; x+=1) {
		var column = document.getElementById("world").appendChild(document.createElement("div"))
		column.id = "column"+x;
		for (y=0; y<7; y+=1) {
			var tile = document.getElementById("column"+x).appendChild(document.createElement("p"))
			tile.id = "tileX"+x+"Y"+(6-y);
			var trans = tile.appendChild(document.createElement("p"))
			trans.id = "transX"+x+"Y"+(6-y);
			trans.style = "background: rgba(0,0,0,0)"
		}
	}
}
tiles.moveTiles = function(speedX, speedY) {
	if (world.checkCollision() !== true) {return;}
	tiles.offset[0] += speedX;
	tiles.offset[1] += speedY;
	for (i=0; i<2; i+=1) {
		if (tiles.offset[i] > 99) {
			player.position[i] -= 1;
			tiles.offset[i] -= 100;
																	log("player.position = "+player.position)
		} else if (tiles.offset[i] < 0) {
			player.position[i] += 1;
			tiles.offset[i] += 100;
																	log("player.position = "+player.position)
		}
	}
}
tiles.offset = [0,0]
tiles.worldOffset = function() {
	var x = player.position[0]+5;
	var y = player.position[1]+3;
	var arr = [x,y];
	return arr;
}
tiles.set = function() {
	for (x=0; x<11; x+=1) {
		document.getElementById("column"+x).style = "position: absolute; bottom: "+(tiles.offset[1]-80)+"; left: "+((x*100+20)-100+tiles.offset[0])+";"
	}
	world.draw();
}
tiles.nameCheck = function(n) {
	for (let i=0; i<tiles.array.length; i+=1) {
		var tmp = tiles.array[i]();
		if (tmp.name === n) {
			return tiles.array[i]();
		}
		delete tmp;
	}
}
tiles.adjust = function(x,y) {
	var adjX = x*10;
	var adjY = y*10;
	return "background-size: 100 100; background-position: "+adjX+"% "+adjY+"%; " 
}
tiles.tileset = function() {	var s = {	url: "DWI/tileset.png",	canWalk: false,	runScript: false	}; return s;};
tiles.concrete = function()	 		{var t = tiles.tileset();	t.name = "concrete";		t.x = 2;	t.y = 0;	t.canWalk = true;	return t;}
tiles.concreteWall = function() 	{var t = tiles.tileset();	t.name = "concreteWall";	t.x = 2;	t.y = 1;						return t;}
tiles.dirt = function() 			{var t = tiles.tileset();	t.name = "dirt";			t.x = 1;	t.y = 0;	t.canWalk = true;	return t;}
tiles.fence = function()	 		{var t = tiles.tileset();	t.name = "fence";			t.x = 4;	t.y = 1;						return t;}
tiles.grass = function() 			{var t = tiles.tileset();	t.name = "grass";			t.x = 0;	t.y = 0;	t.canWalk = true;	return t;}
tiles.leaves = function() 			{var t = tiles.tileset();	t.name = "leaves";			t.x = 1;	t.y = 1;	t.canWalk = true;	return t;}
tiles.pebbles = function()			{var t = tiles.tileset();	t.name = "pebbles";			t.x = 2;	t.y = 2;	t.canWalk = true;	return t;}
tiles.sandstone = function()		{var t = tiles.tileset();	t.name = "sandstone";		t.x = 1;	t.y = 2;	t.canWalk = true;	return t;}
tiles.stone = function() 			{var t = tiles.tileset();	t.name = "stone";			t.x = 3;	t.y = 0;	t.canWalk = true;	return t;}
tiles.stoneWall = function() 		{var t = tiles.tileset();	t.name = "stoneWall";		t.x = 3;	t.y = 1;						return t;}
tiles.squares = function() 			{var t = tiles.tileset();	t.name = "squares";			t.x = 0;	t.y = 2;	t.canWalk = true;	return t;}
tiles.water = function()	 		{var t = tiles.tileset();	t.name = "water";			t.x = 0;	t.y = 1;						return t;}
tiles.wood = function()	 			{var t = tiles.tileset();	t.name = "wood";			t.x = 5;	t.y = 0;	t.canWalk = true;	return t;}
tiles.woodFloor = function()	 	{var t = tiles.tileset();	t.name = "woodFloor";		t.x = 4;	t.y = 0;	t.canWalk = true;	return t;}
tiles.woodWall = function()	 		{var t = tiles.tileset();	t.name = "woodWall";		t.x = 5;	t.y = 1;						return t;}
tiles.black = function()	 		{var t = tiles.tileset();	t.name = "black";			t.x = 3;	t.y = 2;						return t;}
tiles.carpet = function()	 		{var t = tiles.tileset();	t.name = "carpet";			t.x = 6;	t.y = 0;	t.canWalk = true;	return t;}
tiles.carpetUp = function()			{var t = tiles.tileset();	t.name = "carpetUp";		t.x = 7;	t.y = 0;	t.canWalk = true;	return t;}
tiles.carpetLeft = function()		{var t = tiles.tileset();	t.name = "carpetLeft";		t.x = 8;	t.y = 0;	t.canWalk = true;	return t;}
tiles.carpetDown = function()	 	{var t = tiles.tileset();	t.name = "carpetDown";		t.x = 9;	t.y = 0;	t.canWalk = true;	return t;}
tiles.carpetRight = function()	 	{var t = tiles.tileset();	t.name = "carpetRight";		t.x = 10;	t.y = 0;	t.canWalk = true;	return t;}
tiles.screenLeft = function()	 	{var t = tiles.tileset();	t.name = "screenLeft";		t.x = 6;	t.y = 1;	t.canWalk = true;	return t;}
tiles.screenMiddle = function()	 	{var t = tiles.tileset();	t.name = "screenMiddle";	t.x = 7;	t.y = 1;	t.canWalk = true;	return t;}
tiles.screenRight = function()	 	{var t = tiles.tileset();	t.name = "screenRight";		t.x = 8;	t.y = 1;	t.canWalk = true;	return t;}
tiles.fountain = function()	 		{var t = tiles.tileset();	t.name = "fountain";		t.x = 9;	t.y = 1;						return t;}
tiles.barsBlank = function()		{var t = tiles.tileset();	t.name = "barsBlank";		t.x = 0;	t.y = 3;						return t;}
tiles.barsHor1 = function()	 		{var t = tiles.tileset();	t.name = "barsHor1";		t.x = 1;	t.y = 3;						return t;}
tiles.barsHor2 = function()	 		{var t = tiles.tileset();	t.name = "barsHor2";		t.x = 2;	t.y = 3;						return t;}
tiles.barsHor3 = function()	 		{var t = tiles.tileset();	t.name = "barsHor3";		t.x = 3;	t.y = 3;						return t;}
tiles.barsHor4 = function()	 		{var t = tiles.tileset();	t.name = "barsHor4";		t.x = 4;	t.y = 3;						return t;}
tiles.barsVert1 = function()	 	{var t = tiles.tileset();	t.name = "barsVert1";		t.x = 5;	t.y = 3;						return t;}
tiles.barsVert2 = function()	 	{var t = tiles.tileset();	t.name = "barsVert2";		t.x = 6;	t.y = 3;						return t;}
tiles.barsVert3 = function()	 	{var t = tiles.tileset();	t.name = "barsVert3";		t.x = 7;	t.y = 3;						return t;}
tiles.barsVert4 = function()	 	{var t = tiles.tileset();	t.name = "barsVert4";		t.x = 8;	t.y = 3;						return t;}
tiles.array = [
	tiles.concrete,tiles.concreteWall,tiles.dirt,tiles.fence,tiles.grass,tiles.leaves,tiles.pebbles,tiles.sandstone,tiles.stone,tiles.stoneWall,tiles.squares,
	tiles.water,tiles.wood,tiles.woodFloor,tiles.woodWall,tiles.black,tiles.carpet,tiles.carpetUp,tiles.carpetLeft,tiles.carpetDown,tiles.carpetRight,tiles.screenLeft,
	tiles.screenMiddle,tiles.screenRight,tiles.fountain,tiles.barsBlank,tiles.barsHor1,tiles.barsHor2,tiles.barsHor3,tiles.barsHor4,tiles.barsVert1,tiles.barsVert2,
	tiles.barsVert3,tiles.barsVert4,
];

var trans = new Object()
trans.nameCheck = function(n) {
	for (let i=0; i<trans.array.length; i+=1) {
		var tmp = trans.array[i]();
		if (tmp.name === n) {
			return trans.array[i]();
		}
		delete tmp;
	}
}
trans.adjust = function(x,y) {
	var adjX = x*10;
	var adjY = y*10;
	return "background-size: 100 100; background-position: "+adjX+"% "+adjY+"%; "
}
trans.tileset = function() 			{var s = {url: "DWI/trans.png", canWalk: false, runScript: false}; return s;};
trans.house = function()			{var t = trans.tileset();	t.name = "house";				t.x = 0;	t.y = 0;						return t;}
trans.house2 = function()			{var t = trans.tileset();	t.name = "house2";				t.x = 0;	t.y = 1;						return t;}
trans.house3 = function()			{var t = trans.tileset();	t.name = "house3";				t.x = 0;	t.y = 2;						return t;}
trans.tripleHouse1 = function()		{var t = trans.tileset();	t.name = "tripleHouse1";		t.x = 1;	t.y = 1;						return t;}
trans.tripleHouse2 = function()		{var t = trans.tileset();	t.name = "tripleHouse2";		t.x = 2;	t.y = 1;						return t;}
trans.tripleHouse3 = function()		{var t = trans.tileset();	t.name = "tripleHouse3";		t.x = 3;	t.y = 1;						return t;}
trans.shop = function()				{var t = trans.tileset();	t.name = "shop";				t.x = 1;	t.y = 0;						return t;}
trans.bank = function()				{var t = trans.tileset();	t.name = "bank";				t.x = 2;	t.y = 0;						return t;}
trans.safe = function()				{var t = trans.tileset();	t.name = "safe";				t.x = 3;	t.y = 0;	t.canWalk = true;	return t;}
trans.arena = function()			{var t = trans.tileset();	t.name = "arena";				t.x = 4;	t.y = 0;						return t;}
trans.table = function()			{var t = trans.tileset();	t.name = "table";				t.x = 1;	t.y = 5;						return t;}
trans.tableTop = function()			{var t = trans.tileset();	t.name = "tableTop";			t.x = 0;	t.y = 3;						return t;}
trans.tableCenter = function()		{var t = trans.tileset();	t.name = "tableCenter";			t.x = 0;	t.y = 4;						return t;}
trans.tableBottom = function()		{var t = trans.tileset();	t.name = "tableBottom";			t.x = 0;	t.y = 5;						return t;}
trans.tableLeft = function()		{var t = trans.tileset();	t.name = "tableLeft";			t.x = 0;	t.y = 6;						return t;}
trans.tableMiddle = function()		{var t = trans.tileset();	t.name = "tableMiddle";			t.x = 1;	t.y = 6;						return t;}
trans.tableRight = function()		{var t = trans.tileset();	t.name = "tableRight";			t.x = 2;	t.y = 6;						return t;}
trans.hole = function()				{var t = trans.tileset();	t.name = "hole";				t.x = 5;	t.y = 0;	t.canWalk = true;	return t;}
trans.ladder = function()			{var t = trans.tileset();	t.name = "ladder";				t.x = 6;	t.y = 0;	t.canWalk = true;	return t;}
trans.boat = function()				{var t = trans.tileset();	t.name = "boat";				t.x = 7;	t.y = 0;						return t;}
trans.ship1 = function()			{var t = trans.tileset();	t.name = "ship1";				t.x = 8;	t.y = 0;						return t;}
trans.ship2 = function()			{var t = trans.tileset();	t.name = "ship2";				t.x = 9;	t.y = 0;						return t;}
trans.ship3 = function()			{var t = trans.tileset();	t.name = "ship3";				t.x = 10;	t.y = 0;						return t;}
trans.tree1 = function()			{var t = trans.tileset();	t.name = "tree1";				t.x = 5;	t.y = 1;						return t;}
trans.tree2 = function()			{var t = trans.tileset();	t.name = "tree2";				t.x = 6;	t.y = 1;						return t;}
trans.stairRight = function()		{var t = trans.tileset();	t.name = "stairRight";			t.x = 7;	t.y = 1;	t.canWalk = true;	return t;}
trans.stairDown = function()		{var t = trans.tileset();	t.name = "stairDown";			t.x = 8;	t.y = 1;	t.canWalk = true;	return t;}
trans.stairLeft = function()		{var t = trans.tileset();	t.name = "stairLeft";			t.x = 9;	t.y = 1;	t.canWalk = true;	return t;}
trans.stairUp = function()			{var t = trans.tileset();	t.name = "stairUp";				t.x = 10;	t.y = 1;	t.canWalk = true;	return t;}
trans.door1Up = function()			{var t = trans.tileset();	t.name = "door1Up";				t.x = 6;	t.y = 2;						return t;}
trans.door1Right = function()		{var t = trans.tileset();	t.name = "door1Right";			t.x = 6;	t.y = 3;						return t;}
trans.door1Down = function()		{var t = trans.tileset();	t.name = "door1Down";			t.x = 6;	t.y = 4;						return t;}
trans.door1Left = function()		{var t = trans.tileset();	t.name = "door1Left";			t.x = 6;	t.y = 5;						return t;}
trans.door2Up = function()			{var t = trans.tileset();	t.name = "door2Up";				t.x = 5;	t.y = 2;						return t;}
trans.door2Right = function()		{var t = trans.tileset();	t.name = "door2Right";			t.x = 5;	t.y = 3;						return t;}
trans.door2Down = function()		{var t = trans.tileset();	t.name = "door2Down";			t.x = 5;	t.y = 4;						return t;}
trans.door2Left = function()		{var t = trans.tileset();	t.name = "door2Left";			t.x = 5;	t.y = 5;						return t;}
trans.torchGround = function()		{var t = trans.tileset();	t.name = "torchGround";			t.x = 4;	t.y = 1;	t.canWalk = true;	return t;}
trans.torchUp = function()			{var t = trans.tileset();	t.name = "torchUp";				t.x = 4;	t.y = 2;						return t;}
trans.torchRight = function()		{var t = trans.tileset();	t.name = "torchRight";			t.x = 4;	t.y = 3;						return t;}
trans.torchDown = function()		{var t = trans.tileset();	t.name = "torchDown";			t.x = 4;	t.y = 4;						return t;}
trans.torchLeft = function()		{var t = trans.tileset();	t.name = "torchLeft";			t.x = 4;	t.y = 5;						return t;}
trans.catBoxUp = function()			{var t = trans.tileset();	t.name = "catBoxUp";			t.x = 10;	t.y = 1;	t.canWalk = true;	return t;}
trans.catBoxRight = function()		{var t = trans.tileset();	t.name = "catBoxRight";			t.x = 7;	t.y = 1;	t.canWalk = true;	return t;}
trans.catBoxDown = function()		{var t = trans.tileset();	t.name = "catBoxDown";			t.x = 8;	t.y = 1;	t.canWalk = true;	return t;}
trans.catBoxLeft = function()		{var t = trans.tileset();	t.name = "catBoxLeft";			t.x = 9;	t.y = 1;	t.canWalk = true;	return t;}
trans.chair = function()			{var t = trans.tileset();	t.name = "chair";				t.x = 2;	t.y = 2;	t.canWalk = true;	return t;}
trans.throne = function()			{var t = trans.tileset();	t.name = "throne";				t.x = 2;	t.y = 3;	t.canWalk = true;	return t;}
trans.couch = function()			{var t = trans.tileset();	t.name = "couch";				t.x = 2;	t.y = 4;	t.canWalk = true;	return t;}
trans.bed = function()				{var t = trans.tileset();	t.name = "bed";					t.x = 2;	t.y = 5;	t.canWalk = true;	return t;}
trans.barrel = function()			{var t = trans.tileset();	t.name = "barrel";				t.x = 1;	t.y = 2;	t.canWalk = true;	return t;}
trans.fenceLeft = function()		{var t = trans.tileset();	t.name = "fenceLeft";			t.x = 0;	t.y = 7;						return t;}
trans.fenceMiddle = function()		{var t = trans.tileset();	t.name = "fenceMiddle";			t.x = 2;	t.y = 7;						return t;}
trans.fenceRight = function()		{var t = trans.tileset();	t.name = "fenceRight";			t.x = 4;	t.y = 7;						return t;}
trans.fenceBottomLeft = function()	{var t = trans.tileset();	t.name = "fenceBottomLeft";		t.x = 5;	t.y = 7;						return t;}
trans.fenceBottomRight = function()	{var t = trans.tileset();	t.name = "fenceBottomRight";	t.x = 6;	t.y = 7;						return t;}
trans.fenceTopLeft = function()		{var t = trans.tileset();	t.name = "fenceTopLeft";		t.x = 7;	t.y = 7;						return t;}
trans.fenceTopMiddle = function()	{var t = trans.tileset();	t.name = "fenceTopMiddle";		t.x = 8;	t.y = 7;						return t;}
trans.fenceTopRight = function()	{var t = trans.tileset();	t.name = "fenceTopRight";		t.x = 9;	t.y = 7;						return t;}
trans.fencePostRight = function()	{var t = trans.tileset();	t.name = "fencePostRight";		t.x = 10;	t.y = 6;						return t;}
trans.fencePostLeft = function()	{var t = trans.tileset();	t.name = "fencePostLeft";		t.x = 10;	t.y = 7;						return t;}
trans.fenceGateClosed = function()	{var t = trans.tileset();	t.name = "fenceGateClosed";		t.x = 1;	t.y = 7;						return t;}
trans.fenceGateOpen = function()	{var t = trans.tileset();	t.name = "fenceGateOpen";		t.x = 3;	t.y = 7;	t.canWalk = true;	return t;}
trans.vendPurpleUp = function()		{var t = trans.tileset();	t.name = "vendPurpleUp";		t.x = 7;	t.y = 2;	t.canWalk = true;	return t;}
trans.vendPurpleRight = function()	{var t = trans.tileset();	t.name = "vendPurpleRight";		t.x = 7;	t.y = 3;	t.canWalk = true;	return t;}
trans.vendPurpleDown = function()	{var t = trans.tileset();	t.name = "vendPurpleDown";		t.x = 7;	t.y = 4;	t.canWalk = true;	return t;}
trans.vendPurpleLeft = function()	{var t = trans.tileset();	t.name = "vendPurpleLeft";		t.x = 7;	t.y = 5;	t.canWalk = true;	return t;}
trans.vendGreenUp = function()		{var t = trans.tileset();	t.name = "vendGreenUp";			t.x = 8;	t.y = 2;	t.canWalk = true;	return t;}
trans.vendGreenRight = function()	{var t = trans.tileset();	t.name = "vendGreenRight";		t.x = 8;	t.y = 3;	t.canWalk = true;	return t;}
trans.vendGreenDown = function()	{var t = trans.tileset();	t.name = "vendGreenDown";		t.x = 8;	t.y = 4;	t.canWalk = true;	return t;}
trans.vendGreenLeft = function()	{var t = trans.tileset();	t.name = "vendGreenLeft";		t.x = 8;	t.y = 5;	t.canWalk = true;	return t;}
trans.vendRedUp = function()		{var t = trans.tileset();	t.name = "vendRedUp";			t.x = 9;	t.y = 2;	t.canWalk = true;	return t;}
trans.vendRedRight = function()		{var t = trans.tileset();	t.name = "vendRedRight";		t.x = 9;	t.y = 3;	t.canWalk = true;	return t;}
trans.vendRedDown = function()		{var t = trans.tileset();	t.name = "vendRedDown";			t.x = 9;	t.y = 4;	t.canWalk = true;	return t;}
trans.vendRedLeft = function()		{var t = trans.tileset();	t.name = "vendRedLeft";			t.x = 9;	t.y = 5;	t.canWalk = true;	return t;}
trans.vendBlueUp = function()		{var t = trans.tileset();	t.name = "vendBlueUp";			t.x = 10;	t.y = 2;	t.canWalk = true;	return t;}
trans.vendBlueRight = function()	{var t = trans.tileset();	t.name = "vendBlueRight";		t.x = 10;	t.y = 3;	t.canWalk = true;	return t;}
trans.vendBlueDown = function()		{var t = trans.tileset();	t.name = "vendBlueDown";		t.x = 10;	t.y = 4;	t.canWalk = true;	return t;}
trans.vendBlueLeft = function()		{var t = trans.tileset();	t.name = "vendBlueLeft";		t.x = 10;	t.y = 5;	t.canWalk = true;	return t;}
trans.array = [
	trans.house,trans.house2,trans.tripleHouse1,trans.tripleHouse2,trans.tripleHouse3,trans.shop,trans.bank,trans.safe,trans.arena,trans.table,trans.tableTop,
	trans.tableCenter,trans.tableBottom,trans.tableLeft,trans.tableMiddle,trans.tableRight,trans.hole,trans.ladder,trans.boat,trans.ship1,trans.ship2,trans.ship3,
	trans.tree1,trans.tree2,trans.stairRight,trans.stairDown,trans.stairLeft,trans.stairUp,trans.door1Up,trans.door1Right,trans.door1Down,trans.door1Left,trans.door2Up,
	trans.door2Right,trans.door2Down,trans.door2Left,trans.torchGround,trans.torchUp,trans.torchRight,trans.torchDown,trans.torchLeft,trans.catBoxUp,trans.catBoxRight,
	trans.catBoxDown,trans.catBoxLeft,trans.chair,trans.throne,trans.couch,trans.bed,trans.barrel,trans.fenceLeft,trans.fenceMiddle,trans.fenceRight,
	trans.fenceBottomLeft,trans.fenceBottomRight,trans.fenceTopLeft,trans.fenceTopMiddle,trans.fenceTopRight,trans.fencePostRight,trans.fencePostLeft,
	trans.fenceGateClosed,trans.fenceGateOpen,trans.vendPurpleUp,trans.vendPurpleRight,trans.vendPurpleDown,trans.vendPurpleLeft,trans.vendGreenUp,trans.vendGreenRight,
	trans.vendGreenDown,trans.vendGreenLeft,trans.vendRedUp,trans.vendRedRight,trans.vendRedDown,trans.vendRedLeft,trans.vendBlueUp,trans.vendBlueRight,
	trans.vendBlueDown,trans.vendBlueLeft
];

var world = new Object();
world.current = 0;
world.create = function() {
	var w = new Object();
	w.array = [];
	w.lastPos = [];
	w.npcArray = [];
	return w;	
}
world.arraySet = function(obj,l,h) {
	for (let x=0; x<l; x+=1) {
		obj.array[x] = [];
		for (let y=0; y<h; y+=1) {
			obj.array[x][y] = 0;
		}
	}
}
world.npcNameCheck = function(name) {
	for (let i=0; i<world.current.npcArray.length; i+=1) {
		if (world.current.npcArray[i].name === name) {
			return i;
		}
	}
	return false;
}
world.random = world.create();
world.random.lastPos = [1,1];
world.randomHouse = world.create();
world.randomHouse.lastPos = [-2,-2];
world.createRandom = function(obj,width,height) {
	for (x=0; x<width; x+=1) {
		obj.array[x] = [];
		for (y=0; y<height; y+=1) {
			var choice = 4
//			var choice = rng(3)+1
			obj.array[x][y] = [tiles.grass(),function(){}];
//			if ((choice == 1 || choice == 3) && y > 0) {
//				obj.array[x][y-1][1] = function() {world.enter(world.randomHouse,'Press "E" to enter house.')}
//			}
		}
		obj.array[x][0] = [tiles.stoneWall(),function(){}]
		obj.array[x][height] = [tiles.stoneWall(),function(){}]
	}
	for (y=0; y<height; y+=1) {
		obj.array[0][y] = [tiles.stoneWall(),function(){}]
		obj.array[width-1][y] = [tiles.stoneWall(),function(){}]
	}
obj.array[8][8] = [tiles.pebblesHouse(),function() {world.enter(world.randomHouse,'Press "E" to enter house.')}]
obj.array[8][7][0].runScript = true;
obj.array[8][7][1] = function() {world.enter(world.randomHouse,'Press "E" to enter house.')}
	var enemies = []
	for (i=0; i<1; i+=1) {
		var e = npc.goblin();
		e.spawnPos = [i+1,i+1]
		e.spawnOffset = [rng(90),rng(90)];
		e.position = e.spawnPos;
		e.posOffset = e.spawnOffset;
		enemies[i] = e;
log("creating enemies in world.createRandom at["+e.spawnPos[0]+","+e.spawnPos[1]+"]")
	}
	enemies.push(npc.guard())
	enemies[enemies.length-1].position = [10,10];
	npc.array = enemies;
}
world.createRandomHouse = function(width,height) {
	world.createRandom(world.randomHouse,width,height)
	var door = 3	//Math.ceil(width/2)
	for (x=0; x<width; x+=1) {
		world.randomHouse.array[x] = [];
		for (y=0; y<height; y+=1) {
			world.randomHouse.array[x][y] = [tiles.concrete(),function(){}];
		}
		world.randomHouse.array[x][0] = [tiles.stoneWall(),function(){}]
		world.randomHouse.array[x][0][0].url = "";
		world.randomHouse.array[x][0][0].canWalk = "false";
		world.randomHouse.array[x][1] = [tiles.stoneWall(),function(){}]
		world.randomHouse.array[x][height] = [tiles.stoneWall(),function(){}]
	}
	for (y=0; y<height; y+=1) {
		world.randomHouse.array[0][y] = [tiles.stoneWall(),function(){}]
		world.randomHouse.array[width-1][y] = [tiles.stoneWall(),function(){}]
	}
	world.randomHouse.array[door][1][0] = tiles.concrete();
	world.randomHouse.array[door][1][0].runScript = true;
	world.randomHouse.array[door][1][1] = function() {
		world.enter(world.random,'Press "E" to exit.');
	}
//	npc.array = [];
//	npc.array[0] = npc.guard();
}
world.draw = function() {
	for (x=0; x<11; x+=1) {
		for (y=0; y<7; y+=1) {
			if (!(player.position[0]+x < 0 || player.position[0]+x > world.current.array.length-1 || player.position[1]+y < 0 || player.position[1]+y > world.current.array[0].length-1)) {
				var url = world.current.array[player.position[0]+x][player.position[1]+y][0].url;
				var offX = world.current.array[player.position[0]+x][player.position[1]+y][0].x;
				var offY = world.current.array[player.position[0]+x][player.position[1]+y][0].y;
				document.getElementById("tileX"+x+"Y"+y).style = "width: 100; height: 100; background-image: url("+url+"); "+tiles.adjust(offX,offY)+" padding: 0; margin: 0; z-index: 1;"
				if (world.current.array[player.position[0]+x][player.position[1]+y][2]) {
					var transUrl = world.current.array[player.position[0]+x][player.position[1]+y][2].url;
					var transX = world.current.array[player.position[0]+x][player.position[1]+y][2].x;
					var transY = world.current.array[player.position[0]+x][player.position[1]+y][2].y;
					document.getElementById("transX"+x+"Y"+y).style = "width: 100; height: 100; background: rgba(0,0,0,0);background-image: url("+transUrl+"); "+
						trans.adjust(transX,transY)+"padding: 0; margin: 0; z-index: 2;"
				} else {document.getElementById("transX"+x+"Y"+y).style = "display: none;"}
			} else {document.getElementById("tileX"+x+"Y"+y).style = "width: 100; height: 100; background: black; padding: 0; margin: 0;"}
		}
	}
}
world.drawNPC = function() {
	world.hideNpcElements()
	for (i=0; i<world.current.npcArray.length; i+=1) {
		var diffX = (player.position[0]-(tiles.offset[0]/100))-(world.current.npcArray[i].position[0]-(world.current.npcArray[i].posOffset[0]/100))
		var diffY = (player.position[1]-(tiles.offset[1]/100))-(world.current.npcArray[i].position[1]-(world.current.npcArray[i].posOffset[1]/100))
		if (diffX > 1.5	 && diffY > 1.8 && diffX < 11.5 && diffY < 7) {
			world.current.npcArray[i].elementId = "element"+i;
			var posX = Math.round((diffX*100)-70)*-1;
			var posY = Math.round((diffY*100)-40)*-1;
			document.getElementById(world.current.npcArray[i].elementId).style = "position: absolute;  font-weight: 800; background: "+world.current.npcArray[i].color+"; width: "+
				world.current.npcArray[i].size+"; height: "+world.current.npcArray[i].size+"; left: "+(1100+posX)+"; bottom: "+(700+posY)+"; display: block; z-index: 2;";
			document.getElementById(world.current.npcArray[i].elementId).innerHTML = "<br>"+world.current.npcArray[i].name;
			world.current.npcArray[i].isOnscreen = true;
		} else {world.current.npcArray[i].isOnscreen = false;}
	}
}
world.npcElements = [];
for (i=0; i<30; i+=1) {
	var el = document.getElementById("npcElements").appendChild(document.createElement("div"))
	el.id = "element"+i;
	el.style = "display: none;"
	world.npcElements[i] = el
}
world.hideNpcElements = function(num) {for (i=0; i<world.npcElements.length; i+=1) {document.getElementById("element"+i).style = "display: none;"}}
world.checkCollision = function() {
	var offsetX = tiles.worldOffset()[0]
	var offsetY = tiles.worldOffset()[1]
	if (world.current.array[offsetX][offsetY][0].runScript === true) {
		world.current.array[offsetX][offsetY][1]()
	} else {
		document.getElementById("message").style = "display: none;"
		buttons.keys[4] = function() {}
	}
	if (player.direction === 0 && tiles.offset[1] <= 0) {
		offsetY += 1;
	} else if (player.direction === 1 && tiles.offset[0] <= 0) {
		offsetX += 1;
	} else if (player.direction === 2 && tiles.offset[1] >= 80) {
		offsetY -= 1;
	} else if (player.direction === 3 && tiles.offset[0] >= 80) {
		offsetX -= 1;
	}
	return world.current.array[offsetX][offsetY][0].canWalk;
}
world.day = {
	is: true,
	count: 0,
	dir: 0,
	changeDaylight: function() {
		if (world.day.is === true) {
log("changing to day")
			world.day.is = false;
			world.day.dir = 1
			world.day.count = 0;
			setTimeout(change, 50)
		} else {
log("changing to night")
			world.day.dir = -1
			world.day.is = true;
			world.day.count = 50;
			setTimeout(change, 50)			
		}
		function change() {
			document.getElementById("filter").style = "position: absolute; bottom: 40; left: 70; width: 920; height: 500; background: rgba(0,0,0,"+
			(world.day.count/100)+"); z-index: 10;"
			world.day.count += world.day.dir;
			if (world.day.count >= 50) {
				return;
			} else if (world.day.count <= 0) {
				document.getElementById("filter").style = "display: hidden;"
				return;				
			} else {setTimeout(change, 50);}
		}
	}
}
world.script = [];

world.assignScript = function(obj) {
	obj.worldScriptPos = world.script.length;
	world.script.push(obj.script)
}
world.removeScript = function(obj) {
	world.script.splice(obj.worldScriptPos,1)
}
world.enter = function(lvl,m) {
	display.message.set(m)
	buttons.keys[4] = function() {
		document.getElementById("message").style = "";
		world.array[world.nameCheck(world.current.name)].lastPos = player.position;
		world.current.npcArray = [];
		lvl.load();
		player.position = lvl.lastPos;
		buttons.keys[4] = function() {}
	}
}
world.shop = function(type,m) {
	display.message.set(m)
	buttons.keys[4] = function() {
		document.getElementById("message").style = "";
		if (type === "bank") {loadBank();} else {loadShop();}
		buttons.keys[4] = function() {}
	}
}
world.nameCheck = function(n) {for (let i=0; i<world.array.length; i+=1) {if (world.array[i].name === n) {return i;}}}
world.setFuncs = function(wObj) {for (let i=0; i<wObj.funcs.length; i+=1) {wObj.funcs[i]();}}
world.saveFile = {
	oakloft: "lvlName=Oakloft;fill=4;gridX=50;gridY=50;block0=x:0,y:0,l:5,h:49,name:water;block1=x:44,y:0,l:5,h:49,name:water;block2=x:6,y:45,l:37,h:4,name:water;block3=x:6,y:0,l:37,h:4,name:water;block4=x:40,y:41,l:3,h:3,name:water;block5=x:6,y:41,l:3,h:3,name:water;block6=x:6,y:39,l:1,h:1,name:water;block7=x:10,y:43,l:1,h:1,name:water;block8=x:38,y:43,l:1,h:1,name:water;block9=x:42,y:39,l:1,h:1,name:water;block10=x:6,y:5,l:3,h:3,name:water;block11=x:40,y:5,l:3,h:3,name:water;block12=x:42,y:9,l:1,h:1,name:water;block13=x:38,y:5,l:1,h:1,name:water;block14=x:10,y:5,l:1,h:1,name:water;block15=x:6,y:9,l:1,h:1,name:water;block16=x:12,y:5,l:25,h:0,name:water;block17=x:43,y:11,l:0,h:27,name:water;block18=x:6,y:11,l:0,h:27,name:water;block19=x:12,y:44,l:25,h:0,name:water;block20=x:12,y:6,l:25,h:4,name:sandstone;block21=x:38,y:11,l:4,h:27,name:sandstone;block22=x:12,y:39,l:25,h:4,name:sandstone;block23=x:7,y:11,l:4,h:27,name:sandstone;block24=x:8,y:9,l:3,h:1,name:sandstone;block25=x:10,y:7,l:1,h:1,name:sandstone;block26=x:12,y:11,l:1,h:1,name:sandstone;block27=x:38,y:9,l:3,h:1,name:sandstone;block28=x:38,y:7,l:1,h:1,name:sandstone;block29=x:36,y:11,l:1,h:1,name:sandstone;block30=x:38,y:39,l:1,h:3,name:sandstone;block31=x:40,y:39,l:1,h:1,name:sandstone;block32=x:36,y:37,l:1,h:1,name:sandstone;block33=x:10,y:39,l:1,h:3,name:sandstone;block34=x:8,y:39,l:1,h:1,name:sandstone;block35=x:12,y:37,l:1,h:1,name:sandstone;block36=x:28,y:31,l:6,h:0,name:concrete;block37=x:28,y:27,l:6,h:0,name:concrete;block38=x:14,y:32,l:0,h:3,name:stoneWall;block39=x:24,y:32,l:0,h:3,name:stoneWall;block40=x:16,y:30,l:6,h:0,name:stoneWall;block41=x:13,y:29,l:3,h:0,name:stoneWall;block42=x:13,y:30,l:0,h:2,name:stoneWall;block43=x:25,y:29,l:0,h:3,name:stoneWall;block44=x:22,y:29,l:2,h:0,name:stoneWall;block45=x:15,y:31,l:8,h:5,name:concrete;block46=x:13,y:35,l:0,h:3,name:stoneWall;block47=x:16,y:37,l:6,h:0,name:stoneWall;block48=x:14,y:38,l:2,h:0,name:stoneWall;block49=x:22,y:38,l:3,h:0,name:stoneWall;block50=x:25,y:35,l:0,h:2,name:stoneWall;block51=x:15,y:31,l:8,h:5,name:concrete;block52=x:18,y:27,l:2,h:2,name:concrete;block53=x:18,y:22,l:8,h:4,name:concrete;block54=x:23,y:18,l:0,h:3,name:concrete;block55=x:29,y:14,l:0,h:7,name:concrete;block56=x:30,y:14,l:5,h:0,name:concrete;block57=x:35,y:15,l:0,h:6,name:concrete;block58=x:28,y:22,l:7,h:0,name:concrete;block59=x:30,y:18,l:4,h:0,name:concrete;block60=x:27,y:22,l:0,h:18,name:concrete;block61=x:26,y:41,l:2,h:1,name:concrete;block62=x:20,y:8,l:0,h:8,name:concrete;block63=x:13,y:17,l:15,h:0,name:concrete;block64=x:20,y:2,l:0,h:5,name:woodFloor;tile0=x:9,y:41,name:sandstone;tile1=x:12,y:36,name:sandstone;tile2=x:12,y:35,name:sandstone;tile3=x:35,y:38,name:sandstone;tile4=x:34,y:38,name:sandstone;tile5=x:37,y:36,name:sandstone;tile6=x:37,y:35,name:sandstone;tile7=x:40,y:41,name:sandstone;tile8=x:9,y:8,name:sandstone;tile9=x:12,y:14,name:sandstone;tile10=x:12,y:13,name:sandstone;tile11=x:14,y:11,name:sandstone;tile12=x:15,y:11,name:sandstone;tile13=x:35,y:11,name:sandstone;tile14=x:37,y:13,name:sandstone;tile15=x:37,y:14,name:sandstone;tile16=x:34,y:11,name:sandstone;tile17=x:24,y:31,name:concrete;tile18=x:24,y:30,name:concrete;tile19=x:23,y:30,name:concrete;tile20=x:15,y:30,name:concrete;tile21=x:14,y:30,name:concrete;tile22=x:14,y:31,name:concrete;tile23=x:23,y:37,name:concrete;tile24=x:24,y:37,name:concrete;tile25=x:24,y:36,name:concrete;tile26=x:14,y:36,name:concrete;tile27=x:14,y:37,name:concrete;tile28=x:15,y:37,name:concrete;tile29=x:19,y:30,name:fence;trans0=x:13,y:18,name:house;trans1=x:25,y:18,name:house;trans2=x:27,y:18,name:house;trans3=x:31,y:23,name:house;trans4=x:33,y:23,name:house;trans5=x:33,y:19,name:house;trans6=x:31,y:19,name:house;trans7=x:31,y:15,name:house;trans8=x:33,y:15,name:house;trans9=x:34,y:32,name:house;trans10=x:32,y:32,name:house;trans11=x:30,y:32,name:house;trans12=x:30,y:28,name:house;trans13=x:32,y:28,name:house;trans14=x:34,y:28,name:house;trans15=x:25,y:24,name:shop;trans16=x:21,y:24,name:bank;trans17=x:27,y:42,name:arena;",
	beach: "lvlName=Beach;fill=10;gridX=20;gridY=20;block0=x:16,y:0,l:3,h:19,name:water;block1=x:12,y:0,l:3,h:19,name:sandstone;block2=x:0,y:11,l:12,h:1,name:dirt;block3=x:14,y:16,l:1,h:3,name:water;block4=x:9,y:17,l:2,h:2,name:sandstone;block5=x:12,y:0,l:1,h:3,name:grass;block6=x:16,y:0,l:1,h:3,name:sandstone;block7=x:13,y:11,l:5,h:1,name:wood;block8=x:4,y:8,l:1,h:2,name:dirt;block9=x:0,y:5,l:2,h:1,name:dirt;block10=x:3,y:6,l:0,h:2,name:dirt;block11=x:2,y:7,l:2,h:0,name:dirt;tile0=x:8,y:19,name:sandstone;tile1=x:11,y:16,name:sandstone;tile2=x:10,y:16,name:sandstone;tile3=x:11,y:15,name:sandstone;tile4=x:18,y:0,name:sandstone;tile5=x:16,y:4,name:sandstone;tile6=x:16,y:5,name:sandstone;tile7=x:16,y:6,name:sandstone;tile8=x:15,y:15,name:water;tile9=x:15,y:14,name:water;tile10=x:13,y:19,name:water;tile11=x:13,y:18,name:water;tile12=x:12,y:19,name:water;tile13=x:12,y:5,name:grass;tile14=x:12,y:4,name:grass;tile15=x:14,y:0,name:grass;tile16=x:14,y:1,name:grass;tile17=x:6,y:13,name:grassHouse;tile18=x:8,y:13,name:grassHouse;func0=x:7,y:12,note:spawn;npc0=x:4,y:18,name:goblin;walk0=x:18,y:12,tf:false;walk1=x:18,y:11,tf:false;",
	home: "lvlName=Home;fill=0;gridX=7;gridY=6;row0=r:0,name:black;row1=r:1,name:stoneWall;row2=r:5,name:stoneWall;col0=c:6,name:stoneWall;col1=c:0,name:stoneWall;tile0=x:3,y:1,name:concrete;trans0=x:5,y:4,name:safe;func0=x:3,y:1,note:exit(15-15-Oakloft);",
	mazeDungeon: "lvlName=Dungeon;fill=0;gridX=35;gridY=25;row0=r:24,name:stoneWall;row1=r:23,name:stoneWall;row2=r:0,name:stoneWall;row3=r:1,name:stoneWall;row4=r:5,name:stoneWall;row5=r:7,name:stoneWall;row6=r:15,name:stoneWall;row7=r:17,name:stoneWall;row8=r:11,name:stoneWall;row9=r:9,name:stoneWall;col0=c:0,name:stoneWall;col1=c:34,name:stoneWall;col2=c:2,name:stoneWall;col3=c:12,name:stoneWall;col4=c:16,name:stoneWall;col5=c:32,name:stoneWall;col6=c:8,name:stoneWall;col7=c:6,name:stoneWall;col8=c:30,name:stoneWall;block0=x:24,y:19,l:9,h:0,name:stoneWall;block1=x:4,y:16,l:0,h:6,name:stoneWall;block2=x:10,y:19,l:0,h:3,name:stoneWall;block3=x:17,y:19,l:5,h:0,name:stoneWall;block4=x:20,y:20,l:6,h:1,name:stoneWall;block5=x:18,y:13,l:10,h:0,name:stoneWall;tile0=x:2,y:23,name:concrete;tile1=x:32,y:1,name:concrete;tile2=x:2,y:22,name:concrete;tile3=x:32,y:2,name:concrete;tile4=x:32,y:6,name:concrete;tile5=x:32,y:18,name:concrete;tile6=x:32,y:20,name:concrete;tile7=x:32,y:22,name:concrete;tile8=x:31,y:17,name:concrete;tile9=x:33,y:17,name:concrete;tile10=x:33,y:15,name:concrete;tile11=x:31,y:15,name:concrete;tile12=x:30,y:20,name:concrete;tile13=x:30,y:22,name:concrete;tile14=x:30,y:18,name:concrete;tile15=x:30,y:16,name:concrete;tile16=x:30,y:6,name:concrete;tile17=x:31,y:5,name:concrete;tile18=x:33,y:5,name:concrete;tile19=x:17,y:5,name:concrete;tile20=x:13,y:5,name:concrete;tile21=x:15,y:5,name:concrete;tile22=x:1,y:5,name:concrete;tile23=x:3,y:5,name:concrete;tile24=x:2,y:6,name:concrete;tile25=x:6,y:2,name:concrete;tile26=x:6,y:4,name:concrete;tile27=x:8,y:2,name:concrete;tile28=x:1,y:17,name:concrete;tile29=x:1,y:15,name:concrete;tile30=x:1,y:11,name:concrete;tile31=x:2,y:10,name:concrete;tile32=x:5,y:11,name:concrete;tile33=x:5,y:9,name:concrete;tile34=x:2,y:8,name:concrete;tile35=x:1,y:7,name:concrete;tile36=x:6,y:6,name:concrete;tile37=x:8,y:6,name:concrete;tile38=x:7,y:9,name:concrete;tile39=x:8,y:8,name:concrete;tile40=x:7,y:11,name:concrete;tile41=x:6,y:14,name:concrete;tile42=x:8,y:14,name:concrete;tile43=x:3,y:15,name:concrete;tile44=x:3,y:17,name:concrete;tile45=x:6,y:16,name:concrete;tile46=x:12,y:20,name:concrete;tile47=x:7,y:17,name:concrete;tile48=x:5,y:17,name:concrete;tile49=x:17,y:15,name:concrete;tile50=x:23,y:11,name:concrete;tile51=x:29,y:11,name:concrete;tile52=x:31,y:11,name:concrete;tile53=x:31,y:9,name:concrete;tile54=x:31,y:7,name:concrete;tile55=x:29,y:9,name:concrete;tile56=x:25,y:9,name:concrete;tile57=x:23,y:9,name:concrete;tile58=x:13,y:9,name:concrete;tile59=x:11,y:9,name:concrete;tile60=x:11,y:7,name:concrete;tile61=x:13,y:7,name:concrete;tile62=x:15,y:7,name:concrete;tile63=x:16,y:10,name:concrete;tile64=x:16,y:8,name:concrete;tile65=x:13,y:15,name:concrete;tile66=x:15,y:15,name:concrete;tile67=x:13,y:17,name:concrete;tile68=x:11,y:17,name:concrete;tile69=x:9,y:17,name:concrete;tile70=x:16,y:20,name:concrete;tile71=x:16,y:22,name:concrete;tile72=x:12,y:2,name:concrete;tile73=x:11,y:15,name:concrete;tile74=x:9,y:15,name:concrete;tile75=x:31,y:21,name:stoneWall;tile76=x:29,y:21,name:stoneWall;tile77=x:28,y:22,name:stoneWall;tile78=x:28,y:21,name:stoneWall;tile79=x:13,y:19,name:stoneWall;tile80=x:14,y:19,name:stoneWall;tile81=x:14,y:20,name:stoneWall;tile82=x:14,y:21,name:stoneWall;tile83=x:15,y:21,name:stoneWall;tile84=x:17,y:21,name:stoneWall;tile85=x:18,y:21,name:stoneWall;tile86=x:13,y:3,name:stoneWall;tile87=x:14,y:3,name:stoneWall;tile88=x:14,y:4,name:stoneWall;tile89=x:14,y:8,name:stoneWall;tile90=x:4,y:4,name:stoneWall;tile91=x:4,y:3,name:stoneWall;tile92=x:5,y:3,name:stoneWall;tile93=x:1,y:21,name:stoneWall;tile94=x:25,y:20,name:concrete;tile95=x:24,y:20,name:concrete;tile96=x:23,y:20,name:concrete;tile97=x:22,y:20,name:concrete;tile98=x:21,y:20,name:concrete;tile99=x:25,y:13,name:concrete;tile100=x:24,y:12,name:stoneWall;tile101=x:28,y:12,name:stoneWall;tile102=x:18,y:14,name:stoneWall;tile103=x:14,y:13,name:stoneWall;tile104=x:14,y:14,name:stoneWall;tile105=x:14,y:16,name:stoneWall;tile106=x:33,y:13,name:stoneWall;tile107=x:33,y:3,name:stoneWall;tile108=x:28,y:3,name:stoneWall;tile109=x:28,y:2,name:stoneWall;tile110=x:26,y:3,name:stoneWall;tile111=x:26,y:4,name:stoneWall;tile112=x:24,y:2,name:stoneWall;tile113=x:24,y:3,name:stoneWall;tile114=x:22,y:4,name:stoneWall;tile115=x:22,y:3,name:stoneWall;tile116=x:20,y:2,name:stoneWall;tile117=x:20,y:3,name:stoneWall;tile118=x:18,y:3,name:stoneWall;tile119=x:18,y:4,name:stoneWall;tile120=x:10,y:3,name:stoneWall;tile121=x:10,y:2,name:stoneWall;tile122=x:9,y:13,name:stoneWall;tile123=x:10,y:13,name:stoneWall;tile124=x:10,y:14,name:stoneWall;tile125=x:10,y:16,name:stoneWall;tile126=x:10,y:18,name:stoneWall;tile127=x:24,y:8,name:stoneWall;tile128=x:26,y:8,name:stoneWall;tile129=x:22,y:10,name:stoneWall;tile130=x:10,y:10,name:stoneWall;tile131=x:8,y:22,name:concrete;tile132=x:9,y:11,name:concrete;tile133=x:33,y:11,name:concrete;tile134=x:33,y:9,name:concrete;tile135=x:33,y:7,name:concrete;tile136=x:5,y:13,name:stoneWall;tile137=x:4,y:13,name:stoneWall;tile138=x:3,y:13,name:stoneWall;func0=x:2,y:23,note:victory;func1=x:32,y:1,note:spawn;",
	tournamentArena: "lvlName=Tournament Arena;fill=7;gridX=16;gridY=18;row0=r:0,name:black;row1=r:17,name:black;row2=r:1,name:concreteWall;row3=r:16,name:concreteWall;col0=c:0,name:concreteWall;col1=c:15,name:concreteWall;block0=x:1,y:2,l:3,h:0,name:woodFloor;block1=x:5,y:2,l:9,h:1,name:woodFloor;block2=x:5,y:4,l:8,h:0,name:concreteWall;block3=x:4,y:3,l:0,h:12,name:woodWall;block4=x:2,y:3,l:0,h:12,name:woodWall;block5=x:3,y:3,l:0,h:12,name:woodFloor;block6=x:1,y:3,l:0,h:12,name:woodFloor;block7=x:14,y:9,l:0,h:2,name:wood;block8=x:6,y:6,l:6,h:7,name:pebbles;block9=x:6,y:14,l:6,h:0,name:wood;tile0=x:5,y:3,name:concreteWall;tile1=x:9,y:1,name:sandstone;tile2=x:13,y:3,name:concreteWall;tile3=x:9,y:11,name:dirt;tile4=x:9,y:9,name:dirt;func0=x:9,y:1,note:spawn;npc0=x:6,y:14,name:Donkey Kong_<;npc1=x:7,y:14,name:Charizard_<;npc2=x:8,y:14,name:Obi Wan Shinobi_<;npc3=x:9,y:14,name:Ganondorf_<;npc4=x:10,y:14,name:Link_<;npc5=x:11,y:14,name:Tanjiro_<;npc6=x:12,y:14,name:Ulfric Stormcloak_<;",
}
world.oakloft = {
	name: "Oakloft",
	array: [],
	startPos: [20,14],
	lastPos: [20,14],
	npcArray: [],
	load: function() {
		state.saveFile = world.saveFile.oakloft;
		state.load();
		player.currentWorld = 0;
		world.setFuncs(world.oakloft);
	},
	funcs: [
		function() {
			world.current.array[25][23][0].runScript = true;
			world.current.array[25][23][1] = function() {currentShop = townShop; world.shop("shop","Press 'E' to check the Town Shop.")}
		},
		function() {
			world.current.array[21][23][0].runScript = true;
			world.current.array[21][23][1] = function() {currentShop = townBank; world.shop("bank","Press 'E' to check the Town Bank.")}
		},
		function() {
			world.current.array[25][17][0].runScript = true;
			world.current.array[25][17][1] = function() {world.enter(world.home,"Press 'E' to enter.");}
		},
		function() {
			for (let i=0; i<2; i+=1) {
				var e = npc.goblin();
				e.spawnOffset = [rng(90),rng(90)];
				e.position = [20,20]
				e.level = enemy.lvlLessThan();
				world.current.npcArray.push(e);
			}
			world.current.npcArray[0].position = [15,15];
			world.current.npcArray[1].position = [15,17];
			
			var g = npc.guard();
			g.spawnOffset = [0,20];
			g.posOffset = g.spawnOffset;
			g.spawnPos = [6,22]
			g.position = g.spawnPos;
			world.current.npcArray.push(g);
			
			g = npc.guardArena();
			g.spawnOffset = [0,20];
			g.posOffset = g.spawnOffset;
			g.spawnPos = [21,38]
			g.position = g.spawnPos;
			world.current.npcArray.push(g);
			
			g = npc.steward();
			g.spawnOffset = [0,20];
			g.posOffset = g.spawnOffset;
			g.spawnPos = [6,26]
			g.position = g.spawnPos;
			world.current.npcArray.push(g);
		},
		function() {
			world.current.array[27][41][0].runScript = true;
			world.current.array[27][41][1] = function() {world.enter(world.tournamentArena,"Press 'E' to enter.");}
		}
	],
};
world.home = {
	name: "Home",
	array: [],
	startPos: [-2,0],
	lastPos: [-2,0],
	npcArray: [],
	load: function() {
		state.saveFile = world.saveFile.home;
		state.load();
		player.currentWorld = 1;
		world.setFuncs(world.home);
	},
	funcs: [
		function() {
			world.current.array[3][1][0].runScript = true;
			world.current.array[3][1][1] = function() {world.enter(world.oakloft,"Press 'E' to exit."); }
		},
		function() {
			world.current.array[5][4][0].runScript = true;
			world.current.array[5][4][1] = function() {currentShop = homeInventory; world.shop("bank","Press 'E' to open inventory chest.")}
		}
	]
};
world.tournamentArena = {
	name: "Tournament Arena",
	array: [],
	startPos: [9,1],
	lastPos: [],
	npcArray: [],
	load: function() {
		state.saveFile = world.saveFile.tournamentArena;
		state.load();
		player.currentWorld = 2;
		world.setFuncs(world.tournamentArena);
	},
	funcs: [
		function() {
			world.current.array[9][1][0].runScript = true;
			world.current.array[9][1][1] = function() {world.enter(world.oakloft,"Press 'E' to return to Oakloft.");}
		},
		function() {
			for (let i=0; i<world.current.npcArray.length; i+=1) {
				world.current.npcArray[i].script = function() {};
			}
			var g = npc.guardArena();
			g.spawnOffset = [20,20];
			g.posOffset = g.spawnOffset;
			g.spawnPos = [-7,-5]
			g.position = g.spawnPos;
			if (quests.findProgress(1) < 4) {
				g.position = [-6,-4]
				g.script = function() {
					if (display.message.speaking === false) {
						display.message.set("Press \"E\" to speak.")
						buttons.keys[4] = npc.guard.d8;
					}
				}
			} else {
				world.current.array[4][2][0].canWalk = false;
				g.script = function() {
					if (this.spoken !== true) {
						this.spoken = true;
						npc.guardArena.d4();
					}
				}
			}
			world.current.npcArray.push(g);
			
			g = npc.oakloftKing();
			g.spawnOffset = [-20,19];
			g.posOffset = g.spawnOffset;
			g.spawnPos = [2,3]
			g.position = g.spawnPos;
			world.current.npcArray.push(g);

			g = npc.steward();
			g.spawnOffset = [-20,20];
			g.posOffset = g.spawnOffset;
			g.spawnPos = [2,4]
			g.position = g.spawnPos;
			world.current.npcArray.push(g);
			
			var a = npc.guardArena();
			a.spawnOffset = [-40,90];
			a.posOffset = a.spawnOffset;
			a.spawnPos = [1,-5]
			a.position = a.spawnPos;
			world.current.npcArray.push(a);
		},
		function() {
			if (quests.findProgress(1) === false || quests.findProgress(1) < 1 || quests.findProgress(1) > 3) {
				world.current.array[14][2][0].canWalk = false;
			} else {world.current.array[14][2][0].canWalk = true;}
		},
		function() {
			world.current.array[14][3][0].runScript = true;
			world.current.array[14][4][0].runScript = true;
			world.current.array[14][5][0].runScript = true;
			world.current.array[14][6][0].runScript = true;
			world.current.array[13][5][0].runScript = true;
			world.current.array[13][6][0].runScript = true;
			world.current.array[14][3][1] = function() {display.message.prompt("Fighters, please take your position.");}
			world.current.array[14][4][1] = function() {display.message.prompt("Fighters, please take your position.");}
			world.current.array[14][5][1] = function() {display.message.prompt("Fighters, please take your position.");}
			world.current.array[14][6][1] = function() {display.message.prompt("Fighters, please take your position.");}
			world.current.array[13][5][1] = function() {display.message.prompt("Fighters, please take your position.");}
			world.current.array[13][6][1] = function() {display.message.prompt("Fighters, please take your position.");}
		},
		function() {
			world.current.array[9][9][0].runScript = true;
			world.current.array[9][9][1] = function() {
				if (world.current.start !== true) {
					world.current.start = true;
					display.message.enterDialog();
					buttonReset();
					npc.move.to(world.current.npcArray[8],9,10);
					setTimeout(npc.oakloftKing.d2,3000);
				}
			}
		},
		function() {}
	]
}
world.mazeDungeon = {
	name: "Maze Dungeon",
	array: [],
	startPos: [2,2],
	lastPos: [2,2],
	npcArray: [],
	load: function() {
		state.saveFile = world.saveFile.tournamentArena;
		state.load();
		player.currentWorld = 3;
		world.setFuncs(world.mazeDungeon);
	},
	funcs: [
		
	]
};
world.array = [world.oakloft,world.home,world.tournamentArena,world.mazeDungeon];

var state = new Object();
state.lvlName = "";
state.array = [];				//	[	x, y, tile name		]
state.tileFuncs = [];			//	[	x, y, func notes	]
state.canWalk = [];				//	[	x, y, canWalk		]
state.npc = [];					//	[	x, y, npc			]
state.rows = [];
state.cols = [];
state.blocks = [];
state.trans = [];
state.fill = 0;
state.saveFile = "";
state.testWorld = function() {
	state.saveFile = window.prompt("Enter the level save file code. ");
	state.isTest = true;
	player = playerChar();
	state.load();
	game.loop();
	player.position = world.current.lastPos;
	player.health = player.hitPoints;
	player.manna = player.mannaMax;
	player.armorClass = player.defense;
	display.char();
	document.getElementById("start").style = "display: none;"
	display.loadStats(); 
}
state.isTest = false;
state.reset = function() {
	state.lvlName = "";
	state.array = [];
	state.tileFuncs = [];
	state.canWalk = [];
	state.npc = [];
	state.rows = [];
	state.cols = [];
	state.blocks = [];
	state.trans = [];
	state.fill = 0;
	state.X = 0;
	state.Y = 0;
}
state.load = function() {
	state.reset();
	var sav = state.saveFile.split(";");
	for (let i=0; i<sav.length; i+=1) {
		var keyVal = sav[i].split("=");
		if (/^tile/.test(keyVal[0])) {
			var tileData = keyVal[1].split(",");
			var arr = [];
			arr.push(parseInt(tileData[0].split(":")[1]));
			arr.push(parseInt(tileData[1].split(":")[1]));
			arr.push(tileData[2].split(":")[1]);
			state.array.push(arr);
		} else if (/^block/.test(keyVal[0])) {
			var blockData = keyVal[1].split(",");
			var arr = [];
			arr.push(parseInt(blockData[0].split(":")[1]));
			arr.push(parseInt(blockData[1].split(":")[1]));
			arr.push(parseInt(blockData[2].split(":")[1]));
			arr.push(parseInt(blockData[3].split(":")[1]));
			arr.push(blockData[4].split(":")[1]);
			state.blocks.push(arr);
		} else if (/^trans/.test(keyVal[0])) {
			var transData = keyVal[1].split(",");
			var arr = [];
			arr.push(parseInt(transData[0].split(":")[1]));
			arr.push(parseInt(transData[1].split(":")[1]));
			arr.push(transData[2].split(":")[1]);
			state.trans.push(arr);
		} else if (/^row/.test(keyVal[0])) {
			var rowData = keyVal[1].split(",");
			state.rows.push([parseInt(rowData[0].split(":")[1]),rowData[1].split(":")[1]]);
		} else if (/^col/.test(keyVal[0])) {
			var colData = keyVal[1].split(",");
			state.cols.push([parseInt(colData[0].split(":")[1]),colData[1].split(":")[1]]);
		} else if (/^func/.test(keyVal[0])) {
			var funcData = keyVal[1].split(",");
			var arr = [];
			arr.push(parseInt(funcData[0].split(":")[1]));
			arr.push(parseInt(funcData[1].split(":")[1]));
			arr.push(funcData[2].split(":")[1]);
			state.tileFuncs.push(arr);
		} else if (/^walk/.test(keyVal[0])) {
			var walkData = keyVal[1].split(",");
			var arr = [];
			arr.push(parseInt(walkData[0].split(":")[1]));
			arr.push(parseInt(walkData[1].split(":")[1]));
			if (walkData[2].split(":")[1] === "true") {
				arr.push(true);
			} else {arr.push(false);}
			state.canWalk.push(arr);
		} else if (/^npc/.test(keyVal[0])) {
			var npcData = keyVal[1].split(",");
			var arr = [];
			arr.push(parseInt(npcData[0].split(":")[1]));
			arr.push(parseInt(npcData[1].split(":")[1]));
			arr.push(npcData[2].split(":")[1]);
			state.npc.push(arr);
		} else if (keyVal[0] === "fill") {
			state.fill = parseInt(keyVal[1]);
		} else if (keyVal[0] === "gridX") {
			state.X = parseInt(keyVal[1]);
		} else if (keyVal[0] === "gridY") {
			state.Y = parseInt(keyVal[1]);
		} else if (keyVal[0] === "lvlName") {
			state.lvlName = keyVal[1];
		}
	}
	state.saveFile = "";
	state.draw();
}
state.draw = function() {
	var w;
	if (state.isTest === false) {
		w = world.array[world.nameCheck(state.lvlName)];
		player.position = w.lastPos;
	} else {w = world.create();}
	for (let x=0; x<state.X; x+=1) {
		w.array[x] = [];
		for (let y=0; y<state.Y; y+=1) {
			w.array[x][y] = [];
			w.array[x][y][0] = tiles.array[state.fill]();
		}
	}
	for (let i=0; i<state.cols.length; i+=1) {
		for (y=0; y<state.Y; y+=1) {
			w.array[state.cols[i][0]][y][0] = tiles.nameCheck(state.cols[i][1]);
		}
	}
	for (let i=0; i<state.rows.length; i+=1) {
		for (x=0; x<state.X; x+=1) {
			w.array[x][state.rows[i][0]][0] = tiles.nameCheck(state.rows[i][1]);
		}
	}
	for (let i=0; i<state.blocks.length; i+=1) {
		var X = parseInt(state.blocks[i][0]);
		var Y = parseInt(state.blocks[i][1]);
		var L = parseInt(state.blocks[i][2]);
		var H = parseInt(state.blocks[i][3]);
		for (let x=0; x<=L; x+=1) {
			for (let y=0; y<=H; y+=1) {
				w.array[x+X][y+Y][0] = tiles.nameCheck(state.blocks[i][4]);
			}
		}
	}
	for (let i=0; i<state.array.length; i+=1) {
		var x = parseInt(state.array[i][0]);
		var y = parseInt(state.array[i][1]);
		w.array[x][y][0] = tiles.nameCheck(state.array[i][2]);
	}
	for (let i=0; i<state.npc.length; i+=1) {
		var x = parseInt(state.npc[i][0]);
		var y = parseInt(state.npc[i][1]);
		var name, lvl, tmp, split;
		for (let j=0; j<npc.array.length; j+=1) {
			tmp = npc.array[j]();
			if (/_/.test(state.npc[i][2]) === true) {
				name = state.npc[i][2].split("_")[0];
				split = true;
			} else {
				name = state.npc[i][2];
				tmp.level = enemy.lvlLessThan();
			}
			if (tmp.name === name) {
				if (split === true) {
					lvl = state.npc[i][2].split("_")[1];
					if (lvl === "<") {
						tmp.level = enemy.lvlLessThan();
					} else if (lvl === ">") {
						tmp.level = enemy.lvlGreaterThan();
					} else if (lvl === "^") {
						tmp.level = enemy.lvlRange();
					} else if ((lvl-1).toString() !== "NaN") {
						tmp.level = parseInt(lvl);
					} else {alert("level error on enemy load: name:"+name+" npc.array:"+i)}
				}
				tmp.position = [x-11,y-7];
				tmp.spawnPos = [x-11,y-7];
				tmp.posOffset = [rng(90),rng(90)];
				w.npcArray.push(tmp);
				break
			}
		}
		delete name, lvl, tmp, split;
	}
	for (let i=0; i<state.tileFuncs.length; i+=1) {
		var x = state.tileFuncs[i][0];
		var y = state.tileFuncs[i][1];
		xPos = state.tileFuncs[i][0]-5;
		yPos = state.tileFuncs[i][1]-3;
		if (state.tileFuncs[i][2] === "spawn") {
			if (w.lastPos.length !== 2) {
				w.lastPos = [xPos,yPos];
			}
			player.position = w.lastPos;
			tiles.offset = [50,50];
		} else if (state.tileFuncs[i][2] === "victory") {
			w.array[x][y][0].runScript = true;
			w.array[x][y][1] = func;
			world.victory = false;
			function func() {
				if (world.victory === false) {
					alert("You Solved the maze!!");
					world.victory = true;
					fillArray(buttons.isPressed,12,false);
				}
			}
		}
	}
	for (let i=0; i<state.trans.length; i+=1) {
		var x = parseInt(state.trans[i][0]);
		var y = parseInt(state.trans[i][1]);
		w.array[x][y][2] = trans.nameCheck(state.trans[i][2]);
		w.array[x][y][0].canWalk = w.array[x][y][2].canWalk;
	}
	for (let i=0; i<state.canWalk.length; i+=1) {
		var x = state.canWalk[i][0];
		var y = state.canWalk[i][1];
		w.array[x][y][0].canWalk = state.canWalk[i][2];
	}
	world.current = w;
	world.draw();
	state.reset();
	state.saveFile = "";
}

var items = new Object();
	items.potion = function(target, itemNum, statString, str, spellName) {
		var stat, statMax, statType, old, name;
		if (statString === "health") {stat = target.health; old = target.health; statMax = target.hitPoints; statType = "health";}
		else if (statString === "manna") {stat = target.manna; old = target.manna; statMax = target.mannaMax; statType = "manna";}
		if (target === player) {
			if (spellName === 0) {
				name = "You used a "+statType+" potion and"
			} else {name = "You cast a "+spellName+" spell and"}
		} else {
			if (spellName === 0) {
				name = combat.opponent.name+" used a "+statType+" potion and"
			} else {name = combat.opponent.name+" cast a "+spellName+" spell and"}
		}
		function boostStat(stat, statMax, statType, str) {
			var roll = rng(8) + 5;
			if (str === 0) {
				stat += roll;
			} else if (str === 1) {
				stat += 2*roll;
			} else if (str === 2) {
				stat += 4*roll;
			} else if (str === 3) {
				stat += 8*roll;
			}
			if (spellName !== 0) {
				if (str === 0) {
					if (spells.testManna(target, 10) !== false) {target.manna -= 10;}
				} else if (str === 1) {
					if (spells.testManna(target, 20) !== false) {target.manna -= 20;}
				} else if (str === 2) {
					if (spells.testManna(target, 30) !== false) {target.manna -= 30;}
				} else if (str === 3) {
					if (spells.testManna(target, 40) !== false) {target.manna -= 40;}
				}
			}
			if (stat > statMax){stat = statMax;}
			return stat;
		}
		if (statString === "health") {
			if (stat === statMax) {
				if (combat.active === true) {
					goBack("You're already at full " + statType + ".");
					buttonVarArray[0] = combat.displayAttacks;
				} else {
					display.message.prompt("You're already at full " + statType + ".");
				}
				display.loadInventory();
				itemSet(items.use);
				return;
			} else {
				target.health = boostStat(stat, statMax, statType, str);
				if (combat.active === true) {
					goBack(name+" gained "+(target.health-old)+" health points.");
				} else {
					display.message.prompt(name+" gained "+(target.health-old)+" health points.");
				}
				display.char();
			}
		} else if (statString === "manna") {
			if (stat === statMax) {
				if (combat.active === true) {
					goBack("You're already at full " + statType + ".");
					buttonVarArray[0] = combat.displayAttacks;
				} else {
					display.message.prompt("You're already at full " + statType + ".");
				}
				display.loadInventory();
				itemSet(items.use);
				return;
			} else {
				target.manna = boostStat(stat, statMax, statType, str);
				if (combat.active === true) {
					goBack(name+" gained "+(target.manna-old)+" manna points.");
				} else {
					display.message.prompt(name+" gained "+(target.manna-old)+" manna points.");
				}	
				display.char();
			}
		}
		display.char();
		if (spellName === 0) {items.useUp(target, itemNum);}
		display.loadInventory();
		itemSet(items.use);
	}
	
items.weakPotion = {
	name: "Weak Potion",
	use: function(target, itemNum) {items.potion(target, itemNum, "health", 0, 0);},
	info: "restores 6-13 health points",
	value: 20,
	max: 20
}
items.mediumPotion = {
	name: "Medium Potion",
	use: function(target, itemNum) {items.potion(target, itemNum, "health", 1, 0);},
	info: "restores 12-26 health points",
	value: 40,
	max: 20

}
items.strongPotion = {
	name: "Strong Potion",
	use: function(target, itemNum) {items.potion(target, itemNum, "health", 2, 0);},
	info: "restores 24-52 health points",
	value: 60,
	max: 20
}
items.veryStrongPotion = {
	name: "Very Strong Potion",
	use: function(target, itemNum) {items.potion(target, itemNum, "health", 3, 0);},
	info: "restores 48-104 health points",
	value: 80,
	max: 20
}
items.weakMannaPotion = {
	name: "Weak Manna Potion",
	use: function(target, itemNum) {items.potion(target, itemNum, "manna", 0, 0);},
	info: "restores 6-13 manna points",
	value: 20,
	max: 20
}
items.mediumMannaPotion = {
	name: "Medium Manna Potion",
	use: function(target, itemNum) {items.potion(target, itemNum, "manna", 1, 0);},
	info: "restores 12-26 manna points",
	value: 40,
	max: 20
}
items.strongMannaPotion = {
	name: "Strong Manna Potion",
	use: function(target, itemNum) {items.potion(target, itemNum, "manna", 2, 0);},
	info: "restores 24-52 manna points",
	value: 60,
	max: 20
}
items.veryStrongMannaPotion = {
	name: "Very Strong Manna Potion",
	use: function(target, itemNum) {items.potion(target, itemNum, "manna", 3, 0);},
	info: "restores 48-104 manna points",
	value: 80,
	max: 20
}
items.spellBookFireBall = {
	name: "Spell Book (Fire Ball)",
	use: function(target, itemNum) {items.spellBook(player.spellsAttack, spells.attack.fireball, itemNum);},
	info: "teaches the spell Fireball",
	value: 30,
	max: 5
}
items.spellBookLightningBolt = {
	name: "Spell Book (Lightning Bolt)",
	use: function(target, itemNum) {items.spellBook(player.spellsAttack, spells.attack.lightningBolt, itemNum);},
	info: "teaches the spell Lightning Bolt", 
	value: 40,
	max: 5
}
items.spellBookGust = {
	name: "Spell Book (Gust)", 
	use: function(target, itemNum) {items.spellBook(player.spellsAttack, spells.attack.gust, itemNum);},
	info: "teaches the spell Gust",
	value: 20,
	max: 5
}
items.spellBookFrost = {
	name: "Spell Book (Frost Beam)",
	use: function(target, itemNum) {items.spellBook(player.spellsAttack, spells.attack.frostBeam, itemNum);},
	info: "teaches the spell Frost Beam",
	value: 30,
	max: 5
}
items.spellBookBlizzard = {
	name: "Spell Book (Blizzard)",
	use: function(target, itemNum) {items.spellBook(player.spellsAttack, spells.attack.blizzard, itemNum);},
	info: "teaches the spell Blizzard",
	value: 60,
	max: 5
}
items.spellBookHurricane = {
	name: "Spell Book (Hurricane)",
	use: function(target, itemNum) {items.spellBook(player.spellsAttack, spells.attack.hurricane, itemNum);},
	info: "teaches the spell Hurricane",
	value: 50,
	max: 5
}
items.spellBookSunBurst = {
	name: "Spell Book (Sun Burst)", 
	use: function(target, itemNum) {items.spellBook(player.spellsAttack, spells.attack.sunBurst, itemNum);},
	info: "teaches the spell Sun Burst",
	value: 60,
	max: 5
}
items.spellBookInferno = {
	name: "Spell Book (Inferno)",
	use: function(target, itemNum) {items.spellBook(player.spellsAttack, spells.attack.inferno, itemNum);},
	info: "teaches the spell Inferno", 
	value: 75,
	max: 5
}
items.spellBookDeathRay = {
	name: "Spell Book (Death Ray)", 
	use: function(target, itemNum) {items.spellBook(player.spellsAttack, spells.attack.deathRay, itemNum);},
	info: "teaches the spell Death Ray", 
	value: 60,
	max: 5
}
items.spellBookPoisonSlash = {
	name: "Spell Book (Poison Slash)",
	use: function(target, itemNum) {items.spellBook(player.spellsAttack, spells.attack.poisonSlash, itemNum);},
	info: "teaches the spell Poison Slash",
	value: 60,
	max: 5
}
items.spellBookEntangle = {
	name: "Spell Book (Entangle)",
	use: function(target, itemNum) {items.spellBook(player.spellsAttack, spells.attack.entangle, itemNum);},
	info: "teaches the spell Engangle", 
	value: 50,
	max: 5
}
items.spellBookWeakHealing = {
	name: "Spell Book (Weak Healing)",
	use: function(target, itemNum) {items.spellBook(player.spells, spells.weakHealing, itemNum);},
	info: "teaches the spell Weak Healing",
	value: 40,
	max: 5
}
items.spellBookMediumHealing = {
	name: "Spell Book (Medium Healing)",
	use: function(target, itemNum) {items.spellBook(player.spells, spells.mediumHealing, itemNum);},
	info: "teaches the spell Medium Healing",
	value: 60,
	max: 5
}
items.spellBookStrongHealing = {
	name: "Spell Book (Strong Healing)",
	use: function(target, itemNum) {items.spellBook(player.spells, spells.strongHealing, itemNum);},
	info: "teaches the spell Strong Healing",
	value: 80,
	max: 5
}
items.spellBookVeryStrongHealing = {
	name: "Spell Book (Very Strong Healing)",
	use: function(target, itemNum) {items.spellBook(player.spells, spells.veryStrongHealing, itemNum);},
	info: "teaches the spell Very Strong Healing",
	value: 100,
	max: 5
}
items.spellBookBullStrength = {
	name: "Spell Book (Bull Strength)",
	use: function(target, itemNum) {items.spellBook(player.spells, spells.bullStrength, itemNum);},
	info: "teaches the spell Bull Strength",
	value: 50,
	max: 5
}
items.spellBookFocus = {
	name: "Spell Book (Focus)", 
	use: function(target, itemNum) {items.spellBook(player.spells, spells.focus, itemNum);},
	info: "teaches the spell Focus",
	value: 50,
	max: 5
}
items.spellBookConcentration = {
	name: "Spell Book (Concentration)", 
	use: function(target, itemNum) {items.spellBook(player.spells, spells.concentration, itemNum);},
	info: "teaches the spell Concentration", 
	value: 50,
	max: 5
}
items.spellBookMageArmor = {
	name: "Spell Book (Mage Armor)", 
	use: function(target, itemNum) {items.spellBook(player.spells, spells.mageArmor, itemNum);},
	info: "teaches the spell Mage Armor",
	value: 50,
	max: 5
}
items.spellBookRestoration = {
	name: "Spell Book (Restoration)", 
	use: function(target, itemNum) {items.spellBook(player.spells, spells.restoration, itemNum);},
	info: "teaches the spell Restoration",
	value: 50,
	max: 5
}
items.potionOfRestoration = {
	name: "Potion Of Restoration",
	use: function(target, itemNum) {
		if (target.status.length === 0) {
			if (combat.active === true) {
				goBack("You do not need to be restored. ");
				buttonVarArray[0] = combat.displayEffectSpells;
			} else {
				display.message.prompt("You do not need to be restored. ");
			}
		} else {
			target.status = []
			target.statusRounds = []
			if (combat.active === true) {
				goBack("You have been restored. ");
			} else {display.message.prompt("You have been restored. ");}
			display.char();
			if (itemNum !== "spell") {items.useUp(target, itemNum);}
			if (combat.active === true) {if (target === player) {combat.turns[0] = true;} else {combat.turns[1] = true;}}
		}
	},
	info: "cures any status effects",
	value: 40,
	max: 20
}
items.spellBook = function(arr, spellObj, itemNum) {
	if (items.combatCancel()) {return;}
	if (checkForSpell() !== true) {
		display.message.prompt("You just learned the "+spellObj.name+" spell. The Spell Book has burned up. ");
		addStuff(arr, 0, 0, spellObj, "spell");
		items.useUp(player, itemNum);
		display.loadInventory();
		itemSet(items.use);
	}
	function checkForSpell() {
		for (i=0.; i<24; i+=1) {
			if (arr[i] === spellObj) {
				display.message.prompt("You already learned the "+spellObj.name+" spell.");
				return true;
			}
		}
	}
}	
items.fatsosPurse = {
	name: "Fatso's Purse",
	use: function() {
		if (items.combatCancel()) {return;}
		display.message.prompt("You open Fatso's purse and find 150 gold coins. ")
		player.gold += 150;
		removeStuff(player.items, player.itemsQuantity, checkForStuff(player.items, items.fatsosPurse), "item");
		display.char();
		display.loadInventory();
	},
	info: "A coin bag you stole from Fatso. It probably has gold coins in it.",
	value: 0,
	max: 5
}
items.commonHerbs = {
	name: "Common Herbs", 
	use: function(){},
	info: "A jar of common herbs.", 
	value: 3,
	max: 10
}
items.modRareHerbs = {
	name: "Moderately Rare Herbs",
	use: function(){},
	info: "A jar of somewhat rare herbs.", 
	value: 10,
	max: 10
}
items.rareHerbs = {
	name: "Very Rare Spices",
	use: function(){},
	info: "A jar of extremely rare spices spices.",
	value: 25,
	max: 10
}
items.cayenne = {
	name: "Cayenne Pepper",
	use: function(){},
	info: "A jar of cayenne pepper.", 
	value: 25,
	max: 10
}
items.emptyJar = {
	name: "Empty Jar",
	use: function(){},
	info: "An empty jar.",
	value: 1,
	max: 10
}
items.burnOintment = {
	name: "Jar of Burn Ointment", 
	use: function(target, itemNum) {
		if (checkForStuff(player.status, "burned") !== false) {
			if (combat.active === true) {
				goBack("Your burns have been healed.");
			} else {display.message.prompt("Your burns have been healed.");};
			combat.removeStatus(player, "burned")
			removeStuff(player.items, player.itemsQuantity, checkForStuff(player.items, items.burnOintment), "item");
			display.char();
			display.loadInventory();
		} else {
			if (combat.active === true) {
				goBack("There's no reason for you to use this right now.");
			} else {
				display.message.prompt("There's no reason for you to use this right now.");
			}
		}
	},
	info: "A jar of burn ointment. Cures burn status. This is Fatso's special blend. You probably should not sell this at a regular store.", 
	value: 0,
	max: 10
}
items.rareWine = {
	name: "Rare Wine",
	use: function(target, itemNum) {
		if (items.combatCancel()) {return;}
		display.message.prompt("You drink the wine ")
		if (rng(20) > 15) {
			document.getElementById("message").innerHTML += "and get a little drunk."
			combat.boostTempStat(0, -3, 5, 1);
			combat.boostTempStat(0, -3, 5, 2);
		} else {document.getElementById("message").innerHTML += "and handle it pretty well. "}
		removeStuff(player.items, player.itemsQuantity, checkForStuff(player.items, items.rareWine), "item");
	},
	info: "A rare bottle of vintage wine. It is very rare, and it is likely that no one in town but Fatso has it. You probably should not sell this at a regular store.",
	value: 0,
	max: 5
}
items.tapestry = {
	name: "Tapestry", 
	use: function(){},
	info: "A finely woven tapestry. It was obviously stolen from Fatso. You probably should not sell this at a regular store.", 
	value: 0,
	max: 2
}
items.hookah = {
	name: "Hookah",
	use: function(){},
	info: "A rusty and well used hookah.", 
	value: 15,
	max: 5
}
items.goldKey = {
	name: "Gold Key",
	use: function(){},
	info: "A golden key engraved with Fatso's monogram. You probably should not sell this at a regular store.",
	value: 0,
	max: 15
}
items.pillow = {
	name:"Pillow", 
	use: function(){},
	info: "A fancy silk pillow.",
	value: 25,
	max: 5
}
items.teaService = {
	name: "Porcelain Tea Service",
	use: function(){},
	info: "A porcelain tea service including a teapot, four cups, four saucers, and a porcelain sugar jar. ", 
	value: 100,
	max: 3
}
items.brokenTeaService = {
	name: "Tea Service (broken)",
	use: function(){},
	info: "This tea service has been smashed to pieces in your bag. It's worthless now.", 
	value: 0,
	max: 5
}
items.spoon = {
	name: "Spoon", 
	use: function(){},
	info: "A decorative spoon with an engraving on it. You probably should not sell this at a regular store.",
	value: 0,
	max: 15
}
items.oilyBag = {
	name: "Oily Bag",
	use: function() {
		if (items.combatCancel()) {return;}
		display.message.prompt("You open the oily bag and find a bunch of brightly colored gems. ")
		removeStuff(player.items, player.itemsQuantity, checkForStuff(player.items, items.oilyBag), "item");
		addStuff(player.items, player.itemsQuantity, 1, items.oilyBag, "item");
		display.loadInventory();
	},
	info: "An oily bag with a seal on it. You haven't opened it yet. ", 
	value: 0,
	max: 10
}
items.bagOfGems = {
	name: "Bag of Gems",
	use: function(){},
	info: "A bag of brightly colored gems. Each gem has an engraving on it. You probably should not sell this at a regular store.",
	value: 0,
	max: 10
}
items.candleStick = {
	name: "Candle Stick",
	use: function(){},
	info: "A source of light for navigating dark places. ",
	value: 5,
	max: 15
}
items.fatsosPapers = {
	name: "Fatso's Papers",
	use: function(){},
	info: "A stack of papers you stole from Fatso's house. They contain old love letters, a pedigree for a canary, 100 shares in a corporation long dead, a collection of bawdy limericks, and a good citizenship award. You probably should not show these around. Somebody might recognize who they're for.",
	value: 0,
	max: 2
}
items.combatCancel = function() {
	if (combat.active === true) {
		goBack("You cannot use this item during combat.");
		buttonVarArray[0] = useItem;
		return true;
	}
}	
items.array = [
	items.weakPotion, items.mediumPotion, items.strongPotion, items.veryStrongPotion, items.weakMannaPotion, items.mediumMannaPotion, items.strongMannaPotion,		//0-6
	items.veryStrongMannaPotion, items.potionOfRestoration, items.spellBookFireBall, items.spellBookLightningBolt, items.spellBookGust, items.spellBookFrost,		//7-12
	items.spellBookWeakHealing,items.spellBookMediumHealing, items.spellBookStrongHealing, items.spellBookVeryStrongHealing, items.spellBookBullStrength,			//13-17
	items.spellBookFocus, items.spellBookConcentration, items.spellBookMageArmor, items.spellBookRestoration, items.spellBookBlizzard, items.spellBookHurricane,	//18-23
	items.spellBookSunBurst, items.spellBookInferno, items.spellBookDeathRay, items.spellBookPoisonSlash, items.spellBookEntangle, items.fatsosPurse, 				//24-29
	items.rareWine, items.commonHerbs, items.modRareHerbs, items.rareHerbs, items.cayenne, items.emptyJar, items.burnOintment, items.tapestry, items.hookah, 		//30-38
	items.goldKey, items.pillow, items.teaService, items.brokenTeaService, items.spoon, items.oilyBag, items.bagOfGems, items.candleStick, items.fatsosPapers		//39-47
];
items.use = function(itemNum) {player.items[itemNum].use(player, itemNum);}
items.useUp = function(target, itemNum) {
	if (target.itemsQuantity[itemNum] > 1) {
		target.itemsQuantity[itemNum] -= 1;
	} else if (target.itemsQuantity[itemNum] === 1){
		removeStuff(target.items, target.itemsQuantity, itemNum, "item");
	} 
}
function useItem() {
	display.message.prompt("Click the item you would like to use.");
	display.loadInventory();
	if (combat.active === true) {
		itemSet(setItemNum);		
	} else {itemSet(items.use);}
	function setItemNum(itemNum) {
		combat.playerAction = [3, itemNum];
		combat.startRound();
	}
}

var weapons = new Object();

weapons.base = function() {
	var e = new Object();
	e.effect = false;
	e.effectChance = 0;
	e.projectile = false;
	e.twoHanded = false;
	e.enemyAtk = false;
	e.anim = function(char) {animation.melee(char)};
	e.class = [];
	return e;
}

//projectiles have to be listed first so that other weapons can have pointers to them.

weapons.arrow = {
	name: "arrow",
	use: function() {},
	bonus: false,
	dmgType: "piercing",
	effect: false,
	effectChance: 0,
	projectile: false,
	twoHanded: true,
	enemyAtk: false,
	anim: function(char) {animation.arrow(char)},
	info: "Ammo for bow and longbow.",
	value: 1,
	max: 100
}
weapons.bolt = {
	name: "bolt",
	use: function() {},
	bonus: false,
	dmgType: "piercing",
	effect: false,
	effectChance: 0,
	projectile: false,
	twoHanded: true,
	enemyAtk: false,
	anim: function(char) {animation.arrow(char)},
	info: "Ammo for crossbow",
	value: 1,
	max: 100
}
weapons.bullet = {
	name: "bullet",
	use: function() {},
	bonus: false,
	dmgType: "bludgeoning",
	effect: false,
	effectChance: 0,
	projectile: false,
	twoHanded: true,
	enemyAtk: false,
	anim: function(char) {animation.bullet(char)},
	info: "Ammo for slingshot",
	value: 1,
	max: 100
}
weapons.throwingKnife = {
	name: "throwing knife",
	use: function() {return rng(6);},
	bonus: 1,
	dmgType: "piercing",
	effect: false,
	effectChance: 0,
	projectile: false,
	twoHanded: false,
	enemyAtk: false,
	info: "Small throwing knives. Deals up to 6 piercing damage plus DEX modifier.",
	value: 3,
	max: 100
}

weapons.fist = weapons.base();
weapons.fist.name = "fist";
weapons.fist.use = function() {return rng(3)};
weapons.fist.bonus = 0;
weapons.fist.dmgType = "bludgeoning";
weapons.fist.info = "Your fists. Deals up to 3 bludgeoning damage plus STR modifier.";
weapons.fist.value = 0;
weapons.fist.max = 2;

weapons.dagger = weapons.base();
weapons.dagger.name = "dagger";
weapons.dagger.use = function() {return rng(4)};
weapons.dagger.bonus = 0;
weapons.dagger.dmgType = "piercing";
weapons.dagger.info = "A small dagger with 1ft sharp edge. Deals up to 4 piercing damage plus STR modifier.";
weapons.dagger.value = 20;
weapons.dagger.max = 10;
weapons.dagger.class = ["rogue1","warrior3","mage4"];

weapons.shortsword = weapons.base();
weapons.shortsword.name = "shortsword";
weapons.shortsword.use = function() {return rng(6);};
weapons.shortsword.bonus = 0;
weapons.shortsword.dmgType = "slashing";
weapons.shortsword.info = "Single-edged shortsword. Deals up to 6 slashing damage plus STR modifier.";
weapons.shortsword.value = 40;
weapons.shortsword.max = 8;

weapons.longsword = weapons.base();
weapons.longsword.name = "longsword";
weapons.longsword.use = function() {return rng(8);};
weapons.longsword.bonus = 0;
weapons.longsword.dmgType = "slashing";
weapons.longsword.info = "Single-edged longsword. Deals up to 8 slashing damage plus STR modifier.";
weapons.longsword.value = 75;
weapons.longsword.max = 5;

weapons.greatsword = weapons.base();
weapons.greatsword.name = "greatsword";
weapons.greatsword.use = function() {return rng(10);};
weapons.greatsword.bonus = 0;
weapons.greatsword.dmgType = "slashing";
weapons.greatsword.twoHanded = true;
weapons.greatsword.info = "Double-edged greatsword. Two-Handed. Deals up to 10 slashing damage plus STR modifier.";
weapons.greatsword.value = 100;
weapons.greatsword.max = 5;

weapons.axe = weapons.base();
weapons.axe.name = "axe";
weapons.axe.use = function() {return rng(6);};
weapons.axe.bonus = 0;
weapons.axe.dmgType = "slashing";
weapons.axe.info = "Small single-sided axe. Deals up to 6 slashing damage plus STR modifier.";
weapons.axe.value = 60;
weapons.axe.max = 5;

weapons.greataxe = weapons.base();
weapons.greataxe.name = "greataxe";
weapons.greataxe.use = function() {return rng(12);};
weapons.greataxe.bonus = 0;
weapons.greataxe.dmgType = "slashing";
weapons.greataxe.twoHanded = true;
weapons.greataxe.info = "Double-sided battleaxe. Two-Handed. Deals up to 12 slashing damage plus STR modifier.";
weapons.greataxe.value = 120;
weapons.greataxe.max = 5;

weapons.maul = weapons.base();
weapons.maul.name = "maul";
weapons.maul.use = function() {return rng(6);};
weapons.maul.bonus = 0;
weapons.maul.dmgType = "bludgeoning";
weapons.maul.effect = "prone";
weapons.maul.effectChance = 0.2;
weapons.maul.info = "Weighed unspiked mace. Deals up to 6 bludgeoning damage plus STR modifier.";
weapons.maul.value = 50;
weapons.maul.max = 5

weapons.warhammer = weapons.base();
weapons.warhammer.name = "warhammer";
weapons.warhammer.use = function() {return rng(12);};
weapons.warhammer.bonus = 0;
weapons.warhammer.dmgType = "bludgeoning";
weapons.warhammer.effect = "unconscious";
weapons.warhammer.effectChance = 0.2;
weapons.warhammer.twoHanded = true;
weapons.warhammer.info = "Large warhammer. Two-Handed. Deals up to 12 bludgeoning damage plus STR modifier.";
weapons.warhammer.value = 110;
weapons.warhammer.max = 5

weapons.spear = weapons.base();
weapons.spear.name = "spear";
weapons.spear.use = function() {return rng(6);};
weapons.spear.bonus = 1;
weapons.spear.dmgType = "piercing";
weapons.spear.info = "6ft spear. Deals up to 6 piercing damage plus DEX modifier.";
weapons.spear.value = 50;
weapons.spear.max = 5;

weapons.bow = weapons.base();
weapons.bow.name = "bow";
weapons.bow.use = function() {return rng(6);};
weapons.bow.bonus = 1;
weapons.bow.dmgType = "piercing";
weapons.bow.projectile = weapons.arrow;
weapons.bow.twoHanded = true;
weapons.bow.info = "Wooden bow. Two-Handed. Deals up to 6 piercing damage plus DEX modifier.";
weapons.bow.anim = function(char) {animation.arrow(char)};
weapons.bow.value = 60;
weapons.bow.max = 5;

weapons.longbow = weapons.base();
weapons.longbow.name = "longbow";
weapons.longbow.use = function() {return rng(8);};
weapons.longbow.bonus = 1;
weapons.longbow.dmgType = "piercing";
weapons.longbow.projectile = weapons.arrow;
weapons.longbow.twoHanded = true;
weapons.longbow.info = "Wooden longbow. Two-Handed. Deals up to 8 piercing damage plus DEX modifier.";
weapons.longbow.anim = function(char) {animation.arrow(char)};
weapons.longbow.value = 80;
weapons.longbow.max = 5;

weapons.crossbow = weapons.base();
weapons.crossbow.name = "crossbow";
weapons.crossbow.use = function() {return rng(10);};
weapons.crossbow.bonus = 1;
weapons.crossbow.dmgType = "piercing";
weapons.crossbow.projectile = weapons.bolt;
weapons.crossbow.twoHanded = true;
weapons.crossbow.info = "Wooden crossbow. Two-Handed. Deals up to 10 piercing damage plus DEX modifier.";
weapons.crossbow.anim = function(char) {animation.arrow(char)};
weapons.crossbow.value = 100;
weapons.crossbow.max = 5;

weapons.slingShot = weapons.base();
weapons.slingShot.name = "sling shot";
weapons.slingShot.use = function() {return rng(4);};
weapons.slingShot.bonus = 1;
weapons.slingShot.dmgType = "bludgeoning";
weapons.slingShot.effect = "blinded";
weapons.slingShot.effectChance = 0.2;
weapons.slingShot.projectile = weapons.bullet;
weapons.slingShot.twoHanded = true;
weapons.slingShot.info = "Wooden sling shot. Two-Handed. Deals up to 4 bludgeoning damage plus DEX modifier.";
weapons.slingShot.anim = function(char) {animation.bullet(char)};
weapons.slingShot.value = 40;
weapons.slingShot.max = 10;

weapons.flail = weapons.base();
weapons.flail.name = "flail";
weapons.flail.use = function() {return rng(6);};
weapons.flail.bonus = 0;
weapons.flail.dmgType = "bludgeoning";
weapons.flail.info = "Several spiked balls on chains. Deals up to 6 bludgeoning damage plus STR modifier.";
weapons.flail.value = 50;
weapons.flail.max = 5;

weapons.scimitar = weapons.base();
weapons.scimitar.name = "scimitar";
weapons.scimitar.use = function() {return rng(6);};
weapons.scimitar.bonus = 1;
weapons.scimitar.dmgType = "slashing";
weapons.scimitar.info = "A sword with a curved blade and weighted tip. Deals up to 6 slashing damage plus DEX modifier.";
weapons.scimitar.value = 75;
weapons.scimitar.max = 5;

weapons.glaive = weapons.base();
weapons.glaive.name = "glaive";
weapons.glaive.use = function() {return rng(8);};
weapons.glaive.bonus = 1;
weapons.glaive.dmgType = "piercing";
weapons.glaive.twoHanded = true;
weapons.glaive.info = "A 1ft blade on a 6ft pole. Deals up to 8 piercing damage plus DEX modifier.";
weapons.glaive.value = 90;
weapons.glaive.max = 5;

weapons.ironSkillet = weapons.base();
weapons.ironSkillet.name = "iron skillet";
weapons.ironSkillet.use = function() {return rng(6);};
weapons.ironSkillet.bonus = 0;
weapons.ironSkillet.dmgType = "bludgeoning";
weapons.ironSkillet.effect = "unconscious";
weapons.ironSkillet.effectChance = 0.2;
weapons.ironSkillet.info = "A heavy iron skillet. Deals up to 6 bludgeoning damage plus STR modifier.";
weapons.ironSkillet.value = 10;
weapons.ironSkillet.max = 4;

weapons.pan = weapons.base();
weapons.pan.name = "pan";
weapons.pan.use = function() {return rng(4);};
weapons.pan.bonus = 0;
weapons.pan.dmgType = "bludgeoning";
weapons.pan.info = "an ordinary cooking pan. Deals up to 4 bludgeoning damage plus STR modifier.";
weapons.pan.value = 5;
weapons.pan.max = 15;

weapons.swordOfEmbers = weapons.base();
weapons.swordOfEmbers.name = "Sword of Embers";
weapons.swordOfEmbers.use = function() {return rng(10);};
weapons.swordOfEmbers.bonus = 0;
weapons.swordOfEmbers.dmgType = "fire";
weapons.swordOfEmbers.effect = "burned";
weapons.swordOfEmbers.effectChance = 0.2;
weapons.swordOfEmbers.info = "The legendary Sword of Embers. Deals up to 10 fire damage plus STR modifier with a 20% chance of causing a burn.";
weapons.swordOfEmbers.value = 750;
weapons.swordOfEmbers.max = 5;

weapons.bite = weapons.base();
weapons.bite.name = "bite";
weapons.bite.use = function() {return rng(4);};
weapons.bite.bonus = 0;
weapons.bite.dmgType = "piercing";
weapons.bite.enemyAtk = true;
weapons.bite.info = "Bite";
weapons.bite.value = 0;
weapons.bite.max = 0;

weapons.poisonFang = weapons.base();
weapons.poisonFang.name = "poison fang";
weapons.poisonFang.use = function() {return rng(4);};
weapons.poisonFang.bonus = 0;
weapons.poisonFang.dmgType = "piercing";
weapons.poisonFang.effect = "poisoned";
weapons.poisonFang.effectChance = 0.2;
weapons.poisonFang.enemyAtk = true;
weapons.poisonFang.info = "Poison Fang";
weapons.poisonFang.value = 0;
weapons.poisonFang.max = 0;

weapons.scratch = weapons.base();
weapons.scratch.name = "scratch";
weapons.scratch.use = function() {return rng(4);};
weapons.scratch.bonus = 1;
weapons.scratch.dmgType = "slashing";
weapons.scratch.enemyAtk = true;
weapons.scratch.info = "Scratch";
weapons.scratch.value = 0;
weapons.scratch.max = 0;

weapons.claw = weapons.base();
weapons.claw.name = "claw";
weapons.claw.use = function() {return rng(6);};
weapons.claw.bonus = 0;
weapons.claw.dmgType = "slashing";
weapons.claw.enemyAtk = true;
weapons.claw.info = "Claw";
weapons.claw.value = 0;
weapons.claw.max = 0;

weapons.bash = weapons.base();
weapons.bash.name = "bash";
weapons.bash.use = function() {return rng(6);};
weapons.bash.bonus = 0;
weapons.bash.dmgType = "bludgeoning";
weapons.bash.effect = "unconscious";
weapons.bash.effectChance = 0.2;
weapons.bash.enemyAtk = true;
weapons.bash.info = "Bash";
weapons.bash.value = 0;
weapons.bash.max = 0;

weapons.projectile = function(target, wpn) {
	if (wpn.projectile === false) {return;}
log("weapons.projectile")
	for (let i=0; i<target.weapons.length; i+=1) {
		if (target.weapons[i] === wpn.projectile) {
			if (target.weaponsQuantity[i] > 1) {
				target.weaponsQuantity[i] -= 1;
				return;
			} else {
				removeStuff(target.weapons, target.weaponsQuantity, i, "weapon");
				return;
			}
		} else if (i === target.weapons.length-1 && target.weapons[i] !== wpn.projectile) {
			return false;
		}
	}
}
weapons.array = [
	weapons.fist,weapons.dagger,weapons.shortsword,weapons.longsword,weapons.greatsword,weapons.axe,weapons.greataxe,weapons.maul,weapons.warhammer,weapons.spear,
	weapons.bow,weapons.longbow,weapons.crossbow,weapons.slingShot,weapons.arrow,weapons.bolt,weapons.bullet,weapons.throwingKnife,weapons.flail,weapons.scimitar,
	weapons.glaive,weapons.ironSkillet,weapons.pan,weapons.swordOfEmbers,weapons.bite,weapons.poisonFang,weapons.scratch,weapons.claw,weapons.bash
];
	
var armor = new Object();
armor.hideArmor = {
	name: "Hide Armor",
	stat: 2,
	typeName: "body",
	resistance: false,
	info: "Leather hide armor. Body. +2 to AC.",
	class: [],
	value: 10,
	max: 8,
}
armor.chainmail = {
	name: "Chainmail",
	stat: 3,
	typeName: "body",
	resistance: false,
	info: "Armor made of chain rings. Body. +3 to AC.",
	class: [],
	value: 40,
	max: 5,
}
armor.bronzeFullPlate = {
	name: "Bronze Full Plate",
	stat: 6,
	typeName: "body",
	resistance: false,
	info: "Bronze Armor. Body. +6 to AC.",
	class: [],
	value: 80,
	max: 3,
}
armor.steelFullPlate = {
	name: "Steel Full Plate",
	stat: 8,
	typeName: "body",
	resistance: false,
	info: "Steel Armor. Body. +8 to AC.",
	class: [],
	value: 150,
	max: 3,
}
armor.leatherGauntlet = {
	name: "Leather Gauntlet",
	stat: 1,
	typeName: "hands",
	resistance: false,
	info: "Leather gauntlets. Hands. +1 to AC.",
	class: [],
	value: 5,
	max: 10,
}
armor.bronzeGauntlet = {
	name: "Bronze Gauntlet",
	stat: 2,
	typeName: "hands",
	resistance: false,
	info: "Bronze plated gauntlets. Hands. +2 to AC.",
	class: [],
	value: 30,
	max: 8,
}
armor.steelGauntlet = {
	name: "Steel Gauntlet",
	stat: 3,
	typeName: "hands",
	resistance: false,
	info: "Steel plated gauntlets. Hands. +3 to AC.",
	class: [],
	value: 60,
	max: 8,
}
armor.leatherBoots = {
	name: "Leather Boots",
	stat: 1,
	typeName: "feet",
	resistance: false,
	info: "Leather boots. Feet. +1 to AC.",
	class: [],
	value: 5,
	max: 10,
}
armor.bronzeBoots = {
	name: "Bronze Boots",
	stat: 2,
	typeName: "feet",
	resistance: false,
	info: "Bronze plated boots. Feet. +2 to AC.",
	class: [],
	value: 30,
	max: 8,
}
armor.steelBoots = {
	name: "Steel Boots",
	stat: 3,
	typeName: "feet",
	resistance: false,
	info: "Steel plated boots. Feet. +3 to AC.",
	class: [],
	value: 60,
	max: 8,
}
armor.chainmailCoif = {
	name: "Chainmail Coif",
	stat: 1,
	typeName: "head",
	resistance: false,
	info: "Chainmail head piece. Head. +1 to AC.",
	class: [],
	value: 15,
	max: 8,
}
armor.bronzeHelmet = {
	name: "Bronze Helmet",
	stat: 2,
	typeName: "head",
	resistance: false,
	info: "Bronze helmet. Head. +2 to AC.",
	class: [],
	value: 40,
	max: 5,
}
armor.steelHelmet = {
	name: "Steel Helmet",
	stat: 3,
	typeName: "head",
	resistance: false,
	info: "Steel helmet. Head. +3 to AC.",
	class: [],
	value: 75,
	max: 5,
}
armor.woodenShield = {
	name: "Wooden Shield",
	stat: 3,
	typeName: "shield",
	resistance: false,
	info: "Wooden Shield. Shield. One-Handed weapons only. +3 to AC.",
	class: [],
	value: 20,
	max: 3,
}
armor.bronzeShield = {
	name: "Bronze Shield",
	stat: 4,
	typeName: "shield",
	resistance: false,
	info: "Bronze Shield. Shield. One-Handed weapons only. +4 to AC.",
	class: [],
	value: 40,
	max: 3,
}
armor.steelShield = {
	name: "Steel Shield",
	stat: 5,
	typeName: "shield",
	resistance: false,
	info: "Steel Shield. Shield. One-Handed weapons only. +5 to AC.",
	class: [],
	value: 80,
	max: 3,
}
armor.woodenBuckler = {
	name: "Wooden Buckler",
	stat: 1,
	typeName: "buckler",
	resistance: false,
	info: "Wooden buckler. Straps to arm. Buckler. +1 to AC.",
	class: [],
	value: 15,
	max: 5
}
armor.bronzeBuckler = {
	name: "Bronze Buckler",
	stat: 2,
	typeName: "buckler",
	resistance: false,
	info: "Bronze buckler. Straps to arm. Buckler. +2 to AC.",
	class: [],
	value: 30,
	max: 5
}
armor.steelBuckler = {
	name: "Steel Buckler",
	stat: 3,
	typeName: "buckler",
	resistance: false,
	info: "Steel buckler. Straps to arm. Buckler. +3 to AC.",
	class: [],
	value: 70,
	max: 5
}
armor.braceletOfFireResistance = {
	name: "Bracelet of Fire Resistance",
	stat: 0,
	typeName: "wrist",
	resistance: "fire1",
	info: "Magical bracelet that cuts damage from fire in half. Wrist.",
	class: [],
	value: 100,
	max: 10
}
armor.ringOfFrostProtection = {
	name: "Ring of Frost Protection",
	stat: 0,
	typeName: "finger",
	resistance: "frost1",
	info: "Magical ring that cuts damage from frost in half. Finger.",
	class: [],
	value: 100,
	max: 10
}
armor.amuletOfThunder = {
	name: "Amulet of Thunder",
	stat: 0,
	typeName: "neck",
	resistance: "lightning1",
	info: "Magical amulet that cuts damage from lightning in half. Neck.",
	class: [],
	value: 100,
	max: 10
}
armor.unpiercableChainmail = {
	name: "Unpiercable Chainmail",
	stat: 3,
	typeName: "body",
	resistance: "piercing0",
	info: "Magical chainmail armor that makes you immune to piercing damage. Body. +3 to AC.",
	class: [],
	value: 100,
	max: 5
}
armor.woodenShieldOfDeflecting = {
	name: "Wooden Shield of Deflecting",
	stat: 3,
	typeName: "shield",
	resistance: "bludgeoning0",
	info: "Magical wooden shield that makes you immune to bludgeoning damage. Shield. One-Handed weapons only. +3 to AC.",
	class: [],
	value: 150,
	max: 3
}
armor.array = [
	armor.hideArmor,armor.chainmail,armor.bronzeFullPlate,armor.steelFullPlate,armor.leatherGauntlet,armor.bronzeGauntlet,armor.steelGauntlet,armor.leatherBoots,
	armor.bronzeBoots,armor.steelBoots,armor.chainmailCoif,armor.bronzeHelmet,armor.steelHelmet,armor.woodenShield,armor.bronzeShield,armor.steelShield,
	armor.woodenBuckler,armor.bronzeBuckler,armor.steelBuckler,armor.braceletOfFireResistance,armor.ringOfFrostProtection,armor.amuletOfThunder,
	armor.unpiercableChainmail,armor.woodenShieldOfDeflecting
];

var quests = new Object();
quests.add = function(questNum) {
	if (quests.find(questNum) === false) {
		player.quests.push(questNum);
		player.questProgress.push(0);
		var message = "You accepted the quest "+quests.nameArray[questNum]+". First Objective: "+quests.array[questNum][0];
		display.message.quest(message);
		display.loadQuests();
	}
}
quests.find = function(questNum) {							//takes questNum in quests.array order and returns itemNum in player.quests
	for (i=0; i<player.quests.length; i+=1) {if (player.quests[i] === questNum) {return i;};}
	return false;
}
quests.findProgress = function(questNum) {
	if (player.questProgress[quests.find(questNum)] >= 0) {return player.questProgress[quests.find(questNum)]} else {return false;}
}
quests.update = function(questNum) {
	if (player.questProgress[quests.find(questNum)] >= quests.array[questNum].length) {
		display.message.quest("Quest Complete: "+quests.nameArray[questNum])
		return;
	}
	player.questProgress[quests.find(questNum)] += 1;
	if (player.questProgress[quests.find(questNum)] === quests.array[questNum].length) {
		display.message.quest("Quest Complete: "+quests.nameArray[questNum]+"<br>You gained "+quests.experienceArray[questNum]+" experience points. ");
		player.experience += quests.experienceArray[questNum];
		display.char();
		if (levelUpExpCheck() <= player.experience) {levelUp();}
	} else {
		display.message.quest("Quest Update: <br>"+quests.nameArray[questNum]+". <br>Next Objective: <br>"+quests.array[questNum][quests.findProgress(questNum)]);
	}
}
quests.allInANightsWork = ["Travel to the house at the end of the road.","Climb in through the window. ","Steal what you can.","Return to stranger."];
quests.oakloftTournament = ["Visit the king's steward to sign up for the tournament.","Report to the arena.","Enter the field.","Win the tournament."];
quests.array = [quests.allInANightsWork, quests.oakloftTournament];
quests.nameArray = ["All in a Night's Work", "Oakloft Tournament"];
quests.experienceArray = [250, 350];

var spells = new Object();
spells.attack = {};
spells.testManna = function(target, mannaCost) { 
	if (mannaCost > target.manna) {
		if (combat.active === true) {
			goBack("You do not have enough manna.");
			buttonVarArray[0] = combat.displayEffectSpells;
			combat.turns[0] = false;
		} else {display.message.prompt("You do not have enough manna.");}
		return false;
	}
}
spells.attack.fireball = {
	name: "Fireball",
	use: function() {return rng(6);},
	info: "Causes up to 6 points of fire damage. Manna cost: 8",
	effect: false,
	effectChance: 0,
	mannaCost: 8,
	anim: function(char) {animation.areaBlast(char,"orange",0,0,10,10,50)},
	dmgType: "fire"
}
spells.attack.lightningBolt = {
	name: "Lightning Bolt",
	use: function() {return rng(12);},
	info: "Causes up to 12 points of lightning damage with a 20% chance of causing paralysis. Manna cost: 15",
	effect: "paralyzed",
	effectChance: 0.2,
	mannaCost: 15,
	anim: function(char) {animation.beam(char,"yellow",0,0,20,20,20)},
	dmgType: "lightning"
}
spells.attack.gust = {
	name: "Gust",
	use: function() {return rng(4);},
	info: "Causes up to 4 points of wind damage. Manna cost: 5",
	effect: false,
	effectChance: 0,
	mannaCost: 5,
	anim: function(char) {animation.beam(char,"white",0,0,10,10,20)},
	dmgType: "wind"
}
spells.attack.frostBeam = {
	name: "Frost Beam",
	use: function() {return rng(10);},
	info: "Causes up to 10 points of frost damage. Manna cost: 8",
	effect: false,
	effectChance: 0,
	mannaCost: 8,
	anim: function(char) {animation.beam(char,"azure",0,0,20,20,20)},
	dmgType: "frost"
}
spells.attack.blizzard = {
	name: "Blizzard",
	use: function() {return rng(15);},
	info: "Causes up to 15 points of frost damage with a 20% chance of causing frostbite. Manna cost: 15",
	effect: "frostbitten",
	effectChance: 0.2,
	mannaCost: 15,
	anim: function(char) {animation.areaBlast(char,"azure",0,0,15,15,60)},
	dmgType: "frost"
}
spells.attack.hurricane = {
	name: "Hurricane",
	use: function() {return rng(12);},
	info: "Causes up to 12 points of wind damage with a 20% chance of knocking the enemy prone. Manna cost: 10",
	effect: "prone",
	effectChance: 0.2,
	mannaCost: 10,
	anim: function(char) {animation.areaBlast(char,"white",0,0,5,5,60)},
	dmgType: "wind"
}
spells.attack.sunBurst = {
	name: "Sun Burst",
	use: function() {return rng(15);},
	info: "Causes up to 15 points of radiant damage with a 30% chance of blinding the enemy. Manna cost: 15",
	effect: "blinded",
	effectChance: 0.3,
	mannaCost: 15,
	anim: function(char) {animation.areaBlast(char,"yellow",0,0,20,20,60)},
	dmgType: "radiant"
}
spells.attack.inferno = {
	name: "Inferno",
	use: function() {return rng(12);},
	info: "Causes up to 12 points of fire damage with a 30% chance of causing a burn. Manna cost: 15",
	effect: "burned",
	effectChance: 0.3,
	mannaCost: 15,
	anim: function(char) {animation.areaBlast(char,"orange",0,0,15,15,80)},
	dmgType: "fire"
}
spells.attack.deathRay = {
	name: "Death Ray",
	use: function() {return rng(12);},
	info: "Causes up to 12 points of necrotic damage. Manna cost: 10",
	effect: false,
	effectChance: 0,
	mannaCost: 10,
	anim: function(char) {animation.beam(char,"rgba(0,0,0,0.3)",0,0,25,25,20)},
	dmgType: "necrotic"
}
spells.attack.poisonSlash = {
	name: "Poison Slash",
	use: function() {return rng(8);},
	info: "Causes up to 8 points of poison damage with a 20% chance of poisoning the enemy. Manna cost: 10",
	effect: "poisoned",
	effectChance: 0.2,
	mannaCost: 10,
	anim: function(char) {animation.beam(char,"purple",0,0,40,10,1)},
	dmgType: "poison"
}
spells.attack.entangle = {
	name: "Entangle",
	use: function() {return rng(6);},
	info: "Causes up to 6 points of radiant damage with a 30% chance of constricting the enemy. Manna cost: 8",
	effect: "constricted",
	effectChance: 0.3,
	mannaCost: 8,
	anim: function(char) {animation.beam(char,"tan",0,0,30,30,20)},
	dmgType: "bludgeoning"
}
spells.attack.fireBreath = {
	name: "Fire Breath",
	use: function() {return rng(6);},
	info: "Causes up to 6 points of fire damage. Manna cost: 0",
	effect: false,
	effectChance: 0,
	mannaCost: 0,
	anim: function(char) {animation.beam(char,"orange",0,0,20,20,20)},
	dmgType: "fire"
}
spells.attack.array = [
	spells.attack.fireball,spells.attack.lightningBolt,spells.attack.gust,spells.attack.frostBeam,spells.attack.blizzard,spells.attack.hurricane,spells.attack.sunBurst,
	spells.attack.inferno,spells.attack.deathRay,spells.attack.poisonSlash,spells.attack.entangle,spells.attack.fireBreath
];


spells.weakHealing = {
	name: "Weak Healing",
	use: function(target) {if (spells.testManna(target, 2) === false) {return}; items.potion(target, 0, "health", 0, this.name);},
	info: "Restores 6-13 health points. Manna cost: 10",
	mannaCost: 10
}
spells.mediumHealing = {
	name: "Medium Healing",
	use: function(target) {if (spells.testManna(target, 5) === false) {return};items.potion(target, 0, "health", 1, this.name);},
	info: "Restores 12-26 health points. Manna cost: 20",
	mannaCost: 20
}
spells.strongHealing = {
	name: "Strong Healing",
	use: function(target) {if (spells.testManna(target, 8) === false) {return};items.potion(target, 0, "health", 2, this.name);},
	info: "Restores 24-52 health points. Manna cost: 30",
	mannaCost: 30
}
spells.veryStrongHealing = {
	name: "Very Strong Healing",
	use: function(target) {if (spells.testManna(target, 10) === false) {return};items.potion(target, 0, "health", 3, this.name);},
	info: "Restores 48-104 health points. Manna cost: 40",
	mannaCost: 40
}
spells.bullStrength = {
	name: "Bull Strength",
	use: function(target) {spells.statBoost(target, 0, 5, 5, 10, "strength");},
	info: "Increases strength by 5 points for 5 rounds. Manna cost: 10", 
	mannaCost: 10
}
spells.focus = {
	name: "Focus",
	use: function(target) {spells.statBoost(target, 1, 5, 5, 10, "dexterity");},
	info: "Increases dexterity by 5 points for 5 rounds. Manna cost: 10",
	mannaCost: 10
}
spells.concentration = {
	name: "Concentration",
	use: function(target) {spells.statBoost(target, 2, 5, 5, 10, "IQ");},
	info: "Increases IQ by 5 points for 5 rounds. Manna cost: 10",
	mannaCost: 10
}
spells.mageArmor = {
	name: "Mage Armor",
	use: function(target) {spells.statBoost(target, 3, 5, 5, 10, "armor class");},
	info: "Increases Armor Class by 5 points for 5 rounds. Manna cost: 10",
	mannaCost: 10
}
spells.restoration = {
	name: "Restoration",
	use: function(target) {
		if (target.status.length === 0) {
			if (combat.active === true) {
				goBack("You do not need to be restored. "); 
				buttonVarArray[0] = combat.displayEffectSpells;
			} else {
				display.message.prompt("You do not need to be restored. ");
			}
		} else {
			if (spells.testManna(target, 20) === false) {return};
			items.potionOfRestoration(target, "spell")
			target.manna -= 20;
			if (combat.active === true) {combat.turns[0] = true;}
		}
	},
	info: "Cures you of any status effects. Manna cost: 20",
	mannaCost: 20
}
spells.statBoost = function(target, stat, amount, rounds, mannaCost, statString) {
	if (combat.active === false) {
		display.message.prompt("You cannot use this spell outside of combat. ")
		return;
	}
	if (spells.testManna(target, 10) === false) {return};
	if (target === player) {target = 0;} else {target = 1;}
	combat.boostTempStat(target, amount, rounds, stat);
	combat.turns[0] = true;
	goBack("Your "+statString+" has been boosted. ")
	target.manna -= mannaCost;
}
spells.array = [
	spells.weakHealing,spells.mediumHealing,spells.strongHealing,spells.veryStrongHealing,spells.bullStrength,spells.focus,spells.concentration,spells.mageArmor,
	spells.restoration
];

var enemy = new Object();
enemy.create = function(create, lvl) {
	create.level = lvl;
	create.experience = Math.floor(lvl*create.baseYield/5)
	create.status = [];
	create.statusRounds = [];
	create.hitPoints = 30;
	create.mannaMax = 30;
	if (create.class === "warrior") {
		create.class = warrior;
	} else if (create.class === "mage") {
		create.class = mage;
	} else if (create.class === "rogue") {
		create.class = rogue;
	} else if (create.class === "paladin") {
		create.class = paladin;
	} else if (create.class === "beast") {
		create.class = beast;
	} else if (create.class === "tank") {
		create.class = tank;
	} else if (create.class === "even") {
		create.class = even;
	}
	var max = create.level*10
	var spread = Math.floor((lvl/6)*10);
	var leftOver = max-(spread);
	var statArray = [10,10,10,10,10,10];
	var unfav = [0,1,2,3,4,5];
	for (i=1; i<=lvl; i+=1) {
		statArray[4] += i;
		statArray[5] += i;
	}
	function evenSpread() {for (i=0; i<6; i+=1) {statArray[i] += spread;}}
	function randomStat() {
		var roll = rng(6);
		if (leftOver !== 0) {
			statArray[roll-1] += 1;
			leftOver -= 1;
			randomStat();
		}
	}
	function favoredStat(fav) {
		var roll = rng(10);
		unfav = [0,1,2,3,4,5];
		unfav.splice(fav,1);
		if (leftOver !== 0) {
			if (roll === 1) {
				statArray[unfav[0]] += 1;
			} else if (roll === 2) {
				statArray[unfav[1]] += 1;
			} else if (roll === 3) {
				statArray[unfav[2]] += 1;
			} else if (roll === 4) {
				statArray[unfav[3]] += 1;
			} else if (roll === 5) {
				statArray[unfav[4]] += 1;
			} else if (roll > 5) {
				statArray[fav] += 1;
			}
			leftOver -= 1;
			favoredStat(fav);
		}
	}
	function twoFavoredStats(fav1, fav2) {
		var roll = rng(15);
		for (i=0; i<6; i+=1) {if (unfav[i] === fav1 || unfav[i] === fav2) {unfav.splice(i, 1);}}
		if (leftOver !== 0) {
			if (roll === 1) {
				statArray[unfav[0]] += 1;
			} else if (roll === 2) {
				statArray[unfav[1]] += 1;
			} else if (roll === 3) {
				statArray[unfav[2]] += 1;
			} else if (roll === 4) {
				statArray[unfav[3]] += 1;
			} else if (roll>=5 && roll<=10) {
				statArray[fav1] += 1;
			} else if (roll>=11 && roll<=15) {
				statArray[fav2] += 1;
			}
			leftOver -= 1;
			twoFavoredStats(fav1, fav2);
		}
	}
	function threeFavoredStats(fav1, fav2, fav3) {
		var roll = rng(21);
		for (i=0; i<6; i+=1) {if (unfav[i] === fav1 || unfav[i] === fav2 || unfav[i] === fav3) {unfav.splice(i, 1);}}
		if (leftOver !== 0) {
			if (roll === 1) {
				statArray[unfav[0]] += 1;
			} else if (roll === 2) {
				statArray[unfav[1]] += 1;
			} else if (roll === 3) {
				statArray[unfav[2]] += 1;
			} else if (roll>=4 && roll<=9) {
				statArray[fav1] += 1;
			} else if (roll>=9 && roll<=15) {
				statArray[fav2] += 1;
			} else if (roll>=16 && roll<=21) {
				statArray[fav3] += 1;
			}
			leftOver -= 1;
			threeFavoredStats(fav1, fav2, fav3);
		}
	}
	function warrior() {evenSpread(); threeFavoredStats(0,3,4); finish();}
	function mage() {evenSpread(); twoFavoredStats(2,5); finish();}
	function rogue() {evenSpread(); twoFavoredStats(1,4); finish();}
	function paladin() {evenSpread(); threeFavoredStats(0,2,5); finish();}
	function beast() {evenSpread(); favoredStat(0); finish();}
	function tank() {evenSpread(); favoredStat(4); finish();}
	function even() {evenSpread(); randomStat(); finish();}
	function finish() {
		create.strength = statArray[0];
		create.dexterity = statArray[1];
		create.iq = statArray[2];
		create.armorClass = statArray[3];
		create.hitPoints = statArray[4];
		create.mannaMax = statArray[5];
		create.health = create.hitPoints;
		create.manna = create.mannaMax;
		for (let i=0; i<create.armor.length; i+=1) {create.armorClass += create.armor[i].stat;}
	}
	create.class();
	return create;
}
enemy.lvlRange = function() {
	var roll = rng(5);
	var lvl = (player.level-3)+roll
	if (lvl<1) {lvl = 1;}
	return lvl;
}
enemy.lvlGreaterThan = function() {
	var roll = rng(3);
	var lvl = player.level+roll
	return lvl;
}
enemy.lvlLessThan = function() {
	var roll = rng(3);
	var lvl = (player.level-3)+roll
	if (lvl<1) {lvl = 1;}
	return lvl;
}
enemy.testManna = function() {
	var choices = [];
	for (i=0; i<combat.opponent.spellsAttack.length; i+=1) {if (combat.opponent.spellsAttack[i].mannaCost <= combat.opponent.manna) {choices.push(i);}	}
	if (choices.length === 0) {combat.checkStatus(combat.opponent, 0, atk)}
	var num = choices[(rng(choices.length)-1)];
	return num;
}

function atk() {combat.opponentAttacks(0, 0);}
function spl() {combat.opponentAttacks(1, enemy.testManna());}

enemy.genericAI = function() {
	if (combat.opponent.health > (combat.opponent.hitPoints/10) || combat.opponent.health > 10) {
		if (combat.opponent.manna > 5 && combat.opponent.spellsAttack.length !== 0) {
			combat.checkStatus(combat.opponent, 0, spl);
		} else {combat.checkStatus(combat.opponent, 0, atk);}
	} else {if (combat.opponent.items.length !== 0) {useAnItem();} else {combat.checkStatus(combat.opponent, 0, atk);}}
	function useAnItem() {
		var choices = [];
		for (i=0; i<combat.opponent.items.length; i+=1) {
			if (combat.opponent.items[i] === items.weakHealing || combat.opponent.items[i] === items.mediumHealing || combat.opponent.items[i] === items.strongHealing || combat.opponent.items[i] === items.veryStrongHealing) {
				if (combat.opponent.itemsQuantity[i] > 0) {
					choices.push(i);
				}
			}
		}
		var num = choices[(rng(choices.length)-1)];
		var use = function() {combat.opponentUseItem(combat.opponent.items[num])};
		combat.checkStatus(combat.opponent, 0, use);
	}
}

enemy.simpleAI = function() {
	combat.checkStatus(combat.opponent, 0, atk);
}
enemy.cantripAI = function() {
	var roll = Math.random()
	if (combat.opponent.manna > 5 && combat.opponent.spellsAttack.length !== 0 && roll > 0.5) {
		combat.checkStatus(combat.opponent, 0, spl);
	} else {
		combat.checkStatus(combat.opponent, 0, atk);
	}
}

//	baseYield is between 30 and 100 depending on difficulty

enemy.base = function(e) {
	e.gold = 0;
	e.items = [];
	e.itemsQuantity = [];
	e.weapons = [weapons.fist];
	e.weaponsQuantity = [1];
	e.weaponEquipped = 0;
	e.armor = [];
	e.armorQuantity = [];
	e.spells = [];
	e.spellsAttack = [];
	e.weakness = [];
	e.AI = enemy.genericAI;
	return e;
}

enemy.goblin = function(e) {
	e = enemy.base(e);
	e.name = "Goblin";
	e.gold = rng(5)+10;
	e.weapons = [weapons.spear];
	e.weaponsQuantity = [1];
	e.armor = [armor.hideArmor];
	e.armorQuantity = [1];
	e.weakness = ["fire1"];
	e.class = "warrior";
	e.AI = enemy.simpleAI;
	e.atkString = "A goblin runs up to you with its weapon drawn shouting jibberish. ";
	e.baseYield = 30;
	return e;
}
enemy.guard = function(e) {
	e = enemy.base(e);
	e.name = "Palace Guard";
	e.gold = rng(15)+30;
	e.items = [items.weakPotion];
	e.itemsQuantity = [2];
	e.weapons = [weapons.longsword,weapons.glaive];
	e.weaponsQuantity = [1,1];
	e.armor = [armor.chainmail,armor.leatherGauntlet,armor.leatherBoots];
	e.armorQuantity = [1,1,1];
	e.spells = [spells.weakHealing];
	e.spellsAttack = [spells.attack.fireball,spells.attack.gust,spells.attack.frostBeam];
	e.class = "paladin";
	e.atkString = "A palace guard is trying to arrest you. ";
	e.baseYield = 60;
	return e;
}
enemy.giantRat = function(e) {
	e = enemy.base(e);
	e.name = "Giant Rat";
	e.weapons = [weapons.bite];
	e.weaponsQuantity = [1];
	e.class = "even";
	e.AI = enemy.simpleAI;
	e.atkString = "A giant rat races up to you and lunges at you. ";
	e.baseYield = 30;
	return e;
}
enemy.giantSpider = function(e) {
	e = enemy.base(e);
	e.name = "Giant Spider";
	e.weapons = [weapons.poisonFang];
	e.weaponsQuantity = [1];
	e.weakness = ["fire2"];
	e.class = "even";
	e.AI = enemy.simpleAI;
	e.atkString = "A giant spider crawls toward you with its fangs out. ";
	e.baseYield = 40;
	return e;
}
enemy.frostSpider = function(e) {
	e = enemy.base(e);
	e.name = "Frost Spider";
	e.weapons = [weapons.poisonFang];
	e.weaponsQuantity = [1];
	e.spellsAttack = [spells.attack.frostBeam];
	e.weakness = ["fire2"];
	e.class = "even";
	e.atkString = "A frost spider crawls toward you with its fangs out. ";
	e.baseYield = 50;
	return e;
}
enemy.wizard = function(e) {
	e = enemy.base(e);
	e.name = "Wizard";
	e.gold = rng(20)+50;
	e.spells = [0,1];
	e.spellsAttack = [
		spells.attack.fireball,spells.attack.inferno,spells.attack.hurricane,spells.attack.sunBurst,spells.attack.deathRay,spells.attack.lightningBolt,
		spells.attack.blizzard
	];
	e.class = "mage";
	e.atkString = "A wizard is preparing to cast a spell on you. ";
	e.baseYield = 80;
	return e;
}
enemy.babyDragon = function(e) {
	e = enemy.base(e);
	e.name = "Baby Dragon";
	e.gold = rng(15)+30;
	e.weapons = [weapons.claw];
	e.weaponsQuantity = [1];
	e.spellsAttack = [spells.attack.fireBreath,spells.attack.fireball,spells.attack.inferno];
	e.class = "paladin";
	e.AI = enemy.cantripAI;
	e.atkString = "A baby dragon is trying to defend its treasure. ";
	e.baseYield = 60;
	return e;
}
enemy.wolf = function(e) {
	e = enemy.base(e);
	e.name = "Wolf";
	e.weapons = [weapons.bite];
	e.class = "beast";
	e.AI = enemy.simpleAI;
	e.atkString = "A wolf is trying to defend its territory. ";
	e.baseYield = 40;
	return e;
}
enemy.donkeyKong = function(e) {
	e = enemy.base(e);
	e.name = "Donkey Kong";
	e.weapons = [weapons.bash];
	e.class = "beast";
	e.AI = enemy.simpleAI;
	e.atkString = "";
	e.baseYield = 60;
	return e;
}
enemy.mrMeeseeks = function(e) {
	e = enemy.base(e);
	e.name = "Mr. Meeseeks";
	e.class = "even";
	e.AI = enemy.simpleAI;
	e.atkString = "";
	e.baseYield = 30;
	return e;
}
enemy.charizard = function(e) {
	e = enemy.base(e);
	e.name = "Charizard";
	e.weapons = [weapons.bite];
	e.spellsAttack = [spells.attack.fireBreath,spells.attack.fireball,spells.attack.inferno];
	e.weakness = ["frost2"];
	e.class = "paladin";
	e.AI = enemy.cantripAI;
	e.atkString = "";
	e.baseYield = 60;
	return e;
}
enemy.obiWanShinobi = function(e) {
	e = enemy.base(e);
	e.name = "Obi Wan Shinobi";
	e.gold = 30;
	e.items = [items.weakPotion];
	e.itemsQuantity = [2];
	e.weapons = [weapons.dagger];
	e.spellsAttack = [spells.attack.gust,spells.attack.blizzard,spells.attack.hurricane,spells.attack.fireBreath,spells.attack.inferno,spells.attack.sunBurst];
	e.class = "mage";
	e.atkString = "";
	e.baseYield = 50;
	return e;
}
enemy.ganondorf = function(e) {
	e = enemy.base(e);
	e.name = "Ganondorf";
	e.items = [items.weakPotion,items.mediumPotion];
	e.itemsQuantity = [1,1];
	e.weapons = [weapons.axe,weapons.greatsword];
	e.weaponsQuantity = [1,1];
	e.armor = [armor.chainmail,armor.leatherGauntlet,armor.leatherBoots];
	e.armorQuantity = [1,1,1];
	e.spellsAttack = [spells.attack.lightningBolt,spells.attack.gust,spells.attack.deathRay];
	e.weakness = ["radiant2"];
	e.class = "paladin";
	e.atkString = "";
	e.baseYield = 60;
	return e;
}
enemy.link = function(e) {
	e = enemy.base(e);
	e.name = "Link";
	e.items = [items.weakPotion];
	e.itemsQuantity = [1];
	e.weapons = [weapons.longsword];
	e.armor = [armor.chainmail,armor.leatherGauntlet,armor.leatherBoots,armor.steelShield];
	e.armorQuantity = [1,1,1,1];
	e.weakness = ["radiant0"];
	e.class = "paladin";
	e.atkString = "";
	e.baseYield = 50;
	return e;
}
enemy.tanjiro = function(e) {
	e = enemy.base(e);
	e.name = "Tanjiro";
	e.items = [items.weakPotion,items.mediumPotion];
	e.itemsQuantity = [1,1];
	e.weapons = [weapons.longsword];
	e.armor = [armor.hideArmor];
	e.armorQuantity = [1];
	e.weakness = ["necrotic2"];
	e.class = "warrior";
	e.atkString = "";
	e.baseYield = 40;
	return e;
}
enemy.ulfricStormcloak = function(e) {
	e = enemy.base(e);
	e.name = "Ulfric Stormcloak";
	e.gold = rng(30)+10;
	e.items = [items.weakPotion,items.mediumPotion];
	e.itemsQuantity = [1,1];
	e.weapons = [weapons.greataxe];
	e.armor = [armor.chainmail,armor.leatherGauntlet,armor.leatherBoots];
	e.armorQuantity = [1,1,1];
	e.class = "paladin";
	e.atkString = "";
	e.baseYield = 50;
	return e;
}

var homeInventory = new Object();
homeInventory.type = "bank"
homeInventory.name = "Inventory Chest"
homeInventory.items = [items.weakPotion,items.mediumPotion,items.spoon,items.candleStick,items.spellBookGust,items.spellBookFrost];
homeInventory.weapons = [weapons.shortsword, weapons.bow, weapons.arrow];
homeInventory.armor = [armor.hideArmor,armor.leatherBoots,armor.leatherGauntlet];
homeInventory.itemsQuantity = [5,5,5,5,5,5,5,5,5,5,5];
homeInventory.weaponsQuantity = [5,5,45,5,5,5,5,5,5,5,5];
homeInventory.armorQuantity = [5,5,5,5,5,5,5,5,5,5,5];
homeInventory.gold = 150;

var townShop = new Object();
townShop.type = "shop"
townShop.name = "General Store"
townShop.items = [
	items.weakPotion, items.mediumPotion, items.strongPotion, items.veryStrongPotion, items.weakMannaPotion, items.mediumMannaPotion, items.strongMannaPotion,
	items.veryStrongMannaPotion, items.potionOfRestoration, items.spellBookFireBall, items.spellBookLightningBolt, items.spellBookGust, items.spellBookFrost,
	items.spellBookWeakHealing,items.spellBookMediumHealing, items.spellBookStrongHealing, items.spellBookVeryStrongHealing, items.spellBookBullStrength,
	items.spellBookFocus, items.spellBookConcentration, items.spellBookMageArmor, items.spellBookRestoration, items.spellBookBlizzard, items.spellBookHurricane,
	items.spellBookSunBurst, items.spellBookInferno, items.spellBookDeathRay, items.spellBookPoisonSlash, items.spellBookEntangle,items.candleStick,
];
townShop.weapons = [
	weapons.dagger,weapons.shortsword,weapons.longsword,weapons.greatsword,weapons.axe,weapons.greataxe,weapons.maul,weapons.warhammer,weapons.spear,weapons.bow,
	weapons.longbow,weapons.crossbow,weapons.slingShot,weapons.arrow,weapons.bolt,weapons.bullet,weapons.throwingKnife,weapons.flail,weapons.scimitar,weapons.glaive,
	weapons.ironSkillet,weapons.pan
];
townShop.armor = [
	armor.hideArmor,armor.chainmail,armor.bronzeFullPlate,armor.steelFullPlate,armor.leatherGauntlet,armor.bronzeGauntlet,armor.steelGauntlet,armor.leatherBoots,
	armor.bronzeBoots,armor.steelBoots,armor.chainmailCoif,armor.bronzeHelmet,armor.steelHelmet,armor.woodenShield,armor.bronzeShield,armor.steelShield,
	armor.woodenBuckler,armor.bronzeBuckler,armor.steelBuckler
];
townShop.itemsQuantity = [5,5,5,5,5,5,5,5,5,5,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1];
townShop.weaponsQuantity = [9,3,2,2,4,7,3,3,5,5,2,2,10,10,10,10,10,3,5,5,2,2,1,1,1,1];
townShop.armorQuantity = [2,2,2,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1];
townShop.gold = 2000;

var townBank = new Object();
townBank.type = "bank";
townBank.name = "General Bank";
townBank.items = [items.pillow,items.weakPotion,items.mediumPotion,items.spellBookWeakHealing];
townBank.weapons = [weapons.dagger,weapons.shortsword,weapons.spear,weapons.bow,weapons.arrow,weapons.pan];
townBank.armor = [armor.chainmail,armor.chainmailCoif,armor.woodenShield];
townBank.itemsQuantity = [1,2,1,1];
townBank.weaponsQuantity = [3,3,5,5,20,2,1];
townBank.armorQuantity = [1,1,1];
townBank.gold = 200;

var currentShop = homeInventory;

var combat = new Object();
	combat.active = false;
	combat.round = 1;
	combat.playerAction = [0,0];								//0=action, 1=spellNum, itemNum, or weaponNum
	combat.opponent = {};
	combat.opponent.status = [];
	combat.opponent.statusRounds = [];
	combat.tempStatBoost = [0,0,0,0];
	combat.opponentTempStatBoost = [0,0,0,0];
	combat.tempStatBoostRounds = ["a","a","a","a"];
	combat.opponentTempStatBoostRounds = ["a","a","a","a"];
	combat.turns = [false, false];								//first item is player turn. second item is enemy turn.
	combat.cannotRun = false;
	combat.blocking = false;
//	combat.dmgTypeArray = ["piercing","slashing","bludgeoning","fire","frost","lightning","wind","necrotic","poison","radiant"];
//	combat.statusTypeArray = ["poisoned", "burned", "frostbite", "blinded", "paralyzed", "constricted", "prone", "unconscious"];
	combat.bonus = function(stat) {return Math.floor((stat-10)/2)};
	combat.statusDefeat = false;			//player status that causes defeat
	combat.statusVictory = false;			//opponent status that causes victory
	combat.statusDefeatFunc = false;
	combat.statusVictoryFunc = false;
	combat.defeatFunc = gameOver;
	combat.victoryFunc = combat.end;

combat.challenge = function(e) {
	combat.opponent = enemy.create(e, e.level)
	combat.active = true;
	document.getElementById("battle").style = "";
	document.getElementById("enemyImg").style = battleTileXY(combat.opponent.sprite[0],combat.opponent.sprite[1]);
	log(e.attackString)
	if (typeof combat.victoryFunc === "undefined") {combat.victoryFunc = combat.end}
	if (combat.opponent.atkString === "") {
		document.getElementById("battlePrompt").innerHTML = "You are being challenged by a "+combat.opponent.name+" (Level "+combat.opponent.level+"). What would you "+
		"like to do?"
	} else {document.getElementById("battlePrompt").innerHTML = combat.opponent.atkString+" (Level "+combat.opponent.level+"). What would you like to do?"}
	display.char();
	combat.enemyHealthBar();
	display.loadButtons();
	buttonReset();
	setButton(0, "Fight", combat.displayAttacks);
	setButton(1, "Flee", combat.flee);
	document.getElementById("listQuests").style = "display: none;";
	document.getElementById("listButtons").style = "";
}
combat.flee = function() {
	var runAway = combat.checkDex();
	if (combat.cannotRun || runAway === false) {
		document.getElementById("battlePrompt").innerHTML = "You tried to run away, but couldn't."
		buttonReset();
		combat.turns[0] = true;
		setButton(0, "Okay.", combat.checkRound);
	} else if (runAway) {
		document.getElementById("battlePrompt").innerHTML = "You got away from the "+combat.opponent.name+"."
		buttonReset();
		setButton(0, "Okay.", combat.end);
		combat.active = false;
	}
}
combat.enemyHealthBar = function() {
	if (combat.opponent.health > 0) {
		var h = combat.opponent.health*200/combat.opponent.hitPoints;
		var hr = 400+h;
		document.getElementById("enemyHealthBar").style = "width: "+h+";"
	} else {document.getElementById("enemyHealthBar").style = "display: none;"}
	if (combat.opponent.manna > 0) {
		var m = combat.opponent.manna*200/combat.opponent.mannaMax;
		var mr = 400+h;
		document.getElementById("enemyMannaBar").style = "width: "+m+";"
	} else {document.getElementById("enemyMannaBar").style = "display: none;"}
}
combat.statusExit = function() {
	for (i=0; i<player.status.length; i+=1) {
		if (player.status[i] === combat.statusDefeat) {
			combat.statusDefeatFunc();
			return true;
		}
	}
	for (i=0; i<combat.opponent.status.length; i+=1) {
		if (combat.opponent.status[i] === combat.statusVictory) {
			combat.statusVictoryFunc();
			return true;
		}
	}
}
combat.startRound = function() {
	if (combat.statusExit() === true) {return;}
	combat.round += 1;
	combat.turns = [false, false];
	for (i=0; i<4; i+=1) {
		if (combat.opponentTempStatBoostRounds[i] !== "a") {
			combat.opponentTempStatBoostRounds[i] -= 1;
		}
		if (combat.tempStatBoostRounds[i] !== "a") {
			combat.tempStatBoostRounds[i] -= 1;
		}
	}
	var playerFirst = combat.checkDex();
	if (playerFirst === true || combat.block === true) {
		combat.startPlayerAction();
	} else {
		combat.opponent.AI();
	}
}
combat.checkRound = function() {
	if (combat.statusExit() === true) {return;}
	if (combat.turns[0] === true && combat.turns[1] === true) {
		combat.displayAttacks();
	} else if (combat.turns[0] === true && combat.turns[1] === false) {
		combat.checkTempStat(player, combat.tempStatBoost, combat.tempStatBoostRounds, combat.opponent.AI);
	} else if (combat.turns[0] === false && combat.turns[1] === true) {
		combat.checkTempStat(player, combat.tempStatBoost, combat.tempStatBoostRounds, combat.startPlayerAction);
	}
}
combat.checkDex = function() {
	var playerSpeed = rng(20) + combat.bonus(player.dexterity);
	var enemySpeed = rng(20) + combat.bonus(combat.opponent.dexterity);
	if (playerSpeed === enemySpeed) {
		if (Math.random() > 0.5) {return true;} else {return false;}
	} else if (playerSpeed > enemySpeed) {
		return true;
	} else {return false;}
}
combat.checkStatus = function(target, count, atkFunc) {
	if (target.statusRounds[count] === 0) {combat.removeStatus(target, target.status[count])}		
	if (target.status.length === 0 || count >= target.status.length) {atkFunc();} else {combat.statusEffect(target, target.status[count], count, atkFunc)}
}
combat.checkStatusPos = function(target, status) {for (i=0; i<target.status.length; i+=1) {if (target.status[i] === status) {return i;}}; return false;};
combat.setStatus = function (target, status, roundCount) {
	if (combat.checkStatusPos(target, status) === false) {
		target.status.push(status)
		target.statusRounds.push(roundCount)
	}
}
combat.removeStatus = function (target, status) {
	for (i=0; i<target.status.length; i+=1) {
		if (target.status[i] === status) {
			target.status.splice(i,1)
			target.statusRounds.splice(i,1)
			count -= 1;
			display.char();
			return;
		}
	}
	return;
}
combat.effect = function(target, status, chance) {
	var roll = Math.random();
	var effectStr,targetName;
	if (target === player) {targetName = "You were "} else {targetName = combat.opponent.name+" was "}
	if (roll < chance) {
		if (status === "prone" || status === "unconscious") {effectStr = "knocked " + status + ". "} else {effectStr = status+". "}
		document.getElementById("battlePrompt").innerHTML = targetName+effectStr;
		combat.setStatus(target, status, 5);
		buttonReset();
		setButton(0,"Okay.", combat.checkRound)
	} else {combat.checkRound()}
};
combat.statusEffect = function(target, status, statusPos, atkFunc) {
	var count = statusPos;
	var plural, cureMsg;
	if (target === player) {
		targetName = "You"
		plural = " are"
		targetRound = 0;
	} else {
		targetName = target.name; 
		targetRound = 1;
		plural = " is"
	};
	var dmgString0 = targetName+" received damage from the "
	var dmgString1 = " and lost "+Math.floor(target.hitPoints/16)+" health points. ";
	if (status === "poisoned") {
		document.getElementById("battlePrompt").innerHTML = dmgString0+"poison"+dmgString1
		buttonReset();
		if (count >= target.status.length-1) {setButton(0, "Okay.", atkFunc);} else {setButton(0, "Okay.", checkStat);}
		statusDamage(target, "poisoned")
		checkCured(target, "poisoned", "poison")
	} else if (status === "burned") {
		document.getElementById("battlePrompt").innerHTML = dmgString0+"burn"+dmgString1
		buttonReset();
		if (count >= target.status.length-1) {setButton(0, "Okay.", atkFunc);} else {setButton(0, "Okay.", checkStat);}
		statusDamage(target, "burned")
		checkCured(target, "burned", "burn", 0)
	} else if (status === "frostbitten") {
		document.getElementById("battlePrompt").innerHTML = dmgString0+"frostbite"+dmgString1
		buttonReset();
		if (count >= target.status.length-1) {setButton(0, "Okay.", atkFunc);} else {setButton(0, "Okay.", checkStat);}
		statusDamage(target, "frostbitten")
		checkCured(target, "frostbitten", "frostbite", 0)
	} else if (status === "blinded") {
		document.getElementById("battlePrompt").innerHTML = targetName+plural+" blinded and cannot see. "
		buttonReset();
		setButton(0, "Okay.", checkStat);
		if (target === player) {cureMsg = "Your "} else {cureMsg = targetName+"'s "}
		cureMsg += "vision has been restored. "
		checkCured(target, "blinded", 0, cureMsg)
	} else if (status === "paralyzed") {
		document.getElementById("battlePrompt").innerHTML = targetName+plural+" paralyzed and cannot move. "
		atkFunc = combat.checkRound;
		buttonReset();
		setButton(0, "Okay.", checkStat);
		checkCured(target, "paralyzed", "paralysis", 0)
		combat.turns[targetRound] = true;
	} else if (status === "constricted") {
		document.getElementById("battlePrompt").innerHTML = targetName+plural+" constricted and cannot move. "
		buttonReset();
		setButton(0, "Okay.", checkStat);
		combat.turns[targetRound] = true;
		statusDamage(target, "constricted") 
		document.getElementById("battlePrompt").innerHTML += dmgString0+"frostbite"+dmgString1;
		cureMsg += targetName+plural+" no longer constricted. "
		checkCured(target, "constricted", 0, cureMsg)
		atkFunc = combat.checkRound;
	} else if (status === "prone") {
		document.getElementById("battlePrompt").innerHTML = targetName+" got up off the ground. "
		buttonReset();
		if (count >= target.status.length-1) {setButton(0, "Okay.", combat.checkRound);} else {setButton(0, "Okay.", checkStat);}
		combat.turns[targetRound] = true;
		combat.removeStatus(target, "prone")
	} else if (status === "unconscious") {
		document.getElementById("battlePrompt").innerHTML = targetName+plural+" unconscious and cannot attack. "
		buttonReset();
		setButton(0, "Okay.", checkStat);
		combat.turns[targetRound] = true;
		cureMsg = targetName+" regained consciousness. "
		checkCured(target, "unconscious", 0, cureMsg)
		atkFunc = combat.checkRound;
	}
	function statusDamage(target, type) {
		var dmg = Math.ceil(target.hitPoints/16);
		if (combat.damageresistance(target, type) === 2) {dmg *= 2;} else if (combat.damageresistance(target, type) === 0.5) {dmg = dmg/2;}
		target.health -= dmg;
	}
	function checkCured(target, status, statusType, cureString) {
		target.statusRounds[statusPos] -= 1;
		var cureCheck = target.statusRounds[statusPos];
		if (target.statusRounds[statusPos] === 0 ){	//	|| cureCheck >= target.statusRounds[statusPos]) {
			if (statusType !== 0) {
				document.getElementById("battlePrompt").innerHTML += "The effects of the "+statusType+" wore off. "
			} else {document.getElementById("battlePrompt").innerHTML += cureString;}
			combat.removeStatus(target, status)
		}
	}
	function checkStat() {
		count += 1;
		combat.checkStatus(target, count, atkFunc)
	}
	display.char();
}
combat.startPlayerAction = function() {
	if (combat.playerAction[0] === 0) {
		combat.checkStatus(player, 0, atk)
		function atk() {combat.displayDamage(0,0);}
	} else if (combat.playerAction[0] === 1) {
		combat.checkStatus(player, 0, atkspl);
		function atkspl() {combat.displayDamage(1,combat.playerAction[1])}
	} else if (combat.playerAction[0] === 2) {
		combat.checkStatus(player, 0, splfunc);
		function splfunc() {
			combat.turns[0] = true;
			player.spells[combat.playerAction[1]].use(player);
			display.char();
		}
	} else if (combat.playerAction[0] === 3) {
		combat.checkStatus(player, 0, item);
		function item() {
			player.items[combat.playerAction[1]].use(player, combat.playerAction[1]);
			combat.turns[0] = true;
			display.char();
		}
	} else if (combat.playerAction[0] === 4) {
		combat.checkStatus(player, 0, swap);
		function swap() {
			combat.turns[0] = true;
			playerEquip(combat.playerAction[1]);
		}
	} else if (combat.playerAction[0] === 5) {
		combat.turns[0] = true;
		combat.checkStatus(player, 0, combat.flee);
	} else if (combat.playerAction[0] === 6) {
		combat.checkStatus(player, 0, combat.block);
	}
	itemSet(0)
	combat.turns[0] = true;
}
combat.block = function() {
	combat.turns[0] = true;
	document.getElementById("battlePrompt").innerHTML = "You hold up your shield and brace for the enemy's attack. ";
	buttonReset();
	setButton(0, "Okay.", combat.checkRound);
}	
combat.displayAttacks = function() {
	document.getElementById("battlePrompt").innerHTML = "Round: "+combat.round+". What would you like to do?";
	buttonReset();
	var b = 3;
	setButton(0, "Attack with " + player.weapons[player.weaponEquipped].name, wpn);
	setButton(1, "Cast Attack Spell", combat.displaySpells);
	setButton(2, "Cast Effect Spell", combat.displayEffectSpells);
	if (checkForStuff(player.armorTypeEquipped, "shield") || checkForStuff(player.armorTypeEquipped, "buckler")) {
		setButton(b, "Block with shield", shield);
		b += 1;
	}
	setButton(b, "Use Item", useItem);
	setButton(b+1, "Swap Weapon", equip);
	setButton(b+2, "Flee", flee);
	function wpn() {
		if (player.weapons[player.weaponEquipped].projectile !== false) {
			if (checkForStuff(player.weapons, player.weapons[player.weaponEquipped].projectile) === false) { 
				goBack("You are out of ammo. ")
				buttonVarArray[0] = combat.displayAttacks;
				return;
			} else {
				display.loadButtons();
				combat.playerAction[0] = 0;
				combat.startRound();
			}
		} else {
			display.loadButtons();
			combat.playerAction[0] = 0;
			combat.startRound();
		}
	}
	function shield() {
		combat.playerAction[0] = 6;
		combat.blocking = true;
		combat.startRound();			
	}
	function flee(buttonNum) {
		combat.playerAction[0] = 5;
		combat.startRound();
	}
	function equip() {equipStuff(0);}
}
combat.displaySpells = function() {
	goBack("Which Attack Spell would you like to use?");
	buttonVarArray[0] = combat.displayAttacks;
	display.loadAttackSpells();
	function setItemNum(itemNum) {
		if (spells.testManna(player, player.spellsAttack[itemNum].mannaCost) === false) {
			buttonVarArray[0] = combat.displaySpells;
			return;
		} else {
			display.loadButtons();
			combat.playerAction = [1, itemNum];
			combat.startRound();
		}
	}
	itemSet(setItemNum);
}
combat.displayEffectSpells = function() {
	goBack("Which Effect Spell would you like to use?");
	buttonVarArray[0] = combat.displayAttacks;
	display.loadEffectSpells();
	function setItemNum(itemNum) {
		if (spells.testManna(player, player.spells[itemNum].mannaCost) === false) {
			return;
		} else {
			display.loadButtons();
			combat.playerAction = [2, itemNum];
			combat.startRound();
		}
	}
	itemSet(setItemNum);
}
combat.displayDamage = function(atkType, spellNum) {
	combat.turns[0] = true;
	buttonReset();
	setButton(0, "Okay.", combat.checkRound);
	var attackBonus, dmg;
	var crit = 1;
	var spellBonus = combat.bonus(player.iq);
	var defenseBonus = combat.bonus(combat.opponent.armorClass)
	var roll = rng(10);
	var accuracy = combat.bonus(player.dexterity)-combat.bonus(combat.opponent.dexterity)+50+(roll*5);
	if (player.weapons[player.weaponEquipped].bonus === 0) {attackBonus =  combat.bonus(player.strength);} else {attackBonus = combat.bonus(player.dexterity);}
	if (attackBonus <= 1) {attackBonus = 1;}
	if (defenseBonus <= 1) {defenseBonus = 1;}
	var bonus = attackBonus/defenseBonus;
	if (bonus <= 0) {bonus = 0;}
	if (combat.checkStatusPos(player, "blinded") !== false) {accuracy -= 50;}
	if (roll === 10) {
		document.getElementById("battlePrompt").innerHTML = "Critical hit! You attack "+combat.opponent.name+" with a ";
		crit = 1.5;
		atkCheck();
	} else if (roll === 1) {
		return missed();
	} else if (accuracy > 50) {
		document.getElementById("battlePrompt").innerHTML = "You attack "+combat.opponent.name+" with a ";
		atkCheck(); 
	} else {return missed();}
	function weaponAtk() {
		weapons.projectile(player, player.weapons[player.weaponEquipped]);
		var effect = 0;
		if (player.weapons[player.weaponEquipped].effect !== false) {
			effect = function() {combat.effect(combat.opponent, player.weapons[player.weaponEquipped].effect, player.weapons[player.weaponEquipped].effectChance)};
		}
		document.getElementById("battlePrompt").innerHTML += player.weapons[player.weaponEquipped].name;
		var weaponDmgType = player.weapons[player.weaponEquipped].dmgType;
		var effectNum = combat.damageresistance(combat.opponent, weaponDmgType);
		var dmg = Math.floor((player.weapons[player.weaponEquipped].use()+bonus)*effectNum*crit);
		var anim = function() {player.weapons[player.weaponEquipped].anim("player")}
		immunity(effectNum, weaponDmgType, dmg, effect,anim);
	}
	function spellAtk() {
		var effect = 0;
		if (player.manna < player.spellsAttack[spellNum].mannaCost) {
			goBack("You do not have enough manna. ")
			combat.turns[0] = false;
			buttonVarArray[0] = combat.displaySpells;
			return;
		}
		if (player.spellsAttack[spellNum].effect !== false) {
			effect = function() {combat.effect(combat.opponent, player.spellsAttack[spellNum].effect, player.spellsAttack[spellNum].effectChance)}
		}
		var spellDmgType = player.spellsAttack[spellNum].dmgType;
		var effectNum = combat.damageresistance(combat.opponent, spellDmgType);	
		var dmg = Math.floor((player.spellsAttack[spellNum].use()+bonus)*effectNum*crit)
		var anim = function(){player.spellsAttack[spellNum].anim("player")};
		document.getElementById("battlePrompt").innerHTML += player.spellsAttack[spellNum].name+" spell";
		player.manna -= player.spellsAttack[spellNum].mannaCost;
		if (player.manna<=0) {player.manna = 0;}
		immunity(effectNum, spellDmgType, dmg, effect, anim);
	}
	function immunity(effectNum, dmgType, dmg, effect, anim) {	
		if (effectNum === 0) {
			document.getElementById("battlePrompt").innerHTML += ". The "+combat.opponent.name+" is immune to "+dmgType+" damage.";
			return;
		} else if (effectNum === 0.5) {
			document.getElementById("battlePrompt").innerHTML += ". Your attack wasn't very effective against "+combat.opponent.name
		} else if (effectNum === 2) {
			document.getElementById("battlePrompt").innerHTML += ". The "+combat.opponent.name+" took a heavy blow from your attack";
		}
		if (dmg <= 0) {
			combat.opponent.health -= 1;
			document.getElementById("battlePrompt").innerHTML += ". The "+combat.opponent.name+" was barely damaged by your attack. ";
		} else {
			document.getElementById("battlePrompt").innerHTML += ". The "+combat.opponent.name+" has lost "+dmg+" health points. ";
			combat.opponent.health -= dmg;
		}
		if (checkEnemyHealth() === false) {combat.victory();} else if (effect !== 0) {buttonVarArray[0] = effect;}
		anim();
	}
	function checkEnemyHealth() {
		if (combat.opponent.health <= 0) {
			combat.opponent.health = 0;
			return false;
		}
	}
	function missed() {
		weapons.projectile(player, player.weapons[player.weaponEquipped])
		if (atkType === 1) {
			if (player.spellsAttack[spellNum].mannaCost > player.manna) {
				goBack("You do not have enough manna. ")
				combat.turns[0] = false;
				buttonVarArray[0] = combat.displaySpells;
				return;
			} else {
				player.manna -= player.spellsAttack[spellNum].mannaCost;
				goBack("You missed! ");
				buttonVarArray[0] = combat.checkRound;
			}
		}
		goBack("You missed! ");
		display.char();
	}
	function atkCheck() {if (atkType === 0) {weaponAtk();} else {spellAtk();}}
}

combat.opponentAttacks = function(atkType, spellNum) {
	combat.turns[1] = true;
	buttonReset();
	if (combat.blocking === true) {
		document.getElementById("battlePrompt").innerHTML = "You block the "+combat.opponent.name+"'s attack with your shield. ";
		combat.blocking = false;
		setButton(0, "Okay.", combat.checkRound);
		return;
	}
	setButton(0, "Okay.", combat.checkRound);
	var attackBonus, dmg;
	var spellBonus = combat.bonus(combat.opponent.iq);
	var defenseBonus = combat.bonus(player.armorClass);
	var crit = 1;
	var roll = rng(10);
	var accuracy = combat.bonus(combat.opponent.dexterity)-combat.bonus(player.dexterity)+50+(roll*5);
	if (combat.opponent.weapons[combat.opponent.weaponEquipped].bonus === 0) {
		attackBonus = combat.bonus(combat.opponent.strength);
	} else {attackBonus = combat.bonus(combat.opponent.dexterity);}
	if (attackBonus <= 1) {attackBonus = 1;}
	if (defenseBonus <= 1) {defenseBonus = 1;}
	var bonus = attackBonus/defenseBonus;
	if (bonus <= 0) {bonus = 0;}
	if (combat.checkStatusPos(player, "blinded") !== false) {accuracy -= 50;}
	if (roll === 10) {
		document.getElementById("battlePrompt").innerHTML = "Critical hit! The "+combat.opponent.name+" attacked you with a ";
		crit = 1.5;
		atkCheck();
	} else if (roll === 1) {
		return missed();
	} else if (accuracy > 50) {
		document.getElementById("battlePrompt").innerHTML = "The "+combat.opponent.name+" attacked you with a ";
		atkCheck();
	} else {return missed();}
	function weaponAtk() {
		weapons.projectile(combat.opponent, combat.opponent.weapons[combat.opponent.weaponEquipped])
		var effect = 0;
		if (combat.opponent.weapons[combat.opponent.weaponEquipped].effect !== false) {
			effect = function() {combat.effect(player, combat.opponent.weapons[combat.opponent.weaponEquipped].effect, combat.opponent.weapons[combat.opponent.weaponEquipped].effectChance)};
		}
		var weaponDmgType = combat.opponent.weapons[combat.opponent.weaponEquipped].dmgType;
		var effectNum = combat.damageresistance(player, weaponDmgType); 
		var anim = function() {combat.opponent.weapons[combat.opponent.weaponEquipped].anim("enemy")}
		document.getElementById("battlePrompt").innerHTML += combat.opponent.weapons[combat.opponent.weaponEquipped].name;
		var dmg = Math.floor((combat.opponent.weapons[combat.opponent.weaponEquipped].use()+bonus)*effectNum*crit)
		immunity(effectNum, weaponDmgType, dmg, effect, anim);
	}
	function spellAtk() {
		var effect = 0;
		if (combat.opponent.spellsAttack[spellNum].effect !== false) {
			effect = function() {combat.effect(player, combat.opponent.spellsAttack[spellNum].effect, combat.opponent.spellsAttack[spellNum].effectChance)}
		}
		var spellDmgType = combat.opponent.spellsAttack[spellNum].dmgType;
		var effectNum = combat.damageresistance(player, spellDmgType);
		var dmg = Math.floor((combat.opponent.spellsAttack[spellNum].use()+bonus)*effectNum*crit);
		var anim = function(){combat.opponent.spellsAttack[spellNum].anim("enemy")};
		document.getElementById("battlePrompt").innerHTML += combat.opponent.spellsAttack[spellNum].name+" spell"
		combat.opponent.manna -= combat.opponent.spellsAttack[spellNum].mannaCost;
		combat.enemyHealthBar();
		immunity(effectNum, spellDmgType, dmg, effect, anim);
	}
	function immunity(effectNum, dmgType, dmg, effect, anim) {
		if (effectNum === 0) {
			document.getElementById("battlePrompt").innerHTML += ". However, you are immune to "+dmgType+" damage.";
			return;
		} else if (effectNum === 0.5) {
			document.getElementById("battlePrompt").innerHTML += ". "+combat.opponent.name+"'s attack wasn't very effective against you";
		} else if (effectNum === 2) {
			document.getElementById("battlePrompt").innerHTML += ". You took a heavy blow from the attack";
		}
		if (dmg <= 0) {
			player.health -= 1;
			document.getElementById("battlePrompt").innerHTML += ". You were barely damaged by "+combat.opponent.name+"'s attack. ";
		} else {
			document.getElementById("battlePrompt").innerHTML += ". You lost "+dmg+" health points. ";
			player.health -= dmg;
		}
		if (checkPlayerHealth() === false) {setButton(0, "Continue.", combat.defeatFunc);} else if (effect !== 0) {buttonVarArray[0] = effect;}
		anim();
	}
	function missed() {
		weapons.projectile(combat.opponent, combat.opponent.weapons[combat.opponent.weaponEquipped]);
		if (atkType === 1) {
			combat.opponent.manna -= combat.opponent.spellsAttack[spellNum].mannaCost;
			combat.enemyHealthBar();
		}
		goBack("The "+combat.opponent.name+" tried to attack you, but it missed!");
	}
	function checkPlayerHealth() {
		if (player.health <= 0) {
			player.health = 0
			return false;
		}
	}
	function atkCheck() {if (atkType === 0) {weaponAtk();} else {spellAtk();}}
}
combat.opponentUseItem = function(itemNum) {
	if (combat.opponent.itemsQuantity[itemNum]>=1) {
		combat.turns[1] = true;
		combat.opponent.items[itemNum].use(combat.opponent, itemNum);
	}
}
combat.damageresistance = function(target, dmgType) {
	if (target.weakness.length === 0) {return 1;}
	for (i=0; i<target.weakness.length; i+=1) {
		var weakType = target.weakness[i];									// 0 = immune, 0.5 = half damage, 1 = normal damage, 2 = double damage
		var effectNum = parseInt(weakType[weakType.length-1]);
		if (effectNum === 1) {effectNum = 0.5;};
		weakType = weakType.slice(0, weakType.length-1);
		if (dmgType === weakType) {return effectNum;}
	}
	return 1;
}
combat.boostTempStat = function(target, amount, rounds, type) {
	if (target === 0) {
		combat.tempStatBoost[type] += amount;
		combat.tempStatBoostRounds[type] = rounds;
		if (type === 0) {
			player.strength += amount;
		} else if (type === 1) {
			player.dexterity += amount;
		} else if (type === 2) {
			player.iq += amount;
		} else if (type === 3) {
			player.armorClass += amount;
		}
	} else {
		combat.opponentTempStatBoost[type] += amount;
		combat.opponentTempStatBoostRounds[type] = rounds;
		if (type === 0) {
			combat.opponent.strength += amount;
		} else if (type === 1) {
			combat.opponent.dexterity += amount;
		} else if (type === 2) {
			combat.opponent.iq += amount;
		} else if (type === 3) {
			combat.opponent.armorClass += amount;
		}
	}
	display.char();
}
combat.removeTempStat = function(target, amount, type) {
	if (target === 0) {
		if (combat.tempStatBoost[type] < amount) {amount = combat.tempStatBoost[type];}
		if (type === 0) {
			player.strength -= amount;
		} else if (type === 1) {
			player.dexterity -= amount;
		} else if (type === 2) {
			player.iq -= amount;
		} else if (type === 3) {
			player.armorClass -= amount;
		}
		combat.tempStatBoost[type] = 0;
		combat.tempStatBoostRounds[type] = "a";
	} else {
		if (combat.opponentTempStatBoost[type] < amount) {amount = combat.opponentTempStatBoost[type];}
		if (type === 0) {
			combat.opponent.strength -= amount;
		} else if (type === 1) {
			combat.opponent.dexterity -= amount;
		} else if (type === 2) {
			combat.opponent.iq -= amount;
		} else if (type === 3) {
			combat.opponent.armorClass -= amount;
		}
		combat.opponentTempStatBoost[type] = 0;
		combat.opponentTempStatBoostRounds[type] = "a";
	}
	display.char();
}
combat.checkTempStat = function(target, boost, rounds, func) {
	var amount, name;
	if (target === player) {name = "Your"} else {name = target.name}
	var txt = name+" stat boost wore off. "
	if (rounds[0] === "a" && rounds[1] === "a" && rounds[2] === "a" && rounds[3] === "a") {
		return func();
	} else {buttonVarArray[0] = func;}
	if (rounds[0] === 0 || rounds[1] === 0 || rounds[2] === 0 || rounds[3] === 0) {
		buttonVarArray[0] = func;
		if (rounds[0] === 0) {
			amount = boost[0];
			target.strength -= amount;
			goBack(txt)
			boost[0] = 0;
			rounds[0] = "a";
		}
		if (rounds[1] === 0) {
			amount = boost[1];
			target.dexterity -= amount;
			goBack(txt)
			boost[1] = 0;
			rounds[1] = "a";
		}
		if (rounds[2] === 0) {
			amount = boost[2];
			target.iq -= amount;
			goBack(txt)
			boost[2] = 0;
			rounds[2] = "a";
		}
		if (rounds[3] === 0) {
			amount = boost[3];
			target.armorClass -= amount;
			goBack(txt)
			boost[3] = 0;
			rounds[3] = "a";
		}
		display.char();
	} else {
		return func();
	}
}
combat.resetTempStat = function() {
	if (combat.tempStatBoost[0] !== 0) {combat.removeTempStat(0, combat.tempStatBoost[0], 0);}
	if (combat.tempStatBoost[1] !== 0) {combat.removeTempStat(0, combat.tempStatBoost[1], 1);}
	if (combat.tempStatBoost[2] !== 0) {combat.removeTempStat(0, combat.tempStatBoost[2], 2);}
	if (combat.tempStatBoost[3] !== 0) {combat.removeTempStat(0, combat.tempStatBoost[3], 3);}
	combat.opponentTempStatBoost = [0,0,0,0];
	combat.opponentTempStatBoostRounds = ["a","a","a","a"];
}
combat.victory = function() {
	document.getElementById("battlePrompt").innerHTML += "You defeated the "+combat.opponent.name+"! You gained "+combat.opponent.experience+" experience points. "
	for (let i=0; i<combat.opponent.weapons.length; i+=1) {
		if (combat.opponent.weapons[i].enemyAtk === true || combat.opponent.weapons[i] === weapons.fist) {combat.opponent.weapons.splice(i,1)}
	}
	currentShop = combat.opponent;
	combat.playerAction = [0,0];
	player.experience += combat.opponent.experience;
	combat.round = 1;
	combat.resetTempStat();
	display.char();
	combat.defeatFunc = gameOver;
	combat.cannotRun = false;
	display.loadButtons();
	for (let i=0; i<world.current.npcArray.length; i+=1) {
		if (world.current.npcArray[i].position === combat.opponent.position && world.current.npcArray[i].posOffset === combat.opponent.posOffset) {
			world.current.npcArray.splice(i,1);
			break;
		}
	}
	buttonReset();
	setButton(0, "Continue.", loadLoot);
}
combat.end = function() {
	combat.active = false;
	document.getElementById("battle").style = "display: none"
	document.getElementById("listQuests").style = "";
	document.getElementById("listButtons").style = "display: none";
}

var dropStr = "";
var dropArr = 0;
var dropArrQuantity = 0;
function dropStuffThru(arr, arrQuantity, str) {
	if (combat.active) {return;}
	dropStr = str;
	dropArr = arr;
	dropArrQuantity = arrQuantity;
	buttonReset();
	display.message.prompt("Click the "+str+" you would like to drop.");
	itemSet(quantityCheck);
}
function dropStuff(arr, arrQuantity, str) {
	var art = "a "
	if (str === "item"){art = "an "}
	else if (str === "armor"){art = "some "}
	document.getElementById("battlePrompt").innerHTML = "Your "+str+"s is full. Do you want to drop "+art+str+"?";
	buttonReset();
	setButton(0, "Yes", dropStuff1);
	setButton(1, "No.", data[player.progress]);
	function dropStuff1() {dropStuffThru(arr, arrQuantity, str);}
}
function quantityCheck(itemNum) {
	if (dropStr === "weapon" && itemNum === 0) {
		display.message.prompt("You cannot drop your fists. ")
		itemSet(quantityCheck);
		return;
	}
	if (dropArrQuantity[itemNum] >= 1) {
		var howMany = window.battlePrompt("How many would you like to drop?");
		var howManyNum = parseInt(howMany);
		if (howManyNum > 0) {
			if (dropArrQuantity[itemNum] === 1 || dropArrQuantity[itemNum] === howManyNum){
				removeStuff(dropArr, dropArrQuantity, itemNum, dropStr);
				document.getElementById("battlePrompt").innerHTML = "The "+dropStr+" has been dropped.";
				return;
			}
		}
		if (100 > howManyNum > 0 && howManyNum < dropArrQuantity[itemNum] && dropArrQuantity[itemNum]>1) {arrQuantity[itemNum] -= howManyNum;} else {return}
	}
	if (dropStr === "item") {loadInventory();} else if (dropStr === "weapon") {loadWeapons();} else {loadArmor();}
}	
function gameOver() {
	document.getElementById("battlePrompt").innerHTML = "You have died. All your inventory, weapons, and armor have been lost. ";
	display.loadButtons();
	setButton(0,"Okay", combat.end)
	player.gold = 0;
	player.items = [];
	player.itemsQuantity = [];
	player.weapons = [];
	player.weaponsQuantity = [];
	player.armor = [];
	player.armorQuantity = [];
	player.armorIsEquipped = [];
	player.armorTypeEquipped = [];
	player.weakness = [];
	player.quests = [];
	player.questProgress = [];
	fillArray(player.flags, 64, false);
	player.weapons[0] = weapons.fist;
	player.weaponEquipped = 0;
	player.health = player.hitPoints;
	player.manna = player.mannaMax;
	player.armorClass = player.defense
	combat.resetTempStat();
	display.char();
	combat.round = 1;
	combat.playerAction = [0,0];
	combat.opponentTempStatBoost = [0,0,0,0];
	combat.opponentTempStatBoostRounds = ["a","a","a","a"];
	combat.turns = [false, false];
	combat.cannotRun = false;
	combat.statusDefeat = false;
	combat.statusVictory = false;
	combat.statusDefeatFunc = false;
	combat.statusVictoryFunc = false;
	world.home.load();
	player.position = [-2,-2]
	display.message.exitDialog();
	for (let i=0; i<world.array.length; i+=1) {
		world.array[i].lastPos = world.array[i].startPos;
	}
//	tournament.reset()
//	guardDeadLoc = "";
//	spices.common = 12;
//	spices.modRare = 20;
//	spices.rare = 4;
	display.loadInventory();
}
function levelUpExpCheck() {var exp = 0; for (i=1; i<=player.level; i+=1){var add = (i*100); exp += add;}; return exp;}
function levelUp() {
	if (levelUpExpCheck() <= player.experience) {
		player.level+=1; 
		player.hitPoints+=player.level; 
		player.mannaMax+=player.level;
		var skillPoints = 10; var str = 0; var dex = 0; var iq = 0; var def = 0; var hp = 0; var manna = 0; 
		document.getElementById("battlePrompt").innerHTML = "You have reached level "+player.level+".";
		buttonReset(); setButton(0, "Continue.", lvlUp)
	} else {
		if (combat.active === true) {
			combat.victoryFunc(); 
			combat.victoryFunc = combat.end();
			combat.active = false; 
			return;
		} else {combat.end();}
	};
	function lvlUp() {
		document.getElementById("battlePrompt").innerHTML = "Choose which stats you would like to boost. You have "+
		skillPoints+" Skill Points remaining."; buttonReset();
		setButton(0, "Apply.", lvlUpApply); 
		setButton(1, "Reset.", lvlUpReset); 
		setButton(2, "Strength (+"+str+")", statBoost); 
		setButton(3, "Dexterity (+"+dex+")", statBoost); 
		setButton(4, "IQ (+"+iq+")", statBoost); 
		setButton(5, "Defense (+"+def+")", statBoost); 
		setButton(6, "Health (+"+hp+")", statBoost); 
		setButton(7, "Manna (+"+manna+")", statBoost); 
		function statBoost(stat) {
			if (skillPoints===0) {
				return;
			} else if (stat===2) {
				str+=1;
			} else if (stat===3) {
				dex+=1;
			} else if (stat===4) {
				iq+=1;
			} else if (stat===5) {
				def+=1;
			} else if (stat===6) {
				hp+=1;
			} else if (stat===7) {
				manna+=1;
			} 
			skillPoints -= 1; 
			lvlUp();
		}
		function lvlUpReset() {skillPoints=10; str=0; dex=0; iq=0; def=0; hp=0; manna=0; lvlUp();}
		function lvlUpApply() {
			if (skillPoints !== 0) {
				document.getElementById("battlePrompt").innerHTML = "You have not used all of your Skill Points.";
				buttonReset(); 
				setButton(0, "Go back.", lvlUp); 
				return;
			}
			player.strength += str; 
			player.dexterity += dex; 
			player.iq += iq; 
			player.defense += def; 
			player.armorClass += def; 
			player.hitPoints += hp; 
			player.mannaMax += manna; 
			player.health = player.hitPoints; 
			player.manna = player.mannaMax; 
			display.char(); 
			document.getElementById("battlePrompt").innerHTML = "Your stats have been boosted."; 
			buttonReset(); setButton(0, "Go back.", back);
			function back() {
				if (combat.active === true) {
					combat.victoryFunc(); 
					combat.victoryFunc = combat.end();
					combat.active = false; 
					combat.defeatFunc = gameOver;
				} else {
					combat.end();
					display.loadStats();
				}
			}
		}
	}
}

var animation = new Object();
animation.particles = [];
animation.melee = function(char) {
	var atkImg = "";
	var atkPos = 100;
	var dir = "left";
	var atkCount = 0;
	var sprite = battleTileXY();
	if (char === "player") {
		char = "enemy";
		atkImg = "playerImg";
		sprite = "background-position: 0 0;"
	} else {
		char = "player";
		atkImg = "enemyImg"
		dir = "right"; 
	}
	function atking() {
		if (atkCount > 70) {
			return;
		} else if (atkCount > 30 && atkCount <= 70) {
			atkPos -= 10;
			atkCount += 1;
			document.getElementById(atkImg).style = dir+": "+atkPos+"; "+sprite+"; ";
			setTimeout(atking,15)			
		} else if (atkCount > 20 && atkCount <= 30) {
			atkCount += 1;
			setTimeout(atking,20)
		} else if (atkCount === 20) {
			atkCount += 1;
			animation.defend(char);
			atking();
		} else {
			atkPos += 20;
			atkCount += 1;
			document.getElementById(atkImg).style = dir+": "+atkPos+"; "+sprite+"; ";
			setTimeout(atking,10)
		}
	}
	atking()
}
animation.defend = function(char) {
	var defImg = "enemyImg";
	var defPos = 100;
	var defDir = "right";
	var defCount = 0;
	var sprite = battleTileXY();
	var healthFunc = combat.enemyHealthBar;
	if (char === "player") {
		defImg = "playerImg"
		defDir = "left";
		healthFunc = display.char;
		sprite = "background-position: 0 0";
	}
	function defending() {
		if (defCount > 24) {
			return;
		} else if (defCount > 8 && defCount <= 24) {
			healthFunc();
			healthFunc = function(){};
			defPos += 5;
			defCount += 1;
			document.getElementById(defImg).style = defDir+": "+defPos+"; "+sprite+"; ";
			setTimeout(defending,5)			
		} else {
			defPos -= 10;
			defCount += 1;
			document.getElementById(defImg).style = defDir+": "+defPos+"; "+sprite+"; ";
			setTimeout(defending,10)			
		}
	}
	defending();
}

function beam() {
	animation.beam("player",0,30,30,30,30,10)
}

animation.beam = function(char,color,urlX,urlY,beamWidth,beamHeight,partCnt) {
	animation.particles = [];
	document.getElementById("particles").innerHTML = "";
	var dir = "left";
	var defended = false;
	var beamCount = 0;
	var backPos = "background-image: url('DWI/effectSet.png'); background-size: 2000% 2000%; background-position: "+(urlX*-beamWidth)+" "+(urlY*-beamHeight)+";"
	if (typeof beamWidth !== "number") {beamWidth = 10;}
	if (typeof beamHeight !== "number") {beamHeight = 10;}
	if (typeof partCnt !== "number") {partCnt = 15;}
	if (char === "player") {
		char = "enemy";
	} else {
		char = "player";
		dir = "right"; 
	}
	for (let i=0; i<partCnt; i+=1) {
		var obj = new Object();
		obj.posX = 200;
		obj.posY = 150;
		obj.vert = null;
		animation.particles[i] = (obj);
	}
	function render(i) {
		if (color === 0) {
			document.getElementById("particles").innerHTML += '<div id="particle'+i+'" style="position: absolute; width: '+beamWidth+'; height: '+beamHeight+'; '+
				dir+': '+animation.particles[i].posX+'; top: '+animation.particles[i].posY+'; z-index: 15; '+backPos+'"></div>';
		} else {
			document.getElementById("particles").innerHTML += '<div id="particle'+i+'" style="position: absolute; width: '+beamWidth+'; height: '+beamHeight+'; '+
				dir+': '+animation.particles[i].posX+'; top: '+animation.particles[i].posY+'; background: '+color+'; z-index: 15;"></div>';
		}
	}
	function initBeam() {
		document.getElementById("particles").innerHTML = "";
		beamCount += 1;
		for (let i=0; i<beamCount; i+=1) {
			animation.particles[i].posX += 25;
			render(i);
		}
		if (beamCount < partCnt) {setTimeout(initBeam,20);} else {setTimeout(blitz,20);}
	}
	function blitz() {
		document.getElementById("particles").innerHTML = "";
		beamCount += 1;
		for (let i=0; i<animation.particles.length; i+=1) {
			var roll = rng(5);
			if (animation.particles[i].posX < 650) {
				animation.particles[i].posX += 25;
			} else if (animation.particles[i].vert === false || roll === 1) {
				animation.particles[i].posX += 25;
				animation.particles[i].vert = false;
			} else if (animation.particles[i].vert === "pos" || roll === 2) {
				animation.particles[i].posX += 25;
				animation.particles[i].posY += 20;
				animation.particles[i].vert = "pos";
			} else if (animation.particles[i].vert === "neg" || roll === 3) {
				animation.particles[i].posX += 25;
				animation.particles[i].posY -= 20;
				animation.particles[i].vert = "neg";
			} else if (animation.particles[i].vert === "posDbl" || roll === 4) {
				animation.particles[i].posX += 25;
				animation.particles[i].posY += 40;
				animation.particles[i].vert = "posDbl";
			} else if (animation.particles[i].vert === "negDbl" || roll === 5) {
				animation.particles[i].posX += 25;
				animation.particles[i].posY -= 40;
				animation.particles[i].vert = "negDbl";
			}
			if (animation.particles[i].posX > 900) {animation.particles.splice(i,1);}
			render(i);
		}
		if (animation.particles[0].posX > 650) {
			if (defended === false) {
				defended = true;
				animation.defend(char);
			}
			if (partCnt === 1) {
				beamCount = 50;
				animation.particles = [];
				document.getElementById("particles").innerHTML = "";
				return;
			}
		}
		if (beamCount < 50) {
			setTimeout(blitz,20);
		} else {
			document.getElementById("particles").innerHTML = "";
			render(i);
			return;
		}
	}
	initBeam();
}
//	animation.areaBlast("player","yellow",0,0,20,20,80);
//	animation.arrow("player")
//	animation.beam("player","blue",0,0,12,12,20)
//	animation.melee()
animation.arrow = function(char) {
	var dir;
	if (char === "player") {dir = "right"} else {dir = "left"};
	animation.beam(char,0,"DWI/arrow-"+dir+".png",100,10,1);
}
animation.bullet = function(char,urlX,urlY) {if (typeof urlX === "number") {animation.beam(char,0,urlX,urlY,10,5,1);} else {animation.beam(char,"black",0,0,10,5,1);}}
animation.areaBlast = function(char,color,urlX,urlY,beamWidth,beamHeight,partCnt) {
	animation.particles = [];
	document.getElementById("particles").innerHTML = "";
	var dir = "left";
	var hitFunc = function() {animation.defend("enemy")};
	var beamCount = 0;
	var shakeCount = 0;
	var partDir = 7;
	var backPos = "background-image: url('DWI/effectSet.png'); background-size: 2000% 2000%; background-position: "+(urlX*-beamWidth)+" "+(urlY*-beamHeight)+";"
	var sprite = "background-position: 0 0;"
	var imgId = "playerImg"
	if (typeof beamWidth !== "number") {beamWidth = 10;}
	if (typeof beamHeight !== "number") {beamHeight = 10;}
	if (typeof partCnt !== "number") {partCnt = 15;}
	if (char !== "player") {
		sprite = battleTileXY();
		hitFunc = function() {animation.defend("player")};
		imgId = "enemyImg";
		dir = "right";
	}
	function render(i) {
		if (color === 0) {
			document.getElementById("particles").innerHTML += '<div id="particle'+i+'" style="position: absolute; width: '+beamWidth+'; height: '+beamHeight+'; '+
				dir+': '+animation.particles[i].posX+'; top: '+animation.particles[i].posY+'; z-index: 15; '+backPos+'"></div>';
		} else {
			document.getElementById("particles").innerHTML += '<div id="particle'+i+'" style="position: absolute; width: '+beamWidth+'; height: '+beamHeight+'; '+
				dir+': '+animation.particles[i].posX+'; top: '+animation.particles[i].posY+'; background: '+color+'; z-index: 15;"></div>';
		}
	}
	function shake() {
		shakeCount += 1;
		if (shakeCount > 50) {
			return;
		} else if (shakeCount === 20) {
			initBeam();
			move();
			setTimeout(hitFunc,800);
		}
		var offsetX = 100;
		var offsetY = 75;
		var roll = rng(8);
		if (roll === 1) {
			offsetX += 5;
		} else if (roll === 2) {
			offsetX -= 5;
		} else if (roll === 3) {
			offsetY += 5;
		} else if (roll === 4) {
			offsetY -= 5;
		} else if (roll === 5) {
			offsetX += 5;
			offsetY += 5;
		} else if (roll === 6) {
			offsetX += 5;
			offsetY -= 5;
		} else if (roll === 7) {
			offsetX -= 5;
			offsetY += 5;
		} else if (roll === 8) {
			offsetX -= 5;
			offsetY -= 5;
		}
		document.getElementById(imgId).style = dir+": "+offsetX+"; top: "+offsetY+"; "+sprite;
		setTimeout(shake,50)
	}
	function initBeam() {
		if (beamCount > partCnt) {
			if (animation.particles.length > 0) {
				move(); 
				setTimeout(initBeam,10);
			}
			return;
		}
		var obj = new Object();
		obj.posX = 220;
		obj.posY = 170;
		obj.dirX = null;
		obj.dirY = null;
		animation.particles.push(obj);
		var l = animation.particles.length-1;
		if (partDir > 16) {partDir = 1}
		if (partDir === 1) {
			animation.particles[l].dirX = false;
			animation.particles[l].dirY = "pos2";
		} else if (partDir === 2) {
			animation.particles[l].dirX = "pos";
			animation.particles[l].dirY = "pos2";
		} else if (partDir === 3) {
			animation.particles[l].dirX = "pos2";
			animation.particles[l].dirY = "pos2";
		} else if (partDir === 4) {
			animation.particles[l].dirX = "pos2";
			animation.particles[l].dirY = "pos";
		} else if (partDir === 5) {
			animation.particles[l].dirX = "pos2";
			animation.particles[l].dirY = false;
		} else if (partDir === 6) {
			animation.particles[l].dirX = "pos2";
			animation.particles[l].dirY = "neg";
		} else if (partDir === 7) {
			animation.particles[l].dirX = "pos2";
			animation.particles[l].dirY = "neg2";
		} else if (partDir === 8) {
			animation.particles[l].dirX = "pos";
			animation.particles[l].dirY = "neg2";
		} else if (partDir === 9) {
			animation.particles[l].dirX = false;
			animation.particles[l].dirY = "neg2";
		} else if (partDir === 10) {
			animation.particles[l].dirX = "neg";
			animation.particles[l].dirY = "neg2";
		} else if (partDir === 11) {
			animation.particles[l].dirX = "neg2";
			animation.particles[l].dirY = "neg2";
		} else if (partDir === 12) {
			animation.particles[l].dirX = "neg2";
			animation.particles[l].dirY = "neg";
		} else if (partDir === 13) {
			animation.particles[l].dirX = "neg2";
			animation.particles[l].dirY = false;
		} else if (partDir === 14) {
			animation.particles[l].dirX = "neg2";
			animation.particles[l].dirY = "pos";
		} else if (partDir === 15) {
			animation.particles[l].dirX = "neg2";
			animation.particles[l].dirY = "pos2";
		} else if (partDir === 16) {
			animation.particles[l].dirX = "neg";
			animation.particles[l].dirY = "pos2";
		}
		partDir += 1;
		beamCount += 1;
		move();
		setTimeout(initBeam,10);
	}
	function move() {
		document.getElementById("particles").innerHTML = "";
		if (animation.particles.length === 0) {return;}
		for (i=0; i<animation.particles.length; i+=1) {
			if (animation.particles[i].dirX === "pos") {
				animation.particles[i].posX += 20;
			} else if (animation.particles[i].dirX === "neg") {
				animation.particles[i].posX -= 20;
			} else if (animation.particles[i].dirX === "pos2") {
				animation.particles[i].posX += 30;
			} else if (animation.particles[i].dirX === "neg2") {
				animation.particles[i].posX -= 30;
			}
			if (animation.particles[i].dirY === "pos") {
				animation.particles[i].posY += 8;
			} else if (animation.particles[i].dirY === "neg") {
				animation.particles[i].posY -= 8;
			} else if (animation.particles[i].dirY === "pos2") {
				animation.particles[i].posY += 20;
			} else if (animation.particles[i].dirY === "neg2") {
				animation.particles[i].posY -= 20;
			}
			render(i);
		}
		for (i=0; i<animation.particles.length; i+=1) {
			if (animation.particles[i].posX < 30 || animation.particles[i].posX > 680 || animation.particles[i].posY < 30 || animation.particles[i].posY > 330) {
				animation.particles.splice(i,1);
				if (animation.particles.length === 0) {document.getElementById("particles").innerHTML = "";}
			}
		}
	}
	shake();
}
function playerChar() {
	char = new Object();
	char.name = "";
	char.level = 1;
	char.race = "";
	char.class = "Mage";
	char.strength = 10;
	char.dexterity = 10;
	char.iq = 10;
	char.health = 30;
	char.hitPoints = 30;
	char.manna = 30;
	char.mannaMax = 30;
	char.defense = 10;
	char.armorClass = 10;
	char.experience = 1000;
	char.progress = 0;
	char.items = [];
	char.itemsQuantity = [];
	char.weapons = [weapons.fist];
	char.weaponsQuantity = [1];
	char.weaponEquipped = 0;				//weaponEquipped is weapon's position in weapons list.
	char.armor = [];
	char.armorQuantity = [];
	char.armorIsEquipped = [];
	char.armorTypeEquipped = [];
	char.spells = [];
	char.spellsAttack = [];
	char.weakness = [];
	char.status = []
	char.statusRounds = []
	char.gold = 0;
	char.quests = [];
	char.questProgress = [];
	char.flags = [];	fillArray(char.flags, 64, false);
	char.position = [0,0];
	char.direction = 0;
	char.size = 20;
	char.currentWorld = 1;
	return char;
};
var player = playerChar();

var tournament = {
	fighters: [],
	names: ["Donkey Kong","Charizard","Obi Wan Shinobi","Ganondorf","Link","Tanjiro","Ulfric Stormcloak"],
	tier: 1,
	order: [],
	choose: [0,1,2,3,4,5,6,7],
	select: function() {
		for (i=0; i<8; i+=1) {
			var choice = (rng(8-i)-1)
			this.order.push(this.choose[choice]);
			this.choose.splice(choice,1);
		}
	},
	tierTwo: function() {
		this.tier += 1;
		for (i=0; i<this.order.length; i+=2) {
			if (this.order[i] === 7 || this.order[i+1] === 7) {
				this.order[i] = 7;
				this.order[i+1] = "a";
			} else {
				var lose = rng(2)-1
				this.order[i+lose] = "a";
			}
		}
		for (i=0; i<this.order.length; i+=1) {
			if (this.order[i] === "a") {
				this.order.splice(i,1);
				i-=1;
			}
		}
	},
	setFighters: function() {
		for (let j=0; j<this.names.length; j+=1) {
			for (let i=0; i<world.current.npcArray.length; i+=1) {
				if (world.current.npcArray[i].name === this.names[j]) {
					this.fighters.push(i);
				}
			}
		}
		this.fighters.push(0);
		this.names.push(0);
	},
	reset: function() {
		this.tier = 1;
		this.order = [];
		this.choose = [0,1,2,3,4,5,6,7];
	}
}

var npc = new Object()
npc.array = [];
npc.create = function() {
	var n = {
		name: "",
		type: "npc",
		position: [0,0],
		posOffset: [0,0],
		spawnPos: [0,0],
		spawnOffset: [0,0],
		dir: 0,
		color: "blue",
		size: 20,
		speed: 8,
		moveCount: 0,
		elementId: "",
		isOnscreen: false,
		scriptRunning: false,
		count: 0,
		script: function() {}
	}
	return n;
}
npc.createNPC = function() {
	var n = npc.create();
	n.type = "npc";
	n.color = "blue";
	return n;
}
npc.createEnemy = function() {
	var n = npc.create();
	n.type = "enemy";
	n.color = "red";
	n.attackString = "";
	return n;
}
npc.goblin = function() {
	var g = npc.createEnemy();
	g = enemy.goblin(g);
	g.size = 15;
	g.sprite = [2,0];
	g.script = function() {if (g.isOnscreen && !g.scriptRunning) {npc.move.toward(g)};}
	return g;
}
npc.guardEnemy = function() {
	var s = npc.createEnemy();
	s = enemy.guard(s);
	s.name = "Palace Guard";
	s.sprite = [3,0];
	s.script = function() {if (g.isOnscreen && !g.scriptRunning) {npc.move.toward(g)};}
	return s;
}
npc.giantRat = function() {
	var e = npc.createEnemy();
	e = enemy.giantRat(e);
	e.size = 15;
	e.sprite = [1,4];
	e.script = function() {if (e.isOnscreen && !e.scriptRunning) {npc.move.toward(e)};}
	return e;
}
npc.giantSpider = function() {
	var e = npc.createEnemy();
	e = enemy.giantSpider(e);
	e.size = 15;
	e.sprite = [1,1];
	e.script = function() {if (e.isOnscreen && !e.scriptRunning) {npc.move.toward(e)};}
	return e;
}
npc.frostSpider = function() {
	var e = npc.createEnemy();
	e = enemy.frostSpider(e);
	e.size = 15;
	e.sprite = [1,1];
	e.script = function() {if (e.isOnscreen && !e.scriptRunning) {npc.move.toward(e)};}
	return e;
}
npc.wizard = function() {
	var e = npc.createEnemy();
	e = enemy.wizard(e);
	e.size = 15;
	e.sprite = [6,0];
	e.script = function() {if (e.isOnscreen && !e.scriptRunning) {npc.move.toward(e)};}
	return e;
}
npc.babyDragon = function() {
	var e = npc.createEnemy();
	e = enemy.babyDragon(e);
	e.size = 15;
	e.sprite = [0,1];
	e.script = function() {if (e.isOnscreen && !e.scriptRunning) {npc.move.toward(e)};}
	return e;
}
npc.wolf = function() {
	var e = npc.createEnemy();
	e = enemy.wolf(e);
	e.size = 15;
	e.sprite = [2,1];
	e.script = function() {if (e.isOnscreen && !e.scriptRunning) {npc.move.toward(e)};}
	return e;
}
npc.donkeyKong = function() {
	var e = npc.createEnemy();
	e = enemy.donkeyKong(e);
	e.size = 15;
	e.sprite = [3,1];
	e.script = function() {if (e.isOnscreen && !e.scriptRunning) {npc.move.toward(e)};}
	return e;
}
npc.charizard = function() {
	var e = npc.createEnemy();
	e = enemy.charizard(e);
	e.size = 15;
	e.sprite = [0,1];
	e.script = function() {if (e.isOnscreen && !e.scriptRunning) {npc.move.toward(e)};}
	return e;
}
npc.obiWanShinobi = function() {
	var e = npc.createEnemy();
	e = enemy.obiWanShinobi(e);
	e.size = 15;
	e.sprite = [6,0];
	e.script = function() {if (e.isOnscreen && !e.scriptRunning) {npc.move.toward(e)};}
	return e;
}
npc.ganondorf = function() {
	var e = npc.createEnemy();
	e = enemy.ganondorf(e);
	e.size = 15;
	e.sprite = [5,0];
	e.script = function() {if (e.isOnscreen && !e.scriptRunning) {npc.move.toward(e)};}
	return e;
}
npc.link = function() {
	var e = npc.createEnemy();
	e = enemy.link(e);
	e.size = 15;
	e.sprite = [4,0];
	e.script = function() {if (e.isOnscreen && !e.scriptRunning) {npc.move.toward(e)};}
	return e;
}
npc.tanjiro = function() {
	var e = npc.createEnemy();
	e = enemy.tanjiro(e);
	e.size = 15;
	e.sprite = [1,0];
	e.script = function() {if (e.isOnscreen && !e.scriptRunning) {npc.move.toward(e)};}
	return e;
}
npc.ulfricStormcloak = function() {
	var e = npc.createEnemy();
	e = enemy.ulfricStormcloak(e);
	e.size = 15;
	e.sprite = [7,0];
	e.script = function() {if (e.isOnscreen && !e.scriptRunning) {npc.move.toward(e)};}
	return e;
}
npc.mrMeeseeks = function() {
	var e = npc.createEnemy();
	e = enemy.mrMeeseeks(e);
	e.size = 15;
	e.sprite = [1,0];
	e.script = function() {if (e.isOnscreen && !e.scriptRunning) {npc.move.toward(e)};}
	return e;
}
npc.guard = function() {
	var s = npc.createNPC();
	s.name = "Palace Guard";
	s.script = function() {
		if (display.message.speaking === false) {display.message.set('Press "E" to speak.')}
		buttons.keys[4] = npc.guard.d1;
	}
	return s;
}
npc.guard.d1 = function() {
	buttonReset();
	display.message.enterDialog()
	if (quests.findProgress(1) >= quests.array[1].length) {
		display.message.set("Hey, so how was the tournament?");
		setButton(0, "It was great! I won first place.", next);
		function next() {
			display.message.set("Did you take an arrow to the knee?");
			setButton(0, "Ugh.", display.message.exitDialog);
		}
	} else if (quests.findProgress(1) !== false) {
		display.message.set("You should go talk to the steward about the tournament.");
		setButton(0, "Okay.", display.message.exitDialog);
	} else {
		display.message.set("I used to be an adventurer like you once, but then I took an arrow to the knee.");
		setButton(0, "Yeah. Arrows suck. My sword would have taken your knee off.", npc.guard.d2);
		setButton(1, "Cool story, bro.", display.message.exitDialog);
		setButton(2, "What are you doing here?.", npc.guard.d3);
	}
}
npc.guard.d2 = function() {
	display.message.set("Then I guess I was fortunate.")
	buttonReset();
	setButton(0, "What are you doing here?.", npc.guard.d3);
	setButton(1, "Okay. Bye!", display.message.exitDialog);
}
npc.guard.d3 = function() {
	display.message.set("Well, I'm a guard. I'm guarding. It's my job to ask you what you're doing here. So, what are you doing here?",2);
	buttonReset();
	setButton(0, "I don't know.", npc.guard.d4);
	setButton(1, "Well, what is there to do here?", npc.guard.d5);
	setButton(2, "I guess I'll be leaving.", display.message.exitDialog);
}
npc.guard.d4 = function() {
	display.message.set("Might I make a suggestion?");
	buttonReset();
	setButton(0, "Sure.", npc.guard.d5);
	setButton(1, "No.", npc.guard.d6);
	setButton(2, "Does this have anything to do with arrows?.", arrows);
	function arrows() {
		display.message.set("No... Yes... Maybe... I don't know. Do you want to hear it?");
		document.getElementById("button2").style = "display: none";
	}
}
npc.guard.d5 = function() {
	var str = "The king is hosting a tournament tonight. The grand prize is 1000 gold coins and the Sword of Embers. You should enter the tournament. They still "+
		"need one more fighter."
	display.message.set(str,3);
	buttonReset();
	setButton(0, "That sounds like fun.", npc.guard.d7);
	setButton(1, "Not interested.", npc.guard.d6);
}
npc.guard.d6 = function() {
	display.message.set("Very well. You should head back to town square. ");
	buttonReset();
	setButton(0, "Cool. See ya.", display.message.exitDialog);
}
npc.guard.d7 = function() {
	display.message.set("Great! I'll open the gate for you. Enter the palace courtyard and talk to the king's steward to register. ",2);
	buttonReset();
	setButton(0, "Okay.", open);
	function open() {
		world.current.array[19][30][0] = tiles.concrete();
		quests.add(1);
		display.message.exitDialog();
	}
}
npc.guard.d8 = function() {
	display.message.enterDialog();
	display.message.set("I also used to be an adventurer like you once, but then I also took an arrow to the knee.");
	buttonReset();
	setButton(0, "Seriously? Nevermind. I don't want to talk to you.", display.message.exitDialog);
}
npc.guardArena = function() {
	var s = npc.createNPC();
	s.name = "Palace Guard";
	s.script = function() {
		if (player.flags[0] === false) {
			player.flags[0] = true;
			npc.guardArena.d1();
		}
	}
	return s;
}
npc.guardArena.d1 = function() {
	if (quests.findProgress(1) >= 4) {
		display.message.enterDialog();
		npc.guardArena.d4();
		return;
	} else if (quests.findProgress(1) > 1) {
		display.message.enterDialog();
		npc.guardArena.d3();
		setButton(0, "Okay.", display.message.exitDialog);
		return;
	}
	display.message.enterDialog();
	display.message.set("Hey! Where are you going? Is your name on the list?")
	buttonReset();
	var list = false;
	setButton(0, "What list?", whatList);
	setButton(1, "Yes, it is.", newAdd);
	setButton(2, "No, it isn't.", npc.guardArena.d2);
	setButton(3, "I don't know. My name is "+player.name+".", justAdd);
	if (quests.findProgress(1) > 2) {npc.guardArena.d4();}
	function whatList() {
		if (list === false) {
			display.message.set("The list of people competing in the tournament. Is your name on it? ");
			buttonReset();
			setButton(0, "Yes, it is.", newAdd);
			setButton(1, "No, it isn't.", npc.guardArena.d2);
			setButton(2, "I don't know. My name is "+player.name+".", justAdd);
		}
	}
	function onList() {
		display.message.set("Hmm. You're "+player.name+"? ",1);
		buttonReset();
		if (quests.findProgress(1) < 1) {setButton(0, "Yes.", npc.guardArena.d5);} else {setButton(0, "Yes.", npc.guardArena.d3);}
	}
	function justAdd() {
		if (quests.findProgress(1) < 1) {
			npc.guardArena.d5();
		} else {
			onList();
			document.getElementById("messsage").innerHTML += "Yes, you're on here. You must have just been added. ";
		}
	}
	function newAdd() {
		if (quests.findProgress(1) < 1) {
			npc.guardArena.d5();
		} else {
			onList();
			document.getElementById("message").innerHTML += "You must be the new addition. ";
		}
	}
}
npc.guardArena.d2 = function() {
	display.message.set("Well then you cannot go in here. ");
	buttonReset();
	setButton(0, "Okay.", display.message.exitDialog);
}
npc.guardArena.d3 = function() {
	display.message.set("You had better get on the field. The tournament is about to start. ");
	buttonReset();
	setButton(0, "Okay.", done);
	function done() {
		display.message.exitDialog();
		if (quests.findProgress(1) === 1) {quests.update(1);}
	}
}
npc.guardArena.d4 = function() {
	display.message.enterDialog();
	display.message.set("Hey! Where are you going? The tournament is over. You cannot go in there.");
	buttonReset();
	setButton(0, "Okay.", display.message.exitDialog);
}
npc.guardArena.d5 = function() {
	display.message.set("You're not on the list. You cannot go in there.");
	buttonReset();
	setButton(0, "Okay.", display.message.exitDialog);
}
npc.steward = function() {
	var s = npc.createNPC();
	s.name = "Steward";
	s.script = function() {
		if (display.message.speaking === false) {display.message.set('Press "E" to speak.')}
		buttons.keys[4] = npc.steward.d1;
	}
	return s;
}
npc.steward.d1 = function() {
	display.message.enterDialog()
	buttonReset();
	if (quests.findProgress(1) === 3) {
		display.message.set("Congratulations, Tournament Champion! You were pretty good out there. ");
		setButton(0, "Yeah, I'm a badass!", display.message.exitDialog);
	} else if (quests.findProgress(1) === 1) {
		display.message.set("What are you waiting for? Get to the arena! The tournament is starting!");
		setButton(0, "Okay.", display.message.exitDialog);
	} else {
		display.message.set("Yes? Who are you and what the hell do you want? I'm very busy.");
		setButton(0, "I'm here for the tournament.", npc.steward.d8);
		setButton(1, "Why are you so busy? Can I help?.", npc.steward.d7);
		setButton(2, "Hi. How's the weather?.", npc.steward.d2);
		setButton(3, "Well, fuck you too!", npc.steward.d3);
		setButton(4, "Nevermind.", display.message.exitDialog);
	}
}
npc.steward.d2 = function() {
	display.message.set("Are you serious? Get out of my face! ");
	buttonReset();
	setButton(0, "Okay.", display.message.exitDialog);
}
npc.steward.d3 = function() {
	display.message.set("Who the hell do you think you are?!?");
	buttonReset();
	setButton(0, "Bitch! You started it!", npc.steward.d4);
	setButton(1, "I'm sorry. I don't know what came over me.", npc.steward.d2);
}
npc.steward.d4 = function() {
	display.message.set("Guards! Arrest this man immediately!");
	buttonReset();
	setButton(0, "But I didn't do anything!", npc.steward.d5);
}
npc.steward.d5 = function() {
	display.message.set("My word is law! You will rot in my dungeon!");
	buttonReset();
	setButton(0, "Continue.", npc.steward.d6);
}
npc.steward.d6 = function() {
	display.message.set("The guards beat you and knock you unconscious. They throw you in the dungeon and slam the door to your cell.");
	buttonReset();
	setButton(0, "Continue.", gameOver);
}
npc.steward.d7 = function() {
	display.message.set("I am short one fighter for the tournament. If we have to postpone, the king will be furious.");
	buttonReset();
	setButton(0, "That's great! I'm here to fight in the tournament.", npc.steward.d8);
	setButton(1, "Sorry. Can't help you.", display.message.exitDialog);
}
npc.steward.d8 = function() {
	display.message.set("Really? That's fantastic! Sign this paper and head over to the arena. We're about to start soon. ");
	buttonReset();
	setButton(0, "Okay.", addQuest);
	function addQuest() {
		quests.update(1);
		display.message.exitDialog();
	}
}
npc.steward.d9 = function() {
	var oppName;
	var oppNum;
	for (i=0; i<8; i+=2) {
		if (tournament.order[i+1] === 7) {
			oppName = tournament.names[tournament.order[i]];
			oppNum = i;
		} else if (tournament.order[i] === 7) {
			oppName = tournament.names[tournament.order[i+1]];
			oppNum = i+1;
		}
	}
	display.message.set("Will "+player.name+" and "+oppName+" please take your positions and prepare for combat?");
	buttonReset();
	setButton(0, "Take your position.", fight);
	function fight() {
		combat.victoryFunc = npc.steward.d10;
		buttonReset();
		var num = tournament.order[oppNum];
		npc.move.to(world.current.npcArray[num],9,10);
		setTimeout(fightNow,2000);
		function fightNow() {
			display.message.set(player.name+" and "+oppName+", you must now fight to the death!");
			setButton(0,"Continue",fighting)
			function fighting() {
				world.current.npcArray[num].script = function() {if (this.isOnscreen && !this.scriptRunning) {npc.move.toward(this)};}
				npc.move.to(world.current.npcArray[world.npcNameCheck("Steward")],14,11);
				display.message.exitDialog();
			}
		}
	}
}
npc.steward.d10 = function() {
	combat.end();
	npc.move.to(world.current.npcArray[world.npcNameCheck("Steward")],9,10);
	tournament.tierTwo();
	var nameSpots = [];
	for (let i=0; i<4; i+=1) {
		if (tournament.names[i] !== 0) {
			nameSpots[i] = world.npcNameCheck(tournament.names[i])
		}
	}
	var nums = [0,1,2,3,4,5,6]
	for (let i=0; i<nums.length; i+=1) {
		if (nameSpots[i] !== nums[i]) {
			nums.splice(i,1)
			i-=i
		}
	}
	for (let i=0; i<nums.length; i+=1) {
		world.current.npcArray.splice(nums[i],1)
	}
for (let i=0; i<world.current.npcArray.length; i+=1) {log(world.current.npcArray[i].name)}
	var count = 4;
	var t1 = decompress();
	var t2 = decompress();
	var t3 = decompress();
	var t4 = decompress();
	var oppName;
	var oppNum;
	for (i=0; i<4; i+=2) {
		if (tournament.order[i+1] === 7) {
			oppName = tournament.names[tournament.order[i]];
			oppNum = i;
		} else if (tournament.order[i] === 7) {
			oppName = tournament.names[tournament.order[i+1]];
			oppNum = i+1;
		}
	}
	setTimeout(speak,2000)
	function speak() {
		display.message.enterDialog();
		display.message.set("The first tier of the tournament is over. The victors are "+t1+", "+t2+", "+t3+", and "+t4+". In the second tier of the tournament, "+t1+
			" shall fight "+t2+" and "+t3+" shall fight "+t4+". Will "+player.name+" and "+oppName+" please take their positions on the field?");
		buttonReset();
		setButton(0, "Continue.", fight);
		display.loadButtons();
	}
	function decompress() {
		count -= 1;
		if (tournament.names[tournament.order[count]] === 0) {
			return player.name;
		} else {
			return tournament.names[tournament.order[count]];
		}
	}
	function fight() {
		display.message.exitDialog();
		world.current.start = false;
		world.current.array[9][9][1] = function() {
			if (world.current.start !== true) {
				world.current.start = true;
				display.message.enterDialog();
				combat.victoryFunc = npc.steward.d11;
				buttonReset();
				var num = world.npcNameCheck(tournament.names[tournament.order[oppNum]]);
				display.message.set(player.name+" and "+oppName+", you must now fight to the death!");
				setButton(0,"Continue",fighting)
				function fighting() {
					world.current.npcArray[num].script = function() {if (this.isOnscreen && !this.scriptRunning) {npc.move.toward(this)};}
					npc.move.to(world.current.npcArray[world.npcNameCheck("Steward")],14,11);
					display.message.exitDialog();
				}
			}
		}
	}
}
npc.steward.d11 = function() {
	if (tournament.tier === 2) {tournament.tierTwo();}
	var oppName;
	var oppNum;
	if (tournament.order[1] === 7) {
		oppName = tournament.names[tournament.order[0]];
		oppNum = 0;
	} else {
		oppName = tournament.names[tournament.order[1]];
		oppNum = 1;
	}
	display.message.set("The second tier of the tournament is over. Our finalists are "+player.name+" and "+oppName+". Would you please take your positions on the field?");
	buttonReset();
	setButton(0, "Take your position.", fight);
	function fight() {
		combat.victoryFunc = npc.steward.d12;
		buttonReset()
		var num = world.npcNameCheck(tournament.names[tournament.order[oppNum]]);
		npc.move.to(world.current.npcArray[num],9,10);
		setTimeout(fightNow,2000);
		function fightNow() {
			display.message.set(player.name+" and "+oppName+", you must now fight to the death!");
			setButton(0,"Continue",fighting)
			function fighting() {
				world.current.npcArray[num].script = function() {if (this.isOnscreen && !this.scriptRunning) {npc.move.toward(this)};}
				npc.move.to(world.current.npcArray[world.npcNameCheck("Steward")],14,11);
				display.message.exitDialog();
			}
		}
	}
}
npc.steward.d12 = function() {
	alert("these chicks dont even know the name of my band")
}

//	Mike- Human- Warrior- 1- 0- 10- 200- 15- 10- 15- 30- 30- 30- 30- 0- 0- 0- 0- 1- 0- 1- 0- 0- 0- 0- 4- 5- 2- 150- 200- 0- 1- 1- 2- 0- 1- 43- 46- 11- 12- 5- 5- 5- 5- 5- 5- 2- 10- 14- 5- 5- 45- 0- 7- 4- 5- 5- 5- 40- 0- 1- 13- 1- 2- 1- 1- 1- 2- 9- 10- 14- 22- 3- 3- 5- 5- 20- 2- 1- 10- 13- 1- 1- 1- t- f- f- f- f- f- f- f- f- f- f- f- f- f- f- f- f- f- f- f- f- f- f- f- f- f- f- f- f- f- f- f- f- f- f- f- f- f- f- f- f- f- f- f- f- f- f- f- f- f- f- f- f- f- f- f- f- f- f- f- f- f- f- f

npc.oakloftKing = function() {
	var s = npc.createNPC();
	s.name = "King of Oakloft";
	s.script = function() {
		if (display.message.speaking === false) {display.message.set('Press "E" to speak.')}
		buttons.keys[4] = npc.oakloftKing.d1;
	}
	return s;
}
npc.oakloftKing.d1 = function() {
	display.message.enterDialog();
	display.message.set("I cannot be bothered with the citizenry. If you need something, talk to my steward. ");
	buttonReset();
	setButton(0, "Okay.", display.message.exitDialog);
}
npc.oakloftKing.d2 = function() {
	display.message.enterDialog();
	display.message.set("Welcome to the Oakloft Tournament! Today we will have eight valiant warriors compete for glory, honor, and, of course, money!",2);
	buttonReset();
	setButton(0, "Continue.", next);
	function next() {
		display.message.set("The champion of the tournament will win 1000 gold coins and the legendary Sword of Embers. ",2)
		buttonReset();
		setButton(0, "Continue.", npc.oakloftKing.d3);
	}
}
npc.oakloftKing.d3 = function() {
	tournament.setFighters();
	tournament.select();
	var count = 8;
	display.message.set("In the first tier of fighting, it shall be "+decompress()+" versus "+decompress()+", "+decompress()+" versus "+decompress()+", "+decompress()+
		" versus "+decompress()+", and "+decompress()+" versus "+decompress()+". They will fight to the death for our amusement! Let the games begin!")
	buttonReset();
	setButton(0, "Continue.", switching);
	function decompress() {
		count -= 1;
		if (tournament.names[tournament.order[count]] === 0) {
			return player.name;
		} else {return tournament.names[tournament.order[count]];}
	}
	function switching() {
		var king = world.npcNameCheck("King of Oakloft");
		var steward = world.npcNameCheck("Steward");
		buttonReset();
		npc.move.to(world.current.npcArray[king],14,10);
		setTimeout(stewardMove,1500)
		function stewardMove() {
			npc.move.to(world.current.npcArray[steward],9,10);
			setTimeout(npc.steward.d9,2000)
		}
	}
}
npc.oakloftKing.d4 = function() {
	
}

npc.array = [
	npc.goblin,npc.guardEnemy,npc.giantRat,npc.giantSpider,npc.frostSpider,npc.wizard,npc.babyDragon,npc.wolf,npc.donkeyKong,npc.charizard,npc.obiWanShinobi,
	npc.ganondorf,npc.link,npc.tanjiro,npc.ulfricStormcloak,npc.mrMeeseeks
];
npc.move = {
	scroll: function(n) {
		if (n.dir === 0) {
			n.posOffset[0] += n.speed;
		} else if (n.dir === 1) {
			n.posOffset[1] += n.speed;
		} else if (n.dir === 2) {
			n.posOffset[0] -= n.speed;
		} else if (n.dir === 3) {
			n.posOffset[1] -= n.speed;
		}
		for (i=0; i<2; i+=1) {
			if (n.posOffset[i] >= 100-n.size) {
				n.posOffset[i] -= 100;
				n.position[i] -= 1;
				n.moveCount -= 1;
			} else if (n.posOffset[i] < 0+n.size) {
				n.posOffset[i] += 100;
				n.position[i] += 1;
				n.moveCount -= 1;
			}
		}
	},
	checkCollision: function(n) {
		var offsetX = n.position[0]+11
		var offsetY = n.position[1]+7
		var offset = 0;
		if (n.dir === 0 && n.posOffset[1] <= 0) {
			offsetY += 1;
		} else if (n.dir === 1 && n.posOffset[0] <= 0) {
			offsetX += 1;
		} else if (n.dir === 2 && n.posOffset[1] > 100-n.size) {
			offsetY -= 1;
		} else if (n.dir === 3 && n.posOffset[0] > 100-n.size) {
			offsetX -= 1;
		}
		if (offsetX === 0 || offsetY === 0) {
			return false;
		}
		return world.current.array[offsetX][offsetY][0].canWalk;
	},
	toward: function(g) {
		if (combat.active === true) {return;}
		var distance;
		var playerX = tiles.worldOffset()[0]-12.5
		var playerY = tiles.worldOffset()[1]-8.25
		var diffX = playerX-g.position[0]
		var diffY = playerY-g.position[1]
		var scrollX = 0;
		var offX = (g.posOffset[0]-tiles.offset[0])/100
		var offY = (g.posOffset[1]-tiles.offset[1])/100
		if (diffX < 0) {
			offX += 1;
		}
		if (diffY < 0) {
			offY += 1;
		}
			distance = Math.sqrt((diffX+offX)**2 + (diffY+offY)**2)
		if (distance < 0.3) {
			combat.challenge(g)
		} else if (distance <= 1.8 && (Math.abs(offX) >= 0 || Math.abs(offY) >= 0)) {
			if (diffX+offX < 0.1) {
				g.dir = 0;
				if (npc.move.checkCollision(g) === true) {
					npc.move.scroll(g);
				}
			} else if (diffX+offX > 0) {
				g.dir = 2; 
				if (npc.move.checkCollision(g) === true) {
					npc.move.scroll(g);
				}
			}
			if (diffY+offY < 0.1) {
				g.dir = 1;
				if (npc.move.checkCollision(g) === true) {
					npc.move.scroll(g);
				}
			} else if (diffY+offY > 0.1) {
				g.dir = 3; 
				if (npc.move.checkCollision(g) === true) {
					npc.move.scroll(g);
				}
			}
		} else {npc.move.random(g)}
	},
	random: function (n) {
		if (!n.isOnscreen) {return;}
		if (n.count > 0) {n.count -= 1; return;}
		if (n.moveCount <= 0 || npc.move.checkCollision(n) !== true) {
			n.dir = rng(4)-1;
			n.moveCount = rng(10);
			n.count = rng(10)*16
		} else if (npc.move.checkCollision(n) === true) {npc.move.scroll(n);}
	},
	to: function(n,toX,toY) {
		if (n.position[0]+11 === toX && n.position[1]+7 === toY || combat.active === true) {
			return;
		}
		if (n.position[0]+11 > toX) {
			n.dir = 0;
			if (npc.move.checkCollision(n) === true) {npc.move.scroll(n);}
		} else if (n.position[0]+11 < toX) {
			n.dir = 2;
			if (npc.move.checkCollision(n) === true) {npc.move.scroll(n);}
		}
		if (n.position[1]+7 > toY) {
			n.dir = 1;
			if (npc.move.checkCollision(n) === true) {npc.move.scroll(n);}
		} else if (n.position[1]+7 < toY) {
			n.dir = 3;
			if (npc.move.checkCollision(n) === true) {npc.move.scroll(n);}
		}
		setTimeout(resetFunc,50);
		function resetFunc() {npc.move.to(n,toX,toY);}
	},
}


//	Mike- Human- Warrior- 1- 0- 10- 200- 15- 10- 15- 30- 30- 30- 30- 0- 0- 0- 0- 1- 0- 1- 0- 0- 0- 0- 4- 5- 2- 150- 200- 0- 1- 1- 2- 0- 1- 43- 46- 11- 12- 5- 5- 5- 5- 5- 5- 2- 10- 14- 5- 5- 45- 0- 7- 4- 5- 5- 5- 40- 0- 1- 13- 1- 2- 1- 1- 1- 2- 9- 10- 14- 22- 3- 3- 5- 5- 20- 2- 1- 10- 13- 1- 1- 1- t- f- f- f- f- f- f- f- f- f- f- f- f- f- f- f- f- f- f- f- f- f- f- f- f- f- f- f- f- f- f- f- f- f- f- f- f- f- f- f- f- f- f- f- f- f- f- f- f- f- f- f- f- f- f- f- f- f- f- f- f- f- f- f

var buttons = new Object();
buttons.handler = function(type, bool) {
	var W = function() {
		if (event.key === "ArrowUp" || event.key === "w") {buttons.isPressed[0] = bool;} else {return;}
	}
	var S = function() {
		if (event.key === "ArrowDown" || event.key === "s") {buttons.isPressed[1] = bool;} else {return;}
	}
	var A = function() {
		if (event.key === "ArrowLeft" || event.key === "a") {buttons.isPressed[2] = bool;} else {return;}
	}
	var D = function() {
		if (event.key === "ArrowRight" || event.key === "d") {buttons.isPressed[3] = bool;} else {return;}
	}
	var E = function() {
		if (event.key === "e") {buttons.isPressed[4] = bool;} else {return;}
	}
	var ctrl = function() {
		if (event.key === "Control") {buttons.isPressed[5] = bool;} else {return;}
	}
	var one = function() {
		if (event.key === "1") {buttons.isPressed[6] = bool;} else {return;}
	}
	var two = function() {
		if (event.key === "2") {buttons.isPressed[7] = bool;} else {return;}
	}
	var three = function() {
		if (event.key === "3") {buttons.isPressed[8] = bool;} else {return;}
	}
	var enter = function() {
		if (event.key === "Enter") {buttons.isPressed[9] = bool;} else {return;}
	}	
	var space = function() {
		if (event.key === " ") {buttons.isPressed[10] = bool;} else {return;}
	}
	var funcs = [W,S,A,D,E,ctrl,one,two,three,enter,space]
	for (i=0; i<funcs.length; i+=1) {
		window.addEventListener(type, funcs[i], false);
	}
}

function teleport() {
	var t = window.prompt("where would you like to teleport to?")
	t = t.split(",");
	player.position = [parseInt(t[0]),parseInt(t[1])]
	world.draw(world.current)
}

buttons.u = function() {player.direction = 0; tiles.moveTiles(0, -10);}
buttons.d = function() {player.direction = 2; tiles.moveTiles(0, 10);}
buttons.l = function() {player.direction = 3; tiles.moveTiles(10, 0);}
buttons.r = function() {player.direction = 1; tiles.moveTiles(-10, 0);}
buttons.pause = function() {window.alert("PAUSE")}

buttons.loopBreak = true;
buttons.break = function() {buttons.loopBreak = !buttons.loopBreak; if (buttons.loopBreak === false) {setTimeout(buttons.unbreak, 1000)}}
buttons.unbreak = function() {buttons.loopBreak = true; buttons.loop()}

buttons.isPressed = [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false]
buttons.keys = [buttons.u,buttons.d,buttons.l,buttons.r,function() {},viewLog,world.day.changeDaylight,teleport,evalFunc,function() {},buttons.pause]

buttons.loop = function() {
	if (!buttons.loopBreak) {return;}
	if (buttons.isPressed[0]) {
		buttons.keys[0]()
	}
	if (buttons.isPressed[1]) {
		buttons.keys[1]()
	}
	if (buttons.isPressed[2]) {
		buttons.keys[2]()
	}
	if (buttons.isPressed[3]) {
		buttons.keys[3]()
	}
	if (buttons.isPressed[4]) {
		buttons.keys[4]()
		buttons.isPressed[4] = false;
	}
	if (buttons.isPressed[5]) {
		buttons.keys[5]()
		buttons.isPressed[5] = false;
	}
	if (buttons.isPressed[6]) {
		buttons.keys[6]()
		buttons.isPressed[6] = false;
	}
	if (buttons.isPressed[7]) {
		buttons.keys[7]()
		buttons.isPressed[7] = false;
	}
	if (buttons.isPressed[8]) {
		buttons.keys[8]()
		buttons.isPressed[8] = false;
	}
	if (buttons.isPressed[9]) {
		buttons.keys[9]() 
		buttons.isPressed[9] = false;
	}
	setTimeout(buttons.loop, 50)
}

function battleTileXY() {return "background-position: "+(combat.opponent.sprite[0]*150*-1)+" "+(combat.opponent.sprite[1]*250*-1)+"; "}
function effectTileXY(x,y) {return "background-position: "+(x*30*-1)+" "+(y*30*-1)+"; "}

var logShown = false;
function viewLog() {
	if (logShown === true) {
		document.getElementById("log").style = "display: none"
		logShown = false;
	} else {
		document.getElementById("log").style = "position: absolute; bottom: 20; left: 850; width: 500; height: 570; overflow-y: scroll; background: white; z-index: 11;"+
		"display: block;"
		logShown = true;
	}
}
function log(text) {
	document.getElementById("log").innerHTML = text+" <br>"+document.getElementById("log").innerHTML
}
function resetLog() {
	document.getElementById("log").innerHTML = "";
	setTimeout(resetLog, 5000)
}
function rng(radix) {
	return Math.floor(Math.random()*radix)+1;
}

	function freeShit() {
		buttonReset();
		display.message.prompt("Here's some free shit.");
		for (let i=1; i<14; i+=1) {
			addStuff(player.weapons, player.weaponsQuantity, 3, weapons.array[i], "weapon");
		}
		addStuff(player.weapons, player.weaponsQuantity, 20, weapons.array[14], "weapon");
		addStuff(player.weapons, player.weaponsQuantity, 20, weapons.array[15], "weapon");
		addStuff(player.weapons, player.weaponsQuantity, 20, weapons.array[16], "weapon");
		addStuff(player.weapons, player.weaponsQuantity, 20, weapons.array[17], "weapon");
		addStuff(player.weapons, player.weaponsQuantity, 3, weapons.array[18], "weapon");
		for (let i=0; i<9; i+=1) {
			addStuff(player.items, player.itemsQuantity, 3, items.array[i], "item");
		}
		for (let i=0; i<24; i+=1) {
			addStuff(player.armor, player.armorQuantity, 3, armor.array[i], "armor");
		}
		display.loadInventory();
	}
	

function evalFunc() {
	var code = window.prompt("Enter the code to run.")
	eval(code)
}

window.alert("no typos")

game.init();
