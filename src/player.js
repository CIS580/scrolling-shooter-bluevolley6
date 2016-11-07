"use strict";

/* Classes and Libraries */
const Bullet = require('./bullet');
const Shot = require('./shot');

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
  this.score = 0;
  this.exploding = false;
  this.explodingState = 0;
  this.width = 24;
  this.height = 28;
  this.powerup = 0;
}

/**
 * @function update
 * Updates the player based on the supplied input
 * @param {DOMHighResTimeStamp} elapedTime
 * @param {Input} input object defining input, must have
 * boolean properties: up, left, right, down
 */
Player.prototype.update = function(elapsedTime, input) {
  if(this.exploding == false) {
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
}

/**
 * @function render
 * Renders the player helicopter in world coordinates
 * @param {DOMHighResTimeStamp} elapsedTime
 * @param {CanvasRenderingContext2D} ctx
 */
Player.prototype.render = function(elapsedTime, ctx) {
  if(this.exploding == false) {
    var offset = this.angle * 23;
    ctx.save();
    ctx.translate(this.position.x, this.position.y);
    ctx.drawImage(this.img, 47+offset, 57, 24, 28, -12.5, -12, this.width, this.height);
    ctx.restore();

    for(var i = 0; i < this.bullets.length; i++) {
      this.bullets[i].render(elapsedTime, ctx);
      if(this.type > 0) {
        if(this.bullets[i].position.y < camera.y) {
          this.bullets[i].alive = false;
        }
        if(this.type == 1) { //fire
          if(this.bullets[i].state > 4) {
            this.bullets.splice(i, 1);
          }
        } else if(this.type == 2) { //banana
          if(this.bullets[i].state > 3) {
            this.bullets.splice(i, 1);
          }
        } else { //star
          if(this.bullets[i].state > 9) {
            this.bullets.splice(i, 1);
          }
        }
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

Player.prototype.fireBullet = function(canvas) {
  if(this.powerup == 0) { //bullet
    this.bullets.push(new Bullet({
      x:this.position.x,
      y:this.position.y,
      angle: Math.PI/2},
      canvas,
      BULLET_SPEED
    ));
  } else if(this.powerup == 1) { //fire
    var position = {
      x: this.position.x,
      y: this.position.y - BULLET_SPEED
    };

    var image = {
      x: 0,
      y: 42,
      width: 12,
      height: 14
    };
    this.bullets.push(new Shot(
      position,
      canvas,
      -BULLET_SPEED,
      'assets/bullets.png',
      image
    ));
  } else if(this.powerup == 2) { //banana
    var position = {
      x: this.position.x,
      y: this.position.y - BULLET_SPEED
    };

    var image = {
      x: 0,
      y: 112,
      width: 12,
      height: 14
    };
    this.bullets.push(new Shot(
      position,
      canvas,
      -BULLET_SPEED,
      'assets/bullets.png',
      image
    ));
  } else { //star
    var position = {
      x: this.position.x,
      y: this.position.y - BULLET_SPEED
    };

    var image = {
      x: 0,
      y: 126,
      width: 12,
      height: 14
    };
    this.bullets.push(new Shot(
      position,
      canvas,
      -BULLET_SPEED,
      'assets/bullets.png',
      image
    ));
  }
}
