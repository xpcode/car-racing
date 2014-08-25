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
	self.layer2_l_hourse = new LSprite();
	self.addChild(self.layer2_l_hourse);
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
	self.gas = new LBitmap(new LBitmapData(self.resources["gas"]));
	self.gas.x = 230;
	self.gas.y = LGlobal.height - self.gas.height - 10;
	self.layer3.addChild(self.gas);

	self.setOilMass(0);
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

Background.prototype._genHourses = function() {
	var self = this;
	var imgs = {
		// building_l0: [0, 0],
		building_l1: [200, -30],
		// building_l2: [150, 10],
		// building_l3: [30, 40],
		// building_l4: [40, 50],
		// building_l5: [50, 60],
		// building_l6: [60, 70],
		// building_l7: [70, 80]
	};
	var pStart = {
			x: 308,
			y: 0
		},
		pEnd = {
			x: 63,
			y: LGlobal.height
		};

	for (var p in imgs) {
		var arr = imgs[p];
		var bmap = new LBitmap(new LBitmapData(self.resources[p]));
		var width = bmap.width;
		var height = bmap.height;

		var layer = new LSprite();
		layer.addChild(bmap);
		layer.scaleX = 0.5;
		layer.scaleY = 0.5;
		layer.x = pStart.x - width * layer.scaleX;
		layer.y = pStart.y - height * layer.scaleY;
		self.layer2_l_hourse.addChild(layer);
		// continue;
		LTweenLite.to(layer, 5, {
			y: LGlobal.height,
			scaleX: 1,
			scaleY: 1,
			x: pStart.x - (LGlobal.height * (pStart.x - pEnd.x)) / height,
			y: pEnd.y + height,
			ease: LEasing.Strong.easeIn
		});
	}
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
			if (arr[i] == '.') {
				bmap.y = 23;
			}
			self.layer2_r_stat.addChild(bmap);

			x += bmap.width - 5;
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
			if (arr[i] == '.') {
				bmap.y = 23;
			}
			self.layer2_l_stat.addChild(bmap);

			x += bmap.width - 5;
		}
	}

	self.layer2_l_stat.x = 160;
	self.layer2_l_stat.y = 20;
};

Background.prototype.setOilMass = function(clickCount) {
	var self = this;
	var max_x = self.gas.x + 5;
	var max_y = 10 - self.gas.height;
	var scale = clickCount / 8;

	var layer = new LSprite();
	layer.x = 300;
	layer.y = LGlobal.height - layer.height - 12;
	self.addChild(layer);

	var shape = new LShape();
	shape.graphics.fillStyle("#fff156");
	shape.graphics.drawVertices(3, "ff2842", [
		[0, 0],
		[max_x, 0],
		[max_x, max_y]
	]);
	shape.graphics.fill();
	layer.addChild(shape);

	var shape_2 = new LShape();
	shape_2.graphics.fillStyle("#ff2842");
	shape_2.graphics.drawVertices(0, "ff2842", [
		[0, 0],
		[max_x * scale, 0],
		[max_x * scale, max_y * scale]
	]);
	shape_2.graphics.fill();
	layer.addChild(shape_2);
};

Background.prototype.backup = function() {
	var self = this;

	// 马路后退
	if (self.layer2_m.y > -LGlobal.width) {
		self.layer2_m.y = LGlobal.height - self.layer2_m.getHeight();
	}

	self.layer2_m.y += self.speed;
};