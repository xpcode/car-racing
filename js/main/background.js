function Background(resources) {
	var self = this;

	base(self, LSprite, []);

	self.DEFAULT_SPEED = 22;
	// 马路速度
	// 其他的速度=马路速度*转换率
	self.speed = self.DEFAULT_SPEED;
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

	// 背景
	self.layer1 = new LSprite();
	self.addChild(self.layer1);
	// 左侧
	self.layer2_l = new LSprite();
	self.addChild(self.layer2_l);
	self.layer2_l_stat = new LSprite();
	self.addChild(self.layer2_l_stat);
	// 中间
	self.layer2_m = new LSprite();
	self.addChild(self.layer2_m);
	// 右侧
	self.layer2_r = new LSprite();
	self.addChild(self.layer2_r);
	self.layer2_r_stat = new LSprite();
	self.addChild(self.layer2_r_stat);
	// 散件
	self.layer3 = new LSprite();
	self.addChild(self.layer3);

	// 背景图
	self.layer1.addChild(new LBitmap(new LBitmapData(self.resources["bg"])));

	// 两侧的房子、树和马路中间虚线
	self._genRoadtips();
	self._genHourses();

	// 油桶
	var gas = new LBitmap(new LBitmapData(self.resources["gas"]));
	gas.x = 230;
	gas.y = LGlobal.height - gas.height - 10;
	self.layer3.addChild(gas);
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

Background.prototype._genHourses = function() {};

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

Background.prototype.setDistance = function(distance) {
	var self = this;
	var arr = String(distance).split('').concat(['km']);
	var i = 0,
		len = arr.length,
		name = '',
		bmap = null,
		x = 0;

	self.layer2_r_stat.removeAllChild();

	for (; i < len; i++) {
		name = this._getResourceName(arr[i]);

		if (name.length > 0) {
			bmap = new LBitmap(new LBitmapData(self.resources[name]));
			bmap.x = x;
			self.layer2_r_stat.addChild(bmap);

			x += bmap.width;
		}
	}

	self.layer2_r_stat.x = LGlobal.width - self.layer2_r_stat.getWidth() - 20;
	self.layer2_r_stat.y = 20;
};

Background.prototype.setQtrip = function(qtrip) {
	var self = this;
	var arr = String(qtrip).split('').concat(['dw']);
	var i = 0,
		len = arr.length,
		name = '',
		bmap = null,
		x = 0;

	self.layer2_l_stat.removeAllChild();

	for (; i < len; i++) {
		name = this._getResourceName(arr[i]);

		if (name.length > 0) {
			bmap = new LBitmap(new LBitmapData(self.resources[name]));
			bmap.x = x;
			self.layer2_l_stat.addChild(bmap);

			x += bmap.width;
		}
	}

	self.layer2_l_stat.x = 160;
	self.layer2_l_stat.y = 20;
};

Background.prototype.setOilMass = function(oilmass) {
	var self = this;

	var shape = new LShape();
	self.layer2_m.addChild(shape);

	shape.graphics.drawVertices(2, "ff2842", [
		[130, 200],
		[430, 300],
		[130, 300]
	]);
	shape.graphics.drawVertices(2, "fff156", [
		[10, 160],
		[60, 250],
		[100, 200]
	], true, "#880088");

};

Background.prototype.backup = function() {
	var self = this;

	// 马路后退
	if (self.layer2_m.y > -LGlobal.width) {
		self.layer2_m.y = LGlobal.height - self.layer2_m.getHeight();
	}

	self.layer2_m.y += self.speed;
};