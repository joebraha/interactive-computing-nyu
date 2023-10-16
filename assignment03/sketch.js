let waterImage;
let boatImage;
let boulderImage;
let treasureImage;
let treasureSound;
let boat;
let boulders;
let treasures;
let backgrnd;
let waterSpeed = 1;

let highscores = {
    easy: 0,
    medium: 0,
    hard: 0
}

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
    waterImage = loadImage('./assets/water_background_better.jpg');
    waterImage_flipped = loadImage('./assets/water_background_better_flipped.png');
    boatImage = loadImage('./assets/boatImage.png');
    boatImageLeft = loadImage('./assets/boatImageLeft.png');
    boatImageRight = loadImage('./assets/boatImageRight.png');
    boulderImage = loadImage('./assets/boulderImage.png');
    treasureImage = loadImage('./assets/treasureImage.png');    
    treasureSound = loadSound('./assets/treasureSound.mp3');
}

function setup() {
    c = createCanvas(500, 500);
    c.parent('#canvas-container');
    
    background(0);
    imageMode(CENTER);
    fill('white');
    textSize(30);

    // holds the selector DOM object to get difficulty info
    selector = document.getElementById("difficulty");

    // using += to avoid null value on initial load
    highscores.easy += Number(window.localStorage.getItem('highscore_easy'));
    highscores.medium += Number(window.localStorage.getItem('highscore_medium'));
    highscores.hard += Number(window.localStorage.getItem('highscore_hard'));
    
    boat = new Boat(245);
    boulders = new Boulders(boat);
    treasures = new Treasures(boat);
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
    text("Welcome! Select game mode below", 10, 100);
    text("to continue.", 200, 130);

    text("High Scores:", 10, 190);
    text("Easy", 10, 230);
    text(highscores.easy, 200, 230);
    text("Medium", 10, 260);
    text(highscores.medium, 200, 260);
    text("Hard", 10, 290);
    text(highscores.hard, 200, 290);
}

function gameOver() {
    text("Game Over :(", 100, 200);
}

function game() {
    backgrnd.act();
    boat.act();
    boulders.act();
    treasures.act();
}

function updateHighscores(score, speed) {
    // saves the score to whichever difficulty mode is used
    switch ( speed ) {
        case 1:
            if ( score > highscores.easy ) {
                highscores.easy = score;
            }
            break;
        case 3:
            if ( score > highscores.medium ) {
                highscores.medium = score;
            }
            break;
        case 5:
            if ( score > highscores.hard ) {
                highscores.hard = score;
            }
    }

    // write to local storage after every game
    window.localStorage.setItem('highscore_easy', highscores.easy);
    window.localStorage.setItem('highscore_medium', highscores.medium);
    window.localStorage.setItem('highscore_hard', highscores.hard);
}

function buttonClicked(button) {
    state++;
    if ( state == 3 ) {
        state = 0;
    }

    button.innerHTML = buttonStates[state];

    if (state == 1) {
        // new game, set difficulty and add more boulders
        waterSpeed = Number(selector.value);
        if ( waterSpeed > 1 ) {
            boulders.add();
        }
        if ( waterSpeed > 3 ) {
            boulders.add();
        }
    }
    if ( state == 2 ) {
        // end game, refresh boulders and update highscores
        boulders = new Boulders(boat);
        updateHighscores(boat.score, waterSpeed);
        this.score = 0;
    }
}

// boat class to handle user controlled character
class Boat {
    constructor(x) {
        this.x = x;
        this.y = 390;
        this.image = boatImage;
        this.score = 0;
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

        // don't go off the map
        this.x = constrain(this.x, 5, 495);

        image(this.image, this.x, this.y);
    }

    getHit() {
        // boulder will call this func to trigger game end
        state++;
        boulders = new Boulders(this);
        updateHighscores(this.score, waterSpeed);
        this.score = 0;
        document.getElementById("startButton").textContent = "New Game";
    }

    collectTreasure() {
        this.score += 1;
    }
}

// container class to hold array of Boulders
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
        this.array.push(new Boulder(random(-50, -450)));
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

// container class to hold treasures that user will try to get
class Treasures {
    constructor(user) {
        this.array = [new Treasure(-20), new Treasure(-200)];
        this.user = user;
    }

    act() {
        this.array.forEach(t => {
            t.act();
            t.detect(this.user);
        });
    }

    add() {
        this.array.push(new Treasure(random(50, 450)));
    }

}

class Treasure {
    constructor(y) {
        this.y = y;
        this.x = random(500);
        this.image = treasureImage;
        this.frame = 0;
        this.collectSound = treasureSound;
        this.hitbox = 30;
        this.frameDuration = 0;
    }

    act() {
        this.y += waterSpeed;

        // animation of sprite
        image(this.image, this.x, this.y, 48, 32, this.frame*48, 0, 48, 32);
        this.frameDuration += 1;
        if ( this.frameDuration >= 10 ) {
            this.frame += 1;
            this.frame = this.frame % 5;
            this.frameDuration = 0;
        }

        if ( this.y > 550 ) {
            this.y -= 650;
            this.x = random(500);
        }
    }

    detect(user) {
        if ( dist(this.x, this.y, user.x, user.y ) <= this.hitbox ) {
            user.collectTreasure();
            this.collectSound.play();
            this.y -= 650;
            this.x = random(500);
        }
    }
}

// class to control the dynamic infinite background
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