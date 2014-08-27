/**
 * @author lufy
 */
function GameOver(resources, fnStartGame) {
	base(this, LSprite, []);

	this.resources = resources;
	this.restart = fnStartGame;
	this.init();
}
GameOver.prototype.init = function() {
	var self = this;

	self.layer = new LSprite();
	self.addChild(self.layer);


	var shape = new LShape();
    addChild(shape);
    shape.graphics.drawRect(2, "#ff0000", [10, 10, 50, 100], true, "#880088");

    return;

	var bitmap = new LBitmap(new LBitmapData(self.resources['end']));

	self.layer.x = (LGlobal.width - bitmap.width) / 2;
	self.layer.y = (LGlobal.height - bitmap.height) / 2;
	self.layer.addChild(bitmap);

	var buttonUp = new LBitmap(new LBitmapData(self.resources['btn_submit']));
	var buttonOver = new LBitmap(new LBitmapData(self.resources['btn_submit'], 1, 1));
	var button = new LButton(buttonUp, buttonOver);
	button.x = (self.layer.getWidth() - buttonUp.width) / 2;
	button.y = 327;
	self.layer.addChild(button);

	// 点击按钮提交游戏成绩，开启重新游戏界面
	button.addEventListener(LMouseEvent.MOUSE_DOWN, function() {
		button.removeAllChild();
		button.removeAllEventListener();

		self.layer.removeAllChild();
		self.removeChild(self.layer);

		self.restart();
	});
};