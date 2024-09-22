import {
  detectBrowserEngine,
  resetBrowserEngineCache,
  isDarkModeEnabled,
  getGPUInfo,
  isTouchDevice,
  getReferrer,
  isConnectionSecure,
  detectBrowserVulnerabilities,
  detectFingerprinting,
  getNetworkSpeed,
} from '../src/detection';

const originalUserAgent = global.navigator.userAgent;

beforeEach(() => {
  Object.defineProperty(global.navigator, 'userAgent', {
    value: originalUserAgent,
    configurable: true,
    writable: true,
  });
  resetBrowserEngineCache();
  jest.resetAllMocks();
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

const mockUserAgent = (userAgentString) => {
  Object.defineProperty(global.navigator, 'userAgent', {
    value: userAgentString,
    configurable: true,
    writable: true,
  });
};

describe('Browser Engine Detection', () => {
  test('should detect Blink for Chrome user agent', () => {
    mockUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
        '(KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
    );
    expect(detectBrowserEngine()).toBe('Blink');
  });

  test('should detect Gecko for Firefox user agent', () => {
    mockUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:50.0) ' +
        'Gecko/20100101 Firefox/50.0'
    );
    expect(detectBrowserEngine()).toBe('Gecko');
  });

  test('should detect WebKit for Safari user agent', () => {
    mockUserAgent(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 ' +
        '(KHTML, like Gecko) Version/14.0 Safari/605.1.15'
    );
    expect(detectBrowserEngine()).toBe('WebKit');
  });

  test('should detect Trident for IE user agent', () => {
    mockUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Trident/7.0; rv:11.0) like Gecko'
    );
    expect(detectBrowserEngine()).toBe('Trident');
  });

  test('should detect Blink (Edge) for Edge user agent', () => {
    mockUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
        '(KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edg/12.246'
    );
    expect(detectBrowserEngine()).toBe('Blink (Edge)');
  });

  test('should detect Blink (Opera) for Opera user agent', () => {
    mockUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
        '(KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 OPR/12.246'
    );
    expect(detectBrowserEngine()).toBe('Blink (Opera)');
  });

  test('should detect Mobile Blink for Chrome mobile user agent', () => {
    mockUserAgent(
      'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) ' +
        'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 ' +
        'Mobile Safari/537.36'
    );
    expect(detectBrowserEngine()).toBe('Mobile Blink');
  });

  test('should reuse cached engine if set', () => {
    mockUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
        '(KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
    );
    const firstEngine = detectBrowserEngine();
    expect(firstEngine).toBe('Blink');

    const secondEngine = detectBrowserEngine();
    expect(secondEngine).toBe('Blink');
  });

  test('should return "Unknown" when an error occurs during engine detection', () => {
    mockUserAgent(null);
    expect(detectBrowserEngine()).toBe('Unknown');
  });
});

describe('Additional Features Detection', () => {
  test('should detect dark mode (off)', () => {
    window.matchMedia = jest.fn().mockImplementation(() => ({
      matches: false,
    }));
    expect(isDarkModeEnabled()).toBe(false);
  });

  test('should detect dark mode (on)', () => {
    window.matchMedia = jest.fn().mockImplementation((query) => ({
      matches: query === '(prefers-color-scheme: dark)',
    }));
    expect(isDarkModeEnabled()).toBe(true);
  });

  test('should get GPU info', async () => {
    const mockGPUInfo = 'Intel GPU';

    const mockGetExtension = jest.fn(() => ({
      UNMASKED_RENDERER_WEBGL: 37445,
    }));

    const mockGetParameter = jest.fn((param) => {
      if (param === 37445) return mockGPUInfo;
      return null;
    });

    const mockGetContext = jest.fn().mockReturnValue({
      getExtension: mockGetExtension,
      getParameter: mockGetParameter,
    });

    jest.spyOn(document, 'createElement').mockReturnValue({
      getContext: mockGetContext,
    });

    const gpuInfoPromise = getGPUInfo();
    jest.advanceTimersByTime(1000);
    const gpuInfo = await gpuInfoPromise;
    expect(gpuInfo).toBe('Intel GPU');
  });

  test('should detect touch device', async () => {
    Object.defineProperty(navigator, 'maxTouchPoints', {
      get: () => 1,
      configurable: true,
    });

    const touchDevicePromise = isTouchDevice();
    jest.advanceTimersByTime(1000);
    const touchDevice = await touchDevicePromise;
    expect(touchDevice).toBe(true);
  });

  test('should get referrer', () => {
    Object.defineProperty(document, 'referrer', {
      value: 'https://example.com',
      configurable: true,
    });
    expect(getReferrer()).toBe('https://example.com');
  });

  test('should detect insecure connection (HTTP)', () => {
    Object.defineProperty(window, 'location', {
      value: {
        protocol: 'http:',
      },
      configurable: true,
    });
    expect(isConnectionSecure()).toBe(false);
  });

  test('should detect secure connection (HTTPS)', () => {
    Object.defineProperty(window, 'location', {
      value: {
        protocol: 'https:',
      },
      configurable: true,
    });
    expect(isConnectionSecure()).toBe(true);
  });

  test('should detect outdated or vulnerable browser', () => {
    mockUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Trident/7.0; rv:11.0) like Gecko'
    );
    expect(detectBrowserVulnerabilities()).toBe(
      'Browser is outdated or vulnerable'
    );
  });

  test('should detect up-to-date browser', () => {
    mockUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:50.0) Gecko/20100101 Firefox/50.0'
    );
    expect(detectBrowserVulnerabilities()).toBe('Browser is up to date');
  });

  test('should get unknown network speed if navigator.connection is undefined', async () => {
    Object.defineProperty(navigator, 'connection', {
      value: undefined,
      configurable: true,
    });

    const networkSpeedPromise = getNetworkSpeed();
    jest.advanceTimersByTime(1000);
    const networkSpeed = await networkSpeedPromise;
    expect(networkSpeed).toBe('Unknown');
  });

  test('should get network speed when navigator.connection is available', async () => {
    Object.defineProperty(navigator, 'connection', {
      value: { downlink: 10.5 },
      configurable: true,
    });

    const networkSpeedPromise = getNetworkSpeed();
    jest.advanceTimersByTime(1000);
    const networkSpeed = await networkSpeedPromise;
    expect(networkSpeed).toBe('10.5Mbps');
  });

  test('should handle error when detecting network speed', async () => {
    Object.defineProperty(navigator, 'connection', {
      get: () => {
        throw new Error('Network error');
      },
      configurable: true,
    });

    const networkSpeedPromise = getNetworkSpeed();
    jest.advanceTimersByTime(1000);
    const networkSpeed = await networkSpeedPromise;
    expect(networkSpeed).toBe('Unknown');
  });

  test('should detect browser fingerprinting susceptibility', () => {
    const mockGetContext = jest.fn().mockReturnValue(null);
    jest.spyOn(document, 'createElement').mockReturnValue({
      getContext: mockGetContext,
    });

    expect(detectFingerprinting()).toBe(
      'Browser is less susceptible to fingerprinting'
    );
  });

  test('should detect browser vulnerable to fingerprinting', () => {
    const mockGetContext = jest.fn().mockReturnValue({
      getExtension: jest.fn(() => ({ UNMASKED_RENDERER_WEBGL: 37445 })),
    });
    jest.spyOn(document, 'createElement').mockReturnValue({
      getContext: mockGetContext,
    });

    expect(detectFingerprinting()).toBe(
      'Browser might be vulnerable to fingerprinting techniques like WebGL rendering'
    );
  });
});
