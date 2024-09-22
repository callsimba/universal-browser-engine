export function isJavaScriptEnabled() {
  try {
    return typeof window !== 'undefined' && !!window.document;
  } catch (error) {
    return false;
  }
}

export function areCookiesEnabled() {
  try {
    return navigator.cookieEnabled;
  } catch (error) {
    return false;
  }
}

export function isAdBlockerActive() {
  try {
    const ad = document.createElement('div');
    ad.innerHTML = '&nbsp;';
    ad.className = 'adsbox';
    document.body.appendChild(ad);

    const isBlocked = ad.offsetHeight === 0;
    document.body.removeChild(ad);
    return isBlocked;
  } catch (error) {
    return false;
  }
}
