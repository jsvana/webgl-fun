var AssetManager = (function() {
	var instance;

	var AssetManager = function() {
		this.maps = {};
		this.shaders = {};
		this.textures = {};
	};

	var storeImage = function(gl, name, texture) {
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
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

	AssetManager.prototype.getMap = function(name) {
		return this.maps[name];
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

	AssetManager.prototype.loadMap = function(name, load) {
		$.getJSON(name, function(data) {
			load(name, data);
		});
	};

	AssetManager.prototype.loadShader = function(name, load) {
		$.get(name, function(data) {
			load(name, data);
		}, 'text');
	};

	AssetManager.prototype.loadList = function(gl, assets, callback, progress) {
		var count = 0;
		var total = 0;
		var self = this;

		if (assets.maps) {
			total += assets.maps.length;
		}
		if (assets.shaders) {
			total += assets.shaders.length;
		}
		if (assets.textures) {
			total += assets.textures.length;
		}

		if (assets.textures) {
			for (var tex in assets.textures) {
				this.loadTexture(gl, assets.textures[tex], function(gl, name, texture) {
					storeImage(gl, name, texture);

					count++;
					if (progress) {
						progress(count, total);
					}
					if (count === total) {
						callback();
					}
				});
			}
		}

		if (assets.maps) {
			for (var m in assets.maps) {
				this.loadMap(assets.maps[m], function(name, data) {
					self.maps[name] = data;

					count++;
					if (progress) {
						progress(count, total);
					}
					if (count === total) {
						callback();
					}
				});
			}
		}

		if (assets.shaders) {
			for (var s in assets.shaders) {
				this.loadShader(assets.shaders[s], function(name, data) {
					self.shaders[name] = data;

					count++;
					if (progress) {
						progress(count, total);
					}
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
