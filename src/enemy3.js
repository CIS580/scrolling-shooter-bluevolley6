"use strict";

/* Classes and Libraries */
const Vector = require('./vector');
const Bullet = require('./bullet');
//const Missile = require('./missile');

/* Constants */
const ENEMY_SPEED = .001;
const BULLET_SPEED = -10;

var timePassed = 0;

/**
 * @module Enemy
 * A class representing a enemy's ship
 */
module.exports = exports = Enemy3;

/**
 * @constructor Enemy
 * Creates an enemy
 */
function Enemy3(position, canvas) {
  this.bullets = [];
  this.angle = 0;
  this.position = {x: position.x, y: position.y};
  this.velocity = {x: 0, y: ENEMY_SPEED};
  this.img = new Image();
  this.img.src = 'assets/enemies2.png';
  this.canvas = canvas;
}

/**
 * @function update
 * Updates the enemy based on the supplied input
 * @param {DOMHighResTimeStamp} elapedTime
 * @param {Input} input object defining input, must have
 * boolean properties: up, left, right, down
 */
Enemy3.prototype.update = function(camera, player) {

  this.velocity.y += ENEMY_SPEED;

  // move the enemy
  this.position.y += this.velocity.y;
  this.position.x--;
  if(this.position.x < 0) {
    this.position.x = 960;
  }

  for(var i = 0; i < this.bullets.length; i++) {
    this.bullets[i].update(camera);
  }
}

/**
 * @function render
 * Renders the enemy ship in world coordinates
 * @param {DOMHighResTimeStamp} elapsedTime
 * @param {CanvasRenderingContext2D} ctx
 */
Enemy3.prototype.render = function(camera, elapsedTime, ctx) {
  timePassed += elapsedTime;
  if(timePassed > 1000 && this.position.y > camera.y) {
    this.bullets.push(new Bullet({
      x:this.position.x+12,
      y:this.position.y+28,
      angle: Math.PI/2},
      this.canvas,
      BULLET_SPEED
    ));
    timePassed = 0;
  }

  for(var i = 0; i < this.bullets.length; i++) {
    this.bullets[i].render(elapsedTime, ctx);
  }

  ctx.save();
  ctx.drawImage(
        //image
        this.img,
        //source rectangle
        155, 113, 24, 28,
        //destination rectangle
        this.position.x, this.position.y, 24, 28
      );
  ctx.restore();
}