function TownScreen(player) {

  const WINDOW_NAME = SCREEN_NAMES.TOWN;
  const TOWN_POS_X = 100;
  const TOWN_POS_Y = 30;
  const TOWN_SIZE_X = 186;
  const TOWN_SIZE_Y = 180;

  const BUTTON_SIZE_X = 18;
  const BUTTON_SIZE_Y = 18;
  const LARGE_BUTTON_MOD = 18;

  const TEXT_BUTTON_SIZE = 8;
  const TEXT_TOOLTIP_SIZE = 8;

  const TEXT_SIZE = 8;

  this.player = player;
  var townPanel;

  function closeWindow() {
    windowManager.unregister(WINDOW_NAME);
    townPanel.destroy(true);
    townPanel = null;
  }

    function refresh() {
    closeWindow();
    initPanel();
  }



  var initPanel = () => {
    windowManager.register(WINDOW_NAME, this);

    townPanel = createPanel(TOWN_POS_X, TOWN_POS_Y, TOWN_SIZE_X, TOWN_SIZE_Y);

    townImage = game.make.sprite(PADDING, 15,
                     BACKGROUND_SHEET, 'town');
    townImage.smoothed = false;
    townPanel.addChild(townImage);

    headerText = new Phaser.BitmapText(game, PADDING * 2,
                                      PADDING * 2,
                                      'font-normal',
                                      'Town of Varnham legend',
                                      TEXT_SIZE, 'left');
    townPanel.addChild(headerText);

    var newExpediton = function(ok) {
      if (ok === true) {
        new MapScreen(player.newExpedition(player));
      }
    };

    var expeditionButton = createButton("button-generic",
                          PADDING * 2,
                          townPanel.height / scale - BUTTON_SIZE_Y - PADDING * 2,
                          BUTTON_SIZE_X + 30,
                          BUTTON_SIZE_Y,
                          function() {
                          new ConfirmWindow(CONFIRM_X, CONFIRM_Y, newExpediton, "Leaving to expedition.\nAre you Sure?"); }, "expedition");
    townPanel.addChild(expeditionButton);

    var marketButton = createButton("button-generic",
                          BUTTON_SIZE_X + 30 + PADDING * 3,
                          townPanel.height / scale - BUTTON_SIZE_Y - PADDING * 2,
                          BUTTON_SIZE_X + 20,
                          BUTTON_SIZE_Y,
                          function() {
                            new MarketScreen(this.player); }, "market");
    townPanel.addChild(marketButton);
  };


  this.remoteClose = function() {
    closeWindow();
  };

  this.setActive = function(active) {
    if (active === true) {
      for (let child of townPanel.children) {
        if (child.input !== null) {
          child.input.enabled = true;
        }
        child.inputEnabled = true;
      }
      game.world.bringToTop(townPanel);
    }
    else {
      for (let child of townPanel.children) {
        if (child.input !== null) {
          child.input.enabled = false;
        }
        child.inputEnabled = false;
      }
    }
  };

  initPanel();
}
