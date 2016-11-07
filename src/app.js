"use strict";

/* Classes and Libraries */
const Game = require('./game');
const Vector = require('./vector');
const Camera = require('./camera');
const Player = require('./player');
const Tilemap = require('./tilemap');
const Bullet = require('./bullet');
const Enemy = require('./enemy1');
const Enemy2 = require('./enemy2');
const Enemy3 = require('./enemy3');
const Enemy4 = require('./enemy4');
const Enemy5 = require('./enemy5');

var level = 0;
var pause = false;
var lives = 3;
var health = 100;
var colliding = false;
var collisionTime = 0;

var level1Back = require('../assets/level1/background.json');
var level1Mid = require('../assets/level1/midground.json');
var level1Fore = require('../assets/level1/foreground.json');

var level2Back = require('../assets/level2/background.json');
var level2Mid = require('../assets/level2/midground.json');
var level2Fore = require('../assets/level2/foreground.json');

var level3Back = require('../assets/level3/background.json');
var level3Mid = require('../assets/level3/midground.json');
var level3Fore = require('../assets/level3/foreground.json');

/* Global variables */
var canvas = document.getElementById('screen');
var game = new Game(canvas, update, render);
var input = {
  up: false,
  down: false,
  left: false,
  right: false
}
var camera = new Camera(canvas);
var missiles = [];
var player = new Player([], missiles);
var shooting = false;

var enemies = [];
var enemyCount;
var enemiesKilled;

var tilemaps = [];
var mapCount = 3;


function checkMapsLoaded(){
  mapCount--;
  if(mapCount == 0){
    masterLoop(performance.now());
  }
}

var direction = {x: 0, y: -1};

/**
 * @function onkeydown
 * Handles keydown events
 */
window.onkeydown = function(event) {
  switch(event.key) {
    case "ArrowUp":
    case "w":
      input.up = true;
      event.preventDefault();
      break;
    case "ArrowDown":
    case "s":
      input.down = true;
      event.preventDefault();
      break;
    case "ArrowLeft":
    case "a":
      input.left = true;
      event.preventDefault();
      break;
    case "ArrowRight":
    case "d":
      input.right = true;
      event.preventDefault();
      break;
    case " ":
      if(!shooting && !pause && !player.exploding) {
        player.fireBullet(canvas);
        event.preventDefault();
        shooting = true;
      } else if(pause) {
        pause = false;
        event.preventDefault();
      }
      break;
  }
}

/**
 * @function onkeyup
 * Handles keydown events
 */
window.onkeyup = function(event) {
  switch(event.key) {
    case "ArrowUp":
    case "w":
      input.up = false;
      event.preventDefault();
      break;
    case "ArrowDown":
    case "s":
      input.down = false;
      event.preventDefault();
      break;
    case "ArrowLeft":
    case "a":
      input.left = false;
      event.preventDefault();
      break;
    case "ArrowRight":
    case "d":
      input.right = false;
      event.preventDefault();
      break;
    case " ":
      shooting = false;
      break;
  }
}

/**
 * @function masterLoop
 * Advances the game in sync with the refresh rate of the screen
 * @param {DOMHighResTimeStamp} timestamp the current time
 */
var masterLoop = function(timestamp) {
  game.loop(timestamp);
  window.requestAnimationFrame(masterLoop);
}
masterLoop(performance.now());

/**
 * @function update
 * Updates the game state, moving
 * game objects and handling interactions
 * between them.
 * @param {DOMHighResTimeStamp} elapsedTime indicates
 * the number of milliseconds passed since the last frame.
 */
function update(elapsedTime, ctx) {
  if(!pause) {
    // update the player
    player.update(elapsedTime, input);
    if(player.explodingState == 17) {
      player.exploding = false;
      player.explodingState = 0;
      player.img.src = 'assets/tyrian.shp.007D3C.png';
    }

    if(level == 0) {
      tilemaps.push(new Tilemap(level1Back, {
        onload: function() {
          checkMapsLoaded();
        }
      }));
      tilemaps.push(new Tilemap(level1Mid, {
        onload: function() {
          checkMapsLoaded();
        }
      }));
      tilemaps.push(new Tilemap(level1Fore, {
        onload: function() {
          checkMapsLoaded();
        }
      }));
      newEnemies(3);
      enemyCount = enemies.length;
      level++;
    }

    if(player.position.y < 0) {
      level++;
      player.position = {x: 200, y: 2450};
      if(level == 2) {
        enemiesKilled = enemyCount - enemies.length;
        performanceScreen(elapsedTime, ctx);
        enemies = [];
        tilemaps = [];
        newEnemies(4);
        enemyCount = enemies.length;
        tilemaps.push(new Tilemap(level2Back, {
          onload: function() {
            checkMapsLoaded();
          }
        }));
        tilemaps.push(new Tilemap(level2Mid, {
          onload: function() {
            checkMapsLoaded();
          }
        }));
        tilemaps.push(new Tilemap(level2Fore, {
          onload: function() {
            checkMapsLoaded();
          }
        }));
      } else if(level == 3) {
        enemiesKilled = enemyCount - enemies.length;
        performanceScreen(elapsedTime, ctx);
        enemies = [];
        tilemaps = [];
        newEnemies(5);
        enemyCount = enemies.length;
        tilemaps.push(new Tilemap(level3Back, {
          onload: function() {
            checkMapsLoaded();
          }
        }));
        tilemaps.push(new Tilemap(level3Mid, {
          onload: function() {
            checkMapsLoaded();
          }
        }));
        tilemaps.push(new Tilemap(level3Fore, {
          onload: function() {
            checkMapsLoaded();
          }
        }));
      }
    }

    // update enemies
    for(var i = 0; i < enemies.length; i++) {
      enemies[i].update(camera, player);
      if(enemies[i].explodingState == 17) {
        enemies.splice(i, 1);
      }
    }

    // update the camera
    camera.update(player.position);

    // Update bullets
    for(var i = 0; i < player.bullets.length; i++) {
      player.bullets[i].update(camera);
      if(!player.bullets[i].alive) {
        player.bullets.splice(i, 1);
      }
    }

    //check to see if bullet hit an enemy
    bulletCollsion();

    //check to see if player got shot
    playerShot();

    //check to see if player collided with enemy
    if(!colliding) {
      playerCollision();
    } else {
      collisionTime += elapsedTime;
      if(collisionTime > 100) {
        colliding = false;
      }
    }
  }
}

/**
  * @function render
  * Renders the current game state into a back buffer.
  * @param {DOMHighResTimeStamp} elapsedTime indicates
  * the number of milliseconds passed since the last frame.
  * @param {CanvasRenderingContext2D} ctx the context to render to
  */
function render(elapsedTime, ctx) {
  if(!pause) {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, 1160, 616);

    // TODO: Render background
    if(level <= 3) {
      renderMaps(elapsedTime, ctx);
      if(player.position.y < 0) {
        performanceScreen(elapsedTime, ctx);
      }
    } else {
      game.gameOver = true;
    }

    if(game.gameOver) {
      ctx.fillStyle = "red";
      ctx.font = "bold 32px Arial";
      ctx.fillText("Game Over", canvas.width/2 - 90, canvas.height/2);
      if(level == 4) {
        ctx.fillText("You Win!", canvas.width/2 - 80, canvas.height/2 + 50);
      } else {
        ctx.fillText("You Lose", canvas.width/2 - 80, canvas.height/2 + 50);
      }
    } else {
      // Transform the coordinate system using
      // the camera position BEFORE rendering
      // objects in the world - that way they
      // can be rendered in WORLD cooridnates
      // but appear in SCREEN coordinates
      ctx.save();
      ctx.translate(-camera.x, -camera.y);
      renderWorld(elapsedTime, ctx);
      ctx.restore();
    }
    // Render the GUI without transforming the
    // coordinate system
    renderGUI(elapsedTime, ctx);
  }
}

function renderMaps(elapsedTime, ctx) {
  ctx.save();
  ctx.translate(0, -camera.y);
  tilemaps[0].render(ctx);
  ctx.restore();

  ctx.save();
  ctx.translate(0, -camera.y*.6);
  tilemaps[1].render(ctx);
  ctx.restore();

  ctx.save();
  ctx.translate(0, -camera.y*.2);
  tilemaps[2].render(ctx);
  ctx.restore();
}

/**
  * @function renderWorld
  * Renders the entities in the game world
  * IN WORLD COORDINATES
  * @param {DOMHighResTimeStamp} elapsedTime
  * @param {CanvasRenderingContext2D} ctx the context to render to
  */
function renderWorld(elapsedTime, ctx) {
    // Render the bullets
    player.bullets.forEach(function(bullet){bullet.render(elapsedTime, ctx);});

    // Render the player
    player.render(elapsedTime, ctx);

    // Render the enemies
    enemies.forEach(function(enemy) {
      enemy.render(camera, elapsedTime, ctx);
    });
}

function newEnemies(count) {
  for(var i = 0; i < count; i++) {
    enemies.push(new Enemy(
      {
        x: Math.floor(Math.random() * (canvas.width-240))+ 20,
        y: Math.floor(Math.random() * 1000) + 10
      },
      canvas
    ));

    enemies.push(new Enemy2(
      {
        x: Math.floor(Math.random() * (canvas.width-240))+ 20,
        y: Math.floor(Math.random() * 1000) + 10
      },
      canvas
    ));

    enemies.push(new Enemy3(
      {
        x: Math.floor(Math.random() * (canvas.width-240))+ 20,
        y: Math.floor(Math.random() * 1000) + 10
      },
      canvas
    ));

    enemies.push(new Enemy4(
      {
        x: Math.floor(Math.random() * (canvas.width-240))+ 20,
        y: Math.floor(Math.random() * 1000) + 10
      },
      canvas
    ));

    enemies.push(new Enemy5(
      {
        x: Math.floor(Math.random() * (canvas.width-240))+ 20,
        y: Math.floor(Math.random() * 1000) + 10
      },
      canvas
    ));
  }
}

//check to see if bullet hit an enemy
function bulletCollsion(){
  for(var i = 0; i < enemies.length; i++) {
    for(var j = 0; j < player.bullets.length; j++) {
      if(!enemies[i].exploding) {
        if(player.bullets[j].position.x < (enemies[i].position.x + enemies[i].width) && player.bullets[j].position.x > enemies[i].position.x
          && player.bullets[j].position.y < (enemies[i].position.y + enemies[i].height) && player.bullets[j].position.y > enemies[i].position.y) {
            player.bullets.splice(j,1);
            enemies[i].exploding = true;
            player.score += 100;
            return;
        }
      }
    }
  }
  return;
}

//check to see if player got shot
function playerShot() {
  for(var i = 0; i < enemies.length; i++) {
    for(var j = 0; j < enemies[i].bullets.length; j++) {
      if(!enemies[i].exploding && !player.exploding) {
        if(enemies[i].bullets[j].position.x < (player.position.x + player.width) && enemies[i].bullets[j].position.x > player.position.x
          && enemies[i].bullets[j].position.y < (player.position.y + player.height) && enemies[i].bullets[j].position.y > player.position.y) {
            enemies[i].bullets.splice(j,1);
            health -= 10;
            if(health == 0) {
              lives --;
              if(lives == 0) {
                game.gameOver = true;
              } else {
                health = 100;
              }
              player.exploding = true;
              return;
            }
            return;
          }
      }
    }
  }
  return;
}

//check to see if player hit an enemy
function playerCollision() {
  for(var i = 0; i < enemies.length; i++) {
    if(!enemies[i].exploding) {
      if(player.position.x < (enemies[i].position.x + enemies[i].width) && player.position.x > enemies[i].position.x
        && player.position.y < (enemies[i].position.y + enemies[i].height) && player.position.y > enemies[i].position.y) {
          if(colliding == false) {
            colliding = true;
            health -= 10;
            collisionTime = 0;
            if(health == 0) {
              lives --;
              if(lives == 0) {
                game.gameOver = true;
              } else {
                health = 100;
              }
              player.exploding = true;
              return;
            }
            return;
          }
        }
    }
  }
  return;
}

//Summary of players performance
function performanceScreen(time, ctx) {
  pause = true;
  ctx.fillStyle = "black";
  ctx.fillRect(240, 154, 480, 308);
  ctx.fillStyle = "yellow";
  ctx.font = "bold 32px Arial";
  ctx.fillText("Performance", canvas.width/2 - 200, canvas.height/2 - 100);


  ctx.fillStyle = "green";
  ctx.font = "bold 32px Arial";
  ctx.fillText("Enemies killed:         " + enemiesKilled + "/" + enemyCount, canvas.width/2 - 300, canvas.height/2 - 30);
  ctx.fillText("Current health:         " + health + "%", canvas.width/2 - 297, canvas.height/2 + 30);
  ctx.fillText(" Current score:         " + player.score, canvas.width/2 - 297, canvas.height/2 + 90);
}

/**
  * @function renderGUI
  * Renders the game's GUI IN SCREEN COORDINATES
  * @param {DOMHighResTimeStamp} elapsedTime
  * @param {CanvasRenderingContext2D} ctx
  */
function renderGUI(elapsedTime, ctx) {
  // TODO: Render the GUI
  ctx.fillStyle = "yellow";
  ctx.font = "bold 32px Arial";
  ctx.fillText("Lives:", 1000, 100);

  var image = new Image();
  image.src = 'assets/tyrian.shp.007D3C.png';

  for(var i = 0; i < lives; i++) {
    ctx.save();
    ctx.drawImage(image, 48, 57, 23, 27, 1000 + i*24, 125, 23, 27);
    ctx.restore();
  }

  ctx.fillText("Score:", 1000, 300);
  ctx.fillStyle = "green";
  ctx.fillText(player.score, 1000, 340);

  ctx.fillStyle = "yellow";
  ctx.fillText("Health:", 1000, 480);

  ctx.fillStyle = "white";
  ctx.fillRect(1000, 500, 100, 20);

  ctx.fillStyle = "red";
  ctx.fillRect(1000, 500, health, 20);
}
