function MarketScreen(player) {

  const WINDOW_NAME = SCREEN_NAMES.MARKET;
  const MARKET_POS_X = 130;
  const MARKET_POS_Y = 40;
  const MARKET_SIZE_X = 200;
  const MARKET_SIZE_Y = 160;
  const PADDING = 2;
  const PICKER_POS_X = MARKET_SIZE_X / 2 + PADDING;
  const PICKER_POS_Y = MARKET_SIZE_Y - 52;


  const BUTTON_SIZE_X = 18;
  const BUTTON_SIZE_Y = 18;
  const LARGE_BUTTON_MOD = 18;

  const TEXT_BUTTON_SIZE = 8;
  const TEXT_TOOLTIP_SIZE = 8;

  const TEXT_SIZE = 8;

  this.player = player;
  var marketPanel;

  function closeWindow() {
    windowManager.unregister(WINDOW_NAME);
    marketPanel.destroy(true);
    marketPanel = null;
  }

    function refresh() {
    closeWindow();
    initPanel();
  }



  var initPanel = () => {
    windowManager.register(WINDOW_NAME, this);

    marketPanel = createPanel(MARKET_POS_X, MARKET_POS_Y, MARKET_SIZE_X, MARKET_SIZE_Y);

    headerText = new Phaser.BitmapText(game, PADDING * 2,
                                      PADDING * 2,
                                      'font-normal',
                                      'Marketplace',
                                      TEXT_SIZE, 'left');
    marketPanel.addChild(headerText);

    moneyText = new Phaser.BitmapText(game, MARKET_SIZE_X - 30,
                                            PADDING * 2,
                                            'font-normal',
                                            this.player.money+'$',
                                            TEXT_SIZE, 'center');
    marketPanel.addChild(moneyText);

    var closeButton = createButton("button-generic",
                          PADDING * 2,
                          marketPanel.height / scale - BUTTON_SIZE_Y - PADDING * 2,
                          BUTTON_SIZE_X,
                          BUTTON_SIZE_Y,
                          function() {
                            closeWindow(); }, "x");
    marketPanel.addChild(closeButton);

    var sellButton = createButton("button-generic",
                          PADDING * 4 + BUTTON_SIZE_X,
                          marketPanel.height / scale - BUTTON_SIZE_Y - PADDING * 2,
                          BUTTON_SIZE_X,
                          BUTTON_SIZE_Y,
                          function() {
                            sellItems();
                          }, "sell");
    marketPanel.addChild(sellButton);

    var buyButton = createButton("button-generic",
                          PADDING * 6 + BUTTON_SIZE_X * 2,
                          marketPanel.height / scale - BUTTON_SIZE_Y - PADDING * 2,
                          BUTTON_SIZE_X,
                          BUTTON_SIZE_Y,
                          function() {
                            buyItems();
                          }, "buy");
    marketPanel.addChild(buyButton);
  };


  this.remoteClose = function() {
    closeWindow();
  };

  this.setActive = function(active) {
    if (active === true) {
      for (let child of marketPanel.children) {
        if (child.input !== null) {
          child.input.enabled = true;
        }
        child.inputEnabled = true;
      }
      game.world.bringToTop(marketPanel);
    }
    else {
      for (let child of marketPanel.children) {
        if (child.input !== null) {
          child.input.enabled = false;
        }
        child.inputEnabled = false;
      }
    }
  };

  function buyItems() {
    items = [];
    for (let item in itemsData) {
      if (itemsData[item].flags.indexOf('shop') !== -1 ) {
        items.push(new Item(item));
      }
    }
    inventory = new InventoryScreen(items, callback, 'buy');
    inventory.invPosX = MARKET_POS_X;
    inventory.invPosY = MARKET_POS_Y + PADDING + 40;
    inventory.invSizeX = MARKET_SIZE_X / 2;
    inventory.invSizeY = MARKET_SIZE_Y - 14;
    inventory.maxItemsInRow = 5;
    inventory.maxRows = 6;
    inventory.refresh();
    // var picker = new NumberPicker(PICKER_POS_X, PICKER_POS_Y);
    // marketPanel.addChild(picker.pickerPanel);

    function callback(item) {
      if (typeof item !== 'undefined' || item !== null) {
        var amount = 1;
        if (typeof inventory.picker !== 'undefined' || inventory.picker !== null) {
          amount = inventory.picker.getNumber();
        }
        this.player.buyItem(item, amount);
        refresh();
      }
    }



  }

  function sellItems() {
    inventory = new InventoryScreen(this.player.items, callback, 'sell');
    inventory.invPosX = MARKET_POS_X;
    inventory.invPosY = MARKET_POS_Y + PADDING + 40;
    inventory.invSizeX = MARKET_SIZE_X / 2;
    inventory.invSizeY = MARKET_SIZE_Y - 14;
    inventory.maxItemsInRow = 5;
    inventory.maxRows = 6;
    inventory.refresh();

    function callback(item) {
      if (typeof item !== 'undefined' || item !== null) {
        var amount = 1;
        if (typeof inventory.picker !== 'undefined' || inventory.picker !== null) {
          amount = inventory.picker.getNumber();
        }
        this.player.sellItem(item, amount);
        refresh();
      }
    }
  }

  initPanel();
}
