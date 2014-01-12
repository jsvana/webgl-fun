(function(window) {
	var initGL = function() {
		try {
			var c = window.document.getElementById('c');
			gl = c.getContext("experimental-webgl");
			gl.viewportWidth = 480;
			gl.viewportHeight = 320;
			c.width = 480;
			c.height = 320;
		} catch (e) {
			return false;
		} finally {
			return true;
		}

		if (!gl) {
			return false;
		}
	};

	window.init = function() {
		if (!initGL()) {
			console.log("Unable to initialize WebGL");
			return;
		}

		var game = new Game(gl);

		game.run(gl);
	};
})(window);
