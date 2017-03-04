var slime = {};

const STARTING_PARAMS = {
	hp: 1,
	attack: 1,
	defense: 0,
	ranged: 0
};

function Slime(name) {
	var startingParams = {
		hp: monstersData[name].hp,
		attack: monstersData[name].attack,
		defense: monstersData[name].defense,
		ranged: monstersData[name].ranged
	};
	this.id = 0;
	this.name = name;
	this.slime = true;
	if (this.name !== "slime") {
		this.slime = false;
	}

	this.params = {
		hp: startingParams.hp,
		attack: startingParams.attack,
		defense: startingParams.defense,
		ranged: startingParams.ranged,
	};

	this.dice = {
		'hp': null,
		'attack': null,
		'ranged': null
	};

	this.getSlimeSpriteName = function() {
		if (this.slime === true) {
			if (this.dice.hp === null) {
				return "slime";
			}
			else {
				var sides = this.dice.hp.params.sides;
				return "d"+sides+"-slime";
			}
		}
		else {
			return this.name;
		}
	};

	this.getSlimeSheetName = function() {
		if (this.slime === true) {
			return SLIME_SHEET;
		}
		else {
			return MONSTER_SHEET;
		}
	};

	this.getSlimeName = function() {
		if (this.slime === true) {
			if (this.dice.hp === null) {
				return "slime";
			}
			else {
				var sides = this.dice.hp.params.sides;
				return "d"+sides+" slime";
			}
		}
		else {
			return this.name;
		}
	};

    // replace the dice with another one and recalculate new stats
	this.replace = function(whichDice, newDice) {
		if (typeof newDice != 'undefined' && typeof whichDice != 'undefined') {
			this.dice[whichDice] = newDice;
		}
		this.recalculate();
	};

    // reset slime's parameters to original state, according to assigned dice
	this.recalculate = function() {
		for (let die in this.dice) {
			if (typeof this.params[die] !== 'undefined') {
				if (this.dice[die] === null) {
					this.params[die] = startingParams[die];
				}
				else {
					this.params[die] = this.dice[die].params.sides;
				}
			}
		}
	};

    // update the slime parameters after some change
    this.update = function() {
        // slime dead
        if (this.params.hp <= 0) {
            // destroy dice
            for (let die in this.dice) {
                if (this.dice[die] !== null) {
                    this.dice[die] = null;
                }
            }
        }
    };

    // update parameter
    this.setParam = function(param, amount) {
        if (typeof this.params[param] !== 'undefined') {
            amount = parseInt(amount);
            this.params[param] += amount;
            this.update();
        }
    };

    // returns true if slime hp <= 0
    this.isDead = function() {
        if (this.params.hp > 0) {
            return false;
        }
        return true;
    };
}
