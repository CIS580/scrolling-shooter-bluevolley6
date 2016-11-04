"use strict";

const MS_PER_FRAME = 1000/8;

/**
 * @module exports the Player class
 */
module.exports = exports = Bullet;

/**
 * @constructor Bullet
 * Creates a new bullet object
 * @param {Postition} position object specifying an x and y
 */
function Bullet(position, canvas, speed) {
  this.worldWidth = canvas.width;
  this.worldHeight = canvas.height;
  this.position = {
    x: position.x,
    y: position.y
  };
  this.angle = position.angle;
  this.velocity = {
    x: Math.cos(this.angle),
    y: Math.sin(this.angle)
  }
  this.color = 'red';
  this.alive = true;
  this.speed = speed
}

/**
 * @function updates the bullet object
 */
Bullet.prototype.update = function(camera) {
  // Apply velocity
  this.position.x += this.velocity.x * this.speed;
  this.position.y -= this.velocity.y * this.speed;

  if(this.position.y < camera.y) {
    this.alive = false;
  }
}

/**
 * @function renders the bullet into the provided context
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 * {CanvasRenderingContext2D} ctx the context to render into
 */
Bullet.prototype.render = function(time, ctx) {
  ctx.save();
  ctx.strokeStyle = this.color;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(this.position.x, this.position.y);
  ctx.lineTo(this.position.x + this.speed*this.velocity.x, this.position.y - this.speed*this.velocity.y);
  ctx.stroke();
  ctx.restore();
}
