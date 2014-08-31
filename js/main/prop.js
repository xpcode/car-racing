function Prop(resources, car, reduceOilMass, isLeft) {
	var self = this;

	base(self, LSprite, []);

	self.resources = resources;
	self.car = car;
	self._reduceOilMass = reduceOilMass;
	self._continue = null;
	self._isLeft = isLeft;

	self.init();
}

Prop.prototype.init = function() {
	var self = this;

	self.layer = new LSprite();
	self.addChild(self.layer);

	self._resetLayer();
};

Prop.prototype.throw = function(second, callback) {
	var self = this;

	self._continue = callback;

	setTimeout(function() {
		self.layer.visible = true;

		self.tween = LTweenLite.to(self.layer, 2, {
			x: self._isLeft !== true ? 500 : 240,
			y: LGlobal.height,
			scaleX: 1.2,
			scaleY: 1.2,
			ease: LEasing.Strong.easeIn,
			onComplete: function() {
				self._resetLayer();
				self._continue();
			}
		});
	}, second * 1000);
};

Prop.prototype._resetLayer = function() {
	var self = this;
	var name = Math.random() > 0.5 ? 'jyq1' : 'jyq2';

	self.layer.visible = false;
	self.layer.scaleX = 0.4;
	self.layer.scaleY = 0.4;
	self.layer.x = self._isLeft === true ? 360 : 420; //(LGlobal.width - 322 * 2) * Math.random() + 322;
	self.layer.y = 10;
	self.layer.die();
	self.layer.removeAllChild();
	self.layer.addChild(new LBitmap(new LBitmapData(self.resources[name])));
};

Prop.prototype._onFrame = function(event) {
	var self = event.target;

	if (self.layer.visible === true) {
		if (LGlobal.hitTestPolygon(self.car.getCoords(), self.getCoords())) {
			LTweenLite.remove(self.tween);

			self._reduceOilMass();
			self._resetLayer();
			self._continue();
		}
	}
};

// 节油器是否开始移动
Prop.prototype.setCanMove = function(canMove) {
	var self = this;

	if (canMove === true) {
		self.addEventListener(LEvent.ENTER_FRAME, self._onFrame);
	} else {
		self.removeEventListener(LEvent.ENTER_FRAME, self._onFrame);
	}
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