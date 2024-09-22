export function applyPolyfills(engine) {
  if (engine === 'Trident') {
    console.log('Applying polyfills for IE (Trident engine)');

    loadIEPolyfills();
  } else if (engine === 'Gecko') {
    console.log('Applying polyfills for Gecko (Firefox engine)');

    loadFirefoxPolyfills();
  } else if (engine === 'Blink') {
    console.log('Applying polyfills for Blink (Chrome, Edge)');

    loadBlinkPolyfills();
  } else if (engine === 'WebKit') {
    console.log('Applying polyfills for WebKit (Safari engine)');

    loadWebKitPolyfills();
  } else {
    console.log('No polyfills needed for this engine.');
  }
}

function loadIEPolyfills() {}

function loadFirefoxPolyfills() {}

function loadBlinkPolyfills() {}

function loadWebKitPolyfills() {}
