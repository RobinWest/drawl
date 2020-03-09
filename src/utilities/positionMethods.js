import TOUCH_EVENTS from '../constants/touchEventTypes';

// - Utility functions
export function getEventPositions(e, canvasBounds) {
  // Touch event
  if(TOUCH_EVENTS.includes(e.type)) {
    // Ensure the touch positioning is offset by the canvas location
    const position = {
      x: e.touches[0].clientX - canvasBounds.left,
      y: e.touches[0].clientY - canvasBounds.top,
    };

    return {
      ...position,
      ...getRelativePositions(position.x, position.y, canvasBounds.width, canvasBounds.height),
    };

  // Mouse event
  } else {
    const position = {
      x: e.offsetX,
      y: e.offsetY,
    };

    return {
      ...position,
      ...getRelativePositions(position.x, position.y, canvasBounds.width, canvasBounds.height),
    };
  }
}
export function getRelativePositions(x, y, width, height) {
  return {
    relativeX: x / width,
    relativeY: y / height,
  };
}
export function getAbsolutePositions(relX, relY, width, height) {
  return {
    x: relX * width,
    y: relY * height,
  };
}

export default {
  getEventPositions,
  getRelativePositions,
  getAbsolutePositions,
};
