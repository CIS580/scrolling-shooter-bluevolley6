"use strict";

/**
 * @module Powerup
 * A class representing a enemy's ship
 */
module.exports = exports = Powerup;

/**
 * @constructor Powerup
 * Creates a powerup
 */
function Powerup(position, type) {
  this.position = {x: position.x, y: position.y};
  this.type = type;
  this.image = new Image();
  this.image.src = 'assets/bullets.png';
  this.width = 12;
  this.height = 14;
}

/**
 * @function render
 * Renders the powerup in world coordinates
 * @param {DOMHighResTimeStamp} elapsedTime
 * @param {CanvasRenderingContext2D} ctx
 */
Powerup.prototype.render = function(elapsedTime, ctx) {
  switch(this.type) {
    case 1: //fire
      ctx.save();
      ctx.drawImage(this.image, 179, 14, this.width, this.height, this.position.x, this.position.y, this.width, this.height);
      ctx.restore();
      break;
    case 2: //bananas
      ctx.save();
      ctx.drawImage(this.image, 215, 196, this.width, this.height, this.position.x, this.position.y, this.width, this.height);
      ctx.restore();
      break;
    case 3: //star
      ctx.save();
      ctx.drawImage(this.image, 71, 196, this.width, this.height, this.position.x, this.position.y, this.width, this.height);
      ctx.restore();
      break;
  }
}
