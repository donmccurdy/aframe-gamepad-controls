var AFRAME = require('aframe');
var component = require('../gamepad-controls');
var entityFactory = require('./helpers').entityFactory;

AFRAME.registerComponent('gamepad-controls', component);

describe('Gamepad Controls', function () {

	/*******************************************************************
	* Setup
	*/

	var GamepadButton = component.GamepadButton,
		EPS = 1e-6;

	var gamepad, ctrl;

	beforeEach(function () {
		// Mock gamepad
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

	/*******************************************************************
	* Tests
	*/

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
		it('moves object up/down/right/left with stick0', function () {
			gamepad.axes = [0, 1, 0, 0];
			ctrl.updatePosition(100);
			expect(this.el.object3D.position.z).to.equal(0.65);

			gamepad.axes = [1, 0, 0, 0];
			ctrl.updatePosition(1);
			expect(Math.abs(this.el.object3D.position.x - 0.000065)).to.be.below(EPS);
			expect(Math.abs(this.el.object3D.position.z - 0.65637)).to.be.below(EPS);
		});

		it('moves object up/down/right/left with dpad', function () {
			gamepad.buttons[GamepadButton.DPAD_DOWN] = {pressed: true, value: 1};
			ctrl.updatePosition(100);
			expect(this.el.object3D.position.z).to.equal(0.65);

			gamepad.buttons[GamepadButton.DPAD_DOWN] = {pressed: false, value: 0};
			gamepad.buttons[GamepadButton.DPAD_RIGHT] = {pressed: true, value: 1};
			ctrl.updatePosition(1);
			expect(Math.abs(this.el.object3D.position.x - 0.000065)).to.be.below(EPS);
			expect(Math.abs(this.el.object3D.position.z - 0.65637)).to.be.below(EPS);
		});
	});

	describe.skip('Rotation', function () {
		it('supports lookEnabled:auto (default)', function () {
			// Look controls should be enabled only when VR mode is active AND
			// there is a 'look-controls' instance on the element.
			this.el.setAttribute('gamepad-controls', '');
			expect(ctrl.isLookEnabled()).to.be.true;
			this.el.components['look-controls'] = true;
			expect(ctrl.isLookEnabled()).to.be.true;
			document.fullscreen = true;
			expect(ctrl.isLookEnabled()).to.be.false;
			delete this.el.components['look-controls'];
			expect(ctrl.isLookEnabled()).to.be.true;
		});

		it('supports lookEnabled:true', function () {
			this.el.setAttribute('gamepad-controls', 'lookEnabled: true');
			expect(ctrl.isLookEnabled()).to.be.true;
			this.el.components['look-controls'] = true;
			document.fullscreen = true;
			expect(ctrl.isLookEnabled()).to.be.true;
			delete this.el.components['look-controls'];
		});

		it('supports lookEnabled:false', function () {
			this.el.setAttribute('gamepad-controls', 'lookEnabled: false');
			expect(ctrl.isLookEnabled()).to.be.false;
		});
	});

	describe('Movement + Rotation', function () {
		it('moves relative to post-rotation heading', function () {
			this.el.setAttribute('rotation', {x: 0, y: 90, z: 0});
			gamepad.buttons[GamepadButton.DPAD_DOWN] = {pressed: true, value: 1};
			ctrl.updatePosition(100);
			expect(this.el.object3D.position.z).to.be.within(-EPS, +EPS);
			expect(Math.abs(this.el.object3D.position.x - 0.65)).to.be.below(EPS);
		});
	});

});
