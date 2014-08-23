function Car(resources) {
	var self = this;

	self.resources = resources;

	base(self, LSprite, []);

	self.init();
}

Car.prototype.init = function() {
	var self = this;

	self.canMove = false;
	// 1：左边  2：右边
	self.location = 0;

	self.layer = new LSprite();
	self.layer.x = 220;
	self.layer.y = 180;
	self.addChild(self.layer);

	// 默认设置为左边
	self.setDirection();
};

Car.prototype.setCanMove = function(canMove) {
	this.canMove = canMove;
};

Car.prototype.setDirection = function() {
	var self = this;

	self.layer.removeAllChild();

	if (self.layer.x > LGlobal.width / 2 - 80) {
		self.layer.addChild(new LBitmap(new LBitmapData(self.resources['car2'])));
	} else {
		self.layer.addChild(new LBitmap(new LBitmapData(self.resources['car1'])));
	}
};

Car.prototype.getCoords = function() {
	var self = this,
		x = self.layer.x,
		y = self.layer.y,
		w = self.layer.getWidth(),
		h = self.layer.getHeight();

	if (self.location === 1) {
		return [
			[x + 25, y + 119],
			[x + 37, y + 81],
			[x + 56, y + 69],
			[x + 112, y + 69],
			[x + w, y + 84],
			[x + w, y + h],
			[x, y + h],
		];

	} else {
		return [
			[x + 21, y + 79],
			[x + 39, y + 70],
			[x + 93, y + 70],
			[x + 111, y + 80],
			[x + 126, y + 126],
			[x + w, y + h],
			[x, y + h],
		];
	}
};

Car.prototype.moveToLeft = function(event) {
	var self = this;

	if (self.canMove && self.layer.x > 200) {
		self.layer.x -= 20;
	}
};

Car.prototype.moveToRight = function(event) {
	var self = this;

	if (self.canMove && self.layer.x < 440) {
		self.layer.x += 20;
	}
};