/* I referenced https://github.com/eamoh/frontend-nanodegree-arcade-game/blob/master/js/app.js
 * for Selector object. I aranged it so that it works in my code.
 */


// creating XSTEP for Player left and right movements and YSTEP for
// Player up and down movements. XSTEP is calculated as one-fifth of
// canvas width. YSTEP is set to 83 to reflect the same measurements in
// Engine.js.
var XSTEP = 101;
var YSTEP = 83;
var selectedChar;

// his array holds characters's image a player can select.
possibleChars = [
    'images/char-boy.png',
    'images/char-cat-girl.png',
    'images/char-horn-girl.png',
    'images/char-pink-girl.png',
    'images/char-princess-girl.png'
];

// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';

    this.x = -50;

    // Call the function that sets y rondomely.
    this.setY();

    // set the width and hedight for collision detection
    this.collisionWidth = 40;
    this.collisionHeight = 40;

    // Randomely set the speed
    this.speed = Math.random()*500;
    // Set the speed 100 at least
    if (this.speed < 100){
        this.speed = 100;
    };
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x = this.x + this.speed * dt;
    this.checkFrameOut();
};


// Rondomly set this.y from 3 options
Enemy.prototype.setY = function(){
    var selection = Math.random();
    if(selection < 0.33) {
        this.y = 50;
    }else if(selection >= 0.33 && selection < 0.66) {
        this.y = 130;
    }else{
        this.y = 220;
    };
};

// Reset positions when an enemy goes out of the frame.
Enemy.prototype.checkFrameOut= function(){
    if(this.x >= 500){
        // Reset this.x position
        this.x = -200;
        // Reset this.y position rondomely
        this.setY();
        // Reset speed (while keep 100 at minimum)
        this.speed = Math.random()*500;
        if (this.speed < 100){
            this.speed = 100;
        };
    };
};

/* Now write your own player class.
 * This class requires an update(), render() and a handleInput() method.
 */
var Player = function(){
    this.sprite = possibleChars[selectedChar];
    this.x = 200;
    this.y = 400;
    // set the width and hedight for collision detection
    this.collisionWidth = 40;
    this.collisionHeight = 40;
    // set a life count
    this.life = 3;
    // set a score
    this.score = 0;
};

// Draw a player image
Player.prototype.render = function(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Update a player's position
Player.prototype.update = function(){
    this.checkEnemyCollisions();
    this.checkGemCollisions();
    this.checkFrameOut();
    this.resetStatus();
};

// Reset values of scores and lives in HTML
Player.prototype.resetStatus = function(){
    // Redisplay the score value in HTML
    var scoreElement = document.getElementById("score");
    scoreElement.textContent = "Score: " + this.score;
    // console.log(scoreElement);

    // Redisplay the life value in HTML
    var lifeElement = document.getElementById("life");
    lifeElement.textContent = "Life: " + this.life;
    // console.log(lifeElement);
};

// Reset the position of the player
Player.prototype.reset= function(){
    this.x = 200;
    this.y = 400;
};

// Reset positions when an enemy goes out of the frame.
Player.prototype.checkFrameOut = function(){
    if(this.x < 0){
        this.x = 0;
    }else if(this.x > 400){
        this.x = 400;
    }else if(this.y < -10){
        this.y = 400;
        this.score += 50;
    }else if(this.y >400){
        this.y = 400;
    };
};

// Check the collision with enemies.
Player.prototype.checkEnemyCollisions = function() {
    for (var i = 0; i < allEnemies.length; i++) {
      if (allEnemies[i].x < this.x + this.collisionWidth &&
        allEnemies[i].x +  allEnemies[i].collisionWidth > this.x &&
        allEnemies[i].y < this.y + this.collisionHeight &&
        allEnemies[i].y + allEnemies[i].collisionHeight > this.y) {
        this.reset();
        this.life--;
        console.log(this.life);
        console.log("Collision!");
      };
    };
};

// Check the collision with gems.
Player.prototype.checkGemCollisions = function() {
    for (var i = 0; i < allGems.length; i++) {
      if (allGems[i].x < this.x + this.collisionWidth &&
        allGems[i].x +  allGems[i].collisionWidth > this.x &&
        allGems[i].y < this.y + this.collisionHeight &&
        allGems[i].y + allGems[i].collisionHeight > this.y) {
        allGems[i].setPosRandom();
        allGems[i].setImgRandom();
        this.score += 100;
        console.log("You get Scores!");
      };
    };
};

Player.prototype.handleInput = function(keys){
    // step is the interval which a player moves over
    var step = 90;
    switch(keys){
        case 'left':
            this.x -= step;
            break;
        case 'up':
            this.y -= step;
            break;
        case 'right':
            this.x += step;
            break;
        case 'down':
            this.y += step;
            break;
    }
};

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        13: 'enter'
    };

    player.handleInput(allowedKeys[e.keyCode]);
    selector.handleInput(allowedKeys[e.keyCode]);
});

// Gem Class
var Gem = function(){
    this.setPosRandom();
    this.sprite = 'images/Gem Blue.png';
    this.collisionWidth = 50;
    this.collisionHeight = 50;
}

// Set gem's position randomly
Gem.prototype.setPosRandom = function(){
    // Set the value of this.x from 5 patterns
    var factorX = Math.random();
    if(factorX < 0.2){
        this.x = 0;
    }else if(factorX >= 0.2 && factorX < 0.4){
        this.x = 100;
    }else if(factorX >= 0.4 && factorX < 0.6){
        this.x = 200;
    }else if(factorX >= 0.6 && factorX < 0.8){
        this.x = 300;
    }else{
        this.x = 400;
    };

    // Set the value of this.y from 3 patterns
    var factorY = Math.random()
    if(factorY < 0.33){
        this.y = 50;
    }else if(factorY >= 0.33 && factorY < 0.66){
        this.y = 130;
    }else{
        this.y =220;
    };
};

// Set gem's image randomely
Gem.prototype.setImgRandom = function(){
    var factor = Math.random();
    if(factor < 0.33) {
        this.sprite = 'images/Gem Blue.png';
    }else if(factor >= 0.33 && factor < 0.66) {
        this.sprite = 'images/Gem Green.png';
    }else {
        this.sprite ='images/Gem Orange.png';
    };
}

// Draw gem's image
Gem.prototype.render = function(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Creates Selector object that is used to select player
var Selector = function() {
  this.sprite = 'images/Selector.png';
  this.x = 0;
  this.y = YSTEP + 220;
};

// receives user input and moves the Selector according to that input
Selector.prototype.handleInput = function(key) {
    // Moves the Selector while ensuring the Selector cannot move outside
    // the range of the options shown
    if(!gamePlaying){
        switch (key) {
            case 'left':
                if (this.x > 0) {
                this.x -= XSTEP;
                }
                break;
            case 'right':
                if (this.x < 401) {
                this.x += XSTEP;
                }
                break;
            case 'up':
                if (this.y > 133) {
                this.y -= YSTEP;
                }
                break;
            case 'down':
                if (this.y < 133) {
                this.y += YSTEP;
                }
                break;
            case 'enter':
                selectedChar = this.x / XSTEP;
                gamePlaying = true;
                console.log("gamePlaying is set to true");
                gameReset();
                console.log(player.sprite);
                //ctx.clearRect(0,0,ctx.width,ctx.hedight);
                break;
            default:
                break;
        };
    };
};

// Draw the Selector on the screen
Selector.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Reset enemies and a player
function gameReset() {
    // reset enemies
    allEnemies = [];
    maxEnemy = 5;
    for (var i = 0; i < maxEnemy; i++) {
        allEnemies.push(new Enemy());
    };
    // reset player
    player = new Player();
    player.sprite = possibleChars[selectedChar];
    player.resetStatus();
};


// Instanciate objects to start the game.

// Instanciate a player object and enemy objects
gameReset()

// Instanciate the Gem object
var gem1 = new Gem();
var allGems = [gem1];

// Instanciate the Selecter
var selector = new Selector();




