function Car(resources) {
	var self = this;

	self.resources = resources;

	base(self, LSprite, []);

	self.init();
}

Car.prototype.init = function() {
	var self = this;

	self.canMove = false;

	self.layer = new LSprite();
	self.layer.name = 'car';
	self.layer.x = 250;
	self.layer.y = 180;
	self.addChild(self.layer);

	self.layer.addChild(new LBitmap(new LBitmapData(self.resources["car1"])));
};

Car.prototype.setCanMove = function(canMove) {
	this.canMove = canMove;
};

Car.prototype.getCoords = function() {
	var self = this,
		x = self.layer.x,
		y = self.layer.y,
		w = self.layer.getWidth(),
		h = self.layer.getHeight();

	return [
		[x, y],
		[x + w, y],
		[x, y + h],
		[x + w, y + h]
	];
};

Car.prototype.moveToLeft = function(event) {
	var self = this;

	if (self.canMove && self.layer.x > 240) {
		self.layer.x -= 5;
	}
};

Car.prototype.moveToRight = function(event) {
	var self = this;

	if (self.canMove && self.layer.x < 410) {
		self.layer.x += 5;
	}
};