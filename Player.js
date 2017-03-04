var player = {};

function Player() {
  this.slimes = [];

  this.items = [];
  this.money = STARTING_MONEY;
  this.runs = 0;
  this.location = 'town';
  this.expedition = null;

// TEMPORARY
  this.items.push(new Item("d6"));
  this.items.push(new Item("d4"));
  this.items.push(new Item("d10"));
  this.items.push(new Item("d8"));
  this.items.push(new Item("carrot"));
  this.items.push(new Item("lettuce"));
  var food = new Item("slime food");
  food.amount = 90;
  this.items.push(food);

  var slime = new Slime("slime");
  slime.id = 1;
  var dice = new Item("d12");
  slime.dice.ranged = dice;
  var dice = new Item("d12");
  slime.dice.hp = dice;
  this.slimes.push(slime);
  slime.recalculate();
  slime = new Slime("slime");
  slime.id = 2;
  dice = new Item("d20");
  slime.dice.hp = dice;
  slime.dice.ranged = new Item("d12");
  slime.recalculate();
  this.slimes.push(slime);
// TEMPORARY
  slime = new Slime("slime");
  slime.id = 3;
  slime.dice.attack = new Item("d20");
  dice = new Item("d20");
  slime.dice.hp = dice;
  slime.recalculate();
  this.slimes.push(slime);

  // TEMPORARY Expedition
  this.expedition = new Expedition(1);

  // switch position of two slimes

  this.switchSlimes = function(switchPositions, callback) {
    var transient = this.slimes[switchPositions[1]];
    this.slimes[switchPositions[1]] = this.slimes[switchPositions[0]];
    this.slimes[switchPositions[0]] = transient;
    callback();
  };

  this.newExpedition = function() {
    this.runs += 1;
    this.expedition = new Expedition(this);
    return this.expedition;
  };

  this.recoverSlimes = function() {
    for (let slime of this.slimes) {
      slime.recalculate();
    }
  };

  // Inventory management

  // remove inactive items from inventory
  this.cleanItems = function() {
    if (item.amount <= 0) {
      item.active = false;
    }

    var cleanedItems = this.items.slice();
    for (let item of this.items) {
      if (item.active === false) {
        var index = cleanedItems.indexOf(item);
        if (index !== -1) {
          cleanedItems.splice(index, 1);
        }
      }
    }
    this.items = cleanedItems;
    this.items = this.groupItems();
  };

  this.groupItems = function() {
    var tempItems = [];
    var mapItems = new Map();
    for (var item of this.items) {
      if (typeof item.params.stackable !== 'undefined' && item.params.stackable === 1) {
        if (mapItems.has(item.name) === true) {
          mapItems.set(item.name, mapItems.get(item.name) + item.amount);
        }
        else {
          mapItems.set(item.name, item.amount);
        }
      }

      else {
        tempItems.push(item);
      }
    }
    for (var itemName of mapItems) {
      item = new Item(itemName[0]);
      item.amount = mapItems.get(itemName[0]);
      tempItems.push(item);
    }
    return tempItems;
  };

  this.sellItem = function(item, howMuch) {
    var amount = 1;
    if (typeof howMuch !== 'undefined' && howMuch !== null) {
      amount = howMuch;
    }
    if (amount > 1 && typeof item.params.stackable !== 'undefined' && item.params.stackable === 1) {
      if (amount > item.amount) {
        amount = item.amount;
      }
      item.amount -= amount;
      if (item.amount <= 0) {
        item.active = false;
      }
    }
    else {
      item.active = false;
    }
    player.money += Math.floor(item.params.price * amount / 2);
    this.cleanItems();
  };

  this.buyItem = function(item, howMuch) {
    // not enough money
    var amount = 1;
    if (typeof howMuch !== 'undefined' && howMuch !== null) {
      amount = howMuch;
    }
    if (player.money < item.params.price * amount) {
      return false;
    }
    else {
      var boughtItem = new Item(item.name);
      boughtItem.amount = amount;
      player.items.push(boughtItem);
      player.money -= item.params.price * amount;
      this.cleanItems();
    }
  };

  // returns list of items filtered by type parameter
  this.getFilteredItems = function(filterType) {
    var filteredItems = [];
    for (let item of this.items) {
      if (item !== null && typeof item.params !== 'undefined') {
        if (item.params.type.indexOf(filterType) !== -1) {
          filteredItems.push(item);
        }
      }
    }
    return filteredItems;
  };

  this.getFood = function() {
    var food = 0;
    for (let item of this.items) {
      if (item.params.type.indexOf('food') !== -1) {
        food += item.amount;
      }
    }
    return food;
  };

  this.getEating = function() {
    var eating = 0;
    for (let slime of this.slimes) {
      // basic slime food requirement
      eating += 1;
      // additional food for each assigned dice
      for (let die in slime.dice) {
        if (slime.dice[die] !== null) {
          eating += 1;
        }
      }
    }
    return eating;
  };

  this.eatFood = function() {
    var toEat = this.getEating();
    if (this.getFood() < toEat) {
      return false;
    }
    else {
      for (let item of this.items) {
        if (item.params.type.indexOf('food') !== -1) {
          // not satisfied by this stack of food
          if (toEat > item.amount) {
            toEat -= item.amount;
            item.amount = 0;
            item.active = false;
          }
          // stack of food ok
          else {
            item.amount -= toEat;
            toEat = 0;
          }
        }
        if (toEat <= 0) {
          this.cleanItems();
          return true;
        }
      }
    }
    return true;
  };
}
