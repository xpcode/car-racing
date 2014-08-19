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
	// 当前状态
	self.currentStatus = Main.RIGID_BODY_TYPE.DEFAULT;
}

Main.RIGID_BODY_TYPE = {
	DEFAULT: 1,
	PROP_ENGINE: 101,
	PROP_SPIDER: 102,
	PROP_CAR: 103,
	PROP_SHIT: 104,
	CAR: 201,
	ROAD: 202
};

Main.prototype.init = function() {
	var self = this;

	self.background = new Background();
	self.addChild(self.background);

	self.ready = new Ready(self.background.run);
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
	self.removeChild(self.logo);

	// 初始化游戏背景
	self.background = new Background();
	self.addChild(self.background);

	// 初始化汽车
	self.car = new Car();
	self.addChild(self.car);

	self.addEventListener(LEvent.ENTER_FRAME, self.onFrame);

	// 刚体碰撞检测
	LGlobal.box2d.setEvent(LEvent.BEGIN_CONTACT, beginContact);

	function beginContact(contact) {
		var rigidBodyA = contact.GetFixtureA().GetBody();
		var rigidBodyB = contact.GetFixtureB().GetBody();

		if (rigidBodyB.GetUserData().type == Main.RIGID_BODY_TYPE.CAR) {

			if (self.currentStatus != Main.RIGID_BODY_TYPE.PROP_CAR) {
				switch (rigidBodyA.GetUserData().type) {
					case Main.RIGID_BODY_TYPE.PROP_SHIT:
						self.background.setSpeed(11);
						self.showFaceback('fb_dot');
						break;

					case Main.RIGID_BODY_TYPE.PROP_CAR:
						self.background.setSpeed(33);
						self.showFaceback('fb_wow');
						break;

					case Main.RIGID_BODY_TYPE.PROP_ENGINE:
						self.background.setSpeed(28);
						self.showFaceback('fb_cool');
						break;

					case Main.RIGID_BODY_TYPE.PROP_SPIDER:
						self.background.setSpeed(0);
						self.showFaceback('fb_sui');
						break;

					default:
						break;
				}

				self.currentStatus = rigidBodyA.GetUserData().type;
			}
		}

		if (rigidBodyA.GetUserData().target) {
			rigidBodyA.GetUserData().target.die();
			rigidBodyA.GetUserData().target.removeAllChild();
			rigidBodyA.GetUserData().target = null;
			delete rigidBodyA.GetUserData().target;
		}
	};
};

Main.prototype.running = function() {
	return this.background.getLeaveSecond() > 0;
};

Main.prototype.restart = function() {
	this.background.reset();

	this.addEventListener(LEvent.ENTER_FRAME, this.onFrame);
};

Main.prototype.onFrame = function(event) {
	var self = event.target;

	if (self.running()) {
		if (Date.now() >= self.throwTicks) {
			var prop = new Prop();
			self.addChild(prop);

			self.throwTicks += Math.ceil(self.throwInterval * Math.random());
			// 掉道具的间隔变短
			self.throwInterval -= game.interval;
		}

	} else {
		self.gameOver = new GameOver(function() {
			self.restart();
		});
		self.addChild(self.gameOver);

		self.removeEventListener(LEvent.ENTER_FRAME, self.onFrame);
	}

	//计算刚体坐标
	LStage.box2d.synchronous();
};