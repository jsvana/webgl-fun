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
		textures: ['assets/images/world.png', 'assets/images/sprites.png'],
		shaders: [
			'assets/shaders/base.vert.glsl',
			'assets/shaders/block.frag.glsl',
			'assets/shaders/sprite.frag.glsl'
		]
	};

	this.assetman = AssetManager.getInstance();
	this.assetman.loadList(gl, assets, function() {
		console.log('Assets loaded');

		self.initShaders(gl);

		self.map = new Map('map');
		/*
		var p = Util.AStar.path(self.map, self.map.getTile(1, 1),
			self.map.getTile(10, 3));
		*/
		self.player = new Entity(gl, { x: 10, y: 3 }, 2);
		self.enemies = [];
		self.enemies.push(new Entity(gl, { x: 1, y: 1 }, 247,
			EntityType.RANDOM_ENEMY, {
				t: 1, b: self.map.roomHeight - 1,
				l: 1, r: self.map.roomWidth - 1
			}));
		self.camera = new Camera(gl, { x: 0, y: 0 }, { w: 480, h: 360 });

		Key.addUpEvent(Key.E, function(e) {
			self.map.changeRoom(Direction.UP);
		});

		Key.addUpEvent(Key.C, function(e) {
			self.map.changeRoom(Direction.DOWN);
		});

		Key.addDownEvent(Key.A, function(e) {
			self.player.setDirection(Direction.LEFT);
		});

		Key.addDownEvent(Key.D, function(e) {
			self.player.setDirection(Direction.RIGHT);
		});

		gl.clearColor(0.0, 0.0, 0.0, 1.0);
		gl.enable(gl.DEPTH_TEST);
		gl.enable(gl.BLEND);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

		self.tick(gl);
	}, function(count, total) {
		console.log('Loading... (' + ((count / total * 100) | 0) + '%)');
	});
};

Game.prototype.initShaders = function(gl) {
	this.shaderman = ShaderManager.getInstance();
	this.shaderman.createProgram(gl, 'assets/shaders/base.vert.glsl',
		'assets/shaders/block.frag.glsl', 'block');
	this.shaderman.createProgram(gl, 'assets/shaders/base.vert.glsl',
		'assets/shaders/sprite.frag.glsl', 'sprite');
	this.shaderman.addUniform(gl, 'sprite', 'uFrame');
	this.shaderman.addUniform(gl, 'sprite', 'uTexRowHeight');
	this.shaderman.useProgram(gl, 'sprite');
	var height = this.assetman.textureDimensions('assets/images/sprites.png').h;
	var rowHeight = 24 / height;
	gl.uniform1f(this.shaderman.getProgram('sprite').uTexRowHeight, rowHeight);
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

	var m = { x: mX, y: mY };

	this.map.moveEntity(this.player, m);

	this.player.update(gl, ticks);

	for (var e in this.enemies) {
		this.enemies[e].update(gl, ticks);
	}
};

Game.prototype.render = function(gl) {
	gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	this.map.render(gl);
	this.player.render(gl);

	for (var e in this.enemies) {
		this.enemies[e].render(gl);
	}
};
