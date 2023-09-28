let rectX = 200;
let ballX = 250;
let ballY = 30;
let speedX = 0;
let speedY = 0;
let bckgrnd;
let treasure;
let foreground;
let boing;
let collect;
let loss;
let inPlay = false;
let count = 0;
let treasure1X;
let treasure1Y;
let treasure1speed;
let treasure2X;
let treasure2Y;
let treasure2speed;

function setup() {
    let c = createCanvas(500, 500);
    c.parent('#canvas-container');
    background(0);

    treasure1X = -50;
    treasure1Y = random(100, 400);
    treasure1speed = random(3, 10);
    treasure2X = 500;
    treasure2Y = random(100, 400);
    treasure2speed = random(3, 10);
}

function preload() {
    bckgrnd = loadImage('images/background.png');
    treasure = loadImage('images/treasure.png');
    foreground = loadImage('images/foreground.png');


    boing = loadSound('sounds/boing.mp3');
    collect = loadSound('sounds/collect.mp3');
    loss = loadSound('sounds/loss.mp3');
}

function draw() {
    // TODO: make these move
    image(bckgrnd, 0, 0);
    image(foreground, 0, 0);


    // walls
    fill(128);
    noStroke();
    rect(0, 0, 500, 10);
    rect(0, 0, 10, 500);
    rect(490, 0, 10, 500);

    // paddle
    fill(100, 0, 0);
    rect(rectX, 490, 100, 100); 
    if(keyIsDown(65)) {
        rectX -= 10;
    }
    if(keyIsDown(68)) {
        rectX += 10;
    }
    if(rectX < 10) {
        rectX = 10;
    }
    if(rectX > 390) {
        rectX = 390;
    }

    // ball
    fill('yellow');
    ellipse(ballX, ballY, 40, 40);

    ballX += speedX;
    ballY += speedY;

    if(ballX > 470) {
        ballX = 470;
        speedX = -1.05*speedX;
        speedY = 1.05*speedY;
    }
    if(ballX < 30) {
        ballX = 30;
        speedX = -1.05*speedX;
        speedY = 1.05*speedY;
    }
    if(ballY > 470) {
        if(ballX > rectX && ballX < rectX + 100) {
            ballY = 470;
            speedY = -1.05*speedY;
            bouncePaddle();
            boing.play();
        }
        else {
            restartGame();
        }
    }
    if(ballY < 30) {
        ballY = 30;
        speedY = -1.05*speedY;
        speedX = 1.05*speedX;
    }

    // treasures
    if ( treasure1X > 500 ) {
        treasure1X = -50;
        treasure1Y = random(100, 400);
        treasure1speed = random(3, 10);
    }
    if ( treasure2X < -50 ) {
        treasure2X = 500;
        treasure2Y = random(100, 400);
        treasure2speed = random(3, 10);
    }

    image(treasure, treasure1X, treasure1Y);
    image(treasure, treasure2X, treasure2Y);

    treasure1X += treasure1speed;
    treasure2X -= treasure2speed;

    line(ballX, ballY, treasure1X, treasure1Y);
    if ( dist(ballX, ballY, treasure1X, treasure1Y) < 40 ) {
        treasure1X = -50;
        treasure1Y = random(100, 400);
        treasure1speed = random(3, 10);
        count += 1;
        collect.play();
    }
    if ( dist(ballX, ballY, treasure2X, treasure2Y) < 40 ) {
        treasure2X = 500;
        treasure2Y = random(100, 400);
        treasure2speed = random(3, 10);
        count += 1;
        collect.play();
    }

    fill('white');
    textSize(30);
    text("Score: " + count, 10, 30);
}

function restartGame() {
    ballX = 250;
    ballY = 30;
    speedX = 0;
    speedY = 0;
    loss.play();
    inPlay = false;
    count = 0;
}

function bouncePaddle() { // TODO: this
    if(speedX > 0) {
        speedX += 1;
    }
    else {
        speedX -= 1;
    }
}

function mousePressed() {
    if(!inPlay) {
        // initial ball speeds
        if (random(1) < 0.5) {
            speedX = random(-5, -1);
        }
        else {
            speedX = random(1, 5);
        }

        if (random(1) < 0.5) {
            speedY = random(-5, -1);
        }
        else {
            speedY = random(1, 5);
        }
        inPlay = true;
    }
}