var introState = function(game) {};

const BUTTON_SIZE_X = 35;
const BUTTON_SIZE_Y = 18;

const START_BUTTON_X = 400 - BUTTON_SIZE_X;
const START_BUTTON_Y = 300 - BUTTON_SIZE_Y;
const BUTTON_TEXT_SIZE = 8;

introState.prototype = {

  preload: function() {
  },

  create: function() {

    //var sidePanel = new SidePanel();

    startButton = createButton('button-generic', START_BUTTON_X, START_BUTTON_Y, BUTTON_SIZE_X, BUTTON_SIZE_Y, function() { game.state.start(STATE_GAME); }, "Start");
    startButton.scale.setTo(scale);
  },

  update: function() {
  },



};
