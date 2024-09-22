import { applyPolyfills } from '../polyfills/index.js';
const { detectBrowserEngine } = require('./detection');

const UniversalBrowserEngine = () => {
  const engine = detectBrowserEngine();
  console.log(`Detected engine: ${engine}`);

  applyPolyfills(engine);

  console.log('Universal Browser Engine initialized successfully.');
};

export default UniversalBrowserEngine;
