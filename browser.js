
// Browser distrubution of the A-Frame component.
(function (AFRAME) {
	if (!AFRAME) {
		console.error('Component attempted to register before AFRAME was available.');
		return;
	}

	// Register all components here.
	var components = {
		'gamepad-controls': require('./gamepad-controls')
	};

	Object.keys(components).forEach(function (name) {
		if (AFRAME.aframeCore) {
			AFRAME.aframeCore.registerComponent(name, components[name]);
		} else {
			AFRAME.registerComponent(name, components[name]);
		}
	});
}(window.AFRAME));
