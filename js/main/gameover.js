/**
 * @author lufy
 */
function GameOver(resources, fnStartGame, distance, oilWear) {
	base(this, LSprite, []);

	this.resources = resources;
	this.restart = fnStartGame;
	this.distance = distance;
	this.oilWear = oilWear;

	self.URL_GET_OERDER = 'http://www.fiestanightout.ford.com.cn/api/getpercent';
	self.URL_POST_SCORE = 'http://www.fiestanightout.ford.com.cn/api/submitscore';

	this.init();
}
GameOver.prototype.init = function() {
	var self = this;

	self.layer = new LSprite();
	self.addChild(self.layer);

	// gameover界面
	var bitmap = new LBitmap(new LBitmapData(self.resources['end']));
	self.layer.x = (LGlobal.width - bitmap.width) / 2;
	self.layer.y = (LGlobal.height - bitmap.height) / 2;
	self.layer.addChild(bitmap);

	// 提交按钮
	var buttonUp = new LBitmap(new LBitmapData(self.resources['btn_submit']));
	var buttonOver = new LBitmap(new LBitmapData(self.resources['btn_submit'], 1, 1));
	var button = new LButton(buttonUp, buttonOver);
	button.x = (self.layer.getWidth() - buttonUp.width) / 2;
	button.y = 327;
	self.layer.addChild(button);

	// 用户名输入框
	self.lsUserName = new LSprite();
	self.lsUserName.graphics.drawRect(0, "#c5c372", [0, 0, 200, 20]);
	self.lsUserName.graphics.fillStyle('#fff');
	self.lsUserName.graphics.fill();
	self.ltfUserName = new LTextField();
	self.ltfUserName.x = 306;
	self.ltfUserName.y = 218;
	self.ltfUserName.setType(LTextFieldType.INPUT, self.lsUserName);
	self.layer.addChild(self.ltfUserName);

	// 电话输入框
	self.lsPhone = new LSprite();
	self.lsPhone.graphics.drawRect(0, "#c5c372", [0, 0, 200, 20]);
	self.lsPhone.graphics.fillStyle('#fff');
	self.lsPhone.graphics.fill();
	self.ltfPhone = new LTextField();
	self.ltfPhone.x = 306;
	self.ltfPhone.y = 253;
	self.ltfPhone.setType(LTextFieldType.INPUT, self.lsPhone);
	self.layer.addChild(self.ltfPhone);

	// 所在城市输入框
	self.lsCity = new LSprite();
	self.lsCity.graphics.drawRect(0, "#c5c372", [0, 0, 200, 20]);
	self.lsCity.graphics.fillStyle('#fff');
	self.lsCity.graphics.fill();
	self.ltfCity = new LTextField();
	self.ltfCity.x = 306;
	self.ltfCity.y = 286;
	self.ltfCity.setType(LTextFieldType.INPUT, self.lsCity);
	self.layer.addChild(self.ltfCity);

	// oilmass
	self.ltfDistance = new LTextField();
	self.ltfDistance.x = 364;
	self.ltfDistance.y = 138;
	self.ltfDistance.color = "#fe3e30";
	self.ltfDistance.size = 12;
	self.ltfDistance.text = self.distance.toFixed(2);
	self.layer.addChild(self.ltfDistance);

	// oilwear
	self.ltfDistance = new LTextField();
	self.ltfDistance.x = 336;
	self.ltfDistance.y = 158;
	self.ltfDistance.color = "#fe3e30";
	self.ltfDistance.size = 12;
	self.ltfDistance.text = self.oilWear.toFixed(2);
	self.layer.addChild(self.ltfDistance);

	// wanjia
	self.ltfDistance = new LTextField();
	self.ltfDistance.x = 504;
	self.ltfDistance.y = 138;
	self.ltfDistance.color = "#fe3e30";
	self.ltfDistance.size = 12;
	self.ltfDistance.text = '...';
	self.layer.addChild(self.ltfDistance);

	LAjax.post("http://www.fiestanightout.ford.com.cn/api/getpercent", {
		score: self.distance

	}, function(data) {
		self.ltfDistance.text = data;

		// 点击按钮提交游戏成绩，开启重新游戏界面
		button.addEventListener(LMouseEvent.MOUSE_DOWN, function() {
			var username = self.ltfUserName.text;
			var phone = self.ltfPhone.text;
			var city = self.ltfCity.text;

			if (LMath.trim(username + "").length == 0) {
				self.lsUserName.graphics.drawRect(1, '#ff6f28', [0, 0, 200, 20]);
				return;
			}
			if (LMath.trim(phone + "").length == 0) {
				self.lsPhone.graphics.drawRect(1, '#ff6f28', [0, 0, 200, 20]);
				return;
			}
			if (LMath.trim(city + "").length == 0) {
				self.lsCity.graphics.drawRect(1, '#ff6f28', [0, 0, 200, 20]);
				return;
			}

			button.die();
			button.removeAllChild();

			self.layer.removeAllChild();
			self.removeChild(self.layer);

			LAjax.post(self.URL_POST_SCORE, {
				name: username,
				mobile: phone,
				city: city,
				score: self.distance
			}, success);

			function success(data) {
				console.log(data)

				self.restart();
			}
		});
	}, function() {
		console.log('network error');
	});
};