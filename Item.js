var item = {};

function Item(name) {
	this.name = name;
	this.amount = 1;
	this.active = true;
	this.sprite = null;
	this.animation = null;
	this.params = itemsData[name];

	this.display = function(x, y) {
	  this.sprite = game.add.sprite(x, y, ITEM_SHEET, this.name);
	  this.sprite.events.onInputDown.add(onDown, this);
		this.sprite.scale.set(4);
		this.sprite.smoothed = false;
	};

  this.use = function() {
		// manage consumables
		if (this.params.consumable !== 0) {
			if (this.params.stackable === 1) {
				if (this.amount > 1) {
					this.amount--;
				}
				else {
					this.destroy();
				}
			}
			else {
				this.destroy();
			}
		}
        signalManager.itemUseSignal.dispatch(this);
	};

	this.destroy = function() {
		this.active = false;
	};
}
