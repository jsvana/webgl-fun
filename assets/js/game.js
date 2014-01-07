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
		maps: ['assets/maps/map.json'],
		textures: ['assets/images/world.png', 'assets/images/entities.png'],
		shaders: [
			'assets/shaders/base.vert.glsl',
			'assets/shaders/block.frag.glsl',
			'assets/shaders/entity.frag.glsl'
		]
	};

	this.assetman = AssetManager.getInstance();
	this.assetman.loadList(gl, assets, function() {
		console.log('Assets loaded');

		self.shaderman = ShaderManager.getInstance();
		self.shaderman.createProgram(gl, 'assets/shaders/base.vert.glsl',
			'assets/shaders/block.frag.glsl', 'block');
		self.shaderman.createProgram(gl, 'assets/shaders/base.vert.glsl',
			'assets/shaders/entity.frag.glsl', 'entity');
		self.shaderman.addUniform(gl, 'entity', 'uFrame');
		self.shaderman.addUniform(gl, 'entity', 'uTexRowHeight');
		self.shaderman.useProgram(gl, 'entity');
		var height = self.assetman.textureDimensions('assets/images/entities.png').h;
		var rowHeight = 24 / height;
		gl.uniform1f(self.shaderman.getProgram('entity').uTexRowHeight, rowHeight);

		self.map = new Map('map');
		self.player = new Entity(gl, { x: 10, y: 3 }, 2);

		self.camera = new Camera(gl, { x: 0, y: 0 }, { w: 480, h: 360 });

		Key.addUpEvent(Key.E, function(e) {
			console.log('change map');
			self.map.changeRoom(Direction.UP);
		});

		Key.addUpEvent(Key.C, function(e) {
			self.map.changeRoom(Direction.DOWN);
		});

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
		mY -= 1;
	}
	if (Key.isDown(Key.S)) {
		mY += 1;
	}

	if (mX < 0) {
		this.player.setDirection(Direction.LEFT);
	} else if (mX > 0) {
		this.player.setDirection(Direction.RIGHT);
	}

	this.player.move({ x: mX, y: mY });

	this.player.update(gl, ticks);
};

Game.prototype.render = function(gl) {
	gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	this.map.render(gl);
	this.player.render(gl);
};
