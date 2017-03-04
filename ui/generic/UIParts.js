function write(fontName, x, y, text, size=24, maxCh = 0, color=null) {
  if (maxCh > 0) {
    text = newLineText(text, maxCh);
  }
  bmpText = game.add.bitmapText(x, y, 'font-normal', text, size);
  bmpText.smoothed = false;
  if (color !== null) {
    bmpText.tint = color;
  }
  return bmpText;
}

function newLineText(text, maxCh) {
  var newText = "";
  var chars = 0;
  for (let ch of text) {
    newText += ch;
    chars += 1;
    if (chars >= maxCh) {
      chars = 0;
      newText += "\n";
    }
  }
  return newText;
}

function createButton(spriteName, x, y, sizex, sizey, action, text, textsize = 8) {

  // TODO: spriteName - if not 'button-generic', then usable as image inside button
  // TODO: hover does not work properly.

  var hover = false;
  var buttonSprite;

  var button = game.add.button(x, y);

  button.events.onInputOver.add(function() { hover = true; }, this);
  button.events.onInputOut.add(function() { hover = false; }, this);

  if (hover === true) {
    buttonSprite = stretchImage('button-generic-hover', sizex, sizey);
  }
  else {
    buttonSprite = stretchImage('button-generic', sizex, sizey);
  }

  button.loadTexture(buttonSprite.texture);
  button.x = x;
  button.y = y;

  if (typeof action !== 'undefined') {
    button.events.onInputDown.add(action);
  }
  button.smoothed = false;

  if (text !== undefined) {
    //bmpText = write('font-normal', x + sizex, y + sizey, text);
    // TODO: make proper centering
    var sub = 0;
    if (text.length > 3) {
      sub = text.length;
    }
    bmpText = new Phaser.BitmapText(game, sizex / 4 - sub, sizey / 4, 'font-normal', text, textsize, 'left');
    bmpText.smoothed = false;
    button.addChild(bmpText);
  }

  return button;
}

function createPanel(x, y, sizex, sizey, texture='background-generic') {
  var panelSprite = stretchImage(texture, sizex, sizey);
  var panel = game.add.sprite(x, y);
  panel.loadTexture(panelSprite.texture);
  panel.x = x;
  panel.y = y;
  panel.scale.setTo(scale);
  panel.smoothed = false;

  return panel;
}

function stretchImage(image, width, height, cornerXSize = 5, cornerYSize = 5) {
  var workBitmap = game.add.bitmapData(width, height);
  var originalImage = game.make.sprite(0, 0, image);

  // UL
  workBitmap.copyRect(originalImage, new Phaser.Rectangle(0, 0, cornerXSize, cornerYSize));

  // U
  // args : copy(source, x, y, width, height, tx, ty, newWidth, newHeight, rotate, anchorX, anchorY, scaleX, scaleY, alpha, blendMode, roundPx
  workBitmap.copy(
    originalImage,                              // source
    cornerXSize + 1, 0,                         // x, y
    1, cornerYSize,                             // width, height
    cornerXSize, 0,                             // tx, ty
    width - cornerXSize * 2, cornerYSize        // newWidth, newHeight
  );

  // UR
  workBitmap.copyRect(originalImage, new Phaser.Rectangle(originalImage.width - cornerXSize, 0, cornerXSize, cornerYSize), width - cornerXSize);

  // L
  workBitmap.copy(
    originalImage,
    0, cornerYSize + 1,
    cornerXSize, 1,
    0, cornerYSize,
    cornerXSize, height - cornerYSize * 2
  );

  // R
  workBitmap.copy(
    originalImage,
    originalImage.width - cornerXSize, cornerYSize + 1,
    cornerXSize, 1,
    width - cornerXSize, cornerYSize,
    cornerXSize, height - cornerYSize * 2
  );

  // DL
  workBitmap.copyRect(originalImage, new Phaser.Rectangle(0, originalImage.height - cornerYSize, cornerXSize, cornerYSize), 0, height - cornerYSize);

  // DR
  workBitmap.copyRect(originalImage, new Phaser.Rectangle(originalImage.width - cornerXSize, originalImage.height - cornerYSize, cornerXSize, cornerYSize), width - cornerXSize, height - cornerYSize);

  // D
  workBitmap.copy(
    originalImage,
    cornerXSize + 1, originalImage.height - cornerYSize,
    1, cornerYSize,
    cornerXSize, height - cornerYSize,
    width - cornerXSize * 2, cornerYSize
  );

  // Inside
  workBitmap.copy(
    originalImage,
    cornerXSize, cornerYSize,
    1, 1,
    cornerXSize, cornerYSize,
    width - cornerXSize * 2, height - cornerYSize * 2
  );

  return game.make.sprite(0, 0, workBitmap);
}
