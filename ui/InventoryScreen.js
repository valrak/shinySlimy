var inventoryScreen = {};

function InventoryScreen(items, callback, mode) {

  const WINDOW_NAME = SCREEN_NAMES.INVENTORY;

  const INV_POS_X = 120;
  const INV_POS_Y = 30;
  const INV_SIZE_X = 100;
  const INV_SIZE_Y = 110;

  const MAX_ITEMS_IN_ROW = 5;
  const MAX_ROWS = 4;

  const BUTTON_SIZE_X = 18;
  const BUTTON_SIZE_Y = 18;
  const LARGE_BUTTON_MOD = 18;

  const TEXT_BUTTON_SIZE = 8;
  const TEXT_TOOLTIP_SIZE = 8;
  const TEXT_SIZE = 8;
  const TEXT_POS = 15;

  var chooseMode = false;
  var chooseAndStay = false;
  var marketMode = false;
  var useButtonText = "Use";
  var windowBefore = windowManager.getNextInOrder();
  this.x = INV_POS_X;
  this.y = INV_POS_Y;
  this.sizex = INV_SIZE_X;
  this.sizey = INV_SIZE_Y;
  this.maxItemsInRow = MAX_ITEMS_IN_ROW;
  this.maxRows = MAX_ROWS;

  this.callback = callback;

  this.picker = null;

  if (mode === 'use' || windowBefore === SCREEN_NAMES.BATTLE ||
                        windowBefore === SCREEN_NAMES.MAPSCREEN) {
    mode = 'use';
  }
  else if (mode === 'choose') {
    chooseMode = true;
  }
  else if (mode === 'buy') {
    chooseAndStay = true;
  }
  else if (mode === 'sell') {
    chooseAndStay = true;
  }
  var constrained = true;


  var activeWindow = windowManager.getNextInOrder();

  var offset = SIZE_OF_SPRITE + PADDING;
  var page = 1;
  var noOfItems = items.length;
  var maxItemsOnPage = this.maxItemsInRow * this.maxRows;
  var pages = Math.ceil(noOfItems / maxItemsOnPage);
  var pagesText;

  var thisObject = this;

  var useButton;
  var backgroundInventory;
  var inventoryPanel;
  var itemPanel;

  var showItemWindow = (item, mode, parentWindow) => {
    itemPanel = new ShowItem(item, mode, parentWindow);
  };

  var initPanel = () => {
    windowManager.register(WINDOW_NAME, this);
    // main panel
    inventoryPanel = createPanel(this.x, this.y, this.sizex, this.sizey);
    var goLeft = function() { page -= 1; updatePages(); };
    var goRight = function() { page += 1; updatePages(); };
    var leftButton = createButton("button-generic",
                          inventoryPanel.width / scale - BUTTON_SIZE_X * 2 - PADDING * 3 + 1,
                          inventoryPanel.height / scale - BUTTON_SIZE_Y - PADDING * 2,
                          BUTTON_SIZE_X,
                          BUTTON_SIZE_Y,
                          goLeft, "<");
    var rightButton = createButton("button-generic",
                          inventoryPanel.width / scale - BUTTON_SIZE_X - PADDING * 2,
                          inventoryPanel.height / scale - BUTTON_SIZE_Y - PADDING * 2,
                          BUTTON_SIZE_X,
                          BUTTON_SIZE_Y,
                          goRight, ">");
    var closeButton = createButton("button-generic",
                          PADDING * 2,
                          inventoryPanel.height / scale - BUTTON_SIZE_Y - PADDING * 2,
                          BUTTON_SIZE_X,
                          BUTTON_SIZE_Y,
                          function() {
                            closeWindow(); }, "x");
    inventoryPanel.addChild(leftButton);
    inventoryPanel.addChild(rightButton);
    inventoryPanel.addChild(closeButton);
    pagesText = new Phaser.BitmapText(game, this.sizex - TEXT_POS * 2,
                                      this.sizey - BUTTON_SIZE_Y - PADDING * 6,
                                      'font-normal',
                                      page + "/" + pages,
                                      TEXT_TOOLTIP_SIZE, 'left');
    inventoryPanel.addChild(pagesText);
  };

  var displayItems = (items, page) => {
    var currentPageItems = page * maxItemsOnPage + 1;
    var itemNo = 1;
    var drawedItemNo = 1;
    var itemRowNo = 1;
    var yOffset = PADDING;
    var xOffset = PADDING;
    var itemButton;

    if (chooseMode === true) {
      var removeButton = createButton("button-generic",
                            PADDING * 2 + BUTTON_SIZE_X,
                            inventoryPanel.height / scale - BUTTON_SIZE_Y - PADDING * 2,
                            BUTTON_SIZE_X + LARGE_BUTTON_MOD,
                            BUTTON_SIZE_Y,
                            function() {
                              closeWindow();
                              callback(null); }, "remove");
      inventoryPanel.addChild(removeButton);
    }
    for (let item of items) {
      if (drawedItemNo <= maxItemsOnPage) {
          // get the page items (itemNo must be between correct item page numbers)
          if (itemNo >= (currentPageItems - maxItemsOnPage) &&
            (itemNo < currentPageItems))  {
          // var itemButton = game.make.button(xOffset, yOffset, ITEM_SHEET, item.name);
          itemButton = new Phaser.Button(game, xOffset, yOffset);
          var itemSprite = game.make.sprite(0, 0, ITEM_SHEET, item.name);
          itemButton.loadTexture(itemSprite.texture);
          itemButton.smoothed = false;
          itemButton.events.onInputUp.add(showItemWindow.bind(this, item, mode, this));

          inventoryPanel.addChild(itemButton);

          if (item.amount > 1) {
              itemAmountText = new Phaser.BitmapText(game, xOffset, yOffset,
                                                'font-normal',
                                                item.amount,
                                                TEXT_TOOLTIP_SIZE, 'left');
              inventoryPanel.addChild(itemAmountText);
          }
          xOffset += offset;
          itemRowNo += 1;
          drawedItemNo += 1;
          if (itemRowNo > this.maxItemsInRow) {
            xOffset = PADDING;
            yOffset += offset;
            itemRowNo = 1;
          }
        }
      }
      itemNo +=1;
    }
  };

  this.refresh = function() {
    refresh();
  };

  function refresh() {
    items = cleanItems(items);
    closeWindow();
    initPanel();
    displayItems(items, page);
  }

  initPanel();
  displayItems(items, page);

  function updatePages() {
    noOfItems = items.length;
    if (noOfItems === 0) {
      pages = 1;
    }
    else {
      pages = Math.ceil(noOfItems / maxItemsOnPage);
    }
    // define boundaries
    if (page > pages) {
      page = pages;
    }
    else if (page <= 0) {
      page = 1;
    }
    else {
      // update text
      pagesText.value = page + "/" + pages;
      this.refresh();
    }
  }

  closeWindow = function() {
    if (typeof itemPanel != 'undefined' && itemPanel !== null) {
      itemPanel.destroy(true);
    }
    windowManager.unregister(WINDOW_NAME);
    inventoryPanel.destroy(true);
    inventoryPanel = null;
  };

  function cleanItems(field) {
    var cleanedItems = field.slice();
    for (let item of field) {
      if (item.active === false) {
        index = cleanedItems.indexOf(item);
        if (index !== -1) {
          cleanedItems.splice(index, 1);
        }
      }
    }

    return cleanedItems;
  }
    // group stackable items based on amount
  //   var itemMap = {};
  //   for (let item of cleanedItems) {
  //     var amount = 1;
  //     // stackable items are grouped together
  //     if (item.params.stackable === 1) {
  //       if (item.amount !== undefined) {
  //         amount += item.amount - 1;
  //       }
  //       if (item in itemMap) {
  //         itemMap[item] = itemMap[item] + amount;
  //       }
  //       else {
  //         itemMap[item] = amount;
  //       }
  //     }
  //     // non-stackable are just put into map
  //     else {
  //       itemMap[item] = 1;
  //     }
  //   }
  //
  //   var groupedItems = [];
  //   for (let item in itemMap) {
  //     item.amount = itemMap[item];
  //     groupedItems.push(item);
  //   }
  //   return groupedItems;
  // }
  this.setActive = function(active) {
    if (active === true) {
      for (let child of inventoryPanel.children) {
        if (child.input !== null) {
          child.input.enabled = true;
        }
        child.inputEnabled = true;
      }
      if (typeof itemPanel != 'undefined') {
        for (let child of itemPanel.children) {
          if (child.input !== null) {
            child.input.enabled = true;
          }
          child.inputEnabled = true;
        }
      }
      game.world.bringToTop(inventoryPanel);
      if (typeof itempanel !== 'undefined') {
        game.world.bringToTop(itemPanel);
      }
    }
    else {
      for (let child of inventoryPanel.children) {
        if (child.input !== null) {
          child.input.enabled = false;
        }
        child.inputEnabled = false;
      }
      if (typeof itemPanel != 'undefined') {
        for (let child of itemPanel.children) {
          if (child.input !== null) {
            child.input.enabled = false;
          }
          child.inputEnabled = false;
        }
      }
    }
  };

  this.remoteClose = function() {
    closeWindow();
  };

}
