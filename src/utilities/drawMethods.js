export function startDraw(x, y, ctx, brushStyles) {
  ctx.beginPath();
  ctx.moveTo(x, y);

  ctx.lineWidth = brushStyles.lineWidth;
  ctx.lineCap = brushStyles.lineCap;
  ctx.strokeStyle = brushStyles.strokeStyle;
  ctx.shadowBlur = brushStyles.shadowBlur;
  ctx.shadowColor = brushStyles.shadowColor;
}
export function moveDraw(x, y, ctx) {
  if(this._prevX && this._prevY) {
    ctx.beginPath();
    ctx.moveTo(this._prevX, this._prevY);
  }

  ctx.lineTo(x, y);
  ctx.stroke();

  this._prevX = x;
  this._prevY = y;
}
export function endDraw() {
  this._prevX = this._prevY = null;
}

export default {
  startDraw,
  moveDraw,
  endDraw,
};
