var showMonster = {};

function ShowMonster(monster, mode, parentWindow) {

  windowBefore = parentWindow.WINDOW_NAME;

  const BUTTON_SIZE_X = 18;
  const BUTTON_SIZE_Y = 18;
  const LARGE_BUTTON_MOD = 18;

  const TEXT_BUTTON_SIZE = 8;
  const TEXT_TOOLTIP_SIZE = 8;
  const TEXT_SIZE = 8;
  const TEXT_POS = 15;

  const MONSTERWINDOW_SIZE_X = 92;
  const MONSTERWINDOW_SIZE_Y = 80;

  this.monsterWindowSizeX = MONSTERWINDOW_SIZE_X;
  this.monsterWindowSizeY = MONSTERWINDOW_SIZE_Y;

  if (typeof monsterPanel != 'undefined' && monsterPanel !== null) {
    monsterPanel.destroy(true);
  }
  // detailed monster panel
  monsterPanel = createPanel(parentWindow.x + parentWindow.sizex * 3 + PADDING, parentWindow.y, this.monsterWindowSizeX, this.monsterWindowSizeY);

  if (monster.slime === true) {
    monsterImageBackground = new Phaser.Sprite(game, 20, PADDING + 11, SLIME_SHEET, monster.getSlimeSpriteName());
  }
  else {
    monsterImageBackground = new Phaser.Sprite(game, 20, PADDING + 11, MONSTER_SHEET, monster.name);
  }
  monsterImageBackground.scale.setTo(3);
  monsterImageBackground.smoothed = false;
  monsterImageBackground.alpha = 0.2;
  monsterPanel.addChild(monsterImageBackground);

  var monsterNameText = write('font-normal', PADDING, PADDING, monster.name, TEXT_SIZE, 0, MONSTER_COLORS[monster.mod]);
  monsterPanel.addChild(monsterNameText);

  var monsterMessage = "";
  var typeMessage = "type: ";
  for (let type of monster.type) {
    typeMessage = typeMessage + type + " ";
  }
  monsterMessage += "" + typeMessage;

  if (typeof monster.description !== 'undefined' && monster.description !== null) {
    monsterMessage += "\n\n" + monster.description;
  }

  var attributesMessage = "ž "+monster.params.hp+"\nú "+monster.params.attack+"\nď "+monster.params.ranged;
  monsterMessage += "\n\n" + attributesMessage;

  monsterDescription = new Phaser.BitmapText(game, PADDING, PADDING * 2 + TEXT_SIZE,
                                    'font-normal',
                                    monsterMessage,
                                    TEXT_TOOLTIP_SIZE, 'left');
  monsterDescription.maxWidth = this.monsterWindowSizeX;
  monsterPanel.addChild(monsterDescription);

  return monsterPanel;
}
