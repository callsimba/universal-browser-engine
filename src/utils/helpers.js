export function applyVendorPrefix(element, property, value) {
  element.style[property] = value;
  element.style[`webkit${property}`] = value;
  element.style[`moz${property}`] = value;
  element.style[`ms${property}`] = value;
}

export function logError(message) {
  console.error(`Universal Browser Engine Error: ${message}`);
}

export function addEvent(element, event, handler) {
  if (element.addEventListener) {
    element.addEventListener(event, handler, false);
  } else if (element.attachEvent) {
    element.attachEvent(`on${event}`, handler);
  } else {
    element[`on${event}`] = handler;
  }
}
