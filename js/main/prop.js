function Prop(resources) {
	var self = this;

	base(self, LSprite, []);

	self.DEFAULT_Y = 80;
	self.DEFAULT_SPEED = 10;
	self.resources = resources;

	self.init();
}

Prop.prototype.init = function() {
	var self = this;

	self.layer = new LSprite();
	self.layer.name = 'jyq';
	self.layer.target = self.layer;
	self.layer.x = Math.random() * LGlobal.width;
	self.addChild(self.layer);

	var name = Math.random() > 0.5 ? 'jyq1' : 'jyq2';
	var bmap = new LBitmap(new LBitmapData(self.resources[name]));
	self.layer.name = name;
	self.layer.scaleX = 0.2;
	self.layer.scaleY = 0.2;
	self.layer.addChild(bmap);
	LTweenLite.to(self.layer, 5, {
		y: LGlobal.height,
		scaleX: 1.2,
		scaleY: 1.2,
		ease: LEasing.Strong.easeInOut
	});
};

Prop.prototype.getCoord = function() {
	var self = this;

	return {
		x: self.layer.x,
		y: self.layer.y
	};
};

Prop.prototype.getCoords = function() {
	var self = this,
		x = self.layer.x,
		y = self.layer.y,
		w = self.layer.getWidth(),
		h = self.layer.getHeight();

	if (self.layer.name == 'jyq1') {
		return [
			[x, y],
			[x + 16, y + 31],
			[x + 21, y + 63],
			[x + 49, y + 63],
			[x + 49, y]
		];
	} else {
		return [
			[x, y],
			[x + 12, y + 52],
			[x + 17, y + 65],
			[x + 44, y + 66],
			[x + 44, y]
		];
	}
};