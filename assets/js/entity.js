var EntityType = {
	NONE: 0,
	PLAYER: 1,
	RANDOM_ENEMY: 2,
};

var Entity = function(gl, pos, ent, type, bounds) {
	this.tileSize = 24;

	this.assetman = AssetManager.getInstance();
	this.shaderman = ShaderManager.getInstance();
	this.position = {};

	if (pos) {
		this.position.x = pos.x;
		this.position.y = pos.y;
	} else {
		this.position = {
			x: 0,
			y: 0
		};
	}

	if (ent) {
		this.entity = ent;
	} else {
		this.entity = 0;
	}

	this.type = type;

	if (bounds) {
		this.bounds = bounds;
	}

	this.tween = {
		x: 0,
		y: 0
	};

	this.path = [];

	var texDim = this.assetman.textureDimensions('assets/images/entities.png');

	var tileX = (this.entity % Math.floor(texDim.w / this.tileSize))
		* this.tileSize / texDim.w;
	var tileY = Math.floor(this.entity / Math.floor(texDim.w / this.tileSize))
		* this.tileSize / texDim.h;

	var verts = [
		0, 0, 0.1,
		this.tileSize - 1, 0, 0.1,
		this.tileSize - 1, this.tileSize - 1, 0.1,
		0, this.tileSize - 1, 0.1,
	];

	this.buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);
	this.buffer.itemSize = 3;
	this.buffer.numItems = 4;

	this.texBuf = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.texBuf);
	var textureCoords = [
		tileX, tileY,
		tileX + this.tileSize / texDim.w, tileY,
		tileX + this.tileSize / texDim.w, tileY + this.tileSize / texDim.h,
		tileX, tileY + this.tileSize / texDim.h
	];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords),
		gl.STATIC_DRAW);
	this.texBuf.itemSize = 2;
	this.texBuf.numItems = 4;

	this.indexBuf = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuf);
	var indices = [
		0, 1, 2,
		0, 2, 3,
	];
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices),
		gl.STATIC_DRAW);
	this.indexBuf.itemSize = 1;
	this.indexBuf.numItems = 6;

	this.mvMatrix = mat4.create();

	this.frameCtr = 0;
	this.frame = 0;

	this.direction = Direction.LEFT;
};

Entity.prototype.hasPath = function() {
	return this.path.length !== 0;
};

Entity.prototype.setDestination = function(map, x, y) {
	this.path = Util.AStar.path(map,
		map.getTile(this.position.x, this.position.y), map.getTile(x, y));
};

Entity.prototype.size = function() {
	return this.tileSize;
};

Entity.prototype.update = function(gl, ticks) {
	this.frameCtr += ticks;

	if (this.frameCtr > 500) {
		this.frame = (this.frame + 1) % 2;
		this.frameCtr = 0;
	}

	if (this.isTweening()) {
		if (this.tween.x < 0) {
			this.tween.x++;
		} else if (this.tween.x > 0) {
			this.tween.x--;
		}

		if (this.tween.y < 0) {
			this.tween.y++;
		} else if (this.tween.y > 0) {
			this.tween.y--;
		}
	} else {
		if (this.type === EntityType.RANDOM_ENEMY) {
			if (this.hasPath()) {
				var tile = this.path.shift();
				this.move(tile.position.x - this.position.x,
					tile.position.y - this.position.y);
			} else {
				var dX = Math.floor(Math.random() * this.bounds.r - 1) + 1;
				var dY = Math.floor(Math.random() * this.bounds.b - 1) + 1;
				this.setDestination(Game.map, dX, dY);
			}
		}
	}
};

Entity.prototype.setPosition = function(pos) {
	this.position = pos;
};

Entity.prototype.isTweeningX = function() {
	return this.tween.x !== 0;
}

Entity.prototype.isTweeningY = function() {
	return this.tween.y !== 0;
}

Entity.prototype.isTweening = function() {
	return this.isTweeningX() || this.isTweeningY();
};

Entity.prototype.move = function(mX, mY) {
	if (!this.isTweeningX()) {
		this.position.x += mX;
		if (mX > 0) {
			this.tween.x = -this.tileSize;
		} else if (mX < 0) {
			this.tween.x = this.tileSize;
		}
	}

	if (!this.isTweeningY()) {
		this.position.y += mY;
		if (mY > 0) {
			this.tween.y = -this.tileSize;
		} else if (mY < 0) {
			this.tween.y = this.tileSize;
		}
	}
};

Entity.prototype.setDirection = function(dir) {
	this.direction = dir;
};

Entity.prototype.render = function(gl) {
	this.prog = this.shaderman.useProgram(gl, 'entity');
	gl.uniform1f(this.prog.uFrame, this.frame);

	mat4.identity(this.mvMatrix);

	if (this.direction === Direction.RIGHT) {
		mat4.translate(this.mvMatrix, this.mvMatrix,
			[this.tileSize, 0, 0]);

		mat4.scale(this.mvMatrix, this.mvMatrix, [-1, 1, 1]);
	}

	mat4.translate(this.mvMatrix, this.mvMatrix,
		[
			this.position.x * this.tileSize + this.tween.x,
			this.position.y * this.tileSize + this.tween.y, 0
		]);

	gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
	gl.vertexAttribPointer(this.prog.vertexPositionAttribute,
		this.buffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, this.texBuf);
	gl.vertexAttribPointer(this.prog.textureCoordAttribute,
		this.texBuf.itemSize, gl.FLOAT, false, 0, 0);

	gl.activeTexture(gl.TEXTURE0);
	this.assetman.useTexture(gl, 'assets/images/entities.png');
	gl.uniform1i(this.prog.uSampler, 0);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuf);
	gl.uniformMatrix4fv(this.prog.uMVMatrix, false, this.mvMatrix);
	gl.drawElements(gl.TRIANGLES, this.indexBuf.numItems, gl.UNSIGNED_SHORT, 0);
};
