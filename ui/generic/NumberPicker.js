var numberPicker = {};

function NumberPicker(x, y) {
  const SIZE_X = 37;
  const SIZE_Y = 50;
  const BUTTON_SIZE = 14;
  const TEXT_SIZE = 17;
  const TEXT_Y = 15;

  var limitTens = 9;
  var limitOnes = 9;
  var tens = 0;
  var ones = 1;

  this.pickerPanel = createPanel(x, y, SIZE_X, SIZE_Y);
  this.pickerPanel.scale.set(1);

  var tensUp = function() {
    if (tens >= 9) { tens = 9; }
    if (tens >= limitTens) { tens = limitTens; }
    else { tens += 1; refresh(); }
  };
  var tensDown = function() {
    if (tens <= 0) { tens = 0; }
    else { tens -= 1; refresh(); }
  };

  var onesUp = function() {
    if (ones >= 9) { ones = 9; }
    if (ones >= limitOnes) { ones = limitOnes; }
    else { ones += 1; refresh(); }
  };
  var onesDown = function() {
    if (ones <= 0) { ones = 0; }
    else { ones -= 1; refresh(); }
  };

  this.setLimit = function(limit) {
    limitTens = Math.floor(limit / 10);
    limitOnes = limit % 10;
    refresh();
  };

  this.getNumber = function() {
    return tens * 10 + ones;
  };

  var numberText = new Phaser.BitmapText(game, 7,
                                    PADDING,
                                    'font-normal',
                                    "" + tens + ones,
                                    TEXT_SIZE, 'center');

  var tensUpButton = createButton("button-generic",
                        PADDING,
                        TEXT_Y,
                        BUTTON_SIZE,
                        BUTTON_SIZE,
                        tensUp, "^");
  var tensDownButton = createButton("button-generic",
                        PADDING,
                        TEXT_Y + BUTTON_SIZE + PADDING,
                        BUTTON_SIZE,
                        BUTTON_SIZE,
                        tensDown, "v");
  var onesUpButton = createButton("button-generic",
                        PADDING * 2 + BUTTON_SIZE,
                        TEXT_Y,
                        BUTTON_SIZE,
                        BUTTON_SIZE,
                        onesUp, "^");
  var onesDownButton = createButton("button-generic",
                        PADDING * 2 + BUTTON_SIZE,
                        TEXT_Y + BUTTON_SIZE + PADDING,
                        BUTTON_SIZE,
                        BUTTON_SIZE,
                        onesDown, "v");

  this.pickerPanel.addChild(numberText);
  this.pickerPanel.addChild(tensUpButton);
  this.pickerPanel.addChild(tensDownButton);
  this.pickerPanel.addChild(onesUpButton);
  this.pickerPanel.addChild(onesDownButton);

  function refresh() {
    numberText.text = "" + tens + ones;
  }

}
