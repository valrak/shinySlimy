function battle(callback, left, right) {
    var report = [];
    var combatResult;
    // ranged combat both sides
    var leftRanged = findLeftRanged(left.slimes);
    var rightRanged = findRightRanged(right.slimes);

    // close combat left side
    report.push(closeCombat(findAliveLeft(left.slimes), findAliveRight(right.slimes)));
    // close combat right side
    let attacker = findAliveRight(right.slimes);
    if (attacker !== null) {
        report.push(closeCombat(attacker, findAliveLeft(left.slimes)));
    }

    var leftTargets = findLeftTargets(left.slimes);
    var rightTargets = findRightTargets(right.slimes);
    // fire left side

    if (leftRanged.length >= 1 && rightTargets.length >= 1) {
        for (let attacker of leftRanged) {
            iDefender = Math.floor(Math.random() * rightTargets.length);
            defender = rightTargets[iDefender];
            report.push(rangedCombat(attacker, defender));
        }
    }
    // fire right side
    if (rightRanged.length >= 1 && leftTargets.length >= 1) {
        for (let attacker of rightRanged) {
            iDefender = Math.floor(Math.random() * leftTargets.length);
            defender = leftTargets[iDefender];
            report.push(rangedCombat(attacker, defender));
        }
    }
    callback(report);
}

function closeCombat(attacker, defender) {
    if (attacker !== null && defender !== null) {
        attackRoll = Math.floor(Math.random() * attacker.params.attack) + 1;
        defender.setParam('hp', -attackRoll);

        return {
          type : 'closeCombat',
          srcId : attacker.id,
          dstId : defender.id,
          change : {
            'hp' : -attackRoll
          }
        };
    }
}

function rangedCombat(attacker, defender) {
    if (attacker !== null && defender !== null) {
        if (attacker.params.ranged > 0) {
            rangedRoll = Math.floor(Math.random() * attacker.params.ranged) + 1;
            rangedRoll = Math.floor(rangedRoll / 2);
            defender.setParam('hp', -rangedRoll);

            return {
              type : 'rangedCombat',
              srcId : attacker.id,
              dstId : defender.id,
              change : {
                'hp' : -rangedRoll
              }
            };
        }
    }
}


// finds first slime in group which is alive
function findAliveRight(slimes) {
    for (var slime = 0; slime <= slimes.length - 1; slime += 1) {
        if (slimes[slime].isDead() === false)
            return slimes[slime];
    }
    return null;
}

function findAliveLeft(slimes) {
    for (var slime = slimes.length - 1; slime >= 0; slime -= 1) {
        if (slimes[slime].isDead() === false)
            return slimes[slime];
    }
    return null;
}

// find ranged slimes - not first in row, must be alive
function findLeftRanged(slimes) {
    var firstInRowFound = false;
    var leftRanged = [];
        for (var i = slimes.length - 1; i >= 0; i -= 1) {
        if (slimes[i].isDead() === true) {
            continue;
        }
        if (firstInRowFound === true) {
            if (slimes[i].params.ranged > 0) {
                leftRanged.push(slimes[i]);
            }
        }
        firstInRowFound = true;
    }
    return leftRanged;
}

function findRightRanged(slimes) {
    var firstInRowFound = false;
    var rightRanged = [];
    for (var i = 0; i <= slimes.length - 1; i += 1) {
        if (slimes[i].isDead() === true) {
            continue;
        }
        if (firstInRowFound === true) {
            if (slimes[i].params.ranged > 0) {
                rightRanged.push(slimes[i]);
            }
        }
        firstInRowFound = true;
    }
    return rightRanged;
}

function findLeftTargets(slimes) {
    var targetsLeft = [];
    for (var i = slimes.length - 1; i >= 0; i -= 1) {
        if (slimes[i].isDead() === false) {
            targetsLeft.push(slimes[i]);
        }

    }
    return targetsLeft;
}

function findRightTargets(slimes) {
    var targetsRight = [];
    for (var i = 0; i <= slimes.length -1; i += 1) {
        if (slimes[i].isDead() === false) {
            targetsRight.push(slimes[i]);
        }
    }
    return targetsRight;
}
