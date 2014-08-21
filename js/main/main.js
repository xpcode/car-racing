function Main(dataList) {
	var self = this;
	base(self, LSprite, []);

	/**设置场景大小*/
	self.sceneWidth = 8500;
	self.sceneHeight = LStage.height + 1000;

	// 移动速度
	self.DEFAULT_SPEED = 22;
	// 资源列表
	self.dataList = dataList;
	// 横纵向缩放比例
	self.scaleX = 1;
	self.scaleY = 1;
	// 游戏主体对象
	self.gameBody = null;
	// 扔道具的下一个时间戳
	self.throwTicks = Date.now();
	// 扔道具的默认时间间隔
	self.throwInterval = 8000;

	self.props = {};
}

Main.prototype.init = function() {
	var self = this;

	self.leaveSecond = 30;
	self.leaveMilliSecond = self.leaveSecond * 1000;
	self.removeAllChild();

	// 初始化游戏背景
	self.background = new Background();
	self.addChild(self.background);

	self.car = new Car();
	self.addChild(self.car);

	self.ready = new Ready(self.gameStart);
	self.addChild(self.ready);

	// var fps = new FPS();
	// addChild(fps);
};

Main.prototype.showFaceback = function(name) {
	// name ="fb_cool"
	// 吃道具反馈
	self.faceback = self.faceback || {};

	if (!self.faceback[name]) {
		var fb = new LBitmap(new LBitmapData(game.dataList[name]));
		fb.scaleX = 0.1;
		fb.scaleY = 0.1;

		self.faceback[name] = new LSprite();
		self.faceback[name].x = (LGlobal.width - fb.width * fb.scaleX) / 2;
		self.faceback[name].y = (LGlobal.height - fb.height * fb.scaleY) / 2;
		self.faceback[name].visible = false;
		self.faceback[name].addChild(fb);
		self.addChild(self.faceback[name]);
	}

	LTweenLite
		.to(self.faceback[name], 1, {
			visible: true,
			ease: LEasing.Strong.easeIn,
			onComplete: function(e) {
				self.faceback[name].visible = false;
			}
		});
};

Main.prototype.gameStart = function(event) {
	var self = game.world;

	// 移除开始界面
	self.removeChild(self.ready);
	self.removeAllEventListener();

	self.addEventListener(LEvent.ENTER_FRAME, self.onFrame);
	self.addEventListener(LMouseEvent.MOUSE_DOWN, function(event) {
		self.car.setCanMove(true);
	});
	self.addEventListener(LMouseEvent.MOUSE_MOVE, function(event) {
		if (event.offsetX < LGlobal.width / 2) {
			self.car.moveToLeft();
		} else {
			self.car.moveToRight();
		}
	});
	self.addEventListener(LMouseEvent.MOUSE_UP, function(event) {
		self.car.setCanMove(false);
	});
};

Main.prototype.onFrame = function(event) {
	var self = event.target;

	self.leaveMilliSecond -= game.interval;
	self.leaveSecond = Math.ceil(self.leaveMilliSecond / 1000);

	// 显示已经跑了多少距离
	self.background.setDistance(self.leaveSecond);
	// 显示油耗
	self.background.setQtrip(self.leaveSecond);

	if (self.leaveSecond > 0) {
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
			var prop = new Prop();
			self.addChild(prop);

			self.throwTicks += Math.ceil(self.throwInterval * Math.random());
			// 掉道具的间隔变短
			self.throwInterval -= game.interval;

			self.props[self.throwTicks] = prop;
		}

	} else {
		self.gameOver = new GameOver(function() {
			self.addEventListener(LEvent.ENTER_FRAME, self.onFrame);
		});
		self.addChild(self.gameOver);

		self.removeEventListener(LEvent.ENTER_FRAME, self.onFrame);
	}

	//计算刚体坐标
	LStage.box2d.synchronous();
};