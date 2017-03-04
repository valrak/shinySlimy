var gameState = function(game) {};

gameState.prototype = {

  preload: function() {
  },

  create: function() {

    var sidePanel = new SidePanel();
    var townScreen = new TownScreen(player);
  },

  update: function() {
  },

  startGame: function() {

  }

};
