function SidePanel() {

  const PANEL_POS_X = 0;
  const PANEL_POS_Y = 0;
  const FONT_SIZE = 36;

  const BUTTON_SIZE_X = 18;
  const BUTTON_SIZE_Y = 18;

  const PANEL_SIZE_X = PADDING * 2 + BUTTON_SIZE_X;
  const PANEL_SIZE_Y = PADDING * 6 + BUTTON_SIZE_Y * 4;

  const BUTTON_TEXT_SIZE = 8;

  var sidePanel;
  var useButton;
  var inventoryButton;

  var menuButton;
  var closeButton;

  var actionOnClick;
  var state;

  initPanel = function(state) {
    state = this.state;
    sidePanel = createPanel(PADDING, PADDING, PANEL_SIZE_X, PANEL_SIZE_Y);

    menuButton = createButton('button-generic', PADDING, PADDING, BUTTON_SIZE_X, BUTTON_SIZE_Y, battleActionOnClick, "=", BUTTON_TEXT_SIZE);
    inventoryButton = createButton('button-generic', PADDING, PADDING * 2 + BUTTON_SIZE_Y, BUTTON_SIZE_X, BUTTON_SIZE_Y, inventoryActionOnClick, "i", BUTTON_TEXT_SIZE);
    characterButton = createButton('button-generic', PADDING, PADDING * 3 + BUTTON_SIZE_Y * 2, BUTTON_SIZE_X, BUTTON_SIZE_Y, characterActionOnClick, "ch", BUTTON_TEXT_SIZE);
    closeButton = createButton('button-generic', PADDING, PADDING * 4 + BUTTON_SIZE_Y * 3, BUTTON_SIZE_X, BUTTON_SIZE_Y, function() {}, "x" , BUTTON_TEXT_SIZE);
    sidePanel.addChild(menuButton);
    sidePanel.addChild(inventoryButton);
    sidePanel.addChild(characterButton);
    sidePanel.addChild(closeButton);
  };

  inventoryActionOnClick = function() {
    if (windowManager.getNextInOrder() === SCREEN_NAMES.BATTLE) {
      var battleWindow = windowManager.getNextInOrderObject();
      new InventoryScreen(player.items, battleWindow.itemUse, "use");
    }
    else {
      new InventoryScreen(player.items);
    }
  };

  characterActionOnClick = function() {
    var changable = false;
    if (windowManager.getNextInOrder() === SCREEN_NAMES.TOWN ||
        windowManager.getNextInOrder() === SCREEN_NAMES.MARKET) {
      changable = true;
    }
    new CharacterSheet(player, changable);
  };

  battleActionOnClick = function() {
  };

  initPanel();



}
