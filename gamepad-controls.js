/**
 * Gamepad controls for A-Frame VR.
 */

var MAX_DELTA = 0.2;

var JOYSTICK_EPS = 0.1,
    JOYSTICK_L_X = 0,
    JOYSTICK_L_Y = 1,
    JOYSTICK_R_X = 2,
    JOYSTICK_R_Y = 3;

module.exports = {
  dependencies: ['proxy-controls'],

  schema: {
    // Controller 0-3
    controller:        { default: 0, oneOf: [0, 1, 2, 3] },
    
    // Constants
    easing:            { default: 20 },
    acceleration:      { default: 65 },
    
    // Enable/disable features
    enabled:           { default: true },
    movementEnabled:   { default: true },
    lookEnabled:       { default: false },
    flyEnabled:        { default: false },
    
    // Control axes
    pitchAxis:         { default: 'x', oneOf: [ 'x', 'y', 'z' ] },
    yawAxis:           { default: 'y', oneOf: [ 'x', 'y', 'z' ] },
    rollAxis:          { default: 'z', oneOf: [ 'x', 'y', 'z' ] },
    
    // Debugging
    debug:             { default: false }
  },

  /**
   * Called once when component is attached. Generally for initial setup.
   */
  init: function () {
    var scene = this.el.sceneEl;
    this.prevTime = Date.now();
    this.velocity = new THREE.Vector3();
    this.direction = new THREE.Vector3(0, 0, 0);
    this.rotation = new THREE.Euler(0, 0, 0, 'YXZ');
    scene.addBehavior(this);
  },

  /**
   * Called when component is attached and when component data changes.
   * Generally modifies the entity based on the data.
   */
  update: function (previousData) {
    var data = this.data;
    var acceleration = data.acceleration;
    var easing = data.easing;
    var velocity = this.velocity;
    var time = window.performance.now();
    var delta = (time - this.prevTime) / 1000;
    var rollAxis = data.rollAxis;
    var pitchAxis = data.pitchAxis;
    var el = this.el;
    var gamepad = navigator.getGamepads()[data.controller];
    this.prevTime = time;

    // If data has changed or FPS is too low
    // we reset the velocity
    if (previousData || delta > MAX_DELTA) {
      velocity[rollAxis] = 0;
      velocity[pitchAxis] = 0;
      return;
    }

    velocity[rollAxis] -= velocity[rollAxis] * easing * delta;
    velocity[pitchAxis] -= velocity[pitchAxis] * easing * delta;

    var position = el.getComputedAttribute('position');

    if (data.enabled && gamepad) {
      if (data.movementEnabled) {
        if (gamepad.axes[JOYSTICK_L_X] > JOYSTICK_EPS) {
          velocity[rollAxis] += gamepad.axes[JOYSTICK_L_X] * acceleration * delta;
        }
        if (gamepad.axes[JOYSTICK_L_Y] > JOYSTICK_EPS) {
          velocity[pitchAxis] += gamepad.axes[JOYSTICK_L_Y] * acceleration * delta;
        }
      }
      if (data.lookEnabled) {
        console.warn('gamepad-controls: Look control not yet implemented.');
      }
    }

    var movementVector = this.getMovementVector(delta);

    el.object3D.translateX(movementVector.x);
    el.object3D.translateY(movementVector.y);
    el.object3D.translateZ(movementVector.z);

    el.setAttribute('position', {
      x: position.x + movementVector.x,
      y: position.y + movementVector.y,
      z: position.z + movementVector.z
    });
  },

  getMovementVector: function (delta) {
    var elRotation = this.el.getAttribute('rotation');
    this.direction.copy(this.velocity);
    this.direction.multiplyScalar(delta);
    if (!elRotation) { return this.direction; }
    if (!this.data.flyEnabled) { elRotation.x = 0; }
    this.rotation.set(
      THREE.Math.degToRad(elRotation.x),
      THREE.Math.degToRad(elRotation.y),
      0
    );
    this.direction.applyEuler(this.rotation);
    return this.direction;
  },

  /**
   * Called when a component is removed (e.g., via removeAttribute).
   * Generally undoes all modifications to the entity.
   */
  remove: function () { }
};