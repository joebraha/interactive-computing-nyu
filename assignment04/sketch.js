let arrowImages = [];
let gridsize = 7; // num of arrows
let gridunit;
let arrows; // creates an empty 2d array of gridsize
let robots = [];

class Arrow {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.dir = random([0, 1, 2, 3]);
  }

  display() {
    image(arrowImages[this.dir], this.x, this.y);
  }

  checkClick() {
    if ( mouseIsPressed && abs(mouseX-this.x) <= 25 && abs(mouseY-this.y) <= 25 ) {
      this.dir += 1;
      this.dir %= 4;
    }
  }
}

class Robot {
  constructor(x, y, dir) {
    this.x = x;
    this.y = y;
    this.headColor = color(random(255), random(255), random(255));
    this.bodyColor = color(random(255), random(255), random(255));
    this.headSize = random(25, 50);
    this.bodySize = random(this.headSize, this.headSize+15);
    this.eyes = random(1);

    this.dir = dir;
    this.glow = 100;
    this.glowDir = 5;

  }

  display() {
    let x = this.x;
    let y = this.y;
    let xOffset = ( this.bodySize - this.headSize ) / 2;

    // yellow thing
    let midpoint = {x:0, y:0, d:0};
    switch (this.dir){
    case "right":
        midpoint.x = x-xOffset;
        midpoint.y = y+this.headSize+this.bodySize/2;
        midpoint.d = this.bodySize/2;
        break;
    case "left":
        midpoint.x = x+this.headSize+xOffset;
        midpoint.y = y+this.headSize+this.bodySize/2;
        midpoint.d = this.bodySize/2;
        break;
    case "up":
        midpoint.x = x+this.headSize/2;
        midpoint.y = y+this.headSize+this.bodySize;
        midpoint.d = this.headSize/2;
        break;
    case "down":
        midpoint.x = x+this.headSize/2;
        midpoint.y = y+this.headSize+this.bodySize;
        midpoint.d = this.headSize/2;
        break;
    }    

    this.glow += this.glowDir;
    if ( this.glow >= 250 || this.glow <= 100) {
        this.glowDir *= -1;;
    }

    fill(255, 255, 0, this.glow);
    ellipse(midpoint.x, midpoint.y, midpoint.d);


    // the Robot

    fill(this.headColor);
    rect(x, y, this.headSize, this.headSize);
    
    fill(this.bodyColor);
    rect(x-xOffset, y+this.headSize, this.bodySize, this.bodySize);


    fill('white');
    let eyesOffset = this.headSize * 0.1;
    let eyesHeight = this.headSize * 0.3;
    if ( this.eyes > 0.5 ) {
      rect(x+eyesOffset, y+eyesOffset, this.headSize-2*eyesOffset, eyesHeight);
    }
    else {
      rect(x+eyesOffset, y+eyesOffset, eyesOffset, eyesHeight);
      rect(x+this.headSize-2*eyesOffset, y+eyesOffset, eyesOffset, eyesHeight);
    }
  }

  move() {
    switch (this.dir){
    case "right":
        this.x += 1;
        break;
    case "left":
        this.x -= 1;
        break;
    case "up":
        this.y -= 1;
        break;
    case "down":
        this.y += 1;
        break;
    }
    let touching = this.touchingArrow();
    if ( touching < 4 ) {
      switch (touching){
        case 0:
            this.dir = "up";
            break;
        case 1:
            this.dir = "right";
            break;
        case 2:
            this.dir = "down";
            break;
        case 3:
            this.dir = "left";
            break;
      }
    }
  }

  touchingArrow() {
    for ( let i = 0; i < gridsize; i++ ) {
      for ( let j = 0; j < gridsize; j++ ) {
        if ( dist( this.x+this.headSize/2, this.y+this.headSize+this.bodySize/2, arrows[i][j].x, arrows[i][j].y ) <= 25) {
          return arrows[i][j].dir;
        }
      };
    };
      return 4;
  }

  outOfRange() {
    if ( this.x > width+25 && this.dir != "left") {
      return true;
    }
    else if ( this.x < 0 && this.dir != "right") {
      return true;
    }
    else if ( this.y > height+5 && this.dir != "up") {
      return true;
    }
    else if ( this.y < -70 && this.dir == "right") {
      return true;
    }
  }

}

function preload() {
  arrowImages.push(loadImage("images/arrow_up.png"));
  arrowImages.push(loadImage("images/arrow_right.png"));
  arrowImages.push(loadImage("images/arrow_down.png"));
  arrowImages.push(loadImage("images/arrow_left.png"));
}

function setup() {
    let c = createCanvas(800,600);
    c.parent('#canvas-container');
    noStroke();
    imageMode(CENTER);
    background(100);

    gridunit = {x: width/gridsize, y: height/gridsize};
    arrows = new Array(gridsize);


    for ( let i = 0; i < gridsize; i++ ) {
        arrows[i] = [];
        for ( let j = 0; j < gridsize; j++ ) {
            arrows[i].push(new Arrow(gridunit.x/2 + i*gridunit.x, gridunit.y/2 + j*gridunit.y));
        }
    }
    robots.push(new Robot(-50, height/2-50, "right"));
}

function draw() {
    background(100);

    for ( let i = 0; i < gridsize; i++ ) {
      for ( let j = 0; j < gridsize; j++ ) {
            arrows[i][j].display();
        }
    }

    for ( let i = 0; i < robots.length; i++ ) {
        robots[i].move();
        robots[i].display();
        if ( robots[i].outOfRange() ) {
          robots.splice(i, 1);
          i--;
        }
    }

    if (frameCount % 100 == 0) {
      robots.push(new Robot(-50, height/2-50, "right"));
    }

}

function mousePressed() {
  for ( let i = 0; i < gridsize; i++ ) {
    for ( let j = 0; j < gridsize; j++ ) {
      arrows[i][j].checkClick();
    }
  }
}
