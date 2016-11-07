"use strict";

/* Classes and Libraries */
const Vector = require('./vector');
const Bullet = require('./bullet');

/* Constants */
const PLAYER_SPEED = 5;
const BULLET_SPEED = 10;

/**
 * @module Player
 * A class representing a player's helicopter
 */
module.exports = exports = Player;

/**
 * @constructor Player
 * Creates a player
 */
function Player(bullets, missiles) {
  this.bullets = bullets;
  this.angle = 0;
  this.position = {x: 200, y: 2450};
  this.velocity = {x: 0, y: 0};
  this.img = new Image()
  this.img.src = 'assets/tyrian.shp.007D3C.png';
}

/**
 * @function update
 * Updates the player based on the supplied input
 * @param {DOMHighResTimeStamp} elapedTime
 * @param {Input} input object defining input, must have
 * boolean properties: up, left, right, down
 */
Player.prototype.update = function(elapsedTime, input) {

  // set the velocity
  this.velocity.x = 0;
  if(input.left) {
    this.velocity.x -= PLAYER_SPEED;
  } else if(input.right) {
    this.velocity.x += PLAYER_SPEED;
  }
  this.velocity.y = 0;
  if(input.up) {
    this.velocity.y -= PLAYER_SPEED / 2;
  } else if(input.down) {
    this.velocity.y += PLAYER_SPEED / 2;
  }

  // determine player angle
  if(this.velocity.x < 0) {
    this.angle = -1;
  } else if(this.velocity.x > 0) {
    this.angle = 1;
  } else {
    this.angle = 0;
  }

  // move the player
  this.position.x += this.velocity.x;
  this.position.y += this.velocity.y;

  // don't let the player move off-screen
  if(this.position.x < 0) this.position.x = 0;
  if(this.position.x > 960) this.position.x = 960;
  if(this.position.y > 2450) this.position.y = 2450;
}

/**
 * @function render
 * Renders the player helicopter in world coordinates
 * @param {DOMHighResTimeStamp} elapsedTime
 * @param {CanvasRenderingContext2D} ctx
 */
Player.prototype.render = function(elapsedTime, ctx) {
  var offset = this.angle * 23;
  ctx.save();
  ctx.translate(this.position.x, this.position.y);
  ctx.drawImage(this.img, 48+offset, 57, 23, 27, -12.5, -12, 23, 27);
  ctx.restore();
}

Player.prototype.fireBullet = function(canvas) {
  this.bullets.push(new Bullet({
    x:this.position.x,
    y:this.position.y,
    angle: Math.PI/2},
    canvas,
    BULLET_SPEED
  ));
}
