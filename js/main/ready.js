function Ready(resources, setOilMass, start) {
	var self = this;

	base(self, LSprite, []);

	self.resources = resources;
	self.start = start;
	self.setOilMass = setOilMass;
	self.clickCount = 0;

	self.init();
}

Ready.prototype.init = function() {
	var self = this;

	self.layer = new LSprite();
	self.addChild(self.layer);

	var bitmap = new LBitmap(new LBitmapData(self.resources['start']));

	self.layer.x = (LGlobal.width - bitmap.width) / 2;
	self.layer.y = (LGlobal.height - bitmap.height) / 2;
	self.layer.addChild(bitmap);

	var buttonUp = new LBitmap(new LBitmapData(self.resources['btn_start']));
	var buttonOver = new LBitmap(new LBitmapData(self.resources['btn_start'], 1, 1));
	var button = new LButton(buttonUp, buttonOver);
	button.x = (self.layer.getWidth() - buttonUp.width) / 2 - 10;
	button.y = 278;
	self.layer.addChild(button);

	// 点击按钮10秒后开始3、2、1、go
	button.addEventListener(LMouseEvent.MOUSE_DOWN, function() {
		button.removeAllChild();
		button.removeAllEventListener();

		self.layer.removeAllChild();

		setTimeout(function() {
			LGlobal.stage.removeAllEventListener();
			self._clickScreen();
		}, (!!game.debug ? 0 : 10 * 1000));

		// 点击屏幕开始计点击次数
		LGlobal.stage.addEventListener(LMouseEvent.MOUSE_DOWN, function() {
			self.clickCount++;
			self.setOilMass(self.clickCount);
		});
	});
};

Ready.prototype._clickScreen = function() {
	var self = this;
	var names = !!game.debug ? [] : ['time_3', 'time_2', 'time_1', 'time_go'];
	var index = 0;

	var intervalId = window.setInterval(function() {
		if (index < names.length) {
			var key = names[index];
			var bitmap = new LBitmap(new LBitmapData(self.resources[key]));

			self.layer.x = (LGlobal.width - bitmap.width) / 2;
			self.layer.y = LGlobal.height / 3;
			self.layer.removeAllChild();
			self.layer.addChild(bitmap);

			index++;

		} else {
			window.clearInterval(intervalId);

			self.layer.removeAllChild();
			self.removeChild(self.layer);
			self.start(self.clickCount + 110);

		}
	}, 1000);
};