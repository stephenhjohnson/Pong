/******************************************************************************/
//                                  Constants
/******************************************************************************/
const WIDTH                 = 500;
const HEIGHT                = 500;
const BALLWIDTH             = 5;
const RECTWIDTH             = 10;
const RECTHEIGHT            = 100;
const VELOCITYMULTIPLYIER   = 1.0005;
const STARTMAXVELX          = 4;
const STARTMINVELX          = 2;
const STARTMAXVELY          = 1;
const STARTMAXVEL           = 1.5;
const MAXRECTVEL            = 2;

let ball, p1, p2;
let p1Points = 0;
let p2Points = 0;


/******************************************************************************/
//                                 Ball class
/******************************************************************************/
function Ball() {
  this.position = createVector();
  this.velocity = createVector();
  this.target = 0;
  this.reset();
}

Ball.prototype.reset = function() {
  this.position.set(WIDTH/2, HEIGHT/2);
  let velX;
  //if no target sellected randomly select a target
  if(this.target === 0) {
    this.target = round(random(1, 2));
  }
  if(this.target === 1) {
    velX = random(-STARTMAXVELX, -STARTMINVELX);
  } else if(this.target === 2) {
    velX = random(STARTMINVELX, STARTMAXVELX);
  }
  this.velocity.set(velX, random(-STARTMAXVELY, STARTMAXVELY));
  this.velocity.setMag(STARTMAXVEL);
}

Ball.prototype.draw = function() {
  fill(0);
  square(this.position.x, this.position.y, BALLWIDTH);
}

Ball.prototype.update = function() {
  this.position.add(this.velocity);
  this.velocity.mult(VELOCITYMULTIPLYIER);
  this.limit();
}

Ball.prototype.limit = function() {
  if(this.position.y + BALLWIDTH/2 >= HEIGHT || this.position.y - BALLWIDTH/2 <= 0) {
    this.velocity.y *= -1;
  }
  if(this.position.x + BALLWIDTH/2 >= WIDTH) {
    ++p1Points;
    this.target = 1;
    this.reset();
  }
  if(this.position.x - BALLWIDTH/2 <= 0) {
    ++p2Points;
    this.target = 2;
    this.reset();
  }
}

Ball.prototype.collide = function(wall) {
  if(this.position.x - BALLWIDTH/2 <= wall.position.x + RECTWIDTH/2 && wall === p1) {
    if(this.position.y + BALLWIDTH/2 >= wall.position.y - RECTHEIGHT/2 && this.position.y - BALLWIDTH/2 <= wall.position.y + RECTHEIGHT/2) {
      this.velocity.x *= -1;
    }
  }
  if(this.position.x + BALLWIDTH/2 >= wall.position.x - RECTWIDTH/2 && wall === p2) {
    if(this.position.y + BALLWIDTH/2 >= wall.position.y - RECTHEIGHT/2 && this.position.y - BALLWIDTH/2 <= wall.position.y + RECTHEIGHT/2) {
      this.velocity.x *= -1;
    }
  }
}


/******************************************************************************/
//                                 Wall class
/******************************************************************************/
function Wall(newX) {
  this.position = createVector(newX, HEIGHT/2);
  this.velocity = createVector();
}

Wall.prototype.draw = function() {
  fill(0);
  rect(this.position.x, this.position.y, RECTWIDTH, RECTHEIGHT);
}

Wall.prototype.update = function() {
  this.limit();
  this.position.add(this.velocity);
}

Wall.prototype.limit = function() {
  if(this.position.y - RECTHEIGHT/2 <= 5 && this.velocity.y === -MAXRECTVEL) {
    this.velocity.set(0, 0);
  } else if(this.position.y + RECTHEIGHT/2 >= HEIGHT - 5 && this.velocity.y === MAXRECTVEL) {
    this.velocity.set(0, 0);
  }
}

Wall.prototype.upButtonPressed = function() {
  this.velocity.set(0, -MAXRECTVEL);
}

Wall.prototype.downButtonPressed = function() {
  this.velocity.set(0, MAXRECTVEL);
}


/******************************************************************************/
//                                  Main Loop
/******************************************************************************/
function setup() {
  let canvas = createCanvas(WIDTH, HEIGHT);
  canvas.parent('canvas');
  rectMode(CENTER);
  ball = new Ball();
  p1 = new Wall(RECTWIDTH);
  p2 = new Wall(WIDTH - RECTWIDTH);
}

function draw() {
  background(255);
  line(WIDTH/2, HEIGHT, WIDTH/2, 0);
  line(0, 0, WIDTH, 0);
  line(WIDTH-1, HEIGHT, WIDTH-1, 0);
  line(WIDTH-1, HEIGHT-1, 0, HEIGHT-1);
  line(0, 0, 0, HEIGHT);
  text(p1Points, 30, 30);
  text(p2Points, WIDTH - 30, 30);
  ball.draw();
  ball.collide(p1);
  ball.collide(p2);
  ball.update();
  p1.update();
  p2.update();
  p1.draw();
  p2.draw();
}


/******************************************************************************/
//                             Event Listeners
/******************************************************************************/
document.addEventListener('keydown', function(event) {
  //up arrow
  if(event.keyCode === 38) {
    p2.upButtonPressed();
    // console.log("Up was pressed");
  }//down arrow
  else if(event.keyCode === 40) {
    p2.downButtonPressed();
    // console.log("Down was pressed");
  }//w key
  else if(event.keyCode === 87) {
    p1.upButtonPressed();
    // console.log("w was pressed");
  }//s key
  else if(event.keyCode === 83) {
    p1.downButtonPressed();
    // console.log("s was pressed");
  }
});
