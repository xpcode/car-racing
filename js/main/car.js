function Car() {
	var self = this;

	base(self, LSprite, []);

	self.DEFAULT_COORD_X = 40;
	self.DEFAULT_COORD_Y = 290;
	self.scale = 1;
	self.canMove = false;

	self.init();
}

Car.prototype.init = function() {
	var self = this;

	self.bmap = new LBitmap(new LBitmapData(game.dataList["car"]));
	self.layer = new LSprite();
	self.layer.name = 'car';
	self.layer.type = Main.RIGID_BODY_TYPE.CAR;
	self.layer.addBodyVertices([
		[
			[0, 117],
			[10, 61],
			[25, 10],
			[111, 0],
			[227, 34],
			[307, 61],
			[307, 117]
		]
	], self.DEFAULT_COORD_X, self.DEFAULT_COORD_Y, 0, 1, 1, 0);
	self.layer.setBodyMouseJoint(true);
	self.layer.addChild(self.bmap);
	self.addChild(self.layer);

	self.addEventListener(LEvent.ENTER_FRAME, self._onFrame);
	// 拖车
	self.addEventListener(LMouseEvent.MOUSE_DOWN, self._onMouseDown);
};

Car.prototype._onMouseDown = function(event) {
	var self = event.clickTarget;

	self.bmap.coordX = self.bmap.x;
	self.canMove = true;

	self.addEventListener(LMouseEvent.MOUSE_MOVE, self._onMouseMove);
	self.addEventListener(LMouseEvent.MOUSE_UP, self._onMouseUp);
	self.addEventListener(LMouseEvent.MOUSE_OUT, self._onMouseUp);
};

Car.prototype._onMouseMove = function(event) {
	var self = event.clickTarget;

	if (self.canMove) {
		self.bmap.x = event.offsetX - self.DEFAULT_COORD_X;
	}
};

Car.prototype._onMouseUp = function(event) {
	var self = event.clickTarget;

	self.canMove = false;
	self.removeEventListener(LMouseEvent.MOUSE_MOVE, self._onMouseMove);
	self.removeEventListener(LMouseEvent.MOUSE_UP, self._onMouseUp);
};

Car.prototype._onFrame = function(event) {
	var self = event.target;

	// TODO: 车轮旋转动画
	// console.log(self.rect);
};