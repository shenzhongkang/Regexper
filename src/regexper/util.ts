import _ from 'lodash';
import Snap from 'snapsvg';

/**
 * Generate an `Event` object for triggering a custom event.
 * @param name Name of the custom event. This should be a String.
 * @param detail Event details. The event details are provided to the event.
 */
function customEvent(name: string, detail?: any): CustomEvent {
  const evt = new CustomEvent(name, {
    detail,
    cancelable: true,
    bubbles: true
  });
  return evt;
}

/**
 * Add extra fields to a bounding box returned by `getBBox`. Specifically adds
 * details about the box's axis points (used when positioning elements for display).
 * @param box Bounding box object to update. Attributes `ax`, `ax2`, and `ay`
 * will be added if they are not already defined.
 */
function normalizeBBox(box: any) {
  return _.defaults(box, {
    ax: box.x,
    ax2: box.x2,
    ay: box.cy
  });
}

/**
 * Positions a collection of items with their axis points aligned along a
 * horizontal line. This leads to the items being spaced horizontally and
 * effectively centered vertically.
 * @param items Array of items to be positioned.
 * @param options options.padding - Number of pixels to leave between items.
 */
function spaceHorizontally(items: any, options: any) {
  let verticalCenter: number, values;

  options = _.defaults(options || {}, { padding: 0 });

  values = _.map(items, item => ({
    box: normalizeBBox(item.getBBox()),
    item
  }));

  // Calculate where the axis points should be positioned vertically.
  verticalCenter = _.reduce(values, (center, { box }) => Math.max(center, box.ay), 0);

  // Position items with padding between them and aligned their axis points.
  _.reduce(values, (offset, { item, box }) => {
    item.transform(Snap.matrix().translate(offset, verticalCenter - box.ay));
    return offset + options.padding + box.width;
  }, 0);
}

/**
 * Positions a collection of items centered horizontally in a vertical stack.
 * @param items Array of items to be positioned.
 * @param options options.padding - Number of pixels to leave between items.
 */
function spaceVertically(items: any, options: any) {
  let horizontalCenter: number, values;

  options = _.defaults(options || {}, { padding: 0 });

  values = _.map(items, item => ({
    box: item.getBBox(),
    item
  }));

  // Calculate where the center of each item should be positioned horizontally.
  horizontalCenter = _.reduce(values, (center, { box }) => Math.max(center, box.cx), 0);

  // Position items with padding between them and align their centers.
  _.reduce(values, (offset, { item, box }) => {
    item.transform(Snap.matrix().translate(horizontalCenter - box.cx, offset));
    return offset + options.padding + box.height;
  }, 0);
}

/**
 * Creates a Promise that will be resolved after a specified delay.
 * @param delay Time in milliseconds to wait before resolving promise.
 */
function wait(delay: number) {
  return new Promise(resolve => {
    setTimeout(resolve, delay);
  });
}

/**
 * Creates a Promise that will be resolved after 0 milliseconds. This is used
 * to create a short delay that allows the browser to address any pending tasks
 * while the JavaScript VM is not active.
 */
function tick() {
  return wait(0);
}

/**
 * Re-throws an exception asynchronously. This is used to expose an exception
 * that was created during a Promise operation to be handled by global error
 * handlers (and to be displayed in the browser's debug console).
 * @param error Error/exception object to be re-thrown to the browser.
 */
function exposeError(error: Error) {
  setTimeout(() => {
    throw error;
  }, 0);
}

/**
 * Renders an SVG icon.
 * @param selector Selector to the SVG icon to render.
 */
function icon(selector: string) {
  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 8 8"><use xlink:href="${selector}" /></svg>`;
}

export default {
  customEvent,
  normalizeBBox,
  spaceHorizontally,
  spaceVertically,
  wait,
  tick,
  exposeError,
  icon
}