function Main(resources) {
	var self = this;

	base(self, LSprite, []);

	// 资源列表
	self.resources = resources;
	self.DEFAULT_OILWEAR = 5.5;
}

Main.prototype.init = function() {
	var self = this;

	// 油量没了，所有事件全部清除掉
	self.removeAllEventListener();
	self.removeAllChild();

	// 当前油耗（默认小数点后6位）（获得节油器会降低当前油耗值）
	self.oilWear = self.DEFAULT_OILWEAR;
	// 通过开始10秒钟的点击获得的油量
	self.oilMassObtained = 0;
	// 当前还剩下多少L油（默认小数点后1位）
	self.oilMassLeave = self.oilMassObtained;
	// 已经跑的KM数
	self.distance = 0;

	// self.gameOver = new GameOver(self.resources, function() {
	// 	self.init();
	// }, 18.18, 5.3);
	// self.addChild(self.gameOver);
	// return;

	// 初始化游戏背景
	self.background = new Background(self.resources);
	self.addChild(self.background);

	self.car = new Car(self.resources);
	self.addChild(self.car);

	self.ready = new Ready(self.resources, function(clickCount) {
		self.oilMassObtained = self._getOilMassObtained(clickCount);
		self.oilMassLeave = self.oilMassObtained;
		// 显示点击屏幕获得的油量
		self.background.setOilMass(self.oilMassLeave);
	}, self._start);
	self.addChild(self.ready);

	if (game.debug) {
		addChild(new FPS());
	}
};

Main.prototype.throwProp = function(enable) {
	var self = this;

	if (enable === true) {
		var second = (1.5 + Math.random() * 3.5);
		var isLeft = Math.random() > 0.5;
		var allThrow = 3.5 < second && second < 4;

		if (isLeft === true || allThrow === true) {
			self.prop.throw(second, function() {
				self.throwProp(self._running());
			});
		}
		if (isLeft === false || allThrow === true) {
			self.prop_right.throw(second, function() {
				self.throwProp(self._running());
			});
		}

	} else {
		self.prop.setCanMove(false);
		self.prop_right.setCanMove(false);
	}
};

Main.prototype._start = function() {
	var self = Main._instance;

	// 移除开始界面
	self.removeChild(self.ready);
	self.removeAllEventListener();

	self.addEventListener(LEvent.ENTER_FRAME, self._onFrame);
	self.addEventListener(LMouseEvent.MOUSE_DOWN, self._onMouseDown);

	self.car.setCanMove(true);
	self.background.setCanMove(true);

	self.prop = new Prop(self.resources, self.car, function() {
		self._reduceOilMass();
	}, true);
	self.addChild(self.prop);
	self.prop.setCanMove(true);

	self.prop_right = new Prop(self.resources, self.car, function() {
		self._reduceOilMass();
	}, false);
	self.addChild(self.prop_right);
	self.prop_right.setCanMove(true);

	self.throwProp(true);

	if (!!game.debug) {
		self.oilMassObtained = self.oilMassLeave = 1;
	}
};

Main.prototype._onFrame = function(event) {
	var self = Main._instance;

	// 相当于每秒油耗为 5.5/120
	var tempOilWear = self.oilWear / (120 * 50);

	self.oilMassLeave -= tempOilWear;
	self.distance += tempOilWear * 100 / self.DEFAULT_OILWEAR;

	// 显示已经跑了多少距离
	self.background.setDistance(self.distance.toFixed(2));
	// 显示当前油耗
	self.background.setQtrip(self.oilWear.toFixed(3));
	// 显示当前剩余油量
	self.background.setOilMass(self.oilMassLeave);

	if (!self._running()) {
		self.background.setCanMove(false);
		self.car.setCanMove(false);
		self.throwProp(false);

		// self.gameOver = new GameOver(self.resources, function() {
		// 	self.init();
		// }, self.distance, self.oilWear);
		// self.addChild(self.gameOver);
		location.href = ['gameover.php?distance=', self.distance, '&oilwear=', self.oilWear].join('');

		self.removeEventListener(LEvent.ENTER_FRAME, self._onFrame);
	}
};

// 计算获得的油量
Main.prototype._getOilMassObtained = function(clickCount) {
	var self = this;
	var oilmass = 1;

	if (clickCount < 80) {
		oilmass -= (80 - clickCount) * 0.01;
	}

	return oilmass;
};

Main.prototype._onMouseDown = function(event) {
	var self = Main._instance;

	if (self._running()) {
		if (event.offsetX < LGlobal.width / 2) {
			self.car.moveToLeft();
		} else {
			self.car.moveToRight();
		}
	}
};

Main.prototype._reduceOilMass = function() {
	var self = this;

	self.oilWear -= self.DEFAULT_OILWEAR * 0.01;
	self.distance += 18.18 * 0.01;
}

Main.prototype._running = function() {
	return this.oilMassLeave > 0;
};

Main._instance = null;

Main.create = function(resources) {
	Main._instance = new Main(resources);
	addChild(Main._instance);

	Main._instance.init();
};