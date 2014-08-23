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

	var bmap = new LBitmap(new LBitmapData(self.resources['jyq']));
	self.layer.addChild(bmap);
	self.layer.addBodyPolygon(bmap.width, bmap.height, 1, 5, .4, .2);
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

	return [
		[x, y],
		[x + w, y],
		[x, y + h],
		[x + w, y + h]
	];
};