var Camera = function(gl, pos, dim) {
	if (pos) {
		this.position = pos;
	} else {
		this.position = {
			x: 0,
			y: 0
		};
	}

	if (dim) {
		this.dimensions = dim;
	} else {
		this.dimensions = {
			w: 100,
			h: 100
		};
	}

	this.proj = mat4.create();

	this.updateProjection(gl);
};

Camera.prototype.move = function(gl, pos) {
	this.position.x += pos.x;
	this.position.y += pos.y;
	this.updateProjection(gl);
};

Camera.prototype.setPosition = function(gl, pos) {
	this.position = pos;
	this.updateProjection(gl);
};

Camera.prototype.resize = function(gl, dim) {
	this.dimensions = dim;
	this.updateProjection(gl);
};

Camera.prototype.updateProjection = function(gl) {
	mat4.ortho(this.proj, -this.position.x,
		this.dimensions.w - this.position.x, -this.position.y,
		this.dimensions.h - this.position.y, -1, 1);
	var self = this;
	var shaderman = ShaderManager.getInstance();
	shaderman.eachProgram(function(name, prog) {
		shaderman.useProgram(gl, name);
		gl.uniformMatrix4fv(prog.uPMatrix, false, self.proj);
	});
};
