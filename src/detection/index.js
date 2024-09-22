import { applyPolyfills } from '../polyfills';

let memoizedEngine = null;
let memoizedOS = null;
let cacheExpiryTime = 0;
const CACHE_DURATION = 600000;

function isCacheExpired() {
  return Date.now() > cacheExpiryTime;
}

export function detectBrowserEngine() {
  if (memoizedEngine && !isCacheExpired()) {
    return memoizedEngine;
  }

  try {
    const userAgent = navigator.userAgent || '';
    const isMobile = /Mobi|Android/i.test(userAgent);

    let cachedEngine;

    if (userAgent.includes('Gecko') && userAgent.includes('Firefox')) {
      cachedEngine = 'Gecko';
    } else if (userAgent.includes('Trident') || userAgent.includes('MSIE')) {
      cachedEngine = 'Trident';
    } else if (
      userAgent.includes('Safari') &&
      !userAgent.includes('Chrome') &&
      !userAgent.includes('Chromium') &&
      !userAgent.includes('Edg') &&
      !userAgent.includes('OPR')
    ) {
      cachedEngine = 'WebKit';
    } else if (userAgent.includes('Edg')) {
      cachedEngine = 'Blink (Edge)';
    } else if (userAgent.includes('OPR')) {
      cachedEngine = 'Blink (Opera)';
    } else if (userAgent.includes('Chrome') || userAgent.includes('Chromium')) {
      cachedEngine = 'Blink';
    } else {
      cachedEngine = 'Unknown';
    }

    if (isMobile && cachedEngine !== 'Unknown') {
      cachedEngine = `Mobile ${cachedEngine}`;
    }

    memoizedEngine = cachedEngine;
    applyPolyfills(cachedEngine);
    cacheExpiryTime = Date.now() + CACHE_DURATION;
    return cachedEngine;
  } catch (error) {
    return 'Unknown';
  }
}

export function detectOS() {
  if (memoizedOS && !isCacheExpired()) return memoizedOS;

  try {
    const userAgent = navigator.userAgent || '';
    let os = 'Unknown OS';

    if (userAgent.includes('Windows NT 10.0')) os = 'Windows 10';
    else if (userAgent.includes('Windows NT 6.2')) os = 'Windows 8';
    else if (userAgent.includes('Windows NT 6.1')) os = 'Windows 7';
    else if (userAgent.includes('Macintosh')) os = 'MacOS';
    else if (userAgent.includes('X11')) os = 'Linux';
    else if (userAgent.includes('Android')) os = 'Android';
    else if (userAgent.includes('iPhone')) os = 'iOS';

    memoizedOS = os;
    cacheExpiryTime = Date.now() + CACHE_DURATION;
    return os;
  } catch (error) {
    return 'Unknown OS';
  }
}

export function resetBrowserEngineCache() {
  memoizedEngine = null;
  memoizedOS = null;
  cacheExpiryTime = 0;
}

export function isDarkModeEnabled() {
  try {
    return (
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    );
  } catch (error) {
    return false;
  }
}

export function getNetworkSpeed() {
  return new Promise((resolve) => {
    setTimeout(() => {
      try {
        resolve(
          navigator.connection
            ? navigator.connection.downlink + 'Mbps'
            : 'Unknown'
        );
      } catch (error) {
        resolve('Unknown');
      }
    }, 1000);
  });
}

export function getGPUInfo() {
  return new Promise((resolve) => {
    setTimeout(() => {
      try {
        const canvas = document.createElement('canvas');
        const gl =
          canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (!gl) return resolve('Unknown GPU');

        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        resolve(
          debugInfo
            ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
            : 'Unknown GPU'
        );
      } catch (error) {
        resolve('Unknown GPU');
      }
    }, 1000);
  });
}

export function isTouchDevice() {
  return new Promise((resolve) => {
    setTimeout(() => {
      try {
        resolve('ontouchstart' in window || navigator.maxTouchPoints > 0);
      } catch (error) {
        resolve(false);
      }
    }, 1000);
  });
}

export function getReferrer() {
  try {
    return document.referrer || 'No referrer';
  } catch (error) {
    return 'Unknown referrer';
  }
}

export function isConnectionSecure() {
  try {
    return window.location.protocol === 'https:';
  } catch (error) {
    return false;
  }
}

export function detectBrowserVulnerabilities() {
  try {
    const outdatedBrowser = /MSIE|Trident/.test(navigator.userAgent);
    return outdatedBrowser
      ? 'Browser is outdated or vulnerable'
      : 'Browser is up to date';
  } catch (error) {
    return 'Unable to detect browser vulnerabilities';
  }
}

export function detectFingerprinting() {
  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (gl) {
      return 'Browser might be vulnerable to fingerprinting techniques like WebGL rendering';
    } else {
      return 'Browser is less susceptible to fingerprinting';
    }
  } catch (error) {
    return 'Unable to detect fingerprinting';
  }
}
