function Prop() {
	var self = this;

	base(self, LSprite, []);

	self.items = [{
		name: 'prop_01',
		type: Main.RIGID_BODY_TYPE.PROP_ENGINE
	}, {
		name: 'prop_02',
		type: Main.RIGID_BODY_TYPE.PROP_SPIDER
	}, {
		name: 'prop_03',
		type: Main.RIGID_BODY_TYPE.PROP_CAR
	}, {
		name: 'prop_04',
		type: Main.RIGID_BODY_TYPE.PROP_CAR
	}, {
		name: 'prop_05',
		type: Main.RIGID_BODY_TYPE.PROP_ENGINE
	}, {
		name: 'prop_06',
		type: Main.RIGID_BODY_TYPE.PROP_SHIT
	}, {
		name: 'prop_07',
		type: Main.RIGID_BODY_TYPE.PROP_ENGINE
	}, ];
	self.DEFAULT_Y = 80;
	self.DEFAULT_SPEED = 10;

	self.init();
}

Prop.prototype.init = function() {
	var self = this;

	var num = Math.ceil(Math.random() * self.items.length) - 1;
	var name = self.items[num].name;
	var type = self.items[num].type;

	self.bmap = new LBitmap(new LBitmapData(game.dataList[name]));

	self.layer = new LSprite();
	self.layer.name = name;
	self.layer.type = type;
	self.layer.target = self.layer;
	self.layer.x = Math.random() * LGlobal.width;
	self.layer.addChild(self.bmap);
	self.layer.addBodyPolygon(self.bmap.width, self.bmap.height, 1, 5, .4, .2);
	self.addChild(self.layer);
};