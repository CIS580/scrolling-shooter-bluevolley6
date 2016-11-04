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
module.exports = exports = Enemy;

/**
 * @constructor Enemy
 * Creates an enemy
 */
function Enemy(canvas) {
  this.bullets = [];
  this.angle = 0;
  this.position = {x: 200, y: 200};
  this.velocity = {x: 0, y: ENEMY_SPEED};
  this.img = new Image()
  this.img.src = 'assets/enemies.png';
  this.canvas = canvas;
}

/**
 * @function update
 * Updates the enemy based on the supplied input
 * @param {DOMHighResTimeStamp} elapedTime
 * @param {Input} input object defining input, must have
 * boolean properties: up, left, right, down
 */
Enemy.prototype.update = function(camera) {

  this.velocity.y += ENEMY_SPEED;

  // move the enemy
  this.position.x += this.velocity.x;
  this.position.y += this.velocity.y;

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
Enemy.prototype.render = function(elapsedTime, ctx) {
  timePassed += elapsedTime;
  if(timePassed > 3000) {
    this.bullets.push(new Bullet({
      x:this.position.x,
      y:this.position.y,
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
  ctx.translate(this.position.x, this.position.y);
  ctx.drawImage(
        //image
        this.img,
        //source rectangle
        47, 197, 24, 28,
        //destination rectangle
        this.position.x, this.position.y, 24, 28
      );
  ctx.restore();
}
