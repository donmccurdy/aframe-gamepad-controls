# A-Frame `gamepad-controls` Component

Gamepad controls for A-Frame VR.

## Overview

Supports one or more gamepads or game controllers, attached to an A-Frame scene.

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
<a-model src="player1.dae" gamepad-controls="controller: 0; lookEnabled: false"></a-model>
<a-model src="player2.dae" gamepad-controls="controller: 1; lookEnabled: false"></a-model>
```

## Options

Property          | Default | Description
------------------|---------|-------------
controller        | 0       | Which controller (0..3) the object should be attached to.
enabled           | true    | Enables/disables all events on this controller.
movementEnabled   | true    | Enables/disables movement via the left thumbstick.
lookEnabled       | true    | Enables/disables view rotation via the right thumbstick.
flyEnabled        | false   | Enables/disable movement off the horizontal plane.
debug             | false   | Enables/disables debug logging to the console.
