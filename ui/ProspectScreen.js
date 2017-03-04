var prospectScreen = {};

function ProspectScreen(x, y, callback, player, opposition, items) {
  const BUTTON_SIZE_X = 30;
  const BUTTON_SIZE_Y = 17;
  const TEXT_SIZE = 8;
  const WINDOW_NAME = "prospect-window";

  const MONSTERS_POS_X = 20;
  const MONSTERS_POS_Y = 25;

  const ITEM_POS_X = 20;
  const ITEM_POS_Y = 55;

  var itemPanel;

  windowManager.register(WINDOW_NAME, this);

  var showItemWindow = (item, mode, parentWindow) => {
    itemPanel = new ShowItem(item, mode, parentWindow);
  };

  var messageText = new Phaser.BitmapText(game, 7,
                                    PADDING,
                                    'font-normal',
                                    'Monsters ahead!',
                                    TEXT_SIZE, 'center');

  // var sizex = messageText.textWidth + PADDING * 2 + 20;
  // var sizey = messageText.textHeight + PADDING * 4 + 5 + BUTTON_SIZE_Y;
  this.x = x;
  this.y = y;
  this.sizex = 110;
  this.sizey = 100;


  var prospectPanel = createPanel(x, y, this.sizex, this.sizey);
  var yesPositionX = this.sizex / 2 - BUTTON_SIZE_X - PADDING;

  var yesButton = createButton("button-generic",
                        yesPositionX,
                        this.sizey - BUTTON_SIZE_Y - PADDING,
                        BUTTON_SIZE_X,
                        BUTTON_SIZE_Y,
                        function() { callback(true); closeWindow(); }, 'battle');

  prospectPanel.addChild(messageText);
  prospectPanel.addChild(yesButton);
  var noButton = createButton("button-generic",
                        this.sizex / 2 + PADDING,
                        this.sizey - BUTTON_SIZE_Y - PADDING,
                        BUTTON_SIZE_X,
                        BUTTON_SIZE_Y,
                        function() { callback(false); closeWindow(); }, 'avoid');

  prospectPanel.addChild(noButton);

  var offset = SIZE_OF_SPRITE + PADDING;

  // monsters prospect
  var xOffset = ITEM_POS_X;

  var monstersText = new Phaser.BitmapText(game, MONSTERS_POS_X - 5,
                                    MONSTERS_POS_Y - 10,
                                    'font-normal',
                                    'Enemies',
                                    TEXT_SIZE, 'center');
  prospectPanel.addChild(monstersText);
  for (let monster in opposition.slimes) {
      monsterButton = new Phaser.Button(game, xOffset, MONSTERS_POS_Y);
      var monsterSprite = game.make.sprite(0, 0, opposition.slimes[monster].getSlimeSheetName(), opposition.slimes[monster].getSlimeSpriteName());
      monsterButton.loadTexture(monsterSprite.texture);
      monsterButton.smoothed = false;
      prospectPanel.addChild(monsterButton);
      xOffset += offset;
    }

  // items prospect
  xOffset = ITEM_POS_X;
  var itemsText = new Phaser.BitmapText(game, ITEM_POS_X - 5,
                                    ITEM_POS_Y - 10,
                                    'font-normal',
                                    'Loot',
                                    TEXT_SIZE, 'center');
  prospectPanel.addChild(itemsText);

  for (let item of items) {
    itemButton = new Phaser.Button(game, xOffset, ITEM_POS_Y);
    var itemSprite = game.make.sprite(0, 0, ITEM_SHEET, item.name);
    itemButton.loadTexture(itemSprite.texture);
    itemButton.smoothed = false;
    prospectPanel.addChild(itemButton);

    if (item.amount > 1) {
        itemAmountText = new Phaser.BitmapText(game, xOffset, yOffset,
                                          'font-normal',
                                          item.amount,
                                          TEXT_TOOLTIP_SIZE, 'left');
        prospectPanel.addChild(itemAmountText);
    }
    itemButton.events.onInputUp.add(showItemWindow.bind(this, item, null, this));
    xOffset += offset;
  }

  function closeWindow() {
    windowManager.unregister(WINDOW_NAME);
    prospectPanel.destroy(true);
    if (typeof itemPanel != 'undefined' && itemPanel !== null) {
      itemPanel.destroy(true);
    }
    prospectPanel = null;
  }

  function refresh() {

  }
}
