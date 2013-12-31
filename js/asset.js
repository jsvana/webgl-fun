var AssetManager = (function() {
	var instance;

	var AssetManager = function() {
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

	AssetManager.prototype.textureDimentions = function(texture) {
		if (!this.textures[texture]) {
			return null;
		}

		return {
			w: this.textures[texture].image.width,
			h: this.textures[texture].image.height
		};
	};

	AssetManager.prototype.loadTexture = function(gl, name, load) {
		var tex = gl.createTexture();
		tex.image = new Image();
		if (typeof load === "function") {
			tex.image.onload = function() {
				load(gl, tex);
			};
		} else {
			tex.image.onload = function() {
				storeImage(gl, name, tex);
			};
		}
		tex.image.src = name;
	};

	AssetManager.prototype.loadList = function(gl, list, callback) {
		var count = 0;

		for (var tex in list) {
			console.log('Loading ' + list[tex]);
			this.loadTexture(gl, list[tex], function(gl, texture) {
				storeImage(gl, list[tex], texture);
				count++;
				if (count === list.length) {
					callback();
				}
			});
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
