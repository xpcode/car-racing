function Background() {
	var self = this;

	base(self, LSprite, []);

	self.DEFAULT_SPEED = 22;
	// 马路速度
	// 其他的速度=马路速度*转换率
	self.speed = self.DEFAULT_SPEED;
	self.unhandleQueue = [];
	self.leaveSecondDesc = '剩余时间：';
	self.scoreUnit = ' / M';

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
	self.layer1.addChild(new LBitmap(new LBitmapData(game.dataList["bg"])));

	// 两侧的房子、树和马路中间虚线
	self._genRoadtips();
	self._genHourses();

	// 油桶
	var gas = new LBitmap(new LBitmapData(game.dataList["gas"]));
	gas.x = 230;
	gas.y = LGlobal.height - gas.height - 10;
	self.layer3.addChild(gas);
};

Background.prototype._genRoadtips = function() {
	var self = this,
		i = 0,
		distance = 0,
		bmap = new LBitmap(new LBitmapData(game.dataList["roadtip"])),
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

Background.prototype.backup = function() {
	var self = this;

	// 马路后退
	if (self.layer2_m.y > -LGlobal.width) {
		self.layer2_m.y = LGlobal.height - self.layer2_m.getHeight();
	}

	self.layer2_m.y += self.speed;
};

Background.prototype.setSpeed = function(_speed) {
	this.speed = _speed;
};

Background.prototype._onFrame = function(event) {
	var self = event.target;

	if (game.world.running()) {
		for (var i = 0, len = self.unhandleQueue.length; i < len; i++) {
			var bmap = self.unhandleQueue[i];

			bmap.coordX += bmap.speedRate * self.speed;

			if (bmap.coordX > game.cycleWidth) {
				bmap.coordX -= game.cycleWidth;
			}

			bmap.bitmapData.setCoordinate(bmap.coordX, 0);
		}

		self.leaveMilliSecond -= game.interval;
		self.leaveSecond = Math.ceil(self.leaveMilliSecond / 1000);
		self.score += 22 / (1000 / game.interval);

		self.ltxtTimes.text = self.leaveSecondDesc + self.leaveSecond;
		self.ltxtScore.text = Math.ceil(self.score) + self.scoreUnit;
	} else {
		self.removeEventListener(LEvent.ENTER_FRAME, self._onFrame);
	}
};