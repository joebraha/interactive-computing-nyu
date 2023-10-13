let waterImage;
let treasureImage;
let boatImage;
let boulderImage;
let boat;
let boulders;
let backgrnd;
let waterSpeed = 1;

// TODO: implement saving
let highscore;

/* states:
0 - start menu
1 - playing
2 - game over
*/
let state = 0;
buttonStates = {
    0: "Start!",
    1: "End game",
    2: "New Game"
}
let selector;


function preload() {
    // waterImage = loadImage('assets/waterImage.jpeg');
    // waterImage_flipped = loadImage('assets/waterImage_flipped.jpeg');
    waterImage = loadImage('assets/water_background_better.jpg');
    waterImage_flipped = loadImage('assets/water_background_better_flipped.png');
    // treasureImage = loadImage('assets/treasureIma.jpg');
    boatImage = loadImage('assets/boatImage.png');
    boatImageLeft = loadImage('assets/boatImageLeft.png');
    boatImageRight = loadImage('assets/boatImageRight.png');
    boulderImage = loadImage('assets/boulderImage.png');
}

function setup() {
    c = createCanvas(500, 500);
    c.parent('#canvas-container');
    background(0);
    selector = document.getElementById("difficulty");
    
    imageMode(CENTER);

    boat = new Boat(245);
    boulders = new Boulders(boat);
    backgrnd = new Background();

}

function draw() {
    background(0);

    if ( state == 0 ) {
        startMenu();
    }
    else if ( state == 1 ) {
        game();
    }
    else {
        gameOver();
    }

}

function startMenu() {
    fill('white');
    textSize(30);
    text("Welcome! Select game mode below", 10, 100);
    text("to continue.", 200, 130)
}

function gameOver() {
    text("Game Over :(", 100, 200);
}

function game() {
    backgrnd.act();
    boat.act();
    boulders.act();
}


function buttonClicked(button) {
    state++;
    if ( state == 3 ) {
        state = 0;
    }
    button.innerHTML = buttonStates[state];

    if (state == 1) {
        waterSpeed = Number(selector.value);
        if ( waterSpeed > 1 ) {
            boulders.add();
        }
        if ( waterSpeed > 3 ) {
            boulders.add();
        }
    }
    if ( state == 2 ) {
        boulders = new Boulders(boat);
    }
}

// function changeSelection(event) {
//     waterSpeed = Number(event.value);
// }

// draws a tiled infinitely scrolling background of water
function drawBackground() {
    image(waterImage, 250, 250);
}

class Boat {
    constructor(x) {
        this.x = x;
        this.y = 390;
        this.image = boatImage;
        this.health = 3;
    }

    act() {
        if(keyIsDown(LEFT_ARROW)) {
            this.x -= 5;
            this.image = boatImageLeft;
        }
        else if(keyIsDown(RIGHT_ARROW)) {
            this.x += 5;
            this.image = boatImageRight;
        }
        else {
            this.image = boatImage;
        }

        this.x = constrain(this.x, 5, 495);

        image(this.image, this.x, this.y);
    }

    getHit() {
        state++;
        boulders = new Boulders(this);
        // boulders.add();
    }
}

class Boulders {
    constructor(user) {
        this.array = [new Boulder(-20), new Boulder(-200), new Boulder(-380)];
        this.user = user;
    }

    act() {
        this.array.forEach(b => {
            b.act();
            b.detect(this.user);
        });
    }

    add() {
        this.array.push(new Boulder(random(50, 450)));
    }
}

class Boulder {
    constructor(y) {
        this.x = random(50, 450);
        this.y = y;
        this.image = boulderImage;
        this.hitbox = 60;
    }

    act() {
        this.y += waterSpeed;
        image(this.image, this.x, this.y);

        if ( this.y > 550 ) {
            this.y -= 650;
            this.x = random(500);
        }
    }

    detect(user) {
        if ( dist(this.x, this.y, user.x, user.y ) <= this.hitbox ) {
            user.getHit();
        }
    }
}

class Background {
    constructor() {
        this.image1 = waterImage;
        this.image2 = waterImage_flipped
        this.x = 250;
        this.y1 = 250;
        this.y2 = -500;
    }

    act() {
        this.y1 += waterSpeed;
        this.y2 += waterSpeed;
        image(this.image1, this.x, this.y1);
        image(this.image2, this.x, this.y2);

        if ( this.y1 >= 500+750/2 ) {
            this.y1 -= 1500;
        }        
        if ( this.y2 >= 500+750/2 ) {
            this.y2 -= 1500;
        }
    }
}