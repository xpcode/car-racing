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
	self.addChild(self.layer2_l);
	// 中间
	self.layer2_m = new LSprite();
	self.addChild(self.layer2_m);
	// 右侧
	self.layer2_r = new LSprite();
	self.addChild(self.layer2_r);
	// 散件
	self.layer3 = new LSprite();
	self.addChild(self.layer3);

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
	self.layer3.addChild(self.gas);
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

Background.prototype._getResourceName = function(num) {
	return {
		'1': 'number_1',
		'2': 'number_2',
		'3': 'number_3',
		'4': 'number_4',
		'5': 'number_5',
		'6': 'number_6',
		'7': 'number_7',
		'8': 'number_8',
		'9': 'number_9',
		'0': 'number_0',
		'.': 'number_dot',
		'km': 'number_km',
		'dw': 'number_dw'
	}[num] || '';
};

// 设置跑了多少KM
Background.prototype.setDistance = function(distance) {
	var self = this;
	var arr = String(distance).split('').concat(['km']);
	var i = 0,
		len = arr.length,
		name = '',
		bmap = null,
		x = 0;

	self.layer2_r.removeAllChild();

	for (; i < len; i++) {
		name = this._getResourceName(arr[i]);

		if (name.length > 0) {
			bmap = new LBitmap(new LBitmapData(self.resources[name]));
			bmap.x = x;
			if (arr[i] == '.') {
				bmap.y = 23;
			}
			self.layer2_r.addChild(bmap);

			x += bmap.width - 5;
		}
	}

	self.layer2_r.x = LGlobal.width - self.layer2_r.getWidth() - 20;
	self.layer2_r.y = 20;
};

// 设置当前油耗
Background.prototype.setQtrip = function(qtrip) {
	var self = this;
	var arr = String(qtrip).split('').concat(['dw']);
	var i = 0,
		len = arr.length,
		name = '',
		bmap = null,
		x = 0;

	self.layer2_l.removeAllChild();

	for (; i < len; i++) {
		name = this._getResourceName(arr[i]);

		if (name.length > 0) {
			bmap = new LBitmap(new LBitmapData(self.resources[name]));
			bmap.x = x;
			if (arr[i] == '.') {
				bmap.y = 23;
			}
			self.layer2_l.addChild(bmap);

			x += bmap.width - 5;
		}
	}

	self.layer2_l.x = 160;
	self.layer2_l.y = 20;
};

// 设置油量
Background.prototype.setOilMass = function(clickCount) {
	var self = this,
		scale = clickCount / 6,
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