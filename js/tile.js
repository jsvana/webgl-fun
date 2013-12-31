var Tile = function(gl, pos, tile) {
	this.assetman = AssetManager.getInstance();
	this.shaderman = ShaderManager.getInstance();
	this.prog = this.shaderman.useProgram(gl, 'block');
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

	var texDim = this.assetman.textureDimentions('assets/tileset.png');

	var tileX = (tile % Math.floor(texDim.w / 16)) * 16 / texDim.w;
	var tileY = Math.floor(tile / Math.floor(texDim.w / 16)) * 16 / texDim.h;

	var verts = [
		0, 0, 0,
		1, 0, 0,
		1, 1, 0,
		0, 1, 0,
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
		tileX + 16 / texDim.w, tileY,
		tileX + 16 / texDim.w, tileY + 16 / texDim.h,
		tileX, tileY + 16 / texDim.h
	];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords),
		gl.STATIC_DRAW);
	this.texBuf.itemSize = 2;
	this.texBuf.numItems = 4;

	this.indexBuf = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuf);
	var indices = [
		0, 1, 2,      0, 2, 3,    // Front face
	];
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices),
		gl.STATIC_DRAW);
	this.indexBuf.itemSize = 1;
	this.indexBuf.numItems = 6;

	this.mvMatrix = mat4.create();
};

Tile.prototype.render = function(gl) {
	mat4.identity(this.mvMatrix);

	mat4.translate(this.mvMatrix, this.mvMatrix,
		[this.position.x, this.position.y, 5]);

	gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
	gl.vertexAttribPointer(this.prog.vertexPositionAttribute,
		this.buffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, this.texBuf);
	gl.vertexAttribPointer(this.prog.textureCoordAttribute,
		this.texBuf.itemSize, gl.FLOAT, false, 0, 0);

	gl.activeTexture(gl.TEXTURE0);
	this.assetman.useTexture(gl, 'assets/tileset.png');
	gl.uniform1i(this.prog.samplerUniform, 0);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuf);
	gl.uniformMatrix4fv(this.prog.mvMatrixUniform, false, this.mvMatrix);
	gl.drawElements(gl.TRIANGLES, this.indexBuf.numItems, gl.UNSIGNED_SHORT, 0);
};
