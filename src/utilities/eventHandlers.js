import TOUCH_EVENTS from '../constants/touchEventTypes';
import { CHUNK_ACTION_START, CHUNK_ACTION_MOVE, CHUNK_ACTION_END, CHUNK_ACTION_CLEAR } from '../constants/chunkActionTypes';

import { getEventPositions } from './positionMethods';
import { startDraw, moveDraw, endDraw } from './drawMethods';

// - Event handlers
export function setupEventListeners() {
  this._canvasElement.addEventListener('touchstart', handleTouchStart.bind(this));
  this._canvasElement.addEventListener('mousedown', handleTouchStart.bind(this));

  this._canvasElement.addEventListener('touchmove', handleTouchMove.bind(this));
  this._canvasElement.addEventListener('mousemove', handleTouchMove.bind(this));

  // TODO touchcancel?
  // Stop the line from pinging back in when you go out. This is kind of annoying, so something better needs to be done.
  this._canvasElement.addEventListener('mouseout', handleTouchEnd.bind(this));

  this._canvasElement.addEventListener('touchend', handleTouchEnd.bind(this));
  this._canvasElement.addEventListener('mouseup', handleTouchEnd.bind(this));
}
export function handleTouchStart(e) {
  // TODO Check e.buttons for count

  // Check for single touches - ignore multi touch
  if(TOUCH_EVENTS.includes(e.type) && e.touches.length !== 1) {
    return;
  }

  e.preventDefault();

  this._drawActive = true;

  const eventPositions = getEventPositions(e, this.canvasBounds);

  const currentBrushStyles = this.currentBrushStyles;

  startDraw.call(this, eventPositions.x, eventPositions.y, this.canvasContext, currentBrushStyles);

  this.addChunkAction({
    ...eventPositions,
    brushStyles: { ...currentBrushStyles }, // TODO sub-object
    brushMode: this.brushMode,
    type: CHUNK_ACTION_START,
  });
}
export function handleTouchMove(e) {
  // Check drawing is active, and if it's a touch event make sure it's a single touch
  if(!this._drawActive || TOUCH_EVENTS.includes(e.type) && e.touches.length !== 1) {
    return;
  }

  e.preventDefault();

  const eventPositions = getEventPositions(e, this.canvasBounds);

  moveDraw.call(this, eventPositions.x, eventPositions.y, this.canvasContext);

  this.addChunkAction({
    ...eventPositions,
    brushMode: this.brushMode,
    type: CHUNK_ACTION_MOVE,
  });
}
export function handleTouchEnd(e) {
  // Don't push another chunk if we hadn't started a drawing
  if(!this._drawActive) {
    return;
  }

  e.preventDefault();

  this.addChunkAction({
    type: CHUNK_ACTION_END,
  });

  this.saveChunk(this._currentChunk);
  this.resetChunk();

  this._drawActive = false;

  endDraw.call(this);

}

export default {
  setupEventListeners,
  handleTouchStart,
  handleTouchMove,
  handleTouchEnd,
};
