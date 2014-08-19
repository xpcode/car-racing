/**
 * @author lufy
 */
function GameOver(fnStartGame) {
	base(this, LSprite, []);

	this.restart = fnStartGame;
	this.init();
}
GameOver.prototype.init = function() {
	var self = this;

	self.ltxtGameOver = new LTextField();
	self.ltxtGameOver.font = "Bauhaus 93";
	self.ltxtGameOver.weight = "normal";
	self.ltxtGameOver.size = 26;
	// self.ltxtGameOver.alpha = 0.8;
	self.ltxtGameOver.color = "#FFF";
	self.ltxtGameOver.text = '游戏结束';
	self.ltxtGameOver.lineWidth = 5;
	self.ltxtGameOver.x = (LGlobal.width - self.ltxtGameOver.width / 4) / 2;
	self.ltxtGameOver.y = LGlobal.height / 3.5;
	self.addChild(self.ltxtGameOver);

	var bitmapDataUp = new LBitmapData(game.dataList["btn_start"], 0, 0, 98, 48);
	var bitmapUp = new LBitmap(bitmapDataUp);

	var bitmapDataOver = new LBitmapData(game.dataList["btn_start"], 0, 48, 98, 48);
	var bitmapOver = new LBitmap(bitmapDataOver);

	var btnStart = new LButton(bitmapUp, bitmapOver);
	btnStart.x = (LGlobal.width - bitmapDataUp.width) / 2;
	btnStart.y = (LGlobal.height - bitmapDataUp.height) / 2;
	btnStart.addEventListener(LMouseEvent.MOUSE_UP, game.world.gameStart);
	self.addChild(btnStart);
};