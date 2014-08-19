LGlobal.aspectRatio = LANDSCAPE;
init(1000/30, "legend", 800, 480, main);
var dataList;
var stageLayer;
var stageIndex = 0;
var MOVE_STEP = 8;
var MOVE_STEP_SLOW = 8;
var MOVE_STEP_FAST = 12;
var g = 3;
var stopFlag;
var gameBody;
var runMap;
var runCharacter;
var npcLayer;
var itemLayer;
var MySoundPlayer;
var starCtrl;
var loadData = [
{name : "num_0",path : "../../images/demo/num_0.png"},
{name : "num_1",path : "../../images/demo/num_1.png"},
{name : "num_2",path : "../../images/demo/num_2.png"},
{name : "num_3",path : "../../images/demo/num_3.png"},
{name : "num_4",path : "../../images/demo/num_4.png"},
{name : "num_5",path : "../../images/demo/num_5.png"},
{name : "num_6",path : "../../images/demo/num_6.png"},
{name : "num_7",path : "../../images/demo/num_7.png"},
{name : "num_8",path : "../../images/demo/num_8.png"},
{name : "num_9",path : "../../images/demo/num_9.png"},
{name : "effect",path : "../../images/demo/effect.png"},
{name : "logo",path : "../../images/demo/logo.png"},
{name : "inputbox",path : "../../images/demo/inputbox.png"},
{name : "spiritEffect",path : "../../images/demo/spiritEffect.png"},
{name : "b_background",path : "../../images/demo/b_background.png"},
{name : "m_background",path : "../../images/demo/m_background.png"},
{name : "stage",path : "../../images/demo/stage.png"},
{name : "chara",path : "../../images/demo/chara.png"},
{name : "bird",path : "../../images/demo/bird.png"},
{name : "gui",path : "../../images/demo/gui.png"},
{name : "window",path : "../../images/demo/window.png"},
{name : "HP_bg",path : "../../images/demo/hp_bg.png"},
{name : "HP_value",path : "../../images/demo/hp_value.png"},
{name:"ico_sina",path:"./../../images/demo/ico_sina.gif"},
{name:"ico_qq",path:"./../../images/demo/ico_qq.gif"},
{name:"ico_facebook",path:"./../../images/demo/ico_facebook.png"},
{name:"ico_twitter",path:"./../../images/demo/ico_twitter.png"},
{type : "js",path : "/src/scripts/demo/Background.js"},
{type : "js",path : "/src/scripts/demo/Character.js"},
{type : "js",path : "/src/scripts/demo/Logo.js"},
{type : "js",path : "/src/scripts/demo/Map.js"},
{type : "js",path : "/src/scripts/demo/StageData.js"},
{type : "js",path : "/src/scripts/demo/GameBody.js"},
{type : "js",path : "/src/scripts/demo/Floor.js"},
{type : "js",path : "/src/scripts/demo/HP.js"},
{type : "js",path : "/src/scripts/demo/Num.js"},
{type : "js",path : "/src/scripts/demo/Npc.js"},
{type : "js",path : "/src/scripts/demo/Item.js"},
{type : "js",path : "/src/scripts/demo/SoundPlayer.js"},
{type : "js",path : "/src/scripts/demo/Star.js"},
{type : "js",path : "/src/scripts/demo/share.js"},
{type : "js",path : "/src/scripts/demo/GameOver.js"}
];
function main() {
	if(LGlobal.canTouch){
		LGlobal.stageScale = LStageScaleMode.SHOW_ALL;
		LSystem.screen(LStage.FULL_SCREEN);
	}
	//LGlobal.setDebug(true);
	LMouseEventContainer.set(LMouseEvent.MOUSE_DOWN,true);
	LMouseEventContainer.set(LMouseEvent.MOUSE_UP,true);
	LMouseEventContainer.set(LMouseEvent.MOUSE_MOVE,true);

	loadingLayer = new LoadingSample4();
	addChild(loadingLayer);
	LLoadManage.load(loadData, function(progress) {
		loadingLayer.setProgress(progress);
	}, imgLoadComplete);
}
function imgLoadComplete(result){
	dataList = result;
	removeChild(loadingLayer);
	loadingLayer = null;

	MySoundPlayer = new SoundPlayer();

	stageLayer = new LSprite();
	addChild(stageLayer);

	//gameStart();

	var logo = new Logo();
	stageLayer.addChild(logo);

	return;
	var fps = new FPS();
	addChild(fps);
}
function gameStart(){
	if(gameBody){
		// MySoundPlayer.playSound("background");
	}
	stageLayer.die();
	stageLayer.removeAllChild();
	LTweenLite.removeAll();
	MOVE_STEP = MOVE_STEP_SLOW;
	gameBody = new GameBody();
	stageLayer.addChild(gameBody);

	return;
	//debug
	var sprite = new LSprite();
	addChild(sprite);
    sprite.graphics.add(function (){
    	var c = LGlobal.canvas;
    	var w = 32,h = 32;
    	var l1 = LGlobal.width/w;
    	var l2 = LGlobal.height/h;
		c.beginPath();
		c.strokeStyle = "#000000";
		for(var i=1;i<l1;i++){
			c.moveTo(w*i,0);
			c.lineTo(w*i,LGlobal.height);
		}
		for(var i=1;i<l2;i++){
			c.moveTo(0,h*i);
			c.lineTo(LGlobal.width,h*i);
		}
		c.stroke();
	});
}
LGlobal.horizontalError = function(){
	LGlobal.object.innerHTML='<img src="./../../images/demo/screenchange.png" style="width:100%" />';
	var f = function(){
		setTimeout(function(){location.href=location.href;}, 100);
	};
	window.onorientationchange = f;
};