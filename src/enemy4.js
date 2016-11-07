"use strict";

/* Classes and Libraries */
const Vector = require('./vector');
const Shot = require('./shot');
//const Missile = require('./missile');

/* Constants */
const ENEMY_SPEED = .001;
const BULLET_SPEED = 15;

var timePassed = 0;

/**
 * @module Enemy
 * A class representing a enemy's ship
 */
module.exports = exports = Enemy4;

/**
 * @constructor Enemy
 * Creates an enemy
 */
function Enemy4(position, canvas) {
  this.bullets = [];
  this.angle = 0;
  this.position = {x: position.x, y: position.y};
  this.width = 24;
  this.height = 28;
  this.velocity = {x: 0, y: ENEMY_SPEED};
  this.img = new Image();
  this.img.src = 'assets/enemies.png';
  this.canvas = canvas;
  this.state = 0;
  this.exploding = false;
  this.explodingState = 0;
}

/**
 * @function update
 * Updates the enemy based on the supplied input
 * @param {DOMHighResTimeStamp} elapedTime
 * @param {Input} input object defining input, must have
 * boolean properties: up, left, right, down
 */
Enemy4.prototype.update = function(camera, player) {
  if(this.exploding == false) {
    this.velocity.y += ENEMY_SPEED;

    // move the enemy
    this.position.y += this.velocity.y;
    this.position.x++;
    if(this.position.x > 936) {
      this.position.x = 0;
    }

    this.bullets.forEach(function(shot) {
      shot.update();
    })
  }
}

/**
 * @function render
 * Renders the enemy ship in world coordinates
 * @param {DOMHighResTimeStamp} elapsedTime
 * @param {CanvasRenderingContext2D} ctx
 */
Enemy4.prototype.render = function(camera, elapsedTime, ctx) {
  if(this.exploding == false) {
    timePassed += elapsedTime;

    ctx.save();
    ctx.drawImage(
      //image
      this.img,
      //source rectangle
      47, 0, this.width, this.height,
      //destination rectangle
      this.position.x, this.position.y, this.width, this.height
    );
    ctx.restore();

    if(timePassed > 2000 && this.position.y > camera.y && this.bullets.length == 0) {
      var position = {
        x: this.position.x+6,
        y: this.position.y+15
      };

      var image = {
        x: 0,
        y: 140,
        width: 12,
        height: 14
      };

      this.bullets.push(new Shot(
        position,
        this.canvas,
        BULLET_SPEED,
        'assets/bullets.png',
        image
      ));
    }

    for(var i = 0; i < this.bullets.length; i++) {
      this.bullets[i].render(elapsedTime, ctx);
      this.bullets[i].state = 0;
      if(this.bullets[i].position.y > (camera.y + 616)) {
        this.bullets.splice(i, 1);
      }
    }
  } else {
    this.img.src = 'assets/explosions.png';
    ctx.save();
    ctx.drawImage(
          //image
          this.img,
          //source rectangle
          12*this.explodingState, 0, 12, 28,
          //destination rectangle
          this.position.x, this.position.y, 12, this.height
        );
    ctx.restore();

    ctx.save();
    ctx.drawImage(
          //image
          this.img,
          //source rectangle
          12*this.explodingState, 28, 12, 28,
          //destination rectangle
          this.position.x+12, this.position.y, 12, this.height
        );
    ctx.restore();
    this.explodingState++;
  }
}
