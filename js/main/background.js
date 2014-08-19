function Background() {
	base(this, LSprite, []);

	this.DEFAULT_SPEED = 22;
	// 马路速度
	// 其他的速度=马路速度*转换率
	this.speed = this.DEFAULT_SPEED;
	this.unhandleQueue = [];
	this.leaveSecondDesc = '剩余时间：';
	this.scoreUnit = ' / M';

	this.init();
}

Background.prototype.run = function() {

};

/*
 * 背景包括以下部分
 * 1、后退的马路
 * 2、后退的路边灌木丛（近处）
 * 3、后退的远处高楼（远处）
 * 4、整体背景
 */
Background.prototype.init = function() {
	var self = this;

	self.layer = new LSprite();
	self.addChild(self.layer);


	// 游戏背景
	self.layer.addChild(new LBitmap(new LBitmapData(game.dataList["bg"])));
	var car = new LBitmap(new LBitmapData(game.dataList["car"]));
	car.x = 250;
	car.y = 180;
	self.layer.addChild(car);
	// self.layer.addChild(new LBitmap(new LBitmapData(game.dataList["gas"])));
	return;
	// 左右刚体
	self.layerLeft = new LSprite();
	self.layerLeft.name = 'left';
	self.layerLeft.x = 0;
	self.layerLeft.y = 0;
	self.layerLeft.addBodyPolygon(10, LGlobal.height, 0);
	self.addChild(self.layerLeft);
	// 左右刚体
	self.layerRight = new LSprite();
	self.layerRight.name = 'left';
	self.layerRight.x = LGlobal.width - 10;
	self.layerRight.y = 0;
	self.layerRight.addBodyPolygon(10, LGlobal.height, 0);
	self.addChild(self.layerRight);
	// 马路
	self.bmapRoad = new LBitmap(new LBitmapData(game.dataList["bg_road"]));
	self.bmapRoad.speedRate = 1;
	self.bmapRoad.coordX = 0;
	self.bmapRoad.y = self.bmapSky.height;
	// self.addChild(self.bmapRoad);
	// 马路刚体
	self.layer = new LSprite();
	self.layer.name = 'road';
	self.layer.type = Main.RIGID_BODY_TYPE.ROAD;
	self.layer.x = LGlobal.width / 2;
	self.layer.y = self.bmapSky.height + self.bmapRoad.y / 2;
	self.layer.addBodyPolygon(LGlobal.width, 10, 0, 1, 1, 0);
	self.addChild(self.layer);
	// 云朵
	self.bmapCloudeB = new LBitmap(new LBitmapData(game.dataList["bg_cloude_b"]));
	self.bmapCloudeB.x = 220;
	self.bmapCloudeB.y = 80;
	self.addChild(self.bmapCloudeB);
	self.bmapCloudeS = new LBitmap(new LBitmapData(game.dataList["bg_cloude_s"]));
	self.bmapCloudeS.x = 20;
	self.bmapCloudeS.y = 20;
	self.addChild(self.bmapCloudeS);
	// 高楼
	self.bmapFloor1 = new LBitmap(new LBitmapData(game.dataList["bg_floor1"]));
	self.bmapFloor1.x = LGlobal.width * 0.08;
	self.bmapFloor1.y = self.bmapSky.height - self.bmapFloor1.height;
	self.bmapFloor1.speedRate = 0.6;
	self.bmapFloor1.coordX = 0;
	self.addChild(self.bmapFloor1);
	self.bmapFloor2 = new LBitmap(new LBitmapData(game.dataList["bg_floor2"]));
	self.bmapFloor2.x = LGlobal.width * 0.4;
	self.bmapFloor2.y = self.bmapSky.height - self.bmapFloor2.height;
	self.bmapFloor2.speedRate = 0.6;
	self.bmapFloor2.coordX = 0;
	self.addChild(self.bmapFloor2);
	// 矮楼
	self.bmapFloor3 = new LBitmap(new LBitmapData(game.dataList["bg_floor3"]));
	self.bmapFloor3.y = self.bmapSky.height - self.bmapFloor3.height;
	self.bmapFloor3.speedRate = 0.1;
	self.bmapFloor3.coordX = 0;
	self.addChild(self.bmapFloor3);
	// 灌木丛
	self.bmapTree1 = new LBitmap(new LBitmapData(game.dataList["bg_tree1"]));
	self.bmapTree1.y = self.bmapSky.height - self.bmapTree1.height;
	self.bmapTree1.speedRate = 0.6;
	self.bmapTree1.coordX = 0;
	self.addChild(self.bmapTree1);
	self.bmapTree2 = new LBitmap(new LBitmapData(game.dataList["bg_tree2"]));
	self.bmapTree2.y = self.bmapSky.height - self.bmapTree2.height;
	self.bmapTree2.speedRate = 0.8;
	self.bmapTree2.coordX = 0;
	// self.addChild(self.bmapTree2);
	// 时间
	self.ltxtTimes = new LTextField();
	self.ltxtTimes.font = "Bauhaus 93";
	self.ltxtTimes.weight = "normal";
	self.ltxtTimes.size = 12;
	self.ltxtTimes.x = 40;
	self.ltxtTimes.y = 40;
	self.ltxtTimes.alpha = 0.8;
	self.ltxtTimes.color = "#FF0000";
	self.ltxtTimes.text = self.leaveSecondDesc + self.leaveSecond;
	self.addChild(self.ltxtTimes);
	// 成绩
	self.ltxtScore = new LTextField();
	self.ltxtScore.font = "Bauhaus 93";
	self.ltxtScore.weight = "normal";
	self.ltxtScore.size = 12;
	self.ltxtScore.x = LGlobal.width - 100;
	self.ltxtScore.y = 40;
	self.ltxtScore.alpha = 0.8;
	self.ltxtScore.color = "#FF0000";
	self.ltxtScore.text = Math.ceil(self.score) + self.scoreUnit;
	self.addChild(self.ltxtScore);

	self.addEventListener(LEvent.ENTER_FRAME, self._onFrame);

	// 需要处理速度的对象集
	// self.unhandleQueue.push(self.bmapFloor1);
	// self.unhandleQueue.push(self.bmapFloor2);
	self.unhandleQueue.push(self.bmapFloor3);
	self.unhandleQueue.push(self.bmapTree1);
	// self.unhandleQueue.push(self.bmapTree2);
	self.unhandleQueue.push(self.bmapRoad);
};

Background.prototype.setSpeed = function(_speed) {
	this.speed = _speed;
};

Background.prototype.getLeaveSecond = function() {
	return this.leaveSecond;
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