var Key = {
	_pressed: {},
	_downEvents: {},
	_upEvents: {},

	LEFT: 37,
	UP: 38,
	RIGHT: 39,
	DOWN: 40,

	A: 65,
	B: 66,
	C: 67,
	D: 68,
	E: 69,
	F: 70,
	G: 71,
	H: 72,
	I: 73,
	J: 74,
	K: 75,
	L: 76,
	M: 77,
	N: 78,
	O: 79,
	P: 80,
	Q: 81,
	R: 82,
	S: 83,
	T: 84,
	U: 85,
	V: 86,
	W: 87,
	X: 88,
	Y: 89,
	Z: 90,

	isDown: function(key) {
		if (typeof key === 'string') {
			return this._pressed[key.charCodeAt(0)];
		} else {
			return this._pressed[key];
		}
	},

	addDownEvent: function(key, func) {
		this._downEvents[key] = func;
	},

	addUpEvent: function(key, func) {
		this._upEvents[key] = func;
	},

	onKeydown: function(event) {
		this._pressed[event.keyCode] = true;
		if (this._downEvents[event.keyCode]) {
			this._downEvents[event.keyCode](event);
		}
	},

	onKeyup: function(event) {
		delete this._pressed[event.keyCode];
		if (this._upEvents[event.keyCode]) {
			this._upEvents[event.keyCode](event);
		}
	}
};

var Direction = {
	LEFT: 0,
	RIGHT: 1,
	UP: 2,
	DOWN: 3
};
