function Slime(color) {

	this.color = color;
	this.background = null;
	this.preloadBar = null;

	this.ready = false;
	this.sprite = null;
	this.animation = null;
	this.rotated = 1;

	this.action = "smile";

	function onDown(sprite, pointer) {
		if (this.action === "smile") {
			this.action = "walk";
			sprite.animations.play(this.action);
		}
		else {
			sprite.animations.stop();
			this.action = "smile";
			sprite.frameName = color+'_'+this.action;
		}
	}

	this.update = function() {
		if (this.action === "walk") {
			this.sprite.x += (0.5 * this.rotated);
		}
	};

	this.rotate = function() {
		this.rotated = this.rotated * -1;
		this.sprite.anchor.setTo(.5,.5);
		this.sprite.scale.x *= -1;
	};

	this.display = function(x, y) {
		this.sprite = game.add.sprite(x, y, SPRITESHEET, this.color+'_smile');
		this.sprite.events.onInputDown.add(onDown, this);
		this.sprite.scale.set(4);
		this.sprite.smoothed = false;
		this.sprite.animations.add('walk', Phaser.Animation.generateFrameNames(color+'_walk', 1, 3), 5, true);
		this.sprite.inputEnabled = true;
	};
}
