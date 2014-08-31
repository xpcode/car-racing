function Background(resources) {
	var self = this;

	base(self, LSprite, []);

	self.DEFAULT_SPEED = 18;

	self.resources = resources;

	self.init();
}

/*
 * 背景包括以下几层
 * 1、背景图
 * 2、两侧的房子、树和马路中间虚线
 * 3、油桶、游戏进度
 */
Background.prototype.init = function() {
	var self = this;

	// 马路速度
	self.speed = self.DEFAULT_SPEED;

	// 背景
	self.layer1 = new LSprite();
	self.addChild(self.layer1);
	// 左侧
	self.layer2_l = new LSprite();
	self.layer2_l.x = 10;
	self.layer2_l.y = 10;
	self.addChild(self.layer2_l);
	// 中间
	self.layer2_m = new LSprite();
	self.addChild(self.layer2_m);
	// 右侧
	self.layer2_r = new LSprite();
	self.layer2_r.x = LGlobal.width - 130;
	self.layer2_r.y = 10;
	self.addChild(self.layer2_r);
	// 散件
	self.layerGas = new LSprite();
	self.addChild(self.layerGas);

	// 背景图
	self._genBg();

	// 两侧的房子、树和马路中间虚线
	self._genRoadtips();

	// 油桶
	self._genGas();

	self.setOilMass(0);
};

Background.prototype._onFrame = function(event) {
	var self = event.target;

	self.bg_left.y += self.speed;
	self.bg_left.x -= (self.speed * 245) / LGlobal.height;

	if (self.bg_left.y > 80) {
		self.bg_left.x = -200;
		self.bg_left.y = -510;
	}


	self.bg_right.y += self.speed;
	self.bg_right.x += (self.speed * 240) / LGlobal.height;

	if (self.bg_right.y > 80) {
		self.bg_right.x = 230;
		self.bg_right.y = -540;
	}

	// 马路后退
	if (self.layer2_m.y > -LGlobal.width) {
		self.layer2_m.y = LGlobal.height - self.layer2_m.getHeight();
	}

	self.layer2_m.y += self.speed;
};

Background.prototype._genGas = function() {
	var self = this;

	self.gas = new LBitmap(new LBitmapData(self.resources["gas"]));
	self.gas.x = 230;
	self.gas.y = LGlobal.height - self.gas.height - 10;
	self.layerGas.addChild(self.gas);
};

Background.prototype._genBg = function() {
	var self = this;

	self.layer1.addChild(new LBitmap(new LBitmapData(self.resources["bg"])));
	// 左侧房子
	self.bg_left = new LBitmap(new LBitmapData(self.resources["bg_left"]));
	self.bg_left.x = -200;
	self.bg_left.y = -510;
	self.layer1.addChild(self.bg_left);
	// 左侧房子
	self.bg_right = new LBitmap(new LBitmapData(self.resources["bg_right"]));
	self.bg_right.x = 230;
	self.bg_right.y = -540;
	self.layer1.addChild(self.bg_right);
};

Background.prototype._genRoadtips = function() {
	var self = this,
		i = 0,
		distance = 0,
		bmap = new LBitmap(new LBitmapData(self.resources["roadtip"])),
		count = (LGlobal.height / bmap.height) * 2;

	bmap.x = bmap.y = 0;

	while (i < count) {
		var tBmap = bmap.clone();

		tBmap.y += distance;

		self.layer2_m.addChild(tBmap);

		i++;
		distance += bmap.height * 1.5;
	}

	self.layer2_m.x = LGlobal.width / 2 - 20;
	self.layer2_m.y = LGlobal.height - self.layer2_m.getHeight();
};

// 设置跑了多少KM
Background.prototype.setDistance = function(distance) {
	var self = this;
	if (!self.ltfDistance) {
		self.ltfDistance = new LTextField();
		self.ltfDistance.color = "#FFFFFF";
		self.ltfDistance.size = 24;
		self.layer2_r.addChild(self.ltfDistance);
	}
	self.ltfDistance.text = distance + 'KM';
};

Background.prototype.showOilIncrease = function() {
	return;
	var self = this;
	// LTweenLite.remove(self.tween);

	self.tween = LTweenLite.to(self.layerGas, 0.5, {
		scaleX: 1.2,
		scaleY: 1.2,
		ease: LEasing.Strong.easeIn
	});
};

// 设置当前油耗
Background.prototype.setQtrip = function(qtrip) {
	var self = this;

	if (!self.ltfQtrip) {
		self.ltfQtrip = new LTextField();
		self.ltfQtrip.color = "#FFFFFF";
		self.ltfQtrip.size = 24;
		self.ltfQtrip.x = 160;
		self.layer2_l.addChild(self.ltfQtrip);
	}
	self.ltfQtrip.text = qtrip + 'L/100KM';

	if (!self.ltfQtripRect) {
		var shape = new LShape();
		shape.graphics.drawRect(2, "#ff0000", [10, 10, 140, 24]);
		shape.graphics.fillStyle("#fff");
		shape.graphics.fill();
		shape.y = -5;
		self.layer2_l.addChild(shape);

		self.ltfQtripRect = new LShape();
		self.ltfQtripRect.graphics.drawRect(0, "#f55a4d", [10, 10, 100, 24]);
		self.ltfQtripRect.graphics.fillStyle("#f55a4d");
		self.ltfQtripRect.graphics.fill();
		self.ltfQtripRect.y = -5;
		self.layer2_l.addChild(self.ltfQtripRect);
	}
	self.ltfQtripRect.scaleX = qtrip / 5.5;
};

// 设置油量
Background.prototype.setOilMass = function(oilMass) {
	var self = this,
		scale = oilMass / 1,
		max_x = self.gas.x + 5,
		max_y = 10 - self.gas.height;

	if (!self.layerOilMass) {
		self.layerOilMass = new LSprite();
		self.layerOilMass.x = 300;
		self.layerOilMass.y = LGlobal.height - self.layerOilMass.height - 12;
		self.addChild(self.layerOilMass);

		var shape = new LShape();
		shape.graphics.fillStyle("#fff156");
		shape.graphics.drawVertices(3, "ff2842", [
			[0, 0],
			[max_x, 0],
			[max_x, max_y]
		]);
		shape.graphics.fill();
		self.layerOilMass.addChild(shape);
	}

	if (self.shapOilMassLeave) {
		self.shapOilMassLeave.remove();
		self.shapOilMassLeave.die();
	}

	self.shapOilMassLeave = new LShape();
	self.shapOilMassLeave.graphics.fillStyle("#ff2842");
	self.shapOilMassLeave.graphics.drawVertices(0, "ff2842", [
		[0, 0],
		[max_x * scale, 0],
		[max_x * scale, max_y * scale]
	]);
	self.shapOilMassLeave.graphics.fill();

	self.layerOilMass.addChild(self.shapOilMassLeave);
};

// 设置背景是否开始移动
Background.prototype.setCanMove = function(canMove) {
	var self = this;

	if (canMove === true) {
		self.addEventListener(LEvent.ENTER_FRAME, self._onFrame);
	} else {
		self.removeEventListener(LEvent.ENTER_FRAME, self._onFrame);
	}
};