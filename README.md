# A-Frame `gamepad-controls` Component

Gamepad controls for A-Frame VR.

## Overview

Supports one or more gamepads, attached to an A-Frame scene.

This component uses the HTML5 [Gamepad API](https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API). The underlying API supports Firefox, Chrome, Edge, and Opera ([as of 01/2016](http://caniuse.com/#search=gamepad)). Safari and Internet Explorer do not currently support gamepads.

## Usage (script)

```html
<html>
  <head>
    <!-- A-Frame VR Library -->
    <script src="https://aframe.io/releases/latest/aframe.js"></script>

    <!-- Component -->
    <script src="dist/aframe-gamepad-controls.js"></script>
  </head>
  <body>
    <a-scene>
      <!-- ... -->
      <a-entity camera gamepad-controls></a-entity>
    </a-scene>
  </body>
</html>
```

## Usage (NPM)

Install NPM module.

```
$ npm install aframe-gamepad-controls
```

Register `gamepad-controls` component.

```javascript
var AFRAME = require('aframe-core');
var GamepadControls = require('aframe-gamepad-controls');
AFRAME.registerComponent('gamepad-controls', GamepadControls);
```

Add markup.

```html
<!-- First-person controls -->
<a-entity camera gamepad-controls></a-entity>

<!-- Third-person controls -->
<a-cube gamepad-controls="lookEnabled: false"></a-cube>

<!-- Two players -->
<a-model src="player1.obj" gamepad-controls="controller: 0; lookEnabled: false"></a-model>
<a-model src="player2.obj" gamepad-controls="controller: 1; lookEnabled: false"></a-model>
```

## Button Events

When buttons are pressed on the gamepad, a [GamepadButtonEvent](https://github.com/donmccurdy/aframe-gamepad-controls/blob/master/lib/GamepadButtonEvent.js) is emitted on the element. Components and entities may listen for these events and modify behavior as needed. Example:

```javascript
el.addEventListener('gamepadbuttondown', function (e) {
  console.log('Button "%d" has been pressed.', e.index);
});
```

**GamepadButtonEvent:**

Property | Type    | Description
---------|---------|--------------
type     | string  | Either `gamepadbuttondown` or `gamepadbuttonup`.
index    | int     | Index of the button affected, 0..N.
pressed  | boolean | Whether or not the button is currently pressed.
value    | float   | Distance the button was pressed, if applicable. Value will be 0 or 1 in most cases, but may return a float on the interval [0..1] for trigger-like buttons.

**Markup-only Binding:**

For convenience, additional events are fired including the button index, providing a way to bind events to specific buttons using only markup. To play `pew-pew.wav` when `Button 7` is pressed (right trigger on an Xbox controller), you might do this:

```html
<a-entity gamepad-controls
          sound="src: pew-pew.wav;
                 on: gamepadbuttondown:7">
</a-entity>
```

Finally, your code may call the `gamepad-controls` component directly to request the state of a button, as a [GamepadButton](https://developer.mozilla.org/en-US/docs/Web/API/GamepadButton) instance:

```javascript
el.components['gamepad-controls'].getButton(index);
// Returns a GamepadButton instance.
```

## Options

Property          | Default | Description
------------------|---------|-------------
controller        | 0       | Which controller (0..3) the object should be attached to.
enabled           | true    | Enables all events on this controller.
movementEnabled   | true    | Enables movement via the left thumbstick.
lookEnabled       | true    | Enables view rotation via the right thumbstick.
flyEnabled        | false   | Whether or not movement is restricted to the entity’s initial plane.
debug             | false   | When true, shows debugging info in the console.
