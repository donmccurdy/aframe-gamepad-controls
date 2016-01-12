var Aframe = require('aframe-core');
var component = require('../gamepad-controls');
var entityFactory = require('./helpers').entityFactory;

Aframe.registerComponent('gamepad-controls', component);

var gamepad,
	gamepadControls;
navigator.getGamepads = function () { return [gamepad]; };

describe('Gamepad Controls', function () {

	beforeEach(function () {
		gamepad = {
			axes: [0, 0, 0, 0],
			buttons: '.................'.split('.').map(function () {
				return { pressed: 0, value: 0 };
			}),
			connected: true,
			id: 'test-gamepad'
		};
	});

	beforeEach(function (done) {
		this.el = entityFactory();
		this.el.setAttribute('gamepad-controls', '');
		this.el.addEventListener('loaded', function () {
			gamepadControls = this.el.components['gamepad-controls'];
			done();
		}.bind(this));
	});

	describe('Gamepad Controls accessors', function () {
		it('detects a gamepad', function () {
			assert.equal(gamepadControls.getGamepad(), gamepad);
		});

		it('returns gamepad ID', function () {
			assert.equal(gamepadControls.getID(), 'test-gamepad');
		});

		it('returns joystick state', function () {
			var joystick0 = gamepadControls.getJoystick(0);
			assert.equal(joystick0.x, 0);
			assert.equal(joystick0.y, 0);
		});

	});
});
