var Map = function(map) {
	this.loadMap(map);
};

Map.prototype.loadMap = function(map) {
	var data = AssetManager.getInstance().getMap('assets/maps/' + map + '.json');

	this.width = data.map.width;
	this.height = data.map.height;
	this.roomWidth = data.map.roomWidth;
	this.roomHeight = data.map.roomHeight;
	this.currentRoom = data.map.currentRoom;

	this.tiles = [];
	for (var i = 0; i < this.height * this.roomHeight; i++) {
		var r = [];
		for (var j = 0; j < this.width * this.roomWidth; j++) {
			r.push(new Tile(gl, { x: j % this.roomWidth, y: i % this.roomHeight},
				data.map.data[i][j]));
		}
		this.tiles.push(r);
	}
};

Map.prototype.changeRoom = function(dir) {
	if (dir === Direction.UP && this.currentRoom.y > 0) {
		this.currentRoom.y--;
	}
	if (dir === Direction.DOWN && this.currentRoom.y < this.height - 1) {
		this.currentRoom.y++;
	}
	if (dir === Direction.LEFT && this.currentRoom.x > 0) {
		this.currentRoom.x--;
	}
	if (dir === Direction.RIGHT && this.currentRoom.x < this.width - 1) {
		this.currentRoom.x++;
	}
};

Map.prototype.render = function(gl) {
	for (var i = 0; i < this.roomHeight; i++) {
		for (var j = 0; j < this.roomWidth; j++) {
			this.tiles[this.currentRoom.y * this.roomHeight + i]
				[this.currentRoom.x * this.roomWidth + j].render(gl);
		}
	}
};
