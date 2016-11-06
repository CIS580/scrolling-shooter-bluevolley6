"use strict";

const MS_PER_FRAME = 1000/8;

/**
 * @module exports the Shot class
 */
module.exports = exports = Shot;

/**
 * @constructor Shot
 * Creates a new shot object
 * @param {Postition} position object specifying an x and y
 */
function Shot(position, canvas, speed, src, image) {
  this.worldWidth = canvas.width;
  this.worldHeight = canvas.height;
  this.position = {
    x: position.x,
    y: position.y
  };
  this.speed = speed;
  this.image = new Image();
  this.image.src = src;
  this.state = 0
  this.imageWidth = image.width;
  this.imageHeight = image.height;
  this.imageX = image.x;
  this.imageY = image.y
}

/**
 * @function updates the shot object
 */
Shot.prototype.update = function() {
  // Apply velocity
  this.position.y += 2*this.speed;
}

/**
 * @function renders the bullet into the provided context
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 * {CanvasRenderingContext2D} ctx the context to render into
 */
Shot.prototype.render = function(time, ctx) {
  ctx.save();
  ctx.drawImage(
    //image
    this.image,
    //source rectangle
    this.state*this.imageWidth + this.imageX, this.imageY, this.imageWidth, this.imageHeight,
    //destination rectangle
    this.position.x, this.position.y, this.imageWidth, this.imageHeight
  );
  ctx.restore();
  this.state++;
}
