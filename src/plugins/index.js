import { detectBrowserEngine, detectOS } from '../detection';
import chromePlugin from './chromePlugin';
import windowsPlugin from './windowsPlugin';
import nonCriticalPlugin from './nonCriticalPlugin';

export function loadPluginsBasedOnDetection() {
  const browserEngine = detectBrowserEngine();
  const os = detectOS();

  if (browserEngine === 'Blink' || browserEngine.includes('Chrome')) {
    chromePlugin.applyChromeSpecificFeatures();
  }

  if (os === 'Windows 10') {
    windowsPlugin.applyWindowsSpecificFeatures();
  }

  nonCriticalPlugin.applyNonCriticalFeatures();
}
