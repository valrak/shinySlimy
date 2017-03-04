var characterSheet = {};

function CharacterSheet(player, changable) {

  const WINDOW_NAME = SCREEN_NAMES.CHARACTER_SHEET;
  const CH_POS_X = 100;
  const CH_POS_Y = 20;
  const CH_SIZE_X = 220;
  const CH_SIZE_Y = 150;

  const BUTTON_SIZE_X = 18;
  const BUTTON_SIZE_Y = 18;

  const TEXT_BUTTON_SIZE = 8;
  const TEXT_TOOLTIP_SIZE = 8;
  const TEXT_SIZE = 8;

  const INITIAL_SLIME_POS_X = PADDING * 3;
  const INITIAL_SLIME_POS_Y = 10;
  const GUI_SLIME_STEP_Y = 17;
  const GUI_SLIME_STEP_X = 15;
  const SLIME_POS_STEP = 70;

  var chrPanel;

  var marked = [];
  var arrows = [];
  var switchMode = false;
  var thisObject = this;



  var initPanel = () => {
    windowManager.register(WINDOW_NAME, this);
    marked = [];
    var warning = "";
    if (changable === false) {
      warning = " - view only";
    }
    // main panel
    chrPanel = createPanel(CH_POS_X, CH_POS_Y, CH_SIZE_X, CH_SIZE_Y);

    var closeButton = createButton("button-generic",
                          PADDING * 2,
                          chrPanel.height / scale - BUTTON_SIZE_Y - PADDING * 2,
                          BUTTON_SIZE_X,
                          BUTTON_SIZE_Y,
                          function() {
                            closeWindow(); }, "x");
    chrPanel.addChild(closeButton);
    var switchButton = createButton("button-generic",
                          PADDING * 3 + BUTTON_SIZE_X,
                          chrPanel.height / scale - BUTTON_SIZE_Y - PADDING * 2,
                          BUTTON_SIZE_X + 15,
                          BUTTON_SIZE_Y,
                          function() {
                            switchSlimeMode(); }, "switch");
    chrPanel.addChild(switchButton);

    pagesText = new Phaser.BitmapText(game, PADDING * 2,
                                      PADDING * 2,
                                      'font-normal',
                                      'Slime sheet' + warning,
                                      TEXT_SIZE, 'left');
    chrPanel.addChild(pagesText);

    displaySlimes();
  };

  initPanel();

  function displaySlimes() {

    offset = 0;
    for (let slime of player.slimes) {
      // slime image
      var slimeSprite = game.make.sprite(INITIAL_SLIME_POS_X + offset,
                                        INITIAL_SLIME_POS_Y,
                                        slime.getSlimeSheetName(), slime.getSlimeSpriteName());
      slimeSprite.smoothed = false;
      chrPanel.addChild(slimeSprite);
      // slime name
      var slimeNameText = new Phaser.BitmapText(game, INITIAL_SLIME_POS_X + offset,
                                        INITIAL_SLIME_POS_Y + GUI_SLIME_STEP_Y,
                                        'font-normal',
                                        slime.getSlimeName(),
                                        TEXT_TOOLTIP_SIZE, 'left');
      chrPanel.addChild(slimeNameText);

      // buttons - only visible when dialog is changable
      if (changable !== false) {
        // slime hp dice
        var hpButton = game.make.button(INITIAL_SLIME_POS_X + offset,
                                    INITIAL_SLIME_POS_Y + GUI_SLIME_STEP_Y + TEXT_SIZE + 2,
                                    'item-placeholder');
        hpButton.smoothed = false;
        hpButton.events.onInputUp.add(replace, {
                                                replaceThis: 'hp',
                                                replaceObject: slime
                                      });
        chrPanel.addChild(hpButton);
        // slime attack dice
        var attackButton = game.make.button(INITIAL_SLIME_POS_X + offset,
                                    INITIAL_SLIME_POS_Y + GUI_SLIME_STEP_Y * 2.5 + TEXT_SIZE + 2,
                                    'item-placeholder');
        attackButton.smoothed = false;
        attackButton.events.onInputUp.add(replace, {
                                                replaceThis: 'attack',
                                                replaceObject: slime
                                      });
        chrPanel.addChild(attackButton);
        // slime ranged dice
        var rangedButton = game.make.button(INITIAL_SLIME_POS_X + offset,
                                    INITIAL_SLIME_POS_Y + GUI_SLIME_STEP_Y * 4 + TEXT_SIZE + 2,
                                    'item-placeholder');
        rangedButton.smoothed = false;
        rangedButton.events.onInputUp.add(replace, {
                                                replaceThis: 'ranged',
                                                replaceObject: slime
                                      });
        chrPanel.addChild(rangedButton);
      }
      //

      if (typeof slime.dice.hp != 'undefined' && slime.dice.hp !== null) {
        var hpDiceSprite = game.make.sprite(INITIAL_SLIME_POS_X + offset + 2,
                         INITIAL_SLIME_POS_Y + GUI_SLIME_STEP_Y + TEXT_SIZE + PADDING * 2,
                         ITEM_SHEET, slime.dice.hp.name);
        hpDiceSprite.smoothed = false;
        chrPanel.addChild(hpDiceSprite);
      }
      var healthMessage = "health\n"+slime.params.hp;
      var healthText = new Phaser.BitmapText(game, INITIAL_SLIME_POS_X + BUTTON_SIZE_Y + PADDING * 2 + offset,
                       INITIAL_SLIME_POS_Y + GUI_SLIME_STEP_Y + TEXT_SIZE + PADDING * 2,
                                        'font-normal',
                                        healthMessage,
                                        TEXT_TOOLTIP_SIZE, 'left');
      chrPanel.addChild(healthText);


      if (typeof slime.dice.attack != 'undefined' && slime.dice.attack !== null) {
        var attackDiceSprite = game.make.sprite(INITIAL_SLIME_POS_X + offset + 2,
                         INITIAL_SLIME_POS_Y + GUI_SLIME_STEP_Y * 2.5 + TEXT_SIZE + PADDING * 2,
                         ITEM_SHEET, slime.dice.attack.name);
        attackDiceSprite.smoothed = false;
        chrPanel.addChild(attackDiceSprite);
      }
      var attackMessage = "melee\n"+slime.params.attack;
      var attackText = new Phaser.BitmapText(game, INITIAL_SLIME_POS_X + BUTTON_SIZE_Y + PADDING * 2 + offset,
                       INITIAL_SLIME_POS_Y + GUI_SLIME_STEP_Y * 2.5 + TEXT_SIZE + PADDING * 2,
                                        'font-normal',
                                        attackMessage,
                                        TEXT_TOOLTIP_SIZE, 'left');
      chrPanel.addChild(attackText);


      if (typeof slime.dice.ranged != 'undefined' && slime.dice.ranged !== null) {
        var rangedDiceSprite = game.make.sprite(INITIAL_SLIME_POS_X + offset + 2,
                         INITIAL_SLIME_POS_Y + GUI_SLIME_STEP_Y * 4 + TEXT_SIZE + PADDING * 2,
                         ITEM_SHEET, slime.dice.ranged.name);
        rangedDiceSprite.smoothed = false;
        chrPanel.addChild(rangedDiceSprite);
      }
      var rangedMessage = "ranged\n"+slime.params.ranged;
      var rangedText = new Phaser.BitmapText(game, INITIAL_SLIME_POS_X + BUTTON_SIZE_Y + PADDING * 2 + offset,
                       INITIAL_SLIME_POS_Y + GUI_SLIME_STEP_Y * 4+ TEXT_SIZE + PADDING * 2,
                                        'font-normal',
                                        rangedMessage,
                                        TEXT_TOOLTIP_SIZE, 'left');
      chrPanel.addChild(rangedText);

      // next slime offset
      offset += SLIME_POS_STEP;
    }
  }

  function replace() {
    replaceThis = this.replaceThis;
    slime = this.replaceObject;
    inventory = new InventoryScreen(player.getFilteredItems('dice'), callback, 'choose');
    function callback(item) {
      // user chose to remove item from slot
      if (item === null) {
        // add item back to player inventory
        oldDice = slime.dice[replaceThis];
        if (oldDice !== null) {
          oldDice.active = true;
          player.items.push(oldDice);
        }
        // empty slot
        slime.replace(replaceThis, item);
        refresh();
      }
      // add item to slot
      else {
        // add item back to player inventory
        oldDice = slime.dice[replaceThis];
        if (oldDice !== null) {
          oldDice.active = true;
          player.items.push(oldDice);
        }
        slime.replace(replaceThis, item);
        item.active = false;
        player.cleanItems();
        refresh();
      }
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
        chrPanel.addChild(arrows[slimePosition]);
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
      chrPanel.addChild(arrows[pos]);
    }

    function callback() {
      refresh();
    }
  }

  function closeWindow() {
    windowManager.unregister(WINDOW_NAME);
    chrPanel.destroy(true);
    chrPanel = null;
  }

  function refresh() {
    closeWindow();
    initPanel();
  }

  this.setActive = function(active) {
    if (active === true) {
      for (let child of chrPanel.children) {
        if (child.input !== null) {
          child.input.enabled = true;
        }
        child.inputEnabled = true;
      }
      game.world.bringToTop(chrPanel);
    }
    else {
      for (let child of chrPanel.children) {
        if (child.input !== null) {
          child.input.enabled = false;
        }
        child.inputEnabled = false;
      }
    }
  };

  // handle dragging from within a scaled parent
  // function scaledDrag(sprite) {
  //     sprite.inputEnabled = true;
  //     sprite.input.enableDrag();
  //     sprite.events.onDragUpdate.add(function (sprite, pointer, x, y) {
  //         var pos = sprite.game.input.getLocalPosition(sprite.parent, pointer);
  //         if (sprite.hitArea) {
  //             sprite.x = pos.x - sprite.hitArea.width/2;
  //             sprite.y = pos.y - sprite.hitArea.height/2;
  //         } else {
  //             sprite.x = pos.x - sprite.width/2;
  //             sprite.y = pos.y - sprite.height/2;
  //         }
  //     }, sprite);
  //     return sprite;
  // }
  this.remoteClose = function() {
    closeWindow();
  };

}
