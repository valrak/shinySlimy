var battleScreen = {};

function BattleScreen(outsideCallback, player, opposition, items) {

  const WINDOW_NAME = SCREEN_NAMES.BATTLE;
  const BATTLE_POS_X = 70;
  const BATTLE_POS_Y = 4;
  const BATTLE_SIZE_X = 220;
  const BATTLE_SIZE_Y = 150;
  const INFO_SIZE_X = 100;
  const INFO_SIZE_Y = 60;

  const BUTTON_SIZE_X = 33;
  const BUTTON_SIZE_Y = 18;

  const TEXT_BUTTON_SIZE = 8;
  const TEXT_TOOLTIP_SIZE = 8;
  const TEXT_RESULT_SIZE = 24;
  const TEXT_SIZE = 8;

  const INITIAL_SLIME_POS_X = PADDING * 3;
  const INITIAL_SLIME_POS_Y = 10;
  const GUI_SLIME_STEP_Y = 6;
  const GUI_SLIME_STEP_X = 15;
  const SLIME_POS_STEP = 30;
  const SLIME_OPPOSITION_STEP = 40;

  var battleScreen;

  var arrows = [];
  var slimeSprites = new Map();
  var slimes = new Map();
  var switchMode = false;
  var thisObject = this;

  var switchButton;
  var battleButton;

  var initPanel = () => {
    for (let slime of player.slimes) {
          slimes.set(slime.id, slime);
      }
    for (let slime of opposition.slimes) {
          slimes.set(slime.id, slime);
      }
    windowManager.register(WINDOW_NAME, this);
    //signalManager.itemUseSignal.add(itemUse, item);
    marked = [];
    // main panel
    battleScreen = createPanel(BATTLE_POS_X, BATTLE_POS_Y, BATTLE_SIZE_X, BATTLE_SIZE_Y);

    switchButton = createButton("button-generic",
                          PADDING * 2,
                          battleScreen.height / scale - BUTTON_SIZE_Y - PADDING * 2,
                          BUTTON_SIZE_X,
                          BUTTON_SIZE_Y,
                          function() {
                            switchSlimeMode(); }, "switch");
    battleScreen.addChild(switchButton);

    battleButton = createButton("button-generic",
                          PADDING * 3 + BUTTON_SIZE_X,
                          battleScreen.height / scale - BUTTON_SIZE_Y - PADDING * 2,
                          BUTTON_SIZE_X,
                          BUTTON_SIZE_Y,
                          function() {
                            battle(refresh, player, opposition); }, "battle");
    battleScreen.addChild(battleButton);

    runButton = createButton("button-generic",
                          PADDING * 4 + BUTTON_SIZE_X * 2,
                          battleScreen.height / scale - BUTTON_SIZE_Y - PADDING * 2,
                          BUTTON_SIZE_X,
                          BUTTON_SIZE_Y,
                          function() {
                            closeWindow();
                            outsideCallback('defeat');
                           }, "run");
    battleScreen.addChild(runButton);
    displaySlimes();
  };

  initPanel();

  function displaySlimes() {
    offset = 0;
    var livingPlayer = 0;
    var livingOpposition = 0;
    for (let slime of player.slimes) {
      // slime image
      let slimeSprite = game.make.sprite(INITIAL_SLIME_POS_X + offset,
                                        INITIAL_SLIME_POS_Y,
                                        slime.getSlimeSheetName(), slime.getSlimeSpriteName());
      slimeSprite.smoothed = false;
      slimeSprites.set(slime.id, slimeSprite);
      battleScreen.addChild(slimeSprite);
      if (slime.isDead() === true) {
        let crossSprite = game.make.sprite(INITIAL_SLIME_POS_X + offset,
                                          INITIAL_SLIME_POS_Y,
                                          'cross');
        crossSprite.smoothed = false;
        battleScreen.addChild(crossSprite);
      }
      else {
        livingPlayer += 3;
      }
      let healthMessage = "ž "+slime.params.hp;
      let healthText = new Phaser.BitmapText(game, INITIAL_SLIME_POS_X + PADDING * 2 + offset,
                                        INITIAL_SLIME_POS_Y + 16 + PADDING * 2,
                                        'font-normal',
                                        healthMessage,
                                        TEXT_TOOLTIP_SIZE, 'left');
      battleScreen.addChild(healthText);

      let attackMessage = "ú "+slime.params.attack;
      let attackText = new Phaser.BitmapText(game, INITIAL_SLIME_POS_X + PADDING * 2 + offset,
                       INITIAL_SLIME_POS_Y + 16 + GUI_SLIME_STEP_Y + PADDING * 2,
                                        'font-normal',
                                        attackMessage,
                                        TEXT_TOOLTIP_SIZE, 'left');
      battleScreen.addChild(attackText);

      let rangedMessage = "ď "+slime.params.ranged;
      let rangedText = new Phaser.BitmapText(game, INITIAL_SLIME_POS_X + PADDING * 2 + offset,
                       INITIAL_SLIME_POS_Y + 16 + GUI_SLIME_STEP_Y * 2 + PADDING * 2,
                                        'font-normal',
                                        rangedMessage,
                                        TEXT_TOOLTIP_SIZE, 'left');
      battleScreen.addChild(rangedText);

      // next slime offset
      offset += SLIME_POS_STEP;
    }

    // opposition slimes
    offset += SLIME_OPPOSITION_STEP;
    for (let slime of opposition.slimes) {
      // slime image
      let slimeSprite = game.make.sprite(INITIAL_SLIME_POS_X + offset,
                                        INITIAL_SLIME_POS_Y,
                                        slime.getSlimeSheetName(), slime.getSlimeSpriteName());
      slimeSprite.anchor.setTo(1, 0);
      slimeSprite.scale.x *= -1;
      slimeSprite.smoothed = false;
      slimeSprites.set(slime.id, slimeSprite);
      battleScreen.addChild(slimeSprite);
      if (slime.isDead() === true) {
        let crossSprite = game.make.sprite(slimeSprites.get(slime.id).x,
                                          slimeSprites.get(slime.id).y,
                                          'cross');
        crossSprite.smoothed = false;
        battleScreen.addChild(crossSprite);
      }
      else {
        livingOpposition += 3;
      }
      let healthMessage = "ž "+slime.params.hp;
      let healthText = new Phaser.BitmapText(game, INITIAL_SLIME_POS_X + PADDING * 2 + offset,
                                        INITIAL_SLIME_POS_Y + 16 + PADDING * 2,
                                        'font-normal',
                                        healthMessage,
                                        TEXT_TOOLTIP_SIZE, 'left');
      battleScreen.addChild(healthText);

      let attackMessage = "ú "+slime.params.attack;
      let attackText = new Phaser.BitmapText(game, INITIAL_SLIME_POS_X + PADDING * 2 + offset,
                       INITIAL_SLIME_POS_Y + 16 + GUI_SLIME_STEP_Y + PADDING * 2,
                                        'font-normal',
                                        attackMessage,
                                        TEXT_TOOLTIP_SIZE, 'left');
      battleScreen.addChild(attackText);

      let rangedMessage = "ď "+slime.params.ranged;
      let rangedText = new Phaser.BitmapText(game, INITIAL_SLIME_POS_X + PADDING * 2 + offset,
                       INITIAL_SLIME_POS_Y + 16 + GUI_SLIME_STEP_Y * 2 + PADDING * 2,
                                        'font-normal',
                                        rangedMessage,
                                        TEXT_TOOLTIP_SIZE, 'left');
      battleScreen.addChild(rangedText);

      offset += SLIME_POS_STEP;
    }

    var resultMessage;
    var acceptButtonText;
    var result;
    // win / lose condition
    if (livingOpposition <= 0 ) {
      resultMessage = "Victory";
      acceptButtonText = 'Good';
      result = 'victory';
      // put items in player inventory
      for (let item of items) {
        player.items.push(item);
      }
      player.cleanItems();
    }
    if (livingPlayer <= 0) {
      resultMessage = "Defeat";
      result = 'defeat';
      acceptButtonText = 'Oh no!';
    }
    if (typeof result !== 'undefined') {
      switchButton.input.enabled = false;
      battleButton.input.enabled = false;
      infoPanel = createPanel(BATTLE_SIZE_X / 2 - INFO_SIZE_X / 2, BATTLE_SIZE_Y / 2 - INFO_SIZE_Y / 2, INFO_SIZE_X, INFO_SIZE_Y);
      infoPanel.scale.setTo(1);
      battleScreen.addChild(infoPanel);

      var resultText = new Phaser.BitmapText(game,
                                        PADDING,
                                        PADDING,
                                        'font-normal',
                                        resultMessage,
                                        TEXT_RESULT_SIZE, 'center');
      infoPanel.addChild(resultText);

      var acceptButton = createButton("button-generic",
                            INFO_SIZE_X / 2 - (BUTTON_SIZE_X + 15) / 2,
                            INFO_SIZE_Y / 2,
                            BUTTON_SIZE_X + 15,
                            BUTTON_SIZE_Y,
                            function() {
                              closeWindow();
                              outsideCallback(result);
                            }, acceptButtonText);
      infoPanel.addChild(acceptButton);
    }
  }

  function animate(report) {
    // collect animations
    if (typeof report !== 'undefined' && report.length > 0) {
        tweens = [];
        rangedtweens = [];
        for (var happen of report) {
            if (happen.type === 'closeCombat') {
              srcSprite = slimeSprites.get(happen.srcId);
              dstSprite = slimeSprites.get(happen.dstId);
              let attackTween = game.add.tween(srcSprite);
              attackTween.to({x:dstSprite.x}, 1000, Phaser.Easing.Bounce.Out);
              attackTween.onComplete.add(takeDamage, {happen : happen});
              attackTween.to({x:srcSprite.x}, 100, Phaser.Easing.Linear.None);
              tweens.push(attackTween);
              //takeDamage();
            }
            if (happen.type === 'rangedCombat') {
              srcSprite = slimeSprites.get(happen.srcId);
              dstSprite = slimeSprites.get(happen.dstId);
              let shotSprite = game.make.sprite(-100,
                                          srcSprite.y,
                                          PARTICLE_SHEET, 'slime-shot');
              shotSprite.smoothed = false;
              battleScreen.addChild(shotSprite);
              let attackTween = game.add.tween(shotSprite);
              attackTween.to({x:srcSprite.x}, 1, Phaser.Easing.Linear.None);
              attackTween.to({x:dstSprite.x}, 500, Phaser.Easing.Linear.None);
              attackTween.onComplete.add(takeDamage, {happen : happen});
              attackTween.to({alpha : 0}, 100, Phaser.Easing.Linear.None);
              attackTween.start();
            }
        }
        // insert delay for last splash
        delay = game.add.tween(slimeSprites.get(1));
        delay.to({x:slimeSprites.get(1).x}, 1000, Phaser.Easing.Linear.None);
        tweens.push(delay);
        // display animations
        if (tweens.length > 0) {
            for (i = 0; i < tweens.length-1; i+=1) {
                tweens[i].chain(tweens[i+1]);
            }
            tweens[tweens.length-1].onComplete.add(refresh);
            tweens[0].start();
        }
    }

    // splash of damage
    function takeDamage() {
      happen = this.happen;
      dstSprite = slimeSprites.get(happen.dstId);
      if (slimes.get(happen.dstId).isDead() === true) {
        let crossSprite = game.make.sprite(dstSprite.x,
                                          dstSprite.y,
                                          'cross');
        // crossSprite.anchor.setTo(1, 0);
        // crossSprite.scale.x *= -1;
        crossSprite.smoothed = false;
        battleScreen.addChild(crossSprite);
      }
      let damageSprite = game.make.sprite(dstSprite.x,
                                        dstSprite.y,
                                        PARTICLE_SHEET, 'damage-splash');
      damageSprite.smoothed = false;
      battleScreen.addChild(damageSprite);

      let healthMessage = happen.change.hp;
      let healthText = new Phaser.BitmapText(game, dstSprite.x + 2,
                                        dstSprite.y + 5,
                                        'font-normal',
                                        healthMessage,
                                        TEXT_TOOLTIP_SIZE, 'center');
      battleScreen.addChild(healthText);

      let splashTween = game.add.tween(damageSprite).to( { alpha: 0 }, 1000, "Linear", true);
      splashTween = game.add.tween(healthText).to( { alpha: 0 }, 1000, "Linear", true);

      //updateText.text(slimes.get(happen.dstId).params.hp);
    }
  }

  function switchSlimeMode() {
    var offset = 0;
    marked = [];

    if (switchMode === true) {
      for (let arrow of arrows) {
        arrow.destroy();
      }
      switchMode = false;
    }
    else {
      switchMode = true;

      for (let slimePosition in player.slimes) {
        arrows[slimePosition] = game.make.button(INITIAL_SLIME_POS_X + offset,
                                          INITIAL_SLIME_POS_Y - 15,
                                    'down-arrow-inactive');
        arrows[slimePosition].smoothed = false;
        arrows[slimePosition].events.onInputUp.add(mark, {
                                                pos: slimePosition});
        battleScreen.addChild(arrows[slimePosition]);
        offset += SLIME_POS_STEP;
      }
    }
  }

  function mark() {
    var end = false;
    var pos = this.pos;
    var arrowName = 'down-arrow';
    arrows[pos].destroy();
    if (marked[pos] === true) {
      arrowName = 'down-arrow-inactive';
      marked[pos] = false;
    }
    else {
      marked[pos] = true;
    }

    // check if two are marked
    count = 0;
    var switchPositions = [];
    for (let m in marked) {
      if (marked[m] === true) {
        switchPositions[count] = m;
        count++;
      }
      if (count >= 2) {
        for (let arrow of arrows) {
          arrow.destroy();
        }
        switchMode = false;
        player.switchSlimes(switchPositions, callback);
        end = true;
        break;
      }
    }

    if (end === false) {
      arrows[pos] = game.make.button(INITIAL_SLIME_POS_X + pos * SLIME_POS_STEP,
                                        INITIAL_SLIME_POS_Y - 15,
                                  arrowName);
      arrows[pos].smoothed = false;
      arrows[pos].events.onInputUp.add(mark, {
                                              pos: pos});
      battleScreen.addChild(arrows[pos]);
    }
  }

  this.itemUse = function(item, onWhat) {
    if (typeof item !== 'undefined' && item !== null) {
      console.log(item.name);
    }
  };

  function callback(thing) {
    refresh();
  }


  function closeWindow() {
    windowManager.unregister(WINDOW_NAME);
    battleScreen.destroy(true);
    battleScreen = null;
  }

  function refresh(report) {
    if (typeof report !== 'undefined' && report.length > 0) {
        animate(report);
    }
    else {
        closeWindow();
        initPanel();
    }
  }

  this.setActive = function(active) {
    if (active === true) {
      for (let child of battleScreen.children) {
        if (child.input !== null) {
          child.input.enabled = true;
        }
        child.inputEnabled = true;
      }
      game.world.bringToTop(battleScreen);
    }
    else {
      for (let child of battleScreen.children) {
        if (child.input !== null) {
          child.input.enabled = false;
        }
        child.inputEnabled = false;
      }
    }
  };

  this.remoteClose = function() {
    closeWindow();
  };

}
