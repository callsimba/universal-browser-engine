import { loadPluginsBasedOnDetection } from '../src/plugins';
import { detectBrowserEngine, detectOS } from '../src/detection';
import chromePlugin from '../src/plugins/chromePlugin';
import windowsPlugin from '../src/plugins/windowsPlugin';
import nonCriticalPlugin from '../src/plugins/nonCriticalPlugin';

jest.mock('../src/detection');
jest.mock('../src/plugins/chromePlugin', () => ({
  applyChromeSpecificFeatures: jest.fn(),
}));
jest.mock('../src/plugins/windowsPlugin', () => ({
  applyWindowsSpecificFeatures: jest.fn(),
}));
jest.mock('../src/plugins/nonCriticalPlugin', () => ({
  applyNonCriticalFeatures: jest.fn(),
}));

describe('Plugin Loading without lazyLoad', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('should load Chrome and Windows plugins for Blink engine and Windows 10 OS', () => {
    detectBrowserEngine.mockReturnValue('Blink');
    detectOS.mockReturnValue('Windows 10');

    loadPluginsBasedOnDetection();

    expect(chromePlugin.applyChromeSpecificFeatures).toHaveBeenCalled();
    expect(windowsPlugin.applyWindowsSpecificFeatures).toHaveBeenCalled();
  });

  test('should not load Windows plugin if OS is not Windows 10', () => {
    detectBrowserEngine.mockReturnValue('Blink');
    detectOS.mockReturnValue('MacOS');

    loadPluginsBasedOnDetection();

    expect(chromePlugin.applyChromeSpecificFeatures).toHaveBeenCalled();
    expect(windowsPlugin.applyWindowsSpecificFeatures).not.toHaveBeenCalled();
  });

  test('should load non-critical plugin features', () => {
    detectBrowserEngine.mockReturnValue('Blink');
    detectOS.mockReturnValue('Windows 10');

    loadPluginsBasedOnDetection();

    expect(nonCriticalPlugin.applyNonCriticalFeatures).toHaveBeenCalled();
  });
});
