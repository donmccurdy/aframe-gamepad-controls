var Aframe = require('aframe-core');
var component = require('../gamepad-controls');
var entityFactory = require('./helpers').entityFactory;

Aframe.registerComponent('gamepad-controls', component);

var gamepad,
	ctrl;

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
		this.sinon.stub(navigator, 'getGamepads').returns([gamepad]);
	});

	beforeEach(function (done) {
		this.el = entityFactory();
		this.el.setAttribute('gamepad-controls', '');
		this.el.addEventListener('loaded', function () {
			ctrl = this.el.components['gamepad-controls'];
			done();
		}.bind(this));
	});

	describe('Accessors', function () {
		it('detects a gamepad', function () {
			expect(ctrl.getGamepad()).to.equal(gamepad);
			expect(ctrl.isConnected()).to.be.true;
		});

		it('returns gamepad ID', function () {
			expect(ctrl.getID()).to.equal('test-gamepad');
		});

		it('returns joystick state', function () {
			var joystick0 = ctrl.getJoystick(0);
			expect(joystick0.x).to.equal(0);
			expect(joystick0.y).to.equal(0);
		});

		it('returns dpad state', function () {
			var dpad = ctrl.getDpad();
			expect(dpad.x).to.equal(0);
			expect(dpad.y).to.equal(0);
		});
	});

	describe('Movement', function () {
		it.skip('moves object up/down/right/left with stick0', function () {
			// TODO
		});

		it.skip('moves object up/down/right/left with dpad', function () {
			// TODO
		});
	});

	describe('Rotation', function () {
		it('supports lookEnabled:true (default)', function () {
			expect(ctrl.isLookEnabled()).to.be.true;
		});

		it('supports lookEnabled:false', function () {
			this.el.setAttribute('gamepad-controls', 'lookEnabled: false');
			expect(ctrl.isLookEnabled()).to.be.false;
		});

		it('supports lookEnabled:auto', function () {
			this.el.setAttribute('gamepad-controls', 'lookEnabled: auto');
			expect(ctrl.isLookEnabled()).to.be.true;
			this.el.components['look-controls'] = true;
			expect(ctrl.isLookEnabled()).to.be.true;
			document.fullscreen = true;
			expect(ctrl.isLookEnabled()).to.be.false;
			delete this.el.components['look-controls'];
			expect(ctrl.isLookEnabled()).to.be.true;
		});
	});

	describe('Movement + Rotation', function () {
		it.skip('moves relative to post-rotation heading', function () {
			// TODO
		});
	});

});
