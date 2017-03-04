var confirmWindow = {};

function ConfirmWindow(x, y, callback, message, no=true) {
  const BUTTON_SIZE_X = 25;
  const BUTTON_SIZE_Y = 16;
  const TEXT_SIZE = 8;
  const WINDOW_NAME = "confirm-window";

  windowManager.register(WINDOW_NAME, this);

  var messageText = new Phaser.BitmapText(game, 7,
                                    PADDING,
                                    'font-normal',
                                    message,
                                    TEXT_SIZE, 'center');


  var sizex = messageText.textWidth + PADDING * 2 + 20;
  var sizey = messageText.textHeight + PADDING * 4 + 5 + BUTTON_SIZE_Y;

  var confirmPanel = createPanel(x, y, sizex, sizey);
  var yesPositionX = sizex / 2 - BUTTON_SIZE_X - PADDING;
  var confirmText = "Yes";
  if (no === false) {
    confirmText = "Ok";
    yesPositionX = sizex / 2 - BUTTON_SIZE_X / 2;
  }

  var yesButton = createButton("button-generic",
                        yesPositionX,
                        sizey - BUTTON_SIZE_Y - PADDING,
                        BUTTON_SIZE_X,
                        BUTTON_SIZE_Y,
                        function() { callback(true); closeWindow(); }, confirmText);

  confirmPanel.addChild(messageText);
  confirmPanel.addChild(yesButton);
  if (no === true) {
    var noButton = createButton("button-generic",
                          sizex / 2 + PADDING,
                          sizey - BUTTON_SIZE_Y - PADDING,
                          BUTTON_SIZE_X,
                          BUTTON_SIZE_Y,
                          function() { callback(false); closeWindow(); }, "No");
    confirmPanel.addChild(noButton);
  }

  function closeWindow() {
    windowManager.unregister(WINDOW_NAME);
    confirmPanel.destroy(true);
    confirmPanel = null;
  }
}
