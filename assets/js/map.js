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
				data.map.data[i][j], data.map.walkability[data.map.data[i][j]]));
		}
		this.tiles.push(r);
	}
};

Map.prototype.walkable = function(x, y) {
	return this.tiles[y + this.currentRoom.y * this.roomHeight]
		[x + this.currentRoom.x * this.roomWidth].walkable
};

Map.prototype.getTile = function(x, y) {
	return this.tiles[y][x];
};

Map.prototype.moveEntity = function(ent, move) {
	var pos = ent.position;
	var mX = 0;
	var mY = 0;

	if (pos.x !== 0 && move.x < 0 && this.walkable(pos.x - 1, pos.y)) {
		mX = -1;
	} else if (pos.x !== this.roomWidth - 1 && move.x > 0
			&& this.walkable(pos.x + 1, pos.y)) {
		mX = 1;
	}

	if (pos.y !== 0 && move.y < 0 && this.walkable(pos.x, pos.y - 1)) {
		mY = -1;
	} else if (pos.y !== this.roomWidth - 1 && move.y > 0
			&& this.walkable(pos.x, pos.y + 1)) {
		mY = 1;
	}

	if (mX !== 0) {
		ent.move(mX, 0);
	} else if (mY !== 0) {
		ent.move(0, mY);
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
