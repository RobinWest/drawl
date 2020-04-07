import { CHUNK_ACTION_START, CHUNK_ACTION_MOVE, CHUNK_ACTION_END, CHUNK_ACTION_CLEAR } from './constants/chunkActionTypes';

import { setupEventListeners } from './utilities/eventHandlers';
import { startDraw, moveDraw, endDraw } from './utilities/drawMethods';
import { getAbsolutePositions } from './utilities/positionMethods';

const DEFAULT_BRUSH_STYLES = {
  lineWidth: 2,
  lineCap: 'round',
  strokeStyle: 'red',
  // Shadow helps to smooth the line
  shadowBlur: 1.6,
  shadowColor: 'red',
};

class Drawl {
  _canvasElement;
  _canvasContext;

  _drawActive = false;
  _prevX;
  _prevY;

  _currentChunk = [];
  _chunkHistory = [];

  _brushMode = 'pencil';
  _pencilStyles = {
    ...DEFAULT_BRUSH_STYLES,
  };

  _eraserStyles = {
    ...DEFAULT_BRUSH_STYLES,
    lineWidth: 18,
    shadowBlur: 6,
  };

  constructor(canvasEl) {
    if(!canvasEl || !canvasEl instanceof Element) {
      throw new Error('Critical! Invalid canvas element provided.');
    }

    this._canvasElement = canvasEl;
    this._canvasContext = this.canvasElement.getContext('2d');

    setupEventListeners.call(this);
  }

  // - Chunk functions
  addChunkAction(action) {
    if(![CHUNK_ACTION_START, CHUNK_ACTION_MOVE, CHUNK_ACTION_END, CHUNK_ACTION_CLEAR].includes(action.type)) {
      throw new Error('Invalid action type:', action.type);
    }

    this._currentChunk.push(action);

    // Dispatch event
    this.canvasElement.dispatchEvent(new CustomEvent('chunkaction', {
      detail: { ...action }
    }));
  }
  saveChunk(chunk) {
    this._chunkHistory.push(chunk);
  }
  resetChunk() {
    this._currentChunk = [];
  }

  // - Canvas functions
  resizeCanvas(width, height) {
    this.canvasElement.width = width;
    this.canvasElement.height = height;

    this.redrawCanvas();
  }
  redrawCanvas() {
    const canvasBounds = this.canvasBounds;

    const prevBrushMode = this.brushMode;

    this._chunkHistory.forEach(chunk => {
      chunk.forEach(action => {
        if(action.type === CHUNK_ACTION_START) {
          const { x, y } = getAbsolutePositions(action.relativeX, action.relativeY, canvasBounds.width, canvasBounds.height);

          this.setBrushMode(action.brushMode);
          startDraw.call(this, x, y, this.canvasContext, action.brushStyles);
        }

        if(action.type === CHUNK_ACTION_MOVE) {
          const { x, y } = getAbsolutePositions(action.relativeX, action.relativeY, canvasBounds.width, canvasBounds.height);

          this.setBrushMode(action.brushMode);
          moveDraw.call(this, x, y, this.canvasContext);
        }

        if(action.type === CHUNK_ACTION_END) {
          endDraw.call(this);
        }

        if(action.type === CHUNK_ACTION_CLEAR) {
          this.resetCanvas();
        }
      });
    });

    this.setBrushMode(prevBrushMode);
  }
  resetCanvas() {
    const canvasBounds = this.canvasBounds;

    this.canvasContext.clearRect(0, 0, canvasBounds.width, canvasBounds.height);
  }

  // - Brush functions
  setBrushMode(brushMode) {
    this.brushMode = brushMode;

    const ctx = this.canvasContext;

    // TODO ability to set the line width based on tool
    if(brushMode === 'eraser') {
      ctx.globalCompositeOperation = "destination-out";

    } else {
      ctx.globalCompositeOperation = "source-over";
    }
  }

  // - Meta functions
  undo(e) {
    this.resetCanvas();

    // TODO add popped item to an array for redo functionality
    this._chunkHistory.pop();
    this.redrawCanvas();
  }
  clearCanvas(e) {
    // We don't need to clear twice in a row
    if(this.previousChunk[0].type === 'clear') {
      return;
    }

    // Add a history chunk so this can be undone
    this._chunkHistory.push([{
      type: CHUNK_ACTION_CLEAR,
    }]);

    this.resetCanvas();
  }
  toBase64(e) {
    return this.canvasElement.toDataURL();
  }

  get previousChunk() {
    return this._chunkHistory[this._chunkHistory.length - 1];
  }
  set previousChunk(val) {
    throw new Error('You cannot set previousChunk.');
  }
  get currentBrushStyles() {
    switch(this.brushMode) {
      case 'pencil':
        return this.pencilStyles;
        break;
      case 'eraser':
        return this.eraserStyles;
        break;
      default:
        return DEFAULT_BRUSH_STYLES;
        break;
    }
  }
  set currentBrushStyles(val) {
    throw new Error('You cannot set currentBrushStyles.');
  }

  get brushMode() {
    return this._brushMode;
  }
  set brushMode(val) {
    // TODO validate against consts
    this._brushMode = val;
  }

  // TODO lock these down to some API calls - setPencilColor() etc
  get pencilStyles() {
    return this._pencilStyles;
  }
  set pencilStyles(val) {
    this._pencilStyles = {
      ...this._pencilStyles,
      ...val,
    };
  }

  get eraserStyles() {
    return this._eraserStyles;
  }
  set eraserStyles(val) {
    this._eraserStyles = {
      ...this._eraserStyles,
      ...val,
    };
  }

  get canvasBounds() {
    return this.canvasElement.getBoundingClientRect();
  }
  set canvasBounds(val) {
    throw new Error('You cannot set canvasBounds.');
  }

  get canvasElement() {
    return this._canvasElement;
  }
  set canvasElement(val) {
    throw new Error('You cannot reassign canvasElement.');
  }

  get canvasContext() {
    return this._canvasContext;
  }
  set canvasContext(val) {
    throw new Error('You cannot reassign canvasContext.');
  }
};

export default Drawl;
