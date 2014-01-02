var Game = function(gl) {
	this.lastTime = new Date().getTime();

	window.addEventListener('keyup', function(event) {
		Key.onKeyup(event);
	}, false);
	window.addEventListener('keydown', function(event) {
		Key.onKeydown(event);
	}, false);

	this.tick = (function(self, gl) {
		return function() {
			requestAnimFrame(self.tick);
			var timeNow = new Date().getTime();
			var ticks = timeNow - self.lastTime;

			self.update(ticks);
			self.render(gl);

			self.lastTime = timeNow;
		}
	})(this, gl);
};

Game.prototype.run = function(gl) {
	var self = this;

	var assets = {
		textures: ['assets/world.png', 'assets/entities.png'],
		json: ['assets/map.json']
	};

	this.assetman = AssetManager.getInstance();
	this.assetman.loadList(gl, assets, function() {
		console.log('Assets loaded');

		self.shaderman = ShaderManager.getInstance();
		self.shaderman.createProgram(gl, 'base.vert', 'block.frag', 'block');
		self.shaderman.createProgram(gl, 'base.vert', 'entity.frag', 'entity');
		self.shaderman.addUniform(gl, 'entity', 'uFrame');

		self.map = new Map(gl);
		self.player = new Entity(gl, { x: 10, y: 3 }, 2);

		self.camera = new Camera(gl, { x: 0, y: 0 }, { w: 480, h: 360 });

		gl.clearColor(0.0, 0.0, 0.0, 1.0);
		gl.enable(gl.DEPTH_TEST);
		gl.enable(gl.BLEND);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

		self.tick(gl);
	});
};

Game.prototype.update = function(ticks) {
	var mX = 0;
	var mY = 0;

	if (Key.isDown(Key.A)) {
		mX -= 1;
	}
	if (Key.isDown(Key.D)) {
		mX += 1;
	}
	if (Key.isDown(Key.W)) {
		mY += 1;
	}
	if (Key.isDown(Key.S)) {
		mY -= 1;
	}

	this.player.move({ x: mX, y: mY });
};

Game.prototype.render = function(gl) {
	gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	this.map.render(gl);
	this.player.render(gl);
};
