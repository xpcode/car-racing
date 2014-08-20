function Ready(callback) {
	var self = this;

	base(self, LSprite, []);

	self.callback = callback || function() {
		alert('miss gameStart')
	};
	self.init();
}

Ready.prototype.init = function() {
	var self = this;

	self.layer = new LSprite();
	self.addChild(self.layer);

	var names = [];//'time_3', 'time_2', 'time_1', 'time_go'];
	var index = 0;

	var intervalId = window.setInterval(function() {
		if (index < names.length) {
			var key = names[index];
			var bitmap = new LBitmap(new LBitmapData(game.dataList[key]));

			self.layer.x = (LGlobal.width - bitmap.width) / 2;
			self.layer.y = LGlobal.height / 3;
			self.layer.removeAllChild();
			self.layer.addChild(bitmap);

			index++;

		} else {
			window.clearInterval(intervalId);

			self.removeChild(self.layer);
			self.callback();
		}
	}, 1000);
};