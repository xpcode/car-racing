// 所有静态资源，图片文件、脚本文件、声音文件
var resources = [];

(function() {

	var images = [{
		name: "logo",
		path: "../../images/logo.png"
	}, {
		name: "b_background",
		path: "../../images/b_background.png"
	}, {
		name: "m_background",
		path: "../../images/demo/m_background.png"
	}];

	var scripts = [{
		type: "js",
		path: "/src/scripts/main/background.js"
	}, {
		type: "js",
		path: "/src/scripts/main/car.js"
	}, {
		type: "js",
		path: "/src/scripts/main/prop.js"
	}, {
		type: "js",
		path: "/src/scripts/main/logo.js"
	}, {
		type: "js",
		path: "/src/scripts/main/gamebody.js"
	}];

	var sounds = [];


	resources = resources.concat(images, scripts, sounds);

})();