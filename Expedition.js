var expedition = {};

function Expedition(player) {
  const BASE_DANGER_LEVEL = 10;

  const DANGER_RUN_INCREASE = 5;

  this.player = player;
  var expeditionNumber = player.runs;
  var terrainTiles = [];
  var monsters;
  var items;

  for (let terrain in terrainData) {
    terrainTiles.push(terrain);
  }

  this.travelLog = [
    {
      tile: 'town',
      adj: 0
    }
  ];

  this.dangerLevel = BASE_DANGER_LEVEL * expeditionNumber;

  this.nextTile = function(currentDangerLevel) {
    var pickedTerrain;
    // TODO: introduce rarity
    pickedTerrain = Math.floor(Math.random() * terrainTiles.length);
    return terrainTiles[pickedTerrain];
  };

  this.recordTravel = function(tile, direction) {
    this.travelLog.push({
      tile : tile,
      adj : direction
    });
  };

  this.goTo = function(callback, tile, adjustment) {
    // player decides if he runs or go to battle
    function confirmCallback(result) {
      if (result === true) {
        new BattleScreen(callback, this.player, monsters, items);
      }
      // run away, + danger level
      else {
        this.dangerLevel += DANGER_RUN_INCREASE;
        callback('battleRun');
      }
    }

    this.dangerLevel += 1; // basic increase
    this.dangerLevel += adjustment + 1; // user chosen increase
    this.recordTravel(tile, adjustment);
    var foodOk = this.player.eatFood();
    // not enough food - player must return to town
    if (foodOk !== true) {
      callback('foodFail');
    }
    // next day - next encounter
    else {
      monsters = this.generateMonsters(tile, this.dangerLevel);
      items = this.generateItems(tile, this.dangerLevel);
      new ProspectScreen(CONFIRM_X, CONFIRM_Y, confirmCallback, this.player, monsters, items);
    }
  };

  this.generateMonsters = function(tile, dangerLevel) {
    var opposition = new Opposition();
    opposition.randomMonsters(tile, dangerLevel);
    return opposition;
  };

  this.generateItems = function(tile, dangerLevel) {
    var loot = [];
    loot = monsters.randomItems();
    return loot;
  };
}
