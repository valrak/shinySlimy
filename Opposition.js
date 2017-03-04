var opposition = {};

function Opposition() {
  this.slimes = [];

  this.items = [];

  this.randomMonsters = function(tile, dangerLevel) {
    const OOD_DOWN_TRESHOLD = 20;
    const OOD_UP_TRESHOLD = 10;

    marked = [];
    for (let i in monstersData) {
      if ((monstersData[i].foundIn.indexOf(tile) != -1 || monstersData[i].foundIn.indexOf("any") != -1) &&
          monstersData[i].level >= dangerLevel - OOD_DOWN_TRESHOLD &&
          monstersData[i].level <= dangerLevel + OOD_UP_TRESHOLD) {
            marked.push(i);
          }
    }

    // failover - no monster selected
    if (marked.length === 0) {
      for (let i in monstersData) {
        marked.push(i);
      }
    }

    var monsters = [];

    for (let i = 4; i < 7; i += 1) {
      monster = new Slime(marked[Math.floor(Math.random()*marked.length)]);
      // assign dice to slimes
      /*
      if (monster.name === "slime") {
        // calculate number of dice assigned
        let assignedDice = Math.floor(Math.random() * dangerLevel);
          assignedDice = Math.floor(assignedDice / 10);
        if (assignedDice > 3) {
          assignedDice = 3;
        }
        // assign dice
        if (assignedDice > 0) {
          let markedDice = [];
          for (let i in itemsData) {
            if (itemsData[i].type.indexOf("dice") != -1 &&
                itemsData[i].level >= dangerLevel - OOD_DOWN_TRESHOLD &&
                itemsData[i].level <= dangerLevel + OOD_UP_TRESHOLD) {
                  markedDice.push(i);
            }
          }
          for (let i = 0; i < assignedDice; i += 1) {
            dice = new Item(marked[Math.floor(Math.random()*markedDice.length)]);
            let freeSlots = slime.dice;

          }
        }
      }
      */
      monster.id = i;
      monsters.push(monster);
    }
    this.slimes = monsters;
    return monsters;

  };

  // switch position of two slimes
  this.switchSlimes = function(switchPositions, callback) {
    var transient = this.slimes[switchPositions[1]];
    this.slimes[switchPositions[1]] = this.slimes[switchPositions[0]];
    this.slimes[switchPositions[0]] = transient;
    callback();
  };
}
