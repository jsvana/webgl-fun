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

	this.walkability = data.map.walkability;

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

Map.prototype.moveEntity = function(ent, move) {
	var pos = ent.position;
	var info = 'Position: (' + Math.floor(pos.x) + ', '
		+ Math.floor(pos.y) + ')' + ', Move: (' + move.x + ', ' + move.y
		+ ')';

	$('#data').html(info);

	var newPos = {
		x: Math.floor(pos.x + move.x),
		y: Math.floor(pos.y + move.y)
	};

	if (newPos.x !== Math.floor(pos.x)) {
		if (newPos.x < 0) {
			ent.position.x = 0;
		} else {
			ent.position.x += move.x;
		}
	} else {
		if (pos.x >= this.roomWidth - 1 && move.x > 0) {
			ent.position.x = this.roomWidth - 1;
		} else {
			ent.position.x += move.x;
		}
	}

	if (newPos.y !== Math.floor(pos.y)) {
		if (newPos.y < 0) {
			ent.position.y = 0;
		} else {
			ent.position.y += move.y;
		}
	} else {
		if (pos.y >= this.roomHeight - 1 && move.y > 0) {
			ent.position.y = this.roomHeight - 1;
		} else {
			ent.position.y += move.y;
		}
	}

	return move;
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
