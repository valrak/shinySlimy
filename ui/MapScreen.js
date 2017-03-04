function MapScreen(playerExpedition) {

  const WINDOW_NAME = SCREEN_NAMES.MAPSCREEN;
  const MAP_POS_X = 130;
  const MAP_POS_Y = 40;
  const MAP_SIZE_X = 200;
  const MAP_SIZE_Y = 160;

  const SCROLL_X = 20;
  const SCROLL_Y = 17;
  const SCROLL_SIZE_X = 110;
  const SCROLL_SIZE_Y = 90;

  const BUTTON_SIZE_X = 18;
  const BUTTON_SIZE_Y = 18;
  const LARGE_BUTTON_MOD = 18;

  const TEXT_BUTTON_SIZE = 8;
  const TEXT_TOOLTIP_SIZE = 8;

  // offset from the main tile
  const TO_LEFT_X = -21;
  const TO_LEFT_Y = 4;

  const TO_CENTER_X = 0;
  const TO_CENTER_Y = 8;

  const TO_RIGHT_X = 20;
  const TO_RIGHT_Y = 4;

  const INITIAL_HEX_X = 60;
  const INITIAL_HEX_Y = 60;

  const TEXT_SIZE = 8;
  var expedition = playerExpedition;

  var mapPanel;

  function closeWindow() {
    windowManager.unregister(WINDOW_NAME);
    mapPanel.destroy(true);
    mapPanel = null;
  }

  function displayMap(expedition) {
    x = INITIAL_HEX_X;
    y = INITIAL_HEX_Y;
    first = true;
    expeditionMapLimit = expedition.travelLog.length-3;
    if (expeditionMapLimit < 0) {
      expeditionMapLimit = 0;
    }

    for (let i = expedition.travelLog.length-1; i >= expeditionMapLimit; i -= 1) {
        if (first === true) {
          let hexSprite = game.make.sprite(x, y, TERRAIN_SHEET, expedition.travelLog[i].tile);
          hexSprite.smoothed = false;
          mapPanel.addChild(hexSprite);
          first = false;
        }
        else {
            if (expedition.travelLog[i + 1].adj === 0) {
                x += TO_CENTER_X;
                y += TO_CENTER_Y;
            }
            if (expedition.travelLog[i + 1].adj === -1) {
                x += TO_LEFT_X;
                y += TO_LEFT_Y;
            }
            if (expedition.travelLog[i + 1].adj === 1) {
                x += TO_RIGHT_X;
                y += TO_RIGHT_Y;
            }
        let hexSprite = game.make.sprite(x, y, TERRAIN_SHEET, expedition.travelLog[i].tile);
        hexSprite.smoothed = false;
        mapPanel.addChild(hexSprite);
      }
    }
  }

  function refresh() {
    closeWindow();
    initPanel();
  }

  function drawNextHex(x, y, tile, information) {
    let hexSprite = game.make.sprite(x, y, TERRAIN_SHEET, tile);
    hexSprite.smoothed = false;
    mapPanel.addChild(hexSprite);
    let tileText = new Phaser.BitmapText(game, x + 5 - information.length,
                                      y + 7,
                                      'font-normal',
                                      information,
                                      TEXT_SIZE, 'left');
    mapPanel.addChild(tileText);
  }

  var initPanel = () => {
    windowManager.register(WINDOW_NAME, this);

    mapPanel = createPanel(MAP_POS_X, MAP_POS_Y, MAP_SIZE_X, MAP_SIZE_Y);

    mapScroll = createPanel(SCROLL_X, SCROLL_Y, SCROLL_SIZE_X, SCROLL_SIZE_Y, 'background-scroll');
    mapScroll.scale.setTo(1);
    mapPanel.addChild(mapScroll);

    headerText = new Phaser.BitmapText(game, PADDING * 2,
                                      PADDING * 2,
                                      'font-normal',
                                      'Wilderness map',
                                      TEXT_SIZE, 'left');
    mapPanel.addChild(headerText);

    infoMessage = 'Expedition '+player.runs+'\n'+
    'Day: '+player.expedition.travelLog.length+'\n'+
    'Danger: '+player.expedition.dangerLevel+'\n'+
    'Food: '+player.getFood() + '/' + player.getEating();



    infoText = new Phaser.BitmapText(game, MAP_SIZE_X - 60,
                                      PADDING * 2,
                                      'font-normal',
                                      infoMessage,
                                      TEXT_SIZE, 'left');
    mapPanel.addChild(infoText);

    displayMap(expedition);

    leftTile = expedition.nextTile();
    centerTile = expedition.nextTile();
    rightTile = expedition.nextTile();

    leftArrow = game.make.button(INITIAL_HEX_X - 10,
                                      INITIAL_HEX_Y - 12,
                                'up-left-arrow');
    leftArrow.smoothed = false;
    leftArrow.events.onInputUp.add(this.goTo, {area : leftTile, adj : 1});
    mapPanel.addChild(leftArrow);

    rightArrow = game.make.button(INITIAL_HEX_X + 20,
                                      INITIAL_HEX_Y - 12,
                                'up-right-arrow');
    rightArrow.smoothed = false;
    rightArrow.events.onInputUp.add(this.goTo, {area : rightTile, adj : -1});
    mapPanel.addChild(rightArrow);

    upArrow = game.make.button(INITIAL_HEX_X + 7,
                                      INITIAL_HEX_Y - 22,
                                'up-arrow');
    upArrow.smoothed = false;
    upArrow.events.onInputUp.add(this.goTo, {area : centerTile, adj : 0});
    mapPanel.addChild(upArrow);

    // debug
    drawNextHex(INITIAL_HEX_X - 37, INITIAL_HEX_Y - 25, leftTile, 'danger');
    drawNextHex(INITIAL_HEX_X, INITIAL_HEX_Y - 40, centerTile, 'same');
    drawNextHex(INITIAL_HEX_X + 37, INITIAL_HEX_Y - 25, rightTile, 'tame');

    var retreatButton = createButton("button-generic",
                          PADDING * 2,
                          mapPanel.height / scale - BUTTON_SIZE_Y - PADDING * 2,
                          BUTTON_SIZE_X + 20,
                          BUTTON_SIZE_Y,
                          function() {
                            closeWindow(); }, "retreat");
    mapPanel.addChild(retreatButton);
  };

  this.goTo = function(area, adj) {
    expedition.goTo(callback, this.area, this.adj);
  };

  this.remoteClose = function() {
    closeWindow();
  };

  this.setActive = function(active) {
    if (active === true) {
      for (let child of mapPanel.children) {
        if (child.input !== null) {
          child.input.enabled = true;
        }
        child.inputEnabled = true;
      }
      game.world.bringToTop(mapPanel);
    }
    else {
      for (let child of mapPanel.children) {
        if (child.input !== null) {
          child.input.enabled = false;
        }
        child.inputEnabled = false;
      }
    }
  };

  function callback(result) {
    expedition.player.recoverSlimes();
    if (result === 'defeat') {
      closeWindow();
    }
    else if (result === 'foodFail') {
      closeWindow();
      new ConfirmWindow(CONFIRM_X, CONFIRM_Y, function() {}, "You don't have enough food.\nYou've returned to town.", false);
    }
    else {
      refresh();
    }
  }

  initPanel();
}
