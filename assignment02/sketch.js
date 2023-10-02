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
let treasure1maxSpeed;
let treasure2maxSpeed;
let treasure1angle = 0;
let treasure2angle = 0;
let background1Y = 0;
let background2Y = -1000;
let foreground1Y = 0;
let foreground2Y = -1000;
let hue = 0;

function setup() {
    let c = createCanvas(500, 500);
    c.parent('#canvas-container');
    background(0);

    treasure1X = -50;
    treasure1Y = random(100, 400);
    treasure1speed = random(3, 10);
    treasure1maxSpeed = random(-2, 2);
    treasure2X = 500;
    treasure2Y = random(100, 400);
    treasure2speed = random(3, 10);
    treasure2maxSpeed = random(-2, 2);
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
    image(bckgrnd, 0, background1Y);
    image(bckgrnd, 0, background2Y);
    image(foreground, 0, foreground1Y);
    image(foreground, 0, foreground2Y);

    background1Y += .25;
    background2Y += .25;
    foreground1Y += .5;
    foreground2Y += .5;

    if(background1Y > 1000) {
        background1Y = -1000;
    }
    if(background2Y > 1000) {
        background2Y = -1000;
    }
    if(foreground1Y > 1000) {
        foreground1Y = -1000;
    }
    if(foreground2Y > 1000) {
        foreground2Y = -1000;
    }




    colorMode(RGB);

    // walls
    fill(128);
    noStroke();
    rect(0, 0, 500, 10);
    rect(0, 0, 10, 500);
    rect(490, 0, 10, 500);

    // paddle
    fill(255, 0, 0);
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
    colorMode(HSB);
    fill(hue, 100, 100);
    hue += .25;
    if(hue > 360) {
        hue = 0;
    }
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
        if(ballX > rectX-10 && ballX < rectX + 110) { // buffer given to rect hitbox
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
        treasure1maxSpeed = random(-2, 2);
    }
    if ( treasure2X < -50 ) {
        treasure2X = 500;
        treasure2Y = random(100, 400);
        treasure2speed = random(3, 10);
        treasure2maxSpeed = random(-2, 2);
    }

    push();
    translate(treasure1X, treasure1Y);
    rotate(treasure1angle);
    treasure1angle += 0.01;
    image(treasure, 0, 0);
    pop();

    push();
    translate(treasure2X, treasure2Y);
    rotate(treasure2angle);
    treasure2angle += 0.01;
    image(treasure, 0, 0);
    pop();


    treasure1X += treasure1speed;
    treasure2X -= treasure2speed;

    treasure1Y += map(treasure1X, 0, 500, 0, treasure1maxSpeed);
    treasure2Y += map(treasure2X, 500, 0, 0, treasure2maxSpeed);

    if ( dist(ballX, ballY, treasure1X, treasure1Y) < 40 ) {
        treasure1X = -50;
        treasure1Y = random(100, 400);
        treasure1speed = random(3, 10);
        treasure1maxSpeed = random(-2, 2);
        if(inPlay) {
            count += 1;
            collect.play();
        }
    }
    if ( dist(ballX, ballY, treasure2X, treasure2Y) < 40 ) {
        treasure2X = 500;
        treasure2Y = random(100, 400);
        treasure2speed = random(3, 10);
        treasure2maxSpeed = random(-2, 2);
        if(inPlay) {
            count += 1;
            collect.play();
        }
    }

    fill('white');
    textSize(30);
    text("Score: " + count, 10, 33);

    if(!inPlay) {
        fill('white');
        textSize(30);
        text("Click the mouse to Start!", 90, 250);
    }
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

function bouncePaddle() {
    // chose to have it add to the speed instead of 'rsset' the speed
    // because I thought it fit the game flow better.
    let distance = abs(ballX - (rectX + 50));
    if (speedX > 0) {
        speedX += map(distance, 0, 50, 1, 5);
    }
    else {
        speedX -= map(distance, 0, 50, 1, 5);
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