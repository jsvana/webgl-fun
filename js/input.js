var Key = {
	_pressed: {},

	LEFT: 37,
	UP: 38,
	RIGHT: 39,
	DOWN: 40,

	W: 87,
	A: 65,
	S: 83,
	D: 68,

	isDown: function(key) {
		if (typeof key === 'string') {
			return this._pressed[key.charCodeAt(0)];
		} else {
			return this._pressed[key];
		}
	},

	onKeydown: function(event) {
		this._pressed[event.keyCode] = true;
	},

	onKeyup: function(event) {
		delete this._pressed[event.keyCode];
	}
};