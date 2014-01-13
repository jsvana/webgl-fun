(function() {
	var manhattanDistance = function(p, q) {
		return Math.abs(p.position.x - q.position.x)
			+ Math.abs(p.position.y - q.position.y);
	};

	var listContains = function(list, tile) {
		for (var i in list) {
			if (list[i].tile === tile) {
				return true;
			}
		}
		return false;
	};

	var listRemove = function(list, tile) {
		for (var i = 0; i < list.length; i++) {
			if (list[i] === tile) {
				return list.slice(i, i + 1);
			}
		}
		return list;
	};

	var adjacentTiles = function(map, closed, end, tile) {
		var location = tile.tile.position;
		var adjacencies = [];
		var adjTile;
		var gScore = tile.gScore + 1;

		if (location.x > 0) {
			adjTile = map.tiles[location.y][location.x - 1];
			var hScore = manhattanDistance(adjTile, end);
			if (!listContains(closed, adjTile)) {
				adjacencies.push({
					parent: tile,
					tile: adjTile,
					fScore: gScore + hScore,
					gScore: gScore,
					hScore: hScore
				});
			}
		}

		if (location.x < map.tiles[0].length - 1) {
			adjTile = map.tiles[location.y][location.x + 1];
			var hScore = manhattanDistance(adjTile, end);
			if (!listContains(closed, adjTile)) {
				adjacencies.push({
					parent: tile,
					tile: adjTile,
					fScore: gScore + hScore,
					gScore: gScore,
					hScore: hScore
				});
			}
		}
		if (location.y > 0) {
			adjTile = map.tiles[location.y - 1][location.x];
			var hScore = manhattanDistance(adjTile, end);
			if (!listContains(closed, adjTile)) {
				adjacencies.push({
					parent: tile,
					tile: adjTile,
					fScore: gScore + hScore,
					gScore: gScore,
					hScore: hScore
				});
			}
		}
		if (location.y < map.tiles.length - 1) {
			adjTile = map.tiles[location.y + 1][location.x];
			var hScore = manhattanDistance(adjTile, end);
			if (!listContains(closed, adjTile)) {
				adjacencies.push({
					parent: tile,
					tile: adjTile,
					fScore: gScore + hScore,
					gScore: gScore,
					hScore: hScore
				});
			}
		}

		return adjacencies;
	};

	var pathRec = function(map, start, end, open, closed) {
		if (open.empty()) {
			return [];
		}

		var tile = open.pop();
		closed.push(tile);

		if (tile.tile === end) {
			var path = [ end ];
			// TODO: construct path from end
			while (tile.parent) {
				tile = tile.parent;
				path.unshift(tile.tile);
			}
			path.shift();
			return path;
		}

		var adjacencies = adjacentTiles(map, closed, end, tile);

		for (var i in adjacencies) {
			if (open.includes(adjacencies[i])) {
				var oldGScore = adjacencies[i].gScore;
				var newGScore = tile.gScore + 1;
				if (newGScore < oldGScore) {
					open.remove(adjacencies[i]);
					adjacencies[i].parent = tile;
					adjacencies[i].gScore = newGScore;
					adjacencies[i].fScore = newGScore + adjacencies[i].hScore;
					open.push(adjacencies[i], adjacencies[i].fScore);
				}
			} else {
				open.push(adjacencies[i], adjacencies[i].fScore);
			}
		}

		open = listRemove(open, tile);

		return pathRec(map, start, end, open, closed);
	};

	Util = {
		AStar: {
			path: function(map, start, end) {
				var open = new PriorityQueue({low: true});
				var firstFScore = manhattanDistance(start, end);
				var first = {
					tile: start,
					fScore: firstFScore,
					gScore: 0,
					hScore: firstFScore
				};
				open.push(first, manhattanDistance(start, end));
				var closed = [];

				return pathRec(map, start, end, open, closed);
			}
		}
	};
})();
