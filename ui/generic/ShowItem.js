var showItem = {};

function ShowItem(item, mode, parentWindow) {

//var showItem = (item, mode, parentWindow) => {
  windowBefore = parentWindow.WINDOW_NAME;

  const INV_POS_X = 120;
  const INV_POS_Y = 30;
  const INV_SIZE_X = 100;
  const INV_SIZE_Y = 110;

  const BUTTON_SIZE_X = 18;
  const BUTTON_SIZE_Y = 18;
  const LARGE_BUTTON_MOD = 18;

  const TEXT_BUTTON_SIZE = 8;
  const TEXT_TOOLTIP_SIZE = 8;
  const TEXT_SIZE = 8;
  const TEXT_POS = 15;

  const ITEMWINDOW_SIZE_X = 92;
  const ITEMWINDOW_SIZE_Y = 80;

  this.itemWindowSizeX = ITEMWINDOW_SIZE_X;
  this.itemWindowSizeY = ITEMWINDOW_SIZE_Y;

  var chooseMode = false;
  var chooseAndStay = false;
  var marketMode = false;
  var useButtonText = "Use";

  if (mode === 'use' || parentWindow.windowBefore === SCREEN_NAMES.BATTLE ||
                        parentWindow.windowBefore === SCREEN_NAMES.MAPSCREEN) {
    useButtonText = "Use";
  }
  else if (mode === 'choose') {
    chooseMode = true;
    useButtonText = "Choose";
  }
  else if (mode === 'buy') {
    chooseAndStay = true;
    useButtonText = "Buy";
  }
  else if (mode === 'sell') {
    chooseAndStay = true;
    useButtonText = "Sell";
  }

  if (mode === 'use' || parentWindow.windowBefore === SCREEN_NAMES.BATTLE ||
                        parentWindow.windowBefore === SCREEN_NAMES.MAPSCREEN) {
    mode = 'use';
    useButtonText = "Use";
  }
  else if (mode === 'choose') {
    chooseMode = true;
    useButtonText = "Choose";
  }
  else if (mode === 'buy') {
    chooseAndStay = true;
    useButtonText = "Buy";
  }
  else if (mode === 'sell') {
    chooseAndStay = true;
    useButtonText = "Sell";
  }

  if (typeof itemPanel != 'undefined' && itemPanel !== null) {
    itemPanel.destroy(true);
  }
  // detailed item panel
  itemPanel = createPanel(parentWindow.x + parentWindow.sizex * 3 + PADDING, parentWindow.y, this.itemWindowSizeX, this.itemWindowSizeY);

  itemImageBackground = new Phaser.Sprite(game, 20, PADDING + 11, ITEM_SHEET, item.name);
  itemImageBackground.scale.setTo(3);
  itemImageBackground.smoothed = false;
  itemImageBackground.alpha = 0.2;
  itemPanel.addChild(itemImageBackground);

  var itemNameText = write('font-normal', PADDING, PADDING, item.name, TEXT_SIZE, 0, ITEM_COLORS[item.params.type[0]]);
  itemPanel.addChild(itemNameText);

  itemDescription = new Phaser.BitmapText(game, PADDING, PADDING + 11,
                                    'font-normal',
                                    item.params.description,
                                    TEXT_TOOLTIP_SIZE, 'left');
  itemDescription.maxWidth = this.itemWindowSizeX;
  itemPanel.addChild(itemDescription);

  priceText = 'Price: '+item.params.price+'$';
  if (mode === 'sell') {
    priceText = 'Sell for: '+Math.floor(item.params.price/2)+'$';
  }
  itemPrice = new Phaser.BitmapText(game, PADDING, PADDING + 33,
                                    'font-normal',
                                    priceText,
                                    TEXT_TOOLTIP_SIZE, 'left');
  itemPanel.addChild(itemPrice);

  usableInText = null;
  if (typeof item.params.consumable !== 'undefined' &&
    item.params.consumable === 1 && item.params.type.indexOf('normal') !== -1) {
    usableInText = "Use item in battle";
  }
  if (item.params.type.indexOf('dice') !== -1) {
    usableInText = "Put dice into slime";
  }
  if (item.params.type.indexOf('food') !== -1) {
    usableInText = "Slimes eat this each turn in expedition";
  }
  if (usableInText !== null) {
    useDescription = new Phaser.BitmapText(game, PADDING, PADDING + 40,
                                      'font-normal',
                                      usableInText,
                                      TEXT_TOOLTIP_SIZE, 'left');
    useDescription.maxWidth = this.itemWindowSizeX;
    itemPanel.addChild(useDescription);
  }

  if (!(typeof mode === 'undefined' || mode === "" || mode === "view" || mode === null)) {
    if (!(mode === 'use' && item.params.consumable !== 1)) {
      var useButton = createButton("button-generic",
                                PADDING * 2,
                                this.itemWindowSizeY - BUTTON_SIZE_Y + 4 - PADDING * 2,
                                BUTTON_SIZE_X + LARGE_BUTTON_MOD,
                                BUTTON_SIZE_Y - 4,
                                function () {
                                  if (chooseMode === true) {
                                    closeWindow();
                                    parentWindow.callback(item);
                                  }
                                  else if (chooseAndStay === true) {
                                    parentWindow.callback(item);
                                    parentWindow.refresh();
                                  }
                                  else {
                                    item.use();
                                    if (item.active === false) {
                                      itemPanel.visible = false;
                                    }

                                    parentWindow.refresh();
                                  }
                                }, useButtonText);
      itemPanel.addChild(useButton);
      if (mode === 'buy' || mode ==='sell') {
        this.picker = new NumberPicker(PADDING, ITEMWINDOW_SIZE_Y + PADDING);
        itemPanel.addChild(this.picker.pickerPanel);
        parentWindow.picker = this.picker;
      }
    }
  }
  return itemPanel;
}
