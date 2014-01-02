var ShaderManager = (function() {
	var instance;

	var ShaderManager = function() {
		this.vertShaders = {};
		this.fragShaders = {};
		this.programs = {};
		this.currentProg = '';
	};

	ShaderManager.prototype.loadShader = function(gl, shader) {
		var shaderScript = document.getElementById(shader);
		if (!shaderScript) {
			return null;
		}

		var str = '';
		var k = shaderScript.firstChild;
		while (k) {
			if (k.nodeType == 3) {
				str += k.textContent;
			}
			k = k.nextSibling;
		}

		var s;
		if (shaderScript.type === 'x-shader/x-fragment') {
			this.fragShaders[shader] = gl.createShader(gl.FRAGMENT_SHADER);
			s = this.fragShaders[shader];
		} else if (shaderScript.type === 'x-shader/x-vertex') {
			this.vertShaders[shader] = gl.createShader(gl.VERTEX_SHADER);
			s = this.vertShaders[shader];
		} else {
			return null;
		}

		gl.shaderSource(s, str);
		gl.compileShader(s);

		if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
			console.log(gl.getShaderInfoLog(s));
			return null;
		}

		return s;
	};

	ShaderManager.prototype.addUniform = function(gl, program, uniform) {
		var p = this.programs[program];

		p[uniform] = gl.getUniformLocation(p, uniform);

		this.programs[program] = p;

		return p;
	};

	ShaderManager.prototype.createProgram
			= function(gl, vertex, fragment, program) {
		if (!this.vertShaders[vertex]) {
			console.log('Loading vertex shader ' + vertex);
			var v = this.loadShader(gl, vertex);
		} else {
			var v = this.vertShaders[vertex];
		}
		if (!this.fragShaders[fragment]) {
			console.log('Loading fragment shader ' + fragment);
			var f = this.loadShader(gl, fragment);
		} else {
			var f = this.fragShaders[fragment];
		}

		this.programs[program] = gl.createProgram();
		var p = this.programs[program];
		gl.attachShader(p, v);
		gl.attachShader(p, f);
		gl.linkProgram(p);

		if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
			console.log('Could not initialise shaders');
		}

		p.vertexPositionAttribute = gl.getAttribLocation(p, 'aVertexPosition');
		gl.enableVertexAttribArray(p.vertexPositionAttribute);

		p.textureCoordAttribute = gl.getAttribLocation(p, 'aTextureCoord');
		gl.enableVertexAttribArray(p.textureCoordAttribute);

		this.addUniform(gl, program, 'uPMatrix');
		this.addUniform(gl, program, 'uMVMatrix');
		this.addUniform(gl, program, 'uSampler');

		this.programs[program] = p;

		return p;
	};

	ShaderManager.prototype.useProgram = function(gl, program) {
		if (!program) {
			this.currentProg = '';
		} else {
			this.currentProg = program;
			var p = this.programs[program];
			gl.useProgram(p);
			return p;
		}
	};

	ShaderManager.prototype.getProgram = function(program) {
		return this.programs[program];
	};

	ShaderManager.prototype.getCurrentProgram = function() {
		return this.programs[this.currentProg];
	};

	ShaderManager.prototype.eachProgram = function(func) {
		for (var p in this.programs) {
			func(p, this.programs[p]);
		}
	};

	return {
		getInstance: function() {
			if (!instance) {
				instance = new ShaderManager();
			}
			return instance;
		}
	};
})();
