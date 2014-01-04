var Map = function(gl) {
	var data = AssetManager.getInstance().getJSON('assets/json/map.json');
	this.tiles = [];
	for (var i = 0; i < 15; i++) {
		var r = [];
		for (var j = 0; j < 20; j++) {
			r.push(new Tile(gl, { x: j, y: i }, data.map.data[i][j]));
		}
		this.tiles.push(r);
	}
	console.log('Map created');
};

Map.prototype.render = function(gl) {
	for (var i = 0; i < 15; i++) {
		for (var j = 0; j < 20; j++) {
			this.tiles[i][j].render(gl);
		}
	}
};
