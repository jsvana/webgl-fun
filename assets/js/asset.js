var AssetManager = (function() {
	var instance;

	var AssetManager = function() {
		this.json = {};
		this.shaders = {};
		this.textures = {};
	};

	var storeImage = function(gl, name, texture) {
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
		gl.bindTexture(gl.TEXTURE_2D, null);

		instance.textures[name] = texture;
	};

	AssetManager.prototype.useTexture = function(gl, texture) {
		gl.bindTexture(gl.TEXTURE_2D, this.textures[texture]);
	};

	AssetManager.prototype.textureDimensions = function(texture) {
		if (!this.textures[texture]) {
			return null;
		}

		return {
			w: this.textures[texture].image.width,
			h: this.textures[texture].image.height
		};
	};

	AssetManager.prototype.getJSON = function(name) {
		return this.json[name];
	};

	AssetManager.prototype.getShader = function(name) {
		return this.shaders[name];
	};

	AssetManager.prototype.getTexture = function(name) {
		return this.textures[name];
	};

	AssetManager.prototype.loadTexture = function(gl, name, load) {
		var tex = gl.createTexture();
		tex.image = new Image();
		tex.image.onload = function() {
			if (load) {
				load(gl, name, tex);
			} else {
				storeImage(gl, name, tex);
			}
		};
		tex.image.onerror = function() {
			console.log('Error loading ' + name);
		};
		tex.image.src = name;
	};

	AssetManager.prototype.loadJSON = function(name, load) {
		$.getJSON(name, function(data) {
			load(name, data);
		});
	};

	AssetManager.prototype.loadShader = function(name, load) {
		$.get(name, function(data) {
			load(name, data);
		}, 'text');
	};

	AssetManager.prototype.loadList = function(gl, assets, callback) {
		var count = 0;
		var total = 0;
		var self = this;

		if (assets.json) {
			total += assets.json.length;
		}
		if (assets.shaders) {
			total += assets.shaders.length;
		}
		if (assets.textures) {
			total += assets.textures.length;
		}

		if (assets.textures) {
			for (var tex in assets.textures) {
				console.log('Loading ' + assets.textures[tex]);
				this.loadTexture(gl, assets.textures[tex], function(gl, name, texture) {
					storeImage(gl, name, texture);
					count++;
					if (count === total) {
						callback();
					}
				});
			}
		}

		if (assets.json) {
			for (var j in assets.json) {
				console.log('Loading ' + assets.json[j]);
				this.loadJSON(assets.json[j], function(name, data) {
					self.json[name] = data;
					count++;
					if (count === total) {
						callback();
					}
				});
			}
		}

		if (assets.shaders) {
			for (var s in assets.shaders) {
				console.log('Loading ' + assets.shaders[s]);
				this.loadShader(assets.shaders[s], function(name, data) {
					self.shaders[name] = data;
					count++;
					if (count === total) {
						callback();
					}
				});
			}
		}
	};

	return {
		getInstance: function() {
			if (!instance) {
				instance = new AssetManager();
			}
			return instance;
		}
	};
})();
