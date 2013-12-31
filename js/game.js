var Game = function(gl) {
	this.shaderman = ShaderManager.getInstance();
	this.shaderman.loadShader(gl, 'block.vert');
	this.shaderman.loadShader(gl, 'block.frag');
	this.shaderman.createProgram(gl, 'block.vert', 'block.frag', 'block');
	this.pMatrix = mat4.create();

	this.lastTime = new Date().getTime();

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

	this.assetman = AssetManager.getInstance();
	this.assetman.loadList(gl, ['assets/tileset.png'], function() {
		console.log('Assets loaded');

		self.prog = self.shaderman.useProgram(gl, 'block');

		self.tiles = [];
		for (var i = 0; i < 5; i++) {
			var r = [];
			for (var j = 0; j < 5; j++) {
				r.push(new Tile(gl, { x: j, y: i }, (i + j) % 10));
			}
			self.tiles.push(r);
		}

		gl.clearColor(0.0, 0.0, 0.0, 1.0);
		gl.enable(gl.DEPTH_TEST);
		console.log(mat4.ortho(self.pMatrix, 0, 400, 0, 400, -10, 10));
		console.log(self.pMatrix);

		self.tick(gl);
	});
};

Game.prototype.update = function(ticks) {
	// TODO: update
};

Game.prototype.render = function(gl) {
	gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	/*
	mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0,
		this.pMatrix);
	*/

	mat4.ortho(this.pMatrix, 0, 400, 0, 400, -10, 10);

	gl.uniformMatrix4fv(this.prog.pMatrixUniform, false, this.pMatrix);

	for (var i = 0; i < 5; i++) {
		for (var j = 0; j < 5; j++) {
			this.tiles[i][j].render(gl);
		}
	}
};
