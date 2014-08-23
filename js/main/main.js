function Main(resources) {
	var self = this;

	base(self, LSprite, []);

	// 资源列表
	self.resources = resources;
	// 游戏主体对象
	self.gameBody = null;

	// 默认油耗（默认小数点后6位）（5.9L/100km）
	self.DEFAULT_OIL_WEAR = 0.08 / game.interval;
	// 移动速度（默认匀速 80KM/h）（对应背景后退速度）
	self.DEFAULT_SPEED = 80;
}

Main.prototype.init = function() {
	var self = this;

	// 油量没了，所有事件全部清除掉
	self.removeAllEventListener();
	self.removeAllChild();

	// 清除节油器
	for (var p in self.props) {
		if (!self.props.hasOwnProperty(p))
			continue;

		self.removeChild(self.props[p]);
	}

	// 当前投放的节油器对象
	self.props = {};
	// 扔道具的下一个时间戳
	self.throwTicks = Date.now();
	// 当前油耗（默认小数点后6位）（获得节油器会降低当前油耗值）
	self.oilWear = self.DEFAULT_OIL_WEAR_SECOND;
	// 通过开始10秒钟的点击获得的油量
	self.oilMassObtained = 3;
	// 当前还剩下多少L油（默认小数点后1位）
	self.oilMassLeave = self.oilMassObtained;

	// 初始化游戏背景
	self.background = new Background(self.resources);
	self.addChild(self.background);

	self.car = new Car(self.resources);
	self.addChild(self.car);

	self.ready = new Ready(self.resources, self._start);
	self.addChild(self.ready);
};

Main.prototype._start = function() {
	var self = Main._instance;

	// 移除开始界面
	self.removeChild(self.ready);
	self.removeAllEventListener();

	self.addEventListener(LEvent.ENTER_FRAME, self._onFrame);

	self.addEventListener(LMouseEvent.MOUSE_DOWN, self._onMouseDown);
};

Main.prototype._onMouseDown = function(event) {
	var self = Main._instance;

	if (self.oilMassLeave <= 0) {

	} else {
		if (event.offsetX < LGlobal.width / 2) {
			self.car.moveToLeft();
		} else {
			self.car.moveToRight();
		}
	}
}

Main.prototype._onFrame = function(event) {
	var self = Main._instance;

	self.oilMassLeave -= self.DEFAULT_OIL_WEAR;

	// 显示已经跑了多少距离
	self.background.setDistance(self._getDistance());
	// 显示剩余油量
	self.background.setQtrip(self.oilMassLeave.toFixed(1));

	if (self.oilMassLeave > 0) {
		self.background.backup();

		for (var p in self.props) {
			if (!self.props.hasOwnProperty(p))
				continue;

			var _prop = self.props[p];

			if (_prop.getCoord().y > 400 || LGlobal.hitTestPolygon(self.car.getCoords(), _prop.getCoords())) {
				self.removeChild(_prop);

				self.props[p] = null;
				delete self.props[p];
			}
		}

		if (Date.now() >= self.throwTicks) {
			var prop = new Prop(self.resources);
			self.addChild(prop);

			self.throwTicks += Math.ceil(8000 * Math.random());

			self.props[self.throwTicks] = prop;
		}

	} else {
		self.gameOver = new GameOver(self.resources, function() {
			self.addEventListener(LEvent.ENTER_FRAME, self.onFrame);
		});
		self.addChild(self.gameOver);

		self.removeEventListener(LEvent.ENTER_FRAME, self.onFrame);
	}
};

// 计算已形式路程
Main.prototype._getDistance = function() {
	var self = this;

	// 标准平均油耗为5.9L/100km
	return (((self.oilMassObtained - self.oilMassLeave) * 100) / 5.9).toFixed(4);
};

Main._instance = null;

Main.create = function(resources) {
	Main._instance = new Main(resources);
	addChild(Main._instance);

	Main._instance.init();
};