function Prop(resources, car, reduceOilMass) {
	var self = this;

	base(self, LSprite, []);

	self.resources = resources;
	self.car = car;
	self._reduceOilMass = reduceOilMass;

	// 扔道具的下一个时间戳
	self.throwTicks = Date.now();
	self.canMove = false;

	self.init();
}

Prop.prototype.init = function() {
	var self = this;

	self.layer = new LSprite();
	self.addChild(self.layer);

	self._resetLayer();
};

Prop.prototype._throw = function() {
	var self = this;

	self.layer.visible = true;

	LTweenLite.to(self.layer, 5, {
		y: LGlobal.height,
		scaleX: 1.2,
		scaleY: 1.2,
		ease: LEasing.Strong.easeInOut,
		onComplete: function() {
			self.throwTicks += Math.ceil(1000 * Math.random());
		}
	});
};

Prop.prototype._resetLayer = function() {
	var self = this;
	var name = Math.random() > 0.5 ? 'jyq1' : 'jyq2';

	self.layer.visible = false;
	self.layer.scaleX = 0.2;
	self.layer.scaleY = 0.2;
	self.layer.x = (LGlobal.width - 240 * 2) * Math.random() + 240;
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
		}
	} else if (Date.now() >= self.throwTicks) {
		self.layer.visible = true;

		self.tween = LTweenLite.to(self.layer, 5, {
			y: LGlobal.height,
			scaleX: 1.2,
			scaleY: 1.2,
			ease: LEasing.Strong.easeIn,
			onComplete: function() {
				self._resetLayer();
				self.throwTicks += Math.ceil(5000 * Math.random());
			}
		});
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